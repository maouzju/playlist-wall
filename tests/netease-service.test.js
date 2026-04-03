const test = require('node:test')
const assert = require('node:assert/strict')

const api = require('NeteaseCloudMusicApi')
const { NeteaseService, __testing } = require('../src/main/netease-service')

test('callApi times out hanging requests instead of waiting forever', async () => {
  const apiName = '__codex_timeout_once__'
  api[apiName] = () => new Promise(() => {})

  try {
    const startedAt = Date.now()
    await assert.rejects(
      __testing.callApi(apiName, {}, {
        fallbackMessage: 'request failed',
        timeoutMs: 25,
        maxAttempts: 1,
        retryDelayMs: 0,
      }),
      /\u8bf7\u6c42\u8d85\u65f6/
    )
    assert.ok(Date.now() - startedAt < 500)
  } finally {
    delete api[apiName]
  }
})

test('callApi treats timed out attempts as retryable', async () => {
  const apiName = '__codex_timeout_then_success__'
  let attempts = 0
  api[apiName] = () => {
    attempts += 1
    if (attempts === 1) {
      return new Promise(() => {})
    }
    return Promise.resolve({
      body: {
        code: 200,
      },
    })
  }

  try {
    const result = await __testing.callApi(apiName, {}, {
      fallbackMessage: 'request failed',
      timeoutMs: 25,
      maxAttempts: 2,
      retryDelayMs: 0,
    })

    assert.equal(attempts, 2)
    assert.equal(result.body.code, 200)
  } finally {
    delete api[apiName]
  }
})

test('getArtistSongs paginates hot songs and keeps artist ids', async () => {
  const original = api.artist_songs
  const calls = []

  api.artist_songs = (params) => {
    calls.push({ ...params })
    const offset = Number(params.offset || 0)
    const limit = Number(params.limit || 0)
    const remaining = Math.max(0, 105 - offset)
    const count = Math.min(limit, remaining)
    const songs = Array.from({ length: count }, (_, index) => {
      const id = offset + index + 1
      return {
        id,
        name: `Song ${id}`,
        ar: [{ id: 6452, name: 'Artist 6452' }],
        al: { id: 200 + id, name: `Album ${id}`, picUrl: `cover-${id}` },
        dt: 180000,
      }
    })

    return Promise.resolve({
      body: {
        code: 200,
        songs,
      },
    })
  }

  try {
    const service = new NeteaseService('mock-cookie')
    const tracks = await service.getArtistSongs(6452, 105)

    assert.equal(calls.length, 2)
    assert.deepEqual(calls.map((call) => call.order), ['hot', 'hot'])
    assert.deepEqual(calls.map((call) => Number(call.offset || 0)), [0, 100])
    assert.equal(tracks.length, 105)
    assert.deepEqual(tracks[0].artistEntries, [{ id: 6452, name: 'Artist 6452' }])
    assert.equal(tracks[104].position, 105)
  } finally {
    api.artist_songs = original
  }
})
