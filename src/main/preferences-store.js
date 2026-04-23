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
const VOLUME_ASSIST_TARGET_APP = 'app'
const VOLUME_ASSIST_TARGET_SYSTEM = 'system'
const VOLUME_ASSIST_DEFAULT_HOTKEY = 'Alt'
const ARTIST_TRACK_DISPLAY_LIMIT_MIN = 20
const ARTIST_TRACK_DISPLAY_LIMIT_MAX = 1000
const ARTIST_TRACK_DISPLAY_LIMIT_DEFAULT = 100

const LYRICS_FONT_SIZE_MIN = 16
const LYRICS_FONT_SIZE_MAX = 80
const LYRICS_FONT_SIZE_DEFAULT = 36
const LYRICS_DEFAULT_WIDTH = 820
const LYRICS_DEFAULT_HEIGHT = 160
const LYRICS_MIN_WIDTH = 320
const LYRICS_MIN_HEIGHT = 90
const LYRICS_COLOR_CURRENT_DEFAULT = '#ffffff'
const LYRICS_COLOR_TRANSLATE_DEFAULT = '#cfd8e6'

const HEX_COLOR_PATTERN = /^#[0-9a-f]{3,8}$/i

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

function normalizeVolumeAssistTarget(input) {
  return input === VOLUME_ASSIST_TARGET_SYSTEM
    ? VOLUME_ASSIST_TARGET_SYSTEM
    : VOLUME_ASSIST_TARGET_APP
}

function normalizeVolumeAssistHotkey(input) {
  const tokens = String(input || '')
    .split('+')
    .map((token) => token.trim())
    .filter(Boolean)

  const modifierMap = new Map([
    ['control', 'Ctrl'],
    ['ctrl', 'Ctrl'],
    ['shift', 'Shift'],
    ['alt', 'Alt'],
    ['option', 'Alt'],
    ['meta', 'Meta'],
    ['cmd', 'Meta'],
    ['command', 'Meta'],
    ['super', 'Meta'],
    ['win', 'Meta'],
    ['windows', 'Meta'],
  ])
  const modifierOrder = ['Ctrl', 'Shift', 'Alt', 'Meta']
  const modifiers = new Set()
  let mainKey = ''

  for (const token of tokens) {
    const mappedModifier = modifierMap.get(token.toLowerCase())
    if (mappedModifier) {
      modifiers.add(mappedModifier)
      continue
    }

    if (!mainKey) {
      mainKey = token.length === 1 ? token.toUpperCase() : token
    }
  }

  const parts = modifierOrder.filter((modifier) => modifiers.has(modifier))
  if (mainKey) {
    parts.push(mainKey)
  }

  return parts.length ? parts.join('+') : VOLUME_ASSIST_DEFAULT_HOTKEY
}

