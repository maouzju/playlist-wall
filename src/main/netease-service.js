const api = require('NeteaseCloudMusicApi')

const PLAYLIST_PAGE_SIZE = 1000
const EXPLORE_DETAIL_CONCURRENCY = 4
const API_REQUEST_TIMEOUT_MS = 15000
const API_MAX_ATTEMPTS = 5
const API_RETRY_DELAY_MS = 2000
const PLAYLIST_SUBSCRIPTION_TIMEOUT_MS = 8000
const API_TIMEOUT_MESSAGE = '\u8bf7\u6c42\u8d85\u65f6\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function createTimeoutError(message = API_TIMEOUT_MESSAGE) {
  const error = new Error(message)
  error.code = 'ETIMEDOUT'
  error.status = 408
  return error
}

function withTimeout(promise, timeoutMs, timeoutMessage = API_TIMEOUT_MESSAGE) {
  const normalizedTimeoutMs = Number(timeoutMs || 0)
  if (normalizedTimeoutMs <= 0) {
    return Promise.resolve(promise)
  }

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(createTimeoutError(timeoutMessage))
    }, normalizedTimeoutMs)

    Promise.resolve(promise).then(
      (value) => {
        clearTimeout(timer)
        resolve(value)
      },
      (error) => {
        clearTimeout(timer)
        reject(error)
      }
    )
  })
}

function createApiError(error, fallbackMessage, codeMessages = {}) {
  const body = error?.body || null
  const status = Number(error?.status || body?.code || 0)
  const explicitMessage = status > 0 && codeMessages[status]
    ? codeMessages[status]
    : ''
  const rawMessage = body?.message || body?.msg || error?.message || ''
  const message = explicitMessage
    || (rawMessage && rawMessage !== '[object Object]' ? String(rawMessage) : '')
    || fallbackMessage
    || `API request failed (${status || 'unknown'})`
  const wrapped = new Error(message)
  wrapped.status = status
  wrapped.body = body
  wrapped.cause = error
  return wrapped
}

function ensureApiSuccess(body, fallbackMessage, codeMessages = {}) {
  if (!body || typeof body !== 'object') {
    throw createApiError({}, fallbackMessage, codeMessages)
  }

  const code = Number(body.code || 0)
  if (code > 0 && code !== 200) {
    throw createApiError({ body, status: code }, fallbackMessage, codeMessages)
  }
}

function normalizeSongSource(data, level) {
  return {
    url: data?.url || null,
    level,
    streamDurationMs: Number(data?.time || data?.duration || 0),
    previewStartMs: Number(data?.freeTrialInfo?.start || data?.start || 0),
    previewEndMs: Number(data?.freeTrialInfo?.end || data?.end || 0),
    fee: Number(data?.fee || 0),
    code: Number(data?.code || 0),
    freeTrialInfo: data?.freeTrialInfo || null,
  }
}

function normalizeArtistEntries(source) {
  const artists = source?.ar || source?.artists || source?.artistNames || []
  if (Array.isArray(artists)) {
    return artists.map((artist) => {
      if (typeof artist === 'string') {
        return {
          id: 0,
          name: artist.trim(),
        }
      }

      return {
        id: Number(artist?.id || artist?.artistId || 0),
        name: String(artist?.name || artist?.artistName || '').trim(),
      }
    }).filter((artist) => artist.name)
  }

  if (typeof artists === 'string') {
    return artists.split(/[\/,\u3001]/).map((item) => ({
      id: 0,
      name: item.trim(),
    })).filter((artist) => artist.name)
  }

  return []
}

function normalizeArtists(source) {
  return normalizeArtistEntries(source).map((artist) => artist.name)
}

function normalizeTrackIds(trackIds) {
  return [...new Set(
    (Array.isArray(trackIds) ? trackIds : [trackIds])
      .map((id) => Number(id))
      .filter((id) => id > 0)
  )]
}

function normalizeTrackRecord(track, index = 0) {
  const source = track?.songInfo || track?.songData || track?.song || track?.track || track || {}
  const album = source?.al || source?.album || {}
  const artistEntries = normalizeArtistEntries(source)

  return {
    id: Number(source?.id || track?.songId || track?.id || 0),
    name: source?.name || track?.name || '',
    artists: artistEntries.map((artist) => artist.name),
    artistEntries,
    album: album?.name || source?.albumName || '',
    albumId: Number(album?.id || source?.albumId || 0),
    albumCoverUrl: album?.picUrl || album?.coverUrl || source?.albumPicUrl || '',
    durationMs: Number(source?.dt || source?.duration || track?.durationMs || 0),
    position: Number(track?.position || source?.position || index + 1),
  }
}

