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

test('getArtistSongs uses local track hints to disambiguate same-name artists', async () => {
  const originalSearch = api.search
  const originalArtistSongs = api.artist_songs
  const artistSongCalls = []
  const songSearchCalls = []

  api.search = (params) => {
    if (Number(params?.type || 0) === 100) {
      return Promise.resolve({
        body: {
          code: 200,
          result: {
            artists: [
              { id: 60037798, name: 'Winnie' },
              { id: 22348, name: 'winnie', alias: ['ウィニー'], alia: ['ウィニー'] },
            ],
          },
        },
      })
    }

    songSearchCalls.push({ ...params })
    if (String(params?.keywords || '').includes('forget me not')) {
      return Promise.resolve({
        body: {
          code: 200,
          result: {
            songs: [
              {
                id: 26297030,
                name: 'forget me not',
                ar: [{ id: 22348, name: 'winnie' }],
                al: { id: 2446366, name: 'Forget me not', picUrl: 'cover-26297030' },
                dt: 213920,
              },
              {
                id: 2644631582,
                name: '心中的另一个自己纯音乐',
                ar: [{ id: 60037798, name: 'Winnie' }],
                al: { id: 1, name: '心中的另一个自己', picUrl: 'cover-2644631582' },
                dt: 180000,
              },
            ],
          },
        },
      })
    }

    return Promise.resolve({
      body: {
        code: 200,
        result: {
          songs: [
            {
              id: 22745863,
              name: 'suck my brain',
              ar: [{ id: 22348, name: 'winnie' }],
              al: { id: 2088856, name: 'The Darkest Eternal Lights', picUrl: 'cover-22745863' },
              dt: 155000,
            },
          ],
        },
      },
    })
  }

  api.artist_songs = (params) => {
    artistSongCalls.push({ ...params })
    return Promise.resolve({
      body: {
        code: 200,
        songs: [
          {
            id: 26297030,
            name: 'forget me not',
            ar: [{ id: 22348, name: 'winnie' }],
            al: { id: 2446366, name: 'Forget me not', picUrl: 'cover-26297030' },
            dt: 213920,
          },
        ],
      },
    })
  }

  try {
    const service = new NeteaseService('mock-cookie')
    const tracks = await service.getArtistSongs('winnie', 20, {
      resolveContext: {
        trackNames: ['forget me not', 'suck my brain'],
        albumNames: ['Forget me not', 'The Darkest Eternal Lights'],
      },
    })

    assert.equal(songSearchCalls.length, 3)
    assert.equal(Number(artistSongCalls[0]?.id || 0), 22348)
    assert.equal(tracks.length, 1)
    assert.deepEqual(tracks[0].artistEntries, [{ id: 22348, name: 'winnie' }])
  } finally {
    api.search = originalSearch
    api.artist_songs = originalArtistSongs
  }
})

