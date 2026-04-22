const test = require('node:test')
const assert = require('node:assert/strict')
const { EventEmitter } = require('node:events')
const fs = require('fs')
const os = require('os')
const path = require('path')

const {
  buildUpdaterScript,
  compareVersions,
  createAppUpdater,
  normalizeVersion,
  selectReleaseAsset,
} = require('../src/main/app-updater')

test('normalizeVersion removes the v prefix and pads missing parts', () => {
  assert.equal(normalizeVersion('v1.2'), '1.2.0')
  assert.equal(normalizeVersion('2'), '2.0.0')
  assert.equal(normalizeVersion(''), '0.0.0')
})

test('compareVersions understands stable and prerelease ordering', () => {
  assert.equal(compareVersions('0.22.0', '0.21.9') > 0, true)
  assert.equal(compareVersions('1.0.0', '1.0.0-beta.2') > 0, true)
  assert.equal(compareVersions('1.0.0-beta.2', '1.0.0-beta.11') < 0, true)
  assert.equal(compareVersions('1.0.0', '1.0.0'), 0)
})

test('selectReleaseAsset prefers the exact Windows x64 zip', () => {
  const asset = selectReleaseAsset({
    tag_name: 'v0.22.0',
    assets: [
      {
        name: 'playlist-wall-0.22.0-macos-arm64.zip',
        browser_download_url: 'https://example.com/macos.zip',
      },
      {
        name: 'playlist-wall-0.22.0-windows-x64.zip',
        browser_download_url: 'https://example.com/windows.zip',
      },
      {
        name: 'playlist-wall-0.22.0-source.zip',
        browser_download_url: 'https://example.com/source.zip',
      },
    ],
  })

  assert.equal(asset?.name, 'playlist-wall-0.22.0-windows-x64.zip')
})

test('checkForUpdates reports available releases while disabling install in dev mode', async () => {
  const updater = createAppUpdater({
    app: {
      isPackaged: false,
      getVersion: () => '0.21.0',
    },
    fetchImpl: async () => ({
      ok: true,
      json: async () => ({
        tag_name: 'v0.22.0',
        html_url: 'https://github.com/maouzju/playlist-wall/releases/tag/v0.22.0',
        published_at: '2026-04-04T12:00:00.000Z',
        assets: [
          {
            name: 'playlist-wall-0.22.0-windows-x64.zip',
            browser_download_url: 'https://example.com/playlist-wall.zip',
          },
        ],
      }),
    }),
  })

  const result = await updater.checkForUpdates({ force: true })

  assert.equal(result.ok, true)
  assert.equal(result.currentVersion, '0.21.0')
  assert.equal(result.latestVersion, '0.22.0')
  assert.equal(result.updateAvailable, true)
  assert.equal(result.installSupported, false)
  assert.match(result.installMessage, /开发模式/)
})

test('checkForUpdates allows install for a portable release layout even when isPackaged is false', async () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'playlist-wall-portable-layout-test-'))
  const exePath = path.join(tempRoot, 'Playlist Wall.exe')
  const resourcesDir = path.join(tempRoot, 'resources')
  fs.mkdirSync(resourcesDir, { recursive: true })
  fs.writeFileSync(path.join(resourcesDir, 'app.asar'), '')

  const updater = createAppUpdater({
    app: {
      isPackaged: false,
      getVersion: () => '0.21.0',
    },
    execPath: exePath,
    fetchImpl: async () => ({
      ok: true,
      json: async () => ({
        tag_name: 'v0.22.0',
        html_url: 'https://github.com/maouzju/playlist-wall/releases/tag/v0.22.0',
        published_at: '2026-04-04T12:00:00.000Z',
        assets: [
          {
            name: 'playlist-wall-0.22.0-windows-x64.zip',
            browser_download_url: 'https://example.com/playlist-wall.zip',
          },
        ],
      }),
    }),
  })

  const result = await updater.checkForUpdates({ force: true })

  assert.equal(result.ok, true)
  assert.equal(result.updateAvailable, true)
  assert.equal(result.installSupported, true)
  assert.equal(result.installMessage, '')
})


