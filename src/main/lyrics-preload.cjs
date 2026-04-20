const { contextBridge, ipcRenderer } = require('electron')

function bind(channel, callback) {
  const listener = (_event, payload) => callback(payload)
  ipcRenderer.on(channel, listener)
  return () => ipcRenderer.removeListener(channel, listener)
}

contextBridge.exposeInMainWorld('lyricsBridge', {
  getLyricsPrefs: () => ipcRenderer.invoke('getLyricsPrefs'),
  saveLyricsPrefs: (partial) => ipcRenderer.invoke('saveLyricsPrefs', partial),
  closeLyricsWindow: () => ipcRenderer.invoke('closeLyricsWindow'),
  onLyricsData: (callback) => bind('lyrics-data', callback),
  onPlaybackTime: (callback) => bind('lyrics-playback-time', callback),
  onPrefsChange: (callback) => bind('lyrics-prefs', callback),
  onLockedChange: (callback) => bind('lyrics-locked', callback),
})