function normalizePlaylistSummary(playlist, overrides = {}) {
  const creator = playlist?.creator || {}

  return {
    id: Number(overrides.id || playlist?.id || 0),
    sourcePlaylistId: Number(overrides.sourcePlaylistId || playlist?.sourcePlaylistId || playlist?.id || 0),
    name: playlist?.name || '',
    trackCount: Number(playlist?.trackCount || 0),
    coverUrl: playlist?.coverImgUrl || playlist?.coverUrl || '',
    specialType: Number(playlist?.specialType || 0),
    subscribed: overrides.subscribed !== undefined
      ? Boolean(overrides.subscribed)
      : Boolean(playlist?.subscribed),
    creatorId: Number(overrides.creatorId || creator?.userId || playlist?.creatorId || 0),
    creatorName: overrides.creatorName || creator?.nickname || playlist?.creatorName || '',
    playCount: Number(overrides.playCount || playlist?.playCount || 0),
    copywriter: overrides.copywriter || playlist?.copywriter || '',
    exploreSourceLabel: overrides.exploreSourceLabel || playlist?.exploreSourceLabel || '',
    isExplore: overrides.isExplore !== undefined
      ? Boolean(overrides.isExplore)
      : Boolean(playlist?.isExplore),
  }
}

function normalizeExplorePlaylistDetail(playlist, detail, overrides = {}) {
  const summary = normalizePlaylistSummary(detail || playlist, {
    ...overrides,
    id: Number(playlist?.id || detail?.id || 0),
    sourcePlaylistId: Number(playlist?.sourcePlaylistId || playlist?.id || detail?.id || 0),
    isExplore: true,
  })
  const tracks = Array.isArray(detail?.tracks)
    ? detail.tracks.map((track, index) => normalizeTrackRecord(track, index))
    : []
  const expectedTrackCount = Math.max(Number(detail?.trackCount || summary.trackCount || 0), tracks.length)

  return {
    ...summary,
    trackCount: expectedTrackCount,
    tracks,
    tracksError: overrides.tracksError || '',
    hydrated: tracks.length >= expectedTrackCount,
    hydrating: false,
  }
}

async function mapWithConcurrency(items, limit, mapper) {
  const results = new Array(items.length)
  let cursor = 0

  async function worker() {
    while (cursor < items.length) {
      const index = cursor
      cursor += 1
      results[index] = await mapper(items[index], index)
    }
  }

  const workerCount = Math.max(1, Math.min(limit, items.length))
  await Promise.all(Array.from({ length: workerCount }, () => worker()))
  return results
}

async function callApi(name, params, options = {}) {
  const fn = api[name]
  if (typeof fn !== 'function') {
    throw new Error(`Unknown API: ${name}`)
  }

  const maxAttempts = Number.isInteger(options.maxAttempts) && options.maxAttempts > 0
    ? options.maxAttempts
    : API_MAX_ATTEMPTS
  const timeoutMs = Number.isFinite(options.timeoutMs) && options.timeoutMs > 0
    ? Math.round(options.timeoutMs)
    : API_REQUEST_TIMEOUT_MS
  const retryDelayMs = Number.isFinite(options.retryDelayMs) && options.retryDelayMs >= 0
    ? Number(options.retryDelayMs)
    : API_RETRY_DELAY_MS
  const timeoutMessage = typeof options.timeoutMessage === 'string' && options.timeoutMessage.trim()
    ? options.timeoutMessage.trim()
    : API_TIMEOUT_MESSAGE

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await withTimeout(fn(params), timeoutMs, timeoutMessage)
      if (!response || typeof response !== 'object') {
        throw new Error(`Bad response from ${name}`)
      }
      return response
    } catch (error) {
      const errorCode = error && error.code ? String(error.code) : ''
      const msg = error && error.message ? error.message : ''
      const body = error && error.body ? error.body : null
      const bodyMsg = body && (body.msg || body.message) ? (body.msg || body.message) : ''
      const status = (error && error.status) || (body && body.code) || 0
      const retryable = /(ETIMEDOUT|timeout|502|ECONNRESET|405|\u9891\u7e41)/i.test(`${errorCode} ${msg} ${bodyMsg} ${status}`)
      if (!retryable || attempt === maxAttempts) {
        throw createApiError(
          error,
          options.fallbackMessage || `API request failed: ${name}`,
          options.codeMessages || {}
        )
      }
      await sleep(retryDelayMs * attempt)
    }
  }

  throw new Error(`API retry budget exhausted for ${name}`)
}

