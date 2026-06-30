const { spawnCli } = require('./cli-spawn')

// AI 助手依赖的本地 CLI。每个 provider 给出默认命令名与版本探测参数；
// 实际可执行路径可由用户在设置里覆盖（cliPath）。
const PROVIDER_PROBES = {
  claude: { command: 'claude', args: ['--version'] },
  codex: { command: 'codex', args: ['--version'] },
  ollama: { command: 'ollama', args: ['--version'] },
}

const PROBE_TIMEOUT_MS = 8000

function runProbe(command, args) {
  return new Promise((resolve) => {
    let settled = false
    let stdout = ''
    let stderr = ''

    const finish = (result) => {
      if (settled) {
        return
      }
      settled = true
      resolve(result)
    }

    let child
    try {
      child = spawnCli(command, args)
    } catch (error) {
      finish({ available: false, error: error.message || String(error) })
      return
    }

    const timer = setTimeout(() => {
      try {
        child.kill()
      } catch {
        // ignore
      }
      finish({ available: false, error: '检测超时' })
    }, PROBE_TIMEOUT_MS)

    child.stdout?.on('data', (chunk) => {
      stdout += String(chunk)
    })
    child.stderr?.on('data', (chunk) => {
      stderr += String(chunk)
    })
    child.on('error', (error) => {
      clearTimeout(timer)
      finish({ available: false, error: error.message || String(error) })
    })
    child.on('close', (code) => {
      clearTimeout(timer)
      const version = (stdout || stderr).trim().split(/\r?\n/)[0] || ''
      if (code === 0) {
        finish({ available: true, version })
      } else {
        finish({ available: false, error: `退出码 ${code}`, version })
      }
    })
  })
}

// 探测某个 provider 是否可用。overridePath 非空时用它替代默认命令名。
async function detectAiCli(provider, overridePath = '') {
  const probe = PROVIDER_PROBES[provider]
  if (!probe) {
    return { available: false, error: `未知的 provider: ${provider}` }
  }
  const command = String(overridePath || '').trim() || probe.command
  return runProbe(command, probe.args)
}

// 列出 ollama 本地已安装的模型名，供设置里选择。
async function listOllamaModels(overridePath = '') {
  const command = String(overridePath || '').trim() || PROVIDER_PROBES.ollama.command
  return new Promise((resolve) => {
    let stdout = ''
    let child
    try {
      child = spawnCli(command, ['list'])
    } catch (error) {
      resolve({ ok: false, error: error.message || String(error), models: [] })
      return
    }
    const timer = setTimeout(() => {
      try {
        child.kill()
      } catch {
        // ignore
      }
      resolve({ ok: false, error: '检测超时', models: [] })
    }, PROBE_TIMEOUT_MS)
    child.stdout?.on('data', (chunk) => {
      stdout += String(chunk)
    })
    child.on('error', (error) => {
      clearTimeout(timer)
      resolve({ ok: false, error: error.message || String(error), models: [] })
    })
    child.on('close', () => {
      clearTimeout(timer)
      // `ollama list` 输出首行是表头 NAME ID SIZE MODIFIED，后续每行首列是模型名。
      const lines = stdout.trim().split(/\r?\n/).slice(1)
      const models = lines
        .map((line) => line.trim().split(/\s+/)[0])
        .filter((name) => name && name !== 'NAME')
      resolve({ ok: true, models })
    })
  })
}

module.exports = {
  detectAiCli,
  listOllamaModels,
  PROVIDER_PROBES,
}
