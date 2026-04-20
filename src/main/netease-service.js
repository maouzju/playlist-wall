const api = require('NeteaseCloudMusicApi')

const PLAYLIST_PAGE_SIZE = 1000
const EXPLORE_DETAIL_CONCURRENCY = 4
const ARTIST_EXPLORE_SEED_TRACK_LIMIT = 20
const ARTIST_EXPLORE_PLAYLISTS_PER_SEED = 10
const ARTIST_EXPLORE_VALIDATE_CONCURRENCY = 3
const API_REQUEST_TIMEOUT_MS = 15000
const API_MAX_ATTEMPTS = 5
const API_RETRY_DELAY_MS = 2000
const API_TIMEOUT_MESSAGE = '\u8bf7\u6c42\u8d85\u65f6\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5'
const AUDIO_QUALITY_BEST = 'best'
const AUDIO_QUALITY_LOSSLESS = 'lossless'
const AUDIO_QUALITY_EXHIGH = 'exhigh'
const AUDIO_QUALITY_STANDARD = 'standard'
const AUDIO_QUALITY_LEVELS_BEST = [
  'jymaster',
  'sky',
  'jyeffect',
  'hires',
  'lossless',
  'exhigh',
  'standard',
]

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

function normalizeAudioQualityPreference(input) {
  if (input === AUDIO_QUALITY_LOSSLESS) {
    return AUDIO_QUALITY_LOSSLESS
  }

  if (input === AUDIO_QUALITY_EXHIGH) {
    return AUDIO_QUALITY_EXHIGH
  }

  if (input === AUDIO_QUALITY_STANDARD) {
    return AUDIO_QUALITY_STANDARD
  }

  return AUDIO_QUALITY_BEST
}

