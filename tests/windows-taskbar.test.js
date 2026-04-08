const test = require('node:test')
const assert = require('node:assert/strict')

const {
  buildWindowsRelaunchCommand,
  buildWindowsTaskbarDetails,
} = require('../src/main/windows-taskbar')

test('buildWindowsRelaunchCommand includes the app path in development', () => {
  assert.equal(
    buildWindowsRelaunchCommand({
      execPath: 'C:\\Tools\\Electron\\electron.exe',
      appPath: 'D:\\Git\\music_manager',
      isPackaged: false,
    }),
    '"C:\\Tools\\Electron\\electron.exe" "D:\\Git\\music_manager"'
  )
})

test('buildWindowsRelaunchCommand keeps packaged relaunches pointed at the app executable', () => {
  assert.equal(
    buildWindowsRelaunchCommand({
      execPath: 'D:\\Apps\\Playlist Wall\\Playlist Wall.exe',
      appPath: 'D:\\Apps\\Playlist Wall\\resources\\app.asar',
      isPackaged: true,
    }),
    '"D:\\Apps\\Playlist Wall\\Playlist Wall.exe"'
  )
})

test('buildWindowsTaskbarDetails prefers the packaged executable icon', () => {
  assert.deepEqual(
    buildWindowsTaskbarDetails({
      appId: 'com.maouzju.playlistwall',
      execPath: 'D:\\Apps\\Playlist Wall\\Playlist Wall.exe',
      appPath: 'D:\\Apps\\Playlist Wall\\resources\\app.asar',
      iconPath: 'D:\\Apps\\Playlist Wall\\resources\\assets\\icon.ico',
      isPackaged: true,
      relaunchDisplayName: '歌单墙',
    }),
    {
      appId: 'com.maouzju.playlistwall',
      appIconIndex: 0,
      appIconPath: 'D:\\Apps\\Playlist Wall\\Playlist Wall.exe',
      relaunchCommand: '"D:\\Apps\\Playlist Wall\\Playlist Wall.exe"',
      relaunchDisplayName: '歌单墙',
    }
  )
})

test('buildWindowsTaskbarDetails uses the standalone ico during development', () => {
  assert.deepEqual(
    buildWindowsTaskbarDetails({
      appId: 'com.maouzju.playlistwall',
      execPath: 'C:\\Tools\\Electron\\electron.exe',
      appPath: 'D:\\Git\\music_manager',
      iconPath: 'D:\\Git\\music_manager\\assets\\icon.ico',
      isPackaged: false,
      relaunchDisplayName: '歌单墙',
    }),
    {
      appId: 'com.maouzju.playlistwall',
      appIconIndex: 0,
      appIconPath: 'D:\\Git\\music_manager\\assets\\icon.ico',
      relaunchCommand: '"C:\\Tools\\Electron\\electron.exe" "D:\\Git\\music_manager"',
      relaunchDisplayName: '歌单墙',
    }
  )
})