function normalizeSongs(body) {
  if (!body || typeof body !== 'object') {
    throw new Error('Invalid playlist track payload')
  }

  if (body.code && body.code !== 200) {
    throw new Error(`Playlist track request failed: ${body.code}`)
  }

  if (!Array.isArray(body.songs)) {
    throw new Error('Playlist track payload does not contain songs')
  }

  return body.songs
}

class NeteaseService {
  constructor(cookie) {
    this.cookie = cookie
  }

  async createQrLogin() {
    const keyResponse = await callApi('login_qr_key', {
      timestamp: Date.now(),
    }, {
      fallbackMessage: '\u751f\u6210\u767b\u5f55\u4e8c\u7ef4\u7801\u5931\u8d25',
    })

    const key = keyResponse.body?.data?.unikey || keyResponse.body?.data?.key || ''
    if (!key) {
      throw new Error('\u751f\u6210\u767b\u5f55\u4e8c\u7ef4\u7801\u5931\u8d25')
    }

    const imageResponse = await callApi('login_qr_create', {
      key,
      qrimg: true,
      timestamp: Date.now(),
    }, {
      fallbackMessage: '\u751f\u6210\u767b\u5f55\u4e8c\u7ef4\u7801\u5931\u8d25',
    })

    return {
      key,
      qrUrl: imageResponse.body?.data?.qrurl || '',
      qrImage: imageResponse.body?.data?.qrimg || '',
    }
  }

  async checkQrLogin(key) {
    const response = await callApi('login_qr_check', {
      key,
      timestamp: Date.now(),
    }, {
      fallbackMessage: '\u68c0\u67e5\u4e8c\u7ef4\u7801\u767b\u5f55\u72b6\u6001\u5931\u8d25',
    })

    const body = response.body || {}
    const code = Number(body.code || 0)
    if (code === 800) {
      return {
        status: 'expired',
        message: '\u4e8c\u7ef4\u7801\u5df2\u8fc7\u671f\uff0c\u8bf7\u5237\u65b0\u540e\u91cd\u8bd5\u3002',
        cookie: '',
      }
    }

    if (code === 801) {
      return {
        status: 'waiting',
        message: '\u8bf7\u4f7f\u7528\u7f51\u6613\u4e91\u97f3\u4e50\u626b\u7801\u3002',
        cookie: '',
      }
    }

    if (code === 802) {
      return {
        status: 'confirm',
        message: '\u5df2\u626b\u7801\uff0c\u8bf7\u5728\u624b\u673a\u4e0a\u786e\u8ba4\u767b\u5f55\u3002',
        cookie: '',
      }
    }

    if (code === 803 || (code === 200 && body.cookie)) {
      return {
        status: 'authorized',
        message: '\u767b\u5f55\u6210\u529f',
        cookie: body.cookie || '',
      }
    }

    throw createApiError(
      { body, status: code },
      '\u68c0\u67e5\u4e8c\u7ef4\u7801\u767b\u5f55\u72b6\u6001\u5931\u8d25'
    )
  }

  async getAccount() {
    const response = await callApi('login_status', { cookie: this.cookie })
    const profile = response.body?.data?.profile || {}
    return {
      userId: profile.userId,
      nickname: profile.nickname || '',
      avatarUrl: profile.avatarUrl || '',
    }
  }

  async listPlaylists(userId) {
    const response = await callApi('user_playlist', {
      cookie: this.cookie,
      uid: userId,
      limit: 1000,
    })

    const playlists = response.body?.playlist || []
    return playlists.map((playlist) => ({
      id: Number(playlist.id),
      name: playlist.name || '',
      trackCount: Number(playlist.trackCount || 0),
      coverUrl: playlist.coverImgUrl || '',
      specialType: Number(playlist.specialType || 0),
      subscribed: Boolean(playlist.subscribed),
      creatorId: Number(playlist.creator?.userId || 0),
    }))
  }

