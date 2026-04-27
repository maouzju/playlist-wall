const path = require('path')

function normalizeCacheDirectoryInput(input) {
  if (typeof input !== 'string') {
    return ''
  }

  return input.trim()
}

function callStringFunction(target, name) {
  try {
    const value = target && typeof target[name] === 'function' ? target[name]() : ''
    return typeof value === 'string' ? value.trim() : ''
  } catch {
    return ''
  }
}

function resolveInstallDirectory(options = {}) {
  const app = options.app || null
  const execPath = typeof options.execPath === 'string' && options.execPath.trim()
    ? options.execPath.trim()
    : (typeof process.execPath === 'string' ? process.execPath : '')
  const appPath = callStringFunction(app, 'getAppPath')
  const cwd = typeof options.cwd === 'string' && options.cwd.trim()
    ? options.cwd.trim()
    : process.cwd()

  if (app && app.isPackaged === false && appPath) {
    return path.resolve(appPath)
  }

  if (execPath) {
    return path.dirname(path.resolve(execPath))
  }

  if (appPath) {
    return path.resolve(appPath)
  }

  return path.resolve(cwd)
}

function resolveDefaultCacheDirectory(options = {}) {
  return path.join(path.dirname(resolveInstallDirectory(options)), 'Playlist Wall Cache')
}

function isPathInsideOrEqual(childPath, parentPath) {
  const child = path.resolve(String(childPath || ''))
  const parent = path.resolve(String(parentPath || ''))
  const relative = path.relative(parent, child)
  return relative === '' || (relative && !relative.startsWith('..') && !path.isAbsolute(relative))
}

function resolveCacheDirectory(input, options = {}) {
  const normalized = normalizeCacheDirectoryInput(input)
  return normalized
    ? path.resolve(normalized)
    : resolveDefaultCacheDirectory(options)
}

function getCacheDirectoryInfo(preferences = {}, options = {}) {
  const installDirectory = resolveInstallDirectory(options)
  const customCacheDirectory = normalizeCacheDirectoryInput(preferences?.cacheDirectory)
  const defaultCacheDirectory = resolveDefaultCacheDirectory(options)
  const resolvedCustomCacheDirectory = customCacheDirectory ? path.resolve(customCacheDirectory) : ''
  const customIsSafe = Boolean(
    resolvedCustomCacheDirectory && !isPathInsideOrEqual(resolvedCustomCacheDirectory, installDirectory)
  )
  const cacheDirectory = customIsSafe ? resolvedCustomCacheDirectory : defaultCacheDirectory

  return {
    cacheDirectory,
    customCacheDirectory: customIsSafe ? resolvedCustomCacheDirectory : '',
    defaultCacheDirectory,
    usesDefault: !customIsSafe,
  }
}

module.exports = {
  getCacheDirectoryInfo,
  isPathInsideOrEqual,
  normalizeCacheDirectoryInput,
  resolveCacheDirectory,
  resolveDefaultCacheDirectory,
  resolveInstallDirectory,
}
