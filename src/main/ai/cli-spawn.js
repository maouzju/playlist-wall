const { spawn } = require('child_process')

function quoteWindowsCmdArg(arg) {
  const source = String(arg ?? '')
  return `"${source
    .replace(/(\\*)"/g, '$1$1\\"')
    .replace(/(\\+)$/g, '$1$1')}"`
}

function buildWindowsCmdLine(command, args = []) {
  return ['call', quoteWindowsCmdArg(command), ...args.map((arg) => quoteWindowsCmdArg(arg))].join(' ')
}

function spawnCli(command, args = [], options = {}) {
  if (process.platform !== 'win32') {
    return spawn(command, args, {
      windowsHide: true,
      ...options,
    })
  }

  const comspec = process.env.ComSpec || 'cmd.exe'
  return spawn(comspec, ['/d', '/s', '/c', buildWindowsCmdLine(command, args)], {
    windowsHide: true,
    windowsVerbatimArguments: true,
    ...options,
    shell: false,
  })
}

module.exports = {
  buildWindowsCmdLine,
  quoteWindowsCmdArg,
  spawnCli,
}
