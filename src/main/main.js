const { installSafeConsole } = require('./safe-console')

installSafeConsole()

const fs = require('fs')
const path = require('path')
const { app, BrowserWindow, ipcMain, screen, shell } = require('electron')

const { createAppUpdater } = require('./app-updater')
const { getPlaybackStats, incrementLocalPlayCount, writeCloudPlayCounts } = require('./playback-store')
const { readPreferences, writePreferences } = require('./preferences-store')
const { clearSession, getUserDataFilePath, readSession, writeSession } = require('./session-store')
const { NeteaseService } = require('./netease-service')
const {
  WINDOW_DEFAULT_MIN_HEIGHT,
  WINDOW_DEFAULT_MIN_WIDTH,
  areWindowStatesEqual,
  getDefaultWindowState,
  needsWindowStateCorrection,
  normalizeWindowState,
  resolveWindowState,
} = require('./window-state')
const { buildWindowsTaskbarDetails } = require('./windows-taskbar')

const HYDRATE_CONCURRENCY = 5
const PLAYLIST_UNDO_NOTICE_MS = 20000
const WINDOW_STATE_SAVE_DELAY_MS = 250
const PLAYLIST_TRACK_BATCH_SIZE = 100
const WINDOWS_APP_ID = 'com.maouzju.playlistwall'
const WINDOWS_ICON_PATH = path.join(__dirname, '../../assets/icon.ico')

const TEXT = {
  windowTitle: '\u6b4c\u5355\u5899',
  loadingSession: '\u6b63\u5728\u8f7d\u5165\u767b\u5f55\u6001...',
  loadingAccount: '\u6b63\u5728\u8bfb\u53d6\u8d26\u53f7\u4fe1\u606f...',
  loadingPlaylists: '\u6b63\u5728\u83b7\u53d6\u5168\u90e8\u6b4c\u5355...',
  loadingCacheFallback: '\u5b9e\u65f6\u6b4c\u5355\u83b7\u53d6\u5931\u8d25\uff0c\u6b63\u5728\u56de\u9000\u5230\u7f13\u5b58...',
  loadingBootstrapReady: '\u6b4c\u5355\u5899\u5df2\u6253\u5f00\uff0c\u6b63\u5728\u7ee7\u7eed\u5c55\u5f00...',
  loadingHydrate: '\u6b63\u5728\u540e\u53f0\u5c55\u5f00\u6b4c\u5355',
  ready: '\u5df2\u5c31\u7eea',
  accountMissing: '\u65e0\u6cd5\u8bc6\u522b\u7f51\u6613\u4e91\u8d26\u53f7\uff0c\u8bf7\u91cd\u65b0\u767b\u5f55\u3002',
  playlistsMissing: '\u5f53\u524d\u8d26\u53f7\u6ca1\u6709\u53ef\u7528\u6b4c\u5355\uff0c\u8bf7\u91cd\u65b0\u767b\u5f55\u6216\u7a0d\u540e\u518d\u8bd5\u3002',
  serviceNotReady: '\u670d\u52a1\u5c1a\u672a\u51c6\u5907\u5b8c\u6210',
  privatePlaylist: '\u8be5\u6b4c\u5355\u662f\u79c1\u5bc6\u6b4c\u5355\uff0c\u6682\u65f6\u65e0\u6cd5\u5c55\u5f00\u3002',
  playlistUnavailable: '\u8be5\u6b4c\u5355\u6682\u65f6\u65e0\u6cd5\u5c55\u5f00\u3002',
  partialPlaylistUnavailable: '\u5269\u4f59\u66f2\u76ee\u6682\u65f6\u65e0\u6cd5\u5c55\u5f00\u3002',
  createOwnedPlaylistFailed: '\u65b0\u5efa\u6b4c\u5355\u5931\u8d25',
  updateOwnedPlaylistFailed: '\u7f16\u8f91\u6b4c\u5355\u5931\u8d25',
  deleteOwnedPlaylistFailed: '\u5220\u9664\u81ea\u5efa\u6b4c\u5355\u5931\u8d25',
  removeSubscribedPlaylistFailed: '\u5220\u9664\u6536\u85cf\u6b4c\u5355\u5931\u8d25',
  restoreSubscribedPlaylistFailed: '\u64a4\u9500\u5220\u9664\u6b4c\u5355\u5931\u8d25',
}

let win = null
let svc = null
let hydrationRunId = 0
let flushingPendingSubscribedPlaylistRemovals = false
const pendingSubscribedPlaylistRemovals = new Map()
let mainProcessDiagnosticsRegistered = false
let windowStateSaveTimer = null
let displayTopologyListenersRegistered = false
const appUpdater = createAppUpdater({
  app,
  owner: 'maouzju',
  repo: 'playlist-wall',
})

if (process.platform === 'win32') {
  app.setAppUserModelId(WINDOWS_APP_ID)
}

function logRuntimeDiagnostic(label, payload) {
  if (payload === undefined) {
    console.error(`[runtime] ${label}`)
    return
  }

  console.error(`[runtime] ${label}`, payload)
}

function registerMainProcessDiagnostics() {
  if (mainProcessDiagnosticsRegistered) {
    return
  }

  mainProcessDiagnosticsRegistered = true

  process.on('uncaughtException', (error) => {
    logRuntimeDiagnostic('main uncaughtException', error)
  })

  process.on('unhandledRejection', (reason) => {
    logRuntimeDiagnostic('main unhandledRejection', reason)
  })
}

function attachWindowDiagnostics(targetWindow) {
  if (!targetWindow?.webContents) {
    return
  }

  targetWindow.webContents.on('did-fail-load', (_event, errorCode, errorDescription, validatedURL, isMainFrame) => {
    logRuntimeDiagnostic('renderer did-fail-load', {
      errorCode,
      errorDescription,
      validatedURL,
      isMainFrame,
    })
  })

  targetWindow.webContents.on('render-process-gone', (_event, details) => {
    logRuntimeDiagnostic('renderer render-process-gone', details)
  })

  targetWindow.webContents.on('unresponsive', () => {
    logRuntimeDiagnostic('renderer unresponsive')
  })

  targetWindow.webContents.on('did-finish-load', () => {
    console.log('[runtime] renderer did-finish-load')
  })

  targetWindow.webContents.on('console-message', (_event, level, message, line, sourceId) => {
    const prefix = `[renderer:${level}] ${sourceId || 'unknown'}:${Number(line || 0)}`
    if (level >= 2) {
      console.error(prefix, message)
      return
    }

    console.log(prefix, message)
  })
}

function readWindowState() {
  return normalizeWindowState(readPreferences()?.windowState, getDefaultWindowState())
}

function writeWindowState(windowState) {
  const nextWindowState = normalizeWindowState(windowState, getDefaultWindowState())
  const currentPreferences = readPreferences()

  if (areWindowStatesEqual(currentPreferences?.windowState, nextWindowState)) {
    return currentPreferences
  }

  return writePreferences({
    windowState: nextWindowState,
  })
}

function resolveWindowStateForCurrentDisplays(windowState) {
  return resolveWindowState(windowState, screen.getAllDisplays(), {
    minWidth: WINDOW_DEFAULT_MIN_WIDTH,
    minHeight: WINDOW_DEFAULT_MIN_HEIGHT,
  })
}

function applyWindowMinimumSize(targetWindow, windowState) {
  if (!targetWindow || targetWindow.isDestroyed()) {
    return null
  }

  const resolvedWindowState = resolveWindowStateForCurrentDisplays(windowState)
  targetWindow.setMinimumSize(resolvedWindowState.minWidth, resolvedWindowState.minHeight)
  return resolvedWindowState
}

function clearPendingWindowStateSave() {
  if (windowStateSaveTimer) {
    clearTimeout(windowStateSaveTimer)
    windowStateSaveTimer = null
  }
}

