const test = require('node:test')
const assert = require('node:assert/strict')
const { EventEmitter } = require('node:events')

const {
  ensureStreamGuard,
  isIgnorableConsoleWriteError,
  isStreamBroken,
  patchConsole,
} = require('../src/main/safe-console')

function createFakeStream() {
  const stream = new EventEmitter()
  stream.write = () => true
  return stream
}

test('recognizes EPIPE console write errors as ignorable', () => {
  assert.equal(
    isIgnorableConsoleWriteError(Object.assign(new Error('broken pipe'), { code: 'EPIPE' })),
    true
  )
  assert.equal(
    isIgnorableConsoleWriteError(new Error('something else')),
    false
  )
})

test('patchConsole swallows EPIPE writes and stops using the broken stream', () => {
  const stdout = createFakeStream()
  const stderr = createFakeStream()
  const calls = []
  let logAttempts = 0

  const fakeConsole = {
    log(...args) {
      logAttempts += 1
      if (logAttempts === 1) {
        throw Object.assign(new Error('broken pipe'), { code: 'EPIPE' })
      }
      calls.push(['log', ...args])
    },
    info(...args) {
      calls.push(['info', ...args])
    },
    debug(...args) {
      calls.push(['debug', ...args])
    },
    warn(...args) {
      calls.push(['warn', ...args])
    },
    error(...args) {
      calls.push(['error', ...args])
    },
    trace(...args) {
      calls.push(['trace', ...args])
    },
  }

  patchConsole(fakeConsole, { stdout, stderr }, {
    onUnexpectedError: (error) => {
      throw error
    },
  })

  assert.doesNotThrow(() => {
    fakeConsole.log('first failure should be swallowed')
  })
  assert.equal(isStreamBroken(stdout), true)

  fakeConsole.log('second write should be skipped')
  assert.deepEqual(calls, [])
})

test('ensureStreamGuard marks the stream broken after an EPIPE event', async () => {
  const stdout = createFakeStream()

  ensureStreamGuard(stdout, (error) => {
    throw error
  })

  stdout.emit('error', Object.assign(new Error('write EPIPE'), { code: 'EPIPE' }))

  await new Promise((resolve) => setImmediate(resolve))
  assert.equal(isStreamBroken(stdout), true)
})
