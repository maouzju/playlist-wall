const fs = require('fs')
const path = require('path')
const { app, safeStorage } = require('electron')

const SESSION_FILE_NAME = 'session.json'
const STORAGE_MODE_SAFE = 'safe-storage'
const STORAGE_MODE_PLAINTEXT = 'plain-text-fallback'

function canUseSafeStorage() {
  try {
    return Boolean(safeStorage?.isEncryptionAvailable?.())
  } catch (error) {
    console.warn('failed to detect safe storage availability', error)
    return false
  }
}

function getUserDataFilePath(fileName) {
  return path.join(app.getPath('userData'), fileName)
}

function readJson(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return null
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch (error) {
    console.warn('failed to read json file', filePath, error)
    return null
  }
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
}

function clearSessionFile() {
  try {
    fs.rmSync(getUserDataFilePath(SESSION_FILE_NAME), { force: true })
  } catch (error) {
    console.warn('failed to clear session', error)
  }
}

function sanitizeSessionPayload(payload = {}) {
  const next = { ...payload }
  delete next.cookie
  delete next.cookieEncrypted
  delete next.storageMode
  delete next.updatedAt
  return next
}

function encryptCookie(cookie) {
  const ciphertext = safeStorage.encryptString(String(cookie || '').trim())
  return ciphertext.toString('base64')
}

function decryptCookie(cookieEncrypted) {
  return safeStorage.decryptString(Buffer.from(cookieEncrypted, 'base64'))
}

function readSession() {
  const raw = readJson(getUserDataFilePath(SESSION_FILE_NAME))
  if (!raw || typeof raw !== 'object') {
    return null
  }

  if (typeof raw.cookieEncrypted === 'string' && raw.cookieEncrypted.trim()) {
    if (!canUseSafeStorage()) {
      console.warn('secure session exists but safe storage is unavailable in this environment')
      return null
    }

    try {
      return {
        ...sanitizeSessionPayload(raw),
        cookie: decryptCookie(raw.cookieEncrypted),
        storageMode: STORAGE_MODE_SAFE,
        updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : '',
      }
    } catch (error) {
      console.warn('failed to decrypt session cookie', error)
      return null
    }
  }

  if (typeof raw.cookie !== 'string' || !raw.cookie.trim()) {
    return null
  }

  const legacySession = {
    ...sanitizeSessionPayload(raw),
    cookie: String(raw.cookie).trim(),
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : '',
  }

  if (canUseSafeStorage()) {
    return writeSession(legacySession.cookie, legacySession)
  }

  return {
    ...legacySession,
    storageMode: STORAGE_MODE_PLAINTEXT,
  }
}

function writeSession(cookie, payload = {}) {
  const normalizedCookie = String(cookie || '').trim()
  if (!normalizedCookie) {
    clearSession()
    return null
  }

  const sessionMeta = {
    updatedAt: new Date().toISOString(),
    ...sanitizeSessionPayload(payload),
  }

  if (canUseSafeStorage()) {
    const session = {
      ...sessionMeta,
      cookieEncrypted: encryptCookie(normalizedCookie),
      storageMode: STORAGE_MODE_SAFE,
    }
    writeJson(getUserDataFilePath(SESSION_FILE_NAME), session)
    return {
      ...sessionMeta,
      cookie: normalizedCookie,
      storageMode: STORAGE_MODE_SAFE,
    }
  }

  console.warn('safe storage unavailable; session cookie will be stored in plaintext userData/session.json')

  const session = {
    ...sessionMeta,
    cookie: normalizedCookie,
    storageMode: STORAGE_MODE_PLAINTEXT,
  }
  writeJson(getUserDataFilePath(SESSION_FILE_NAME), session)
  return session
}

function clearSession() {
  clearSessionFile()
}

module.exports = {
  getUserDataFilePath,
  readSession,
  writeSession,
  clearSession,
}