function persistNormalWindowState(targetWindow = win) {
  clearPendingWindowStateSave()

  if (
    !targetWindow
    || targetWindow.isDestroyed()
    || targetWindow.isMaximized()
    || targetWindow.isFullScreen()
  ) {
    return
  }

  const bounds = normalizeWindowState(targetWindow.getBounds(), getDefaultWindowState())
  applyWindowMinimumSize(targetWindow, bounds)
  writeWindowState(bounds)
}

function scheduleNormalWindowStatePersist(targetWindow = win) {
  if (
    !targetWindow
    || targetWindow.isDestroyed()
    || targetWindow.isMaximized()
    || targetWindow.isFullScreen()
  ) {
    clearPendingWindowStateSave()
    return
  }

  clearPendingWindowStateSave()
  windowStateSaveTimer = setTimeout(() => {
    persistNormalWindowState(targetWindow)
  }, WINDOW_STATE_SAVE_DELAY_MS)
}

function correctWindowPlacementIfNeeded(targetWindow = win, { persist = false } = {}) {
  if (!targetWindow || targetWindow.isDestroyed()) {
    return null
  }

  const referenceBounds = normalizeWindowState(
    typeof targetWindow.getNormalBounds === 'function'
      ? targetWindow.getNormalBounds()
      : targetWindow.getBounds(),
    getDefaultWindowState()
  )
  const resolvedWindowState = applyWindowMinimumSize(targetWindow, referenceBounds)

  if (!resolvedWindowState || targetWindow.isMaximized() || targetWindow.isFullScreen()) {
    return resolvedWindowState
  }

  const currentBounds = normalizeWindowState(targetWindow.getBounds(), getDefaultWindowState())
  if (!needsWindowStateCorrection(currentBounds, screen.getAllDisplays())) {
    return resolvedWindowState
  }

  const nextBounds = {
    x: resolvedWindowState.x,
    y: resolvedWindowState.y,
    width: resolvedWindowState.width,
    height: resolvedWindowState.height,
  }

  if (!areWindowStatesEqual(currentBounds, nextBounds)) {
    targetWindow.setBounds(nextBounds)
  }

  if (persist) {
    writeWindowState(nextBounds)
  }

  return resolvedWindowState
}

function handleDisplayTopologyChange() {
  if (!win || win.isDestroyed()) {
    return
  }

  correctWindowPlacementIfNeeded(win, { persist: true })
}

function registerDisplayTopologyListeners() {
  if (displayTopologyListenersRegistered) {
    return
  }

  displayTopologyListenersRegistered = true
  screen.on('display-added', handleDisplayTopologyChange)
  screen.on('display-removed', handleDisplayTopologyChange)
  screen.on('display-metrics-changed', handleDisplayTopologyChange)
}

function registerWindowStateTracking(targetWindow) {
  if (!targetWindow || targetWindow.isDestroyed()) {
    return
  }

  targetWindow.on('move', () => {
    scheduleNormalWindowStatePersist(targetWindow)
  })

  targetWindow.on('resize', () => {
    scheduleNormalWindowStatePersist(targetWindow)
  })

  targetWindow.on('unmaximize', () => {
    setTimeout(() => {
      correctWindowPlacementIfNeeded(targetWindow, { persist: true })
      scheduleNormalWindowStatePersist(targetWindow)
    }, 0)
  })

  targetWindow.on('leave-full-screen', () => {
    setTimeout(() => {
      correctWindowPlacementIfNeeded(targetWindow, { persist: true })
      scheduleNormalWindowStatePersist(targetWindow)
    }, 0)
  })

  targetWindow.on('close', () => {
    persistNormalWindowState(targetWindow)
  })
}

function send(channel, data) {
  if (win && !win.isDestroyed()) {
    win.webContents.send(channel, data)
  }
}

function getCacheFilePath(fileName) {
  return getUserDataFilePath(fileName)
}

function readJsonCache(fileName) {
  const filePath = getCacheFilePath(fileName)

  try {
    if (!fs.existsSync(filePath)) {
      return null
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch (error) {
    console.warn('failed to read cache', filePath, error)
    return null
  }
}

function writeJsonCache(fileName, payload) {
  const filePath = getCacheFilePath(fileName)

  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true })
    fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
  } catch (error) {
    console.warn('failed to write cache', fileName, error)
  }
}

function deleteJsonCache(fileName) {
  const filePath = getCacheFilePath(fileName)

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  } catch (error) {
    console.warn('failed to delete cache', filePath, error)
  }
}

function clearPlaylistCaches() {
  const userDataDir = path.dirname(getCacheFilePath('playlists-current.json'))

  try {
    if (!fs.existsSync(userDataDir)) {
      return
    }

    for (const entry of fs.readdirSync(userDataDir)) {
      if (entry === 'playlists-current.json' || /^playlist-detail-\d+\.json$/.test(entry)) {
        fs.rmSync(path.join(userDataDir, entry), { force: true })
      }
    }
  } catch (error) {
    console.warn('failed to clear playlist caches', error)
  }
}

function cleanupLegacyWorkspaceCache() {
  const workspaceRoot = process.cwd()

  try {
    if (!fs.existsSync(workspaceRoot)) {
      return
    }

    for (const entry of fs.readdirSync(workspaceRoot)) {
      if (entry === 'playlists-current.json' || /^playlist-detail-\d+\.json$/.test(entry)) {
        fs.rmSync(path.join(workspaceRoot, entry), { force: true })
      }
    }
  } catch (error) {
    console.warn('failed to remove legacy workspace cache', error)
  }
}

function isAuthError(error) {
  return Number(error?.status || error?.body?.code || 0) === 301
}

function clearSessionAndCaches() {
  svc = null
  clearSession()
  clearPlaylistCaches()
}

function ensureServiceReady() {
  if (svc) {
    return svc
  }

  const session = readSession()
  if (!session?.cookie) {
    throw new Error(TEXT.serviceNotReady)
  }

  svc = new NeteaseService(session.cookie)
  return svc
}

function normalizeAccount(account) {
  return {
    userId: Number(account?.userId || 0),
    nickname: account?.nickname || '',
    avatarUrl: account?.avatarUrl || '',
    sourcePlatform: account?.sourcePlatform || '',
  }
}

function normalizePlaylistMeta(playlist) {
  return {
    id: Number(playlist?.id || 0),
    sourcePlaylistId: Number(playlist?.sourcePlaylistId || playlist?.id || 0),
    sourcePlatform: playlist?.sourcePlatform || '',
    platformPlaylistId: String(playlist?.platformPlaylistId || '').trim(),
    platformOwnerId: String(playlist?.platformOwnerId || '').trim(),
    name: playlist?.name || '',
    trackCount: Number(playlist?.trackCount || 0),
    coverUrl: playlist?.coverUrl || playlist?.coverImgUrl || '',
    specialType: Number(playlist?.specialType || 0),
    subscribed: playlist?.subscribed === false ? false : Boolean(playlist?.subscribed),
    creatorId: Number(
      playlist?.creatorId
      || playlist?.creatorUserId
      || playlist?.creator?.userId
      || 0
    ),
    creatorName: playlist?.creatorName || playlist?.creator?.nickname || '',
    description: String(playlist?.description || playlist?.desc || ''),
    playCount: Number(playlist?.playCount || 0),
    copywriter: playlist?.copywriter || '',
    exploreSourceLabel: playlist?.exploreSourceLabel || '',
    externalUrl: playlist?.externalUrl || '',
    importReadOnly: Boolean(playlist?.importReadOnly),
    isExplore: Boolean(playlist?.isExplore),
  }
}

