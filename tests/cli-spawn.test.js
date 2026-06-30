const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')

const {
  buildWindowsCmdLine,
  quoteWindowsCmdArg,
  spawnCli,
} = require('../src/main/ai/cli-spawn')

function collect(child, timeoutMs = 8000) {
  let stdout = ''
  let stderr = ''

  child.stdout?.on('data', (chunk) => {
    stdout += String(chunk)
  })
  child.stderr?.on('data', (chunk) => {
    stderr += String(chunk)
  })

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      try {
        child.kill()
      } catch {
        // ignore
      }
      reject(new Error(`process timed out; stdout=${stdout}; stderr=${stderr}`))
    }, timeoutMs)

    child.on('error', (error) => {
      clearTimeout(timer)
      resolve({ error, stdout, stderr })
    })
    child.on('close', (code) => {
      clearTimeout(timer)
      resolve({ code, stdout, stderr })
    })
  })
}

test('buildWindowsCmdLine quotes command and preserves complex arguments', () => {
  assert.equal(quoteWindowsCmdArg('codex'), '"codex"')
  assert.equal(quoteWindowsCmdArg('C:\\Program Files\\Tool\\tool.cmd'), '"C:\\Program Files\\Tool\\tool.cmd"')
  assert.equal(
    buildWindowsCmdLine('codex', ['--model', 'abc def', '-c', 'mcp_servers.config_file="C:\\Users\\A B\\mcp.toml"']),
    'call "codex" "--model" "abc def" "-c" "mcp_servers.config_file=\\"C:\\Users\\A B\\mcp.toml\\""'
  )
})

test('spawnCli runs a command and preserves argv without shell interpolation', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'playlist-wall cli spawn '))
  const script = path.join(dir, 'argv.js')
  fs.writeFileSync(script, 'console.log(JSON.stringify(process.argv.slice(2)))\n', 'utf8')

  try {
    const result = await collect(spawnCli(process.execPath, [
      script,
      '--model',
      'abc def',
      '-c',
      'mcp_servers.config_file="C:\\Users\\A B\\mcp.toml"',
    ]))

    assert.equal(result.code, 0, result.stderr)
    assert.deepEqual(JSON.parse(result.stdout), [
      '--model',
      'abc def',
      '-c',
      'mcp_servers.config_file="C:\\Users\\A B\\mcp.toml"',
    ])
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})

test('spawnCli can run Windows cmd shims from paths containing spaces', { skip: process.platform !== 'win32' }, async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'playlist-wall cli shim '))
  const script = path.join(dir, 'argv.js')
  const shim = path.join(dir, 'echo args.cmd')
  fs.writeFileSync(script, 'console.log(JSON.stringify(process.argv.slice(2)))\n', 'utf8')
  fs.writeFileSync(shim, `@echo off\r\n"${process.execPath}" "${script}" %*\r\n`, 'utf8')

  try {
    const result = await collect(spawnCli(shim, [
      '--model',
      'abc def',
      '-c',
      'mcp_servers.config_file="C:\\Users\\A B\\mcp.toml"',
    ]))

    assert.equal(result.code, 0, result.stderr)
    assert.deepEqual(JSON.parse(result.stdout), [
      '--model',
      'abc def',
      '-c',
      'mcp_servers.config_file="C:\\Users\\A B\\mcp.toml"',
    ])
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})
