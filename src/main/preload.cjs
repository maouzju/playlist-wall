const { contextBridge, ipcRenderer } = require('electron')

function bind(channel, callback) {
  const listener = (_event, payload) => callback(payload)
  ipcRenderer.on(channel, listener)
  return () => ipcRenderer.removeListener(channel, listener)
}

contextBridge.exposeInMainWorld('bridge', {
  openExternalUrl: (url) => ipcRenderer.invoke('openExternalUrl', url),
  getPreferences: () => ipcRenderer.invoke('getPreferences'),
  savePreferences: (preferences) => ipcRenderer.invoke('savePreferences', preferences),
  checkAppUpdate: (options) => ipcRenderer.invoke('checkAppUpdate', options),
  installAppUpdate: () => ipcRenderer.invoke('installAppUpdate'),
  init: () => ipcRenderer.invoke('init'),
  startQrLogin: () => ipcRenderer.invoke('startQrLogin'),
  checkQrLogin: (key) => ipcRenderer.invoke('checkQrLogin', key),
  logout: () => ipcRenderer.invoke('logout'),
  getSongUrl: (songId, options) => ipcRenderer.invoke('getSongUrl', songId, options),
  getArtistSongs: (artistId, maxCount, options) => ipcRenderer.invoke('getArtistSongs', artistId, maxCount, options),
  getOwnedPlaylistSummary: (playlistId) => ipcRenderer.invoke('getOwnedPlaylistSummary', playlistId),
  recordTrackPlay: (userId, trackId) => ipcRenderer.invoke('recordTrackPlay', userId, trackId),
  getPlaylistRecommendations: (playlistId, seedTrackIds, count) => ipcRenderer.invoke('getPlaylistRecommendations', playlistId, seedTrackIds, count),
  getExplorePlaylists: (options) => ipcRenderer.invoke('getExplorePlaylists', options),
  subscribePlaylist: (playlist) => ipcRenderer.invoke('subscribePlaylist', playlist),
  createOwnedPlaylist: (payload) => ipcRenderer.invoke('createOwnedPlaylist', payload),
  updateOwnedPlaylist: (payload) => ipcRenderer.invoke('updateOwnedPlaylist', payload),
  deleteOwnedPlaylist: (payload) => ipcRenderer.invoke('deleteOwnedPlaylist', payload),
  addTrackToPlaylist: (playlistId, track) => ipcRenderer.invoke('addTrackToPlaylist', playlistId, track),
  removeTrackFromPlaylist: (playlistId, trackId) => ipcRenderer.invoke('removeTrackFromPlaylist', playlistId, trackId),
  removeSubscribedPlaylist: (playlist) => ipcRenderer.invoke('removeSubscribedPlaylist', playlist),
  restoreSubscribedPlaylist: (playlist) => ipcRenderer.invoke('restoreSubscribedPlaylist', playlist),
  commitPlaylistTrackMove: (payload) => ipcRenderer.invoke('commitPlaylistTrackMove', payload),
  commitPlaylistOrder: (playlistIds) => ipcRenderer.invoke('commitPlaylistOrder', playlistIds),
  onProgress: (callback) => bind('progress', callback),
  onPlaylistPatch: (callback) => bind('playlist-patch', callback),
  onSubscribedPlaylistRemovalFailed: (callback) => bind('subscribed-playlist-removal-failed', callback),
  getLyrics: (songId) => ipcRenderer.invoke('getLyrics', songId),
  toggleLyricsWindow: (payload) => ipcRenderer.invoke('toggleLyricsWindow', payload),
  pushLyricsPlaybackTime: (payload) => ipcRenderer.invoke('pushLyricsPlaybackTime', payload),
  pushLyricsData: (payload) => ipcRenderer.invoke('pushLyricsData', payload),
  getLyricsPrefs: () => ipcRenderer.invoke('getLyricsPrefs'),
  saveLyricsPrefs: (partial) => ipcRenderer.invoke('saveLyricsPrefs', partial),
  onLyricsWindowState: (callback) => bind('lyrics-window-state', callback),
})
