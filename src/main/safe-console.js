const STREAM_BROKEN = Symbol('playlistWall.safeConsole.streamBroken')
const STREAM_GUARD_INSTALLED = Symbol('playlistWall.safeConsole.streamGuardInstalled')
const CONSOLE_PATCHED = Symbol('playlistWall.safeConsole.consolePatched')

const METHOD_TARGETS = {
  log: 'stdout',
  info: 'stdout',
  debug: 'stdout',
  warn: 'stderr',
  error: 'stderr',
  trace: 'stderr',
}

function isIgnorableConsoleWriteError(error) {
  const code = String(error?.code || '')
  if (code === 'EPIPE' || code === 'ERR_STREAM_DESTROYED') {
    return true
  }

  const message = String(error?.message || '')
  return /\bEPIPE\b|broken pipe|stream is destroyed/i.test(message)
}

function markStreamBroken(stream) {
  if (!stream || (typeof stream !== 'object' && typeof stream !== 'function')) {
    return
  }

  stream[STREAM_BROKEN] = true
}

function isStreamBroken(stream) {
  return Boolean(stream && stream[STREAM_BROKEN])
}

function rethrowUnexpectedStreamError(error) {
  setImmediate(() => {
    throw error
  })
}

function ensureStreamGuard(stream, onUnexpectedError = rethrowUnexpectedStreamError) {
  if (!stream || typeof stream.on !== 'function') {
    return
  }

  if (stream[STREAM_GUARD_INSTALLED]) {
    return
  }

  stream[STREAM_GUARD_INSTALLED] = true
  stream.on('error', (error) => {
    if (isIgnorableConsoleWriteError(error)) {
      markStreamBroken(stream)
      return
    }

    onUnexpectedError(error)
  })
}

function patchConsole(consoleObject, streams, options = {}) {
  if (!consoleObject || consoleObject[CONSOLE_PATCHED]) {
    return consoleObject
  }

  const stdout = streams?.stdout
  const stderr = streams?.stderr
  const onUnexpectedError = options.onUnexpectedError || rethrowUnexpectedStreamError

  ensureStreamGuard(stdout, onUnexpectedError)
  ensureStreamGuard(stderr, onUnexpectedError)

  for (const [methodName, targetName] of Object.entries(METHOD_TARGETS)) {
    const originalMethod = consoleObject[methodName]
    if (typeof originalMethod !== 'function') {
      continue
    }

    const targetStream = targetName === 'stderr' ? stderr : stdout

    consoleObject[methodName] = (...args) => {
      if (isStreamBroken(targetStream)) {
        return undefined
      }

      try {
        return originalMethod.apply(consoleObject, args)
      } catch (error) {
        if (isIgnorableConsoleWriteError(error)) {
          markStreamBroken(targetStream)
          return undefined
        }

        throw error
      }
    }
  }

  consoleObject[CONSOLE_PATCHED] = true
  return consoleObject
}

function installSafeConsole() {
  patchConsole(console, {
    stdout: process.stdout,
    stderr: process.stderr,
  })
}

module.exports = {
  ensureStreamGuard,
  installSafeConsole,
  isIgnorableConsoleWriteError,
  isStreamBroken,
  markStreamBroken,
  patchConsole,
  STREAM_BROKEN,
}
