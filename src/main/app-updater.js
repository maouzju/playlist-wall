const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')
const { Readable } = require('stream')
const { pipeline } = require('stream/promises')

const DEFAULT_CACHE_TTL_MS = 30 * 60 * 1000
const DEFAULT_REQUEST_TIMEOUT_MS = 20 * 1000
const DEFAULT_OWNER = 'maouzju'
const DEFAULT_REPO = 'playlist-wall'

function normalizeVersion(input) {
  const raw = String(input || '').trim().replace(/^[vV]/, '')
  if (!raw) {
    return '0.0.0'
  }

  const match = raw.match(/^(\d+(?:\.\d+)*)(?:-([0-9A-Za-z.-]+))?/)
  if (!match) {
    return '0.0.0'
  }

  const main = match[1]
    .split('.')
    .map((value) => String(Math.max(0, Number.parseInt(value, 10) || 0)))
  while (main.length < 3) {
    main.push('0')
  }

  const prerelease = match[2] ? `-${match[2]}` : ''
  return `${main.join('.')}${prerelease}`
}

function parseVersion(input) {
  const normalized = normalizeVersion(input)
  const [mainPart, prereleasePart = ''] = normalized.split('-', 2)

  return {
    normalized,
    main: mainPart.split('.').map((value) => Number.parseInt(value, 10) || 0),
    prerelease: prereleasePart
      ? prereleasePart.split('.').map((value) => {
        if (/^\d+$/.test(value)) {
          return Number.parseInt(value, 10)
        }
        return String(value).toLowerCase()
      })
      : [],
  }
}

function compareIdentifiers(left, right) {
  const leftIsNumber = typeof left === 'number'
  const rightIsNumber = typeof right === 'number'

  if (leftIsNumber && rightIsNumber) {
    return left - right
  }

  if (leftIsNumber) {
    return -1
  }

  if (rightIsNumber) {
    return 1
  }

  if (left < right) {
    return -1
  }

  if (left > right) {
    return 1
  }

  return 0
}

function compareVersions(left, right) {
  const parsedLeft = parseVersion(left)
  const parsedRight = parseVersion(right)
  const maxLength = Math.max(parsedLeft.main.length, parsedRight.main.length)

  for (let index = 0; index < maxLength; index += 1) {
    const difference = (parsedLeft.main[index] || 0) - (parsedRight.main[index] || 0)
    if (difference !== 0) {
      return difference
    }
  }

  if (!parsedLeft.prerelease.length && !parsedRight.prerelease.length) {
    return 0
  }

  if (!parsedLeft.prerelease.length) {
    return 1
  }

  if (!parsedRight.prerelease.length) {
    return -1
  }

  const prereleaseLength = Math.max(parsedLeft.prerelease.length, parsedRight.prerelease.length)
  for (let index = 0; index < prereleaseLength; index += 1) {
    const leftValue = parsedLeft.prerelease[index]
    const rightValue = parsedRight.prerelease[index]

    if (leftValue === undefined) {
      return -1
    }

    if (rightValue === undefined) {
      return 1
    }

    const difference = compareIdentifiers(leftValue, rightValue)
    if (difference !== 0) {
      return difference
    }
  }

  return 0
}

