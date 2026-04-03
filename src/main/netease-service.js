const api = require('NeteaseCloudMusicApi')

const PLAYLIST_PAGE_SIZE = 1000

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

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

function normalizeArtists(source) {
  const artists = source?.ar || source?.artists || source?.artistNames || []
  if (Array.isArray(artists)) {
    return artists.map((artist) => typeof artist === 'string' ? artist : artist?.name).filter(Boolean)
  }
  if (typeof artists === 'string') {
    return artists.split(/[\/,\u3001]/).map((item) => item.trim()).filter(Boolean)
  }
  return []
}

function normalizeTrackRecord(track, index = 0) {
  const source = track?.songInfo || track?.songData || track?.song || track?.track || track || {}
  const album = source?.al || source?.album || {}

  return {
    id: Number(source?.id || track?.songId || track?.id || 0),
    name: source?.name || track?.name || '',
    artists: normalizeArtists(source),
    album: album?.name || source?.albumName || '',
    albumId: Number(album?.id || source?.albumId || 0),
    albumCoverUrl: album?.picUrl || album?.coverUrl || source?.albumPicUrl || '',
    durationMs: Number(source?.dt || source?.duration || track?.durationMs || 0),
    position: Number(track?.position || source?.position || index + 1),
  }
}

async function callApi(name, params, options = {}) {
  const fn = api[name]
  if (typeof fn !== 'function') {
    throw new Error(`Unknown API: ${name}`)
  }

  for (let attempt = 1; attempt <= 5; attempt += 1) {
    try {
      const response = await fn(params)
      if (!response || typeof response !== 'object') {
        throw new Error(`Bad response from ${name}`)
      }
      return response
    } catch (error) {
      const msg = error && error.message ? error.message : ''
      const body = error && error.body ? error.body : null
      const bodyMsg = body && (body.msg || body.message) ? (body.msg || body.message) : ''
      const status = (error && error.status) || (body && body.code) || 0
      const retryable = /(ETIMEDOUT|timeout|502|ECONNRESET|405|\u9891\u7e41)/i.test(`${msg} ${bodyMsg} ${status}`)
      if (!retryable || attempt === 5) {
        throw createApiError(
          error,
          options.fallbackMessage || `API request failed: ${name}`,
          options.codeMessages || {}
        )
      }
      await sleep(2000 * attempt)
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

  async removeTrackFromPlaylist(playlistId, trackId) {
    const response = await callApi('playlist_tracks', {
      cookie: this.cookie,
      op: 'del',
      pid: playlistId,
      tracks: String(trackId),
    }, {
      fallbackMessage: '\u79fb\u51fa\u6b4c\u5355\u5931\u8d25',
      codeMessages: {
        301: '\u9700\u8981\u6709\u6548\u7684\u7f51\u6613\u4e91\u767b\u5f55\u6001\uff0c\u624d\u80fd\u79fb\u51fa\u6b4c\u66f2\u3002',
      },
    })

    ensureApiSuccess(response.body, '\u79fb\u51fa\u6b4c\u5355\u5931\u8d25')
  }

  async addTrackToPlaylist(playlistId, trackId) {
    const response = await callApi('playlist_tracks', {
      cookie: this.cookie,
      op: 'add',
      pid: playlistId,
      tracks: String(trackId),
    }, {
      fallbackMessage: '\u52a0\u5165\u6b4c\u5355\u5931\u8d25',
      codeMessages: {
        301: '\u9700\u8981\u6709\u6548\u7684\u7f51\u6613\u4e91\u767b\u5f55\u6001\uff0c\u624d\u80fd\u6536\u85cf\u63a8\u8350\u6b4c\u66f2\u3002',
      },
    })

    ensureApiSuccess(response.body, '\u52a0\u5165\u6b4c\u5355\u5931\u8d25')
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

module.exports = { NeteaseService }
