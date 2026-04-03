const fs = require('fs')

const { getUserDataFilePath } = require('./session-store')

const PREFERENCES_FILE_NAME = 'preferences.json'
const UI_SCALE_MIN = 80
const UI_SCALE_MAX = 125
const UI_SCALE_STEP = 5
const UI_SCALE_DEFAULT = 100

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

function normalizePreferences(input = {}) {
  return {
    theme: input?.theme === 'dark' ? 'dark' : 'light',
    showPlaylistRecommendations: Boolean(input?.showPlaylistRecommendations),
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
}
