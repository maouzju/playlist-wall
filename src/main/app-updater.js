const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')
const DEFAULT_CACHE_TTL_MS = 30 * 60 * 1000
const DEFAULT_REQUEST_TIMEOUT_MS = 20 * 1000
const DEFAULT_DOWNLOAD_IDLE_TIMEOUT_MS = 60 * 1000
const DEFAULT_QUIT_GRACE_MS = 2 * 1000
const DEFAULT_OWNER = 'maouzju'
const DEFAULT_REPO = 'playlist-wall'
const MAX_CAPTURED_PROCESS_OUTPUT = 8 * 1024

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

function getInstallSupport(app, execPath = process.execPath) {
  if (process.platform !== 'win32') {
    return {
      supported: false,
      message: '一键更新目前仅支持 Windows 发布版。',
    }
  }

  if (!app?.isPackaged && !hasPortableReleaseLayout(execPath)) {
    return {
      supported: false,
      message: '当前是开发模式，一键更新仅支持 GitHub Releases 解压版。',
    }
  }

  if (!/\.exe$/i.test(execPath || '')) {
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

function hasPortableReleaseLayout(execPath) {
  const normalizedExecPath = String(execPath || '').trim()
  if (!normalizedExecPath || !/\.exe$/i.test(normalizedExecPath)) {
    return false
  }

  const resourcesAppAsar = path.join(path.dirname(normalizedExecPath), 'resources', 'app.asar')
  return fs.existsSync(resourcesAppAsar)
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
  let timer = null
  const resetTimer = () => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => controller.abort(), timeoutMs)
  }
  const clearTimer = () => {
    if (!timer) {
      return
    }
    clearTimeout(timer)
    timer = null
  }

  resetTimer()

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
    clearTimer()
  }
}