test('playlist management methods create refresh and mutate owned playlists', async () => {
  const originals = {
    playlist_create: api.playlist_create,
    playlist_detail: api.playlist_detail,
    playlist_name_update: api.playlist_name_update,
    playlist_desc_update: api.playlist_desc_update,
    playlist_cover_update: api.playlist_cover_update,
    playlist_delete: api.playlist_delete,
  }
  const calls = []

  api.playlist_create = (params) => {
    calls.push({ type: 'create', params: { ...params } })
    return Promise.resolve({
      body: {
        code: 200,
        id: 777,
      },
    })
  }

  api.playlist_detail = (params) => {
    calls.push({ type: 'detail', params: { ...params } })
    return Promise.resolve({
      body: {
        code: 200,
        playlist: {
          id: 777,
          name: 'Night Shift',
          description: 'Late commute',
          trackCount: 0,
          coverImgUrl: 'https://example.com/cover.jpg',
          creator: {
            userId: 1,
            nickname: 'Mock User',
          },
          subscribed: false,
        },
      },
    })
  }

  api.playlist_name_update = (params) => {
    calls.push({ type: 'rename', params: { ...params } })
    return Promise.resolve({ body: { code: 200 } })
  }

  api.playlist_desc_update = (params) => {
    calls.push({ type: 'desc', params: { ...params } })
    return Promise.resolve({ body: { code: 200 } })
  }

  api.playlist_cover_update = (params) => {
    calls.push({
      type: 'cover',
      params: {
        ...params,
        imgFile: {
          name: params?.imgFile?.name,
          size: Number(params?.imgFile?.data?.length || 0),
        },
      },
    })
    return Promise.resolve({ body: { code: 200, data: { url_pre: 'https://example.com/cover.jpg' } } })
  }

  api.playlist_delete = (params) => {
    calls.push({ type: 'delete', params: { ...params } })
    return Promise.resolve({ body: { code: 200 } })
  }

  try {
    const service = new NeteaseService('mock-cookie')
    const created = await service.createPlaylist('Night Shift')
    await service.renamePlaylist(777, 'Night Shift Updated')
    await service.updatePlaylistDescription(777, 'Late commute updated')
    await service.updatePlaylistCover(777, {
      name: 'cover.jpg',
      data: Buffer.from([1, 2, 3, 4]),
    })
    await service.deletePlaylist(777)

    assert.equal(created.id, 777)
    assert.equal(created.name, 'Night Shift')
    assert.equal(created.description, 'Late commute')
    assert.equal(created.creatorId, 1)
    assert.equal(created.coverUrl, 'https://example.com/cover.jpg')
    assert.deepEqual(
      calls.map((entry) => entry.type),
      ['create', 'detail', 'rename', 'desc', 'cover', 'delete']
    )
    assert.equal(calls.find((entry) => entry.type === 'rename')?.params?.name, 'Night Shift Updated')
    assert.equal(calls.find((entry) => entry.type === 'desc')?.params?.desc, 'Late commute updated')
    assert.equal(calls.find((entry) => entry.type === 'cover')?.params?.imgFile?.name, 'cover.jpg')
    assert.equal(calls.find((entry) => entry.type === 'cover')?.params?.imgFile?.size, 4)
    assert.equal(calls.find((entry) => entry.type === 'delete')?.params?.id, 777)
  } finally {
    api.playlist_create = originals.playlist_create
    api.playlist_detail = originals.playlist_detail
    api.playlist_name_update = originals.playlist_name_update
    api.playlist_desc_update = originals.playlist_desc_update
    api.playlist_cover_update = originals.playlist_cover_update
    api.playlist_delete = originals.playlist_delete
  }
})