  async getUserPlayCounts(userId) {
    const response = await callApi('user_record', {
      cookie: this.cookie,
      uid: userId,
      type: 0,
    }, {
      fallbackMessage: '\u83b7\u53d6\u542c\u6b4c\u6392\u884c\u5931\u8d25',
      codeMessages: {
        301: '\u542c\u6b4c\u6392\u884c\u9700\u8981\u6709\u6548\u7684\u7f51\u6613\u4e91\u767b\u5f55\u6001\uff0c\u8bf7\u5237\u65b0\u767b\u5f55\u540e\u518d\u8bd5\u3002',
      },
    })

    const body = response.body || {}
    ensureApiSuccess(body, '\u83b7\u53d6\u542c\u6b4c\u6392\u884c\u5931\u8d25', {
      301: '\u542c\u6b4c\u6392\u884c\u9700\u8981\u6709\u6548\u7684\u7f51\u6613\u4e91\u767b\u5f55\u6001\uff0c\u8bf7\u5237\u65b0\u767b\u5f55\u540e\u518d\u8bd5\u3002',
    })

    const playCounts = {}
    for (const item of body.allData || []) {
      const trackId = Number(item?.song?.id || item?.id || 0)
      const playCount = Number(item?.playCount || item?.score || item?.listenCount || 0)
      if (trackId > 0 && playCount > 0) {
        playCounts[String(trackId)] = Math.max(Number(playCounts[String(trackId)] || 0), playCount)
      }
    }

    return playCounts
  }

  async getPlaylistTracks(playlistId, expectedCount = 0) {
    const tracks = []
    let offset = 0

    while (true) {
      const response = await callApi('playlist_track_all', {
        cookie: this.cookie,
        id: playlistId,
        limit: PLAYLIST_PAGE_SIZE,
        offset,
      })

      const songs = normalizeSongs(response.body)
      if (!songs.length) {
        break
      }

      tracks.push(...songs.map((track, index) => normalizeTrackRecord(track, offset + index)))

      if (songs.length < PLAYLIST_PAGE_SIZE) {
        break
      }

      offset += songs.length
      if (expectedCount > 0 && tracks.length >= expectedCount) {
        break
      }
    }

    return tracks.map((track, index) => ({
      ...track,
      position: index + 1,
    }))
  }

  async getArtistSongs(artistId, maxCount = 100) {
    const normalizedArtistId = Number(artistId || 0)
    const normalizedMaxCount = Math.max(1, Math.round(Number(maxCount || 0) || 0))
    if (normalizedArtistId <= 0) {
      throw new Error('\u827a\u4eba\u4e0d\u5b58\u5728')
    }

    const tracks = []
    const seen = new Set()
    let offset = 0

    while (tracks.length < normalizedMaxCount) {
      const pageLimit = Math.min(100, normalizedMaxCount - tracks.length)
      const response = await callApi('artist_songs', {
        cookie: this.cookie,
        id: normalizedArtistId,
        order: 'hot',
        offset,
        limit: pageLimit,
      }, {
        fallbackMessage: '\u83b7\u53d6\u827a\u4eba\u6b4c\u66f2\u5931\u8d25',
      })

      ensureApiSuccess(response.body, '\u83b7\u53d6\u827a\u4eba\u6b4c\u66f2\u5931\u8d25')
      const songs = Array.isArray(response.body?.songs) ? response.body.songs : []
      if (!songs.length) {
        break
      }

      for (const song of songs) {
        const track = normalizeTrackRecord(song, tracks.length)
        if (track.id <= 0 || seen.has(track.id)) {
          continue
        }

        seen.add(track.id)
        tracks.push(track)
        if (tracks.length >= normalizedMaxCount) {
          break
        }
      }

      if (songs.length < pageLimit) {
        break
      }

      offset += songs.length
    }

    return tracks.map((track, index) => ({
      ...track,
      position: index + 1,
    }))
  }

  async getSongUrl(songId) {
    const high = await callApi('song_url_v1', {
      cookie: this.cookie,
      id: songId,
      level: 'exhigh',
    })
    const highData = high.body?.data?.[0]
    if (highData?.url) {
      return normalizeSongSource(highData, 'exhigh')
    }

    const standard = await callApi('song_url_v1', {
      cookie: this.cookie,
      id: songId,
      level: 'standard',
    })
    return normalizeSongSource(standard.body?.data?.[0], 'standard')
  }

