const path = require('path')
const { spawn } = require('child_process')

delete process.env.ELECTRON_RUN_AS_NODE

const electronBinary = require('electron')
const projectRoot = path.resolve(__dirname, '..')

const child = spawn(electronBinary, ['.'], {
  cwd: projectRoot,
  env: process.env,
  stdio: 'inherit',
  windowsHide: false,
})

child.on('exit', (code) => {
  process.exit(code ?? 0)
})