test('buildUpdaterScript avoids PowerShell reserved PID variable names', () => {
  const script = buildUpdaterScript()

  assert.equal(script.includes('param([int]$Pid)'), false)
  assert.match(script, /Wait-ParentExit -ProcessId \$ParentPid/)

  if (process.platform !== 'win32') {
    return
  }

  const { spawnSync } = require('node:child_process')
  const scriptPath = path.join(os.tmpdir(), `playlist-wall-updater-parse-${Date.now()}.ps1`)
  fs.writeFileSync(scriptPath, script, 'utf8')

  const result = spawnSync('powershell.exe', [
    '-NoProfile',
    '-NonInteractive',
    '-ExecutionPolicy',
    'Bypass',
    '-File',
    scriptPath,
    '-ParentPid',
    '2147483647',
    '-ZipPath',
    path.join(os.tmpdir(), 'missing-update.zip'),
    '-ExtractRoot',
    path.join(os.tmpdir(), 'missing-extract-root'),
    '-TargetDir',
    path.join(os.tmpdir(), `missing-target-${Date.now()}`),
    '-ExeName',
    'Playlist Wall.exe',
  ], {
    encoding: 'utf8',
    windowsHide: true,
  })

  fs.rmSync(scriptPath, { force: true })

  const output = `${result.stderr || ''}\n${result.stdout || ''}`
  assert.equal(result.status, 1, output)
  assert.doesNotMatch(output, /Cannot overwrite variable Pid|VariableNotWritable/i)
  assert.match(output, /Target directory does not exist/)
})

test('installUpdate downloads the asset, spawns the updater script and requests app quit', async () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'playlist-wall-updater-test-'))
  const spawnCalls = []
  let quitCalled = false
  let fetchCallCount = 0

  const updater = createAppUpdater({
    app: {
      isPackaged: true,
      getVersion: () => '0.21.0',
      getPath: () => tempRoot,
      quit: () => {
        quitCalled = true
      },
    },
    fetchImpl: async () => {
      fetchCallCount += 1
      if (fetchCallCount === 1) {
        return {
          ok: true,
          json: async () => ({
            tag_name: 'v0.22.0',
            html_url: 'https://github.com/maouzju/playlist-wall/releases/tag/v0.22.0',
            published_at: '2026-04-04T12:00:00.000Z',
            assets: [
              {
                name: 'playlist-wall-0.22.0-windows-x64.zip',
                browser_download_url: 'https://example.com/playlist-wall.zip',
              },
            ],
          }),
        }
      }

      return {
        ok: true,
        body: null,
        arrayBuffer: async () => new Uint8Array([80, 75, 3, 4]).buffer,
      }
    },
    spawnImpl: (command, args, options) => {
      spawnCalls.push({ command, args, options })
      return {
        unref() {},
      }
    },
  })

  const result = await updater.installUpdate()

  assert.equal(result.ok, true)
  assert.equal(result.scheduled, true)
  assert.equal(spawnCalls.length, 1)
  assert.equal(path.basename(spawnCalls[0].command).toLowerCase(), 'powershell.exe')
  assert.match(spawnCalls[0].args.join(' '), /apply-update\.ps1/)

  await new Promise((resolve) => setTimeout(resolve, 450))
  assert.equal(quitCalled, true)
})

test('installUpdate keeps downloading while data continues to arrive before the idle timeout', async () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'playlist-wall-updater-stream-test-'))
  let fetchCallCount = 0

  const updater = createAppUpdater({
    app: {
      isPackaged: true,
      getVersion: () => '0.21.0',
      getPath: () => tempRoot,
      quit: () => {},
    },
    downloadIdleTimeoutMs: 25,
    fetchImpl: async () => {
      fetchCallCount += 1
      if (fetchCallCount === 1) {
        return {
          ok: true,
          json: async () => ({
            tag_name: 'v0.22.0',
            html_url: 'https://github.com/maouzju/playlist-wall/releases/tag/v0.22.0',
            published_at: '2026-04-04T12:00:00.000Z',
            assets: [
              {
                name: 'playlist-wall-0.22.0-windows-x64.zip',
                browser_download_url: 'https://example.com/playlist-wall.zip',
              },
            ],
          }),
        }
      }

      return {
        ok: true,
        body: new ReadableStream({
          start(controller) {
            setTimeout(() => controller.enqueue(new Uint8Array([80, 75])), 5)
            setTimeout(() => controller.enqueue(new Uint8Array([3, 4])), 20)
            setTimeout(() => controller.close(), 40)
          },
        }),
      }
    },
    spawnImpl: () => ({
      unref() {},
    }),
  })

  const result = await updater.installUpdate()

  assert.equal(result.ok, true)
  assert.equal(result.scheduled, true)
})