  async removeTrackFromPlaylist(playlistId, trackIds) {
    const normalizedTrackIds = normalizeTrackIds(trackIds)
    if (!normalizedTrackIds.length) {
      throw new Error('移出歌单失败')
    }

    const response = await callApi('playlist_tracks', {
      cookie: this.cookie,
      op: 'del',
      pid: playlistId,
      tracks: normalizedTrackIds.join(','),
    }, {
      fallbackMessage: '\u79fb\u51fa\u6b4c\u5355\u5931\u8d25',
      codeMessages: {
        301: '\u9700\u8981\u6709\u6548\u7684\u7f51\u6613\u4e91\u767b\u5f55\u6001\uff0c\u624d\u80fd\u79fb\u51fa\u6b4c\u66f2\u3002',
      },
    })

    ensureApiSuccess(response.body, '\u79fb\u51fa\u6b4c\u5355\u5931\u8d25')
  }

  async addTrackToPlaylist(playlistId, trackIds) {
    const normalizedTrackIds = normalizeTrackIds(trackIds)
    if (!normalizedTrackIds.length) {
      throw new Error('加入歌单失败')
    }

    const response = await callApi('playlist_tracks', {
      cookie: this.cookie,
      op: 'add',
      pid: playlistId,
      tracks: normalizedTrackIds.join(','),
    }, {
      fallbackMessage: '\u52a0\u5165\u6b4c\u5355\u5931\u8d25',
      codeMessages: {
        301: '\u9700\u8981\u6709\u6548\u7684\u7f51\u6613\u4e91\u767b\u5f55\u6001\uff0c\u624d\u80fd\u6536\u85cf\u63a8\u8350\u6b4c\u66f2\u3002',
      },
    })

    ensureApiSuccess(response.body, '\u52a0\u5165\u6b4c\u5355\u5931\u8d25')
  }

  async subscribePlaylist(playlistId) {
    const response = await callApi('playlist_subscribe', {
      cookie: this.cookie,
      id: playlistId,
      t: 1,
    }, {
      fallbackMessage: '\u6536\u85cf\u6b4c\u5355\u5931\u8d25',
      timeoutMs: PLAYLIST_SUBSCRIPTION_TIMEOUT_MS,
      maxAttempts: 1,
      retryDelayMs: 0,
      codeMessages: {
        301: '\u9700\u8981\u6709\u6548\u7684\u7f51\u6613\u4e91\u767b\u5f55\u6001\uff0c\u624d\u80fd\u6536\u85cf\u6b4c\u5355\u3002',
      },
    })

    ensureApiSuccess(response.body, '\u6536\u85cf\u6b4c\u5355\u5931\u8d25')
  }

  async unsubscribePlaylist(playlistId) {
    const response = await callApi('playlist_subscribe', {
      cookie: this.cookie,
      id: playlistId,
      t: 2,
    }, {
      fallbackMessage: '\u5220\u9664\u6536\u85cf\u6b4c\u5355\u5931\u8d25',
      timeoutMs: PLAYLIST_SUBSCRIPTION_TIMEOUT_MS,
      maxAttempts: 1,
      retryDelayMs: 0,
      codeMessages: {
        301: '\u9700\u8981\u6709\u6548\u7684\u7f51\u6613\u4e91\u767b\u5f55\u6001\uff0c\u624d\u80fd\u5220\u9664\u6536\u85cf\u6b4c\u5355\u3002',
      },
    })

    ensureApiSuccess(response.body, '\u5220\u9664\u6536\u85cf\u6b4c\u5355\u5931\u8d25')
  }