test('getExplorePlaylists aggregates selected track and artist hot songs through simi playlists', async () => {
  const originals = {
    artist_songs: api.artist_songs,
    search: api.search,
    simi_playlist: api.simi_playlist,
    playlist_detail: api.playlist_detail,
    playlist_track_all: api.playlist_track_all,
  }
  const artistSongCalls = []
  const searchCalls = []
  const simiPlaylistCalls = []
  const detailCalls = []
  const trackAllCalls = []
  const buildSong = (id, artistId, artistName = `Artist ${artistId}`) => ({
    id,
    name: `Song ${id}`,
    ar: [{ id: artistId, name: artistName }],
    al: { id: 1000 + id, name: `Album ${id}`, picUrl: `cover-${id}` },
    dt: 180000,
  })
  const playlistSummaries = {
    11: { id: 11, name: '午夜流动', trackCount: 12, playCount: 320000, creator: { userId: 1, nickname: 'Night Shift' } },
    12: { id: 12, name: '城市回声', trackCount: 16, playCount: 880000, creator: { userId: 2, nickname: 'Echo FM' } },
    13: { id: 13, name: '长夜车窗', trackCount: 10, playCount: 510000, creator: { userId: 3, nickname: 'Late FM' } },
  }
  const previewTracks = {
    11: [buildSong(1101, 1)],
    12: [buildSong(1201, 2)],
    13: [buildSong(1301, 3)],
  }
  const fullTracks = {
    11: [buildSong(5003, 5, 'Artist 5'), buildSong(1112, 2)],
    12: [buildSong(5001, 5, 'Artist 5'), buildSong(5002, 5, 'Artist 5'), buildSong(1213, 4)],
    13: [buildSong(5002, 5, 'Artist 5'), buildSong(1312, 1)],
  }

  api.artist_songs = (params) => {
    artistSongCalls.push({ ...params })
    return Promise.resolve({
      body: {
        code: 200,
        songs: [
          buildSong(5002, 5, 'Artist 5'),
          buildSong(5003, 5, 'Artist 5'),
        ],
      },
    })
  }

  api.search = (params) => {
    searchCalls.push({ ...params })
    return Promise.resolve({
      body: {
        code: 200,
        result: {
          playlists: [],
        },
      },
    })
  }

  api.simi_playlist = (params) => {
    simiPlaylistCalls.push({ ...params })
    const seedTrackId = Number(params.id || 0)
    const playlists = seedTrackId === 5001
      ? [playlistSummaries[11], playlistSummaries[12]]
      : seedTrackId === 5002
        ? [playlistSummaries[12], playlistSummaries[13]]
        : seedTrackId === 5003
          ? [playlistSummaries[11]]
          : []

    return Promise.resolve({
      body: {
        code: 200,
        playlists,
      },
    })
  }

  api.playlist_detail = (params) => {
    detailCalls.push({ ...params })
    const playlistId = Number(params.id || 0)
    const summary = playlistSummaries[playlistId]
    return Promise.resolve({
      body: {
        code: 200,
        playlist: {
          ...summary,
          coverImgUrl: `cover-${playlistId}`,
          tracks: previewTracks[playlistId] || [],
        },
      },
    })
  }

  api.playlist_track_all = (params) => {
    trackAllCalls.push({ ...params })
    const playlistId = Number(params.id || 0)
    return Promise.resolve({
      body: {
        code: 200,
        songs: fullTracks[playlistId] || [],
      },
    })
  }

  try {
    const service = new NeteaseService('mock-cookie')
    const playlists = await service.getExplorePlaylists('Artist 5', {
      limit: 2,
      artistRef: 5,
      artistName: 'Artist 5',
      seedTrackId: 5001,
    })

    assert.equal(artistSongCalls.length, 1)
    assert.equal(Number(artistSongCalls[0].id || 0), 5)
    assert.equal(searchCalls.length, 1)
    assert.equal(String(searchCalls[0].keywords || ''), 'Artist 5')
    assert.deepEqual(simiPlaylistCalls.map((call) => Number(call.id || 0)), [5001, 5002, 5003])
    assert.deepEqual(simiPlaylistCalls.map((call) => Number(call.limit || 0)), [10, 10, 10])
    assert.deepEqual(
      [...new Set(detailCalls.map((call) => Number(call.id || 0)))].sort((left, right) => left - right),
      [11, 12, 13]
    )
    assert.deepEqual(
      [...new Set(trackAllCalls.map((call) => Number(call.id || 0)))].sort((left, right) => left - right),
      [11, 12, 13]
    )
    assert.deepEqual(playlists.map((playlist) => playlist.id), [12, 13])
    assert.equal(playlists[0].tracks.length, 1)
    assert.equal(playlists[1].tracks.length, 1)
  } finally {
    api.artist_songs = originals.artist_songs
    api.search = originals.search
    api.simi_playlist = originals.simi_playlist
    api.playlist_detail = originals.playlist_detail
    api.playlist_track_all = originals.playlist_track_all
  }
})

