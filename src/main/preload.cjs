const { contextBridge, ipcRenderer } = require('electron')

function bind(channel, callback) {
  const listener = (_event, payload) => callback(payload)
  ipcRenderer.on(channel, listener)
  return () => ipcRenderer.removeListener(channel, listener)
}

contextBridge.exposeInMainWorld('bridge', {
  getPreferences: () => ipcRenderer.invoke('getPreferences'),
  savePreferences: (preferences) => ipcRenderer.invoke('savePreferences', preferences),
  init: () => ipcRenderer.invoke('init'),
  startQrLogin: () => ipcRenderer.invoke('startQrLogin'),
  checkQrLogin: (key) => ipcRenderer.invoke('checkQrLogin', key),
  logout: () => ipcRenderer.invoke('logout'),
  getSongUrl: (songId, options) => ipcRenderer.invoke('getSongUrl', songId, options),
  getArtistSongs: (artistId, maxCount) => ipcRenderer.invoke('getArtistSongs', artistId, maxCount),
  recordTrackPlay: (userId, trackId) => ipcRenderer.invoke('recordTrackPlay', userId, trackId),
  getPlaylistRecommendations: (playlistId, seedTrackIds, count) => ipcRenderer.invoke('getPlaylistRecommendations', playlistId, seedTrackIds, count),
  getExplorePlaylists: (options) => ipcRenderer.invoke('getExplorePlaylists', options),
  subscribePlaylist: (playlist) => ipcRenderer.invoke('subscribePlaylist', playlist),
  addTrackToPlaylist: (playlistId, track) => ipcRenderer.invoke('addTrackToPlaylist', playlistId, track),
  removeTrackFromPlaylist: (playlistId, trackId) => ipcRenderer.invoke('removeTrackFromPlaylist', playlistId, trackId),
  removeSubscribedPlaylist: (playlist) => ipcRenderer.invoke('removeSubscribedPlaylist', playlist),
  restoreSubscribedPlaylist: (playlist) => ipcRenderer.invoke('restoreSubscribedPlaylist', playlist),
  commitPlaylistTrackMove: (payload) => ipcRenderer.invoke('commitPlaylistTrackMove', payload),
  onProgress: (callback) => bind('progress', callback),
  onPlaylistPatch: (callback) => bind('playlist-patch', callback),
  onSubscribedPlaylistRemovalFailed: (callback) => bind('subscribed-playlist-removal-failed', callback),
})