  async updatePlaylistTrackOrder(playlistId, trackIds) {
    const normalizedTrackIds = [...new Set((trackIds || []).map((id) => Number(id)).filter((id) => id > 0))]
    if (!normalizedTrackIds.length) {
      throw new Error('\u66f4\u65b0\u6b4c\u5355\u987a\u5e8f\u5931\u8d25')
    }

    const response = await callApi('song_order_update', {
      cookie: this.cookie,
      pid: playlistId,
      ids: JSON.stringify(normalizedTrackIds),
    }, {
      fallbackMessage: '\u66f4\u65b0\u6b4c\u5355\u987a\u5e8f\u5931\u8d25',
      codeMessages: {
        301: '\u9700\u8981\u6709\u6548\u7684\u7f51\u6613\u4e91\u767b\u5f55\u6001\uff0c\u624d\u80fd\u8c03\u6574\u6b4c\u5355\u987a\u5e8f\u3002',
      },
    })

    ensureApiSuccess(response.body, '\u66f4\u65b0\u6b4c\u5355\u987a\u5e8f\u5931\u8d25')
  }

  async getPlaylistRecommendations(seedTrackIds, count = 12) {
    const normalizedSeedTrackIds = [...new Set((seedTrackIds || []).map((id) => Number(id)).filter((id) => id > 0))]
    const seen = new Set()
    const tracks = []
    let lastError = null

    for (const seedTrackId of normalizedSeedTrackIds) {
      try {
        const response = await callApi('simi_song', {
          cookie: this.cookie,
          id: seedTrackId,
          limit: Math.max(count, 8),
        }, {
          fallbackMessage: '\u83b7\u53d6\u6b4c\u5355\u76f8\u4f3c\u6b4c\u66f2\u5931\u8d25',
          codeMessages: {
            301: '\u76f8\u4f3c\u63a8\u8350\u9700\u8981\u6709\u6548\u7684\u7f51\u6613\u4e91\u767b\u5f55\u6001\uff0c\u8bf7\u5237\u65b0\u767b\u5f55\u540e\u518d\u8bd5\u3002',
          },
        })

        const body = response.body || {}
        ensureApiSuccess(body, '\u83b7\u53d6\u6b4c\u5355\u76f8\u4f3c\u6b4c\u66f2\u5931\u8d25', {
          301: '\u76f8\u4f3c\u63a8\u8350\u9700\u8981\u6709\u6548\u7684\u7f51\u6613\u4e91\u767b\u5f55\u6001\uff0c\u8bf7\u5237\u65b0\u767b\u5f55\u540e\u518d\u8bd5\u3002',
        })

        for (const item of body.songs || []) {
          const track = normalizeTrackRecord(item, tracks.length)
          if (track.id <= 0 || seen.has(track.id)) {
            continue
          }
          seen.add(track.id)
          tracks.push(track)
        }
      } catch (error) {
        lastError = error
      }
    }

    if (!tracks.length && lastError) {
      throw lastError
    }

    return tracks
  }

  async getExplorePlaylists(query = '', options = {}) {
    const normalizedQuery = String(query || '').trim()
    return normalizedQuery
      ? this.searchExplorePlaylists(normalizedQuery, options)
      : this.getDefaultExplorePlaylists(options)
  }

  async getDefaultExplorePlaylists(options = {}) {
    const dailyLimit = Math.max(1, Number(options.dailyLimit || 6))
    const communityLimit = Math.max(1, Number(options.communityLimit || 12))
    const merged = []
    let fallbackError = null

    try {
      const daily = await this.getDailyRecommendedPlaylistPreviews(dailyLimit)
      merged.push(...daily)
    } catch (error) {
      fallbackError = error
    }

    try {
      const community = await this.getCommunityPlaylistPreviews(communityLimit, options.cat || '全部')
      merged.push(...community)
    } catch (error) {
      fallbackError = fallbackError || error
    }

    if (!merged.length && fallbackError) {
      throw fallbackError
    }

    return [...new Map(
      merged
        .filter((playlist) => Number(playlist?.sourcePlaylistId || playlist?.id || 0) > 0)
        .map((playlist) => [Number(playlist.sourcePlaylistId || playlist.id), playlist])
    ).values()]
  }

  async searchExplorePlaylists(keywords, options = {}) {
    const response = await callApi('search', {
      cookie: this.cookie,
      keywords,
      type: 1000,
      limit: Math.max(1, Number(options.limit || 18)),
      offset: Math.max(0, Number(options.offset || 0)),
    }, {
      fallbackMessage: '搜索社区歌单失败',
      codeMessages: {
        301: '搜索社区歌单需要有效的网易云登录态，请刷新登录后再试。',
      },
    })

    const playlists = response.body?.result?.playlists || []
    return this.expandExplorePlaylistPreviews(
      playlists.map((playlist) => normalizePlaylistSummary(playlist, {
        sourcePlaylistId: Number(playlist?.id || 0),
        exploreSourceLabel: '搜索结果',
        isExplore: true,
      })),
      { exploreSourceLabel: '搜索结果' }
    )
  }