test('getExplorePlaylists falls back to artist search results and validates playlists by artist tracks', async () => {
  const originals = {
    artist_songs: api.artist_songs,
    search: api.search,
    simi_playlist: api.simi_playlist,
    playlist_detail: api.playlist_detail,
    playlist_track_all: api.playlist_track_all,
  }
  const artistSongCalls = []
  const searchCalls = []
  const simiPlaylistCalls = []
  const detailCalls = []
  const trackAllCalls = []
  const buildSong = (id, artistId, artistName = `Artist ${artistId}`) => ({
    id,
    name: `Song ${id}`,
    ar: [{ id: artistId, name: artistName }],
    al: { id: 2000 + id, name: `Album ${id}`, picUrl: `cover-${id}` },
    dt: 180000,
  })
  const playlistSummaries = {
    21: { id: 21, name: 'Artist 5 Live Picks', trackCount: 14, playCount: 910000, creator: { userId: 11, nickname: 'Live FM' } },
    22: { id: 22, name: 'Artist 5 Moodboard', trackCount: 11, playCount: 530000, creator: { userId: 12, nickname: 'Mood FM' } },
  }
  const previewTracks = {
    21: [buildSong(2101, 2, 'Artist 2')],
    22: [buildSong(2201, 3, 'Artist 3')],
  }
  const fullTracks = {
    21: [buildSong(2101, 2, 'Artist 2'), buildSong(2102, 5, 'Artist 5')],
    22: [buildSong(2201, 3, 'Artist 3'), buildSong(2202, 4, 'Artist 4')],
  }

  api.artist_songs = (params) => {
    artistSongCalls.push({ ...params })
    return Promise.resolve({
      body: {
        code: 200,
        songs: [],
      },
    })
  }

  api.search = (params) => {
    searchCalls.push({ ...params })
    return Promise.resolve({
      body: {
        code: 200,
        result: {
          playlists: [playlistSummaries[21], playlistSummaries[22]],
        },
      },
    })
  }

  api.simi_playlist = (params) => {
    simiPlaylistCalls.push({ ...params })
    return Promise.resolve({
      body: {
        code: 200,
        playlists: [],
      },
    })
  }

  api.playlist_detail = (params) => {
    detailCalls.push({ ...params })
    const playlistId = Number(params.id || 0)
    const summary = playlistSummaries[playlistId]
    return Promise.resolve({
      body: {
        code: 200,
        playlist: {
          ...summary,
          coverImgUrl: `cover-${playlistId}`,
          tracks: previewTracks[playlistId] || [],
        },
      },
    })
  }

  api.playlist_track_all = (params) => {
    trackAllCalls.push({ ...params })
    const playlistId = Number(params.id || 0)
    return Promise.resolve({
      body: {
        code: 200,
        songs: fullTracks[playlistId] || [],
      },
    })
  }

  try {
    const service = new NeteaseService('mock-cookie')
    const playlists = await service.getExplorePlaylists('Artist 5', {
      limit: 3,
      artistRef: 5,
      artistName: 'Artist 5',
    })

    assert.equal(artistSongCalls.length, 1)
    assert.equal(searchCalls.length, 1)
    assert.deepEqual(simiPlaylistCalls, [])
    assert.deepEqual(
      [...new Set(detailCalls.map((call) => Number(call.id || 0)))].sort((left, right) => left - right),
      [21, 22]
    )
    assert.deepEqual(
      [...new Set(trackAllCalls.map((call) => Number(call.id || 0)))].sort((left, right) => left - right),
      [21, 22]
    )
    assert.deepEqual(playlists.map((playlist) => playlist.id), [21])
    assert.equal(playlists[0].artistId, 5)
    assert.equal(playlists[0].artistName, 'Artist 5')
  } finally {
    api.artist_songs = originals.artist_songs
    api.search = originals.search
    api.simi_playlist = originals.simi_playlist
    api.playlist_detail = originals.playlist_detail
    api.playlist_track_all = originals.playlist_track_all
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
