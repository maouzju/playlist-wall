const WALL_MIN_CARD_WIDTH = 188
const WALL_MAX_COLUMNS = 7
const WALL_GAP = 6
const WALL_ROW_HEIGHT = 22
const WALL_ROW_OVERSCAN = 12
const WALL_ROW_WINDOW_STEP = 6
const PLAYLIST_HEADER_HEIGHT = 40
const PLAYLIST_FOOTER_HEIGHT = 0
const PLAYLIST_PLACEHOLDER_HEIGHT = 34
const PLAYLIST_RECOMMENDATION_HEIGHT = 114
const WALL_OVERSCAN_PX = 480
const SEARCH_DEBOUNCE_MS = 120
const PREVIEW_DURATION_GAP_MS = 4000
const ALBUM_HOVER_DELAY_MS = 200
const ALBUM_HOVER_ROW_GAP = 8
const ALBUM_HOVER_PADDING = 8
const THEME_STORAGE_KEY = 'playlist-wall-theme'
const SETTINGS_STORAGE_KEY = 'playlist-wall-settings'
const PATCH_COALESCE_MS = 300
const RECOMMENDATION_COUNT = 4
const RECOMMENDATION_FETCH_COUNT = Math.max(RECOMMENDATION_COUNT * 3, 12)
const RECOMMENDATION_CONCURRENCY = 2
const QR_LOGIN_POLL_MS = 1400
const UI_SCALE_MIN = 80
const UI_SCALE_MAX = 125
const UI_SCALE_STEP = 5
const UI_SCALE_DEFAULT = 100

const TEXT = {
  tabOwned: '\u81ea\u5df1\u521b\u5efa',
  tabSubscribed: '\u6536\u85cf\u8ba2\u9605',
  loadingFailed: '\u52a0\u8f7d\u5931\u8d25\uff1a',
  initFailed: '\u521d\u59cb\u5316\u5931\u8d25',
  loadingDefault: '\u6b63\u5728\u521d\u59cb\u5316...',
  noPlaylists: '\u6ca1\u6709\u52a0\u8f7d\u5230\u6b4c\u5355\uff0c\u8bf7\u68c0\u67e5\u767b\u5f55\u6001\u6216\u7f13\u5b58\u3002',
  noMatch: '\u5f53\u524d\u641c\u7d22\u6ca1\u6709\u547d\u4e2d\u4efb\u4f55\u6b4c\u5355',
  emptyTab: '\u5f53\u524d\u5206\u533a\u8fd8\u6ca1\u6709\u6b4c\u5355',
  emptyPlaylist: '\u8fd9\u5f20\u6b4c\u5355\u6682\u65f6\u6ca1\u6709\u53ef\u5c55\u5f00\u7684\u66f2\u76ee\u3002',
  hydratingPlaylist: '\u6b63\u5728\u7ee7\u7eed\u5c55\u5f00\u8fd9\u5f20\u6b4c\u5355...',
  unavailableTrack: '\u8fd9\u9996\u6b4c\u73b0\u5728\u64ad\u4e0d\u4e86\uff0c\u8bd5\u8bd5\u4e0b\u4e00\u9996\u3002',
  noPlayableUrl: '\u8fd9\u9996\u6b4c\u6ca1\u6709\u53ef\u64ad\u653e\u94fe\u63a5\u3002',
  playbackFailed: '\u64ad\u653e\u5931\u8d25',
  notPlaying: '\u8fd8\u6ca1\u5f00\u59cb\u64ad\u653e',
  pickTrack: '\u70b9\u4efb\u610f\u4e00\u9996\u6b4c\u5f00\u59cb',
  resolving: '\u6b63\u5728\u89e3\u6790\uff1a',
  previewTrack: '\u5f53\u524d\u662f\u8bd5\u542c\u7248',
  noCurrentTrack: '\u8fd8\u6ca1\u6709\u6b63\u5728\u64ad\u653e\u7684\u6b4c',
  locateFailed: '\u6ca1\u627e\u5230\u5f53\u524d\u64ad\u653e\u4f4d\u7f6e',
  switchedDark: '\u5df2\u5207\u6362\u5230\u9ed1\u5e95',
  switchedLight: '\u5df2\u5207\u6362\u5230\u767d\u5e95',
  locatedCurrent: '\u5df2\u5b9a\u4f4d\u5230\u5f53\u524d\u64ad\u653e',
  settings: '\u8bbe\u7f6e',
  settingsTitle: '\u754c\u9762\u8bbe\u7f6e',
  playlistRecommendations: '\u6b4c\u5355\u63a8\u8350\u97f3\u4e50',
  playlistRecommendationsHint: '\u6253\u5f00\u540e\uff0c\u6bcf\u5f20\u6b4c\u5355\u5e95\u90e8\u4f1a\u6309\u8fd9\u5f20\u6b4c\u5355\u7684\u98ce\u683c\u8865\u4e00\u7ec4\u76f8\u4f3c\u6b4c\u66f2\u3002',
  recommendationsTitle: '\u76f8\u4f3c\u63a8\u8350',
  recommendationsLoading: '\u6b63\u5728\u52a0\u8f7d\u63a8\u8350...',
  recommendationsEmpty: '\u6682\u65f6\u6ca1\u6709\u63a8\u8350',
  recommendationsFailed: '\u63a8\u8350\u52a0\u8f7d\u5931\u8d25',
  addToPlaylist: '\u52a0\u5165',
  addedToPlaylist: '\u5df2\u6536',
  addToPlaylistDone: '\u5df2\u52a0\u5165\u6b4c\u5355',
  addToPlaylistFailed: '\u52a0\u5165\u6b4c\u5355\u5931\u8d25',
  removeFromPlaylist: '\u79fb\u51fa\u6b4c\u5355',
  removeFromPlaylistDone: '\u5df2\u4ece\u6b4c\u5355\u79fb\u51fa',
  removeFromPlaylistFailed: '\u79fb\u51fa\u6b4c\u5355\u5931\u8d25',
  moveToPlaylistDone: '\u5df2\u79fb\u52a8\u5230\u6b4c\u5355',
  copyToPlaylistDone: '\u5df2\u52a0\u5165\u5230\u6b4c\u5355',
  moveToPlaylistFailed: '\u79fb\u52a8\u5230\u6b4c\u5355\u5931\u8d25',
  noMoveTarget: '\u6682\u65f6\u6ca1\u6709\u66f4\u5408\u9002\u7684\u6b4c\u5355',
  play: '\u64ad\u653e',
  pause: '\u6682\u505c',
  prev: '\u4e0a\u4e00\u9996',
  next: '\u4e0b\u4e00\u9996',
  shuffleOn: '\u968f\u673a \u5f00',
  shuffleOff: '\u968f\u673a \u5173',
  repeatAll: '\u5faa\u73af \u5168\u90e8',
  repeatOne: '\u5faa\u73af \u5355\u66f2',
  repeatOff: '\u5faa\u73af \u5173\u95ed',
  nowPlaying: '\u5728\u64ad',
  authLoadingQr: '\u6b63\u5728\u751f\u6210\u767b\u5f55\u4e8c\u7ef4\u7801...',
  authWaiting: '\u8bf7\u4f7f\u7528\u7f51\u6613\u4e91\u97f3\u4e50\u626b\u7801\u767b\u5f55\u3002',
  authConfirm: '\u5df2\u626b\u7801\uff0c\u8bf7\u5728\u624b\u673a\u4e0a\u786e\u8ba4\u767b\u5f55\u3002',
  authExpired: '\u4e8c\u7ef4\u7801\u5df2\u8fc7\u671f\uff0c\u8bf7\u5237\u65b0\u540e\u91cd\u8bd5\u3002',
  authLoggedIn: '\u767b\u5f55\u6210\u529f\uff0c\u6b63\u5728\u8f7d\u5165\u6b4c\u5355...',
  authFailed: '\u4e8c\u7ef4\u7801\u767b\u5f55\u5931\u8d25\uff1a',
  loginSuccess: '\u767b\u5f55\u6210\u529f',
  plaintextSessionWarning: '\u5f53\u524d\u7cfb\u7edf\u4e0d\u652f\u6301\u5b89\u5168\u5b58\u50a8\uff0c\u767b\u5f55\u6001 cookie \u4f1a\u4ee5\u660e\u6587\u4fdd\u5b58\u5728 userData/session.json \u3002',
  logout: '\u9000\u51fa\u767b\u5f55',
  logoutDone: '\u5df2\u9000\u51fa\u5f53\u524d\u8d26\u53f7',
  logoutFailed: '\u9000\u51fa\u767b\u5f55\u5931\u8d25',
}

const state = {
  account: null,
  playlists: [],
  playlistMap: new Map(),
  recommendations: new Map(),
  activeTab: 'owned',
  visiblePlaylists: [],
  search: '',
  queue: [],
  queueMode: '',
  queuePlaylistId: null,
  queueContextLabel: '',
  queueIndex: -1,
  currentTrackId: null,
  isPlaying: false,
  isResolving: false,
  isPreview: false,
  shuffle: false,
  repeat: 'all',
  playToken: 0,
  theme: loadStoredTheme(),
  settings: loadStoredSettings(),
  layout: { columns: 1 },
  localPlayCounts: new Map(),
  cloudPlayCounts: new Map(),
  combinedPlayCounts: new Map(),
  trackPlayTiers: new Map(),
  artistPlaylistSets: new Map(),
  totalOwnedPlaylistCount: 0,
}

const refs = {}
const appBridge = resolveBridge()
const renderRuntime = {
  wallRenderToken: 0,
  wallRenderFrame: 0,
  wallViewportFrame: 0,
  searchTimer: 0,
  patchFlushTimer: 0,
  wallColumns: [],
  wallNodeMaps: [],
  wallPlacementsByColumn: [],
  wallTrackAnchors: new Map(),
  wallRenderedKeys: [],
  renderedPlaylistIds: new Set(),
  pendingPlaylistPatches: [],
  pendingPatchDone: false,
  recommendationSessionId: 0,
  recommendationGlobalError: '',
  recommendationQueue: [],
  recommendationInFlight: 0,
  renderedTrackKey: '',
  renderedRecommendationKey: '',
  renderedPlaylistId: null,
  authPollTimer: 0,
  authLoginKey: '',
  contextMenuTrack: null,
  albumHoverTimer: 0,
  albumHoverPendingKey: '',
  albumHoverTrackKey: '',
}

document.addEventListener('DOMContentLoaded', () => {
  void bootstrapApp()
})

async function bootstrapApp() {
  cacheRefs()
  await hydrateStoredPreferences()
  applyUiScale(state.settings.uiScale)
  applyTheme(state.theme, { silent: true, persistLocal: false })
  renderSettings()
  bindEvents()
  wireBridge()
  await init()
}

function resolveBridge() {
  const useMock = new URLSearchParams(window.location.search).get('mock') === '1'
  if (!useMock && window.bridge && typeof window.bridge.init === 'function') {
    return window.bridge
  }
  return createMockBridge()
}

function createMockBridge() {
  const params = new URLSearchParams(window.location.search)
  const progressive = params.get('progressive') === '1'
  const huge = params.get('huge') === '1'
  const authRequired = params.get('auth') === '1'
  const authAuto = params.get('authAuto') !== '0'
  const progressListeners = new Set()
  const patchListeners = new Set()
  const account = { userId: 1, nickname: '\u793a\u4f8b\u8d26\u53f7' }
  let loggedIn = !authRequired
  let qrChecks = 0
  const localPlayCounts = {
    101001: 6,
    101002: 3,
  }
  const cloudPlayCounts = {
    101001: 42,
    101002: 18,
    101003: 8,
    102001: 14,
  }
  let storedSettings = {}
  try {
    storedSettings = JSON.parse(window.localStorage.getItem(SETTINGS_STORAGE_KEY) || '{}')
  } catch {}
  let storedPreferences = {
    theme: window.localStorage.getItem(THEME_STORAGE_KEY) || 'light',
    showPlaylistRecommendations: Boolean(storedSettings.showPlaylistRecommendations),
    uiScale: normalizeUiScale(storedSettings.uiScale),
  }
  const basePlaylists = huge
    ? buildHugeMockPlaylists()
    : [
      buildMockPlaylist(101, '\u6211\u559c\u6b22\u7684\u97f3\u4e50', 64, 1, false, '', { hydrating: progressive, hydrated: !progressive, tracks: progressive ? [] : null, specialType: 5 }),
      buildMockPlaylist(102, '\u81ea\u5efa\u7535\u5b50', 42, 1, false),
      buildMockPlaylist(103, '\u81ea\u5efa\u7eaf\u97f3', 28, 1, false),
      buildMockPlaylist(201, '\u6536\u85cf\u7235\u58eb', 35, 2, true),
      buildMockPlaylist(202, '\u6536\u85cf\u6c1b\u56f4', 52, 3, true),
      buildMockPlaylist(203, '\u79c1\u5bc6\u6b4c\u5355', 18, 4, true, '\u8be5\u6b4c\u5355\u662f\u79c1\u5bc6\u7684\uff0c\u65e0\u6cd5\u5c55\u5f00\u3002'),
    ]
  const recommendationStore = new Map()
  const emitProgress = (payload) => progressListeners.forEach((listener) => listener(payload))
  const emitPatch = (payload) => patchListeners.forEach((listener) => listener(payload))

  return {
    getPreferences: async () => ({
      ok: true,
        preferences: {
          theme: storedPreferences.theme === 'dark' ? 'dark' : 'light',
          showPlaylistRecommendations: Boolean(storedPreferences.showPlaylistRecommendations),
          uiScale: normalizeUiScale(storedPreferences.uiScale),
        },
      }),
    savePreferences: async (preferences) => {
      storedPreferences = {
        ...storedPreferences,
        ...preferences,
        uiScale: normalizeUiScale(preferences?.uiScale ?? storedPreferences.uiScale),
      }
      return {
        ok: true,
        preferences: {
          theme: storedPreferences.theme === 'dark' ? 'dark' : 'light',
          showPlaylistRecommendations: Boolean(storedPreferences.showPlaylistRecommendations),
          uiScale: normalizeUiScale(storedPreferences.uiScale),
        },
      }
    },
    init: async () => {
      if (!loggedIn) {
        return {
          ok: true,
          needsLogin: true,
        }
      }

      if (progressive) {
        window.setTimeout(() => {
          emitPatch({
            playlists: [buildMockPlaylist(101, '\u6211\u559c\u6b22\u7684\u97f3\u4e50', 64, 1, false, '', { hydrated: true, hydrating: false, specialType: 5 })],
            done: true,
          })
        }, 260)
      }
      window.__mockStats = {
        playlistCount: basePlaylists.length,
        trackCount: basePlaylists.reduce((sum, playlist) => sum + playlist.tracks.length, 0),
      }
      return {
        ok: true,
        account,
        playlists: basePlaylists,
        playback: {
          localPlayCounts,
          cloudPlayCounts,
        },
      }
    },
    startQrLogin: async () => {
      qrChecks = 0
      return {
        ok: true,
        key: 'mock-login-key',
        qrUrl: 'https://music.163.com/mock-login',
        qrImage: buildMockQrImage(),
      }
    },
    checkQrLogin: async () => {
      qrChecks += 1

      if (!authAuto) {
        return {
          ok: true,
          status: qrChecks > 1 ? 'confirm' : 'waiting',
          message: qrChecks > 1 ? TEXT.authConfirm : TEXT.authWaiting,
        }
      }

      if (qrChecks < 2) {
        return {
          ok: true,
          status: 'waiting',
          message: TEXT.authWaiting,
        }
      }

      loggedIn = true
      return {
        ok: true,
        status: 'authorized',
        message: TEXT.loginSuccess,
      }
    },
    logout: async () => {
      loggedIn = false
      qrChecks = 0
      return { ok: true }
    },
    getSongUrl: async () => ({ ok: false, error: '\u6a21\u62df\u6a21\u5f0f\u4e0d\u63d0\u4f9b\u97f3\u9891\u94fe\u63a5' }),
    recordTrackPlay: async (_userId, trackId) => {
      const key = String(Number(trackId || 0))
      localPlayCounts[key] = Number(localPlayCounts[key] || 0) + 1
      return { ok: true, localPlayCount: localPlayCounts[key] }
    },
    getPlaylistRecommendations: async (playlistId) => {
      if (!recommendationStore.has(playlistId)) {
        recommendationStore.set(playlistId, buildMockRecommendations(playlistId))
      }
      return { ok: true, tracks: recommendationStore.get(playlistId) }
    },
    addTrackToPlaylist: async () => ({ ok: true }),
    removeTrackFromPlaylist: async () => ({ ok: true }),
    onProgress: (callback) => {
      progressListeners.add(callback)
      callback({ message: progressive ? '\u6b4c\u5355\u5899\u5df2\u6253\u5f00\uff0c\u6b63\u5728\u7ee7\u7eed\u5c55\u5f00...' : '\u6a21\u62df\u6570\u636e\u5df2\u5c31\u7eea', pct: 100 })
      return () => progressListeners.delete(callback)
    },
    onPlaylistPatch: (callback) => {
      patchListeners.add(callback)
      return () => patchListeners.delete(callback)
    },
  }
}

