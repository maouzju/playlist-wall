const fs = require('fs')

const { getUserDataFilePath } = require('./session-store')
const { getDefaultWindowState, normalizeWindowState } = require('./window-state')

const PREFERENCES_FILE_NAME = 'preferences.json'
const UI_SCALE_MIN = 80
const UI_SCALE_MAX = 125
const UI_SCALE_STEP = 5
const UI_SCALE_DEFAULT = 100
const LIKED_PLAYLIST_DISPLAY_MODE_ALL = 'all'
const LIKED_PLAYLIST_DISPLAY_MODE_UNCOLLECTED = 'uncollected'
const LIKED_PLAYLIST_DISPLAY_MODE_HIDDEN = 'hidden'
const AUDIO_QUALITY_BEST = 'best'
const AUDIO_QUALITY_LOSSLESS = 'lossless'
const AUDIO_QUALITY_EXHIGH = 'exhigh'
const AUDIO_QUALITY_STANDARD = 'standard'
const ARTIST_TRACK_DISPLAY_LIMIT_MIN = 20
const ARTIST_TRACK_DISPLAY_LIMIT_MAX = 1000
const ARTIST_TRACK_DISPLAY_LIMIT_DEFAULT = 100

function normalizeUiScale(input) {
  const numeric = Number(input)
  if (!Number.isFinite(numeric)) {
    return UI_SCALE_DEFAULT
  }

  return Math.min(
    UI_SCALE_MAX,
    Math.max(UI_SCALE_MIN, Math.round(numeric / UI_SCALE_STEP) * UI_SCALE_STEP)
  )
}

function normalizeLikedPlaylistDisplayMode(input) {
  if (input === LIKED_PLAYLIST_DISPLAY_MODE_UNCOLLECTED) {
    return LIKED_PLAYLIST_DISPLAY_MODE_UNCOLLECTED
  }

  if (input === LIKED_PLAYLIST_DISPLAY_MODE_HIDDEN) {
    return LIKED_PLAYLIST_DISPLAY_MODE_HIDDEN
  }

  return LIKED_PLAYLIST_DISPLAY_MODE_ALL
}

function normalizeAudioQualityPreference(input) {
  if (input === AUDIO_QUALITY_LOSSLESS) {
    return AUDIO_QUALITY_LOSSLESS
  }

  if (input === AUDIO_QUALITY_EXHIGH) {
    return AUDIO_QUALITY_EXHIGH
  }

  if (input === AUDIO_QUALITY_STANDARD) {
    return AUDIO_QUALITY_STANDARD
  }

  return AUDIO_QUALITY_BEST
}

function normalizeArtistTrackDisplayLimit(input) {
  const numeric = Number(input)
  if (!Number.isFinite(numeric)) {
    return ARTIST_TRACK_DISPLAY_LIMIT_DEFAULT
  }

  return Math.min(
    ARTIST_TRACK_DISPLAY_LIMIT_MAX,
    Math.max(ARTIST_TRACK_DISPLAY_LIMIT_MIN, Math.round(numeric))
  )
}

function normalizeCollapsedPlaylistIds(input) {
  if (!Array.isArray(input)) {
    return []
  }

  const seen = new Set()
  const ids = []

  for (const value of input) {
    const normalizedId = Math.trunc(Number(value || 0))
    if (!Number.isSafeInteger(normalizedId) || normalizedId === 0 || seen.has(normalizedId)) {
      continue
    }

    seen.add(normalizedId)
    ids.push(normalizedId)
  }

  return ids.sort((left, right) => left - right)
}

function normalizePlaylistOrderIds(input) {
  if (!Array.isArray(input)) {
    return []
  }

  const seen = new Set()
  const ids = []

  for (const value of input) {
    const normalizedId = Math.trunc(Number(value || 0))
    if (!Number.isSafeInteger(normalizedId) || normalizedId === 0 || seen.has(normalizedId)) {
      continue
    }

    seen.add(normalizedId)
    ids.push(normalizedId)
  }

  return ids
}

function normalizePreferences(input = {}) {
  return {
    theme: input?.theme === 'dark' ? 'dark' : 'light',
    showPlaylistRecommendations: Boolean(input?.showPlaylistRecommendations),
    likedPlaylistDisplayMode: normalizeLikedPlaylistDisplayMode(input?.likedPlaylistDisplayMode),
    defaultAudioQuality: normalizeAudioQualityPreference(input?.defaultAudioQuality),
    autoAdjustAudioQuality: input?.autoAdjustAudioQuality !== false,
    artistTrackDisplayLimit: normalizeArtistTrackDisplayLimit(input?.artistTrackDisplayLimit),
    collapsedPlaylistIds: normalizeCollapsedPlaylistIds(input?.collapsedPlaylistIds),
    ownedPlaylistOrderIds: normalizePlaylistOrderIds(input?.ownedPlaylistOrderIds),
    uiScale: normalizeUiScale(input?.uiScale),
    windowState: normalizeWindowState(input?.windowState, getDefaultWindowState()),
  }
}

function readPreferences() {
  const filePath = getUserDataFilePath(PREFERENCES_FILE_NAME)

  try {
    if (!fs.existsSync(filePath)) {
      return normalizePreferences()
    }

    return normalizePreferences(JSON.parse(fs.readFileSync(filePath, 'utf8')))
  } catch (error) {
    console.warn('failed to read preferences', error)
    return normalizePreferences()
  }
}

function writePreferences(input = {}) {
  const filePath = getUserDataFilePath(PREFERENCES_FILE_NAME)
  const current = readPreferences()
  const next = normalizePreferences({
    ...current,
    ...input,
    windowState: input?.windowState === undefined
      ? current.windowState
      : {
        ...(current.windowState || getDefaultWindowState()),
        ...(input.windowState && typeof input.windowState === 'object' ? input.windowState : {}),
      },
  })

  try {
    fs.mkdirSync(require('path').dirname(filePath), { recursive: true })
    fs.writeFileSync(filePath, `${JSON.stringify(next, null, 2)}\n`, 'utf8')
  } catch (error) {
    console.warn('failed to write preferences', error)
  }

  return next
}

module.exports = {
  readPreferences,
  writePreferences,
  normalizePreferences,
  normalizeAudioQualityPreference,
  normalizeArtistTrackDisplayLimit,
  normalizePlaylistOrderIds,
}
