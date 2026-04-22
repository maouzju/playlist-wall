const fs = require('fs')
const os = require('os')
const path = require('path')
const { spawnSync } = require('child_process')

const rootDir = path.join(__dirname, '..')
const packageJsonPath = path.join(rootDir, 'package.json')
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

function resolveWindowsSignCacheDir() {
  const localAppData = process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local')
  return path.join(localAppData, 'electron-builder', 'Cache', 'winCodeSign')
}

function walkFiles(dir, matcher, out = []) {
  if (!fs.existsSync(dir)) {
    return out
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walkFiles(fullPath, matcher, out)
      continue
    }

    if (matcher(fullPath, entry)) {
      out.push(fullPath)
    }
  }

  return out
}

function pickNewest(paths) {
  return [...paths].sort((a, b) => {
    const aTime = fs.statSync(a).mtimeMs
    const bTime = fs.statSync(b).mtimeMs
    return bTime - aTime
  })[0] || null
}

function resolveRceditBinary() {
  const overridePath = String(process.env.ELECTRON_BUILDER_RCEDIT_PATH || '').trim()
  if (overridePath) {
    const directFile = overridePath.toLowerCase().endsWith('.exe')
      ? overridePath
      : path.join(overridePath, 'rcedit-x64.exe')
    if (fs.existsSync(directFile)) {
      return directFile
    }
  }

  const cacheDir = resolveWindowsSignCacheDir()
  const existingBinary = pickNewest(
    walkFiles(cacheDir, (fullPath) => path.basename(fullPath).toLowerCase() === 'rcedit-x64.exe')
  )
  if (existingBinary) {
    return existingBinary
  }

  const archives = walkFiles(cacheDir, (fullPath) => fullPath.toLowerCase().endsWith('.7z'))
    .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)
  const sevenZipPath = path.join(rootDir, 'node_modules', '7zip-bin', 'win', 'x64', '7za.exe')

  for (const archivePath of archives) {
    const extractDir = archivePath.slice(0, -3)
    fs.mkdirSync(extractDir, { recursive: true })

    const extraction = spawnSync(
      sevenZipPath,
      ['x', '-snld', '-bd', archivePath, `-o${extractDir}`],
      {
        cwd: cacheDir,
        encoding: 'utf8',
        stdio: 'pipe',
      }
    )

    const binaryPath = path.join(extractDir, 'rcedit-x64.exe')
    if (fs.existsSync(binaryPath)) {
      return binaryPath
    }

    if (extraction.status && extraction.status !== 0 && extraction.status !== 2) {
      throw new Error(
        `Failed to extract RCEdit from ${archivePath}\n${extraction.stdout || ''}\n${extraction.stderr || ''}`.trim()
      )
    }
  }

  throw new Error('Unable to locate rcedit-x64.exe in electron-builder cache.')
}

function resolveAppExePath() {
  const productName = packageJson.build?.productName || packageJson.productName || packageJson.name
  const exeName = `${productName}.exe`
  const exePath = path.join(rootDir, 'release', 'win-unpacked', exeName)

  if (!fs.existsSync(exePath)) {
    throw new Error(`Missing built executable: ${exePath}`)
  }

  return { exePath, productName }
}

function resolveIconPath() {
  const iconPath = packageJson.build?.win?.icon || packageJson.build?.icon
  if (!iconPath) {
    throw new Error('Missing Windows icon path in package.json build config.')
  }

  const resolvedPath = path.resolve(rootDir, iconPath)
  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Missing Windows icon file: ${resolvedPath}`)
  }

  return resolvedPath
}

function buildRceditArgs({ exePath, iconPath, productName, version }) {
  const args = [
    exePath,
    '--set-version-string', 'FileDescription', productName,
    '--set-version-string', 'ProductName', productName,
    '--set-file-version', version,
    '--set-product-version', version,
    '--set-icon', iconPath,
  ]

  const companyName = packageJson.author
  if (companyName) {
    args.push('--set-version-string', 'CompanyName', String(companyName))
  }

  const legalCopyright = packageJson.build?.copyright
  if (legalCopyright) {
    args.push('--set-version-string', 'LegalCopyright', String(legalCopyright))
  }

  return args
}

function runRcedit(rceditPath, args) {
  const result = spawnSync(rceditPath, args, {
    cwd: rootDir,
    encoding: 'utf8',
    stdio: 'pipe',
  })

  if (result.status !== 0) {
    throw new Error(
      `RCEdit failed with exit code ${result.status}\n${result.stdout || ''}\n${result.stderr || ''}`.trim()
    )
  }
}

function main() {
  const { exePath, productName } = resolveAppExePath()
  const iconPath = resolveIconPath()
  const rceditPath = resolveRceditBinary()
  const args = buildRceditArgs({
    exePath,
    iconPath,
    productName,
    version: packageJson.version,
  })

  runRcedit(rceditPath, args)

  console.log(`Patched Windows executable resources:`)
  console.log(`  exe: ${path.relative(rootDir, exePath)}`)
  console.log(`  icon: ${path.relative(rootDir, iconPath)}`)
  console.log(`  rcedit: ${rceditPath}`)
}

main()