function buildMockQrImage() {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320">
      <rect width="320" height="320" fill="#ffffff"/>
      <rect x="18" y="18" width="284" height="284" rx="18" fill="#ffffff" stroke="#111111" stroke-width="10"/>
      <rect x="42" y="42" width="68" height="68" fill="#111111"/>
      <rect x="54" y="54" width="44" height="44" fill="#ffffff"/>
      <rect x="66" y="66" width="20" height="20" fill="#111111"/>
      <rect x="210" y="42" width="68" height="68" fill="#111111"/>
      <rect x="222" y="54" width="44" height="44" fill="#ffffff"/>
      <rect x="234" y="66" width="20" height="20" fill="#111111"/>
      <rect x="42" y="210" width="68" height="68" fill="#111111"/>
      <rect x="54" y="222" width="44" height="44" fill="#ffffff"/>
      <rect x="66" y="234" width="20" height="20" fill="#111111"/>
      <rect x="146" y="42" width="20" height="20" fill="#111111"/>
      <rect x="146" y="74" width="20" height="20" fill="#111111"/>
      <rect x="134" y="118" width="32" height="32" fill="#111111"/>
      <rect x="190" y="134" width="20" height="20" fill="#111111"/>
      <rect x="150" y="166" width="24" height="24" fill="#111111"/>
      <rect x="182" y="182" width="44" height="20" fill="#111111"/>
      <rect x="146" y="214" width="20" height="20" fill="#111111"/>
      <rect x="178" y="230" width="20" height="20" fill="#111111"/>
      <text x="160" y="298" font-size="20" font-family="sans-serif" text-anchor="middle" fill="#111111">\u6b4c\u5355\u5899</text>
    </svg>
  `)}`
}

function buildHugeMockPlaylists() {
  const playlists = []

  for (let index = 0; index < 36; index += 1) {
    const owned = index < 18
    playlists.push(buildMockPlaylist(
      1000 + index,
      owned && index === 0 ? '\u6211\u559c\u6b22\u7684\u97f3\u4e50' : `${owned ? '\u81ea\u5efa' : '\u6536\u85cf'}\u5927\u6b4c\u5355 ${index + 1}`,
      180 + ((index % 6) * 24),
      owned ? 1 : 200 + index,
      !owned,
      '',
      { specialType: owned && index === 0 ? 5 : 0 }
    ))
  }

  return playlists
}

function buildMockPlaylist(id, name, trackCount, creatorId, subscribed, trackError = '', options = {}) {
  const explicitTracks = Array.isArray(options.tracks) ? options.tracks : null
  const tracks = explicitTracks || (trackError ? [] : Array.from({ length: trackCount }, (_, index) => ({
    albumId: (index % 9) + 1,
    albumCoverUrl: buildMockCover((index % 9) + 1),
    id: id * 1000 + index + 1,
    position: index + 1,
    name: `${name} ${index + 1}`,
    artists: [`\u827a\u672f\u5bb6 ${((index % 5) + 1)}`],
    album: `\u4e13\u8f91 ${((index % 9) + 1)}`,
    durationMs: 160000 + ((index % 6) * 10000),
  })))

  return {
    id,
    name,
    trackCount,
    coverUrl: buildMockCover(id),
    specialType: Number(options.specialType || 0),
    subscribed,
    creatorId,
    tracks,
    tracksError: trackError,
    hydrated: options.hydrated !== undefined ? Boolean(options.hydrated) : !options.hydrating,
    hydrating: Boolean(options.hydrating),
  }
}

function buildMockCover(seed) {
  const digit = String(seed).slice(-2)
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
      <rect width="64" height="64" fill="#f5f5f5"/>
      <rect x="6" y="6" width="52" height="52" rx="8" fill="#111111"/>
      <text x="32" y="38" font-size="18" font-family="sans-serif" text-anchor="middle" fill="#ffffff">${digit}</text>
    </svg>
  `)}`
}

function buildMockRecommendations(seed, count = RECOMMENDATION_FETCH_COUNT) {
  return Array.from({ length: count }, (_, index) => ({
    id: seed * 100000 + index + 1,
    position: index + 1,
    name: `\u63a8\u8350 ${index + 1}`,
    artists: [`\u63a8\u8350\u827a\u4eba ${index + 1}`],
    album: `\u63a8\u8350\u4e13\u8f91 ${index + 1}`,
    albumId: seed * 10 + index + 1,
    albumCoverUrl: buildMockCover(seed + index + 1),
    durationMs: 185000 + index * 9000,
  }))
}

function toCountMap(counts) {
  const map = new Map()
  for (const [trackId, count] of Object.entries(counts || {})) {
    const normalizedTrackId = Number(trackId)
    const normalizedCount = Number(count || 0)
    if (normalizedTrackId > 0 && normalizedCount > 0) {
      map.set(normalizedTrackId, normalizedCount)
    }
  }
  return map
}

function hydratePlaybackStats(playback = {}) {
  state.localPlayCounts = toCountMap(playback.localPlayCounts)
  state.cloudPlayCounts = toCountMap(playback.cloudPlayCounts)
  rebuildTrackPlayTiers()
}

function rebuildTrackPlayTiers() {
  const combined = new Map()
  const uniqueTrackIds = new Set()

  for (const playlist of state.playlists) {
    for (const track of playlist.tracks || []) {
      uniqueTrackIds.add(track.id)
    }
  }

  for (const trackId of uniqueTrackIds) {
    const total = Number(state.localPlayCounts.get(trackId) || 0) + Number(state.cloudPlayCounts.get(trackId) || 0)
    if (total > 0) {
      combined.set(trackId, total)
    }
  }

  state.combinedPlayCounts = combined
  state.trackPlayTiers = buildTrackPlayTierMap(combined)
}

function buildTrackPlayTierMap(playCounts) {
  const sorted = [...playCounts.entries()]
    .filter(([, count]) => Number(count || 0) > 0)
    .sort((left, right) => right[1] - left[1] || left[0] - right[0])

  const tierMap = new Map()
  if (!sorted.length) {
    return tierMap
  }

  const goldCount = Math.max(1, Math.ceil(sorted.length * 0.01))
  const starCount = Math.max(goldCount, Math.ceil(sorted.length * 0.1))

  for (let index = 0; index < sorted.length; index += 1) {
    const [trackId] = sorted[index]
    if (index < goldCount) {
      tierMap.set(trackId, 'gold')
    } else if (index < starCount) {
      tierMap.set(trackId, 'star')
    }
  }

  return tierMap
}

function getTrackPlayTier(trackId) {
  return state.trackPlayTiers.get(Number(trackId)) || ''
}

function normalizeUiScale(input) {
  const numeric = Number(input)
  if (!Number.isFinite(numeric)) {
    return UI_SCALE_DEFAULT
  }

  return clamp(
    Math.round(numeric / UI_SCALE_STEP) * UI_SCALE_STEP,
    UI_SCALE_MIN,
    UI_SCALE_MAX
  )
}

function getUiScaleFactor() {
  return normalizeUiScale(state.settings.uiScale) / 100
}

function getLayoutMetrics() {
  const scale = getUiScaleFactor()
  return {
    cardWidth: Math.max(144, Math.round(WALL_MIN_CARD_WIDTH * scale)),
    gap: Math.max(4, Math.round(WALL_GAP * scale)),
    rowHeight: Math.max(18, Math.round(WALL_ROW_HEIGHT * scale)),
    headerHeight: Math.max(30, Math.round(PLAYLIST_HEADER_HEIGHT * scale)),
    footerHeight: Math.max(0, Math.round(PLAYLIST_FOOTER_HEIGHT * scale)),
    placeholderHeight: Math.max(24, Math.round(PLAYLIST_PLACEHOLDER_HEIGHT * scale)),
    recommendationHeight: Math.max(90, Math.round(PLAYLIST_RECOMMENDATION_HEIGHT * scale)),
    overscanPx: Math.max(WALL_OVERSCAN_PX, Math.round(WALL_OVERSCAN_PX * scale)),
    albumHoverGap: Math.max(4, Math.round(ALBUM_HOVER_ROW_GAP * scale)),
    albumHoverPadding: Math.max(6, Math.round(ALBUM_HOVER_PADDING * scale)),
    wallPaddingX: Math.max(8, Math.round(10 * scale)),
  }
}

function cacheRefs() {
  refs.loading = document.getElementById('loading')
  refs.loadingStage = document.getElementById('loading-stage')
  refs.progressBar = document.getElementById('progress-bar')
  refs.authScreen = document.getElementById('auth-screen')
  refs.authQrImage = document.getElementById('auth-qr-image')
  refs.authStage = document.getElementById('auth-stage')
  refs.authRefreshBtn = document.getElementById('auth-refresh-btn')
  refs.app = document.getElementById('app')
  refs.accountLine = document.getElementById('account-line')
  refs.tabOwned = document.getElementById('tab-owned')
  refs.tabSubscribed = document.getElementById('tab-subscribed')
  refs.tabOwnedCount = document.getElementById('tab-owned-count')
  refs.tabSubscribedCount = document.getElementById('tab-subscribed-count')
  refs.searchInput = document.getElementById('search-input')
  refs.themeToggleBtn = document.getElementById('theme-toggle-btn')
  refs.locateCurrentBtn = document.getElementById('locate-current-btn')
  refs.settingsBtn = document.getElementById('settings-btn')
  refs.settingsPanel = document.getElementById('settings-panel')
  refs.settingsBackdrop = document.getElementById('settings-backdrop')
  refs.settingsCloseBtn = document.getElementById('settings-close-btn')
  refs.uiScaleRange = document.getElementById('ui-scale-range')
  refs.uiScaleValue = document.getElementById('ui-scale-value')
  refs.playlistRecommendationsToggle = document.getElementById('playlist-recommendations-toggle')
  refs.settingsLogoutBtn = document.getElementById('settings-logout-btn')
  refs.contextMenu = document.getElementById('context-menu')
  refs.contextRemoveTrackBtn = document.getElementById('context-remove-track-btn')
  refs.albumHoverPreview = document.getElementById('album-hover-preview')
  refs.albumHoverPreviewImage = document.getElementById('album-hover-preview-image')
  refs.wallScroll = document.getElementById('wall-scroll')
  refs.wallColumns = document.getElementById('wall-columns')
  refs.wallEmpty = document.getElementById('wall-empty')
  refs.audio = document.getElementById('audio')
  refs.playerCover = document.getElementById('player-cover')
  refs.playerCoverImage = document.getElementById('player-cover-image')
  refs.playerTitle = document.getElementById('player-title')
  refs.playerMeta = document.getElementById('player-meta')
  refs.playBtn = document.getElementById('play-btn')
  refs.prevBtn = document.getElementById('prev-btn')
  refs.nextBtn = document.getElementById('next-btn')
  refs.shuffleBtn = document.getElementById('shuffle-btn')
  refs.repeatBtn = document.getElementById('repeat-btn')
  refs.progressRange = document.getElementById('progress-range')
  refs.currentTime = document.getElementById('player-time-current')
  refs.totalTime = document.getElementById('player-time-total')
  refs.volumeRange = document.getElementById('volume-range')
  refs.toastWrap = document.getElementById('toast-wrap')
}