async function downloadFile(url, destinationPath, fetchImpl, timeoutMs) {
  if (typeof fetchImpl !== 'function') {
    throw new Error('当前环境不支持下载更新。')
  }

  const controller = new AbortController()
  let timer = null
  const resetTimer = () => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => controller.abort(), timeoutMs)
  }
  const clearTimer = () => {
    if (!timer) {
      return
    }
    clearTimeout(timer)
    timer = null
  }

  resetTimer()

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
      resetTimer()
      const buffer = Buffer.from(await response.arrayBuffer())
      fs.writeFileSync(destinationPath, buffer)
      return destinationPath
    }

    if (typeof response.body.getReader === 'function') {
      const reader = response.body.getReader()
      const targetStream = fs.createWriteStream(destinationPath)

      await new Promise((resolve, reject) => {
        let settled = false

        const finishResolve = () => {
          if (settled) {
            return
          }
          settled = true
          resolve()
        }

        const finishReject = (error) => {
          if (settled) {
            return
          }
          settled = true
          targetStream.destroy()
          reject(error)
        }

        targetStream.on('error', finishReject)

        const pump = async () => {
          try {
            while (true) {
              resetTimer()
              const { done, value } = await reader.read()
              if (done) {
                clearTimer()
                targetStream.end(finishResolve)
                return
              }

              if (!value || value.length === 0) {
                continue
              }

              resetTimer()
              if (!targetStream.write(Buffer.from(value))) {
                await new Promise((drainResolve, drainReject) => {
                  const handleDrain = () => {
                    targetStream.off('error', handleError)
                    drainResolve()
                  }
                  const handleError = (error) => {
                    targetStream.off('drain', handleDrain)
                    drainReject(error)
                  }

                  targetStream.once('drain', handleDrain)
                  targetStream.once('error', handleError)
                })
              }
            }
          } catch (error) {
            finishReject(error)
          }
        }

        void pump()
      })
    } else {
      resetTimer()
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

function escapePowerShellSingleQuotes(input) {
  return String(input || '').replace(/'/g, "''")
}

function getPowerShellExecutable() {
  const systemRoot = process.env.SystemRoot || process.env.WINDIR
  if (systemRoot) {
    return path.join(systemRoot, 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe')
  }
  return 'powershell.exe'
}

function appendCapturedProcessOutput(current, chunk) {
  if (!chunk) {
    return current
  }

  const text = Buffer.isBuffer(chunk) ? chunk.toString('utf8') : String(chunk)
  if (!text) {
    return current
  }

  const next = `${current}${text}`
  if (next.length <= MAX_CAPTURED_PROCESS_OUTPUT) {
    return next
  }

  return next.slice(-MAX_CAPTURED_PROCESS_OUTPUT)
}

function summarizeCapturedProcessOutput(stdout, stderr) {
  const lines = [stderr, stdout]
    .map((value) => String(value || ''))
    .join('\n')
    .split(/\r?\n/g)
    .map((line) => line.trim())
    .filter(Boolean)

  if (!lines.length) {
    return ''
  }

  return lines.slice(-4).join(' | ')
}

async function downloadFileWithPowerShell(url, destinationPath, timeoutMs, spawnImpl = spawn) {
  if (typeof spawnImpl !== 'function') {
    throw new Error('PowerShell download is unavailable.')
  }

  fs.mkdirSync(path.dirname(destinationPath), { recursive: true })

  const timeoutSec = Math.max(15, Math.ceil(timeoutMs / 1000))
  const powerShellCommand = getPowerShellExecutable()
  const script = [
    "$ErrorActionPreference = 'Stop'",
    "$ProgressPreference = 'SilentlyContinue'",
    '$securityProtocol = [Net.SecurityProtocolType]::Tls12',
    "if ([Enum]::GetNames([Net.SecurityProtocolType]) -contains 'Tls11') {",
    '  $securityProtocol = $securityProtocol -bor [Net.SecurityProtocolType]::Tls11',
    '}',
    "if ([Enum]::GetNames([Net.SecurityProtocolType]) -contains 'Tls13') {",
    '  $securityProtocol = $securityProtocol -bor [Net.SecurityProtocolType]::Tls13',
    '}',
    '[Net.ServicePointManager]::SecurityProtocol = $securityProtocol',
    `$url = '${escapePowerShellSingleQuotes(url)}'`,
    `$outFile = '${escapePowerShellSingleQuotes(destinationPath)}'`,
    `$timeoutSec = ${timeoutSec}`,
    '$outDir = Split-Path -LiteralPath $outFile -Parent',
    'if (-not (Test-Path -LiteralPath $outDir)) {',
    '  New-Item -ItemType Directory -Path $outDir -Force | Out-Null',
    '}',
    '$downloadErrors = New-Object System.Collections.Generic.List[string]',
    'function Add-DownloadError {',
    '  param([string]$MethodName, [System.Exception]$Exception)',
    '  if ($Exception) {',
    '    $downloadErrors.Add("${MethodName}: $($Exception.Message)")',
    '    return',
    '  }',
    '  $downloadErrors.Add("${MethodName}: Unknown error")',
    '}',
    'function Test-DownloadedFile {',
    '  return (Test-Path -LiteralPath $outFile) -and ((Get-Item -LiteralPath $outFile).Length -gt 0)',
    '}',
    'try {',
    '  Start-BitsTransfer -Source $url -Destination $outFile -ErrorAction Stop',
    '  if (Test-DownloadedFile) { return }',
    '} catch {',
    "  Add-DownloadError 'Start-BitsTransfer' $_.Exception",
    '}',
    'try {',
    '  $invokeWebRequest = Get-Command Invoke-WebRequest -ErrorAction Stop',
    "  if ($invokeWebRequest.Parameters.ContainsKey('UseBasicParsing')) {",
    '    Invoke-WebRequest -Uri $url -OutFile $outFile -TimeoutSec $timeoutSec -UseBasicParsing',
    '  } else {',
    '    Invoke-WebRequest -Uri $url -OutFile $outFile -TimeoutSec $timeoutSec',
    '  }',
    '  if (Test-DownloadedFile) { return }',
    '} catch {',
    "  Add-DownloadError 'Invoke-WebRequest' $_.Exception",
    '}',
    'try {',
    '  $webClient = New-Object System.Net.WebClient',
    '  $webClient.DownloadFile($url, $outFile)',
    '  if (Test-DownloadedFile) { return }',
    '} catch {',
    "  Add-DownloadError 'WebClient' $_.Exception",
    '} finally {',
    '  if ($webClient) {',
    '    $webClient.Dispose()',
    '  }',
    '}',
    'try {',
    '  Add-Type -AssemblyName System.Net.Http',
    '  $handler = New-Object System.Net.Http.HttpClientHandler',
    '  $handler.AllowAutoRedirect = $true',
    '  $client = [System.Net.Http.HttpClient]::new($handler)',
    '  $client.Timeout = [TimeSpan]::FromSeconds($timeoutSec)',
    '  $response = $client.GetAsync($url, [System.Net.Http.HttpCompletionOption]::ResponseHeadersRead).GetAwaiter().GetResult()',
    '  $response.EnsureSuccessStatusCode()',
    '  $responseStream = $response.Content.ReadAsStreamAsync().GetAwaiter().GetResult()',
    '  $fileStream = [System.IO.File]::Open($outFile, [System.IO.FileMode]::Create, [System.IO.FileAccess]::Write, [System.IO.FileShare]::None)',
    '  try {',
    '    $responseStream.CopyTo($fileStream)',
    '  } finally {',
    '    if ($responseStream) {',
    '      $responseStream.Dispose()',
    '    }',
    '    if ($fileStream) {',
    '      $fileStream.Dispose()',
    '    }',
    '  }',
    '  if (Test-DownloadedFile) { return }',
    '} catch {',
    "  Add-DownloadError 'HttpClient' $_.Exception",
    '} finally {',
    '  if ($client) {',
    '    $client.Dispose()',
    '  }',
    '  if ($handler) {',
    '    $handler.Dispose()',
    '  }',
    '}',
    'if (Test-Path -LiteralPath $outFile) {',
    '  Remove-Item -LiteralPath $outFile -Force -ErrorAction SilentlyContinue',
    '}',
    "$detail = if ($downloadErrors.Count -gt 0) { $downloadErrors -join ' | ' } else { 'Unknown error' }",
    'throw "All PowerShell download methods failed: $detail"',
  ].join('; ')

  await new Promise((resolve, reject) => {
    const output = {
      stdout: '',
      stderr: '',
    }
    const child = spawnImpl(powerShellCommand, [
      '-NoProfile',
      '-NonInteractive',
      '-ExecutionPolicy',
      'Bypass',
      '-Command',
      script,
    ], {
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
    })

    child.stdout?.on('data', (chunk) => {
      output.stdout = appendCapturedProcessOutput(output.stdout, chunk)
    })
    child.stderr?.on('data', (chunk) => {
      output.stderr = appendCapturedProcessOutput(output.stderr, chunk)
    })

    let settled = false
    const finish = (handler) => (value) => {
      if (settled) {
        return
      }
      settled = true
      clearTimeout(timer)
      handler(value)
    }

    const timer = setTimeout(() => {
      if (settled) {
        return
      }
      settled = true
      if (typeof child.kill === 'function') {
        child.kill()
      }
      const detail = summarizeCapturedProcessOutput(output.stdout, output.stderr)
      reject(new Error(detail ? `Download timed out. ${detail}` : 'Download timed out.'))
    }, timeoutMs)

    const handleExit = finish((code) => {
      if (code === 0 && fs.existsSync(destinationPath) && fs.statSync(destinationPath).size > 0) {
        resolve()
        return
      }

      const detail = summarizeCapturedProcessOutput(output.stdout, output.stderr)
      if (code === 0) {
        reject(new Error(detail
          ? `PowerShell download finished without a file. ${detail}`
          : 'PowerShell download finished without a file.'))
        return
      }

      reject(new Error(detail
        ? `PowerShell download failed with exit code ${code}: ${detail}`
        : `PowerShell download failed with exit code ${code}`))
    })

    child.once('error', finish((error) => {
      reject(error)
    }))
    child.once('close', handleExit)
    child.once('exit', handleExit)
  })

  return destinationPath
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
    '  param([int]$ProcessId)',
    '  for ($attempt = 0; $attempt -lt 600; $attempt += 1) {',
    '    $process = Get-Process -Id $ProcessId -ErrorAction SilentlyContinue',
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
    'Wait-ParentExit -ProcessId $ParentPid',
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
  const execPath = String(options.execPath || process.execPath || '').trim()
  const fetchImpl = options.fetchImpl || globalThis.fetch
  const spawnImpl = options.spawnImpl || spawn
  const now = typeof options.now === 'function' ? options.now : () => Date.now()
  const cacheTtlMs = Math.max(1_000, Number(options.cacheTtlMs || DEFAULT_CACHE_TTL_MS) || DEFAULT_CACHE_TTL_MS)
  const requestTimeoutMs = Math.max(
    1_000,
    Number(options.requestTimeoutMs || DEFAULT_REQUEST_TIMEOUT_MS) || DEFAULT_REQUEST_TIMEOUT_MS
  )
  const downloadIdleTimeoutMs = Math.max(
    5_000,
    Number(options.downloadIdleTimeoutMs || DEFAULT_DOWNLOAD_IDLE_TIMEOUT_MS) || DEFAULT_DOWNLOAD_IDLE_TIMEOUT_MS
  )
  const quitGraceMs = Math.max(
    100,
    Number(options.quitGraceMs || DEFAULT_QUIT_GRACE_MS) || DEFAULT_QUIT_GRACE_MS
  )
  const releaseApiUrl = options.releaseApiUrl || `https://api.github.com/repos/${owner}/${repo}/releases/latest`
  const releasePageUrl = options.releasePageUrl || `https://github.com/${owner}/${repo}/releases/latest`

  let cachedStatus = null
  let lastCheckedAtMs = 0
  let checkPromise = null
  let installInProgress = false

  async function performCheck() {
    const currentVersion = normalizeVersion(app?.getVersion?.() || '0.0.0')
    const installSupport = getInstallSupport(app, execPath)

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

      const targetDir = path.dirname(execPath)
      const exeName = path.basename(execPath)
      const tempRoot = path.join(
        app?.getPath?.('temp') || path.join(process.cwd(), '.tmp'),
        'playlist-wall-updater',
        `${status.latestVersion}-${Date.now()}`
      )
      const zipPath = path.join(tempRoot, 'update.zip')
      const extractRoot = path.join(tempRoot, 'extracted')
      const scriptPath = path.join(tempRoot, 'apply-update.ps1')

      try {
        await downloadFile(status.downloadUrl, zipPath, fetchImpl, downloadIdleTimeoutMs)
      } catch (downloadError) {
        if (process.platform !== 'win32') {
          throw downloadError
        }

        try {
          fs.rmSync(zipPath, { force: true })
        } catch {}

        await downloadFileWithPowerShell(status.downloadUrl, zipPath, Math.max(downloadIdleTimeoutMs, 2 * 60 * 1000), spawnImpl)
      }

      fs.mkdirSync(tempRoot, { recursive: true })
      fs.writeFileSync(scriptPath, buildUpdaterScript(), 'utf8')

      const child = spawnImpl(getPowerShellExecutable(), [
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
        if (typeof app?.exit === 'function') {
          setTimeout(() => {
            app.exit(0)
          }, quitGraceMs)
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
