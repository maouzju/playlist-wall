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

test('buildSongUrlLevelCandidates prefers the highest available levels by default', () => {
  assert.deepEqual(
    __testing.buildSongUrlLevelCandidates(),
    ['jymaster', 'sky', 'jyeffect', 'hires', 'lossless', 'exhigh', 'standard']
  )
  assert.deepEqual(
    __testing.buildSongUrlLevelCandidates('lossless'),
    ['lossless', 'exhigh', 'standard']
  )
  assert.deepEqual(
    __testing.buildSongUrlLevelCandidates('standard'),
    ['standard']
  )
})

test('getSongUrl falls back through the configured quality ladder until a playable url is found', async () => {
  const original = api.song_url_v1
  const calls = []

  api.song_url_v1 = (params) => {
    calls.push({ ...params })
    const level = String(params.level || '')
    const url = level === 'exhigh' ? 'https://example.com/mock-exhigh.mp3' : null
    return Promise.resolve({
      body: {
        data: [
          {
            url,
            time: 180000,
          },
        ],
      },
    })
  }

  try {
    const service = new NeteaseService('mock-cookie')
    const result = await service.getSongUrl(123456)

    assert.deepEqual(
      calls.map((call) => call.level),
      ['jymaster', 'sky', 'jyeffect', 'hires', 'lossless', 'exhigh']
    )
    assert.equal(result.level, 'exhigh')
    assert.equal(result.url, 'https://example.com/mock-exhigh.mp3')
  } finally {
    api.song_url_v1 = original
  }
})

test('callApi does not retry 405 rate-limit responses', async () => {
  const apiName = '__codex_405_no_retry__'
  let attempts = 0
  api[apiName] = () => {
    attempts += 1
    return Promise.reject({
      status: 405,
      body: {
        code: 405,
        msg: '操作过于频繁，请稍后再试',
      },
    })
  }

  try {
    await assert.rejects(
      __testing.callApi(apiName, {}, {
        fallbackMessage: 'request failed',
        retryDelayMs: 0,
      }),
      /操作过于频繁/
    )
    assert.equal(attempts, 1)
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

test('getArtistSongs fetches all pages when maxCount is not positive', async () => {
  const original = api.artist_songs
  const calls = []

  api.artist_songs = (params) => {
    calls.push({ ...params })
    const offset = Number(params.offset || 0)
    const limit = Number(params.limit || 0)
    const remaining = Math.max(0, 205 - offset)
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
    const tracks = await service.getArtistSongs(6452, 0)

    assert.equal(calls.length, 3)
    assert.deepEqual(calls.map((call) => Number(call.limit || 0)), [100, 100, 100])
    assert.deepEqual(calls.map((call) => Number(call.offset || 0)), [0, 100, 200])
    assert.equal(tracks.length, 205)
    assert.equal(tracks[204].position, 205)
  } finally {
    api.artist_songs = original
  }
})

test('getArtistSongs resolves artist ids from artist names when ids are missing', async () => {
  const originalSearch = api.search
  const originalArtistSongs = api.artist_songs
  const searchCalls = []
  const songCalls = []

  api.search = (params) => {
    searchCalls.push({ ...params })
    return Promise.resolve({
      body: {
        code: 200,
        result: {
          artists: [
            { id: 11, name: 'Lovi Band' },
            { id: 6452, name: 'Lovi' },
          ],
        },
      },
    })
  }

  api.artist_songs = (params) => {
    songCalls.push({ ...params })
    return Promise.resolve({
      body: {
        code: 200,
        songs: [
          {
            id: 9001,
            name: 'will we be okay?',
            ar: [{ id: 6452, name: 'Lovi' }],
            al: { id: 321, name: 'Mock Album', picUrl: 'cover-9001' },
            dt: 180000,
          },
        ],
      },
    })
  }

  try {
    const service = new NeteaseService('mock-cookie')
    const tracks = await service.getArtistSongs('Lovi', 20)

    assert.equal(searchCalls.length, 1)
    assert.equal(searchCalls[0].type, 100)
    assert.equal(searchCalls[0].keywords, 'Lovi')
    assert.equal(songCalls.length, 1)
    assert.equal(Number(songCalls[0].id || 0), 6452)
    assert.equal(tracks.length, 1)
    assert.deepEqual(tracks[0].artistEntries, [{ id: 6452, name: 'Lovi' }])
  } finally {
    api.search = originalSearch
    api.artist_songs = originalArtistSongs
  }
})

test('subscribePlaylist retries timed out requests before failing', async () => {
  const original = api.playlist_subscribe
  const calls = []
  let attempts = 0

  api.playlist_subscribe = (params) => {
    calls.push({ ...params })
    attempts += 1

    if (attempts === 1) {
      const error = new Error('request timeout')
      error.code = 'ETIMEDOUT'
      error.status = 408
      return Promise.reject(error)
    }

    return Promise.resolve({
      body: {
        code: 200,
      },
    })
  }

  try {
    const service = new NeteaseService('mock-cookie')
    await assert.doesNotReject(() => service.subscribePlaylist(123456))
    assert.equal(attempts, 2)
    assert.deepEqual(calls.map((call) => Number(call.t || 0)), [1, 1])
    assert.deepEqual(calls.map((call) => Number(call.id || 0)), [123456, 123456])
  } finally {
    api.playlist_subscribe = original
  }
})