function bindEvents() {
  refs.authRefreshBtn.addEventListener('click', () => {
    void startQrLoginFlow()
  })
  refs.tabOwned.addEventListener('click', () => setActiveTab('owned'))
  refs.tabSubscribed.addEventListener('click', () => setActiveTab('subscribed'))
  refs.themeToggleBtn.addEventListener('click', toggleTheme)
  refs.locateCurrentBtn.addEventListener('click', locateCurrentTrack)
  refs.settingsBtn.addEventListener('click', toggleSettingsPanel)
  refs.settingsCloseBtn.addEventListener('click', closeSettingsPanel)
  refs.settingsBackdrop.addEventListener('click', closeSettingsPanel)
  refs.uiScaleRange.addEventListener('input', handleUiScaleInput)
  refs.uiScaleRange.addEventListener('change', handleUiScaleCommit)
  refs.playlistRecommendationsToggle.addEventListener('change', handleSettingsChange)
  refs.settingsLogoutBtn.addEventListener('click', () => {
    void handleLogout()
  })
  refs.searchInput.addEventListener('input', (event) => {
    state.search = event.target.value
    window.clearTimeout(renderRuntime.searchTimer)
    renderRuntime.searchTimer = window.setTimeout(() => {
      applyFilters()
    }, SEARCH_DEBOUNCE_MS)
  })
  refs.wallScroll.addEventListener('scroll', () => {
    closeContextMenu()
    hideAlbumHoverPreview()
    handleWallScroll()
  }, { passive: true })
  refs.wallColumns.addEventListener('click', handleWallClick)
  refs.wallColumns.addEventListener('contextmenu', handleWallContextMenu)
  refs.wallColumns.addEventListener('pointerover', handleWallPointerOver)
  refs.wallColumns.addEventListener('pointerout', handleWallPointerOut)
  refs.contextMenu.addEventListener('click', handleContextMenuClick)
  refs.playBtn.addEventListener('click', togglePlayback)
  refs.prevBtn.addEventListener('click', previousTrack)
  refs.nextBtn.addEventListener('click', () => nextTrack({ fromEnded: false }))
  refs.shuffleBtn.addEventListener('click', () => {
    state.shuffle = !state.shuffle
    renderPlayer()
  })
  refs.repeatBtn.addEventListener('click', cycleRepeatMode)
  refs.progressRange.addEventListener('input', () => {
    if (!Number.isFinite(refs.audio.duration) || refs.audio.duration <= 0) return
    refs.currentTime.textContent = formatTime((Number(refs.progressRange.value) / 1000) * refs.audio.duration)
  })
  refs.progressRange.addEventListener('change', () => {
    if (!Number.isFinite(refs.audio.duration) || refs.audio.duration <= 0) return
    refs.audio.currentTime = (Number(refs.progressRange.value) / 1000) * refs.audio.duration
  })
  refs.volumeRange.addEventListener('input', () => {
    refs.audio.volume = Number(refs.volumeRange.value) / 100
  })
  refs.audio.addEventListener('play', () => {
    state.isPlaying = true
    renderPlayer()
  })
  refs.audio.addEventListener('pause', () => {
    state.isPlaying = false
    renderPlayer()
  })
  refs.audio.addEventListener('loadedmetadata', () => {
    updatePreviewState()
    updateProgressUI()
    renderPlayer()
  })
  refs.audio.addEventListener('timeupdate', updateProgressUI)
  refs.audio.addEventListener('ended', () => {
    if (state.repeat === 'one') return playQueueIndex(state.queueIndex)
    nextTrack({ fromEnded: true })
  })
  refs.audio.addEventListener('error', () => {
    state.isResolving = false
    showToast(TEXT.unavailableTrack, 'error')
    renderPlayer()
  })
  window.addEventListener('resize', () => {
    hideAlbumHoverPreview()
    scheduleWallRender()
  })
  window.addEventListener('blur', closeContextMenu)
  window.addEventListener('blur', hideAlbumHoverPreview)
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('mousedown', handleDocumentPointerDown, true)
  refs.audio.volume = Number(refs.volumeRange.value) / 100
}

function wireBridge() {
  if (appBridge && typeof appBridge.onProgress === 'function') {
    appBridge.onProgress((payload) => {
      refs.loadingStage.textContent = payload?.message || ''
      refs.progressBar.style.width = `${payload?.pct || 0}%`
    })
  }
  if (appBridge && typeof appBridge.onPlaylistPatch === 'function') {
    appBridge.onPlaylistPatch((payload) => mergePlaylistPatch(payload?.playlists || [], { done: Boolean(payload?.done) }))
  }
}

async function init() {
  showLoadingScreen()
  const result = await appBridge.init()
  if (!result.ok) {
    refs.loadingStage.textContent = `${TEXT.loadingFailed}${result.error}`
    refs.progressBar.style.background = '#111111'
    showToast(result.error || TEXT.initFailed, 'error')
    return
  }

  if (result.needsLogin) {
    resetAppState()
    showAuthScreen()
    await startQrLoginFlow()
    return
  }

  state.account = result.account || null
  hydratePlaybackStats(result.playback)
  setPlaylists(sortWallPlaylists((result.playlists || []).map(normalizePlaylist)))
  await revealApp()
  renderTabs()
  renderHeader()
  renderPlayer()
  applyFilters()

  if (result.sessionStorageMode === 'plain-text-fallback') {
    showToast(TEXT.plaintextSessionWarning, 'error')
  }

  if (!state.playlists.length) {
    showToast(TEXT.noPlaylists, 'error')
  }
}

async function revealApp() {
  stopAuthPolling()
  refs.authScreen.classList.add('hidden')
  refs.loading.classList.add('hidden')
  refs.app.classList.remove('hidden')
  await new Promise((resolve) => window.requestAnimationFrame(() => window.requestAnimationFrame(resolve)))
}

function showLoadingScreen(message = TEXT.loadingDefault) {
  refs.loading.classList.remove('hidden')
  refs.authScreen.classList.add('hidden')
  refs.app.classList.add('hidden')
  refs.loadingStage.textContent = message
  refs.progressBar.style.width = '0%'
  refs.progressBar.style.background = '#111111'
}

function showAuthScreen(message = TEXT.authLoadingQr) {
  refs.loading.classList.add('hidden')
  refs.app.classList.add('hidden')
  refs.authScreen.classList.remove('hidden')
  refs.authStage.textContent = message
}

function stopAuthPolling() {
  window.clearTimeout(renderRuntime.authPollTimer)
  renderRuntime.authPollTimer = 0
}

async function startQrLoginFlow() {
  stopAuthPolling()
  renderRuntime.authLoginKey = ''
  refs.authRefreshBtn.disabled = true
  refs.authStage.textContent = TEXT.authLoadingQr

  const result = await appBridge.startQrLogin()
  refs.authRefreshBtn.disabled = false

  if (!result.ok) {
    refs.authStage.textContent = `${TEXT.authFailed}${result.error || TEXT.initFailed}`
    showToast(result.error || TEXT.initFailed, 'error')
    return
  }

  renderRuntime.authLoginKey = result.key || ''
  if (result.qrImage) {
    refs.authQrImage.src = result.qrImage
  }
  refs.authStage.textContent = TEXT.authWaiting
  scheduleQrLoginCheck()
}

function scheduleQrLoginCheck() {
  stopAuthPolling()
  renderRuntime.authPollTimer = window.setTimeout(() => {
    void checkQrLoginStatus()
  }, QR_LOGIN_POLL_MS)
}

async function checkQrLoginStatus() {
  if (!renderRuntime.authLoginKey) {
    return
  }

  const result = await appBridge.checkQrLogin(renderRuntime.authLoginKey)
  if (!result.ok) {
    refs.authStage.textContent = `${TEXT.authFailed}${result.error || TEXT.initFailed}`
    showToast(result.error || TEXT.initFailed, 'error')
    return
  }

  if (result.status === 'waiting') {
    refs.authStage.textContent = result.message || TEXT.authWaiting
    scheduleQrLoginCheck()
    return
  }

  if (result.status === 'confirm') {
    refs.authStage.textContent = result.message || TEXT.authConfirm
    scheduleQrLoginCheck()
    return
  }

  if (result.status === 'expired') {
    refs.authStage.textContent = result.message || TEXT.authExpired
    return
  }

  if (result.status === 'authorized') {
    refs.authStage.textContent = result.message || TEXT.authLoggedIn
    showLoadingScreen(TEXT.authLoggedIn)
    showToast(TEXT.loginSuccess)
    await init()
  }
}

function resetAppState() {
  stopAuthPolling()
  closeContextMenu()
  hideAlbumHoverPreview()
  cancelWallRenderWork()
  state.account = null
  state.playlists = []
  state.playlistMap = new Map()
  state.recommendations = new Map()
  state.visiblePlaylists = []
  state.search = ''
  state.queue = []
  state.queueMode = ''
  state.queuePlaylistId = null
  state.queueContextLabel = ''
  state.queueIndex = -1
  state.currentTrackId = null
  state.isPlaying = false
  state.isResolving = false
  state.isPreview = false
  state.localPlayCounts = new Map()
  state.cloudPlayCounts = new Map()
  state.combinedPlayCounts = new Map()
  state.trackPlayTiers = new Map()
  renderRuntime.wallColumns = []
  renderRuntime.wallNodeMaps = []
  renderRuntime.wallPlacementsByColumn = []
  renderRuntime.wallTrackAnchors = new Map()
  renderRuntime.wallRenderedKeys = []
  renderRuntime.renderedPlaylistIds = new Set()
  renderRuntime.renderedTrackKey = ''
  renderRuntime.renderedRecommendationKey = ''
  renderRuntime.renderedPlaylistId = null
  refs.searchInput.value = ''
  refs.wallColumns.replaceChildren()
  refs.wallEmpty.classList.add('hidden')
  refs.audio.pause()
  refs.audio.removeAttribute('src')
  refs.audio.load()
  renderPlayer()
}

async function handleLogout() {
  closeSettingsPanel()
  const result = await appBridge.logout()

  if (!result.ok) {
    showToast(result.error || TEXT.logoutFailed, 'error')
    return
  }

  resetAppState()
  showToast(TEXT.logoutDone)
  showAuthScreen()
  await startQrLoginFlow()
}

function buildPlaylistProfile(playlistName, tracks) {
  const artistCounts = {}
  const albumCounts = {}

  for (const track of tracks) {
    for (const artistKey of getTrackArtistKeys(track)) {
      artistCounts[artistKey] = Number(artistCounts[artistKey] || 0) + 1
    }

    const albumKey = getAlbumKey(track)
    if (albumKey) {
      albumCounts[albumKey] = Number(albumCounts[albumKey] || 0) + 1
    }
  }

  return {
    artistCounts,
    albumCounts,
    searchText: normalizeQuery(playlistName || ''),
  }
}

function getTrackArtistKeys(track) {
  return [...new Set((track?.artists || []).map((artist) => normalizeQuery(artist)).filter(Boolean))]
}

function getAlbumKey(track) {
  const albumId = Number(track?.albumId || 0)
  if (albumId > 0) {
    return `id:${albumId}`
  }

  const albumName = normalizeQuery(track?.album || '')
  return albumName ? `name:${albumName}` : ''
}

function rebuildArtistIndex() {
  const sets = new Map()
  const owned = getOwnedPlaylists()
  state.totalOwnedPlaylistCount = owned.length

  for (const playlist of owned) {
    const seen = new Set()
    for (const track of playlist.tracks) {
      for (const artistKey of getTrackArtistKeys(track)) {
        if (seen.has(artistKey)) continue
        seen.add(artistKey)
        let s = sets.get(artistKey)
        if (!s) {
          s = new Set()
          sets.set(artistKey, s)
        }
        s.add(playlist.id)
      }
    }
  }

  state.artistPlaylistSets = sets
}

function normalizePlaylist(playlist) {
  if (playlist?._normalized) {
    return playlist
  }

  const tracks = (playlist.tracks || []).map((track, index) => ({
    id: Number(track.id),
    position: Number(track.position || index + 1),
    name: track.name || '\u672a\u547d\u540d',
    artists: Array.isArray(track.artists) ? track.artists : [],
    album: track.album || '',
    albumId: Number(track.albumId || 0),
    albumCoverUrl: track.albumCoverUrl || '',
    durationMs: Number(track.durationMs || 0),
    searchText: normalizeQuery([
      track.name || '',
      track.album || '',
      Array.isArray(track.artists) ? track.artists.join(' ') : '',
    ].join(' ')),
  })).filter((track) => track.id > 0)

  return {
    id: Number(playlist.id),
    name: playlist.name || '\u672a\u547d\u540d\u6b4c\u5355',
    trackCount: Number(playlist.trackCount || tracks.length || 0),
    coverUrl: playlist.coverUrl || '',
    dominantAlbumCoverUrl: resolveDominantAlbumCover(tracks, playlist.coverUrl || ''),
    specialType: Number(playlist.specialType || 0),
    creatorId: Number(playlist.creatorId || 0),
    subscribed: Boolean(playlist.subscribed),
    tracks,
    profile: buildPlaylistProfile(playlist.name || '', tracks),
    tracksError: playlist.tracksError || '',
    hydrated: Boolean(playlist.hydrated),
    hydrating: Boolean(playlist.hydrating) && !playlist.hydrated,
    searchText: normalizeQuery(playlist.name || ''),
    _normalized: true,
  }
}

function setPlaylists(playlists) {
  state.playlists = playlists
  state.playlistMap = new Map(playlists.map((playlist) => [playlist.id, playlist]))
  rebuildTrackPlayTiers()
  rebuildArtistIndex()
  refreshAllRecommendationTracks()
}

function resolveDominantAlbumCover(tracks, fallbackCoverUrl) {
  const coverCount = new Map()
  let bestCoverUrl = fallbackCoverUrl || ''
  let bestCount = 0

  for (const track of tracks) {
    const coverUrl = track.albumCoverUrl || ''
    if (!coverUrl) {
      continue
    }

    const key = track.albumId > 0 ? `album:${track.albumId}` : `cover:${track.album}|${coverUrl}`
    const next = (coverCount.get(key)?.count || 0) + 1
    coverCount.set(key, { count: next, coverUrl })

    if (next > bestCount) {
      bestCount = next
      bestCoverUrl = coverUrl
    }
  }

  return bestCoverUrl
}

function sortWallPlaylists(playlists) {
  return [...playlists].sort((left, right) => {
    const diff = Math.max(right.trackCount, right.tracks.length) - Math.max(left.trackCount, left.tracks.length)
    return diff || left.id - right.id
  })
}

function mergePlaylistPatch(playlists, { done = false } = {}) {
  if (Array.isArray(playlists) && playlists.length) {
    renderRuntime.pendingPlaylistPatches.push(...playlists)
  }
  renderRuntime.pendingPatchDone = renderRuntime.pendingPatchDone || done

  window.clearTimeout(renderRuntime.patchFlushTimer)
  if (renderRuntime.pendingPatchDone) {
    flushPlaylistPatches()
    return
  }

  renderRuntime.patchFlushTimer = window.setTimeout(() => {
    flushPlaylistPatches()
  }, PATCH_COALESCE_MS)
}

