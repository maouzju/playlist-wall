const { spawnCli } = require('./cli-spawn')

const OLLAMA_TIMEOUT_MS = 900000
const FAST_API_OPTIONS = {
  maxAttempts: 1,
  timeoutMs: 6000,
  retryDelayMs: 0,
}
const MAX_PLAYLISTS = 14
const MAX_TRACKS_PER_PLAYLIST = 80
const CONCURRENCY = 4

function withSoftTimeout(promise, timeoutMs, fallbackValue) {
  let timer = null
  return new Promise((resolve) => {
    timer = setTimeout(() => resolve(fallbackValue), timeoutMs)
    Promise.resolve(promise).then(
      (value) => {
        clearTimeout(timer)
        resolve(value)
      },
      () => {
        clearTimeout(timer)
        resolve(fallbackValue)
      }
    )
  })
}

function runOllama(cliPath, model, promptText, onToken) {
  return new Promise((resolve, reject) => {
    const command = String(cliPath || '').trim() || 'ollama'
    const args = ['run']
    if (String(model || '').trim()) {
      args.push(String(model).trim())
    }
    let child
    try {
      child = spawnCli(command, args)
    } catch (error) {
      reject(error)
      return
    }

    let stdout = ''
    let stderr = ''
    const timer = setTimeout(() => {
      try { child.kill() } catch {}
      reject(new Error('Ollama 响应超时'))
    }, OLLAMA_TIMEOUT_MS)

    child.stdout?.setEncoding('utf8')
    child.stdout?.on('data', (chunk) => {
      stdout += chunk
      if (onToken) {
        onToken(String(chunk))
      }
    })
    child.stderr?.setEncoding('utf8')
    child.stderr?.on('data', (chunk) => {
      stderr += chunk
    })
    child.on('error', (error) => {
      clearTimeout(timer)
      reject(error)
    })
    child.on('close', (code) => {
      clearTimeout(timer)
      if (code === 0 || stdout.trim()) {
        resolve(stdout)
      } else {
        reject(new Error(stderr.trim() || `Ollama 退出码 ${code}`))
      }
    })

    try {
      child.stdin?.write(promptText)
      child.stdin?.end()
    } catch {}
  })
}