function escapeRegExp(input) {
  return String(input || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function selectReleaseAsset(release, { arch = 'x64' } = {}) {
  const assets = Array.isArray(release?.assets) ? release.assets : []
  if (!assets.length) {
    return null
  }

  const releaseVersion = normalizeVersion(release?.tag_name || release?.name || '')
  const exactName = new RegExp(`^playlist-wall-${escapeRegExp(releaseVersion)}-windows-${escapeRegExp(arch)}\\.zip$`, 'i')
  const windowsArchZip = new RegExp(`windows.*${escapeRegExp(arch)}.*\\.zip$`, 'i')

  return assets.find((asset) => exactName.test(asset?.name || ''))
    || assets.find((asset) => windowsArchZip.test(asset?.name || ''))
    || assets.find((asset) => /\.zip$/i.test(asset?.name || ''))
    || null
}

function getInstallSupport(app) {
  if (process.platform !== 'win32') {
    return {
      supported: false,
      message: '一键更新目前仅支持 Windows 发布版。',
    }
  }

  if (!app?.isPackaged) {
    return {
      supported: false,
      message: '当前是开发模式，一键更新仅支持 GitHub Releases 解压版。',
    }
  }

  if (!/\.exe$/i.test(process.execPath || '')) {
    return {
      supported: false,
      message: '当前运行环境不支持一键更新。',
    }
  }

  return {
    supported: true,
    message: '',
  }
}

function formatReleaseInfo(release, currentVersion, installSupport, releasePageUrl) {
  const latestVersion = normalizeVersion(release?.tag_name || release?.name || '')
  const asset = selectReleaseAsset(release)
  const updateAvailable = compareVersions(latestVersion, currentVersion) > 0
  const assetDownloadUrl = String(asset?.browser_download_url || '').trim()
  const canInstall = Boolean(updateAvailable && installSupport.supported && asset && assetDownloadUrl)
  let installMessage = installSupport.message

  if (!installMessage && updateAvailable && (!asset || !assetDownloadUrl)) {
    installMessage = 'GitHub Releases 里没有找到可用的 Windows 更新包。'
  }

  return {
    ok: true,
    checkedAt: new Date().toISOString(),
    currentVersion,
    latestVersion,
    releaseName: String(release?.name || '').trim(),
    releaseUrl: String(release?.html_url || releasePageUrl).trim(),
    publishedAt: typeof release?.published_at === 'string' ? release.published_at : '',
    updateAvailable,
    assetName: String(asset?.name || '').trim(),
    downloadUrl: assetDownloadUrl,
    installSupported: canInstall,
    installMessage,
  }
}

async function fetchJson(url, fetchImpl, timeoutMs) {
  if (typeof fetchImpl !== 'function') {
    throw new Error('当前环境不支持更新检查。')
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetchImpl(url, {
      headers: {
        accept: 'application/vnd.github+json',
        'user-agent': 'playlist-wall-updater',
        'x-github-api-version': '2022-11-28',
      },
      redirect: 'follow',
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error(`GitHub 返回 ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new Error('检查更新超时，请稍后重试。')
    }
    throw error
  } finally {
    clearTimeout(timer)
  }
}

async function downloadFile(url, destinationPath, fetchImpl, timeoutMs) {
  if (typeof fetchImpl !== 'function') {
    throw new Error('当前环境不支持下载更新。')
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetchImpl(url, {
      headers: {
        accept: 'application/octet-stream',
        'user-agent': 'playlist-wall-updater',
      },
      redirect: 'follow',
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error(`下载更新包失败（${response.status}）`)
    }

    fs.mkdirSync(path.dirname(destinationPath), { recursive: true })

    if (!response.body) {
      const buffer = Buffer.from(await response.arrayBuffer())
      fs.writeFileSync(destinationPath, buffer)
      return destinationPath
    }

    const targetStream = fs.createWriteStream(destinationPath)
    if (typeof Readable.fromWeb === 'function') {
      await pipeline(Readable.fromWeb(response.body), targetStream)
    } else {
      const buffer = Buffer.from(await response.arrayBuffer())
      fs.writeFileSync(destinationPath, buffer)
    }

    return destinationPath
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new Error('下载更新包超时，请稍后重试。')
    }
    throw error
  } finally {
    clearTimeout(timer)
  }
}

function buildUpdaterScript() {
  return [
    'param(',
    '  [int]$ParentPid,',
    '  [string]$ZipPath,',
    '  [string]$ExtractRoot,',
    '  [string]$TargetDir,',
    '  [string]$ExeName',
    ')',
    '',
    "$ErrorActionPreference = 'Stop'",
    '',
    'function Wait-ParentExit {',
    '  param([int]$Pid)',
    '  for ($attempt = 0; $attempt -lt 600; $attempt += 1) {',
    '    $process = Get-Process -Id $Pid -ErrorAction SilentlyContinue',
    '    if (-not $process) {',
    '      return',
    '    }',
    '    Start-Sleep -Milliseconds 500',
    '  }',
    '  throw "Timed out waiting for app process to exit."',
    '}',
    '',
    'function Resolve-SourceDir {',
    '  param(',
    '    [string]$Root,',
    '    [string]$ExeName',
    '  )',
    '',
    '  if (Test-Path -LiteralPath (Join-Path $Root $ExeName)) {',
    '    return $Root',
    '  }',
    '',
    '  $directChild = Get-ChildItem -LiteralPath $Root -Directory | Where-Object {',
    '    Test-Path -LiteralPath (Join-Path $_.FullName $ExeName)',
    '  } | Select-Object -First 1',
    '',
    '  if ($directChild) {',
    '    return $directChild.FullName',
    '  }',
    '',
    '  $nestedExe = Get-ChildItem -LiteralPath $Root -Recurse -File -Filter $ExeName | Select-Object -First 1',
    '  if ($nestedExe) {',
    '    return $nestedExe.Directory.FullName',
    '  }',
    '',
    '  throw "Could not find the extracted app directory."',
    '}',
    '',
    'Wait-ParentExit -Pid $ParentPid',
    'Start-Sleep -Milliseconds 300',
    '',
    'if (-not (Test-Path -LiteralPath $TargetDir)) {',
    '  throw "Target directory does not exist: $TargetDir"',
    '}',
    '',
    'if (Test-Path -LiteralPath $ExtractRoot) {',
    '  Remove-Item -LiteralPath $ExtractRoot -Recurse -Force',
    '}',
    '',
    'New-Item -ItemType Directory -Path $ExtractRoot -Force | Out-Null',
    'Expand-Archive -LiteralPath $ZipPath -DestinationPath $ExtractRoot -Force',
    '',
    '$sourceDir = Resolve-SourceDir -Root $ExtractRoot -ExeName $ExeName',
    '$targetDirResolved = [System.IO.Path]::GetFullPath($TargetDir)',
    '$targetParent = Split-Path -LiteralPath $targetDirResolved -Parent',
    '$targetLeaf = Split-Path -LiteralPath $targetDirResolved -Leaf',
    '$pendingLeaf = "$targetLeaf.update-pending"',
    '$backupLeaf = "$targetLeaf.update-backup"',
    '$pendingDir = Join-Path $targetParent $pendingLeaf',
    '$backupDir = Join-Path $targetParent $backupLeaf',
    '',
    'if (Test-Path -LiteralPath $pendingDir) {',
    '  Remove-Item -LiteralPath $pendingDir -Recurse -Force',
    '}',
    '',
    'if (Test-Path -LiteralPath $backupDir) {',
    '  Remove-Item -LiteralPath $backupDir -Recurse -Force',
    '}',
    '',
    'New-Item -ItemType Directory -Path $pendingDir -Force | Out-Null',
    'robocopy $sourceDir $pendingDir /MIR /R:2 /W:1 /NFL /NDL /NJH /NJS /NP | Out-Null',
    'if ($LASTEXITCODE -gt 7) {',
    '  throw "robocopy failed with exit code $LASTEXITCODE"',
    '}',
    '',
    'Rename-Item -LiteralPath $targetDirResolved -NewName $backupLeaf',
    'Rename-Item -LiteralPath $pendingDir -NewName $targetLeaf',
    '$finalDir = Join-Path $targetParent $targetLeaf',
    '$finalExe = Join-Path $finalDir $ExeName',
    '',
    'Start-Process -FilePath $finalExe -WorkingDirectory $finalDir | Out-Null',
    '',
    'if (Test-Path -LiteralPath $backupDir) {',
    '  Remove-Item -LiteralPath $backupDir -Recurse -Force',
    '}',
    '',
    'if (Test-Path -LiteralPath $ZipPath) {',
    '  Remove-Item -LiteralPath $ZipPath -Force',
    '}',
    '',
    'if (Test-Path -LiteralPath $ExtractRoot) {',
    '  Remove-Item -LiteralPath $ExtractRoot -Recurse -Force',
    '}',
    '',
    'try {',
    '  Remove-Item -LiteralPath $PSCommandPath -Force',
    '} catch {',
    '}',
  ].join('\r\n')
}

function createAppUpdater(options = {}) {
  const app = options.app
  const owner = options.owner || DEFAULT_OWNER
  const repo = options.repo || DEFAULT_REPO
  const fetchImpl = options.fetchImpl || globalThis.fetch
  const spawnImpl = options.spawnImpl || spawn
  const now = typeof options.now === 'function' ? options.now : () => Date.now()
  const cacheTtlMs = Math.max(1_000, Number(options.cacheTtlMs || DEFAULT_CACHE_TTL_MS) || DEFAULT_CACHE_TTL_MS)
  const requestTimeoutMs = Math.max(
    1_000,
    Number(options.requestTimeoutMs || DEFAULT_REQUEST_TIMEOUT_MS) || DEFAULT_REQUEST_TIMEOUT_MS
  )
  const releaseApiUrl = options.releaseApiUrl || `https://api.github.com/repos/${owner}/${repo}/releases/latest`
  const releasePageUrl = options.releasePageUrl || `https://github.com/${owner}/${repo}/releases/latest`

  let cachedStatus = null
  let lastCheckedAtMs = 0
  let checkPromise = null
  let installInProgress = false

  async function performCheck() {
    const currentVersion = normalizeVersion(app?.getVersion?.() || '0.0.0')
    const installSupport = getInstallSupport(app)

    try {
      const release = await fetchJson(releaseApiUrl, fetchImpl, requestTimeoutMs)
      const status = formatReleaseInfo(release, currentVersion, installSupport, releasePageUrl)
      cachedStatus = status
      lastCheckedAtMs = now()
      return status
    } catch (error) {
      const status = {
        ok: false,
        checkedAt: new Date().toISOString(),
        currentVersion,
        latestVersion: '',
        releaseName: '',
        releaseUrl: releasePageUrl,
        publishedAt: '',
        updateAvailable: false,
        assetName: '',
        downloadUrl: '',
        installSupported: false,
        installMessage: installSupport.message,
        error: error?.message || String(error),
      }
      cachedStatus = status
      lastCheckedAtMs = now()
      return status
    }
  }

  async function checkForUpdates({ force = false } = {}) {
    const cacheFresh = cachedStatus && (now() - lastCheckedAtMs) < cacheTtlMs
    if (!force && cacheFresh) {
      return cachedStatus
    }

    if (checkPromise) {
      return checkPromise
    }

    checkPromise = performCheck().finally(() => {
      checkPromise = null
    })
    return checkPromise
  }

  async function installUpdate() {
    if (installInProgress) {
      return {
        ok: false,
        error: '更新正在进行中，请稍候。',
      }
    }

    installInProgress = true
    let scheduled = false

    try {
      const status = await checkForUpdates({ force: true })
      if (!status?.ok) {
        return {
          ok: false,
          error: status?.error || '检查更新失败。',
        }
      }

      if (!status.updateAvailable) {
        return {
          ok: false,
          error: '当前已经是最新版本。',
        }
      }

      if (!status.installSupported) {
        return {
          ok: false,
          error: status.installMessage || '当前环境不支持一键更新。',
        }
      }

      if (!status.downloadUrl) {
        return {
          ok: false,
          error: '未找到可用的更新包下载地址。',
        }
      }

      const targetDir = path.dirname(process.execPath)
      const exeName = path.basename(process.execPath)
      const tempRoot = path.join(
        app?.getPath?.('temp') || path.join(process.cwd(), '.tmp'),
        'playlist-wall-updater',
        `${status.latestVersion}-${Date.now()}`
      )
      const zipPath = path.join(tempRoot, 'update.zip')
      const extractRoot = path.join(tempRoot, 'extracted')
      const scriptPath = path.join(tempRoot, 'apply-update.ps1')

      await downloadFile(status.downloadUrl, zipPath, fetchImpl, Math.max(requestTimeoutMs, 5 * 60 * 1000))

      fs.mkdirSync(tempRoot, { recursive: true })
      fs.writeFileSync(scriptPath, buildUpdaterScript(), 'utf8')

      const child = spawnImpl('powershell', [
        '-NoProfile',
        '-ExecutionPolicy',
        'Bypass',
        '-WindowStyle',
        'Hidden',
        '-File',
        scriptPath,
        '-ParentPid',
        String(process.pid),
        '-ZipPath',
        zipPath,
        '-ExtractRoot',
        extractRoot,
        '-TargetDir',
        targetDir,
        '-ExeName',
        exeName,
      ], {
        detached: true,
        stdio: 'ignore',
        windowsHide: true,
      })

      child.unref()

      setTimeout(() => {
        if (typeof app?.quit === 'function') {
          app.quit()
        }
      }, 350)

      scheduled = true

      return {
        ok: true,
        scheduled: true,
        currentVersion: status.currentVersion,
        latestVersion: status.latestVersion,
      }
    } catch (error) {
      return {
        ok: false,
        error: error?.message || String(error),
      }
    } finally {
      if (!scheduled) {
        installInProgress = false
      }
    }
  }

  return {
    checkForUpdates,
    installUpdate,
  }
}

module.exports = {
  buildUpdaterScript,
  compareVersions,
  createAppUpdater,
  normalizeVersion,
  selectReleaseAsset,
}
