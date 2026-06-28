#!/usr/bin/env node
/**
 * 网易云能力 MCP Server（stdio / JSON-RPC 2.0）。
 *
 * 由 AI Agent 运行时（agent-runtime.js）在子进程中拉起，供本地的 Claude / Codex CLI
 * 通过 --mcp-config 连接。它把网易云的搜歌、读歌单、品味画像、以及（受权限控制的）
 * 建歌单 / 增删改歌单能力暴露成 MCP 工具，让 AI 自主调用、交互式生成歌单。
 *
 * 运行所需的上下文全部经环境变量注入（子进程无法访问 Electron 的 app / safeStorage）：
 *   NETEASE_COOKIE   已解密的登录 cookie（明文，仅在本机受信子进程间传递）
 *   NETEASE_USER_ID  当前账号 userId
 *   AI_USERDATA_DIR  Electron userData 目录（用于读取本地播放次数 playback-stats.json）
 *   AI_PERMS         逗号分隔的写权限：generate,modify,delete（缺省即无对应权限）
 *
 * 协议实现的是 MCP 的最小可用子集：initialize / tools/list / tools/call /
 * notifications/initialized，足够 CLI 端正常握手与调用工具。
 */

const fs = require('fs')
const path = require('path')

const { NeteaseService } = require('../netease-service')

const PROTOCOL_VERSION = '2025-06-18'
const SERVER_INFO = { name: 'netease-music', version: '1.0.0' }

const COOKIE = process.env.NETEASE_COOKIE || ''
const USER_ID = Number(process.env.NETEASE_USER_ID || 0)
const USERDATA_DIR = process.env.AI_USERDATA_DIR || ''
const PERMS = new Set(
  String(process.env.AI_PERMS || '')
    .split(',')
    .map((token) => token.trim())
    .filter(Boolean)
)

const svc = new NeteaseService(COOKIE)

// ---------- 工具实现 ----------

function readLocalPlayCounts() {
  // 复用 playback-store.js 的文件结构：{ users: { [userId]: { localPlayCounts } } }。
  if (!USERDATA_DIR) {
    return {}
  }
  try {
    const filePath = path.join(USERDATA_DIR, 'playback-stats.json')
    if (!fs.existsSync(filePath)) {
      return {}
    }
    const store = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    const bucket = store?.users?.[String(USER_ID)] || {}
    return bucket.localPlayCounts || {}
  } catch {
    return {}
  }
}

// 轻量并发执行，避免一个个串行拉歌单（用户歌单多时串行可达 2~3 分钟）。
async function mapWithConcurrency(items, limit, mapper) {
  const results = new Array(items.length)
  let cursor = 0
  const workers = new Array(Math.min(limit, items.length)).fill(null).map(async () => {
    while (cursor < items.length) {
      const index = cursor
      cursor += 1
      try {
        results[index] = await mapper(items[index], index)
      } catch {
        results[index] = null
      }
    }
  })
  await Promise.all(workers)
  return results
}

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

function compactTrack(track) {
  return {
    id: track.id,
    name: track.name,
    artists: Array.isArray(track.artists) ? track.artists.join(' / ') : '',
    album: track.album || '',
  }
}

// 把一组歌曲按"喜欢程度"（本地播放次数 + 云端听歌次数）打分并附加权重。
function scoreTracksByAffinity(tracks, localCounts, cloudCounts) {
  return tracks.map((track) => {
    const key = String(track.id)
    const local = Number(localCounts[key] || 0)
    const cloud = Number(cloudCounts[key] || 0)
    return {
      ...compactTrack(track),
      affinity: local + cloud,
      localPlays: local,
      cloudPlays: cloud,
    }
  })
}

