const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('fs')
const os = require('os')
const path = require('path')

const {
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
  assert.equal(spawnCalls[0].command, 'powershell')
  assert.match(spawnCalls[0].args.join(' '), /apply-update\.ps1/)

  await new Promise((resolve) => setTimeout(resolve, 450))
  assert.equal(quitCalled, true)
})
