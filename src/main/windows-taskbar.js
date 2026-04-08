function quoteWindowsCommandArgument(value) {
  return `"${String(value)}"`
}

function buildWindowsRelaunchCommand({ execPath, appPath, isPackaged }) {
  const parts = []

  if (execPath) {
    parts.push(execPath)
  }

  if (!isPackaged && appPath) {
    parts.push(appPath)
  }

  if (!parts.length) {
    return ''
  }

  return parts.map(quoteWindowsCommandArgument).join(' ')
}

function buildWindowsTaskbarDetails({
  appId,
  execPath,
  appPath,
  iconPath,
  isPackaged,
  relaunchDisplayName,
}) {
  const normalizedAppId = typeof appId === 'string' ? appId.trim() : ''
  if (!normalizedAppId) {
    return null
  }

  const normalizedExecPath = typeof execPath === 'string' ? execPath.trim() : ''
  const normalizedIconPath = typeof iconPath === 'string' ? iconPath.trim() : ''
  const normalizedDisplayName = typeof relaunchDisplayName === 'string'
    ? relaunchDisplayName.trim()
    : ''

  const details = {
    appId: normalizedAppId,
    appIconIndex: 0,
  }

  const appIconPath = isPackaged && normalizedExecPath
    ? normalizedExecPath
    : (normalizedIconPath || normalizedExecPath)

  if (appIconPath) {
    details.appIconPath = appIconPath
  }

  const relaunchCommand = buildWindowsRelaunchCommand({
    execPath: normalizedExecPath,
    appPath,
    isPackaged: Boolean(isPackaged),
  })

  if (relaunchCommand) {
    details.relaunchCommand = relaunchCommand
  }

  if (normalizedDisplayName) {
    details.relaunchDisplayName = normalizedDisplayName
  }

  return details
}

module.exports = {
  buildWindowsRelaunchCommand,
  buildWindowsTaskbarDetails,
}