test('installUpdate falls back to PowerShell download when the fetch downloader fails', async () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'playlist-wall-updater-fallback-test-'))
  const spawnCalls = []
  let fetchCallCount = 0

  const updater = createAppUpdater({
    app: {
      isPackaged: true,
      getVersion: () => '0.21.0',
      getPath: () => tempRoot,
      quit: () => {},
    },
    fetchImpl: async () => {
      fetchCallCount += 1
      if (fetchCallCount === 1) {
        return {
          ok: true,
          json: async () => ({
            tag_name: 'v0.22.0',
            html_url: 'https://github.com/maouzju/playlist-wall/releases/tag/v0.22.0',
            published_at: '2026-04-04T12:00:00.000Z',
            assets: [
              {
                name: 'playlist-wall-0.22.0-windows-x64.zip',
                browser_download_url: 'https://example.com/playlist-wall.zip',
              },
            ],
          }),
        }
      }

      throw new Error('network blocked')
    },
    spawnImpl: (command, args, options) => {
      spawnCalls.push({ command, args, options })

      const child = new EventEmitter()
      child.stdout = new EventEmitter()
      child.stderr = new EventEmitter()
      child.kill = () => {}
      child.unref = () => {}

      if (args.includes('-Command')) {
        process.nextTick(() => {
          const script = args[args.indexOf('-Command') + 1]
          const destinationMatch = script.match(/\$outFile = '([^']*(?:''[^']*)*)'/)
          const destinationPath = destinationMatch
            ? destinationMatch[1].replace(/''/g, "'")
            : path.join(tempRoot, 'update.zip')
          fs.mkdirSync(path.dirname(destinationPath), { recursive: true })
          fs.writeFileSync(destinationPath, Buffer.from([80, 75, 3, 4]))
          child.emit('exit', 0)
        })
      }

      return child
    },
  })

  const result = await updater.installUpdate()

  assert.equal(result.ok, true)
  assert.equal(result.scheduled, true)
  assert.equal(spawnCalls.length, 2)
  assert.equal(path.basename(spawnCalls[0].command).toLowerCase(), 'powershell.exe')
  assert.equal(spawnCalls[0].args.includes('-Command'), true)
  assert.equal(spawnCalls[1].args.includes('-File'), true)
  assert.match(spawnCalls[0].args.join(' '), /SecurityProtocol/)
  assert.match(spawnCalls[0].args.join(' '), /Parameters\.ContainsKey\('UseBasicParsing'\)/)
  assert.match(spawnCalls[0].args.join(' '), /System\.Net\.Http\.HttpClient/)
})

test('installUpdate includes PowerShell stderr details when the fallback download fails', async () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'playlist-wall-updater-fallback-error-test-'))
  let fetchCallCount = 0

  const updater = createAppUpdater({
    app: {
      isPackaged: true,
      getVersion: () => '0.21.0',
      getPath: () => tempRoot,
      quit: () => {},
    },
    fetchImpl: async () => {
      fetchCallCount += 1
      if (fetchCallCount === 1) {
        return {
          ok: true,
          json: async () => ({
            tag_name: 'v0.22.0',
            html_url: 'https://github.com/maouzju/playlist-wall/releases/tag/v0.22.0',
            published_at: '2026-04-04T12:00:00.000Z',
            assets: [
              {
                name: 'playlist-wall-0.22.0-windows-x64.zip',
                browser_download_url: 'https://example.com/playlist-wall.zip',
              },
            ],
          }),
        }
      }

      throw new Error('network blocked')
    },
    spawnImpl: (_command, args) => {
      const child = new EventEmitter()
      child.stdout = new EventEmitter()
      child.stderr = new EventEmitter()
      child.kill = () => {}
      child.unref = () => {}

      if (args.includes('-Command')) {
        process.nextTick(() => {
          child.stderr.emit('data', 'All PowerShell download methods failed: TLS handshake failed')
          child.emit('exit', 1)
        })
      }

      return child
    },
  })

  const result = await updater.installUpdate()

  assert.equal(result.ok, false)
  assert.match(result.error, /PowerShell download failed with exit code 1/)
  assert.match(result.error, /TLS handshake failed/)
})