function flushPlaylistPatches() {
  window.clearTimeout(renderRuntime.patchFlushTimer)
  renderRuntime.patchFlushTimer = 0

  if (!renderRuntime.pendingPlaylistPatches.length) {
    renderRuntime.pendingPatchDone = false
    return
  }

  const patchesById = new Map()
  for (const playlist of renderRuntime.pendingPlaylistPatches) {
    const playlistId = Number(playlist?.id || 0)
    if (playlistId > 0) {
      patchesById.set(playlistId, playlist)
    }
  }

  renderRuntime.pendingPlaylistPatches = []
  renderRuntime.pendingPatchDone = false

  const nextPlaylists = state.playlists.slice()
  const indexById = new Map(nextPlaylists.map((playlist, index) => [playlist.id, index]))

  for (const patch of Array.from(patchesById.values(), normalizePlaylist)) {
    const index = indexById.get(patch.id)
    if (index === undefined) {
      nextPlaylists.push(patch)
    } else {
      nextPlaylists[index] = { ...nextPlaylists[index], ...patch }
    }
  }

  setPlaylists(sortWallPlaylists(nextPlaylists))
  syncQueueWithPlaylists()
  renderTabs()
  renderHeader()
  renderPlayer()
  applyFilters()
}

function syncQueueWithPlaylists() {
  if (state.queueMode !== 'playlist' || !state.queuePlaylistId) return
  const playlist = getPlaylistById(state.queuePlaylistId)
  if (!playlist || !playlist.tracks.length) return
  const currentTrackId = state.currentTrackId
  state.queue = playlist.tracks
  if (currentTrackId) {
    const nextIndex = playlist.tracks.findIndex((track) => track.id === currentTrackId)
    if (nextIndex >= 0) {
      state.queueIndex = nextIndex
      return
    }
  }
  if (state.queueIndex >= playlist.tracks.length) {
    state.queueIndex = playlist.tracks.length - 1
  }
}

function getOwnedPlaylists() {
  const accountId = Number(state.account?.userId || 0)
  return state.playlists.filter((playlist) => Number(playlist.creatorId || 0) === accountId)
}

function getSubscribedPlaylists() {
  const accountId = Number(state.account?.userId || 0)
  return state.playlists.filter((playlist) => Number(playlist.creatorId || 0) !== accountId)
}

function getSourcePlaylists() {
  return state.activeTab === 'owned' ? getOwnedPlaylists() : getSubscribedPlaylists()
}

function setActiveTab(tab) {
  if (state.activeTab === tab) return
  closeContextMenu()
  state.activeTab = tab
  renderTabs()
  renderHeader()
  applyFilters()
}

function renderTabs() {
  const ownedCount = formatNumber(getOwnedPlaylists().length)
  const subscribedCount = formatNumber(getSubscribedPlaylists().length)
  refs.tabOwnedCount.textContent = ownedCount
  refs.tabSubscribedCount.textContent = subscribedCount
  setButtonLabel(refs.tabOwned, `${TEXT.tabOwned} ${ownedCount}`)
  setButtonLabel(refs.tabSubscribed, `${TEXT.tabSubscribed} ${subscribedCount}`)
  refs.tabOwned.classList.toggle('is-active', state.activeTab === 'owned')
  refs.tabSubscribed.classList.toggle('is-active', state.activeTab === 'subscribed')
  refs.tabOwned.setAttribute('aria-selected', String(state.activeTab === 'owned'))
  refs.tabSubscribed.setAttribute('aria-selected', String(state.activeTab === 'subscribed'))
}

function renderHeader() {
  const nickname = state.account?.nickname || '\u5f53\u524d\u8d26\u53f7'
  if (refs.accountLine) {
    refs.accountLine.textContent = nickname
  }
}

function applyFilters({ syncAll = false } = {}) {
  closeContextMenu()
  hideAlbumHoverPreview()
  const query = normalizeQuery(state.search)
  const source = getSourcePlaylists()
  state.visiblePlaylists = source.flatMap((playlist) => {
    if (!query) {
      return [{ ...playlist, wallTracks: playlist.tracks, matchedCount: playlist.tracks.length, searchMode: 'all' }]
    }

    const playlistMatch = playlist.searchText.includes(query)
    const matchedTracks = playlistMatch ? playlist.tracks : playlist.tracks.filter((track) => trackMatches(track, query))
    if (!playlistMatch && !matchedTracks.length) {
      return []
    }

    return [{ ...playlist, wallTracks: matchedTracks, matchedCount: matchedTracks.length, searchMode: playlistMatch ? 'playlist' : 'track' }]
  })

  renderEmptyState(source)
  scheduleWallRenderWithOptions({ immediate: true, syncAll })
}

function renderEmptyState(sourcePlaylists) {
  if (!sourcePlaylists.length) {
    refs.wallEmpty.querySelector('.empty-title').textContent = TEXT.emptyTab
    refs.wallEmpty.querySelector('.empty-copy').textContent = '\u8fd9\u4e2a\u5206\u533a\u8fd8\u6ca1\u6709\u6b4c\u5355\u3002'
    return
  }
  if (!state.visiblePlaylists.length) {
    refs.wallEmpty.querySelector('.empty-title').textContent = TEXT.noMatch
    refs.wallEmpty.querySelector('.empty-copy').textContent = '\u6362\u4e2a\u5173\u952e\u8bcd\uff0c\u6216\u8005\u5207\u6362\u5230\u53e6\u4e00\u4e2a tab \u3002'
    return
  }
  refs.wallEmpty.querySelector('.empty-title').textContent = '\u5f53\u524d\u6ca1\u6709\u53ef\u663e\u793a\u7684\u6b4c\u5355'
  refs.wallEmpty.querySelector('.empty-copy').textContent = '\u6362\u4e2a\u5173\u952e\u8bcd\uff0c\u6216\u8005\u5207\u6362\u5230\u53e6\u4e00\u4e2a tab \u3002'
}

function renderWall({ syncAll = false } = {}) {
  cancelWallRenderWork()

  const token = ++renderRuntime.wallRenderToken
  const columns = computeColumns()
  const wallItems = buildWallItems(state.visiblePlaylists)
  state.layout.columns = columns

  if (!wallItems.length) {
    refs.wallColumns.replaceChildren()
    refs.wallEmpty.classList.remove('hidden')
    renderRuntime.wallColumns = []
    renderRuntime.wallNodeMaps = []
    renderRuntime.wallPlacementsByColumn = []
    renderRuntime.wallTrackAnchors = new Map()
    renderRuntime.wallRenderedKeys = []
    renderRuntime.renderedPlaylistIds = new Set()
    syncWallPlaybackState()
    return
  }

  refs.wallEmpty.classList.add('hidden')
  const wallPlan = buildWallPlan(wallItems, columns)
  const columnNodes = Array.from({ length: columns }, (_, columnIndex) => {
    const column = document.createElement('div')
    column.className = 'wall-column'
    column.style.height = `${wallPlan.columnHeights[columnIndex]}px`
    return column
  })

  refs.wallColumns.replaceChildren(...columnNodes)
  renderRuntime.wallColumns = columnNodes
  renderRuntime.wallNodeMaps = Array.from({ length: columns }, () => new Map())
  renderRuntime.wallPlacementsByColumn = wallPlan.placementsByColumn
  renderRuntime.wallTrackAnchors = wallPlan.trackAnchors
  renderRuntime.wallRenderedKeys = new Array(columns).fill('')
  renderRuntime.renderedPlaylistIds = new Set()

  renderWallViewport({ token, force: true, syncAll })
}

function buildWallPlan(playlists, columns) {
  const metrics = getLayoutMetrics()
  const columnHeights = new Array(columns).fill(0)
  const placementsByColumn = Array.from({ length: columns }, () => [])
  const trackAnchors = new Map()

  for (const item of playlists) {
    const columnIndex = indexOfSmallest(columnHeights)
    const height = estimateCardHeight(item)
    const top = columnHeights[columnIndex]
    const placement = {
      key: String(item.playlist.id),
      columnIndex,
      item,
      top,
      height,
      bottom: top + height,
    }

    placementsByColumn[columnIndex].push(placement)
    for (let trackIndex = 0; trackIndex < item.playlist.wallTracks.length; trackIndex += 1) {
      const track = item.playlist.wallTracks[trackIndex]
      trackAnchors.set(`${item.playlist.id}:${track.id}`, {
        top: placement.top + metrics.headerHeight + (trackIndex * metrics.rowHeight),
        playlistId: item.playlist.id,
      })
    }

    columnHeights[columnIndex] = placement.bottom + metrics.gap
  }

  return {
    placementsByColumn,
    columnHeights: columnHeights.map((height) => Math.max(0, height - metrics.gap)),
    trackAnchors,
  }
}

function buildWallItems(playlists) {
  return playlists.map((playlist) => ({ playlist }))
}

function renderWallViewport({ token = renderRuntime.wallRenderToken, force = false } = {}) {
  if (token !== renderRuntime.wallRenderToken) {
    return
  }

  const columnNodes = renderRuntime.wallColumns
  if (!columnNodes.length) {
    return
  }

  const viewportTop = refs.wallScroll.scrollTop
  const viewportBottom = viewportTop + refs.wallScroll.clientHeight
  const metrics = getLayoutMetrics()
  const overscan = Math.max(metrics.overscanPx, refs.wallScroll.clientHeight)
  const startY = Math.max(0, viewportTop - overscan)
  const endY = viewportBottom + overscan
  const nextRenderedPlaylistIds = new Set()

  for (let columnIndex = 0; columnIndex < columnNodes.length; columnIndex += 1) {
    const placements = renderRuntime.wallPlacementsByColumn[columnIndex] || []
    const visiblePlacements = collectVisiblePlacements(placements, startY, endY)
    const placementKey = visiblePlacements.map((placement) => placement.key).join('|')
    const nodeMap = renderRuntime.wallNodeMaps[columnIndex]

    if (force || renderRuntime.wallRenderedKeys[columnIndex] !== placementKey) {
      reconcileColumnCards(
        columnNodes[columnIndex],
        nodeMap,
        visiblePlacements
      )
      renderRuntime.wallRenderedKeys[columnIndex] = placementKey
    }

    for (const placement of visiblePlacements) {
      const node = nodeMap.get(placement.key)
      if (node) {
        updatePlaylistCardNode(node, placement, { force })
      }
      nextRenderedPlaylistIds.add(placement.item.playlist.id)
    }
  }

  renderRuntime.renderedPlaylistIds = nextRenderedPlaylistIds
  syncWallPlaybackState()
  primeVisibleRecommendations()
}

function reconcileColumnCards(columnNode, nodeMap, visiblePlacements) {
  const keepKeys = new Set(visiblePlacements.map((placement) => placement.key))

  for (const [key, node] of nodeMap.entries()) {
    if (keepKeys.has(key)) {
      continue
    }
    node.remove()
    nodeMap.delete(key)
  }

  let previousNode = null
  for (const placement of visiblePlacements) {
    let node = nodeMap.get(placement.key)
    if (!node) {
      node = createPlaylistCardNode(placement)
      nodeMap.set(placement.key, node)
    }

    const nextSibling = previousNode ? previousNode.nextSibling : columnNode.firstChild
    if (node.parentNode !== columnNode) {
      columnNode.insertBefore(node, nextSibling)
    } else if (node !== nextSibling) {
      columnNode.insertBefore(node, nextSibling)
    }

    previousNode = node
  }
}

function collectVisiblePlacements(placements, startY, endY) {
  if (!placements.length) {
    return []
  }

  const visible = []
  for (let index = findPlacementStartIndex(placements, startY); index < placements.length; index += 1) {
    const placement = placements[index]
    if (placement.top > endY) {
      break
    }
    visible.push(placement)
  }
  return visible
}

function findPlacementStartIndex(placements, startY) {
  let low = 0
  let high = placements.length - 1
  let result = placements.length

  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    if (placements[mid].bottom >= startY) {
      result = mid
      high = mid - 1
    } else {
      low = mid + 1
    }
  }

  return result
}

function renderPositionedPlaylistCard(placement) {
  return renderPlaylistCard(placement, getPlaylistRowWindow(placement))
}

function createPlaylistCardNode(placement) {
  const template = document.createElement('template')
  template.innerHTML = renderPositionedPlaylistCard(placement).trim()
  return template.content.firstElementChild
}

function updatePlaylistCardNode(node, placement, { force = false } = {}) {
  const rowWindow = getPlaylistRowWindow(placement)
  if (!force && node.dataset.rowWindowKey === rowWindow.key) {
    return
  }

  const rowsNode = node.querySelector('.playlist-rows')
  if (!rowsNode) {
    return
  }

  rowsNode.innerHTML = renderPlaylistRows(placement, rowWindow)
  node.dataset.rowWindowKey = rowWindow.key
}

function renderPlaylistCard(placement, rowWindow) {
  const playlist = placement.item.playlist
  const totalCount = Math.max(playlist.trackCount, playlist.tracks.length)
  const intrinsicHeight = estimateCardHeight(placement.item)
  const coverStyle = playlist.dominantAlbumCoverUrl
    ? ` style="--playlist-cover-image: url('${escapeHtml(playlist.dominantAlbumCoverUrl)}');"`
    : ''

  return `
    <article
      class="playlist-card${state.queuePlaylistId === playlist.id ? ' is-current' : ''}"
      data-playlist-id="${playlist.id}"
      data-row-window-key="${rowWindow.key}"
      style="top: ${Math.round(placement.top)}px; contain-intrinsic-size: auto ${intrinsicHeight}px;"
    >
      <div class="playlist-header${playlist.dominantAlbumCoverUrl ? ' has-cover' : ''}"${coverStyle}>
        <div class="playlist-copy">
          <div class="playlist-title" title="${escapeHtml(playlist.name)}">${escapeHtml(playlist.name)}</div>
          <div class="playlist-meta">${describePlaylistMeta(playlist, totalCount)}</div>
        </div>
      </div>
      <div class="playlist-rows">${renderPlaylistRows(placement, rowWindow)}</div>
    </article>
  `
}

function describePlaylistMeta(playlist, totalCount) {
  if (playlist.tracksError) {
    return `${formatNumber(totalCount)} \u9996`
  }
  return `${formatNumber(totalCount)} \u9996`
}

function renderPlaylistRows(placement, rowWindow) {
  const playlist = placement.item.playlist
  const tracks = playlist.wallTracks || []

  if (!tracks.length) {
    const message = playlist.hydrating ? TEXT.hydratingPlaylist : (playlist.tracksError || TEXT.emptyPlaylist)
    return `<div class="playlist-placeholder">${escapeHtml(message)}</div>`
  }

  const rows = tracks
    .slice(rowWindow.start, rowWindow.end)
    .map((track) => renderTrackRow(track, playlist.id))
    .join('')
  const topSpacer = rowWindow.topSpacer > 0
    ? `<div class="playlist-row-spacer" style="height: ${rowWindow.topSpacer}px" aria-hidden="true"></div>`
    : ''
  const bottomSpacer = rowWindow.bottomSpacer > 0
    ? `<div class="playlist-row-spacer" style="height: ${rowWindow.bottomSpacer}px" aria-hidden="true"></div>`
    : ''
  const recommendationSection = rowWindow.showRecommendations
    ? renderPlaylistRecommendationsSection(playlist)
    : ''
  return `${topSpacer}${rows}${bottomSpacer}${recommendationSection}`
}

