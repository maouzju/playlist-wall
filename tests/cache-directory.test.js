const test = require('node:test')
const assert = require('node:assert/strict')
const path = require('node:path')

const {
  getCacheDirectoryInfo,
  isPathInsideOrEqual,
  resolveDefaultCacheDirectory,
  resolveInstallDirectory,
} = require('../src/main/cache-directory')

function fixturePath(...parts) {
  return path.join(process.cwd(), '.tmp-cache-directory-test', ...parts)
}

test('resolveDefaultCacheDirectory stays next to but outside the install folder', () => {
  const installDir = fixturePath('Apps', 'Playlist Wall')
  const exePath = path.join(installDir, 'Playlist Wall.exe')

  assert.equal(resolveInstallDirectory({ execPath: exePath }), path.resolve(installDir))
  assert.equal(
    resolveDefaultCacheDirectory({ execPath: exePath }),
    path.join(path.dirname(path.resolve(installDir)), 'Playlist Wall Cache')
  )
})

test('getCacheDirectoryInfo resolves custom and default cache directories', () => {
  const installDir = fixturePath('Apps', 'Playlist Wall')
  const exePath = path.join(installDir, 'Playlist Wall.exe')
  const custom = fixturePath('Custom', 'Playlist Cache')

  assert.deepEqual(getCacheDirectoryInfo({ cacheDirectory: custom }, { execPath: exePath }), {
    cacheDirectory: path.resolve(custom),
    customCacheDirectory: path.resolve(custom),
    defaultCacheDirectory: path.join(path.dirname(path.resolve(installDir)), 'Playlist Wall Cache'),
    usesDefault: false,
  })
})


test('custom cache directory inside install folder falls back to the protected default', () => {
  const installDir = fixturePath('Apps', 'Playlist Wall')
  const exePath = path.join(installDir, 'Playlist Wall.exe')
  const unsafeCustom = path.join(installDir, 'cache')

  const info = getCacheDirectoryInfo({ cacheDirectory: unsafeCustom }, { execPath: exePath })

  assert.equal(isPathInsideOrEqual(unsafeCustom, installDir), true)
  assert.equal(info.usesDefault, true)
  assert.equal(info.customCacheDirectory, '')
  assert.equal(info.cacheDirectory, path.join(path.dirname(path.resolve(installDir)), 'Playlist Wall Cache'))
})
