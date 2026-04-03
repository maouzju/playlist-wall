const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')

const rootDir = path.join(__dirname, '..')
const releaseDir = path.join(rootDir, 'release')
const sourceDir = path.join(releaseDir, 'win-unpacked')
const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'))
const version = packageJson.version
const folderName = `playlist-wall-${version}-windows-x64`
const stagingDir = path.join(releaseDir, folderName)
const zipPath = path.join(releaseDir, `${folderName}.zip`)

if (!fs.existsSync(sourceDir)) {
  throw new Error(`Missing unpacked app directory: ${sourceDir}`)
}

fs.rmSync(stagingDir, { recursive: true, force: true })
fs.rmSync(zipPath, { force: true })
fs.cpSync(sourceDir, stagingDir, { recursive: true })

execFileSync(
  'powershell',
  [
    '-NoProfile',
    '-Command',
    `Compress-Archive -LiteralPath '${stagingDir}' -DestinationPath '${zipPath}' -Force`,
  ],
  {
    cwd: rootDir,
    stdio: 'inherit',
  }
)

console.log(`Created ${path.relative(rootDir, zipPath)}`)