function renderTrackRow(track, playlistId) {
  const isPlaying = state.currentTrackId === track.id
  const artists = track.artists.join('\u3001') || '\u672a\u77e5\u827a\u4eba'
  const albumCoverUrl = track.albumCoverUrl || ''
  const albumCoverAttr = albumCoverUrl
    ? ` data-album-cover-url="${escapeHtml(albumCoverUrl)}"`
    : ''
  const tierMark = renderTrackTierMark(track.id)

  return `
    <button
      class="track-row${isPlaying ? ' is-playing' : ''}"
      type="button"
      data-play-track="1"
      data-playlist-id="${playlistId}"
      data-track-id="${track.id}"
      data-track-name="${escapeHtml(track.name)}"${albumCoverAttr}
    >
      <span class="track-name" title="${escapeHtml(track.name)}">${tierMark}<span class="track-name-label">${escapeHtml(track.name)}</span></span>
      <span class="track-meta" title="${escapeHtml(artists)}">${escapeHtml(artists)}</span>
    </button>
  `
}

function renderTrackTierMark(trackId) {
  const tier = getTrackPlayTier(trackId)
  if (!tier) {
    return ''
  }

  return `<span class="track-tier-mark${tier === 'gold' ? ' track-tier-mark--gold' : ''}" aria-hidden="true">\u2605</span>`
}

function shouldRenderPlaylistRecommendations(item) {
  return state.settings.showPlaylistRecommendations
    && item.playlist.hydrated
    && !item.playlist.tracksError
    && item.playlist.tracks.length > 0
}

function pickPlaylistRecommendationSeedTrackIds(playlist) {
  const tracks = playlist.tracks || []
  if (!tracks.length) {
    return []
  }

  const candidateIndexes = [
    0,
    Math.floor(tracks.length * 0.2),
    Math.floor(tracks.length * 0.5),
    Math.floor(tracks.length * 0.8),
    tracks.length - 1,
  ]

  return [...new Set(candidateIndexes
    .map((index) => tracks[clamp(index, 0, Math.max(0, tracks.length - 1))]?.id)
    .filter((trackId) => Number(trackId) > 0))]
}

function scoreTrackAgainstPlaylist(track, playlist, options) {
  const profile = playlist.profile || { artistCounts: {}, albumCounts: {}, searchText: '' }
  const useIdf = !options || options.useIdf !== false
  const totalPlaylists = state.totalOwnedPlaylistCount || 1
  let score = 0

  for (const artistKey of getTrackArtistKeys(track)) {
    const count = Number(profile.artistCounts?.[artistKey] || 0)
    if (count > 0) {
      const idfWeight = useIdf
        ? Math.max(1, Math.log2(totalPlaylists / (state.artistPlaylistSets.get(artistKey)?.size || 1)))
        : 1
      score += count * 14 * idfWeight
    }
    if (profile.searchText && profile.searchText.includes(artistKey)) {
      score += 18
    }
  }

  const albumKey = getAlbumKey(track)
  if (albumKey) {
    score += Number(profile.albumCounts?.[albumKey] || 0) * 20
  }

  const albumText = normalizeQuery(track.album || '')
  if (albumText && profile.searchText && profile.searchText.includes(albumText)) {
    score += 10
  }

  if (useIdf) {
    score += computeCooccurrenceBonus(track, profile)
  }

  return score
}