function buildSongUrlLevelCandidates(input) {
  const preference = normalizeAudioQualityPreference(input)

  if (preference === AUDIO_QUALITY_LOSSLESS) {
    return ['lossless', 'exhigh', 'standard']
  }

  if (preference === AUDIO_QUALITY_EXHIGH) {
    return ['exhigh', 'standard']
  }

  if (preference === AUDIO_QUALITY_STANDARD) {
    return ['standard']
  }

  return [...AUDIO_QUALITY_LEVELS_BEST]
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

function normalizeArtistLookupText(input) {
  return String(input || '').trim().toLowerCase().replace(/\s+/g, ' ')
}

function getArtistSearchCandidateNames(artist) {
  return [
    artist?.name,
    ...(Array.isArray(artist?.alias) ? artist.alias : []),
    ...(Array.isArray(artist?.alia) ? artist.alia : []),
    ...(Array.isArray(artist?.transNames) ? artist.transNames : []),
    artist?.trans,
  ]
    .map((value) => String(value || '').trim())
    .filter(Boolean)
}

function pickBestArtistSearchMatch(artists, artistName) {
  const normalizedArtistName = normalizeArtistLookupText(artistName)
  if (!normalizedArtistName) {
    return Array.isArray(artists) && artists.length ? artists[0] : null
  }

  const exactMatch = (artists || []).find((artist) =>
    getArtistSearchCandidateNames(artist)
      .some((candidate) => normalizeArtistLookupText(candidate) === normalizedArtistName)
  )

  return exactMatch || ((artists || [])[0] || null)
}

function dedupeLookupValues(values, limit = 6) {
  const result = []
  const seen = new Set()

  for (const value of values || []) {
    const normalizedValue = normalizeArtistLookupText(value)
    if (!normalizedValue || seen.has(normalizedValue)) {
      continue
    }

    seen.add(normalizedValue)
    result.push(normalizedValue)
    if (result.length >= limit) {
      break
    }
  }

  return result
}

function normalizeArtistResolveContext(context = {}) {
  return {
    trackNames: dedupeLookupValues(context?.trackNames, 6),
    albumNames: dedupeLookupValues(context?.albumNames, 6),
  }
}

function buildArtistResolveQueries(artistName, context = {}) {
  const normalizedArtistName = String(artistName || '').trim()
  if (!normalizedArtistName) {
    return []
  }

  return dedupeLookupValues([
    ...dedupeLookupValues(context.trackNames, 4),
    ...dedupeLookupValues(context.albumNames, 2),
  ], 6).map((value) => `${normalizedArtistName} ${value}`)
}

function normalizeTrackIds(trackIds) {
  return [...new Set(
    (Array.isArray(trackIds) ? trackIds : [trackIds])
      .map((id) => Number(id))
      .filter((id) => id > 0)
  )]
}

function collectMatchedTrackIds(tracks, trackIdSet) {
  if (!(trackIdSet instanceof Set) || !trackIdSet.size || !Array.isArray(tracks)) {
    return []
  }

  return normalizeTrackIds(
    tracks
      .map((track) => Number(track?.id || 0))
      .filter((trackId) => trackIdSet.has(trackId))
  )
}

function getTrackArtistEntries(track) {
  const entries = Array.isArray(track?.artistEntries) && track.artistEntries.length
    ? track.artistEntries
    : normalizeArtistEntries(track)

  return entries
    .map((artist) => ({
      id: Number(artist?.id || artist?.artistId || 0),
      name: String(artist?.name || artist?.artistName || artist || '').trim(),
    }))
    .filter((artist) => artist.id > 0 || artist.name)
}

function collectMatchedArtistTrackIds(tracks, options = {}) {
  if (!Array.isArray(tracks) || !tracks.length) {
    return []
  }

  const targetArtistId = Number(options?.artistId || 0)
  const targetArtistNames = new Set(dedupeLookupValues(options?.artistNames || [], 12))
  if (targetArtistId <= 0 && !targetArtistNames.size) {
    return []
  }

  return normalizeTrackIds(
    tracks.flatMap((track) => {
      const matchesArtist = getTrackArtistEntries(track).some((artist) =>
        (targetArtistId > 0 && Number(artist?.id || 0) === targetArtistId)
        || targetArtistNames.has(normalizeArtistLookupText(artist?.name || ''))
      )
      return matchesArtist ? [Number(track?.id || 0)] : []
    })
  )
}

function shouldHydrateExplorePlaylistTracks(playlist) {
  if (playlist?.tracksError) {
    return false
  }

  const playlistId = Number(playlist?.sourcePlaylistId || playlist?.id || 0)
  const trackCount = Math.max(Number(playlist?.trackCount || 0), 0)
  const loadedTrackCount = Array.isArray(playlist?.tracks) ? playlist.tracks.length : 0
  return playlistId > 0 && trackCount > loadedTrackCount
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
    description: overrides.description !== undefined
      ? String(overrides.description || '')
      : String(playlist?.description || playlist?.desc || ''),
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
      const retryable = /(ETIMEDOUT|timeout|502|ECONNRESET)/i.test(`${errorCode} ${msg} ${bodyMsg} ${status}`)
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

  async resolveArtistSearchMatch(artists, artistName, resolveContext = null) {
    const normalizedContext = normalizeArtistResolveContext(resolveContext)
    const artistCandidates = Array.isArray(artists) ? artists.filter((artist) => Number(artist?.id || 0) > 0) : []
    if (!artistCandidates.length) {
      return null
    }

    const exactMatches = artistCandidates.filter((artist) =>
      getArtistSearchCandidateNames(artist)
        .some((candidate) => normalizeArtistLookupText(candidate) === normalizeArtistLookupText(artistName))
    )
    if (exactMatches.length === 1) {
      return exactMatches[0]
    }

    const candidates = exactMatches.length ? exactMatches : artistCandidates
    const queries = buildArtistResolveQueries(artistName, normalizedContext)
    if (!queries.length) {
      return null
    }

    const candidateIds = new Set(candidates.map((artist) => Number(artist.id || 0)).filter((artistId) => artistId > 0))
    const trackNameHints = new Set(normalizedContext.trackNames)
    const albumNameHints = new Set(normalizedContext.albumNames)
    const candidateScores = new Map()

    for (const keywords of queries) {
      const response = await callApi('search', {
        cookie: this.cookie,
        keywords,
        type: 1,
        limit: 10,
        offset: 0,
      }, {
        fallbackMessage: '\u641c\u7d22\u6b4c\u66f2\u5931\u8d25',
      })

      ensureApiSuccess(response.body, '\u641c\u7d22\u6b4c\u66f2\u5931\u8d25')
      const songs = Array.isArray(response.body?.result?.songs)
        ? response.body.result.songs
        : []

      songs.forEach((song, index) => {
        const track = normalizeTrackRecord(song, index)
        const matchedArtistEntries = track.artistEntries.filter((artist) => candidateIds.has(Number(artist?.id || 0)))
        if (!matchedArtistEntries.length) {
          return
        }

        const matchesTrackName = trackNameHints.has(normalizeArtistLookupText(track.name))
        const matchesAlbumName = albumNameHints.has(normalizeArtistLookupText(track.album))
        if (!matchesTrackName && !matchesAlbumName) {
          return
        }

        const score = (matchesTrackName ? 12 : 0) + (matchesAlbumName ? 6 : 0) + Math.max(0, 5 - index)
        for (const artist of matchedArtistEntries) {
          const artistId = Number(artist.id || 0)
          candidateScores.set(artistId, Number(candidateScores.get(artistId) || 0) + score)
        }
      })
    }

    const [bestMatch] = [...candidateScores.entries()].sort((left, right) =>
      right[1] - left[1] || left[0] - right[0]
    )
    if (!bestMatch || bestMatch[1] <= 0) {
      return null
    }

    return candidates.find((artist) => Number(artist?.id || 0) === bestMatch[0]) || null
  }

  async resolveArtistReference(artistRef, options = {}) {
    const normalizedArtistId = Number(artistRef || 0)
    if (normalizedArtistId > 0) {
      return {
        artistId: normalizedArtistId,
        artistName: '',
      }
    }

    const artistName = String(artistRef || '').trim()
    if (!artistName) {
      throw new Error('\u827a\u4eba\u4e0d\u5b58\u5728')
    }

    const response = await callApi('search', {
      cookie: this.cookie,
      keywords: artistName,
      type: 100,
      limit: 10,
      offset: 0,
    }, {
      fallbackMessage: '\u641c\u7d22\u827a\u4eba\u5931\u8d25',
    })

    ensureApiSuccess(response.body, '\u641c\u7d22\u827a\u4eba\u5931\u8d25')
    const artists = Array.isArray(response.body?.result?.artists)
      ? response.body.result.artists
      : []
    const matchedArtist = await this.resolveArtistSearchMatch(artists, artistName, options?.resolveContext)
      || pickBestArtistSearchMatch(artists, artistName)
    const resolvedArtistId = Number(matchedArtist?.id || 0)
    if (resolvedArtistId <= 0) {
      throw new Error('\u827a\u4eba\u4e0d\u5b58\u5728')
    }

    return {
      artistId: resolvedArtistId,
      artistName: String(matchedArtist?.name || artistName).trim(),
    }
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
    return playlists.map((playlist) => normalizePlaylistSummary(playlist))
  }

  async getPlaylistDetailSummary(playlistId) {
    const normalizedPlaylistId = Number(playlistId || 0)
    if (normalizedPlaylistId <= 0) {
      throw new Error('\u6b4c\u5355\u4e0d\u5b58\u5728')
    }

    const response = await callApi('playlist_detail', {
      cookie: this.cookie,
      id: normalizedPlaylistId,
      s: 0,
    }, {
      fallbackMessage: '\u83b7\u53d6\u6b4c\u5355\u8be6\u60c5\u5931\u8d25',
      codeMessages: {
        301: '\u9700\u8981\u6709\u6548\u7684\u7f51\u6613\u4e91\u767b\u5f55\u6001\uff0c\u624d\u80fd\u83b7\u53d6\u6b4c\u5355\u8be6\u60c5\u3002',
      },
    })

    ensureApiSuccess(response.body, '\u83b7\u53d6\u6b4c\u5355\u8be6\u60c5\u5931\u8d25')
    return normalizePlaylistSummary(response.body?.playlist || { id: normalizedPlaylistId })
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

  async getArtistSongs(artistRef, maxCount = 100, options = {}) {
    const resolvedArtist = await this.resolveArtistReference(artistRef, {
      resolveContext: options?.resolveContext,
    })
    const normalizedArtistId = Number(resolvedArtist.artistId || 0)
    const numericMaxCount = Number(maxCount)
    const fetchAll = !Number.isFinite(numericMaxCount) || numericMaxCount <= 0
    const normalizedMaxCount = fetchAll ? 0 : Math.max(1, Math.round(numericMaxCount))
    if (normalizedArtistId <= 0) {
      throw new Error('\u827a\u4eba\u4e0d\u5b58\u5728')
    }

    const tracks = []
    const seen = new Set()
    let offset = 0

    while (fetchAll || tracks.length < normalizedMaxCount) {
      const pageLimit = fetchAll ? 100 : Math.min(100, normalizedMaxCount - tracks.length)
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
        if (!fetchAll && tracks.length >= normalizedMaxCount) {
          break
        }
      }

      if (songs.length < pageLimit) {
        break
      }

      offset += songs.length
    }

    const normalizedTracks = tracks.map((track, index) => ({
      ...track,
      position: index + 1,
    }))

    if (options?.includeArtistId) {
      return {
        artistId: normalizedArtistId,
        artistName: resolvedArtist.artistName,
        tracks: normalizedTracks,
      }
    }

    return normalizedTracks
  }

  async getSongUrl(songId, options = {}) {
    const levels = buildSongUrlLevelCandidates(options?.preferredQuality)
    let fallbackSource = null

    for (const level of levels) {
      const response = await callApi('song_url_v1', {
        cookie: this.cookie,
        id: songId,
        level,
      })
      const data = response.body?.data?.[0]
      if (data?.url) {
        return normalizeSongSource(data, level)
      }

      if (!fallbackSource && data) {
        fallbackSource = normalizeSongSource(data, level)
      }
    }

    return fallbackSource || normalizeSongSource(null, levels[levels.length - 1] || 'standard')
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

  async createPlaylist(name, options = {}) {
    const normalizedName = String(name || '').trim()
    if (!normalizedName) {
      throw new Error('\u6b4c\u5355\u540d\u4e0d\u80fd\u4e3a\u7a7a')
    }

    const response = await callApi('playlist_create', {
      cookie: this.cookie,
      name: normalizedName,
      privacy: options?.privacy ? '10' : '0',
      type: options?.type || 'NORMAL',
    }, {
      fallbackMessage: '\u65b0\u5efa\u6b4c\u5355\u5931\u8d25',
      codeMessages: {
        301: '\u9700\u8981\u6709\u6548\u7684\u7f51\u6613\u4e91\u767b\u5f55\u6001\uff0c\u624d\u80fd\u65b0\u5efa\u6b4c\u5355\u3002',
      },
    })

    ensureApiSuccess(response.body, '\u65b0\u5efa\u6b4c\u5355\u5931\u8d25')
    const playlistId = Number(
      response.body?.id
      || response.body?.playlistId
      || response.body?.playlist?.id
      || 0
    )
    if (playlistId <= 0) {
      throw new Error('\u65b0\u5efa\u6b4c\u5355\u5931\u8d25')
    }

    return this.getPlaylistDetailSummary(playlistId)
  }

  async renamePlaylist(playlistId, name) {
    const normalizedPlaylistId = Number(playlistId || 0)
    const normalizedName = String(name || '').trim()
    if (normalizedPlaylistId <= 0 || !normalizedName) {
      throw new Error('\u91cd\u547d\u540d\u6b4c\u5355\u5931\u8d25')
    }

    const response = await callApi('playlist_name_update', {
      cookie: this.cookie,
      id: normalizedPlaylistId,
      name: normalizedName,
    }, {
      fallbackMessage: '\u91cd\u547d\u540d\u6b4c\u5355\u5931\u8d25',
      codeMessages: {
        301: '\u9700\u8981\u6709\u6548\u7684\u7f51\u6613\u4e91\u767b\u5f55\u6001\uff0c\u624d\u80fd\u91cd\u547d\u540d\u6b4c\u5355\u3002',
      },
    })

    ensureApiSuccess(response.body, '\u91cd\u547d\u540d\u6b4c\u5355\u5931\u8d25')
  }

  async updatePlaylistDescription(playlistId, description) {
    const normalizedPlaylistId = Number(playlistId || 0)
    if (normalizedPlaylistId <= 0) {
      throw new Error('\u4fee\u6539\u6b4c\u5355\u7b80\u4ecb\u5931\u8d25')
    }

    const response = await callApi('playlist_desc_update', {
      cookie: this.cookie,
      id: normalizedPlaylistId,
      desc: String(description || ''),
    }, {
      fallbackMessage: '\u4fee\u6539\u6b4c\u5355\u7b80\u4ecb\u5931\u8d25',
      codeMessages: {
        301: '\u9700\u8981\u6709\u6548\u7684\u7f51\u6613\u4e91\u767b\u5f55\u6001\uff0c\u624d\u80fd\u4fee\u6539\u6b4c\u5355\u7b80\u4ecb\u3002',
      },
    })

    ensureApiSuccess(response.body, '\u4fee\u6539\u6b4c\u5355\u7b80\u4ecb\u5931\u8d25')
  }

  async updatePlaylistCover(playlistId, coverFile) {
    const normalizedPlaylistId = Number(playlistId || 0)
    const fileName = String(coverFile?.name || '').trim()
    const fileData = coverFile?.data
    if (normalizedPlaylistId <= 0 || !fileName || !fileData) {
      throw new Error('\u4fee\u6539\u6b4c\u5355\u5c01\u9762\u5931\u8d25')
    }

    const response = await callApi('playlist_cover_update', {
      cookie: this.cookie,
      id: normalizedPlaylistId,
      imgFile: {
        name: fileName,
        data: fileData,
      },
    }, {
      fallbackMessage: '\u4fee\u6539\u6b4c\u5355\u5c01\u9762\u5931\u8d25',
      codeMessages: {
        301: '\u9700\u8981\u6709\u6548\u7684\u7f51\u6613\u4e91\u767b\u5f55\u6001\uff0c\u624d\u80fd\u4fee\u6539\u6b4c\u5355\u5c01\u9762\u3002',
      },
    })

    ensureApiSuccess(response.body, '\u4fee\u6539\u6b4c\u5355\u5c01\u9762\u5931\u8d25')
  }

  async deletePlaylist(playlistId) {
    const normalizedPlaylistId = Number(playlistId || 0)
    if (normalizedPlaylistId <= 0) {
      throw new Error('\u5220\u9664\u81ea\u5efa\u6b4c\u5355\u5931\u8d25')
    }

    const response = await callApi('playlist_delete', {
      cookie: this.cookie,
      id: normalizedPlaylistId,
    }, {
      fallbackMessage: '\u5220\u9664\u81ea\u5efa\u6b4c\u5355\u5931\u8d25',
      codeMessages: {
        301: '\u9700\u8981\u6709\u6548\u7684\u7f51\u6613\u4e91\u767b\u5f55\u6001\uff0c\u624d\u80fd\u5220\u9664\u81ea\u5efa\u6b4c\u5355\u3002',
      },
    })

    ensureApiSuccess(response.body, '\u5220\u9664\u81ea\u5efa\u6b4c\u5355\u5931\u8d25')
  }

  async subscribePlaylist(playlistId) {
    const response = await callApi('playlist_subscribe', {
      cookie: this.cookie,
      id: playlistId,
      t: 1,
    }, {
      fallbackMessage: '\u6536\u85cf\u6b4c\u5355\u5931\u8d25',
      codeMessages: {
        301: '\u9700\u8981\u6709\u6548\u7684\u7f51\u6613\u4e91\u767b\u5f55\u6001\uff0c\u624d\u80fd\u6536\u85cf\u6b4c\u5355\u3002',
        405: '\u7f51\u6613\u4e91\u8fd4\u56de 405\uff1a\u64cd\u4f5c\u8fc7\u4e8e\u9891\u7e41\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5\u3002\u82e5\u6301\u7eed\u5931\u8d25\uff0c\u53ef\u5148\u5728\u7f51\u6613\u4e91\u5b98\u65b9\u5ba2\u6237\u7aef\u6216\u7f51\u9875\u5b8c\u6210\u6536\u85cf\u3002',
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
      codeMessages: {
        301: '\u9700\u8981\u6709\u6548\u7684\u7f51\u6613\u4e91\u767b\u5f55\u6001\uff0c\u624d\u80fd\u5220\u9664\u6536\u85cf\u6b4c\u5355\u3002',
        405: '\u7f51\u6613\u4e91\u8fd4\u56de 405\uff1a\u64cd\u4f5c\u8fc7\u4e8e\u9891\u7e41\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5\u3002\u82e5\u6301\u7eed\u5931\u8d25\uff0c\u53ef\u5148\u5728\u7f51\u6613\u4e91\u5b98\u65b9\u5ba2\u6237\u7aef\u6216\u7f51\u9875\u5b8c\u6210\u53d6\u6d88\u6536\u85cf\u3002',
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

  async updatePlaylistOrder(playlistIds) {
    const normalizedIds = [...new Set((playlistIds || []).map((id) => Number(id)).filter((id) => id > 0))]
    if (!normalizedIds.length) {
      throw new Error('\u66f4\u65b0\u6b4c\u5355\u5217\u8868\u987a\u5e8f\u5931\u8d25')
    }

    const response = await callApi('playlist_order_update', {
      cookie: this.cookie,
      ids: JSON.stringify(normalizedIds),
    }, {
      fallbackMessage: '\u66f4\u65b0\u6b4c\u5355\u5217\u8868\u987a\u5e8f\u5931\u8d25',
      codeMessages: {
        301: '\u9700\u8981\u6709\u6548\u7684\u7f51\u6613\u4e91\u767b\u5f55\u6001\uff0c\u624d\u80fd\u8c03\u6574\u6b4c\u5355\u5217\u8868\u987a\u5e8f\u3002',
      },
    })

    ensureApiSuccess(response.body, '\u66f4\u65b0\u6b4c\u5355\u5217\u8868\u987a\u5e8f\u5931\u8d25')
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
    const resolvedArtistRef = Number(options?.artistRef || 0) > 0
      ? Number(options.artistRef || 0)
      : String(options?.artistRef || options?.artistName || '').trim()
    const seedTrackId = Number(options?.seedTrackId || 0)
    return normalizedQuery
      ? ((resolvedArtistRef || seedTrackId > 0)
        ? this.searchExplorePlaylistsByArtist(normalizedQuery, resolvedArtistRef, options)
        : this.searchExplorePlaylists(normalizedQuery, options))
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

  async searchExplorePlaylistsByArtist(keywords, artistRef, options = {}) {
    const finalLimit = Math.max(1, Math.round(Number(options.limit || 18) || 18))
    const candidateLimit = Math.min(48, Math.max(finalLimit * 2, 24))
    const selectedTrackId = Number(options?.seedTrackId || 0)
    const resolvedArtistNameFallback = String(options?.artistName || artistRef || keywords || '').trim()
    let resolvedArtistId = Number(options?.artistRef || 0)
    let resolvedArtistName = resolvedArtistNameFallback
    let artistSeedTracks = []
    let artistSongsError = null
    let artistSearchError = null
    const candidateEntries = new Map()

    const addCandidatePlaylist = (rawPlaylist, overrides = {}, metadata = {}) => {
      const normalizedPlaylist = normalizePlaylistSummary(rawPlaylist, {
        ...overrides,
        sourcePlaylistId: Number(rawPlaylist?.sourcePlaylistId || rawPlaylist?.id || 0),
        isExplore: true,
      })
      const playlistId = Number(normalizedPlaylist?.sourcePlaylistId || normalizedPlaylist?.id || 0)
      if (playlistId <= 0) {
        return
      }

      const seedTrackId = Number(metadata?.seedTrackId || 0)
      const existingEntry = candidateEntries.get(playlistId)
      if (existingEntry) {
        if (seedTrackId > 0) {
          existingEntry.seedTrackIds.add(seedTrackId)
          if (selectedTrackId > 0 && seedTrackId === selectedTrackId) {
            existingEntry.containsSelectedTrack = true
          }
        }
        existingEntry.searchHitCount += metadata?.searchHit ? 1 : 0
        if (!existingEntry.playlist.exploreSourceLabel && normalizedPlaylist.exploreSourceLabel) {
          existingEntry.playlist = {
            ...existingEntry.playlist,
            exploreSourceLabel: normalizedPlaylist.exploreSourceLabel,
          }
        }
        return
      }

      candidateEntries.set(playlistId, {
        containsSelectedTrack: seedTrackId > 0 && selectedTrackId > 0 && seedTrackId === selectedTrackId,
        playlist: normalizedPlaylist,
        searchHitCount: metadata?.searchHit ? 1 : 0,
        seedTrackIds: seedTrackId > 0 ? new Set([seedTrackId]) : new Set(),
      })
    }

    if (artistRef) {
      try {
        const artistResult = await this.getArtistSongs(artistRef, ARTIST_EXPLORE_SEED_TRACK_LIMIT, {
          includeArtistId: true,
          resolveContext: options?.resolveContext,
        })
        resolvedArtistId = Number(artistResult?.artistId || resolvedArtistId || 0)
        resolvedArtistName = String(artistResult?.artistName || resolvedArtistNameFallback).trim()
        artistSeedTracks = Array.isArray(artistResult?.tracks) ? artistResult.tracks : []
      } catch (error) {
        artistSongsError = error
      }
    }

    const seedTrackIds = normalizeTrackIds([
      selectedTrackId,
      ...artistSeedTracks.map((track) => Number(track?.id || 0)),
    ])

    for (const seedTrackId of seedTrackIds) {
      const response = await callApi('simi_playlist', {
        cookie: this.cookie,
        id: seedTrackId,
        limit: ARTIST_EXPLORE_PLAYLISTS_PER_SEED,
        offset: 0,
      }, {
        fallbackMessage: '获取相似歌单失败',
        codeMessages: {
          301: '获取相似歌单需要有效的网易云登录态，请刷新登录后再试。',
        },
      })

      ensureApiSuccess(response.body, '获取相似歌单失败', {
        301: '获取相似歌单需要有效的网易云登录态，请刷新登录后再试。',
      })

      for (const rawPlaylist of response.body?.playlists || []) {
        addCandidatePlaylist(rawPlaylist, {
          exploreSourceLabel: '相似歌单',
          isExplore: true,
        }, {
          seedTrackId,
        })
      }
    }

    const artistSearchKeywords = String(resolvedArtistName || resolvedArtistNameFallback || keywords || '').trim()
    if (artistSearchKeywords) {
      try {
        const response = await callApi('search', {
          cookie: this.cookie,
          keywords: artistSearchKeywords,
          type: 1000,
          limit: candidateLimit,
          offset: 0,
        }, {
          fallbackMessage: '搜索社区歌单失败',
          codeMessages: {
            301: '搜索社区歌单需要有效的网易云登录态，请刷新登录后再试。',
          },
        })

        ensureApiSuccess(response.body, '搜索社区歌单失败', {
          301: '搜索社区歌单需要有效的网易云登录态，请刷新登录后再试。',
        })

        for (const rawPlaylist of response.body?.result?.playlists || []) {
          addCandidatePlaylist(rawPlaylist, {
            exploreSourceLabel: '艺人相关歌单',
            isExplore: true,
          }, {
            searchHit: true,
          })
        }
      } catch (error) {
        artistSearchError = error
      }
    }

    if (!candidateEntries.size) {
      if (artistSearchError) {
        throw artistSearchError
      }
      if (artistSongsError && !artistSearchKeywords) {
        throw artistSongsError
      }
      return []
    }

    const artistMatchNames = [
      resolvedArtistName,
      resolvedArtistNameFallback,
      keywords,
    ].filter(Boolean)
    const rankedCandidateEntries = [...candidateEntries.values()]
      .sort((left, right) =>
        Number(right.containsSelectedTrack) - Number(left.containsSelectedTrack)
        || right.seedTrackIds.size - left.seedTrackIds.size
        || right.searchHitCount - left.searchHitCount
        || Number(right.playlist?.playCount || 0) - Number(left.playlist?.playCount || 0)
        || Number(right.playlist?.trackCount || 0) - Number(left.playlist?.trackCount || 0)
        || Number(left.playlist?.sourcePlaylistId || left.playlist?.id || 0) - Number(right.playlist?.sourcePlaylistId || right.playlist?.id || 0))
      .slice(0, candidateLimit)
    const rankedCandidateEntryById = new Map(
      rankedCandidateEntries.map((entry) => [Number(entry.playlist?.sourcePlaylistId || entry.playlist?.id || 0), entry])
    )
    const expandedCandidates = await this.expandExplorePlaylistPreviews(
      rankedCandidateEntries.map((entry) => entry.playlist),
      { exploreSourceLabel: '相似歌单' }
    )
    const validatedCandidates = await mapWithConcurrency(
      expandedCandidates,
      ARTIST_EXPLORE_VALIDATE_CONCURRENCY,
      async (playlist) => {
        const playlistId = Number(playlist?.sourcePlaylistId || playlist?.id || 0)
        const rankedEntry = rankedCandidateEntryById.get(playlistId)
        if (!rankedEntry) {
          return null
        }

        const candidateSeedTrackIdSet = rankedEntry.seedTrackIds || new Set()
        let matchedSeedTrackIds = collectMatchedTrackIds(playlist?.tracks || [], candidateSeedTrackIdSet)
        let matchedArtistTrackIds = collectMatchedArtistTrackIds(playlist?.tracks || [], {
          artistId: resolvedArtistId,
          artistNames: artistMatchNames,
        })
        if (shouldHydrateExplorePlaylistTracks(playlist)) {
          try {
            const fullTracks = await this.getPlaylistTracks(playlistId, playlist.trackCount)
            const fullyMatchedSeedTrackIds = collectMatchedTrackIds(fullTracks, candidateSeedTrackIdSet)
            const fullyMatchedArtistTrackIds = collectMatchedArtistTrackIds(fullTracks, {
              artistId: resolvedArtistId,
              artistNames: artistMatchNames,
            })
            if (fullyMatchedSeedTrackIds.length) {
              matchedSeedTrackIds = fullyMatchedSeedTrackIds
            }
            if (fullyMatchedArtistTrackIds.length || !matchedArtistTrackIds.length) {
              matchedArtistTrackIds = fullyMatchedArtistTrackIds
            }
          } catch {}
        }

        if (!matchedSeedTrackIds.length && !matchedArtistTrackIds.length) {
          return null
        }

        return {
          containsSelectedTrack: selectedTrackId > 0 && matchedSeedTrackIds.includes(selectedTrackId),
          matchedArtistTrackCount: matchedArtistTrackIds.length,
          matchedSeedTrackCount: matchedSeedTrackIds.length,
          playlist: normalizePlaylistSummary(playlist, {
            sourcePlaylistId: playlistId,
            coverUrl: playlist?.coverUrl,
            creatorId: Number(playlist?.creatorId || 0),
            creatorName: playlist?.creatorName || '',
            description: String(playlist?.description || ''),
            exploreSourceLabel: playlist?.exploreSourceLabel || '相似歌单',
            id: Number(playlist?.id || 0),
            isExplore: true,
            playCount: Number(playlist?.playCount || 0),
          }),
          previewTracks: Array.isArray(playlist?.tracks) ? playlist.tracks : [],
          sourcePlaylist: playlist,
        }
      }
    )

    return validatedCandidates
      .filter(Boolean)
      .sort((left, right) =>
        Number(right.containsSelectedTrack) - Number(left.containsSelectedTrack)
        || right.matchedArtistTrackCount - left.matchedArtistTrackCount
        || right.matchedSeedTrackCount - left.matchedSeedTrackCount
        || Number(right.playlist?.playCount || 0) - Number(left.playlist?.playCount || 0)
        || Number(right.playlist?.trackCount || 0) - Number(left.playlist?.trackCount || 0)
        || Number(left.playlist?.sourcePlaylistId || left.playlist?.id || 0) - Number(right.playlist?.sourcePlaylistId || right.playlist?.id || 0))
      .slice(0, finalLimit)
      .map((entry) => ({
        ...entry.sourcePlaylist,
        artistId: resolvedArtistId,
        artistName: resolvedArtistName || resolvedArtistNameFallback,
        tracks: entry.previewTracks,
      }))
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

  async getLyrics(songId) {
    const id = Math.trunc(Number(songId))
    if (!Number.isSafeInteger(id) || id <= 0) {
      return { lrc: '', tlrc: '', noLyric: false }
    }

    try {
      const response = await callApi('lyric', {
        cookie: this.cookie,
        id,
      }, {
        fallbackMessage: '\u83b7\u53d6\u6b4c\u8bcd\u5931\u8d25',
      })
      const body = response?.body || {}
      return {
        lrc: body?.lrc?.lyric || '',
        tlrc: body?.tlyric?.lyric || '',
        noLyric: Boolean(body?.nolyric),
      }
    } catch (error) {
      console.warn('failed to fetch lyrics', error?.message || error)
      return { lrc: '', tlrc: '', noLyric: false, error: error?.message || String(error) }
    }
  }
}

module.exports = {
  NeteaseService,
  __testing: {
    buildSongUrlLevelCandidates,
    callApi,
    normalizeAudioQualityPreference,
    withTimeout,
  },
}
