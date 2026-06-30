/**
 * AI Agent 运行时：编排本地 Claude / Codex / Ollama CLI，连接网易云能力 MCP Server，
 * 把一次"和 AI 对话并交互式生成歌单"的过程跑起来，并以事件流的形式回吐给渲染层。
 *
 * 对外接口：
 *   startChat(sessionId, { provider, cliPath, model, prompt, history, permissions, context, onEvent })
 *   cancelChat(sessionId)
 *   isRunning(sessionId)
 *
 * onEvent(event) 推送的事件类型（event.type）：
 *   'status'     运行阶段提示（spawning / thinking / running-tool ...），含 message
 *   'token'      助手回复的增量文本，含 text
 *   'tool'       AI 调用了某个网易云工具，含 name、input、（可选）output
 *   'done'       本轮结束，含 text（完整回复，尽力而为）
 *   'error'      失败，含 message
 *
 * Claude / Codex 走原生 MCP（CLI 直接调工具）。Ollama CLI 不支持 MCP，
 * 这里不在本模块内消费——provider 为 ollama 时由 ollama-runtime.js 接管两段式流程。
 */

const fs = require('fs')
const os = require('os')
const path = require('path')
const { spawnCli } = require('./cli-spawn')

const MCP_SERVER_PATH = path.join(__dirname, 'netease-mcp-server.js')
const MCP_SERVER_NAME = 'netease-music'

// sessionId -> { child, cancelled, tempFiles: string[] }
const sessions = new Map()

function isRunning(sessionId) {
  return sessions.has(String(sessionId))
}

// 把 permissions 对象转成 MCP server 认识的逗号分隔权限串。
function buildPermsString(permissions = {}) {
  const granted = []
  if (permissions.generate !== false) {
    granted.push('generate')
  }
  if (permissions.modify) {
    granted.push('modify')
  }
  if (permissions.delete) {
    granted.push('delete')
  }
  return granted.join(',')
}

// 经环境变量把运行上下文注入 MCP 子进程（cookie / userId / userData / 权限）。
function buildMcpEnv(context = {}, permissions = {}) {
  return {
    ...process.env,
    NETEASE_COOKIE: String(context.cookie || ''),
    NETEASE_USER_ID: String(context.userId || 0),
    AI_USERDATA_DIR: String(context.userDataDir || ''),
    AI_PERMS: buildPermsString(permissions),
  }
}

// 用当前 Electron 自带的 node 运行 MCP server 脚本（打包后无系统 node 也能跑）。
function getNodeExecPath() {
  // Electron 主进程里 process.execPath 是 electron 可执行文件；配合 ELECTRON_RUN_AS_NODE=1
  // 可把它当纯 node 用来跑脚本。
  return process.execPath
}

// 生成一个临时 MCP 配置文件，返回其路径。Claude 与 Codex 的 mcp 配置格式不同，分别构建。
function writeMcpConfigFile(provider, mcpEnv) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pw-ai-mcp-'))
  const nodePath = getNodeExecPath()
  const serverEnv = {
    ...mcpEnv,
    ELECTRON_RUN_AS_NODE: '1',
  }

  let configPath
  if (provider === 'codex') {
    // Codex 读 TOML。mcp_servers.<name> 下声明 command/args/env。
    configPath = path.join(dir, 'mcp.toml')
    const envLines = Object.entries(serverEnv)
      .filter(([key]) => /^(NETEASE_|AI_|ELECTRON_RUN_AS_NODE)/.test(key))
      .map(([key, value]) => `${key} = ${JSON.stringify(String(value))}`)
      .join('\n')
    const toml = [
      `[mcp_servers.${MCP_SERVER_NAME}]`,
      `command = ${JSON.stringify(nodePath)}`,
      `args = [${JSON.stringify(MCP_SERVER_PATH)}]`,
      '',
      `[mcp_servers.${MCP_SERVER_NAME}.env]`,
      envLines,
      '',
    ].join('\n')
    fs.writeFileSync(configPath, toml, 'utf8')
  } else {
    // Claude 读 JSON（mcpServers.<name>）。
    configPath = path.join(dir, 'mcp.json')
    const json = {
      mcpServers: {
        [MCP_SERVER_NAME]: {
          command: nodePath,
          args: [MCP_SERVER_PATH],
          env: Object.fromEntries(
            Object.entries(serverEnv).filter(([key]) =>
              /^(NETEASE_|AI_|ELECTRON_RUN_AS_NODE)/.test(key)
            )
          ),
        },
      },
    }
    fs.writeFileSync(configPath, JSON.stringify(json, null, 2), 'utf8')
  }
  return { dir, configPath }
}