function computeCooccurrenceBonus(track, profile) {
  const trackArtistKeys = getTrackArtistKeys(track)
  const unmatched = trackArtistKeys.filter((key) => !profile.artistCounts?.[key])
  if (unmatched.length === 0) return 0

  const playlistTopArtists = Object.entries(profile.artistCounts || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map((entry) => entry[0])

  if (playlistTopArtists.length === 0) return 0

  let bestJaccard = 0
  for (const artistA of unmatched) {
    const setA = state.artistPlaylistSets.get(artistA)
    if (!setA || setA.size === 0) continue

    for (const artistB of playlistTopArtists) {
      const setB = state.artistPlaylistSets.get(artistB)
      if (!setB || setB.size === 0) continue

      let intersection = 0
      for (const id of setA) {
        if (setB.has(id)) intersection++
      }
      const union = setA.size + setB.size - intersection
      const jaccard = union > 0 ? intersection / union : 0
      if (jaccard > bestJaccard) bestJaccard = jaccard
    }
  }

  return bestJaccard * 20
}

function getPlaylistRowWindow(placement) {
  const metrics = getLayoutMetrics()
  const playlist = placement.item.playlist
  const tracks = playlist.wallTracks || []
  const recommendationHeight = shouldRenderPlaylistRecommendations(placement.item)
    ? metrics.recommendationHeight
    : 0

  if (!tracks.length) {
    return {
      key: 'empty',
      start: 0,
      end: 0,
      topSpacer: 0,
      bottomSpacer: 0,
      showRecommendations: false,
    }
  }

  const viewportTop = refs.wallScroll.scrollTop
  const viewportBottom = viewportTop + refs.wallScroll.clientHeight
  const bodyTop = placement.top + metrics.headerHeight
  const totalRows = tracks.length
  const minWindow = Math.max(
    WALL_ROW_WINDOW_STEP * 3,
    Math.ceil((refs.wallScroll.clientHeight || 0) / metrics.rowHeight)
  )

  let start = Math.floor((viewportTop - bodyTop) / metrics.rowHeight) - WALL_ROW_OVERSCAN
  let end = Math.ceil((viewportBottom - bodyTop) / metrics.rowHeight) + WALL_ROW_OVERSCAN

  start = clamp(start, 0, totalRows)
  end = clamp(end, 0, totalRows)

  if (end < start + minWindow) {
    end = Math.min(totalRows, start + minWindow)
    start = Math.max(0, Math.min(start, end - minWindow))
  }

  start = Math.max(0, Math.floor(start / WALL_ROW_WINDOW_STEP) * WALL_ROW_WINDOW_STEP)
  end = Math.min(totalRows, Math.ceil(end / WALL_ROW_WINDOW_STEP) * WALL_ROW_WINDOW_STEP)

  if (end <= start) {
    end = Math.min(totalRows, start + WALL_ROW_WINDOW_STEP)
  }

  const showRecommendations = recommendationHeight > 0 && end >= totalRows

  return {
    key: `${start}:${end}:${showRecommendations ? 1 : 0}`,
    start,
    end,
    topSpacer: start * metrics.rowHeight,
    bottomSpacer: Math.max(
      0,
      ((totalRows - end) * metrics.rowHeight) + (showRecommendations ? 0 : recommendationHeight)
    ),
    showRecommendations,
  }
}

function renderPlaylistRecommendationsSection(playlist) {
  return `
    <section class="playlist-recommendations" data-playlist-id="${playlist.id}">
      <div class="playlist-recommendations-title">${TEXT.recommendationsTitle}</div>
      <div class="playlist-recommendations-body">${renderPlaylistRecommendationsBody(playlist.id)}</div>
    </section>
  `
}

function renderPlaylistRecommendationsBody(playlistId) {
  const recommendationState = state.recommendations.get(Number(playlistId))
  if (!recommendationState || recommendationState.status === 'idle' || recommendationState.status === 'loading') {
    if (renderRuntime.recommendationGlobalError) {
      return `<div class="playlist-recommendations-placeholder">${escapeHtml(renderRuntime.recommendationGlobalError)}</div>`
    }
    return `<div class="playlist-recommendations-placeholder">${TEXT.recommendationsLoading}</div>`
  }

  if (recommendationState.status === 'error') {
    return `<div class="playlist-recommendations-placeholder">${escapeHtml(recommendationState.errorMessage || TEXT.recommendationsFailed)}</div>`
  }

  if (!recommendationState.tracks.length) {
    return `<div class="playlist-recommendations-placeholder">${TEXT.recommendationsEmpty}</div>`
  }

  return recommendationState.tracks.map((track) => renderRecommendationRow(playlistId, track, recommendationState)).join('')
}

function renderRecommendationRow(playlistId, track, recommendationState) {
  const adding = recommendationState.addingTrackIds.has(track.id)
  const isPlaying = state.queueMode === 'recommendation'
    && Number(state.queuePlaylistId || 0) === Number(playlistId)
    && Number(state.currentTrackId || 0) === Number(track.id)
  const buttonText = adding ? '...' : '+'
  const buttonTitle = TEXT.addToPlaylist
  const artists = track.artists.join('\u3001') || '\u672a\u77e5\u827a\u4eba'
  const tierMark = renderTrackTierMark(track.id)
  const trackLabel = `${track.name} / ${artists}`

  return `
    <div class="recommendation-row" data-recommendation-row="1">
      <button
        class="recommendation-play-btn${isPlaying ? ' is-playing' : ''}"
        type="button"
        data-play-recommend-track="1"
        data-playlist-id="${playlistId}"
        data-track-id="${track.id}"
      >${tierMark}<span class="recommendation-text" title="${escapeHtml(trackLabel)}">${escapeHtml(trackLabel)}</span></button>
      <button
        class="recommendation-add-btn"
        type="button"
        data-add-recommend-track="1"
        data-playlist-id="${playlistId}"
        data-track-id="${track.id}"
        title="${escapeHtml(buttonTitle)}"
        ${adding ? 'disabled' : ''}
      >${escapeHtml(buttonText)}</button>
    </div>
  `
}

function primeVisibleRecommendations() {
  if (!state.settings.showPlaylistRecommendations) {
    return
  }

  for (const playlistId of renderRuntime.renderedPlaylistIds) {
    queuePlaylistRecommendationLoad(playlistId)
  }
}

function queuePlaylistRecommendationLoad(playlistId) {
  const playlist = getPlaylistById(playlistId)
  if (!playlist || !playlist.tracks.length) {
    return
  }

  const currentState = ensureRecommendationState(playlistId)
  if (renderRuntime.recommendationGlobalError) {
    currentState.status = 'error'
    currentState.tracks = []
    currentState.poolTracks = []
    currentState.errorMessage = renderRuntime.recommendationGlobalError
    updatePlaylistRecommendationNodes(playlistId)
    return
  }

  if (currentState.status === 'loading' || currentState.status === 'ready' || currentState.status === 'error') {
    return
  }

  currentState.status = 'loading'
  currentState.errorMessage = ''
  updatePlaylistRecommendationNodes(playlistId)

  if (!renderRuntime.recommendationQueue.includes(playlistId)) {
    renderRuntime.recommendationQueue.push(playlistId)
  }
  processRecommendationQueue()
}

function resetRecommendationRuntime() {
  renderRuntime.recommendationSessionId += 1
  renderRuntime.recommendationGlobalError = ''
  renderRuntime.recommendationQueue = []
  renderRuntime.recommendationInFlight = 0
  state.recommendations = new Map()
}

function applyRecommendationGlobalError(message) {
  renderRuntime.recommendationGlobalError = message
  renderRuntime.recommendationQueue = []
  renderRuntime.recommendationInFlight = 0

  for (const playlist of state.visiblePlaylists) {
    if (!playlist.hydrated || playlist.tracksError || !playlist.tracks.length) {
      continue
    }

    const recommendationState = ensureRecommendationState(playlist.id)
    recommendationState.status = 'error'
    recommendationState.tracks = []
    recommendationState.poolTracks = []
    recommendationState.errorMessage = message
    updatePlaylistRecommendationNodes(playlist.id)
  }
}

function ensureRecommendationState(playlistId) {
  const normalizedId = Number(playlistId)
  if (!state.recommendations.has(normalizedId)) {
    state.recommendations.set(normalizedId, {
      status: 'idle',
      tracks: [],
      poolTracks: [],
      errorMessage: '',
      addingTrackIds: new Set(),
    })
  }
  return state.recommendations.get(normalizedId)
}

function refreshAllRecommendationTracks() {
  for (const [playlistId, recommendationState] of state.recommendations.entries()) {
    if (recommendationState.status !== 'ready') {
      continue
    }

    refreshRecommendationTracks(playlistId, recommendationState)
  }
}

function refreshRecommendationTracks(playlistId, recommendationState = ensureRecommendationState(playlistId)) {
  const playlist = getPlaylistById(playlistId)
  recommendationState.tracks = pickVisibleRecommendationTracks(playlist, recommendationState.poolTracks)
  syncRecommendationQueueWithVisibleTracks(playlistId, recommendationState.tracks)
}

function pickVisibleRecommendationTracks(playlist, poolTracks) {
  const existingIds = new Set((playlist?.tracks || []).map((track) => track.id))
  return (poolTracks || [])
    .filter((track) => track.id > 0 && !existingIds.has(track.id))
    .slice(0, RECOMMENDATION_COUNT)
}

function syncRecommendationQueueWithVisibleTracks(playlistId, tracks) {
  if (state.queueMode !== 'recommendation' || Number(state.queuePlaylistId || 0) !== Number(playlistId)) {
    return
  }

  const currentTrackId = Number(state.currentTrackId || 0)
  if (!currentTrackId) {
    return
  }

  const nextIndex = tracks.findIndex((track) => track.id === currentTrackId)
  if (nextIndex === -1) {
    return
  }

  state.queue = tracks
  state.queueIndex = nextIndex
}

function processRecommendationQueue() {
  while (renderRuntime.recommendationInFlight < RECOMMENDATION_CONCURRENCY && renderRuntime.recommendationQueue.length) {
    const playlistId = renderRuntime.recommendationQueue.shift()
    const sessionId = renderRuntime.recommendationSessionId
    renderRuntime.recommendationInFlight += 1
    void fetchPlaylistRecommendations(playlistId, sessionId).finally(() => {
      if (sessionId !== renderRuntime.recommendationSessionId) {
        return
      }
      renderRuntime.recommendationInFlight = Math.max(0, renderRuntime.recommendationInFlight - 1)
      processRecommendationQueue()
    })
  }
}

async function fetchPlaylistRecommendations(playlistId, sessionId) {
  if (sessionId !== renderRuntime.recommendationSessionId) {
    return
  }

  const playlist = getPlaylistById(playlistId)
  const recommendationState = ensureRecommendationState(playlistId)
  if (!playlist || !playlist.tracks.length) {
    recommendationState.status = 'empty'
    recommendationState.tracks = []
    recommendationState.poolTracks = []
    recommendationState.errorMessage = ''
    updatePlaylistRecommendationNodes(playlistId)
    return
  }

  const seedTrackIds = pickPlaylistRecommendationSeedTrackIds(playlist)
  if (!seedTrackIds.length) {
    recommendationState.status = 'empty'
    recommendationState.tracks = []
    recommendationState.poolTracks = []
    recommendationState.errorMessage = ''
    updatePlaylistRecommendationNodes(playlistId)
    return
  }

  const result = await appBridge.getPlaylistRecommendations(playlistId, seedTrackIds, RECOMMENDATION_FETCH_COUNT)
  if (sessionId !== renderRuntime.recommendationSessionId) {
    return
  }

  if (!result.ok) {
    if (Number(result.code || 0) === 301) {
      applyRecommendationGlobalError(result.error || TEXT.recommendationsFailed)
      return
    }

    recommendationState.status = 'error'
    recommendationState.tracks = []
    recommendationState.poolTracks = []
    recommendationState.errorMessage = result.error || TEXT.recommendationsFailed
    updatePlaylistRecommendationNodes(playlistId)
    return
  }

  recommendationState.status = 'ready'
  recommendationState.errorMessage = ''
  recommendationState.poolTracks = (result.tracks || [])
    .filter((track) => track.id > 0)
    .map((track) => ({
      ...track,
      _recommendationScore: scoreTrackAgainstPlaylist(track, playlist),
    }))
    .sort((left, right) => right._recommendationScore - left._recommendationScore || left.id - right.id)
  refreshRecommendationTracks(playlistId, recommendationState)
  updatePlaylistRecommendationNodes(playlistId)
}

function updatePlaylistRecommendationNodes(playlistId) {
  const sections = refs.wallColumns.querySelectorAll(`.playlist-recommendations[data-playlist-id="${playlistId}"] .playlist-recommendations-body`)
  if (!sections.length) {
    return
  }

  const html = renderPlaylistRecommendationsBody(playlistId)
  sections.forEach((section) => {
    section.innerHTML = html
  })
}

function updatePlaylistRecommendationNodesForVisible() {
  const playlistIds = [...new Set(Array.from(refs.wallColumns.querySelectorAll('.playlist-recommendations[data-playlist-id]'))
    .map((section) => Number(section.getAttribute('data-playlist-id')))
    .filter((playlistId) => playlistId > 0))]

  for (const playlistId of playlistIds) {
    updatePlaylistRecommendationNodes(playlistId)
  }
}

async function addRecommendedTrackToPlaylist(playlistId, trackId) {
  const playlist = getPlaylistById(playlistId)
  const recommendationState = ensureRecommendationState(playlistId)
  const track = recommendationState.tracks.find((item) => item.id === Number(trackId))

  if (!playlist || !track || recommendationState.addingTrackIds.has(track.id)) {
    return
  }

  recommendationState.addingTrackIds.add(track.id)
  updatePlaylistRecommendationNodes(playlistId)

  const result = await appBridge.addTrackToPlaylist(playlistId, track)
  recommendationState.addingTrackIds.delete(track.id)

  if (!result.ok) {
    updatePlaylistRecommendationNodes(playlistId)
    showToast(result.error || TEXT.addToPlaylistFailed, 'error')
    return
  }

  const nextPlaylist = normalizePlaylist({
    ...playlist,
    _normalized: false,
    trackCount: Math.max(playlist.trackCount, playlist.tracks.length) + 1,
    tracks: [...playlist.tracks, { ...track, position: playlist.tracks.length + 1 }],
  })
  const nextPlaylists = state.playlists.map((item) => item.id === playlist.id ? nextPlaylist : item)
  setPlaylists(sortWallPlaylists(nextPlaylists))
  syncQueueWithPlaylists()
  renderTabs()
  renderHeader()
  renderPlayer()
  applyFilters({ syncAll: true })
  showToast(TEXT.addToPlaylistDone)
}

function handleWallClick(event) {
  closeContextMenu()
  hideAlbumHoverPreview()
  const target = event.target instanceof Element ? event.target : null
  const addButton = target ? target.closest('[data-add-recommend-track]') : null
  if (addButton) {
    addRecommendedTrackToPlaylist(
      Number(addButton.getAttribute('data-playlist-id')),
      Number(addButton.getAttribute('data-track-id'))
    )
    return
  }
  const recommendationRow = target ? target.closest('[data-play-recommend-track]') : null
  if (recommendationRow) {
    playRecommendedTrack(
      Number(recommendationRow.getAttribute('data-playlist-id')),
      Number(recommendationRow.getAttribute('data-track-id'))
    )
    return
  }
  const row = target ? target.closest('[data-play-track]') : null
  if (!row) return
  playFromPlaylist(Number(row.dataset.playlistId), Number(row.dataset.trackId))
}

function handleWallContextMenu(event) {
  hideAlbumHoverPreview()
  const target = event.target instanceof Element ? event.target : null
  const row = target ? target.closest('[data-play-track]') : null

  if (!row) {
    closeContextMenu()
    return
  }

  const playlistId = Number(row.getAttribute('data-playlist-id'))
  const trackId = Number(row.getAttribute('data-track-id'))
  const playlist = getPlaylistById(playlistId)

  if (!playlist || !isOwnedPlaylist(playlist)) {
    closeContextMenu()
    return
  }

  event.preventDefault()
  renderRuntime.contextMenuTrack = {
    playlistId,
    trackId,
    moveTargets: getRecommendedMoveTargets(playlistId, trackId),
  }
  openContextMenu(event.clientX, event.clientY)
}

function openContextMenu(clientX, clientY) {
  renderContextMenu()
  refs.contextMenu.classList.remove('hidden', 'context-menu--submenu-left')
  refs.contextMenu.style.left = '0px'
  refs.contextMenu.style.top = '0px'

  const menuWidth = refs.contextMenu.offsetWidth || 224
  const menuHeight = refs.contextMenu.offsetHeight || 52
  const submenu = refs.contextMenu.querySelector('.context-menu-submenu')
  const submenuGroup = submenu ? submenu.parentElement : null
  const submenuWidth = submenu instanceof HTMLElement ? (submenu.offsetWidth || 180) : 0
  const submenuOffsetTop = submenuGroup instanceof HTMLElement ? submenuGroup.offsetTop : 0

  const spaceRight = window.innerWidth - clientX - menuWidth - 8
  const flipLeft = submenu instanceof HTMLElement && spaceRight < submenuWidth
  if (flipLeft) refs.contextMenu.classList.add('context-menu--submenu-left')

  const submenuHeight = submenu instanceof HTMLElement ? Math.min(480, submenu.scrollHeight + 8) : 0
  const totalHeight = submenu instanceof HTMLElement
    ? Math.max(menuHeight, submenuOffsetTop + submenuHeight)
    : menuHeight
  const left = flipLeft
    ? clamp(clientX, menuWidth + submenuWidth + 8, window.innerWidth - menuWidth - 8)
    : clamp(clientX, 8, Math.max(8, window.innerWidth - menuWidth - submenuWidth - 8))
  const top = clamp(clientY, 8, Math.max(8, window.innerHeight - totalHeight - 8))
  refs.contextMenu.style.left = `${left}px`
  refs.contextMenu.style.top = `${top}px`
}

function closeContextMenu() {
  renderRuntime.contextMenuTrack = null
  refs.contextMenu.classList.add('hidden')
  refs.contextMenu.classList.remove('context-menu--submenu-left')
  refs.contextMenu.replaceChildren()
}

function createContextMenuButton(item) {
  const button = document.createElement('button')
  button.className = 'context-menu-item'
  button.type = 'button'

  if (item.className) {
    button.classList.add(item.className)
  }
  if (item.id) {
    button.id = item.id
  }
  if (item.action) {
    button.dataset.contextAction = item.action
  }
  if (item.playlistId) {
    button.dataset.targetPlaylistId = String(item.playlistId)
  }
  if (item.disabled) {
    button.disabled = true
  }
  if (item.hint) {
    const label = document.createElement('span')
    label.className = 'context-menu-item__label'
    label.textContent = item.label

    const hint = document.createElement('span')
    hint.className = 'context-menu-item__hint'
    hint.textContent = item.hint

    button.append(label, hint)
  } else {
    button.textContent = item.label
  }

  return button
}

function renderContextMenu() {
  const context = renderRuntime.contextMenuTrack
  if (!context) {
    refs.contextMenu.replaceChildren()
    return
  }

  const playlist = getPlaylistById(context.playlistId)
  const items = buildContextMenuItems(context, playlist)
  const fragment = document.createDocumentFragment()

  for (const item of items) {
    if (item.type === 'divider') {
      const divider = document.createElement('div')
      divider.className = 'context-menu-divider'
      fragment.appendChild(divider)
      continue
    }

    if (item.type === 'submenu') {
      const group = document.createElement('div')
      group.className = 'context-menu-group'

      const trigger = createContextMenuButton({
        className: 'context-menu-item--submenu-trigger',
        hint: '>',
        label: item.label,
      })
      trigger.setAttribute('aria-haspopup', 'menu')

      const submenu = document.createElement('div')
      submenu.className = 'context-menu-submenu'

      for (const child of item.children) {
        submenu.appendChild(createContextMenuButton(child))
      }

      group.append(trigger, submenu)
      fragment.appendChild(group)
      continue
    }

    fragment.appendChild(createContextMenuButton(item))
  }

  refs.contextMenu.replaceChildren(fragment)
}

function buildContextMenuItems(context, sourcePlaylist) {
  const isLikedSource = isLikedPlaylist(sourcePlaylist)
  const actionLabel = isLikedSource ? '\u52a0\u5165\u5230' : '\u79fb\u52a8\u5230'
  const moveItems = (context.moveTargets || []).length
    ? context.moveTargets.map((target) => ({
      action: 'move-track',
      label: target.name,
      type: 'button',
      playlistId: target.id,
      disabled: target.disabled,
    }))
    : [{
      action: 'move-track',
      label: TEXT.noMoveTarget,
      type: 'button',
      disabled: true,
    }]

  const items = [{
    children: moveItems,
    label: actionLabel,
    type: 'submenu',
  }]
  items.push({ type: 'divider' })
  items.push({
    action: 'remove-track',
    id: 'context-remove-track-btn',
    label: TEXT.removeFromPlaylist,
    type: 'button',
  })

  return items
}

function getRecommendedMoveTargets(sourcePlaylistId, trackId) {
  const sourcePlaylist = getPlaylistById(sourcePlaylistId)
  const track = sourcePlaylist?.tracks.find((item) => item.id === Number(trackId))
  if (!sourcePlaylist || !track) {
    return []
  }

  const candidates = getOwnedPlaylists()
    .filter((playlist) => playlist.id !== sourcePlaylist.id && !playlist.tracksError)
    .map((playlist) => {
      const alreadyContains = playlist.tracks.some((item) => item.id === track.id)
      return {
        playlist,
        alreadyContains,
        score: alreadyContains ? -1 : scoreTrackAgainstPlaylist(track, playlist),
        fallbackScore: alreadyContains ? -1 : scoreTrackAgainstPlaylist(
          { ...track, artists: [track.name, ...track.artists], album: '', albumId: 0 },
          { profile: { artistCounts: {}, albumCounts: {}, searchText: playlist.searchText } },
          { useIdf: false },
        ),
      }
    })

  return candidates
    .sort((left, right) =>
      right.score - left.score
      || right.fallbackScore - left.fallbackScore
      || right.playlist.trackCount - left.playlist.trackCount
      || left.playlist.id - right.playlist.id)
    .map((entry) => ({
      id: entry.playlist.id,
      name: entry.playlist.name,
      disabled: entry.alreadyContains,
    }))
}

function handleContextMenuClick(event) {
  const target = event.target instanceof Element ? event.target.closest('[data-context-action]') : null
  if (!target || !(target instanceof HTMLButtonElement) || target.disabled) {
    return
  }

  const action = target.dataset.contextAction || ''
  if (action === 'remove-track') {
    void removeTrackFromContextMenu()
    return
  }

  if (action === 'move-track') {
    void moveTrackFromContextMenu(Number(target.dataset.targetPlaylistId))
  }
}

function handleWallPointerOver(event) {
  const target = event.target instanceof Element ? event.target : null
  const row = target ? target.closest('[data-play-track]') : null
  if (!row) {
    return
  }

  const related = event.relatedTarget instanceof Element ? event.relatedTarget.closest('[data-play-track]') : null
  if (related === row) {
    return
  }

  scheduleAlbumHoverPreview(row)
}

function handleWallPointerOut(event) {
  const target = event.target instanceof Element ? event.target : null
  const row = target ? target.closest('[data-play-track]') : null
  if (!row) {
    return
  }

  const related = event.relatedTarget instanceof Element ? event.relatedTarget.closest('[data-play-track]') : null
  if (related === row) {
    return
  }

  const rowKey = getTrackRowKey(row)
  if (renderRuntime.albumHoverPendingKey === rowKey || renderRuntime.albumHoverTrackKey === rowKey) {
    hideAlbumHoverPreview()
  }
}

function scheduleAlbumHoverPreview(row) {
  const albumCoverUrl = row.getAttribute('data-album-cover-url') || ''
  const rowKey = getTrackRowKey(row)

  if (!albumCoverUrl) {
    hideAlbumHoverPreview()
    return
  }

  if (renderRuntime.albumHoverTrackKey === rowKey && !refs.albumHoverPreview.classList.contains('hidden')) {
    positionAlbumHoverPreview()
    return
  }

  if (renderRuntime.albumHoverPendingKey === rowKey) {
    return
  }

  window.clearTimeout(renderRuntime.albumHoverTimer)
  renderRuntime.albumHoverPendingKey = rowKey
  renderRuntime.albumHoverTimer = window.setTimeout(() => {
    showAlbumHoverPreview(row)
  }, ALBUM_HOVER_DELAY_MS)
}

function showAlbumHoverPreview(row) {
  const albumCoverUrl = row.getAttribute('data-album-cover-url') || ''
  const rowKey = getTrackRowKey(row)
  if (!albumCoverUrl || renderRuntime.albumHoverPendingKey !== rowKey) {
    return
  }

  renderRuntime.albumHoverTimer = 0
  renderRuntime.albumHoverPendingKey = ''
  renderRuntime.albumHoverTrackKey = rowKey
  refs.albumHoverPreviewImage.src = albumCoverUrl
  refs.albumHoverPreviewImage.alt = `${row.getAttribute('data-track-name') || '歌曲'} 专辑封面`
  refs.albumHoverPreview.classList.remove('hidden')
  positionAlbumHoverPreview()
}

function hideAlbumHoverPreview() {
  window.clearTimeout(renderRuntime.albumHoverTimer)
  renderRuntime.albumHoverTimer = 0
  renderRuntime.albumHoverPendingKey = ''
  renderRuntime.albumHoverTrackKey = ''
  refs.albumHoverPreview.classList.add('hidden')
  refs.albumHoverPreview.style.left = ''
  refs.albumHoverPreview.style.top = ''
  refs.albumHoverPreviewImage.removeAttribute('src')
  refs.albumHoverPreviewImage.alt = ''
}

function positionAlbumHoverPreview() {
  if (refs.albumHoverPreview.classList.contains('hidden')) {
    return
  }

  const metrics = getLayoutMetrics()

  const row = refs.wallColumns.querySelector(`.track-row[data-playlist-id="${renderRuntime.albumHoverTrackKey.split(':')[0] || ''}"][data-track-id="${renderRuntime.albumHoverTrackKey.split(':')[1] || ''}"]`)
  if (!row) {
    hideAlbumHoverPreview()
    return
  }

  const previewWidth = refs.albumHoverPreview.offsetWidth || 112
  const previewHeight = refs.albumHoverPreview.offsetHeight || 112
  const rowRect = row.getBoundingClientRect()
  const left = clamp(
    Math.round(rowRect.right - previewWidth),
    metrics.albumHoverPadding,
    Math.max(metrics.albumHoverPadding, window.innerWidth - previewWidth - metrics.albumHoverPadding)
  )
  let top = rowRect.top - previewHeight - metrics.albumHoverGap
  if (top < metrics.albumHoverPadding) {
    top = rowRect.bottom + metrics.albumHoverGap
  }
  top = clamp(
    Math.round(top),
    metrics.albumHoverPadding,
    Math.max(metrics.albumHoverPadding, window.innerHeight - previewHeight - metrics.albumHoverPadding)
  )

  refs.albumHoverPreview.style.left = `${left}px`
  refs.albumHoverPreview.style.top = `${top}px`
}

function getTrackRowKey(row) {
  return `${row.getAttribute('data-playlist-id') || ''}:${row.getAttribute('data-track-id') || ''}`
}

function handleDocumentPointerDown(event) {
  if (refs.contextMenu.classList.contains('hidden')) {
    hideAlbumHoverPreview()
    return
  }

  const target = event.target instanceof Element ? event.target : null
  if (target && refs.contextMenu.contains(target)) {
    return
  }

  closeContextMenu()
  hideAlbumHoverPreview()
}

function buildPlaylistWithTrackAdded(playlist, track) {
  if (!playlist || !track || playlist.tracks.some((item) => item.id === track.id)) {
    return playlist
  }

  return normalizePlaylist({
    ...playlist,
    _normalized: false,
    trackCount: Math.max(playlist.trackCount, playlist.tracks.length) + 1,
    tracks: [...playlist.tracks, { ...track, position: playlist.tracks.length + 1 }],
  })
}

function buildPlaylistWithoutTrack(playlist, trackId) {
  if (!playlist) {
    return playlist
  }

  const nextTracks = playlist.tracks
    .filter((track) => track.id !== Number(trackId))
    .map((track, index) => ({ ...track, position: index + 1 }))

  return normalizePlaylist({
    ...playlist,
    _normalized: false,
    trackCount: Math.max(0, Math.max(playlist.trackCount, playlist.tracks.length) - (nextTracks.length === playlist.tracks.length ? 0 : 1)),
    tracks: nextTracks,
  })
}

function clearCurrentPlayback() {
  refs.audio.pause()
  refs.audio.removeAttribute('src')
  refs.audio.load()
  state.queue = []
  state.queueMode = ''
  state.queuePlaylistId = null
  state.queueContextLabel = ''
  state.queueIndex = -1
  state.currentTrackId = null
  state.isPlaying = false
  state.isResolving = false
  state.isPreview = false
}

async function moveTrackFromContextMenu(targetPlaylistId) {
  const context = renderRuntime.contextMenuTrack
  closeContextMenu()

  if (!context || Number(targetPlaylistId || 0) <= 0) {
    return
  }

  const sourcePlaylist = getPlaylistById(context.playlistId)
  const targetPlaylist = getPlaylistById(targetPlaylistId)
  const track = sourcePlaylist?.tracks.find((item) => item.id === context.trackId)

  if (!sourcePlaylist || !targetPlaylist || !track) {
    return
  }

  const addResult = await appBridge.addTrackToPlaylist(targetPlaylist.id, track)
  if (!addResult.ok) {
    showToast(addResult.error || TEXT.moveToPlaylistFailed, 'error')
    return
  }

  const nextPlaylists = state.playlists.slice()
  const targetIndex = nextPlaylists.findIndex((playlist) => playlist.id === targetPlaylist.id)
  if (targetIndex >= 0) {
    nextPlaylists[targetIndex] = buildPlaylistWithTrackAdded(nextPlaylists[targetIndex], track)
  }

  if (!isLikedPlaylist(sourcePlaylist)) {
    const removeResult = await appBridge.removeTrackFromPlaylist(sourcePlaylist.id, track.id)
    if (!removeResult.ok) {
      setPlaylists(sortWallPlaylists(nextPlaylists))
      renderTabs()
      renderHeader()
      renderPlayer()
      applyFilters({ syncAll: true })
      showToast(removeResult.error || TEXT.moveToPlaylistFailed, 'error')
      return
    }

    const sourceIndex = nextPlaylists.findIndex((playlist) => playlist.id === sourcePlaylist.id)
    if (sourceIndex >= 0) {
      nextPlaylists[sourceIndex] = buildPlaylistWithoutTrack(nextPlaylists[sourceIndex], track.id)
    }

    if (state.queuePlaylistId === sourcePlaylist.id && state.currentTrackId === track.id) {
      clearCurrentPlayback()
    } else {
      syncQueueWithPlaylists()
    }
  }

  setPlaylists(sortWallPlaylists(nextPlaylists))
  if (!(state.queuePlaylistId === null && state.currentTrackId === null)) {
    syncQueueWithPlaylists()
  }
  renderTabs()
  renderHeader()
  renderPlayer()
  applyFilters({ syncAll: true })
  showToast(`${isLikedPlaylist(sourcePlaylist) ? TEXT.copyToPlaylistDone : TEXT.moveToPlaylistDone}：${targetPlaylist.name}`)
}

async function removeTrackFromContextMenu() {
  const context = renderRuntime.contextMenuTrack
  closeContextMenu()

  if (!context) {
    return
  }

  const playlist = getPlaylistById(context.playlistId)
  if (!playlist) {
    return
  }

  const result = await appBridge.removeTrackFromPlaylist(context.playlistId, context.trackId)
  if (!result.ok) {
    showToast(result.error || TEXT.removeFromPlaylistFailed, 'error')
    return
  }

  const nextPlaylist = buildPlaylistWithoutTrack(playlist, context.trackId)

  const nextPlaylists = state.playlists.map((item) => item.id === playlist.id ? nextPlaylist : item)
  setPlaylists(sortWallPlaylists(nextPlaylists))

  if (state.queuePlaylistId === context.playlistId && state.currentTrackId === context.trackId) {
    clearCurrentPlayback()
  } else {
    syncQueueWithPlaylists()
  }

  renderTabs()
  renderHeader()
  renderPlayer()
  applyFilters({ syncAll: true })
  showToast(TEXT.removeFromPlaylistDone)
}

function syncWallPlaybackState() {
  const nextTrackKey = state.currentTrackId && state.queuePlaylistId && state.queueMode === 'playlist'
    ? `${state.queuePlaylistId}:${state.currentTrackId}`
    : ''
  const nextRecommendationKey = state.currentTrackId && state.queuePlaylistId && state.queueMode === 'recommendation'
    ? `${state.queuePlaylistId}:${state.currentTrackId}`
    : ''

  if (renderRuntime.renderedTrackKey && renderRuntime.renderedTrackKey !== nextTrackKey) {
    updateTrackRowState(renderRuntime.renderedTrackKey, false)
  }

  if (renderRuntime.renderedRecommendationKey && renderRuntime.renderedRecommendationKey !== nextRecommendationKey) {
    updateRecommendationRowState(renderRuntime.renderedRecommendationKey, false)
  }

  if (renderRuntime.renderedPlaylistId && renderRuntime.renderedPlaylistId !== state.queuePlaylistId) {
    updatePlaylistCardState(renderRuntime.renderedPlaylistId, false)
  }

  if (nextTrackKey) {
    updateTrackRowState(nextTrackKey, true)
  }

  if (nextRecommendationKey) {
    updateRecommendationRowState(nextRecommendationKey, true)
  }

  if (state.queuePlaylistId) {
    updatePlaylistCardState(state.queuePlaylistId, true)
  }

  renderRuntime.renderedTrackKey = nextTrackKey
  renderRuntime.renderedRecommendationKey = nextRecommendationKey
  renderRuntime.renderedPlaylistId = state.queuePlaylistId || null
}

function updateTrackRowState(trackKey, isPlaying) {
  const [playlistId, trackId] = String(trackKey).split(':')
  const row = refs.wallColumns.querySelector(`.track-row[data-playlist-id="${playlistId}"][data-track-id="${trackId}"]`)
  if (!row) {
    return
  }

  row.classList.toggle('is-playing', isPlaying)
}

function updateRecommendationRowState(trackKey, isPlaying) {
  const [playlistId, trackId] = String(trackKey).split(':')
  const row = refs.wallColumns.querySelector(`.recommendation-play-btn[data-playlist-id="${playlistId}"][data-track-id="${trackId}"]`)
  if (!row) {
    return
  }

  row.classList.toggle('is-playing', isPlaying)
}

function updatePlaylistCardState(playlistId, isCurrent) {
  const cards = refs.wallColumns.querySelectorAll(`.playlist-card[data-playlist-id="${playlistId}"]`)
  if (!cards.length) {
    return
  }

  cards.forEach((card) => {
    card.classList.toggle('is-current', isCurrent)
  })
}

function isOwnedPlaylist(playlist) {
  return Number(playlist.creatorId || 0) === Number(state.account?.userId || 0)
}

function isLikedPlaylist(playlist) {
  return Number(playlist?.specialType || 0) === 5
}

async function playFromPlaylist(playlistId, trackId) {
  const playlist = getPlaylistById(playlistId)
  if (!playlist || !playlist.tracks.length) return
  const queueIndex = playlist.tracks.findIndex((track) => track.id === trackId)
  if (queueIndex === -1) return
  state.queue = playlist.tracks
  state.queueMode = 'playlist'
  state.queuePlaylistId = playlistId
  state.queueContextLabel = ''
  await playQueueIndex(queueIndex)
}

async function playRecommendedTrack(playlistId, trackId) {
  const playlist = getPlaylistById(playlistId)
  const recommendationState = ensureRecommendationState(playlistId)
  const queue = recommendationState.tracks || []
  const queueIndex = queue.findIndex((track) => track.id === Number(trackId))
  if (!queue.length || queueIndex === -1) {
    return
  }

  state.queue = queue
  state.queueMode = 'recommendation'
  state.queuePlaylistId = playlistId
  state.queueContextLabel = playlist ? `${playlist.name} / ${TEXT.recommendationsTitle}` : TEXT.recommendationsTitle
  await playQueueIndex(queueIndex)
}

async function playQueueIndex(index) {
  if (!state.queue.length || index < 0 || index >= state.queue.length) return
  state.queueIndex = index
  const track = state.queue[index]
  state.currentTrackId = track.id
  state.isResolving = true
  state.isPreview = false
  syncWallPlaybackState()
  renderPlayer()

  const token = ++state.playToken
  const result = await appBridge.getSongUrl(track.id)
  if (token !== state.playToken) return
  state.isResolving = false

  if (!result.ok || !result.url) {
    showToast(result.error || TEXT.noPlayableUrl, 'error')
    renderPlayer()
    syncWallPlaybackState()
    return
  }

  try {
    state.isPreview = isPreviewByDuration(track.durationMs, result.streamDurationMs)
    refs.audio.src = result.url
    await refs.audio.play()
    void recordTrackPlay(track.id)
  } catch (error) {
    showToast(error.message || TEXT.playbackFailed, 'error')
  }

  renderPlayer()
  syncWallPlaybackState()
}

async function recordTrackPlay(trackId) {
  if (!state.account?.userId || !appBridge || typeof appBridge.recordTrackPlay !== 'function') {
    return
  }

  const result = await appBridge.recordTrackPlay(state.account.userId, trackId)
  if (!result?.ok) {
    return
  }

  state.localPlayCounts.set(Number(trackId), Number(result.localPlayCount || 0))
  rebuildTrackPlayTiers()
  renderWallViewport({ force: true })
  updatePlaylistRecommendationNodesForVisible()
}

function togglePlayback() {
  if (state.queueIndex === -1) {
    const firstTrack = getFirstVisibleTrack()
    if (firstTrack) {
      playFromPlaylist(firstTrack.playlistId, firstTrack.trackId)
    }
    return
  }

  if (!refs.audio.src && state.queueIndex >= 0) {
    playQueueIndex(state.queueIndex)
    return
  }

  if (refs.audio.paused) {
    refs.audio.play().catch((error) => showToast(error.message || TEXT.playbackFailed, 'error'))
  } else {
    refs.audio.pause()
  }
}

function getFirstVisibleTrack() {
  for (const playlist of state.visiblePlaylists) {
    if (playlist.wallTracks[0]) {
      return { playlistId: playlist.id, trackId: playlist.wallTracks[0].id }
    }
  }
  return null
}

function previousTrack() {
  if (refs.audio.currentTime > 3) {
    refs.audio.currentTime = 0
    return
  }
  if (!state.queue.length) return
  if (state.shuffle && state.queue.length > 1) {
    playQueueIndex(randomQueueIndex())
    return
  }

  const target = state.queueIndex > 0
    ? state.queueIndex - 1
    : state.repeat === 'all'
      ? state.queue.length - 1
      : state.queueIndex

  playQueueIndex(target)
}

function nextTrack({ fromEnded }) {
  if (!state.queue.length) return
  if (state.shuffle && state.queue.length > 1) {
    playQueueIndex(randomQueueIndex())
    return
  }

  let target = state.queueIndex + 1
  if (target >= state.queue.length) {
    if (state.repeat === 'all') {
      target = 0
    } else if (fromEnded) {
      refs.audio.pause()
      state.isPlaying = false
      renderPlayer()
      return
    } else {
      return
    }
  }

  playQueueIndex(target)
}

function randomQueueIndex() {
  if (state.queue.length <= 1) return state.queueIndex
  let next = state.queueIndex
  while (next === state.queueIndex) {
    next = Math.floor(Math.random() * state.queue.length)
  }
  return next
}

function cycleRepeatMode() {
  const modes = ['all', 'one', 'off']
  state.repeat = modes[(modes.indexOf(state.repeat) + 1) % modes.length]
  renderPlayer()
}

function renderPlayer() {
  const track = getCurrentTrack()
  refs.locateCurrentBtn.disabled = !track || !state.queuePlaylistId
  syncPlayerButtonState(Boolean(track))
  if (!track) {
    updatePlayerCover(null)
    refs.playerTitle.textContent = TEXT.notPlaying
    refs.playerMeta.textContent = TEXT.pickTrack
    updateProgressUI()
    return
  }

  const playlist = state.queuePlaylistId ? getPlaylistById(state.queuePlaylistId) : null
  const contextLabel = state.queueContextLabel || playlist?.name || ''
  updatePlayerCover(track)
  refs.playerTitle.textContent = state.isResolving ? `${TEXT.resolving}${track.name}` : track.name
  refs.playerMeta.textContent = [track.artists.join('\u3001'), contextLabel, state.isPreview ? TEXT.previewTrack : ''].filter(Boolean).join(' / ')
  updateProgressUI()
}

function updatePlayerCover(track) {
  if (!refs.playerCover || !refs.playerCoverImage) {
    return
  }

  const coverUrl = track?.albumCoverUrl || ''
  if (!coverUrl) {
    refs.playerCover.classList.add('hidden')
    refs.playerCoverImage.removeAttribute('src')
    refs.playerCoverImage.alt = ''
    return
  }

  refs.playerCover.classList.remove('hidden')
  refs.playerCoverImage.src = coverUrl
  refs.playerCoverImage.alt = `${track?.name || '\u6b4c\u66f2'} \u4e13\u8f91\u5c01\u9762`
}

function updatePreviewState() {
  const track = getCurrentTrack()
  if (!track) {
    state.isPreview = false
    return
  }

  const nextPreviewState = isPreviewByDuration(track.durationMs, Math.round((refs.audio.duration || 0) * 1000))
  if (!state.isPreview && nextPreviewState) {
    showToast(TEXT.previewTrack)
  }
  state.isPreview = nextPreviewState
}

function isPreviewByDuration(expectedDurationMs, actualDurationMs) {
  return expectedDurationMs > 0
    && actualDurationMs > 0
    && expectedDurationMs - actualDurationMs >= PREVIEW_DURATION_GAP_MS
}

function toggleTheme() {
  const nextTheme = state.theme === 'light' ? 'dark' : 'light'
  applyTheme(nextTheme)
  showToast(nextTheme === 'dark' ? TEXT.switchedDark : TEXT.switchedLight)
}

function applyTheme(theme, { silent = false, persistLocal = true } = {}) {
  state.theme = theme === 'dark' ? 'dark' : 'light'
  document.body.dataset.theme = state.theme
  refs.themeToggleBtn.setAttribute('aria-label', state.theme === 'dark' ? '\u5207\u5230\u767d\u5e95' : '\u5207\u5230\u9ed1\u5e95')
  refs.themeToggleBtn.setAttribute('title', state.theme === 'dark' ? '\u5207\u5230\u767d\u5e95' : '\u5207\u5230\u9ed1\u5e95')
  refs.themeToggleBtn.dataset.theme = state.theme

  if (persistLocal) {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, state.theme)
    } catch {}
  }

  if (!silent) {
    void persistPreferences()
  }
}