function extractJson(text) {
  const source = String(text || '')
  const start = source.indexOf('{')
  const end = source.lastIndexOf('}')
  if (start < 0 || end <= start) {
    return null
  }
  const slice = source.slice(start, end + 1)
  try {
    return JSON.parse(slice)
  } catch {
    try {
      return JSON.parse(slice.replace(/```(?:json)?/gi, '').trim())
    } catch {
      return null
    }
  }
}

async function buildTasteProfileText(svc, userId, localCounts, topN = 40) {
  let cloudCounts = {}
  try {
    cloudCounts = await withSoftTimeout(
      svc.getUserPlayCounts(userId, FAST_API_OPTIONS),
      7000,
      {}
    )
  } catch {
    cloudCounts = {}
  }

  const playlists = await withSoftTimeout(
    svc.listPlaylists(userId, FAST_API_OPTIONS),
    7000,
    []
  )

  const sampled = playlists
    .filter((p) => Number(p.trackCount || 0) > 0)
    .sort((a, b) => {
      const aLiked = Number(a.specialType) === 5 ? 1 : 0
      const bLiked = Number(b.specialType) === 5 ? 1 : 0
      if (aLiked !== bLiked) {
        return bLiked - aLiked
      }
      return (Number(b.playCount || 0) + Number(b.trackCount || 0)) - (Number(a.playCount || 0) + Number(a.trackCount || 0))
    })
    .slice(0, MAX_PLAYLISTS)

  const trackMap = new Map()
  const artistTally = new Map()
  const ownedTrackIds = new Set()
  const fetched = new Array(sampled.length)
  const pending = sampled.map((playlist, index) => {
    const wanted = Math.min(MAX_TRACKS_PER_PLAYLIST, Number(playlist.trackCount || 0))
    return svc.getPlaylistTracks(playlist.id, wanted, FAST_API_OPTIONS)
      .then((tracks) => { fetched[index] = Array.isArray(tracks) ? tracks : [] })
      .catch(() => { fetched[index] = [] })
  })

  await Promise.race([
    Promise.allSettled(pending),
    new Promise((resolve) => setTimeout(resolve, 10000)),
  ])

  for (const tracks of fetched) {
    if (!Array.isArray(tracks)) {
      continue
    }
    for (const track of tracks.slice(0, MAX_TRACKS_PER_PLAYLIST)) {
      if (!track || !track.id) {
        continue
      }
      ownedTrackIds.add(Number(track.id))
      if (!trackMap.has(track.id)) {
        trackMap.set(track.id, track)
      }
      for (const artist of Array.isArray(track.artists) ? track.artists : []) {
        artistTally.set(artist, (artistTally.get(artist) || 0) + 1)
      }
    }
  }

  const scored = [...trackMap.values()]
    .map((track) => {
      const key = String(track.id)
      const affinity = Number(localCounts?.[key] || 0) + Number(cloudCounts?.[key] || 0)
      return { track, affinity }
    })
    .sort((a, b) => b.affinity - a.affinity)
    .slice(0, topN)

  const topTracksText = scored
    .map(({ track, affinity }) => {
      const artists = Array.isArray(track.artists) ? track.artists.join('/') : ''
      return `${track.name} - ${artists}${affinity > 0 ? `（喜欢度${affinity}）` : ''}`
    })
    .join('\n')

  const topArtists = [...artistTally.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([name, count]) => `${name}(${count})`)
    .join('、')

  return {
    profileText: `最常出现/最喜欢的歌曲：\n${topTracksText || '暂无足够歌曲样本'}\n\n高频艺人：${topArtists || '暂无'}\n\n说明：画像为限量采样，用于快速生成歌单。`,
    ownedTrackIds,
  }
}

function buildOllamaPrompt({ profileText, prompt, playlistCount }) {
  const fallbackPrompt = `根据我的品味，推荐我可能喜欢但还没收藏的新歌，生成一个约 ${playlistCount} 首的歌单。`
  return [
    '你是网易云音乐品味分析与歌单生成助手。下面是该用户的听歌画像：',
    '',
    profileText,
    '',
    `用户需求：${prompt || fallbackPrompt}`,
    '',
    `请基于画像，推荐用户「可能喜欢但上面没出现过」的新歌，约 ${playlistCount} 首。`,
    '只输出一个 JSON 对象，不要任何解释或多余文字，格式严格如下：',
    '{',
    '  "playlistName": "歌单名（简短有品味）",',
    '  "description": "一句话选曲思路",',
    '  "songs": [ {"title": "歌名", "artist": "歌手"}, ... ]',
    '}',
  ].join('\n')
}

async function runOllamaPlaylist(deps, options) {
  const { svc, userId, localCounts = {} } = deps
  const {
    cliPath = '',
    model = '',
    prompt = '',
    permissions = {},
    playlistCount = 30,
    onEvent = () => {},
  } = options || {}

  try {
    onEvent({ type: 'status', message: '正在分析你的听歌品味…' })
    const { profileText, ownedTrackIds } = await buildTasteProfileText(svc, userId, localCounts)

    onEvent({ type: 'status', message: '正在让本地模型构思歌单…' })
    const promptText = buildOllamaPrompt({ profileText, prompt, playlistCount })

    let streamedChars = 0
    let lastTick = 0
    const onToken = (chunk) => {
      streamedChars += chunk.length
      if (streamedChars - lastTick >= 60) {
        lastTick = streamedChars
        onEvent({ type: 'status', message: `本地模型生成中…（已输出 ${streamedChars} 字）` })
      }
    }

    const raw = await runOllama(cliPath, model, promptText, onToken)
    const plan = extractJson(raw)
    if (!plan || !Array.isArray(plan.songs) || !plan.songs.length) {
      onEvent({ type: 'error', message: '本地模型没有返回可用歌单 JSON，请换个模型或重试。' })
      return
    }

    const playlistName = String(plan.playlistName || 'AI 推荐歌单').slice(0, 40)
    onEvent({ type: 'token', text: `准备生成歌单「${playlistName}」。${plan.description || ''}\n\n正在核实候选歌曲…\n` })

    const resolved = []
    const seen = new Set()
    for (const song of plan.songs) {
      const title = String(song?.title || '').trim()
      const artist = String(song?.artist || '').trim()
      if (!title) {
        continue
      }
      const keywords = `${title} ${artist}`.trim()
      onEvent({ type: 'tool', name: 'search_songs', input: { keywords } })
      let hits = []
      try {
        hits = await svc.searchSongs(keywords, { limit: 5 })
      } catch {
        hits = []
      }
      const match = hits.find((t) => t && t.id && !seen.has(t.id) && !ownedTrackIds.has(Number(t.id)))
      if (match) {
        seen.add(match.id)
        resolved.push(match)
        onEvent({
          type: 'tool',
          name: 'search_songs',
          input: { keywords },
          output: { matched: `${match.name} - ${(match.artists || []).join('/')}` },
        })
      }
      if (resolved.length >= playlistCount) {
        break
      }
    }

    if (!resolved.length) {
      onEvent({ type: 'error', message: '候选歌曲没有匹配到可添加的网易云曲目，请换个要求再试。' })
      return
    }

    const listText = resolved
      .map((t, i) => `${i + 1}. ${t.name} - ${(t.artists || []).join('/')}`)
      .join('\n')

    if (permissions.generate === false) {
      onEvent({
        type: 'done',
        text: `已整理出推荐清单，但当前未授权创建歌单，共 ${resolved.length} 首：\n「${playlistName}」\n${listText}`,
      })
      return
    }

    onEvent({ type: 'status', message: '正在创建歌单并添加歌曲…' })
    onEvent({ type: 'tool', name: 'create_playlist', input: { name: playlistName } })
    const summary = await svc.createPlaylist(playlistName, { privacy: false })
    onEvent({ type: 'tool', name: 'add_tracks', input: { playlistId: summary.id, count: resolved.length } })
    await svc.addTrackToPlaylist(summary.id, resolved.map((t) => Number(t.id)))

    onEvent({
      type: 'done',
      text: `已创建歌单「${playlistName}」，加入 ${resolved.length} 首歌：\n${listText}\n\n${plan.description || ''}`,
      playlist: { id: summary.id, name: playlistName, trackCount: resolved.length },
    })
  } catch (error) {
    onEvent({ type: 'error', message: `Ollama 执行失败：${error.message || String(error)}` })
  }
}

module.exports = {
  runOllamaPlaylist,
  // 导出给测试/诊断用，不影响主流程。
  buildTasteProfileText,
}