const TOOLS = [
  {
    name: 'list_my_playlists',
    description: '列出当前用户网易云账号下的所有歌单（含自建与收藏），返回歌单 id、名称、歌曲数。生成新歌单前可先看已有歌单避免重复。',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    handler: async () => {
      const playlists = await svc.listPlaylists(USER_ID)
      return playlists.map((p) => ({
        id: p.id,
        name: p.name,
        trackCount: p.trackCount,
        isOwner: Number(p.creatorId || 0) === USER_ID,
        description: p.description || '',
      }))
    },
  },
  {
    name: 'get_playlist_tracks',
    description: '获取指定歌单内的全部歌曲（id、歌名、歌手、专辑）。用于了解某个歌单的具体内容。',
    inputSchema: {
      type: 'object',
      properties: { playlistId: { type: 'number', description: '歌单 id' } },
      required: ['playlistId'],
      additionalProperties: false,
    },
    handler: async (args) => {
      const tracks = await svc.getPlaylistTracks(Number(args.playlistId))
      return tracks.map(compactTrack)
    },
  },
  {
    name: 'get_taste_profile',
    description:
      '【品味分析核心】聚合用户全部歌单 + 每首歌的喜欢程度（本地播放次数 + 云端听歌次数），返回最能代表用户口味的高频歌曲、艺人偏好和统计。分析品味、决定推荐方向时优先调用此工具。',
    inputSchema: {
      type: 'object',
      properties: {
        topTracks: { type: 'number', description: '返回最喜欢的前 N 首歌，默认 50' },
        maxPlaylists: { type: 'number', description: '最多采样多少个歌单（默认 14，越大越全但越慢）' },
      },
      additionalProperties: false,
    },
    handler: async (args) => {
      const topN = Math.min(200, Math.max(10, Number(args.topTracks) || 50))
      // 画像不需要拉全部歌单的全部歌——用户歌单多时全量串行可达 2~3 分钟。
      // 这里限制采样的歌单数和单歌单曲目数，并发拉取，把耗时压到十几秒。
      const MAX_PLAYLISTS = Math.min(20, Math.max(6, Number(args.maxPlaylists) || 14))
      const MAX_TRACKS_PER_PLAYLIST = 80
      const CONCURRENCY = 4
      const FAST_API_OPTIONS = {
        maxAttempts: 1,
        timeoutMs: 6000,
        retryDelayMs: 0,
      }

      const localCounts = readLocalPlayCounts()
      let cloudCounts = {}
      try {
        cloudCounts = await svc.getUserPlayCounts(USER_ID, FAST_API_OPTIONS)
      } catch {
        cloudCounts = {}
      }

      const playlists = await withSoftTimeout(
        svc.listPlaylists(USER_ID, FAST_API_OPTIONS),
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
          const aScore = Number(a.playCount || 0) + Number(a.trackCount || 0)
          const bScore = Number(b.playCount || 0) + Number(b.trackCount || 0)
          return bScore - aScore
        })
        .slice(0, MAX_PLAYLISTS)

      const trackMap = new Map()
      const artistTally = new Map()
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
        // 每个歌单只取前 N 首参与画像（喜欢的音乐/高频歌单的头部最具代表性）。
        for (const track of tracks.slice(0, MAX_TRACKS_PER_PLAYLIST)) {
          if (!track || !track.id) {
            continue
          }
          if (!trackMap.has(track.id)) {
            trackMap.set(track.id, track)
          }
          for (const artist of Array.isArray(track.artists) ? track.artists : []) {
            artistTally.set(artist, (artistTally.get(artist) || 0) + 1)
          }
        }
      }

      const scored = scoreTracksByAffinity([...trackMap.values()], localCounts, cloudCounts)
        .sort((a, b) => b.affinity - a.affinity)

      const topArtists = [...artistTally.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 30)
        .map(([name, count]) => ({ name, trackCount: count }))

      return {
        userId: USER_ID,
        playlistCount: playlists.length,
        sampledPlaylistCount: sampled.length,
        uniqueTrackCount: trackMap.size,
        topTracksByAffinity: scored.slice(0, topN),
        topArtists,
        note: '以上为采样画像（按喜欢的音乐/高频歌单优先采样，非全量）。生成新歌单时应推荐这些之外、但风格契合的新歌，并用 search_songs 核实存在。',
      }
    },
  },
  {
    name: 'search_songs',
    description:
      '在网易云搜索歌曲，返回匹配的 id、歌名、歌手、专辑。用于把你联想出的"歌名/歌手"核实为真实存在的曲目并取得其 trackId。把候选歌加入歌单前必须先用本工具确认。',
    inputSchema: {
      type: 'object',
      properties: {
        keywords: { type: 'string', description: '搜索关键词，建议"歌名 歌手"组合' },
        limit: { type: 'number', description: '返回数量，默认 10，最大 30' },
      },
      required: ['keywords'],
      additionalProperties: false,
    },
    handler: async (args) => {
      const limit = Math.min(30, Math.max(1, Number(args.limit) || 10))
      const tracks = await svc.searchSongs(String(args.keywords || ''), { limit })
      return tracks.map(compactTrack)
    },
  },
  {
    name: 'create_playlist',
    description: '【需要 generate 权限】在用户网易云账号下新建一个空歌单，返回新歌单 id。建好后用 add_tracks 往里加歌。',
    permission: 'generate',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: '歌单名称' },
        privacy: { type: 'boolean', description: '是否设为隐私歌单，默认 false（公开）' },
      },
      required: ['name'],
      additionalProperties: false,
    },
    handler: async (args) => {
      const summary = await svc.createPlaylist(String(args.name || ''), { privacy: Boolean(args.privacy) })
      return { id: summary.id, name: summary.name, trackCount: summary.trackCount }
    },
  },
  {
    name: 'add_tracks',
    description: '【需要 generate 或 modify 权限】向指定歌单批量添加歌曲。trackIds 来自 search_songs 的结果。',
    permission: 'generate',
    inputSchema: {
      type: 'object',
      properties: {
        playlistId: { type: 'number', description: '目标歌单 id' },
        trackIds: { type: 'array', items: { type: 'number' }, description: '要添加的歌曲 id 数组' },
      },
      required: ['playlistId', 'trackIds'],
      additionalProperties: false,
    },
    handler: async (args) => {
      const ids = Array.isArray(args.trackIds) ? args.trackIds : []
      await svc.addTrackToPlaylist(Number(args.playlistId), ids)
      return { ok: true, added: ids.length }
    },
  },
  {
    name: 'remove_tracks',
    description: '【需要 modify 权限】从指定歌单批量移除歌曲。',
    permission: 'modify',
    inputSchema: {
      type: 'object',
      properties: {
        playlistId: { type: 'number', description: '目标歌单 id' },
        trackIds: { type: 'array', items: { type: 'number' }, description: '要移除的歌曲 id 数组' },
      },
      required: ['playlistId', 'trackIds'],
      additionalProperties: false,
    },
    handler: async (args) => {
      const ids = Array.isArray(args.trackIds) ? args.trackIds : []
      await svc.removeTrackFromPlaylist(Number(args.playlistId), ids)
      return { ok: true, removed: ids.length }
    },
  },
  {
    name: 'rename_playlist',
    description: '【需要 modify 权限】重命名一个用户自建的歌单。',
    permission: 'modify',
    inputSchema: {
      type: 'object',
      properties: {
        playlistId: { type: 'number', description: '歌单 id' },
        name: { type: 'string', description: '新名称' },
      },
      required: ['playlistId', 'name'],
      additionalProperties: false,
    },
    handler: async (args) => {
      await svc.renamePlaylist(Number(args.playlistId), String(args.name || ''))
      return { ok: true }
    },
  },
  {
    name: 'delete_playlist',
    description: '【需要 delete 权限】删除一个用户自建的歌单。不可恢复，仅在用户明确要求时使用。',
    permission: 'delete',
    inputSchema: {
      type: 'object',
      properties: { playlistId: { type: 'number', description: '歌单 id' } },
      required: ['playlistId'],
      additionalProperties: false,
    },
    handler: async (args) => {
      await svc.deletePlaylist(Number(args.playlistId))
      return { ok: true }
    },
  },
]