function renderSettings() {
  applyUiScale(state.settings.uiScale)
  refs.playlistRecommendationsToggle.checked = Boolean(state.settings.showPlaylistRecommendations)
}

function toggleSettingsPanel() {
  const open = refs.settingsPanel.classList.toggle('is-open')
  refs.settingsBackdrop.classList.toggle('hidden', !open)
}

function closeSettingsPanel() {
  refs.settingsPanel.classList.remove('is-open')
  refs.settingsBackdrop.classList.add('hidden')
}

function handleSettingsChange() {
  state.settings.showPlaylistRecommendations = refs.playlistRecommendationsToggle.checked
  resetRecommendationRuntime()
  saveSettings()
  applyFilters({ syncAll: true })
}

function handleUiScaleInput(event) {
  applyUiScale(event.target.value, { rerender: true })
}

function handleUiScaleCommit() {
  saveSettings()
}

function applyUiScale(scale, { rerender = false } = {}) {
  const normalizedScale = normalizeUiScale(scale)
  const changed = normalizedScale !== state.settings.uiScale
  state.settings.uiScale = normalizedScale

  document.documentElement.style.setProperty('--ui-scale', (normalizedScale / 100).toFixed(2))
  if (refs.uiScaleRange) {
    refs.uiScaleRange.value = String(normalizedScale)
  }
  if (refs.uiScaleValue) {
    refs.uiScaleValue.textContent = `${normalizedScale}%`
    refs.uiScaleValue.value = `${normalizedScale}%`
  }

  if (changed && rerender) {
    scheduleWallRenderWithOptions({ immediate: true, syncAll: true })
  }
}