function normalizeTrackArtistEntries(track) {
  const artistEntries = Array.isArray(track?.artistEntries)
    ? track.artistEntries
    : Array.isArray(track?.artists)
      ? track.artists.map((artist) => ({
        id: 0,
        name: typeof artist === 'string' ? artist : artist?.name,
      }))
      : []

  return artistEntries.map((artist) => ({
    id: Number(artist?.id || artist?.artistId || 0),
    name: String(artist?.name || '').trim(),
    sourceArtistId: String(artist?.sourceArtistId || '').trim(),
  })).filter((artist) => artist.name)
}

function normalizeTracks(tracks) {
  return (tracks || []).map((track, index) => {
    const artistEntries = normalizeTrackArtistEntries(track)

    return {
      id: Number(track?.id || 0),
      sourceTrackId: String(track?.sourceTrackId || '').trim(),
      sourcePlatform: String(track?.sourcePlatform || '').trim(),
      platformTrackUri: String(track?.platformTrackUri || '').trim(),
      playbackTrackId: Number(track?.playbackTrackId || 0),
      playbackSourcePlatform: String(track?.playbackSourcePlatform || '').trim(),
      resolvedTrackId: Number(track?.resolvedTrackId || 0),
      name: track?.name || '',
      artists: artistEntries.map((artist) => artist.name),
      artistEntries,
      album: track?.album || '',
      albumId: Number(track?.albumId || 0),
      albumCoverUrl: track?.albumCoverUrl || '',
      durationMs: Number(track?.durationMs || 0),
      position: Number(track?.position || index + 1),
      externalUrl: String(track?.externalUrl || '').trim(),
    }
  }).filter((track) => track.id > 0)
}

function normalizeTrackIds(trackIds, fallbackTrackId = 0) {
  const ids = Array.isArray(trackIds) && trackIds.length
    ? trackIds
    : [fallbackTrackId]
  return [...new Set(ids.map((id) => Number(id)).filter((id) => id > 0))]
}