function normalizeVolumeAssistSettings(input = {}) {
  const raw = input && typeof input === 'object' ? input : {}
  return {
    enabled: Boolean(raw.enabled),
    target: normalizeVolumeAssistTarget(raw.target),
    hotkey: normalizeVolumeAssistHotkey(raw.hotkey),
  }
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

function normalizeHexColor(input, fallback) {
  if (typeof input === 'string' && HEX_COLOR_PATTERN.test(input.trim())) {
    return input.trim().toLowerCase()
  }
  return fallback
}

function getDefaultLyricsBounds() {
  return { x: null, y: null, width: LYRICS_DEFAULT_WIDTH, height: LYRICS_DEFAULT_HEIGHT }
}

function normalizeLyricsBounds(input) {
  const fallback = getDefaultLyricsBounds()
  const raw = input && typeof input === 'object' ? input : {}
  const width = Number.isFinite(Number(raw.width))
    ? Math.max(LYRICS_MIN_WIDTH, Math.min(3840, Math.round(Number(raw.width))))
    : fallback.width
  const height = Number.isFinite(Number(raw.height))
    ? Math.max(LYRICS_MIN_HEIGHT, Math.min(2160, Math.round(Number(raw.height))))
    : fallback.height
  const x = Number.isFinite(Number(raw.x)) ? Math.round(Number(raw.x)) : null
  const y = Number.isFinite(Number(raw.y)) ? Math.round(Number(raw.y)) : null
  return { x, y, width, height }
}

function getDefaultLyricsPrefs() {
  return {
    enabled: false,
    fontSize: LYRICS_FONT_SIZE_DEFAULT,
    colorCurrent: LYRICS_COLOR_CURRENT_DEFAULT,
    colorTranslate: LYRICS_COLOR_TRANSLATE_DEFAULT,
    bounds: getDefaultLyricsBounds(),
  }
}

function normalizeLyricsPrefs(input) {
  const defaults = getDefaultLyricsPrefs()
  const raw = input && typeof input === 'object' ? input : {}
  const fontSizeNumeric = Number(raw.fontSize)
  const fontSize = Number.isFinite(fontSizeNumeric)
    ? Math.max(LYRICS_FONT_SIZE_MIN, Math.min(LYRICS_FONT_SIZE_MAX, Math.round(fontSizeNumeric)))
    : defaults.fontSize
  return {
    enabled: Boolean(raw.enabled),
    fontSize,
    colorCurrent: normalizeHexColor(raw.colorCurrent, defaults.colorCurrent),
    colorTranslate: normalizeHexColor(raw.colorTranslate, defaults.colorTranslate),
    bounds: normalizeLyricsBounds(raw.bounds),
  }
}

function normalizePreferences(input = {}) {
  const hasShowLyricsButton = Object.prototype.hasOwnProperty.call(input || {}, 'showLyricsButton')
  return {
    theme: input?.theme === 'dark' ? 'dark' : 'light',
    showPlaylistRecommendations: Boolean(input?.showPlaylistRecommendations),
    showLyricsButton: hasShowLyricsButton ? input.showLyricsButton !== false : true,
    likedPlaylistDisplayMode: normalizeLikedPlaylistDisplayMode(input?.likedPlaylistDisplayMode),
    defaultAudioQuality: normalizeAudioQualityPreference(input?.defaultAudioQuality),
    autoAdjustAudioQuality: input?.autoAdjustAudioQuality !== false,
    volumeAssist: normalizeVolumeAssistSettings(input?.volumeAssist),
    artistTrackDisplayLimit: normalizeArtistTrackDisplayLimit(input?.artistTrackDisplayLimit),
    collapsedPlaylistIds: normalizeCollapsedPlaylistIds(input?.collapsedPlaylistIds),
    ownedPlaylistOrderIds: normalizePlaylistOrderIds(input?.ownedPlaylistOrderIds),
    uiScale: normalizeUiScale(input?.uiScale),
    windowState: normalizeWindowState(input?.windowState, getDefaultWindowState()),
    lyrics: normalizeLyricsPrefs(input?.lyrics),
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
  const currentLyrics = current.lyrics || getDefaultLyricsPrefs()
  const inputLyrics = input?.lyrics && typeof input.lyrics === 'object' ? input.lyrics : null
  const mergedLyrics = inputLyrics === null
    ? currentLyrics
    : {
      ...currentLyrics,
      ...inputLyrics,
      bounds: inputLyrics.bounds === undefined
        ? currentLyrics.bounds
        : { ...(currentLyrics.bounds || getDefaultLyricsBounds()), ...(inputLyrics.bounds || {}) },
    }
  const next = normalizePreferences({
    ...current,
    ...input,
    windowState: input?.windowState === undefined
      ? current.windowState
      : {
        ...(current.windowState || getDefaultWindowState()),
        ...(input.windowState && typeof input.windowState === 'object' ? input.windowState : {}),
      },
    lyrics: mergedLyrics,
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
  normalizeVolumeAssistSettings,
  normalizeArtistTrackDisplayLimit,
  normalizePlaylistOrderIds,
  normalizeLyricsPrefs,
  getDefaultLyricsPrefs,
}