function saveSettings() {
  try {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(state.settings))
  } catch {}

  void persistPreferences()
}

function loadStoredTheme() {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY)
    return value === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

function loadStoredSettings() {
  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY) || '{}'
    const parsed = JSON.parse(raw)
    return {
      showPlaylistRecommendations: Boolean(parsed.showPlaylistRecommendations),
      uiScale: normalizeUiScale(parsed.uiScale),
    }
  } catch {
    return {
      showPlaylistRecommendations: false,
      uiScale: UI_SCALE_DEFAULT,
    }
  }
}

async function hydrateStoredPreferences() {
  if (!appBridge || typeof appBridge.getPreferences !== 'function') {
    return
  }

  const result = await appBridge.getPreferences()
  if (!result?.ok || !result.preferences) {
    return
  }

  state.theme = result.preferences.theme === 'dark' ? 'dark' : 'light'
  state.settings.showPlaylistRecommendations = Boolean(
    result.preferences.showPlaylistRecommendations
  )
  state.settings.uiScale = normalizeUiScale(result.preferences.uiScale)

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, state.theme)
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(state.settings))
  } catch {}
}

async function persistPreferences() {
  if (!appBridge || typeof appBridge.savePreferences !== 'function') {
    return
  }

  await appBridge.savePreferences({
    theme: state.theme,
    showPlaylistRecommendations: Boolean(state.settings.showPlaylistRecommendations),
    uiScale: normalizeUiScale(state.settings.uiScale),
  })
}

async function locateCurrentTrack() {
  const track = getCurrentTrack()
  if (!track || !state.queuePlaylistId) {
    showToast(TEXT.noCurrentTrack, 'error')
    return
  }

  const playlist = getPlaylistById(state.queuePlaylistId)
  if (!playlist) {
    showToast(TEXT.locateFailed, 'error')
    return
  }

  const nextTab = isOwnedPlaylist(playlist) ? 'owned' : 'subscribed'
  if (state.activeTab !== nextTab) {
    state.activeTab = nextTab
    renderTabs()
    renderHeader()
  }

  if (state.search) {
    state.search = ''
    refs.searchInput.value = ''
  }

  applyFilters({ syncAll: true })

  if (state.queueMode === 'recommendation') {
    const placement = getWallPlacementByPlaylistId(state.queuePlaylistId)
    if (placement) {
      const targetTop = clamp(
        Math.round((placement.top + placement.height) - refs.wallScroll.clientHeight * 0.65),
        0,
        Math.max(0, refs.wallScroll.scrollHeight - refs.wallScroll.clientHeight)
      )
      refs.wallScroll.scrollTop = targetTop
      renderWallViewport({ force: true })
    }

    await new Promise((resolve) => window.requestAnimationFrame(() => window.requestAnimationFrame(resolve)))

    const recommendationRow = refs.wallColumns.querySelector(`.recommendation-play-btn[data-playlist-id="${state.queuePlaylistId}"][data-track-id="${track.id}"]`)
    if (recommendationRow) {
      recommendationRow.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
      showToast(TEXT.locatedCurrent)
      return
    }
  }

  const anchor = renderRuntime.wallTrackAnchors.get(`${state.queuePlaylistId}:${track.id}`)
  if (anchor) {
    const targetTop = clamp(
      Math.round(anchor.top - refs.wallScroll.clientHeight * 0.35),
      0,
      Math.max(0, refs.wallScroll.scrollHeight - refs.wallScroll.clientHeight)
    )
    refs.wallScroll.scrollTop = targetTop
    renderWallViewport({ force: true })
  }

  await new Promise((resolve) => window.requestAnimationFrame(() => window.requestAnimationFrame(resolve)))

  const row = refs.wallColumns.querySelector(`.track-row[data-playlist-id="${state.queuePlaylistId}"][data-track-id="${track.id}"]`)
  if (!row) {
    showToast(TEXT.locateFailed, 'error')
    return
  }

  row.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
  showToast(TEXT.locatedCurrent)
}

function getWallPlacementByPlaylistId(playlistId) {
  for (const placements of renderRuntime.wallPlacementsByColumn) {
    const placement = (placements || []).find((item) => item.item.playlist.id === Number(playlistId))
    if (placement) {
      return placement
    }
  }

  return null
}

function formatRepeatButton() {
  if (state.repeat === 'one') return TEXT.repeatOne
  if (state.repeat === 'off') return TEXT.repeatOff
  return TEXT.repeatAll
}

function setButtonLabel(button, label) {
  button.setAttribute('aria-label', label)
  button.title = label
}

function syncPlayerButtonState(hasTrack) {
  const isPlaying = hasTrack && !refs.audio.paused
  setButtonLabel(refs.playBtn, isPlaying ? TEXT.pause : TEXT.play)
  refs.playBtn.dataset.state = isPlaying ? 'playing' : 'paused'
  setButtonLabel(refs.prevBtn, TEXT.prev)
  setButtonLabel(refs.nextBtn, TEXT.next)
  setButtonLabel(refs.shuffleBtn, state.shuffle ? TEXT.shuffleOn : TEXT.shuffleOff)
  refs.shuffleBtn.dataset.active = String(state.shuffle)
  setButtonLabel(refs.repeatBtn, formatRepeatButton())
  refs.repeatBtn.dataset.mode = state.repeat
}

function updateProgressUI() {
  const current = Number.isFinite(refs.audio.currentTime) ? refs.audio.currentTime : 0
  const total = Number.isFinite(refs.audio.duration) ? refs.audio.duration : 0
  refs.currentTime.textContent = formatTime(current)
  refs.totalTime.textContent = formatTime(total)
  refs.progressRange.value = total > 0 ? String(Math.round((current / total) * 1000)) : '0'
}

function computeColumns() {
  const metrics = getLayoutMetrics()
  const scrollWidth = Math.max(refs.wallScroll?.clientWidth || 0, window.innerWidth || 0)
  const availableWidth = Math.max(
    metrics.cardWidth,
    scrollWidth - (metrics.wallPaddingX * 2)
  )
  const autoColumns = Math.floor((availableWidth + metrics.gap) / (metrics.cardWidth + metrics.gap))
  return clamp(autoColumns, 1, WALL_MAX_COLUMNS)
}

function estimateCardHeight(item) {
  const metrics = getLayoutMetrics()
  const rowCount = item.playlist.wallTracks?.length || 0
  const bodyHeight = rowCount ? rowCount * metrics.rowHeight : metrics.placeholderHeight
  const recommendationHeight = shouldRenderPlaylistRecommendations(item) ? metrics.recommendationHeight : 0
  return metrics.headerHeight + bodyHeight + recommendationHeight + metrics.footerHeight + 2
}

function indexOfSmallest(values) {
  let smallestIndex = 0
  for (let index = 1; index < values.length; index += 1) {
    if (values[index] < values[smallestIndex]) smallestIndex = index
  }
  return smallestIndex
}

function scheduleWallRender() {
  scheduleWallRenderWithOptions()
}

function handleWallScroll() {
  if (!renderRuntime.wallColumns.length) {
    return
  }

  if (renderRuntime.wallViewportFrame) {
    return
  }

  renderRuntime.wallViewportFrame = window.requestAnimationFrame(() => {
    renderRuntime.wallViewportFrame = 0
    renderWallViewport()
  })
}

function scheduleWallRenderWithOptions({ immediate = false, syncAll = false } = {}) {
  window.clearTimeout(scheduleWallRender.timer)
  cancelWallRenderWork()

  const run = () => {
    renderRuntime.wallRenderFrame = 0
    if (!refs.app.classList.contains('hidden')) {
      renderWall({ syncAll })
    }
  }

  if (immediate) {
    run()
    return
  }

  scheduleWallRender.timer = window.setTimeout(() => {
    renderRuntime.wallRenderFrame = window.requestAnimationFrame(run)
  }, 60)
}

function cancelWallRenderWork() {
  if (renderRuntime.wallRenderFrame) {
    window.cancelAnimationFrame(renderRuntime.wallRenderFrame)
    renderRuntime.wallRenderFrame = 0
  }

  if (renderRuntime.wallViewportFrame) {
    window.cancelAnimationFrame(renderRuntime.wallViewportFrame)
    renderRuntime.wallViewportFrame = 0
  }

}

function handleKeydown(event) {
  const target = event.target
  const editing = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement

  if (event.key === 'Escape' && !refs.contextMenu.classList.contains('hidden')) {
    closeContextMenu()
    return
  }

  if (event.key === 'Escape' && !refs.albumHoverPreview.classList.contains('hidden')) {
    hideAlbumHoverPreview()
    return
  }

  if (event.key === 'Escape' && refs.settingsPanel.classList.contains('is-open')) {
    closeSettingsPanel()
    return
  }

  if (event.key === '/' && !editing) {
    event.preventDefault()
    refs.searchInput.focus()
    refs.searchInput.select()
    return
  }

  if (editing) {
    if (event.key === 'Escape') target.blur()
    return
  }

  if (event.code === 'Space') {
    event.preventDefault()
    togglePlayback()
  } else if (event.key === '1') {
    setActiveTab('owned')
  } else if (event.key === '2') {
    setActiveTab('subscribed')
  } else if (event.key.toLowerCase() === 'n') {
    nextTrack({ fromEnded: false })
  } else if (event.key.toLowerCase() === 'p') {
    previousTrack()
  }
}

function getCurrentTrack() {
  if (state.queueIndex < 0 || state.queueIndex >= state.queue.length) return null
  return state.queue[state.queueIndex]
}

function getPlaylistById(playlistId) {
  return state.playlistMap.get(Number(playlistId)) || null
}

function trackMatches(track, query) {
  return track.searchText.includes(query)
}

function normalizeQuery(value) {
  return String(value || '').trim().toLowerCase()
}

function formatTime(seconds) {
  const safe = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0
  return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, '0')}`
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString('zh-CN')
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div')
  toast.className = `toast${type === 'error' ? ' error' : ''}`
  toast.textContent = message
  refs.toastWrap.appendChild(toast)
  window.setTimeout(() => toast.remove(), 2800)
}