  async getDailyRecommendedPlaylistPreviews(limit = 6) {
    let playlists = []

    try {
      const response = await callApi('recommend_resource', {
        cookie: this.cookie,
      }, {
        fallbackMessage: '获取每日推荐歌单失败',
        codeMessages: {
          301: '获取每日推荐歌单需要有效的网易云登录态，请刷新登录后再试。',
        },
      })
      playlists = (response.body?.recommend || [])
        .slice(0, limit)
        .map((playlist) => normalizePlaylistSummary(playlist, {
          sourcePlaylistId: Number(playlist?.id || 0),
          exploreSourceLabel: playlist?.copywriter || '每日推荐',
          isExplore: true,
        }))
    } catch (error) {
      if (Number(error?.status || error?.body?.code || 0) !== 301) {
        throw error
      }
    }

    if (!playlists.length) {
      const fallback = await callApi('personalized', {
        cookie: this.cookie,
        limit,
      }, {
        fallbackMessage: '获取推荐歌单失败',
      })
      playlists = (fallback.body?.result || [])
        .slice(0, limit)
        .map((playlist) => normalizePlaylistSummary(playlist, {
          sourcePlaylistId: Number(playlist?.id || 0),
          exploreSourceLabel: '推荐歌单',
          isExplore: true,
        }))
    }

    return this.expandExplorePlaylistPreviews(playlists, { exploreSourceLabel: '每日推荐' })
  }

  async getCommunityPlaylistPreviews(limit = 12, cat = '全部') {
    const response = await callApi('top_playlist_highquality', {
      cookie: this.cookie,
      cat,
      limit,
    }, {
      fallbackMessage: '获取社区歌单失败',
    })

    const playlists = (response.body?.playlists || [])
      .slice(0, limit)
      .map((playlist) => normalizePlaylistSummary(playlist, {
        sourcePlaylistId: Number(playlist?.id || 0),
        exploreSourceLabel: cat && cat !== '全部' ? `${cat} 社区精选` : '社区精选',
        isExplore: true,
      }))

    return this.expandExplorePlaylistPreviews(playlists, {
      exploreSourceLabel: cat && cat !== '全部' ? `${cat} 社区精选` : '社区精选',
    })
  }

  async expandExplorePlaylistPreviews(playlists, overrides = {}) {
    const normalizedPlaylists = [...new Map(
      (playlists || [])
        .map((playlist) => normalizePlaylistSummary(playlist, {
          ...overrides,
          sourcePlaylistId: Number(playlist?.sourcePlaylistId || playlist?.id || 0),
          isExplore: true,
        }))
        .filter((playlist) => playlist.sourcePlaylistId > 0)
        .map((playlist) => [playlist.sourcePlaylistId, playlist])
    ).values()]

    return mapWithConcurrency(normalizedPlaylists, EXPLORE_DETAIL_CONCURRENCY, async (playlist) => {
      try {
        const detail = await callApi('playlist_detail', {
          cookie: this.cookie,
          id: playlist.sourcePlaylistId,
          s: 8,
        }, {
          fallbackMessage: '获取探索歌单详情失败',
        })
        return normalizeExplorePlaylistDetail(playlist, detail.body?.playlist || {}, {
          exploreSourceLabel: playlist.exploreSourceLabel,
        })
      } catch (error) {
        return {
          ...normalizeExplorePlaylistDetail(playlist, {}, {
            exploreSourceLabel: playlist.exploreSourceLabel,
            tracksError: error.message || '该歌单暂时无法展开。',
          }),
          hydrated: true,
        }
      }
    })
  }

  async logout() {
    if (!this.cookie) {
      return
    }

    const response = await callApi('logout', {
      cookie: this.cookie,
      timestamp: Date.now(),
    }, {
      fallbackMessage: '\u9000\u51fa\u767b\u5f55\u5931\u8d25',
    })

    ensureApiSuccess(response.body, '\u9000\u51fa\u767b\u5f55\u5931\u8d25')
  }
}

module.exports = {
  NeteaseService,
  __testing: {
    callApi,
    withTimeout,
  },
}