// 组织发给 CLI 的提示词：系统指令 + 历史 + 本轮用户输入。
function buildPromptText({ prompt, history = [], context = {}, permissions = {} }) {
  const allowed = []
  if (permissions.generate !== false) {
    allowed.push('新建歌单并加歌')
  }
  if (permissions.modify) {
    allowed.push('修改已有歌单（增删歌曲、重命名）')
  }
  if (permissions.delete) {
    allowed.push('删除歌单')
  }

  const targetCount = Number(context.playlistCount || 30)
  const lines = [
    '你是用户的网易云音乐品味分析与歌单生成助手。你可以调用 netease-music 工具集来读取用户曲库、分析品味、搜索并管理歌单。',
    '',
    '工作准则：',
    '1. 分析品味时优先调用 get_taste_profile，它已聚合用户全部歌单与每首歌的喜欢程度（播放次数）。',
    '2. 推荐"用户可能喜欢但尚未收藏"的新歌：自由联想契合其口味的歌曲，再用 search_songs 逐一核实存在并取得真实 trackId，只有核实通过的才可入选。',
    `3. 用户期望新歌单默认包含约 ${targetCount} 首歌（除非用户另行指定数量）。`,
    `4. 你当前被授予的写权限：${allowed.length ? allowed.join('、') : '（只读，不能新建/修改/删除歌单）'}。未授予的操作不要尝试。`,
    '5. 生成歌单后，用简洁中文向用户说明：歌单名、选曲思路、代表曲目。全程使用简体中文。',
    '',
  ]

  if (Array.isArray(history) && history.length) {
    lines.push('=== 对话历史 ===')
    for (const turn of history) {
      if (!turn || !turn.content) {
        continue
      }
      const role = turn.role === 'assistant' ? '助手' : '用户'
      lines.push(`${role}：${String(turn.content)}`)
    }
    lines.push('')
  }

  lines.push('=== 用户本轮输入 ===')
  lines.push(String(prompt || ''))
  return lines.join('\n')
}

function cleanupSession(sessionId) {
  const key = String(sessionId)
  const entry = sessions.get(key)
  if (!entry) {
    return
  }
  if (entry.heartbeat) {
    clearInterval(entry.heartbeat)
    entry.heartbeat = null
  }
  for (const file of entry.tempFiles || []) {
    try {
      fs.rmSync(file, { recursive: true, force: true })
    } catch {
      // ignore
    }
  }
  sessions.delete(key)
}

// ---------- Claude / Codex 流式解析 ----------

// Claude --output-format=stream-json 每行一个 JSON 事件。提取助手文本增量与工具调用。
function parseClaudeStreamLine(line, onEvent, acc) {
  let msg
  try {
    msg = JSON.parse(line)
  } catch {
    return
  }
  const type = msg.type
  if (type === 'assistant' && msg.message?.content) {
    for (const block of msg.message.content) {
      if (block.type === 'text' && block.text) {
        acc.text += block.text
        onEvent({ type: 'token', text: block.text })
      } else if (block.type === 'tool_use') {
        onEvent({
          type: 'tool',
          name: String(block.name || '').replace(/^mcp__[^_]+__/, ''),
          input: block.input || {},
        })
      }
    }
  } else if (type === 'result') {
    if (typeof msg.result === 'string' && msg.result && !acc.text) {
      acc.text = msg.result
    }
  }
}

// Codex exec --json 输出 JSONL 事件。结构按 item/event 提取助手文本与工具调用。
function parseCodexStreamLine(line, onEvent, acc) {
  let msg
  try {
    msg = JSON.parse(line)
  } catch {
    return
  }
  // Codex 事件形态较多，做宽松匹配。
  const t = msg.type || msg.msg?.type || ''
  if (/agent_message|assistant|message/.test(t)) {
    const text = msg.text || msg.message || msg.msg?.message || msg.delta || ''
    if (text) {
      acc.text += String(text)
      onEvent({ type: 'token', text: String(text) })
    }
  } else if (/tool|function|mcp/.test(t)) {
    const name = msg.name || msg.tool || msg.msg?.name || ''
    if (name) {
      onEvent({
        type: 'tool',
        name: String(name).replace(/^mcp__[^_]+__/, ''),
        input: msg.arguments || msg.input || {},
      })
    }
  }
}

function buildCliInvocation({ provider, cliPath, model, configPath }) {
  if (provider === 'codex') {
    const command = String(cliPath || '').trim() || 'codex'
    const args = [
      'exec',
      '--json',
      '--skip-git-repo-check',
      '-c',
      `mcp_servers.config_file=${JSON.stringify(configPath)}`,
      '--dangerously-bypass-approvals-and-sandbox',
    ]
    if (model) {
      args.push('-m', model)
    }
    // 提示词从 stdin 传入（避免命令行长度限制与转义问题）。
    return { command, args, configArg: configPath, useConfigFile: true }
  }

  // 默认 Claude。
  const command = String(cliPath || '').trim() || 'claude'
  const args = [
    '-p',
    '--output-format',
    'stream-json',
    '--verbose',
    '--mcp-config',
    configPath,
    '--strict-mcp-config',
    '--allowedTools',
    `mcp__${MCP_SERVER_NAME}`,
    '--permission-mode',
    'bypassPermissions',
  ]
  if (model) {
    args.push('--model', model)
  }
  return { command, args, useConfigFile: false }
}

