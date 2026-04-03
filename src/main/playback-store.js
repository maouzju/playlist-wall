const fs = require('fs')
const path = require('path')

const { getUserDataFilePath } = require('./session-store')

const PLAYBACK_STORE_FILE = 'playback-stats.json'

function normalizeCountMap(input) {
  const next = {}
  for (const [key, value] of Object.entries(input || {})) {
    const trackId = Number(key)
    const count = Number(value || 0)
    if (trackId > 0 && count > 0) {
      next[String(trackId)] = count
    }
  }
  return next
}

function normalizeUserBucket(input = {}) {
  return {
    localPlayCounts: normalizeCountMap(input.localPlayCounts),
    cloudPlayCounts: normalizeCountMap(input.cloudPlayCounts),
    cloudUpdatedAt: typeof input.cloudUpdatedAt === 'string' ? input.cloudUpdatedAt : '',
  }
}

function normalizeStore(input = {}) {
  const users = {}
  for (const [userId, bucket] of Object.entries(input.users || {})) {
    const normalizedUserId = Number(userId)
    if (normalizedUserId > 0) {
      users[String(normalizedUserId)] = normalizeUserBucket(bucket)
    }
  }
  return { users }
}

function getStoreFilePath() {
  return getUserDataFilePath(PLAYBACK_STORE_FILE)
}

function readPlaybackStore() {
  const filePath = getStoreFilePath()

  try {
    if (!fs.existsSync(filePath)) {
      return normalizeStore()
    }
    return normalizeStore(JSON.parse(fs.readFileSync(filePath, 'utf8')))
  } catch (error) {
    console.warn('failed to read playback store', error)
    return normalizeStore()
  }
}

function writePlaybackStore(store) {
  const filePath = getStoreFilePath()

  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true })
    fs.writeFileSync(filePath, `${JSON.stringify(normalizeStore(store), null, 2)}\n`, 'utf8')
  } catch (error) {
    console.warn('failed to write playback store', error)
  }
}

function getUserBucket(store, userId) {
  const normalizedUserId = String(Number(userId || 0))
  if (!store.users[normalizedUserId]) {
    store.users[normalizedUserId] = normalizeUserBucket()
  }
  return store.users[normalizedUserId]
}

function getPlaybackStats(userId) {
  const store = readPlaybackStore()
  const bucket = getUserBucket(store, userId)
  return {
    localPlayCounts: { ...bucket.localPlayCounts },
    cloudPlayCounts: { ...bucket.cloudPlayCounts },
    cloudUpdatedAt: bucket.cloudUpdatedAt || '',
  }
}

function incrementLocalPlayCount(userId, trackId) {
  const normalizedTrackId = Number(trackId || 0)
  if (normalizedTrackId <= 0) {
    return 0
  }

  const store = readPlaybackStore()
  const bucket = getUserBucket(store, userId)
  const key = String(normalizedTrackId)
  const nextCount = Number(bucket.localPlayCounts[key] || 0) + 1
  bucket.localPlayCounts[key] = nextCount
  writePlaybackStore(store)
  return nextCount
}

function writeCloudPlayCounts(userId, cloudPlayCounts) {
  const store = readPlaybackStore()
  const bucket = getUserBucket(store, userId)
  bucket.cloudPlayCounts = normalizeCountMap(cloudPlayCounts)
  bucket.cloudUpdatedAt = new Date().toISOString()
  writePlaybackStore(store)
  return {
    cloudPlayCounts: { ...bucket.cloudPlayCounts },
    cloudUpdatedAt: bucket.cloudUpdatedAt,
  }
}

module.exports = {
  getPlaybackStats,
  incrementLocalPlayCount,
  writeCloudPlayCounts,
}