const TOOL_MAP = new Map(TOOLS.map((tool) => [tool.name, tool]))

// 按当前进程被授予的权限过滤暴露给 AI 的工具：未授权的写工具直接不出现在 tools/list 里，
// 这样 AI 根本看不到、也无法调用，从根上落实权限控制。
function getExposedTools() {
  return TOOLS.filter((tool) => !tool.permission || PERMS.has(tool.permission))
}

// ---------- JSON-RPC over stdio ----------

function writeMessage(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`)
}

function writeResult(id, result) {
  writeMessage({ jsonrpc: '2.0', id, result })
}

function writeError(id, code, message) {
  writeMessage({ jsonrpc: '2.0', id, error: { code, message } })
}

async function handleToolCall(id, params) {
  const name = params?.name
  const tool = TOOL_MAP.get(name)
  if (!tool) {
    writeError(id, -32602, `未知工具: ${name}`)
    return
  }
  // 二次防线：即便客户端跳过 tools/list 直接调用未授权的写工具，也在此拦截。
  if (tool.permission && !PERMS.has(tool.permission)) {
    writeResult(id, {
      content: [{ type: 'text', text: `权限不足：该操作需要「${tool.permission}」权限，但当前未授予。` }],
      isError: true,
    })
    return
  }

  try {
    const data = await tool.handler(params?.arguments || {})
    const text = JSON.stringify(data)
    writeResult(id, {
      content: [{ type: 'text', text }],
      structuredContent: data && typeof data === 'object' && !Array.isArray(data) ? data : { result: data },
    })
  } catch (error) {
    writeResult(id, {
      content: [{ type: 'text', text: `工具执行失败：${error.message || String(error)}` }],
      isError: true,
    })
  }
}

async function handleMessage(message) {
  const { id, method, params } = message

  // 通知（无 id）只需消费，无需回应。
  if (id === undefined || id === null) {
    return
  }

  switch (method) {
    case 'initialize':
      writeResult(id, {
        protocolVersion: params?.protocolVersion || PROTOCOL_VERSION,
        capabilities: { tools: {} },
        serverInfo: SERVER_INFO,
      })
      return
    case 'tools/list':
      writeResult(id, {
        tools: getExposedTools().map((tool) => ({
          name: tool.name,
          description: tool.description,
          inputSchema: tool.inputSchema,
        })),
      })
      return
    case 'tools/call':
      await handleToolCall(id, params)
      return
    case 'ping':
      writeResult(id, {})
      return
    default:
      writeError(id, -32601, `不支持的方法: ${method}`)
  }
}

function main() {
  let buffer = ''
  process.stdin.setEncoding('utf8')
  process.stdin.on('data', (chunk) => {
    buffer += chunk
    let newlineIndex
    while ((newlineIndex = buffer.indexOf('\n')) >= 0) {
      const line = buffer.slice(0, newlineIndex).trim()
      buffer = buffer.slice(newlineIndex + 1)
      if (!line) {
        continue
      }
      let message
      try {
        message = JSON.parse(line)
      } catch {
        continue
      }
      // 串行处理，避免并发写歌单引发竞态；每条消息独立 await。
      handleMessage(message).catch((error) => {
        if (message && message.id != null) {
          writeError(message.id, -32603, error.message || String(error))
        }
      })
    }
  })
  process.stdin.on('end', () => process.exit(0))
}

main()