function normalizeSyncLookupText(input) {
  return String(input || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[锛?锛籠[{銆怾[^锛?\]銆憓]*[锛?\]銆憓]/g, ' ')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function buildPlaylistNameKey(name) {
  return normalizeSyncLookupText(name)
}

function buildTrackLookupKey(sourcePlatform, track) {
  const normalizedSourcePlatform = String(sourcePlatform || '').trim() || String(track?.sourcePlatform || '').trim() || 'unknown'
  const sourceTrackId = String(track?.sourceTrackId || '').trim()
  if (sourceTrackId) {
    return `${normalizedSourcePlatform}:${sourceTrackId}`
  }

  const artistKey = (Array.isArray(track?.artists) ? track.artists : [])
    .map((artist) => normalizeSyncLookupText(artist))
    .filter(Boolean)
    .join('|')

  return [
    normalizedSourcePlatform,
    normalizeSyncLookupText(track?.name),
    artistKey,
    normalizeSyncLookupText(track?.album),
    Math.round(Number(track?.durationMs || 0) / 1000),
  ].join(':')
}

function cloneNormalizedTrack(track) {
  if (!track || typeof track !== 'object') {
    return null
  }

  return {
    ...track,
    artists: Array.isArray(track.artists) ? [...track.artists] : [],
    artistEntries: Array.isArray(track.artistEntries)
      ? track.artistEntries.map((artist) => ({ ...artist }))
      : [],
  }
}

function chunkArray(items, size = PLAYLIST_TRACK_BATCH_SIZE) {
  const list = Array.isArray(items) ? items : []
  const normalizedSize = Math.max(1, Math.round(Number(size || 0) || PLAYLIST_TRACK_BATCH_SIZE))
  const chunks = []

  for (let index = 0; index < list.length; index += normalizedSize) {
    chunks.push(list.slice(index, index + normalizedSize))
  }

  return chunks
}

async function mapWithConcurrency(items, concurrency, mapper) {
  const sourceItems = Array.isArray(items) ? items : []
  if (!sourceItems.length) {
    return []
  }

  const normalizedConcurrency = Math.max(1, Math.floor(Number(concurrency || 1) || 1))
  const results = new Array(sourceItems.length)
  let nextIndex = 0

  async function runWorker() {
    while (nextIndex < sourceItems.length) {
      const currentIndex = nextIndex
      nextIndex += 1
      results[currentIndex] = await mapper(sourceItems[currentIndex], currentIndex)
    }
  }

  await Promise.all(Array.from(
    { length: Math.min(normalizedConcurrency, sourceItems.length) },
    () => runWorker()
  ))

  return results
}

function buildPlaylistLookupByName(playlists) {
  const lookup = new Map()

  for (const playlist of playlists || []) {
    const key = buildPlaylistNameKey(playlist?.name)
    if (!key || lookup.has(key)) {
      continue
    }

    lookup.set(key, playlist)
  }

  return lookup
}

function normalizePlaylistPayload(playlist) {
  return {
    ...normalizePlaylistMeta(playlist),
    tracks: normalizeTracks(playlist?.tracks || []),
    tracksError: playlist?.tracksError || '',
    hydrated: Boolean(playlist?.hydrated),
    hydrating: Boolean(playlist?.hydrating) && !playlist?.hydrated,
  }
}

function normalizeCoverUploadFile(file) {
  const fileName = String(file?.name || '').trim()
  const fileData = file?.data
  if (!fileName || !fileData) {
    return null
  }

  return {
    name: fileName,
    data: Buffer.isBuffer(fileData)
      ? fileData
      : Buffer.from(fileData),
  }
}

function mergeManagedPlaylistPayload(existingPlaylist, playlistMeta) {
  const existingTracks = normalizeTracks(existingPlaylist?.tracks || [])
  const metaTracks = normalizeTracks(playlistMeta?.tracks || [])
  const nextTracks = existingTracks.length ? existingTracks : metaTracks
  const nextTrackCount = Math.max(
    Number(playlistMeta?.trackCount || 0),
    Number(existingPlaylist?.trackCount || 0),
    nextTracks.length
  )
  const hydrated = existingPlaylist?.hydrated !== undefined
    ? Boolean(existingPlaylist.hydrated)
    : nextTracks.length >= nextTrackCount
  const hydrating = !hydrated && (
    Boolean(existingPlaylist?.hydrating)
    || nextTrackCount > nextTracks.length
  )

  return normalizePlaylistPayload({
    ...(existingPlaylist || {}),
    ...playlistMeta,
    id: Number(playlistMeta?.id || existingPlaylist?.id || 0),
    sourcePlaylistId: Number(
      playlistMeta?.sourcePlaylistId
      || playlistMeta?.id
      || existingPlaylist?.sourcePlaylistId
      || existingPlaylist?.id
      || 0
    ),
    subscribed: false,
    isExplore: false,
    trackCount: nextTrackCount,
    tracks: nextTracks,
    tracksError: existingPlaylist?.tracksError || playlistMeta?.tracksError || '',
    hydrated,
    hydrating,
  })
}

function normalizeSubscribedPlaylistPayload(playlist) {
  const normalizedPlaylistId = Number(playlist?.sourcePlaylistId || playlist?.id || 0)

  return normalizePlaylistPayload({
    ...playlist,
    id: normalizedPlaylistId,
    sourcePlaylistId: normalizedPlaylistId,
    subscribed: true,
    isExplore: false,
    hydrated: Boolean(playlist?.hydrated !== false),
    hydrating: false,
  })
}

function mergePlaylists(livePlaylists, cachedPlaylists) {
  const merged = new Map()

  for (const playlist of cachedPlaylists || []) {
    const normalized = normalizePlaylistMeta(playlist)
    if (normalized.id > 0) {
      merged.set(normalized.id, normalized)
    }
  }

  for (const playlist of livePlaylists || []) {
    const normalized = normalizePlaylistMeta(playlist)
    if (normalized.id > 0) {
      merged.set(normalized.id, {
        ...merged.get(normalized.id),
        ...normalized,
      })
    }
  }

  return [...merged.values()].filter((playlist) => playlist.id > 0)
}

function pruneDeletedPlaylistsFromCache(livePlaylists, cachedPlaylists) {
  const liveIds = new Set((livePlaylists || []).map((playlist) => Number(playlist.id)).filter((id) => id > 0))
  if (!liveIds.size) {
    return
  }

  for (const playlist of cachedPlaylists || []) {
    const playlistId = Number(playlist?.id || 0)
    if (playlistId > 0 && !liveIds.has(playlistId)) {
      deleteJsonCache(`playlist-detail-${playlistId}.json`)
    }
  }
}

function sortPlaylistsForWall(playlists) {
  return [...playlists].sort((left, right) => {
    const trackDiff = Math.max(right.trackCount, right.tracks?.length || 0) - Math.max(left.trackCount, left.tracks?.length || 0)
    if (trackDiff !== 0) {
      return trackDiff
    }
    return left.id - right.id
  })
}

function loadBootstrapCache() {
  const snapshot = readJsonCache('playlists-current.json')
  if (!snapshot) {
    return null
  }

  return {
    account: normalizeAccount(snapshot.account),
    playlists: (snapshot.playlists || []).map(normalizePlaylistMeta).filter((playlist) => playlist.id > 0),
  }
}

function loadPlaylistDetailCache(playlistId) {
  const snapshot = readJsonCache(`playlist-detail-${playlistId}.json`)
  if (!snapshot) {
    return []
  }

  return normalizeTracks(snapshot.tracks || snapshot.playlist?.tracks || [])
}

function loadPlaylistPayloadFromCache(playlistId) {
  const normalizedPlaylistId = Number(playlistId || 0)
  if (normalizedPlaylistId <= 0) {
    return null
  }

  const bootstrap = readJsonCache('playlists-current.json')
  const bootstrapPlaylist = Array.isArray(bootstrap?.playlists)
    ? bootstrap.playlists.find((playlist) => Number(playlist?.id || 0) === normalizedPlaylistId) || null
    : null
  const detail = readJsonCache(`playlist-detail-${normalizedPlaylistId}.json`)
  const detailPlaylist = detail?.playlist || null
  const rawTracks = Array.isArray(detail?.tracks)
    ? detail.tracks
    : Array.isArray(detailPlaylist?.tracks)
      ? detailPlaylist.tracks
      : []

  if (!bootstrapPlaylist && !detailPlaylist && !rawTracks.length) {
    return null
  }

  return normalizePlaylistPayload({
    ...(bootstrapPlaylist || {}),
    ...(detailPlaylist || {}),
    id: normalizedPlaylistId,
    sourcePlaylistId: Number(
      detailPlaylist?.sourcePlaylistId
      || bootstrapPlaylist?.sourcePlaylistId
      || normalizedPlaylistId
    ),
    tracks: rawTracks,
  })
}

function saveBootstrapCache(account, playlists) {
  writeJsonCache('playlists-current.json', {
    ok: true,
    updatedAt: new Date().toISOString(),
    account,
    playlists: playlists.map((playlist) => ({
      id: playlist.id,
      name: playlist.name,
      trackCount: playlist.trackCount,
      coverUrl: playlist.coverUrl,
      specialType: playlist.specialType,
      subscribed: playlist.subscribed,
      creatorUserId: playlist.creatorId,
      description: playlist.description || '',
    })),
  })
}

async function buildPlaybackPayload(userId) {
  const localStats = getPlaybackStats(userId)
  let cloudPlayCounts = localStats.cloudPlayCounts || {}

  try {
    cloudPlayCounts = await svc.getUserPlayCounts(userId)
    writeCloudPlayCounts(userId, cloudPlayCounts)
  } catch (error) {
    console.warn('failed to fetch cloud play counts, using cache when available', error)
  }

  return {
    localPlayCounts: localStats.localPlayCounts || {},
    cloudPlayCounts,
  }
}

function savePlaylistDetailCache(playlist, tracks) {
  writeJsonCache(`playlist-detail-${playlist.id}.json`, {
    ok: true,
    updatedAt: new Date().toISOString(),
    playlist: {
      id: playlist.id,
      name: playlist.name,
      trackCount: playlist.trackCount,
      coverImgUrl: playlist.coverUrl,
      description: playlist.description || '',
    },
    tracks,
  })
}

function replacePlaylistTracksInCache(playlistId, tracks) {
  const normalizedPlaylistId = Number(playlistId || 0)
  if (normalizedPlaylistId <= 0) {
    return
  }

  const normalizedTracks = normalizeTracks(tracks).map((track, index) => ({
    ...track,
    position: index + 1,
  }))
  const detailFileName = `playlist-detail-${normalizedPlaylistId}.json`
  const detail = readJsonCache(detailFileName) || {}
  const detailPlaylist = detail.playlist || {}

  const bootstrap = readJsonCache('playlists-current.json')
  const bootstrapPlaylists = Array.isArray(bootstrap?.playlists) ? bootstrap.playlists : []
  const bootstrapPlaylist = bootstrapPlaylists.find((playlist) => Number(playlist?.id) === normalizedPlaylistId) || null

  if (bootstrap && bootstrapPlaylists.length) {
    bootstrap.playlists = bootstrapPlaylists.map((playlist) => {
      if (Number(playlist?.id) !== normalizedPlaylistId) {
        return playlist
      }
      return {
        ...playlist,
        trackCount: normalizedTracks.length,
        description: detailPlaylist.description || playlist.description || '',
      }
    })
    writeJsonCache('playlists-current.json', bootstrap)
  }

  detail.ok = true
  detail.updatedAt = new Date().toISOString()
  detail.playlist = {
    ...detailPlaylist,
    id: normalizedPlaylistId,
    name: detailPlaylist.name || bootstrapPlaylist?.name || '',
    trackCount: normalizedTracks.length,
    coverImgUrl: detailPlaylist.coverImgUrl || bootstrapPlaylist?.coverUrl || '',
    description: detailPlaylist.description || bootstrapPlaylist?.description || '',
  }
  detail.tracks = normalizedTracks

  if (Array.isArray(detail.playlist.tracks)) {
    detail.playlist.tracks = normalizedTracks
  }

  writeJsonCache(detailFileName, detail)
}

function addTrackToCache(playlistId, track) {
  const normalizedTrack = normalizeTracks([track])[0]
  if (!normalizedTrack) {
    return
  }

  const bootstrap = readJsonCache('playlists-current.json')
  if (bootstrap && Array.isArray(bootstrap.playlists)) {
    bootstrap.playlists = bootstrap.playlists.map((playlist) => {
      if (Number(playlist.id) !== Number(playlistId)) {
        return playlist
      }
      return {
        ...playlist,
        trackCount: Math.max(Number(playlist.trackCount || 0), 0) + 1,
      }
    })
    writeJsonCache('playlists-current.json', bootstrap)
  }

  const detail = readJsonCache(`playlist-detail-${playlistId}.json`)
  if (!detail) {
    return
  }

  const rawTracks = normalizeTracks(detail.tracks || detail.playlist?.tracks || [])
  if (rawTracks.some((item) => item.id === normalizedTrack.id)) {
    return
  }

  const nextTracks = [...rawTracks, { ...normalizedTrack, position: rawTracks.length + 1 }]
  if (detail.tracks) {
    detail.tracks = nextTracks
  }
  if (detail.playlist) {
    detail.playlist.trackCount = Math.max(0, Number(detail.playlist.trackCount || 0)) + 1
    if (Array.isArray(detail.playlist.tracks)) {
      detail.playlist.tracks = nextTracks
    }
  }
  writeJsonCache(`playlist-detail-${playlistId}.json`, detail)
}

function removeTrackFromCache(playlistId, trackId) {
  const bootstrap = readJsonCache('playlists-current.json')
  if (bootstrap && Array.isArray(bootstrap.playlists)) {
    bootstrap.playlists = bootstrap.playlists.map((playlist) => {
      if (Number(playlist.id) !== Number(playlistId)) {
        return playlist
      }
      return {
        ...playlist,
        trackCount: Math.max(0, Number(playlist.trackCount || 0) - 1),
      }
    })
    writeJsonCache('playlists-current.json', bootstrap)
  }

  const detail = readJsonCache(`playlist-detail-${playlistId}.json`)
  if (!detail) {
    return
  }

  const rawTracks = detail.tracks || detail.playlist?.tracks || []
  const nextTracks = rawTracks.filter((track) => Number(track.id) !== Number(trackId))
  if (detail.tracks) {
    detail.tracks = nextTracks
  }
  if (detail.playlist) {
    detail.playlist.trackCount = Math.max(0, Number(detail.playlist.trackCount || 0) - 1)
    if (Array.isArray(detail.playlist.tracks)) {
      detail.playlist.tracks = nextTracks
    }
  }
  writeJsonCache(`playlist-detail-${playlistId}.json`, detail)
}

function removePlaylistFromCache(playlistId) {
  const normalizedPlaylistId = Number(playlistId || 0)
  if (normalizedPlaylistId <= 0) {
    return
  }

  const bootstrap = readJsonCache('playlists-current.json')
  if (bootstrap && Array.isArray(bootstrap.playlists)) {
    bootstrap.playlists = bootstrap.playlists.filter((playlist) => Number(playlist?.id || 0) !== normalizedPlaylistId)
    bootstrap.updatedAt = new Date().toISOString()
    writeJsonCache('playlists-current.json', bootstrap)
  }

  deleteJsonCache(`playlist-detail-${normalizedPlaylistId}.json`)
}

function upsertPlaylistInCache(playlist) {
  const normalizedPlaylist = normalizePlaylistPayload(playlist)
  if (normalizedPlaylist.id <= 0) {
    return
  }

  const bootstrap = readJsonCache('playlists-current.json') || {
    ok: true,
    updatedAt: new Date().toISOString(),
    account: null,
    playlists: [],
  }
  const currentPlaylists = Array.isArray(bootstrap.playlists) ? bootstrap.playlists : []
  const playlistSummary = {
    id: normalizedPlaylist.id,
    name: normalizedPlaylist.name,
    trackCount: normalizedPlaylist.trackCount,
    coverUrl: normalizedPlaylist.coverUrl,
    specialType: normalizedPlaylist.specialType,
    subscribed: normalizedPlaylist.subscribed,
    creatorUserId: normalizedPlaylist.creatorId,
    description: normalizedPlaylist.description || '',
  }
  const existingIndex = currentPlaylists.findIndex((item) => Number(item?.id || 0) === normalizedPlaylist.id)

  bootstrap.playlists = existingIndex === -1
    ? [...currentPlaylists, playlistSummary]
    : currentPlaylists.map((item, index) => index === existingIndex ? { ...item, ...playlistSummary } : item)
  bootstrap.updatedAt = new Date().toISOString()
  writeJsonCache('playlists-current.json', bootstrap)
  savePlaylistDetailCache(normalizedPlaylist, normalizedPlaylist.tracks)
}

function clearPendingSubscribedPlaylistRemovalTimer(entry) {
  if (entry?.timer) {
    clearTimeout(entry.timer)
    entry.timer = null
  }
}

function takePendingSubscribedPlaylistRemoval(playlistId) {
  const normalizedPlaylistId = Number(playlistId || 0)
  if (normalizedPlaylistId <= 0) {
    return null
  }

  const entry = pendingSubscribedPlaylistRemovals.get(normalizedPlaylistId) || null
  if (!entry) {
    return null
  }

  clearPendingSubscribedPlaylistRemovalTimer(entry)
  pendingSubscribedPlaylistRemovals.delete(normalizedPlaylistId)
  return entry
}

async function finalizePendingSubscribedPlaylistRemoval(playlistId) {
  const entry = takePendingSubscribedPlaylistRemoval(playlistId)
  if (!entry?.playlist?.id) {
    return { ok: true, skipped: true }
  }

  try {
    const service = ensureServiceReady()
    await service.unsubscribePlaylist(entry.playlist.id)
    removePlaylistFromCache(entry.playlist.id)
    return { ok: true }
  } catch (error) {
    upsertPlaylistInCache(entry.playlist)
    send('subscribed-playlist-removal-failed', {
      playlist: entry.playlist,
      error: error.message || String(error),
    })
    return { ok: false, error: error.message || String(error) }
  }
}

function stagePendingSubscribedPlaylistRemoval(playlist) {
  const normalizedPlaylist = normalizeSubscribedPlaylistPayload(playlist)
  if (normalizedPlaylist.id <= 0) {
    throw new Error(TEXT.removeSubscribedPlaylistFailed)
  }

  const existingEntry = takePendingSubscribedPlaylistRemoval(normalizedPlaylist.id)
  if (existingEntry?.playlist?.id) {
    upsertPlaylistInCache(existingEntry.playlist)
  }

  const entry = {
    playlist: normalizedPlaylist,
    timer: null,
    requestedAt: Date.now(),
  }

  entry.timer = setTimeout(() => {
    void finalizePendingSubscribedPlaylistRemoval(normalizedPlaylist.id)
  }, PLAYLIST_UNDO_NOTICE_MS)

  pendingSubscribedPlaylistRemovals.set(normalizedPlaylist.id, entry)
  removePlaylistFromCache(normalizedPlaylist.id)
  return entry
}

async function flushPendingSubscribedPlaylistRemovals() {
  const pendingIds = [...pendingSubscribedPlaylistRemovals.keys()]
  if (!pendingIds.length) {
    return
  }

  for (const playlistId of pendingIds) {
    await finalizePendingSubscribedPlaylistRemoval(playlistId)
  }
}

function describePlaylistError(error, hasCachedTracks = false) {
  const code = Number(error?.body?.code || error?.status || 0)
  if (code === 401) {
    return TEXT.privatePlaylist
  }
  return hasCachedTracks ? TEXT.partialPlaylistUnavailable : TEXT.playlistUnavailable
}

function shouldHydratePlaylist(playlist, tracks) {
  const expectedCount = Math.max(Number(playlist.trackCount || 0), 0)
  if (expectedCount === 0) {
    return false
  }
  return tracks.length < expectedCount
}

function buildPlaylistSnapshot(playlist, tracks) {
  const hydrating = shouldHydratePlaylist(playlist, tracks)
  return {
    ...playlist,
    tracks,
    tracksError: '',
    hydrated: !hydrating,
    hydrating,
  }
}

function buildStats(playlists) {
  return {
    playlistCount: playlists.length,
    trackCount: playlists.reduce((sum, playlist) => sum + Math.max(playlist.trackCount, playlist.tracks?.length || 0), 0),
    expandedTrackCount: playlists.reduce((sum, playlist) => sum + (playlist.tracks?.length || 0), 0),
    hydratedPlaylistCount: playlists.filter((playlist) => !playlist.hydrating).length,
    hydratingPlaylistCount: playlists.filter((playlist) => playlist.hydrating).length,
  }
}

async function hydratePlaylist(playlist) {
  try {
    const tracks = await svc.getPlaylistTracks(playlist.id, playlist.trackCount)
    savePlaylistDetailCache(playlist, tracks)
    return {
      ...playlist,
      tracks,
      tracksError: '',
      hydrated: true,
      hydrating: false,
    }
  } catch (error) {
    const cachedTracks = loadPlaylistDetailCache(playlist.id)
    if (cachedTracks.length > 0) {
      console.warn('using cached playlist detail after hydrate failure', playlist.id, error.message || error)
    } else {
      console.warn('failed to fetch playlist tracks', playlist.id, error)
    }

    return {
      ...playlist,
      tracks: cachedTracks,
      tracksError: describePlaylistError(error, cachedTracks.length > 0),
      hydrated: true,
      hydrating: false,
    }
  }
}

async function hydratePlaylistsInBackground(account, playlists) {
  const runId = ++hydrationRunId
  const pending = playlists.filter((playlist) => playlist.hydrating)

  if (!pending.length) {
    send('playlist-patch', {
      playlists: [],
      stats: buildStats(playlists),
      done: true,
    })
    return
  }

  for (let start = 0; start < pending.length; start += HYDRATE_CONCURRENCY) {
    if (runId !== hydrationRunId) {
      return
    }

    const batch = pending.slice(start, start + HYDRATE_CONCURRENCY)
    const patches = await Promise.all(batch.map((playlist) => hydratePlaylist(playlist)))
    if (runId !== hydrationRunId) {
      return
    }

    for (const patch of patches) {
      const index = playlists.findIndex((playlist) => playlist.id === patch.id)
      if (index >= 0) {
        playlists[index] = patch
      }
    }

    saveBootstrapCache(account, playlists)

    send('progress', {
      message: `${TEXT.loadingHydrate} ${Math.min(start + batch.length, pending.length)} / ${pending.length}`,
      pct: Math.min(100, 28 + Math.round(((start + batch.length) / pending.length) * 72)),
    })

    send('playlist-patch', {
      playlists: patches,
      stats: buildStats(playlists),
      done: start + batch.length >= pending.length,
    })
  }

  if (runId === hydrationRunId) {
    send('progress', { message: TEXT.ready, pct: 100 })
  }
}

function createWindow() {
  registerMainProcessDiagnostics()
  registerDisplayTopologyListeners()
  const initialWindowState = resolveWindowStateForCurrentDisplays(readWindowState())
  const windowsTaskbarDetails = process.platform === 'win32'
    ? buildWindowsTaskbarDetails({
      appId: WINDOWS_APP_ID,
      execPath: process.execPath,
      appPath: app.getAppPath(),
      iconPath: WINDOWS_ICON_PATH,
      isPackaged: app.isPackaged,
      relaunchDisplayName: TEXT.windowTitle,
    })
    : null

  win = new BrowserWindow({
    x: initialWindowState.x,
    y: initialWindowState.y,
    width: initialWindowState.width,
    height: initialWindowState.height,
    minWidth: initialWindowState.minWidth,
    minHeight: initialWindowState.minHeight,
    backgroundColor: '#ffffff',
    autoHideMenuBar: true,
    show: false,
    title: TEXT.windowTitle,
    icon: WINDOWS_ICON_PATH,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  attachWindowDiagnostics(win)
  registerWindowStateTracking(win)
  if (windowsTaskbarDetails && typeof win.setAppDetails === 'function') {
    win.setAppDetails(windowsTaskbarDetails)
  }
  win.loadFile(path.join(__dirname, '../renderer/index.html'))
  win.once('ready-to-show', () => {
    correctWindowPlacementIfNeeded(win, { persist: true })
    win.show()
  })
  win.on('closed', () => {
    clearPendingWindowStateSave()
    win = null
    hydrationRunId += 1
  })
}

async function buildBootstrapPayload() {
  hydrationRunId += 1
  let bootstrap = loadBootstrapCache()

  send('progress', { message: TEXT.loadingSession, pct: 4 })

  const session = readSession()
  if (!session?.cookie) {
    clearPlaylistCaches()
    svc = null
    return { ok: true, needsLogin: true }
  }

  svc = new NeteaseService(session.cookie)
  send('progress', { message: TEXT.loadingAccount, pct: 10 })

  let account = null
  try {
    account = normalizeAccount(await svc.getAccount())
  } catch (error) {
    if (isAuthError(error)) {
      clearSessionAndCaches()
      return { ok: true, needsLogin: true }
    }

    console.warn('failed to fetch live account, using cache when available', error)
    send('progress', { message: TEXT.loadingCacheFallback, pct: 12 })

    if (bootstrap?.account?.userId) {
      account = normalizeAccount(bootstrap.account)
    }
  }

  if (!account?.userId) {
    clearSessionAndCaches()
    return { ok: true, needsLogin: true }
  }

  if (bootstrap?.account?.userId && Number(bootstrap.account.userId) !== account.userId) {
    clearPlaylistCaches()
    bootstrap = null
  }

  send('progress', { message: TEXT.loadingPlaylists, pct: 16 })

  let livePlaylists = []
  let livePlaylistFetchOk = false

  try {
    livePlaylists = await svc.listPlaylists(account.userId)
    livePlaylistFetchOk = true
  } catch (error) {
    if (isAuthError(error)) {
      clearSessionAndCaches()
      return { ok: true, needsLogin: true }
    }

    console.warn('failed to fetch live playlists, using cache when available', error)
    send('progress', { message: TEXT.loadingCacheFallback, pct: 18 })
  }

  const allPlaylists = sortPlaylistsForWall(
    livePlaylistFetchOk
      ? (livePlaylists || []).map(normalizePlaylistMeta).filter((playlist) => playlist.id > 0)
      : mergePlaylists(livePlaylists, bootstrap?.playlists || [])
  )
    .filter((playlist) => !pendingSubscribedPlaylistRemovals.has(Number(playlist.id || 0)))

  if (!allPlaylists.length && pendingSubscribedPlaylistRemovals.size === 0) {
    throw new Error(TEXT.playlistsMissing)
  }

  if (livePlaylistFetchOk) {
    pruneDeletedPlaylistsFromCache(allPlaylists, bootstrap?.playlists || [])
  }

  const playlists = allPlaylists.map((playlist) => buildPlaylistSnapshot(playlist, loadPlaylistDetailCache(playlist.id)))
  saveBootstrapCache(account, playlists)

  send('progress', { message: TEXT.loadingBootstrapReady, pct: 100 })

  void hydratePlaylistsInBackground(account, playlists)

  const playback = await buildPlaybackPayload(account.userId)

  return {
    ok: true,
    account,
    playlists,
    playback,
    stats: buildStats(playlists),
    sessionStorageMode: session.storageMode || '',
  }
}

function registerIpc() {
  ipcMain.handle('getPreferences', async () => {
    try {
      return { ok: true, preferences: readPreferences() }
    } catch (error) {
      return { ok: false, error: error.message || String(error) }
    }
  })

  ipcMain.handle('savePreferences', async (_event, preferences) => {
    try {
      return { ok: true, preferences: writePreferences(preferences) }
    } catch (error) {
      return { ok: false, error: error.message || String(error) }
    }
  })

  ipcMain.handle('openExternalUrl', async (_event, url) => {
    const normalizedUrl = String(url || '').trim()
    if (!normalizedUrl) {
      return { ok: false, error: 'Invalid URL' }
    }

    try {
      await shell.openExternal(normalizedUrl)
      return { ok: true }
    } catch (error) {
      return { ok: false, error: error?.message || String(error) }
    }
  })

  ipcMain.handle('checkAppUpdate', async (_event, options = {}) => {
    try {
      return await appUpdater.checkForUpdates({
        force: options?.force === true,
      })
    } catch (error) {
      return {
        ok: false,
        error: error.message || String(error),
        currentVersion: app.getVersion(),
        latestVersion: '',
        releaseName: '',
        releaseUrl: 'https://github.com/maouzju/playlist-wall/releases/latest',
        publishedAt: '',
        updateAvailable: false,
        assetName: '',
        downloadUrl: '',
        installSupported: false,
        installMessage: '',
      }
    }
  })

  ipcMain.handle('installAppUpdate', async () => {
    try {
      return await appUpdater.installUpdate()
    } catch (error) {
      return {
        ok: false,
        error: error.message || String(error),
      }
    }
  })

  ipcMain.handle('init', async () => {
    try {
      return await buildBootstrapPayload()
    } catch (error) {
      console.error('init error:', error)
      return { ok: false, error: error.message || String(error) }
    }
  })

  ipcMain.handle('startQrLogin', async () => {
    try {
      const authService = new NeteaseService('')
      const payload = await authService.createQrLogin()
      return { ok: true, ...payload }
    } catch (error) {
      return { ok: false, error: error.message || String(error) }
    }
  })

  ipcMain.handle('checkQrLogin', async (_event, key) => {
    try {
      const authService = new NeteaseService('')
      const payload = await authService.checkQrLogin(key)

      if (payload.status === 'authorized' && payload.cookie) {
        const session = writeSession(payload.cookie)
        clearPlaylistCaches()
        svc = new NeteaseService(payload.cookie)
        return {
          ok: true,
          status: payload.status,
          message: payload.message,
          sessionStorageMode: session?.storageMode || '',
        }
      }

      return {
        ok: true,
        status: payload.status,
        message: payload.message,
        sessionStorageMode: '',
      }
    } catch (error) {
      return { ok: false, error: error.message || String(error) }
    }
  })

  ipcMain.handle('logout', async () => {
    hydrationRunId += 1

    try {
      const session = readSession()
      if (session?.cookie) {
        try {
          await new NeteaseService(session.cookie).logout()
        } catch (error) {
          console.warn('logout api failed, clearing local session anyway', error)
        }
      }
    } finally {
      clearSessionAndCaches()
    }

    return { ok: true }
  })

  ipcMain.handle('getSongUrl', async (_event, songId, options = {}) => {
    try {
      if (!svc) {
        throw new Error(TEXT.serviceNotReady)
      }

      const source = await svc.getSongUrl(songId, options)
      return { ok: true, ...source }
    } catch (error) {
      return { ok: false, error: error.message || String(error) }
    }
  })

  ipcMain.handle('getArtistSongs', async (_event, artistId, maxCount, options) => {
    try {
      if (!svc) {
        throw new Error(TEXT.serviceNotReady)
      }

      const result = await svc.getArtistSongs(artistId, maxCount, {
        includeArtistId: true,
        resolveContext: options?.resolveContext || null,
      })
      return {
        ok: true,
        artistId: Number(result?.artistId || 0),
        tracks: Array.isArray(result?.tracks) ? result.tracks : [],
      }
    } catch (error) {
      return { ok: false, error: error.message || String(error), artistId: 0, tracks: [] }
    }
  })

  ipcMain.handle('getOwnedPlaylistSummary', async (_event, playlistId) => {
    try {
      const service = ensureServiceReady()
      const summary = normalizePlaylistPayload(await service.getPlaylistDetailSummary(playlistId))
      const cachedPlaylist = loadPlaylistPayloadFromCache(playlistId)
      const playlist = cachedPlaylist
        ? mergeManagedPlaylistPayload(cachedPlaylist, summary)
        : summary
      return { ok: true, playlist }
    } catch (error) {
      return { ok: false, error: error.message || String(error) }
    }
  })

  ipcMain.handle('recordTrackPlay', async (_event, userId, trackId) => {
    try {
      return {
        ok: true,
        localPlayCount: incrementLocalPlayCount(userId, trackId),
      }
    } catch (error) {
      return { ok: false, error: error.message || String(error), localPlayCount: 0 }
    }
  })

  ipcMain.handle('removeTrackFromPlaylist', async (_event, playlistId, trackId) => {
    try {
      if (!svc) {
        throw new Error(TEXT.serviceNotReady)
      }

      await svc.removeTrackFromPlaylist(playlistId, trackId)
      removeTrackFromCache(playlistId, trackId)
      return { ok: true }
    } catch (error) {
      return { ok: false, error: error.message || String(error) }
    }
  })

  ipcMain.handle('addTrackToPlaylist', async (_event, playlistId, track) => {
    try {
      if (!svc) {
        throw new Error(TEXT.serviceNotReady)
      }

      await svc.addTrackToPlaylist(playlistId, track?.id)
      addTrackToCache(playlistId, track)
      return { ok: true }
    } catch (error) {
      return { ok: false, error: error.message || String(error) }
    }
  })

  ipcMain.handle('subscribePlaylist', async (_event, playlist) => {
    try {
      const normalizedSourcePlaylistId = Number(playlist?.sourcePlaylistId || playlist?.id || 0)
      if (normalizedSourcePlaylistId <= 0) {
        throw new Error('\u6536\u85cf\u6b4c\u5355\u5931\u8d25')
      }

      const pendingEntry = takePendingSubscribedPlaylistRemoval(normalizedSourcePlaylistId)
      if (!pendingEntry) {
        const service = ensureServiceReady()
        await service.subscribePlaylist(normalizedSourcePlaylistId)
      }

      const subscribedPlaylist = normalizeSubscribedPlaylistPayload({
        ...(pendingEntry?.playlist || {}),
        ...playlist,
        tracks: Array.isArray(pendingEntry?.playlist?.tracks) && pendingEntry.playlist.tracks.length > 0
          ? pendingEntry.playlist.tracks
          : (playlist?.tracks || []),
      })

      upsertPlaylistInCache(subscribedPlaylist)

      return {
        ok: true,
        playlist: subscribedPlaylist,
      }
    } catch (error) {
      return { ok: false, error: error.message || String(error) }
    }
  })

  ipcMain.handle('createOwnedPlaylist', async (_event, payload) => {
    try {
      const service = ensureServiceReady()
      const createdSummary = await service.createPlaylist(payload?.name)
      const coverFile = normalizeCoverUploadFile(payload?.coverFile)
      const description = String(payload?.description || '')

      if (description) {
        await service.updatePlaylistDescription(createdSummary.id, description)
      }

      if (coverFile) {
        await service.updatePlaylistCover(createdSummary.id, coverFile)
      }

      const refreshedSummary = await service.getPlaylistDetailSummary(createdSummary.id)
      const playlist = mergeManagedPlaylistPayload(null, {
        ...refreshedSummary,
        description,
      })
      upsertPlaylistInCache(playlist)
      return { ok: true, playlist }
    } catch (error) {
      return { ok: false, error: error.message || String(error) || TEXT.createOwnedPlaylistFailed }
    }
  })

  ipcMain.handle('updateOwnedPlaylist', async (_event, payload) => {
    try {
      const service = ensureServiceReady()
      const currentPlaylist = normalizePlaylistPayload(payload?.playlist || {})
      const playlistId = Number(currentPlaylist.id || payload?.id || 0)
      if (playlistId <= 0) {
        throw new Error(TEXT.updateOwnedPlaylistFailed)
      }

      const cachedPlaylist = loadPlaylistPayloadFromCache(playlistId)
      const editablePlaylist = currentPlaylist.tracks.length > 0
        ? currentPlaylist
        : cachedPlaylist
          ? mergeManagedPlaylistPayload(cachedPlaylist, currentPlaylist)
          : currentPlaylist

      const nextName = String(payload?.name || editablePlaylist.name || '').trim()
      const nextDescription = String(payload?.description ?? editablePlaylist.description ?? '')
      const coverFile = normalizeCoverUploadFile(payload?.coverFile)

      if (!nextName) {
        throw new Error(TEXT.updateOwnedPlaylistFailed)
      }

      if (nextName !== editablePlaylist.name) {
        await service.renamePlaylist(playlistId, nextName)
      }

      if (nextDescription !== String(editablePlaylist.description || '')) {
        await service.updatePlaylistDescription(playlistId, nextDescription)
      }

      if (coverFile) {
        await service.updatePlaylistCover(playlistId, coverFile)
      }

      const refreshedSummary = await service.getPlaylistDetailSummary(playlistId)
      const playlist = mergeManagedPlaylistPayload(editablePlaylist, {
        ...refreshedSummary,
        description: nextDescription,
      })
      upsertPlaylistInCache(playlist)
      return { ok: true, playlist }
    } catch (error) {
      return { ok: false, error: error.message || String(error) || TEXT.updateOwnedPlaylistFailed }
    }
  })

  ipcMain.handle('deleteOwnedPlaylist', async (_event, payload) => {
    try {
      const service = ensureServiceReady()
      const playlist = normalizePlaylistPayload(payload?.playlist || payload || {})
      const playlistId = Number(playlist.id || payload?.id || 0)
      if (playlistId <= 0) {
        throw new Error(TEXT.deleteOwnedPlaylistFailed)
      }

      await service.deletePlaylist(playlistId)
      removePlaylistFromCache(playlistId)
      return { ok: true, playlistId }
    } catch (error) {
      return { ok: false, error: error.message || String(error) || TEXT.deleteOwnedPlaylistFailed, playlistId: 0 }
    }
  })

  ipcMain.handle('removeSubscribedPlaylist', async (_event, playlist) => {
    try {
      const normalizedPlaylist = normalizeSubscribedPlaylistPayload(playlist)
      if (normalizedPlaylist.id <= 0) {
        throw new Error(TEXT.removeSubscribedPlaylistFailed)
      }

      stagePendingSubscribedPlaylistRemoval(normalizedPlaylist)
      return { ok: true }
    } catch (error) {
      return { ok: false, error: error.message || String(error) }
    }
  })

  ipcMain.handle('restoreSubscribedPlaylist', async (_event, playlist) => {
    try {
      const normalizedPlaylist = normalizeSubscribedPlaylistPayload(playlist)
      if (normalizedPlaylist.id <= 0) {
        throw new Error(TEXT.restoreSubscribedPlaylistFailed)
      }

      const pendingEntry = takePendingSubscribedPlaylistRemoval(normalizedPlaylist.id)
      const restoredPlaylist = normalizeSubscribedPlaylistPayload({
        ...(pendingEntry?.playlist || {}),
        ...normalizedPlaylist,
        tracks: Array.isArray(pendingEntry?.playlist?.tracks) && pendingEntry.playlist.tracks.length > 0
          ? pendingEntry.playlist.tracks
          : (normalizedPlaylist.tracks || []),
      })

      if (!pendingEntry) {
        const service = ensureServiceReady()
        await service.subscribePlaylist(restoredPlaylist.id)
      }

      upsertPlaylistInCache(restoredPlaylist)
      return { ok: true, playlist: restoredPlaylist }
    } catch (error) {
      return { ok: false, error: error.message || String(error) }
    }
  })

  ipcMain.handle('commitPlaylistOrder', async (_event, playlistIds) => {
    try {
      const service = ensureServiceReady()
      const normalizedIds = (playlistIds || []).map((id) => Number(id)).filter((id) => id > 0)
      if (!normalizedIds.length) {
        throw new Error('\u66f4\u65b0\u6b4c\u5355\u5217\u8868\u987a\u5e8f\u5931\u8d25')
      }
      await service.updatePlaylistOrder(normalizedIds)
      return { ok: true }
    } catch (error) {
      return { ok: false, error: error.message || String(error) }
    }
  })

  ipcMain.handle('commitPlaylistTrackMove', async (_event, payload) => {
    let targetTrackAdded = false

    try {
      if (!svc) {
        throw new Error(TEXT.serviceNotReady)
      }

      const sourcePlaylistId = Number(payload?.sourcePlaylistId || 0)
      const targetPlaylistId = Number(payload?.targetPlaylistId || 0)
      const trackId = Number(payload?.track?.id || 0)
      const trackIds = normalizeTrackIds(payload?.trackIds || payload?.tracks?.map((track) => track?.id), trackId)
      const keepSource = Boolean(payload?.keepSource)
      const sourceTracks = Array.isArray(payload?.sourceTracks) ? normalizeTracks(payload.sourceTracks) : null
      const targetTracks = Array.isArray(payload?.targetTracks) ? normalizeTracks(payload.targetTracks) : null

      if (sourcePlaylistId <= 0 || targetPlaylistId <= 0 || !trackIds.length || !targetTracks?.length) {
        throw new Error('\u79fb\u52a8\u6b4c\u66f2\u5931\u8d25')
      }

      if (!trackIds.every((id) => targetTracks.some((track) => track.id === id))) {
        throw new Error('\u79fb\u52a8\u6b4c\u66f2\u5931\u8d25')
      }

      if (sourcePlaylistId === targetPlaylistId) {
        await svc.updatePlaylistTrackOrder(targetPlaylistId, targetTracks.map((track) => track.id))
        replacePlaylistTracksInCache(targetPlaylistId, targetTracks)
        return { ok: true }
      }

      await svc.addTrackToPlaylist(targetPlaylistId, trackIds)
      targetTrackAdded = true
      await svc.updatePlaylistTrackOrder(targetPlaylistId, targetTracks.map((track) => track.id))

      if (!keepSource) {
        await svc.removeTrackFromPlaylist(sourcePlaylistId, trackIds)
      }

      replacePlaylistTracksInCache(targetPlaylistId, targetTracks)
      if (!keepSource && sourceTracks) {
        replacePlaylistTracksInCache(sourcePlaylistId, sourceTracks)
      } else if (!keepSource) {
        for (const movedTrackId of trackIds) {
          removeTrackFromCache(sourcePlaylistId, movedTrackId)
        }
      }

      return { ok: true }
    } catch (error) {
      const sourcePlaylistId = Number(payload?.sourcePlaylistId || 0)
      const targetPlaylistId = Number(payload?.targetPlaylistId || 0)
      const trackId = Number(payload?.track?.id || 0)
      const trackIds = normalizeTrackIds(payload?.trackIds || payload?.tracks?.map((track) => track?.id), trackId)

      if (
        targetTrackAdded
        && sourcePlaylistId > 0
        && targetPlaylistId > 0
        && sourcePlaylistId !== targetPlaylistId
        && trackIds.length
      ) {
        try {
          await svc.removeTrackFromPlaylist(targetPlaylistId, trackIds)
        } catch (rollbackError) {
          console.warn('failed to rollback playlist move after error', {
            sourcePlaylistId,
            targetPlaylistId,
            trackIds,
            rollbackError,
          })
        }
      }

      return { ok: false, error: error.message || String(error) }
    }
  })

  ipcMain.handle('getPlaylistRecommendations', async (_event, _playlistId, seedTrackIds, count = 12) => {
    try {
      if (!svc) {
        throw new Error(TEXT.serviceNotReady)
      }

      const tracks = await svc.getPlaylistRecommendations(seedTrackIds, count)
      return { ok: true, tracks }
    } catch (error) {
      return {
        ok: false,
        error: error.message || String(error),
        code: Number(error?.status || error?.body?.code || 0),
        tracks: [],
      }
    }
  })

  ipcMain.handle('getExplorePlaylists', async (_event, options = {}) => {
    try {
      const service = ensureServiceReady()
      const playlists = await service.getExplorePlaylists(options?.query || '', options)
      return {
        ok: true,
        playlists: (playlists || []).map(normalizePlaylistPayload),
      }
    } catch (error) {
      return {
        ok: false,
        error: error.message || String(error),
        playlists: [],
      }
    }
  })
}

app.whenReady().then(() => {
  cleanupLegacyWorkspaceCache()
  registerIpc()
  createWindow()
})

app.on('before-quit', (event) => {
  if (flushingPendingSubscribedPlaylistRemovals || pendingSubscribedPlaylistRemovals.size === 0) {
    return
  }

  flushingPendingSubscribedPlaylistRemovals = true
  event.preventDefault()
  void flushPendingSubscribedPlaylistRemovals().finally(() => {
    app.exit(0)
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
