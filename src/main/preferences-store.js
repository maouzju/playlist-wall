const fs = require('fs')

const { getUserDataFilePath } = require('./session-store')

const PREFERENCES_FILE_NAME = 'preferences.json'
const UI_SCALE_MIN = 80
const UI_SCALE_MAX = 125
const UI_SCALE_STEP = 5
const UI_SCALE_DEFAULT = 100
const LIKED_PLAYLIST_DISPLAY_MODE_ALL = 'all'
const LIKED_PLAYLIST_DISPLAY_MODE_UNCOLLECTED = 'uncollected'
const LIKED_PLAYLIST_DISPLAY_MODE_HIDDEN = 'hidden'
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

function normalizePreferences(input = {}) {
  return {
    theme: input?.theme === 'dark' ? 'dark' : 'light',
    showPlaylistRecommendations: Boolean(input?.showPlaylistRecommendations),
    likedPlaylistDisplayMode: normalizeLikedPlaylistDisplayMode(input?.likedPlaylistDisplayMode),
    artistTrackDisplayLimit: normalizeArtistTrackDisplayLimit(input?.artistTrackDisplayLimit),
    collapsedPlaylistIds: normalizeCollapsedPlaylistIds(input?.collapsedPlaylistIds),
    uiScale: normalizeUiScale(input?.uiScale),
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
  const next = normalizePreferences(input)

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
  normalizeArtistTrackDisplayLimit,
}