/**
 * 启动一次对话。Claude / Codex 适用；返回后通过 onEvent 推送事件，结束时触发 done 或 error。
 */
async function startChat(sessionId, options = {}) {
  const key = String(sessionId)
  const {
    provider = 'claude',
    cliPath = '',
    model = '',
    prompt = '',
    history = [],
    permissions = {},
    context = {},
    onEvent = () => {},
  } = options

  if (sessions.has(key)) {
    onEvent({ type: 'error', message: '该会话已有正在进行的请求' })
    return
  }

  let mcp
  try {
    const mcpEnv = buildMcpEnv(context, permissions)
    mcp = writeMcpConfigFile(provider === 'codex' ? 'codex' : 'claude', mcpEnv)
  } catch (error) {
    onEvent({ type: 'error', message: `准备 MCP 配置失败：${error.message || String(error)}` })
    return
  }

  const invocation = buildCliInvocation({
    provider,
    cliPath,
    model,
    configPath: mcp.configPath,
  })
  const promptText = buildPromptText({ prompt, history, context, permissions })

  onEvent({ type: 'status', message: '正在启动 AI…' })

  let child
  try {
    child = spawnCli(invocation.command, invocation.args, {
      env: { ...process.env },
    })
  } catch (error) {
    cleanupTemp(mcp.dir)
    onEvent({ type: 'error', message: `无法启动 ${provider} CLI：${error.message || String(error)}` })
    return
  }

  // CLI 长时间无输出（思考 / 调工具 / 跑子任务）时，定时发心跳证明进程还活着，
  // 前端据此更新「已运行 Xs」并区分「慢」与「僵死」。
  let lastChunkAt = Date.now()
  const heartbeat = setInterval(() => {
    if (Date.now() - lastChunkAt >= 5000) {
      onEvent({ type: 'heartbeat' })
    }
  }, 5000)

  const entry = { child, cancelled: false, tempFiles: [mcp.dir], heartbeat }
  sessions.set(key, entry)

  const acc = { text: '' }
  let stderrBuf = ''
  let stdoutBuf = ''

  const parseLine = provider === 'codex' ? parseCodexStreamLine : parseClaudeStreamLine

  child.stdout?.setEncoding('utf8')
  child.stdout?.on('data', (chunk) => {
    lastChunkAt = Date.now()
    stdoutBuf += chunk
    let idx
    while ((idx = stdoutBuf.indexOf('\n')) >= 0) {
      const line = stdoutBuf.slice(0, idx).trim()
      stdoutBuf = stdoutBuf.slice(idx + 1)
      if (line) {
        parseLine(line, onEvent, acc)
      }
    }
  })

  child.stderr?.setEncoding('utf8')
  child.stderr?.on('data', (chunk) => {
    stderrBuf += chunk
  })

  child.on('error', (error) => {
    clearInterval(heartbeat)
    cleanupSession(key)
    onEvent({ type: 'error', message: `${provider} CLI 执行出错：${error.message || String(error)}` })
  })

  child.on('close', (code) => {
    clearInterval(heartbeat)
    const wasCancelled = entry.cancelled
    // 冲刷残余缓冲
    if (stdoutBuf.trim()) {
      parseLine(stdoutBuf.trim(), onEvent, acc)
    }
    cleanupSession(key)
    if (wasCancelled) {
      onEvent({ type: 'error', message: '已取消' })
      return
    }
    if (code === 0 || acc.text) {
      onEvent({ type: 'done', text: acc.text })
    } else {
      const detail = stderrBuf.trim().split(/\r?\n/).slice(-3).join(' ') || `退出码 ${code}`
      onEvent({ type: 'error', message: `AI 运行失败：${detail}` })
    }
  })

  // 提示词通过 stdin 传入。
  try {
    child.stdin?.write(promptText)
    child.stdin?.end()
  } catch (error) {
    onEvent({ type: 'status', message: `写入提示词失败：${error.message || String(error)}` })
  }
}

function cleanupTemp(dir) {
  try {
    fs.rmSync(dir, { recursive: true, force: true })
  } catch {
    // ignore
  }
}

function cancelChat(sessionId) {
  const key = String(sessionId)
  const entry = sessions.get(key)
  if (!entry) {
    return false
  }
  entry.cancelled = true
  try {
    entry.child.kill()
  } catch {
    // ignore
  }
  return true
}

module.exports = {
  startChat,
  cancelChat,
  isRunning,
  MCP_SERVER_PATH,
  MCP_SERVER_NAME,
}
