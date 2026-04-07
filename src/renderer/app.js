const WALL_MIN_CARD_WIDTH = 188
const WALL_MAX_COLUMNS = 7
const WALL_GAP = 6
const WALL_ROW_HEIGHT = 22
const WALL_ROW_OVERSCAN = 12
const WALL_ROW_WINDOW_STEP = 6
const PLAYLIST_HEADER_HEIGHT = 40
const PLAYLIST_FOOTER_HEIGHT = 0
const PLAYLIST_PLACEHOLDER_HEIGHT = 34
const PLAYLIST_RECOMMENDATION_HEIGHT = 114
const WALL_OVERSCAN_PX = 480
const SEARCH_DEBOUNCE_MS = 120
const PREVIEW_DURATION_GAP_MS = 4000
const ALBUM_HOVER_DELAY_MS = 200
const ALBUM_HOVER_ROW_GAP = 8
const ALBUM_HOVER_PADDING = 8
const THEME_STORAGE_KEY = 'playlist-wall-theme'
const SETTINGS_STORAGE_KEY = 'playlist-wall-settings'
const SESSION_LAYOUT_STORAGE_KEY = 'playlist-wall-session-layout'
const PATCH_COALESCE_MS = 300
const RECOMMENDATION_COUNT = 4
const RECOMMENDATION_FETCH_COUNT = Math.max(RECOMMENDATION_COUNT * 3, 12)
const RECOMMENDATION_CONCURRENCY = 2
const QR_LOGIN_POLL_MS = 1400
const PLAYLIST_UNDO_NOTICE_MS = 20000
const PLAYLIST_DRAG_CLICK_SUPPRESS_MS = 280
const CONTEXT_MENU_SCROLL_GUARD_MS = 150
const TRACK_FOCUS_FLASH_MS = 1800
const UI_SCALE_MIN = 80
const UI_SCALE_MAX = 125
const UI_SCALE_STEP = 5
const UI_SCALE_DEFAULT = 100
const LIKED_PLAYLIST_DISPLAY_MODE_ALL = 'all'
const LIKED_PLAYLIST_DISPLAY_MODE_UNCOLLECTED = 'uncollected'
const LIKED_PLAYLIST_DISPLAY_MODE_HIDDEN = 'hidden'
const AUDIO_QUALITY_BEST = 'best'
const AUDIO_QUALITY_LOSSLESS = 'lossless'
const AUDIO_QUALITY_EXHIGH = 'exhigh'
const AUDIO_QUALITY_STANDARD = 'standard'
const ARTIST_TRACK_DISPLAY_LIMIT_MIN = 20
const ARTIST_TRACK_DISPLAY_LIMIT_MAX = 1000
const ARTIST_TRACK_DISPLAY_LIMIT_DEFAULT = 100
const ARTIST_TRACK_HYDRATION_CONCURRENCY = 2
const ARTIST_PLAYLIST_ID_OFFSET = 1000000000000
const ARTIST_SUMMARY_TRACK_COUNT_MIN = 3
const ARTIST_SUMMARY_TRACK_COUNT_MAX = 20
const AUDIO_SOURCE_WAIT_TIMEOUT_MS = 4000
const AUDIO_QUALITY_SWITCH_DEBOUNCE_MS = 180
const AUDIO_QUALITY_REFRESH_REASON_SETTINGS = 'settings'
const AUDIO_QUALITY_REFRESH_REASON_NETWORK = 'network'

const TEXT = {
  tabOwned: '\u81ea\u5df1\u521b\u5efa',
  tabSpotify: 'Spotify 歌单',
  tabSubscribed: '\u6536\u85cf\u8ba2\u9605',
  tabExplore: '\u63a2\u7d22\u6b4c\u5355',
  tabArtists: '\u827a\u4eba\u6b4c\u5355',
  loadingFailed: '\u52a0\u8f7d\u5931\u8d25\uff1a',
  initFailed: '\u521d\u59cb\u5316\u5931\u8d25',
  loadingDefault: '\u6b63\u5728\u521d\u59cb\u5316...',
  noPlaylists: '\u6ca1\u6709\u52a0\u8f7d\u5230\u6b4c\u5355\uff0c\u8bf7\u68c0\u67e5\u767b\u5f55\u6001\u6216\u7f13\u5b58\u3002',
  noMatch: '\u5f53\u524d\u641c\u7d22\u6ca1\u6709\u547d\u4e2d\u4efb\u4f55\u6b4c\u5355',
  emptyTab: '\u5f53\u524d\u5206\u533a\u8fd8\u6ca1\u6709\u6b4c\u5355',
  emptySpotify: '还没有读取到 Spotify 歌单',
  emptyExplore: '\u8fd8\u6ca1\u52a0\u8f7d\u5230\u53ef\u63a2\u7d22\u7684\u6b4c\u5355',
  emptyArtists: '\u8fd8\u6ca1\u751f\u6210\u827a\u4eba\u6b4c\u5355',
  loadingExplore: '\u6b63\u5728\u52a0\u8f7d\u63a2\u7d22\u6b4c\u5355...',
  loadingExploreSearch: '\u6b63\u5728\u641c\u7d22\u793e\u533a\u6b4c\u5355...',
  exploreFailed: '\u52a0\u8f7d\u63a2\u7d22\u6b4c\u5355\u5931\u8d25',
  subscribePlaylist: '\u6536\u85cf\u6b4c\u5355',
  subscribedPlaylist: '\u5df2\u6536\u85cf',
  subscribePlaylistDone: '\u5df2\u6536\u85cf\u6b4c\u5355',
  subscribePlaylistFailed: '\u6536\u85cf\u6b4c\u5355\u5931\u8d25',
  searchExplorePlaceholder: '\u641c\u7d22\u793e\u533a\u6b4c\u5355',
  searchSpotifyPlaceholder: '搜索 Spotify 歌单、歌曲、专辑、歌手',
  searchArtistsPlaceholder: '\u641c\u7d22\u827a\u4eba\u6216\u6b4c\u66f2',
  searchLibraryPlaceholder: '\u641c\u7d22\u6b4c\u5355\u3001\u6b4c\u66f2\u3001\u4e13\u8f91\u3001\u6b4c\u624b',
  collapsePlaylist: '\u538b\u7f29\u6b4c\u5355',
  expandPlaylist: '\u5c55\u5f00\u6b4c\u5355',
  expandArtistTracks: '\u6269\u5927',
  shrinkArtistTracks: '\u7f29\u5c0f',
  emptyPlaylist: '\u8fd9\u5f20\u6b4c\u5355\u6682\u65f6\u6ca1\u6709\u53ef\u5c55\u5f00\u7684\u66f2\u76ee\u3002',
  hydratingPlaylist: '\u6b63\u5728\u7ee7\u7eed\u5c55\u5f00\u8fd9\u5f20\u6b4c\u5355...',
  unavailableTrack: '\u8fd9\u9996\u6b4c\u73b0\u5728\u64ad\u4e0d\u4e86\uff0c\u8bd5\u8bd5\u4e0b\u4e00\u9996\u3002',
  noPlayableUrl: '\u8fd9\u9996\u6b4c\u6ca1\u6709\u53ef\u64ad\u653e\u94fe\u63a5\u3002',
  playbackFailed: '\u64ad\u653e\u5931\u8d25',
  notPlaying: '\u8fd8\u6ca1\u5f00\u59cb\u64ad\u653e',
  pickTrack: '\u70b9\u4efb\u610f\u4e00\u9996\u6b4c\u5f00\u59cb',
  resolving: '\u6b63\u5728\u89e3\u6790\uff1a',
  previewTrack: '\u5f53\u524d\u662f\u8bd5\u542c\u7248',
  noCurrentTrack: '\u8fd8\u6ca1\u6709\u6b63\u5728\u64ad\u653e\u7684\u6b4c',
  locateFailed: '\u6ca1\u627e\u5230\u5f53\u524d\u64ad\u653e\u4f4d\u7f6e',
  switchedDark: '\u5df2\u5207\u6362\u5230\u9ed1\u5e95',
  switchedLight: '\u5df2\u5207\u6362\u5230\u767d\u5e95',
  locatedCurrent: '\u5df2\u5b9a\u4f4d\u5230\u5f53\u524d\u64ad\u653e',
  settings: '\u8bbe\u7f6e',
  settingsTitle: '\u754c\u9762\u8bbe\u7f6e',
  playlistRecommendations: '\u6b4c\u5355\u63a8\u8350\u97f3\u4e50',
  playlistRecommendationsHint: '\u6253\u5f00\u540e\uff0c\u6bcf\u5f20\u6b4c\u5355\u5e95\u90e8\u4f1a\u6309\u8fd9\u5f20\u6b4c\u5355\u7684\u98ce\u683c\u8865\u4e00\u7ec4\u76f8\u4f3c\u6b4c\u66f2\u3002',
  recommendationsTitle: '\u76f8\u4f3c\u63a8\u8350',
  recommendationsLoading: '\u6b63\u5728\u52a0\u8f7d\u63a8\u8350...',
  recommendationsEmpty: '\u6682\u65f6\u6ca1\u6709\u63a8\u8350',
  recommendationsFailed: '\u63a8\u8350\u52a0\u8f7d\u5931\u8d25',
  addToPlaylist: '\u52a0\u5165',
  addedToPlaylist: '\u5df2\u6536',
  addToPlaylistDone: '\u5df2\u52a0\u5165\u6b4c\u5355',
  addToPlaylistFailed: '\u52a0\u5165\u6b4c\u5355\u5931\u8d25',
  removeFromPlaylist: '\u79fb\u51fa\u6b4c\u5355',
  removeFromPlaylistDone: '\u5df2\u4ece\u6b4c\u5355\u79fb\u51fa',
  removeFromPlaylistFailed: '\u79fb\u51fa\u6b4c\u5355\u5931\u8d25',
  createOwnedPlaylist: '\u65b0\u5efa\u6b4c\u5355',
  createOwnedPlaylistDone: '\u5df2\u65b0\u5efa\u6b4c\u5355',
  createOwnedPlaylistFailed: '\u65b0\u5efa\u6b4c\u5355\u5931\u8d25',
  editOwnedPlaylist: '\u7f16\u8f91\u6b4c\u5355',
  updateOwnedPlaylistDone: '\u5df2\u66f4\u65b0\u6b4c\u5355',
  updateOwnedPlaylistFailed: '\u7f16\u8f91\u6b4c\u5355\u5931\u8d25',
  deleteOwnedPlaylist: '\u5220\u9664\u81ea\u5efa\u6b4c\u5355',
  deleteOwnedPlaylistDone: '\u5df2\u5220\u9664\u6b4c\u5355',
  deleteOwnedPlaylistFailed: '\u5220\u9664\u81ea\u5efa\u6b4c\u5355\u5931\u8d25',
  playlistEditorCreateTitle: '\u65b0\u5efa\u6b4c\u5355',
  playlistEditorEditTitle: '\u7f16\u8f91\u6b4c\u5355',
  playlistEditorName: '\u6b4c\u5355\u540d',
  playlistEditorNamePlaceholder: '\u7ed9\u8fd9\u5f20\u6b4c\u5355\u8d77\u4e2a\u540d\u5b57',
  playlistEditorDescription: '\u7b80\u4ecb',
  playlistEditorDescriptionPlaceholder: '\u53ef\u4ee5\u5199\u8fd9\u5f20\u6b4c\u5355\u7684\u6c14\u8d28\u3001\u573a\u666f\u6216\u5907\u6ce8',
  playlistEditorCover: '\u5c01\u9762',
  playlistEditorChooseCover: '\u9009\u62e9\u56fe\u7247',
  playlistEditorResetCover: '\u6062\u590d\u5f53\u524d',
  playlistEditorNoCover: '\u672a\u9009\u62e9',
  playlistEditorCancel: '\u53d6\u6d88',
  playlistEditorSaveCreate: '\u521b\u5efa',
  playlistEditorSaveUpdate: '\u4fdd\u5b58',
  playlistEditorDeleteConfirm: '\u786e\u5b9a\u5220\u9664\u8fd9\u5f20\u81ea\u5efa\u6b4c\u5355\uff1f',
  playlistEditorPickCoverFailed: '\u8fd9\u5f20\u56fe\u7247\u6682\u65f6\u7528\u4e0d\u4e86\uff0c\u8bf7\u6362\u4e00\u5f20\u8bd5\u8bd5',
  playlistEditorNameRequired: '\u8bf7\u5148\u8f93\u5165\u6b4c\u5355\u540d',
  removeSubscribedPlaylist: '\u5220\u9664\u6b4c\u5355',
  removeSubscribedPlaylistFailed: '\u5220\u9664\u6536\u85cf\u6b4c\u5355\u5931\u8d25',
  restoreSubscribedPlaylist: '\u64a4\u9500',
  restoreSubscribedPlaylistBusy: '\u64a4\u9500\u4e2d...',
  restoreSubscribedPlaylistFailed: '\u64a4\u9500\u5220\u9664\u6b4c\u5355\u5931\u8d25',
  playlistUndoPrompt: '\u662f\u5426\u64a4\u9500\uff1f',
  playlistUndoPending: '\u8bf7\u5148\u5904\u7406\u5f53\u524d\u7684\u64a4\u9500\u63d0\u793a',
  close: '\u5173\u95ed',
  clearSearch: '\u6e05\u7a7a\u641c\u7d22',
  moveToPlaylistDone: '\u5df2\u79fb\u52a8\u5230\u6b4c\u5355',
  copyToPlaylistDone: '\u5df2\u52a0\u5165\u5230\u6b4c\u5355',
  moveToPlaylistFailed: '\u79fb\u52a8\u5230\u6b4c\u5355\u5931\u8d25',
  pinToTop: '\u7f6e\u9876',
  goToArtistPlaylist: '\u8f6c\u5230\u827a\u4eba\u6b4c\u5355',
  goToArtistPlaylistDone: '\u5df2\u8df3\u8f6c\u5230\u827a\u4eba\u6b4c\u5355',
  goToArtistPlaylistFailed: '\u6ca1\u627e\u5230\u5bf9\u5e94\u7684\u827a\u4eba\u6b4c\u5355',
  searchArtistCommunityPlaylists: '\u641c\u7d22\u5305\u542b\u672c\u827a\u4eba\u6b4c\u66f2\u7684\u6b4c\u5355',
  searchArtistCommunityPlaylistsFailed: '\u672a\u627e\u5230\u53ef\u7528\u4e8e\u641c\u7d22\u7684\u827a\u4eba',
  reorderPlaylistDone: '\u5df2\u540c\u6b65\u6b4c\u5355\u987a\u5e8f',
  reorderPlaylistFailed: '\u8c03\u6574\u6b4c\u5355\u987a\u5e8f\u5931\u8d25',
  noMoveTarget: '\u6682\u65f6\u6ca1\u6709\u66f4\u5408\u9002\u7684\u6b4c\u5355',
  play: '\u64ad\u653e',
  pause: '\u6682\u505c',
  prev: '\u4e0a\u4e00\u9996',
  next: '\u4e0b\u4e00\u9996',
  shuffleOn: '\u968f\u673a \u5f00',
  shuffleOff: '\u968f\u673a \u5173',
  repeatAll: '\u5faa\u73af \u5168\u90e8',
  repeatOne: '\u5faa\u73af \u5355\u66f2',
  repeatOff: '\u5faa\u73af \u5173\u95ed',
  nowPlaying: '\u5728\u64ad',
  authLoadingQr: '\u6b63\u5728\u751f\u6210\u767b\u5f55\u4e8c\u7ef4\u7801...',
  authWaiting: '\u8bf7\u4f7f\u7528\u7f51\u6613\u4e91\u97f3\u4e50\u626b\u7801\u767b\u5f55\u3002',
  authConfirm: '\u5df2\u626b\u7801\uff0c\u8bf7\u5728\u624b\u673a\u4e0a\u786e\u8ba4\u767b\u5f55\u3002',
  authExpired: '\u4e8c\u7ef4\u7801\u5df2\u8fc7\u671f\uff0c\u8bf7\u5237\u65b0\u540e\u91cd\u8bd5\u3002',
  authLoggedIn: '\u767b\u5f55\u6210\u529f\uff0c\u6b63\u5728\u8f7d\u5165\u6b4c\u5355...',
  authFailed: '\u4e8c\u7ef4\u7801\u767b\u5f55\u5931\u8d25\uff1a',
  loginSuccess: '\u767b\u5f55\u6210\u529f',
  plaintextSessionWarning: '\u5f53\u524d\u7cfb\u7edf\u4e0d\u652f\u6301\u5b89\u5168\u5b58\u50a8\uff0c\u767b\u5f55\u6001 cookie \u4f1a\u4ee5\u660e\u6587\u4fdd\u5b58\u5728 userData/session.json \u3002',
  logout: '\u9000\u51fa\u767b\u5f55',
  logoutDone: '\u5df2\u9000\u51fa\u5f53\u524d\u8d26\u53f7',
  logoutFailed: '\u9000\u51fa\u767b\u5f55\u5931\u8d25',
  spotifyImportConnectFailed: 'Spotify 导入失败：',
  spotifyImportConnected: '已接入 Spotify 歌单',
  spotifyImportLoginWindowOpened: '请在弹出的 Spotify 窗口里完成登录',
  spotifyImportCleared: '已清除 Spotify 导入',
  spotifyImportReadonlyTrack: '这批 Spotify 歌单当前只做整理，不在这里站内播放',
  spotifyPlaybackResolving: '正在匹配网易云音源...',
  spotifyPlaybackUnmatched: '这首歌还没匹配到网易云可播放版本',
  spotifyOpenPlaylist: '\u5728 Spotify \u4e2d\u6253\u5f00\u6b4c\u5355',
  spotifyOpenTrack: '\u5728 Spotify \u4e2d\u6253\u5f00\u6b4c\u66f2',
  spotifyOpenFailed: '\u6253\u5f00 Spotify \u94fe\u63a5\u5931\u8d25',
  spotifyImportStatusDisconnected: '未连接',
  spotifyImportStatusConnected: '已连接 Spotify：',
  spotifyImportLoading: '正在读取 Spotify 歌单...',
  spotifyImportPlaintextWarning: '当前系统不支持安全存储，Spotify sp_dc 会以明文保存在 userData/spotify-session.json 。',
  spotifySyncToNeteaseDone: '已把 Spotify 歌单增量合并进网易云',
  spotifySyncToSpotifyDone: '已把网易云歌单增量合并进 Spotify',
  spotifySyncFailed: 'Spotify 双向同步失败',
  exploreRequiresNetease: '探索和站内播放仍需要网易云登录',
  appUpdateChecking: '正在检查 GitHub 新版本...',
  appUpdateLatest: '当前已经是最新版本',
  appUpdateAvailable: '发现新版本',
  appUpdateCheckFailed: '检查更新失败',
  appUpdateCheckButton: '检查更新',
  appUpdateCheckBusy: '检查中...',
  appUpdateInstallButton: '一键更新',
  appUpdateInstallBusy: '下载并更新中...',
  appUpdateRestarting: '更新包已准备完成，应用即将重启',
  appUpdateInstallFailed: '启动更新失败',
}

TEXT.spotifyImportLoginWindowOpened = '已打开 Spotify 登录窗口，请在窗口里完成登录'
TEXT.spotifyImportPlaintextWarning = '当前系统不支持安全存储，Spotify 登录凭据会以明文保存在 userData/spotify-session.json 。'

const state = {
  account: null,
  playlists: [],
  spotifyPlaylists: [],
  explorePlaylists: [],
  artistPlaylists: [],
  playlistMap: new Map(),
  recommendations: new Map(),
  activeTab: 'owned',
  visiblePlaylists: [],
  search: '',
  exploreLoaded: false,
  exploreLoading: false,
  exploreQuery: '',
  exploreArtistSearchRef: '',
  exploreArtistFilterKey: '',
  exploreError: '',
  queue: [],
  queueMode: '',
  queuePlaylistId: null,
  queueContextLabel: '',
  queueIndex: -1,
  currentTrackId: null,
  isPlaying: false,
  isResolving: false,
  isPreview: false,
  shuffle: false,
  repeat: 'all',
  playToken: 0,
  theme: loadStoredTheme(),
  settings: loadStoredSettings(),
  uiSession: loadUiSessionState(),
  layout: { columns: 1 },
  localPlayCounts: new Map(),
  cloudPlayCounts: new Map(),
  combinedPlayCounts: new Map(),
  trackPlayTiers: new Map(),
  artistPlaylistSets: new Map(),
  artistPlaylistEntriesByKey: new Map(),
  artistPlaylistIdByKey: new Map(),
  artistRemoteTracksByKey: new Map(),
  totalOwnedPlaylistCount: 0,
  currentPlaybackRequestedQuality: '',
  currentPlaybackResolvedLevel: '',
  tabScrollPositions: {
    owned: 0,
    spotify: 0,
    subscribed: 0,
    explore: 0,
    artists: 0,
  },
  neteaseAuthenticated: false,
  spotifyImport: {
    connected: false,
    account: null,
    storageMode: '',
    updatedAt: '',
    busy: false,
  },
  spotifySync: {
    busy: false,
  },
  appUpdate: {
    busy: false,
    action: '',
    checked: false,
    currentVersion: '',
    latestVersion: '',
    releaseName: '',
    releaseUrl: '',
    publishedAt: '',
    updateAvailable: false,
    installSupported: false,
    installMessage: '',
    error: '',
    errorStage: '',
  },
}

const refs = {}
const appBridge = resolveBridge()
const renderRuntime = {
  wallRenderToken: 0,
  wallRenderFrame: 0,
  wallViewportFrame: 0,
  searchTimer: 0,
  patchFlushTimer: 0,
  wallColumns: [],
  wallNodeMaps: [],
  wallPlacementsByColumn: [],
  wallTrackAnchors: new Map(),
  wallRenderedKeys: [],
  renderedPlaylistIds: new Set(),
  pendingTabScrollRestore: null,
  pendingPlaylistPatches: [],
  pendingPatchDone: false,
  recommendationSessionId: 0,
  recommendationGlobalError: '',
  recommendationQueue: [],
  recommendationInFlight: 0,
  expandedArtistTrackKeys: new Set(),
  artistHydrationSessionId: 0,
  artistHydrationQueue: [],
  artistHydrationInFlight: 0,
  artistHydrationRerenderPending: false,
  renderedTrackKey: '',
  renderedRecommendationKey: '',
  renderedPlaylistId: null,
  authPollTimer: 0,
  authLoginKey: '',
  contextMenuTrack: null,
  contextMenuOpenedAt: 0,
  selectedTrackKeys: new Set(),
  selectedTrackAnchorKey: '',
  trackRangeAnchorKey: '',
  selectedPlaylistId: 0,
  albumHoverTimer: 0,
  albumHoverPendingKey: '',
  albumHoverTrackKey: '',
  exploreRequestToken: 0,
  exploreRequestKey: '',
  exploreRequestPromise: null,
  subscribingPlaylistIds: new Set(),
  dragCleanupTimer: 0,
  dragState: null,
  dragSourceRow: null,
  dragIndicator: null,
  playlistDragState: null,
  playlistDragSourceCard: null,
  playlistDragIndicator: null,
  playlistDragSuppressedId: 0,
  playlistDragSuppressUntil: 0,
  playlistMutationPending: false,
  playlistRemovalPendingIds: new Set(),
  playlistUndoNotice: null,
  playlistUndoTimer: 0,
  focusFlashTrackKey: '',
  focusFlashTimer: 0,
  audioQualityRefreshTimer: 0,
  pendingAudioQualityRefreshReason: '',
  playlistEditorState: null,
}

document.addEventListener('DOMContentLoaded', () => {
  void bootstrapApp().catch((error) => {
    console.error('bootstrap error:', error)
    renderFatalBootstrapError(error)
  })
})

window.addEventListener('error', (event) => {
  console.error('window error:', event.error || event.message || 'unknown error')
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('window unhandledrejection:', event.reason)
})

async function bootstrapApp() {
  cacheRefs()
  await hydrateStoredPreferences()
  applyUiScale(state.settings.uiScale)
  applyTheme(state.theme, { silent: true, persistLocal: false })
  renderSettings()
  void refreshAppUpdateStatus({ silent: true })
  await fetchSpotifyImportState()
  bindEvents()
  wireBridge()
  silentlyPreloadExplorePlaylists()
  await init()
}

function renderFatalBootstrapError(error) {
  const message = String(error?.message || error || TEXT.initFailed)

  try {
    const loading = document.getElementById('loading')
    const loadingStage = document.getElementById('loading-stage')
    const progressBar = document.getElementById('progress-bar')
    const authScreen = document.getElementById('auth-screen')
    const app = document.getElementById('app')

    if (loadingStage) {
      loadingStage.textContent = `${TEXT.loadingFailed}${message}`
    }

    if (progressBar) {
      progressBar.style.background = '#111111'
      progressBar.style.width = '100%'
    }

    loading?.classList.remove('hidden')
    authScreen?.classList.add('hidden')
    app?.classList.add('hidden')
  } catch {}
}

function resolveBridge() {
  const useMock = new URLSearchParams(window.location.search).get('mock') === '1'
  if (!useMock && window.bridge && typeof window.bridge.init === 'function') {
    return window.bridge
  }
  return createMockBridge()
}

function createMockBridge() {
  const params = new URLSearchParams(window.location.search)
  const progressive = params.get('progressive') === '1'
  const huge = params.get('huge') === '1'
  const authRequired = params.get('auth') === '1'
  const authAuto = params.get('authAuto') !== '0'
  const initDelay = Math.max(0, Number(params.get('initDelay') || 0) || 0)
  const exploreDelay = Math.max(0, Number(params.get('exploreDelay') || 0) || 0)
  const mockAppVersion = String(params.get('appVersion') || '0.21.0').trim().replace(/^[vV]/, '')
  const mockAppUpdateMode = String(params.get('appUpdate') || 'latest').trim().toLowerCase()
  const mockLatestVersion = String(params.get('appUpdateVersion') || '0.22.0').trim().replace(/^[vV]/, '')
  const progressListeners = new Set()
  const patchListeners = new Set()
  const subscribedPlaylistRemovalFailureListeners = new Set()
  const account = { userId: 1, nickname: '\u793a\u4f8b\u8d26\u53f7' }
  let loggedIn = !authRequired
  let qrChecks = 0
  let exploreRequestCount = 0
  let artistRequestCount = 0
  const pendingRemovedSubscribedPlaylists = new Map()
  const localPlayCounts = {
    101001: 6,
    101002: 3,
  }
  const cloudPlayCounts = {
    101001: 42,
    101002: 18,
    101003: 8,
    102001: 14,
  }
  let storedSettings = {}
  try {
    storedSettings = JSON.parse(window.localStorage.getItem(SETTINGS_STORAGE_KEY) || '{}')
  } catch {}
  let storedPreferences = {
    theme: window.localStorage.getItem(THEME_STORAGE_KEY) || 'light',
    showPlaylistRecommendations: Boolean(storedSettings.showPlaylistRecommendations),
    likedPlaylistDisplayMode: normalizeLikedPlaylistDisplayMode(storedSettings.likedPlaylistDisplayMode),
    defaultAudioQuality: normalizeAudioQualityPreference(storedSettings.defaultAudioQuality),
    autoAdjustAudioQuality: storedSettings.autoAdjustAudioQuality !== false,
    artistTrackDisplayLimit: normalizeArtistTrackDisplayLimit(storedSettings.artistTrackDisplayLimit),
    collapsedPlaylistIds: normalizeCollapsedPlaylistIds(storedSettings.collapsedPlaylistIds),
    ownedPlaylistOrderIds: normalizePlaylistOrderIds(storedSettings.ownedPlaylistOrderIds),
    uiScale: normalizeUiScale(storedSettings.uiScale),
  }
  const basePlaylists = huge
    ? buildHugeMockPlaylists()
    : [
      buildMockPlaylist(101, '\u6211\u559c\u6b22\u7684\u97f3\u4e50', 64, 1, false, '', { hydrating: progressive, hydrated: !progressive, tracks: progressive ? [] : null, specialType: 5 }),
      buildMockPlaylist(102, '\u81ea\u5efa\u7535\u5b50', 42, 1, false),
      buildMockPlaylist(103, '\u81ea\u5efa\u7eaf\u97f3', 28, 1, false),
      buildMockPlaylist(201, '\u6536\u85cf\u7235\u58eb', 35, 2, true),
      buildMockPlaylist(202, '\u6536\u85cf\u6c1b\u56f4', 52, 3, true),
      buildMockPlaylist(203, '\u79c1\u5bc6\u6b4c\u5355', 18, 4, true, '\u8be5\u6b4c\u5355\u662f\u79c1\u5bc6\u7684\uff0c\u65e0\u6cd5\u5c55\u5f00\u3002'),
    ]
  seedMockLikedPlaylistOverlap(basePlaylists)
  const defaultExplorePlaylists = buildMockExplorePlaylists()
  const artistTrackStore = buildMockArtistSongStore(basePlaylists)
  const recommendationStore = new Map()
  let nextMockPlaylistId = Math.max(0, ...basePlaylists.map((playlist) => Number(playlist.id || 0))) + 1
  let mockAppUpdateCheckCount = 0
  let mockAppUpdateInstallCount = 0
  window.__mockAppUpdateCheckCount = 0
  window.__mockAppUpdateInstallCount = 0
  const emitProgress = (payload) => progressListeners.forEach((listener) => listener(payload))
  const emitPatch = (payload) => patchListeners.forEach((listener) => listener(payload))
  const clearPendingMockSubscribedPlaylistRemoval = (entry) => {
    if (entry?.timer) {
      window.clearTimeout(entry.timer)
      entry.timer = 0
    }
  }
  const takePendingMockSubscribedPlaylistRemoval = (playlistId) => {
    const normalizedPlaylistId = Number(playlistId || 0)
    if (normalizedPlaylistId <= 0) {
      return null
    }

    const entry = pendingRemovedSubscribedPlaylists.get(normalizedPlaylistId) || null
    if (!entry) {
      return null
    }

    clearPendingMockSubscribedPlaylistRemoval(entry)
    pendingRemovedSubscribedPlaylists.delete(normalizedPlaylistId)
    return entry
  }
  const updateMockStats = () => {
    window.__mockStats = {
      playlistCount: basePlaylists.length,
      trackCount: basePlaylists.reduce((sum, playlist) => sum + playlist.tracks.length, 0),
      exploreRequestCount,
      artistRequestCount,
    }
  }
  const buildMockPlaylistSummary = (playlist) => ({
    id: Number(playlist?.id || 0),
    sourcePlaylistId: Number(playlist?.sourcePlaylistId || playlist?.id || 0),
    name: playlist?.name || '',
    trackCount: Number(playlist?.trackCount || 0),
    coverUrl: playlist?.coverUrl || '',
    specialType: Number(playlist?.specialType || 0),
    subscribed: Boolean(playlist?.subscribed),
    creatorId: Number(playlist?.creatorId || 0),
    creatorName: playlist?.creatorName || '',
    description: String(playlist?.description || ''),
    playCount: Number(playlist?.playCount || 0),
    copywriter: playlist?.copywriter || '',
    exploreSourceLabel: playlist?.exploreSourceLabel || '',
    isExplore: Boolean(playlist?.isExplore),
  })
  const buildMockAppUpdateResult = () => {
    if (mockAppUpdateMode === 'error') {
      return {
        ok: false,
        error: 'mock update check failed',
        currentVersion: mockAppVersion,
        latestVersion: '',
        releaseName: '',
        releaseUrl: 'https://github.com/maouzju/playlist-wall/releases/latest',
        publishedAt: '',
        updateAvailable: false,
        assetName: '',
        downloadUrl: '',
        installSupported: false,
        installMessage: '',
      }
    }

    const updateAvailable = mockAppUpdateMode === 'available' || mockAppUpdateMode === 'unsupported'
    const installSupported = mockAppUpdateMode === 'available'
    const latestVersion = updateAvailable ? mockLatestVersion : mockAppVersion

    return {
      ok: true,
      currentVersion: mockAppVersion,
      latestVersion,
      releaseName: `v${latestVersion}`,
      releaseUrl: `https://github.com/maouzju/playlist-wall/releases/tag/v${latestVersion}`,
      publishedAt: '2026-04-04T12:00:00.000Z',
      updateAvailable,
      assetName: updateAvailable ? `playlist-wall-${latestVersion}-windows-x64.zip` : '',
      downloadUrl: updateAvailable ? 'https://example.com/playlist-wall.zip' : '',
      installSupported,
      installMessage: updateAvailable && !installSupported
        ? '当前是开发模式，一键更新仅支持 GitHub Releases 解压版。'
        : '',
    }
  }

  return {
    getSpotifyImportState: async () => ({
      ok: true,
      connected: false,
      storageMode: '',
      updatedAt: '',
      account: null,
    }),
    startSpotifyImportLogin: async () => ({
      ok: false,
      error: 'mock bridge does not implement Spotify import',
      cancelled: false,
      account: null,
      playlists: [],
      storageMode: '',
    }),
    refreshSpotifyImport: async () => ({
      ok: false,
      error: 'mock bridge does not implement Spotify import',
      account: null,
      playlists: [],
      storageMode: '',
    }),
    clearSpotifyImport: async () => ({
      ok: true,
    }),
    resolveSpotifyPlayback: async () => ({
      ok: false,
      error: TEXT.spotifyImportReadonlyTrack,
      resolvedTracks: [],
      unresolvedTrackIds: [],
    }),
    syncSpotifyLibraryToNetease: async () => ({
      ok: true,
      playlists: [],
      summary: {
        processedCount: 0,
        createdCount: 0,
        addedTrackCount: 0,
        resolvedTrackCount: 0,
        unresolvedTrackCount: 0,
      },
    }),
    syncNeteaseLibraryToSpotify: async () => ({
      ok: true,
      summary: {
        processedCount: 0,
        createdCount: 0,
        addedTrackCount: 0,
        resolvedTrackCount: 0,
        unresolvedTrackCount: 0,
      },
    }),
    openExternalUrl: async (url) => {
      const normalizedUrl = String(url || '').trim()
      if (!normalizedUrl) {
        return { ok: false, error: TEXT.spotifyOpenFailed }
      }

      try {
        window.open(normalizedUrl, '_blank', 'noopener,noreferrer')
      } catch {}

      return { ok: true }
    },
    checkAppUpdate: async () => {
      mockAppUpdateCheckCount += 1
      window.__mockAppUpdateCheckCount = mockAppUpdateCheckCount
      return buildMockAppUpdateResult()
    },
    installAppUpdate: async () => {
      mockAppUpdateInstallCount += 1
      window.__mockAppUpdateInstallCount = mockAppUpdateInstallCount
      const result = buildMockAppUpdateResult()
      if (!result?.ok) {
        return { ok: false, error: result?.error || TEXT.appUpdateInstallFailed }
      }
      if (!result.updateAvailable) {
        return { ok: false, error: TEXT.appUpdateLatest }
      }
      if (!result.installSupported) {
        return { ok: false, error: result.installMessage || TEXT.appUpdateInstallFailed }
      }
      return {
        ok: true,
        scheduled: true,
        currentVersion: mockAppVersion,
        latestVersion: mockLatestVersion,
      }
    },
    getPreferences: async () => ({
      ok: true,
      preferences: {
        theme: storedPreferences.theme === 'dark' ? 'dark' : 'light',
        showPlaylistRecommendations: Boolean(storedPreferences.showPlaylistRecommendations),
        likedPlaylistDisplayMode: normalizeLikedPlaylistDisplayMode(storedPreferences.likedPlaylistDisplayMode),
        defaultAudioQuality: normalizeAudioQualityPreference(storedPreferences.defaultAudioQuality),
        autoAdjustAudioQuality: storedPreferences.autoAdjustAudioQuality !== false,
        artistTrackDisplayLimit: normalizeArtistTrackDisplayLimit(storedPreferences.artistTrackDisplayLimit),
        collapsedPlaylistIds: normalizeCollapsedPlaylistIds(storedPreferences.collapsedPlaylistIds),
        ownedPlaylistOrderIds: normalizePlaylistOrderIds(storedPreferences.ownedPlaylistOrderIds),
        uiScale: normalizeUiScale(storedPreferences.uiScale),
      },
    }),
    savePreferences: async (preferences) => {
      storedPreferences = {
        ...storedPreferences,
        ...preferences,
        likedPlaylistDisplayMode: normalizeLikedPlaylistDisplayMode(
          preferences?.likedPlaylistDisplayMode ?? storedPreferences.likedPlaylistDisplayMode
        ),
        defaultAudioQuality: normalizeAudioQualityPreference(
          preferences?.defaultAudioQuality ?? storedPreferences.defaultAudioQuality
        ),
        autoAdjustAudioQuality: preferences?.autoAdjustAudioQuality !== undefined
          ? preferences.autoAdjustAudioQuality !== false
          : storedPreferences.autoAdjustAudioQuality !== false,
        artistTrackDisplayLimit: normalizeArtistTrackDisplayLimit(
          preferences?.artistTrackDisplayLimit ?? storedPreferences.artistTrackDisplayLimit
        ),
        collapsedPlaylistIds: normalizeCollapsedPlaylistIds(
          preferences?.collapsedPlaylistIds ?? storedPreferences.collapsedPlaylistIds
        ),
        ownedPlaylistOrderIds: normalizePlaylistOrderIds(
          preferences?.ownedPlaylistOrderIds ?? storedPreferences.ownedPlaylistOrderIds
        ),
        uiScale: normalizeUiScale(preferences?.uiScale ?? storedPreferences.uiScale),
      }
      return {
        ok: true,
        preferences: {
          theme: storedPreferences.theme === 'dark' ? 'dark' : 'light',
          showPlaylistRecommendations: Boolean(storedPreferences.showPlaylistRecommendations),
          likedPlaylistDisplayMode: normalizeLikedPlaylistDisplayMode(storedPreferences.likedPlaylistDisplayMode),
          defaultAudioQuality: normalizeAudioQualityPreference(storedPreferences.defaultAudioQuality),
          autoAdjustAudioQuality: storedPreferences.autoAdjustAudioQuality !== false,
          artistTrackDisplayLimit: normalizeArtistTrackDisplayLimit(storedPreferences.artistTrackDisplayLimit),
          collapsedPlaylistIds: normalizeCollapsedPlaylistIds(storedPreferences.collapsedPlaylistIds),
          ownedPlaylistOrderIds: normalizePlaylistOrderIds(storedPreferences.ownedPlaylistOrderIds),
          uiScale: normalizeUiScale(storedPreferences.uiScale),
        },
      }
    },
    init: async () => {
      if (!loggedIn) {
        return {
          ok: true,
          needsLogin: true,
        }
      }

      if (initDelay > 0) {
        await new Promise((resolve) => window.setTimeout(resolve, initDelay))
      }

      if (progressive) {
        window.setTimeout(() => {
          emitPatch({
            playlists: [buildMockPlaylist(101, '\u6211\u559c\u6b22\u7684\u97f3\u4e50', 64, 1, false, '', { hydrated: true, hydrating: false, specialType: 5 })],
            done: true,
          })
        }, 260)
      }
      updateMockStats()
      return {
        ok: true,
        account,
        playlists: basePlaylists,
        playback: {
          localPlayCounts,
          cloudPlayCounts,
        },
      }
    },
    startQrLogin: async () => {
      qrChecks = 0
      return {
        ok: true,
        key: 'mock-login-key',
        qrUrl: 'https://music.163.com/mock-login',
        qrImage: buildMockQrImage(),
      }
    },
    checkQrLogin: async () => {
      qrChecks += 1

      if (!authAuto) {
        return {
          ok: true,
          status: qrChecks > 1 ? 'confirm' : 'waiting',
          message: qrChecks > 1 ? TEXT.authConfirm : TEXT.authWaiting,
        }
      }

      if (qrChecks < 2) {
        return {
          ok: true,
          status: 'waiting',
          message: TEXT.authWaiting,
        }
      }

      loggedIn = true
      return {
        ok: true,
        status: 'authorized',
        message: TEXT.loginSuccess,
      }
    },
    logout: async () => {
      loggedIn = false
      qrChecks = 0
      return { ok: true }
    },
    getSongUrl: async (songId, options = {}) => {
      window.__mockLastSongUrlRequest = {
        songId: Number(songId || 0),
        options: {
          preferredQuality: normalizeAudioQualityPreference(options?.preferredQuality),
        },
      }
      return { ok: false, error: '\u6a21\u62df\u6a21\u5f0f\u4e0d\u63d0\u4f9b\u97f3\u9891\u94fe\u63a5' }
    },
    getArtistSongs: async (artistId, maxCount) => {
      artistRequestCount += 1
      updateMockStats()
      const normalizedArtistId = Number(artistId || 0)
      const normalizedArtistName = normalizeQuery(
        normalizedArtistId > 0 ? '' : String(artistId || '')
      )
      const resolvedArtistId = normalizedArtistId > 0
        ? normalizedArtistId
        : Number(artistTrackStore.byName.get(normalizedArtistName) || 0)
      const numericMaxCount = Number(maxCount)
      const normalizedLimit = Number.isFinite(numericMaxCount) && numericMaxCount > 0
        ? Math.max(1, Math.round(numericMaxCount))
        : 0
      const sourceTracks = artistTrackStore.byId.get(resolvedArtistId) || []
      return {
        ok: true,
        artistId: resolvedArtistId,
        tracks: normalizedLimit > 0 ? sourceTracks.slice(0, normalizedLimit) : sourceTracks.slice(),
      }
    },
    getOwnedPlaylistSummary: async (playlistId) => {
      const normalizedPlaylistId = Number(playlistId || 0)
      const playlist = basePlaylists.find((item) => Number(item.id || 0) === normalizedPlaylistId) || null
      if (!playlist) {
        return { ok: false, error: TEXT.updateOwnedPlaylistFailed }
      }

      return { ok: true, playlist: buildMockPlaylistSummary(playlist) }
    },
    recordTrackPlay: async (_userId, trackId) => {
      const key = String(Number(trackId || 0))
      localPlayCounts[key] = Number(localPlayCounts[key] || 0) + 1
      return { ok: true, localPlayCount: localPlayCounts[key] }
    },
    getPlaylistRecommendations: async (playlistId) => {
      if (!recommendationStore.has(playlistId)) {
        recommendationStore.set(playlistId, buildMockRecommendations(playlistId))
      }
      return { ok: true, tracks: recommendationStore.get(playlistId) }
    },
    getExplorePlaylists: async (options = {}) => {
      exploreRequestCount += 1
      updateMockStats()
      const query = normalizeQuery(options?.query || '')
      const resolvedArtistId = Number(options?.artistRef || 0) > 0
        ? Number(options.artistRef || 0)
        : Number(artistTrackStore.byName.get(normalizeQuery(options?.artistName || options?.artistRef || '')) || 0)
      const seedTrackIds = new Set()
      if (Number(options?.seedTrackId || 0) > 0) {
        seedTrackIds.add(Number(options.seedTrackId || 0))
      }
      if (resolvedArtistId > 0) {
        for (const track of (artistTrackStore.byId.get(resolvedArtistId) || []).slice(0, 10)) {
          if (Number(track?.id || 0) > 0) {
            seedTrackIds.add(Number(track.id || 0))
          }
        }
      }
      const source = seedTrackIds.size
        ? defaultExplorePlaylists.filter((playlist) =>
          (playlist.tracks || []).some((track) => seedTrackIds.has(Number(track?.id || 0)))
        )
        : (query
          ? defaultExplorePlaylists.filter((playlist) => normalizeQuery([
            playlist.name,
            playlist.creatorName,
            playlist.exploreSourceLabel,
            playlist.description,
          ].join(' ')).includes(query))
          : defaultExplorePlaylists)

      if (exploreDelay > 0) {
        await new Promise((resolve) => window.setTimeout(resolve, exploreDelay))
      }

      return { ok: true, playlists: source }
    },
    subscribePlaylist: async (playlist) => {
      const sourcePlaylistId = Number(playlist?.sourcePlaylistId || playlist?.id || 0)
      if (sourcePlaylistId <= 0) {
        return { ok: false, error: TEXT.subscribePlaylistFailed }
      }

      const pendingEntry = takePendingMockSubscribedPlaylistRemoval(sourcePlaylistId)
      const nextPlaylist = {
        ...(pendingEntry?.playlist || {}),
        ...playlist,
        id: sourcePlaylistId,
        sourcePlaylistId,
        isExplore: false,
        subscribed: true,
      }
      const existingIndex = basePlaylists.findIndex((item) => Number(item?.id || 0) === sourcePlaylistId)
      if (existingIndex >= 0) {
        basePlaylists[existingIndex] = nextPlaylist
      } else {
        basePlaylists.push(nextPlaylist)
      }

      updateMockStats()
      return { ok: true, playlist: nextPlaylist }
    },
    createOwnedPlaylist: async (payload = {}) => {
      const normalizedName = String(payload?.name || '').trim()
      if (!normalizedName) {
        return { ok: false, error: TEXT.createOwnedPlaylistFailed }
      }

      const nextPlaylist = buildMockPlaylist(
        nextMockPlaylistId,
        normalizedName,
        0,
        account.userId,
        false,
        '',
        {
          tracks: [],
          description: String(payload?.description || ''),
          coverUrl: payload?.coverFile?.previewUrl || buildMockCover(nextMockPlaylistId),
        }
      )
      nextMockPlaylistId += 1
      basePlaylists.unshift(nextPlaylist)
      updateMockStats()
      return { ok: true, playlist: nextPlaylist }
    },
    updateOwnedPlaylist: async (payload = {}) => {
      const playlistId = Number(payload?.playlist?.id || payload?.id || 0)
      const existingIndex = basePlaylists.findIndex((item) => Number(item.id || 0) === playlistId)
      if (existingIndex < 0) {
        return { ok: false, error: TEXT.updateOwnedPlaylistFailed }
      }

      const existingPlaylist = basePlaylists[existingIndex]
      const nextName = String(payload?.name || existingPlaylist.name || '').trim()
      if (!nextName) {
        return { ok: false, error: TEXT.updateOwnedPlaylistFailed }
      }

      const nextPlaylist = {
        ...existingPlaylist,
        name: nextName,
        description: String(payload?.description ?? existingPlaylist.description ?? ''),
        coverUrl: payload?.coverFile?.previewUrl || existingPlaylist.coverUrl,
      }
      basePlaylists[existingIndex] = nextPlaylist
      updateMockStats()
      return { ok: true, playlist: buildMockPlaylistSummary(nextPlaylist) }
    },
    deleteOwnedPlaylist: async (payload = {}) => {
      const playlistId = Number(payload?.playlist?.id || payload?.id || 0)
      const existingIndex = basePlaylists.findIndex((item) => Number(item.id || 0) === playlistId)
      if (existingIndex < 0) {
        return { ok: false, error: TEXT.deleteOwnedPlaylistFailed }
      }

      basePlaylists.splice(existingIndex, 1)
      updateMockStats()
      return { ok: true, playlistId }
    },
    addTrackToPlaylist: async () => ({ ok: true }),
    removeTrackFromPlaylist: async () => ({ ok: true }),
    commitPlaylistTrackMove: async () => ({ ok: true }),
    removeSubscribedPlaylist: async (playlist) => {
      const normalizedPlaylistId = Number(playlist?.sourcePlaylistId || playlist?.id || 0)
      const index = basePlaylists.findIndex((playlist) => playlist.id === normalizedPlaylistId)
      if (index < 0) {
        return { ok: false, error: TEXT.removeSubscribedPlaylistFailed }
      }

      const [removedPlaylist] = basePlaylists.splice(index, 1)
      if (removedPlaylist) {
        const entry = takePendingMockSubscribedPlaylistRemoval(normalizedPlaylistId) || {
          playlist: removedPlaylist,
          timer: 0,
        }
        entry.playlist = {
          ...removedPlaylist,
          ...playlist,
          id: normalizedPlaylistId,
          sourcePlaylistId: normalizedPlaylistId,
          subscribed: true,
          isExplore: false,
        }
        entry.timer = window.setTimeout(() => {
          takePendingMockSubscribedPlaylistRemoval(normalizedPlaylistId)
        }, PLAYLIST_UNDO_NOTICE_MS)
        pendingRemovedSubscribedPlaylists.set(normalizedPlaylistId, entry)
      }
      updateMockStats()
      return { ok: true }
    },
    restoreSubscribedPlaylist: async (playlist) => {
      const normalizedPlaylistId = Number(playlist?.id || 0)
      if (normalizedPlaylistId <= 0) {
        return { ok: false, error: TEXT.restoreSubscribedPlaylistFailed }
      }

      const pendingEntry = takePendingMockSubscribedPlaylistRemoval(normalizedPlaylistId)
      if (!basePlaylists.some((item) => item.id === normalizedPlaylistId)) {
        const restoredPlaylist = pendingEntry?.playlist || {
          ...playlist,
          id: normalizedPlaylistId,
          sourcePlaylistId: normalizedPlaylistId,
          subscribed: true,
          isExplore: false,
        }
        basePlaylists.push(restoredPlaylist)
      }

      updateMockStats()
      return { ok: true }
    },
    onProgress: (callback) => {
      progressListeners.add(callback)
      callback({ message: progressive ? '\u6b4c\u5355\u5899\u5df2\u6253\u5f00\uff0c\u6b63\u5728\u7ee7\u7eed\u5c55\u5f00...' : '\u6a21\u62df\u6570\u636e\u5df2\u5c31\u7eea', pct: 100 })
      return () => progressListeners.delete(callback)
    },
    onPlaylistPatch: (callback) => {
      patchListeners.add(callback)
      return () => patchListeners.delete(callback)
    },
    onSubscribedPlaylistRemovalFailed: (callback) => {
      subscribedPlaylistRemovalFailureListeners.add(callback)
      return () => subscribedPlaylistRemovalFailureListeners.delete(callback)
    },
  }
}

function buildMockQrImage() {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320">
      <rect width="320" height="320" fill="#ffffff"/>
      <rect x="18" y="18" width="284" height="284" rx="18" fill="#ffffff" stroke="#111111" stroke-width="10"/>
      <rect x="42" y="42" width="68" height="68" fill="#111111"/>
      <rect x="54" y="54" width="44" height="44" fill="#ffffff"/>
      <rect x="66" y="66" width="20" height="20" fill="#111111"/>
      <rect x="210" y="42" width="68" height="68" fill="#111111"/>
      <rect x="222" y="54" width="44" height="44" fill="#ffffff"/>
      <rect x="234" y="66" width="20" height="20" fill="#111111"/>
      <rect x="42" y="210" width="68" height="68" fill="#111111"/>
      <rect x="54" y="222" width="44" height="44" fill="#ffffff"/>
      <rect x="66" y="234" width="20" height="20" fill="#111111"/>
      <rect x="146" y="42" width="20" height="20" fill="#111111"/>
      <rect x="146" y="74" width="20" height="20" fill="#111111"/>
      <rect x="134" y="118" width="32" height="32" fill="#111111"/>
      <rect x="190" y="134" width="20" height="20" fill="#111111"/>
      <rect x="150" y="166" width="24" height="24" fill="#111111"/>
      <rect x="182" y="182" width="44" height="20" fill="#111111"/>
      <rect x="146" y="214" width="20" height="20" fill="#111111"/>
      <rect x="178" y="230" width="20" height="20" fill="#111111"/>
      <text x="160" y="298" font-size="20" font-family="sans-serif" text-anchor="middle" fill="#111111">\u6b4c\u5355\u5899</text>
    </svg>
  `)}`
}

function buildHugeMockPlaylists() {
  const playlists = []

  for (let index = 0; index < 36; index += 1) {
    const owned = index < 18
    playlists.push(buildMockPlaylist(
      1000 + index,
      owned && index === 0 ? '\u6211\u559c\u6b22\u7684\u97f3\u4e50' : `${owned ? '\u81ea\u5efa' : '\u6536\u85cf'}\u5927\u6b4c\u5355 ${index + 1}`,
      180 + ((index % 6) * 24),
      owned ? 1 : 200 + index,
      !owned,
      '',
      { specialType: owned && index === 0 ? 5 : 0 }
    ))
  }

  return playlists
}

function buildMockExplorePlaylists() {
  const buildExplicitMockTrack = (id, name, artistId, artistName, albumId = 1) => ({
    artistEntries: [{ id: artistId, name: artistName }],
    albumId,
    albumCoverUrl: buildMockCover(albumId),
    id,
    name,
    artists: [artistName],
    album: `\u4e13\u8f91 ${albumId}`,
    durationMs: 180000,
  })

  return [
    buildMockPlaylist(901, '\u6bcf\u65e5\u63a8\u9001 \u665a\u95f4\u653e\u677e', 32, 3001, true, '', {
      creatorName: '\u4e91\u97f3\u4e50\u65e5\u63a8',
      exploreSourceLabel: '\u6bcf\u65e5\u63a8\u9001',
      isExplore: true,
      playCount: 320000,
    }),
    buildMockPlaylist(902, '\u6bcf\u65e5\u63a8\u9001 \u96e8\u591c\u57ce\u5e02', 28, 3002, true, '', {
      creatorName: '\u4e91\u97f3\u4e50\u65e5\u63a8',
      exploreSourceLabel: '\u6bcf\u65e5\u63a8\u9001',
      isExplore: true,
      playCount: 285000,
    }),
    buildMockPlaylist(903, '\u793e\u533a\u7cbe\u9009 \u827a\u672f\u5bb6 5 \u591c\u822a\u7cbe\u9009', 12, 4001, true, '', {
      creatorName: '\u6a59\u5b50\u7535\u53f0',
      exploreSourceLabel: '\u793e\u533a\u7cbe\u9009',
      isExplore: true,
      playCount: 810000,
      tracks: [
        buildExplicitMockTrack(101005, '\u6211\u559c\u6b22\u7684\u97f3\u4e50 5', 5, '\u827a\u672f\u5bb6 5', 5),
        buildExplicitMockTrack(903002, '\u591c\u822a\u7cbe\u9009 2', 2, '\u827a\u672f\u5bb6 2', 2),
        buildExplicitMockTrack(903003, '\u591c\u822a\u7cbe\u9009 3', 5, '\u827a\u672f\u5bb6 5', 6),
        buildExplicitMockTrack(903004, '\u591c\u822a\u7cbe\u9009 4', 1, '\u827a\u672f\u5bb6 1', 3),
      ],
    }),
    buildMockPlaylist(904, '\u793e\u533a\u7cbe\u9009 \u827a\u672f\u5bb6 5 \u6807\u9898\u515a', 4, 4002, true, '', {
      creatorName: '\u591c\u884c\u7535\u53f0',
      exploreSourceLabel: '\u793e\u533a\u7cbe\u9009',
      isExplore: true,
      playCount: 670000,
      tracks: [
        buildExplicitMockTrack(904001, '\u5047\u547d\u4e2d 1', 1, '\u827a\u672f\u5bb6 1', 1),
        buildExplicitMockTrack(904002, '\u5047\u547d\u4e2d 2', 2, '\u827a\u672f\u5bb6 2', 2),
        buildExplicitMockTrack(904003, '\u5047\u547d\u4e2d 3', 1, '\u827a\u672f\u5bb6 1', 3),
        buildExplicitMockTrack(904004, '\u5047\u547d\u4e2d 4', 2, '\u827a\u672f\u5bb6 2', 4),
      ],
    }),
    buildMockPlaylist(905, '\u793e\u533a\u7cbe\u9009 \u706f\u4e0b Jazz', 25, 4003, true, '', {
      creatorName: '\u9ed1\u80f6\u4ff1\u4e50\u90e8',
      exploreSourceLabel: '\u793e\u533a\u7cbe\u9009',
      isExplore: true,
      playCount: 510000,
    }),
    buildMockPlaylist(906, '\u641c\u7d22\u70ed\u95e8 \u827a\u672f\u5bb6 5 \u57ce\u5e02\u56de\u58f0', 4, 4004, true, '', {
      creatorName: '\u7535\u53f0 FM',
      exploreSourceLabel: '\u793e\u533a\u7cbe\u9009',
      isExplore: true,
      playCount: 430000,
      tracks: [
        buildExplicitMockTrack(102005, '\u81ea\u5efa\u7535\u5b50 5', 5, '\u827a\u672f\u5bb6 5', 5),
        buildExplicitMockTrack(906002, '\u57ce\u5e02\u56de\u58f0 2', 3, '\u827a\u672f\u5bb6 3', 6),
        buildExplicitMockTrack(906003, '\u57ce\u5e02\u56de\u58f0 3', 5, '\u827a\u672f\u5bb6 5', 7),
        buildExplicitMockTrack(906004, '\u57ce\u5e02\u56de\u58f0 4', 4, '\u827a\u672f\u5bb6 4', 8),
      ],
    }),
  ]
}

function buildMockPlaylist(id, name, trackCount, creatorId, subscribed, trackError = '', options = {}) {
  const explicitTracks = Array.isArray(options.tracks) ? options.tracks : null
  const tracks = explicitTracks || (trackError ? [] : Array.from({ length: trackCount }, (_, index) => ({
    artistEntries: [{
      id: (index % 5) + 1,
      name: `\u827a\u672f\u5bb6 ${((index % 5) + 1)}`,
    }],
    albumId: (index % 9) + 1,
    albumCoverUrl: buildMockCover((index % 9) + 1),
    id: id * 1000 + index + 1,
    position: index + 1,
    name: `${name} ${index + 1}`,
    artists: [`\u827a\u672f\u5bb6 ${((index % 5) + 1)}`],
    album: `\u4e13\u8f91 ${((index % 9) + 1)}`,
    durationMs: 160000 + ((index % 6) * 10000),
  })))

  return {
    id,
    sourcePlaylistId: Number(options.sourcePlaylistId || id),
    name,
    trackCount,
    coverUrl: options.coverUrl || buildMockCover(id),
    specialType: Number(options.specialType || 0),
    subscribed,
    creatorId,
    creatorName: options.creatorName || '',
    description: options.description || '',
    playCount: Number(options.playCount || 0),
    copywriter: options.copywriter || '',
    exploreSourceLabel: options.exploreSourceLabel || '',
    isExplore: Boolean(options.isExplore),
    tracks,
    tracksError: trackError,
    hydrated: options.hydrated !== undefined ? Boolean(options.hydrated) : !options.hydrating,
    hydrating: Boolean(options.hydrating),
  }
}

function seedMockLikedPlaylistOverlap(playlists) {
  const likedPlaylist = (playlists || []).find((playlist) => Number(playlist?.specialType || 0) === 5)
  const ownedPlaylist = (playlists || []).find((playlist) =>
    Number(playlist?.creatorId || 0) === 1
    && Number(playlist?.specialType || 0) !== 5
    && Array.isArray(playlist?.tracks)
    && playlist.tracks.length >= 6
  )

  if (!likedPlaylist || !Array.isArray(likedPlaylist.tracks) || likedPlaylist.tracks.length < 2 || !ownedPlaylist) {
    return playlists
  }

  const existingTrack = ownedPlaylist.tracks[5]
  if (!existingTrack) {
    return playlists
  }

  ownedPlaylist.tracks[5] = {
    ...likedPlaylist.tracks[1],
    position: existingTrack.position,
  }

  return playlists
}

function buildMockArtistSongStore(playlists) {
  const grouped = new Map()

  for (const playlist of playlists || []) {
    for (const track of playlist.tracks || []) {
      const artistEntries = Array.isArray(track.artistEntries) && track.artistEntries.length
        ? track.artistEntries
        : (track.artists || []).map((artist) => ({
          id: 0,
          name: String(artist || '').trim(),
        })).filter((artist) => artist.name)

      for (const artist of artistEntries) {
        const artistId = Number(artist?.id || 0)
        if (artistId <= 0) {
          continue
        }

        if (!grouped.has(artistId)) {
          grouped.set(artistId, new Map())
        }

        const bucket = grouped.get(artistId)
        if (!bucket.has(track.id)) {
          bucket.set(track.id, {
            ...track,
            artistEntries: artistEntries.map((entry) => ({
              id: Number(entry?.id || 0),
              name: String(entry?.name || '').trim(),
            })).filter((entry) => entry.name),
            artists: Array.isArray(track.artists) ? track.artists.slice() : [],
          })
        }
      }
    }
  }

  const store = {
    byId: new Map(),
    byName: new Map(),
  }
  for (const [artistId, trackMap] of grouped.entries()) {
    const artistName = trackMap.values().next().value?.artistEntries?.find((artist) => Number(artist.id || 0) === artistId)?.name
      || `\u827a\u672f\u5bb6 ${artistId}`
    const localTracks = [...trackMap.values()].sort((left, right) => left.id - right.id)
    const fillerCount = Math.max(0, 160 - localTracks.length)
    const fillerTracks = Array.from({ length: fillerCount }, (_, index) => ({
      id: artistId * 1000000 + index + 1,
      position: localTracks.length + index + 1,
      name: `${artistName} \u70ed\u95e8\u5355\u66f2 ${index + 1}`,
      artists: [artistName],
      artistEntries: [{ id: artistId, name: artistName }],
      album: `\u70ed\u95e8\u4e13\u8f91 ${Math.floor(index / 10) + 1}`,
      albumId: artistId * 10000 + index + 1,
      albumCoverUrl: buildMockCover(artistId * 10 + index + 1),
      durationMs: 180000 + ((index % 7) * 8000),
    }))
    store.byId.set(artistId, [...localTracks, ...fillerTracks])
    store.byName.set(normalizeQuery(artistName), artistId)
  }

  return store
}

function buildMockCover(seed) {
  const digit = String(seed).slice(-2)
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
      <rect width="64" height="64" fill="#f5f5f5"/>
      <rect x="6" y="6" width="52" height="52" rx="8" fill="#111111"/>
      <text x="32" y="38" font-size="18" font-family="sans-serif" text-anchor="middle" fill="#ffffff">${digit}</text>
    </svg>
  `)}`
}

function buildMockRecommendations(seed, count = RECOMMENDATION_FETCH_COUNT) {
  return Array.from({ length: count }, (_, index) => ({
    id: seed * 100000 + index + 1,
    position: index + 1,
    name: `\u63a8\u8350 ${index + 1}`,
    artists: [`\u63a8\u8350\u827a\u4eba ${index + 1}`],
    album: `\u63a8\u8350\u4e13\u8f91 ${index + 1}`,
    albumId: seed * 10 + index + 1,
    albumCoverUrl: buildMockCover(seed + index + 1),
    durationMs: 185000 + index * 9000,
  }))
}

function toCountMap(counts) {
  const map = new Map()
  for (const [trackId, count] of Object.entries(counts || {})) {
    const normalizedTrackId = Number(trackId)
    const normalizedCount = Number(count || 0)
    if (normalizedTrackId > 0 && normalizedCount > 0) {
      map.set(normalizedTrackId, normalizedCount)
    }
  }
  return map
}

function hydratePlaybackStats(playback = {}) {
  state.localPlayCounts = toCountMap(playback.localPlayCounts)
  state.cloudPlayCounts = toCountMap(playback.cloudPlayCounts)
  rebuildTrackPlayTiers()
}

function rebuildTrackPlayTiers() {
  const combined = new Map()
  const uniqueTrackIds = new Set()

  for (const playlist of state.playlists) {
    for (const track of playlist.tracks || []) {
      uniqueTrackIds.add(track.id)
    }
  }

  for (const trackId of uniqueTrackIds) {
    const total = Number(state.localPlayCounts.get(trackId) || 0) + Number(state.cloudPlayCounts.get(trackId) || 0)
    if (total > 0) {
      combined.set(trackId, total)
    }
  }

  state.combinedPlayCounts = combined
  state.trackPlayTiers = buildTrackPlayTierMap(combined)
}

function buildTrackPlayTierMap(playCounts) {
  const sorted = [...playCounts.entries()]
    .filter(([, count]) => Number(count || 0) > 0)
    .sort((left, right) => right[1] - left[1] || left[0] - right[0])

  const tierMap = new Map()
  if (!sorted.length) {
    return tierMap
  }

  const goldCount = Math.max(1, Math.ceil(sorted.length * 0.01))
  const starCount = Math.max(goldCount, Math.ceil(sorted.length * 0.1))

  for (let index = 0; index < sorted.length; index += 1) {
    const [trackId] = sorted[index]
    if (index < goldCount) {
      tierMap.set(trackId, 'gold')
    } else if (index < starCount) {
      tierMap.set(trackId, 'star')
    }
  }

  return tierMap
}

function getTrackPlayTier(trackId) {
  return state.trackPlayTiers.get(Number(trackId)) || ''
}

function normalizeUiScale(input) {
  const numeric = Number(input)
  if (!Number.isFinite(numeric)) {
    return UI_SCALE_DEFAULT
  }

  return clamp(
    Math.round(numeric / UI_SCALE_STEP) * UI_SCALE_STEP,
    UI_SCALE_MIN,
    UI_SCALE_MAX
  )
}

function normalizeLikedPlaylistDisplayMode(input) {
  if (input === LIKED_PLAYLIST_DISPLAY_MODE_UNCOLLECTED) {
    return LIKED_PLAYLIST_DISPLAY_MODE_UNCOLLECTED
  }

  if (input === LIKED_PLAYLIST_DISPLAY_MODE_HIDDEN) {
    return LIKED_PLAYLIST_DISPLAY_MODE_HIDDEN
  }

  return LIKED_PLAYLIST_DISPLAY_MODE_ALL
}

function normalizeAudioQualityPreference(input) {
  if (input === AUDIO_QUALITY_LOSSLESS) {
    return AUDIO_QUALITY_LOSSLESS
  }

  if (input === AUDIO_QUALITY_EXHIGH) {
    return AUDIO_QUALITY_EXHIGH
  }

  if (input === AUDIO_QUALITY_STANDARD) {
    return AUDIO_QUALITY_STANDARD
  }

  return AUDIO_QUALITY_BEST
}

function normalizeArtistTrackDisplayLimit(input) {
  const numeric = Number(input)
  if (!Number.isFinite(numeric)) {
    return ARTIST_TRACK_DISPLAY_LIMIT_DEFAULT
  }

  return clamp(
    Math.round(numeric),
    ARTIST_TRACK_DISPLAY_LIMIT_MIN,
    ARTIST_TRACK_DISPLAY_LIMIT_MAX
  )
}

function normalizeCollapsedPlaylistIds(input) {
  if (!Array.isArray(input)) {
    return []
  }

  const seen = new Set()
  const ids = []

  for (const value of input) {
    const normalizedId = Math.trunc(Number(value || 0))
    if (!Number.isSafeInteger(normalizedId) || normalizedId === 0 || seen.has(normalizedId)) {
      continue
    }

    seen.add(normalizedId)
    ids.push(normalizedId)
  }

  return ids.sort((left, right) => left - right)
}

function normalizePlaylistOrderIds(input) {
  if (!Array.isArray(input)) {
    return []
  }

  const seen = new Set()
  const ids = []

  for (const value of input) {
    const normalizedId = Math.trunc(Number(value || 0))
    if (!Number.isSafeInteger(normalizedId) || normalizedId === 0 || seen.has(normalizedId)) {
      continue
    }

    seen.add(normalizedId)
    ids.push(normalizedId)
  }

  return ids
}

function normalizePlaylistOrderByTab(input = {}) {
  return {
    owned: normalizePlaylistOrderIds(input?.owned),
    spotify: normalizePlaylistOrderIds(input?.spotify),
    subscribed: normalizePlaylistOrderIds(input?.subscribed),
    explore: normalizePlaylistOrderIds(input?.explore),
    artists: normalizePlaylistOrderIds(input?.artists),
  }
}

function normalizePlaylistWallLayout(input = {}) {
  const rawColumns = Math.trunc(Number(input?.columns || 0))
  const rawColumnPlaylistIds = Array.isArray(input?.columnPlaylistIds)
    ? input.columnPlaylistIds
    : []
  const normalizedColumnPlaylistIds = rawColumnPlaylistIds
    .map((columnPlaylistIds) => normalizePlaylistOrderIds(columnPlaylistIds))
    .slice(0, WALL_MAX_COLUMNS)
  const columns = clamp(
    rawColumns > 0 ? rawColumns : normalizedColumnPlaylistIds.length,
    0,
    WALL_MAX_COLUMNS
  )

  return {
    columns,
    columnPlaylistIds: Array.from({ length: columns }, (_, index) => normalizedColumnPlaylistIds[index] || []),
  }
}

function normalizePlaylistWallLayoutByTab(input = {}) {
  return {
    owned: normalizePlaylistWallLayout(input?.owned),
    spotify: normalizePlaylistWallLayout(input?.spotify),
    subscribed: normalizePlaylistWallLayout(input?.subscribed),
    explore: normalizePlaylistWallLayout(input?.explore),
    artists: normalizePlaylistWallLayout(input?.artists),
  }
}

function normalizeUiSessionState(input = {}) {
  return {
    playlistOrderByTab: normalizePlaylistOrderByTab(input?.playlistOrderByTab),
    playlistWallLayoutByTab: normalizePlaylistWallLayoutByTab(input?.playlistWallLayoutByTab),
    collapsedPlaylistIds: normalizeCollapsedPlaylistIds(input?.collapsedPlaylistIds),
  }
}

function arraysEqual(left, right) {
  if (left === right) {
    return true
  }

  if (!Array.isArray(left) || !Array.isArray(right) || left.length !== right.length) {
    return false
  }

  return left.every((value, index) => value === right[index])
}

function getAudioQualityRank(quality) {
  switch (normalizeAudioQualityPreference(quality)) {
    case AUDIO_QUALITY_STANDARD:
      return 0
    case AUDIO_QUALITY_EXHIGH:
      return 1
    case AUDIO_QUALITY_LOSSLESS:
      return 2
    default:
      return 3
  }
}

function capAudioQualityPreference(preferredQuality, capQuality) {
  const preferred = normalizeAudioQualityPreference(preferredQuality)
  const cap = normalizeAudioQualityPreference(capQuality)
  return getAudioQualityRank(preferred) <= getAudioQualityRank(cap)
    ? preferred
    : cap
}

function getNavigatorConnection() {
  return window.__mockConnection
    || navigator.connection
    || navigator.mozConnection
    || navigator.webkitConnection
    || null
}

function getNetworkAudioQualityCap() {
  if (navigator.onLine === false) {
    return AUDIO_QUALITY_STANDARD
  }

  const connection = getNavigatorConnection()
  if (!connection) {
    return AUDIO_QUALITY_BEST
  }

  if (connection.saveData) {
    return AUDIO_QUALITY_STANDARD
  }

  const effectiveType = String(connection.effectiveType || '').toLowerCase()
  const downlink = Number(connection.downlink || 0)

  if (effectiveType === 'slow-2g' || effectiveType === '2g') {
    return AUDIO_QUALITY_STANDARD
  }

  if (effectiveType === '3g') {
    return AUDIO_QUALITY_EXHIGH
  }

  if (Number.isFinite(downlink) && downlink > 0) {
    if (downlink < 1) {
      return AUDIO_QUALITY_STANDARD
    }

    if (downlink < 2.5) {
      return AUDIO_QUALITY_EXHIGH
    }
  }

  return AUDIO_QUALITY_BEST
}

function getRequestedAudioQualityPreference(preferredQuality = state.settings.defaultAudioQuality) {
  const normalizedPreferredQuality = normalizeAudioQualityPreference(preferredQuality)
  if (!state.settings.autoAdjustAudioQuality) {
    return normalizedPreferredQuality
  }

  return capAudioQualityPreference(normalizedPreferredQuality, getNetworkAudioQualityCap())
}

function getUiScaleFactor() {
  return normalizeUiScale(state.settings.uiScale) / 100
}

function getPlaylistCollapseId(playlistOrId) {
  if (playlistOrId && typeof playlistOrId === 'object') {
    return Math.trunc(Number(playlistOrId.id || 0))
  }

  return Math.trunc(Number(playlistOrId || 0))
}

function isPlaylistCollapsed(playlistOrId) {
  const playlistId = getPlaylistCollapseId(playlistOrId)
  if (!Number.isSafeInteger(playlistId) || playlistId === 0) {
    return false
  }

  const tab = getPlaylistTab(playlistOrId)
  if (!tab) {
    return false
  }

  return getCollapsedPlaylistIdsForTab(tab).includes(playlistId)
}

function getRenderablePlaylistTracks(playlist) {
  if (isPlaylistCollapsed(playlist)) {
    return []
  }

  return playlist.wallTracks || []
}

function getLayoutMetrics() {
  const scale = getUiScaleFactor()
  return {
    cardWidth: Math.max(144, Math.round(WALL_MIN_CARD_WIDTH * scale)),
    gap: Math.max(4, Math.round(WALL_GAP * scale)),
    rowHeight: Math.max(18, Math.round(WALL_ROW_HEIGHT * scale)),
    headerHeight: Math.max(30, Math.round(PLAYLIST_HEADER_HEIGHT * scale)),
    footerHeight: Math.max(0, Math.round(PLAYLIST_FOOTER_HEIGHT * scale)),
    placeholderHeight: Math.max(24, Math.round(PLAYLIST_PLACEHOLDER_HEIGHT * scale)),
    recommendationHeight: Math.max(90, Math.round(PLAYLIST_RECOMMENDATION_HEIGHT * scale)),
    overscanPx: Math.max(WALL_OVERSCAN_PX, Math.round(WALL_OVERSCAN_PX * scale)),
    albumHoverGap: Math.max(4, Math.round(ALBUM_HOVER_ROW_GAP * scale)),
    albumHoverPadding: Math.max(6, Math.round(ALBUM_HOVER_PADDING * scale)),
    wallPaddingX: Math.max(8, Math.round(10 * scale)),
  }
}

function cacheRefs() {
  refs.loading = document.getElementById('loading')
  refs.loadingStage = document.getElementById('loading-stage')
  refs.progressBar = document.getElementById('progress-bar')
  refs.authScreen = document.getElementById('auth-screen')
  refs.authQrImage = document.getElementById('auth-qr-image')
  refs.authStage = document.getElementById('auth-stage')
  refs.authRefreshBtn = document.getElementById('auth-refresh-btn')
  refs.authSpotifyAutoLoginBtn = document.getElementById('auth-spotify-auto-login-btn')
  refs.app = document.getElementById('app')
  refs.accountLine = document.getElementById('account-line')
  refs.tabOwned = document.getElementById('tab-owned')
  refs.tabSpotify = document.getElementById('tab-spotify')
  refs.tabSubscribed = document.getElementById('tab-subscribed')
  refs.tabExplore = document.getElementById('tab-explore')
  refs.tabArtists = document.getElementById('tab-artists')
  refs.tabOwnedCount = document.getElementById('tab-owned-count')
  refs.tabSpotifyCount = document.getElementById('tab-spotify-count')
  refs.tabSubscribedCount = document.getElementById('tab-subscribed-count')
  refs.tabExploreCount = document.getElementById('tab-explore-count')
  refs.tabArtistsCount = document.getElementById('tab-artists-count')
  refs.searchInput = document.getElementById('search-input')
  refs.searchClearBtn = document.getElementById('search-clear-btn')
  refs.createOwnedPlaylistBtn = document.getElementById('create-owned-playlist-btn')
  refs.themeToggleBtn = document.getElementById('theme-toggle-btn')
  refs.locateCurrentBtn = document.getElementById('locate-current-btn')
  refs.settingsBtn = document.getElementById('settings-btn')
  refs.settingsPanel = document.getElementById('settings-panel')
  refs.settingsCloseBtn = document.getElementById('settings-close-btn')
  refs.settingsBackdrop = document.getElementById('settings-backdrop')
  refs.playlistEditorBackdrop = document.getElementById('playlist-editor-backdrop')
  refs.playlistEditor = document.getElementById('playlist-editor')
  refs.playlistEditorForm = document.getElementById('playlist-editor-form')
  refs.playlistEditorKicker = document.getElementById('playlist-editor-kicker')
  refs.playlistEditorTitle = document.getElementById('playlist-editor-title')
  refs.playlistEditorCloseBtn = document.getElementById('playlist-editor-close-btn')
  refs.playlistEditorName = document.getElementById('playlist-editor-name')
  refs.playlistEditorDescription = document.getElementById('playlist-editor-description')
  refs.playlistEditorCoverInput = document.getElementById('playlist-editor-cover-input')
  refs.playlistEditorCoverPreview = document.getElementById('playlist-editor-cover-preview')
  refs.playlistEditorCoverEmpty = document.getElementById('playlist-editor-cover-empty')
  refs.playlistEditorCoverResetBtn = document.getElementById('playlist-editor-cover-reset-btn')
  refs.playlistEditorDeleteBtn = document.getElementById('playlist-editor-delete-btn')
  refs.playlistEditorCancelBtn = document.getElementById('playlist-editor-cancel-btn')
  refs.playlistEditorSaveBtn = document.getElementById('playlist-editor-save-btn')
  refs.uiScaleRange = document.getElementById('ui-scale-range')
  refs.uiScaleValue = document.getElementById('ui-scale-value')
  refs.playlistRecommendationsToggle = document.getElementById('playlist-recommendations-toggle')
  refs.likedPlaylistDisplayModeSelect = document.getElementById('liked-playlist-display-mode-select')
  refs.defaultAudioQualitySelect = document.getElementById('default-audio-quality-select')
  refs.autoAdjustAudioQualityToggle = document.getElementById('auto-adjust-audio-quality-toggle')
  refs.settingsUpdateHint = document.getElementById('settings-update-hint')
  refs.settingsUpdateStatus = document.getElementById('settings-update-status')
  refs.settingsUpdateCheckBtn = document.getElementById('settings-update-check-btn')
  refs.settingsUpdateInstallBtn = document.getElementById('settings-update-install-btn')
  refs.settingsLogoutBtn = document.getElementById('settings-logout-btn')
  refs.settingsSpotifyAutoLoginBtn = document.getElementById('settings-spotify-auto-login-btn')
  refs.settingsSpotifyRefreshBtn = document.getElementById('settings-spotify-refresh-btn')
  refs.settingsSpotifyClearBtn = document.getElementById('settings-spotify-clear-btn')
  refs.settingsSpotifyStatus = document.getElementById('settings-spotify-status')
  refs.settingsSpotifySyncToNeteaseBtn = document.getElementById('settings-spotify-sync-to-netease-btn')
  refs.settingsSpotifySyncToSpotifyBtn = document.getElementById('settings-spotify-sync-to-spotify-btn')
  refs.contextMenu = document.getElementById('context-menu')
  refs.contextRemoveTrackBtn = document.getElementById('context-remove-track-btn')
  refs.albumHoverPreview = document.getElementById('album-hover-preview')
  refs.albumHoverPreviewImage = document.getElementById('album-hover-preview-image')
  refs.playlistUndoLayer = document.getElementById('playlist-undo-layer')
  refs.wallView = document.getElementById('wall-view')
  refs.wallScroll = document.getElementById('wall-scroll')
  refs.wallColumns = document.getElementById('wall-columns')
  refs.wallEmpty = document.getElementById('wall-empty')
  refs.exploreLoadingIndicator = document.getElementById('explore-loading-indicator')
  refs.exploreLoadingText = document.getElementById('explore-loading-text')
  refs.audio = document.getElementById('audio')
  refs.playerCover = document.getElementById('player-cover')
  refs.playerCoverImage = document.getElementById('player-cover-image')
  refs.playerTitle = document.getElementById('player-title')
  refs.playerMeta = document.getElementById('player-meta')
  refs.playBtn = document.getElementById('play-btn')
  refs.prevBtn = document.getElementById('prev-btn')
  refs.nextBtn = document.getElementById('next-btn')
  refs.shuffleBtn = document.getElementById('shuffle-btn')
  refs.repeatBtn = document.getElementById('repeat-btn')
  refs.progressRange = document.getElementById('progress-range')
  refs.currentTime = document.getElementById('player-time-current')
  refs.totalTime = document.getElementById('player-time-total')
  refs.volumeRange = document.getElementById('volume-range')
  refs.toastWrap = document.getElementById('toast-wrap')
  syncSpotifyImportActionLabels()
}

function syncSpotifyImportActionLabels() {
  if (refs.authSpotifyAutoLoginBtn) {
    refs.authSpotifyAutoLoginBtn.textContent = '登录 Spotify（应用内登录）'
  }

  if (refs.settingsSpotifyAutoLoginBtn) {
    refs.settingsSpotifyAutoLoginBtn.textContent = '登录 Spotify（应用内登录）'
  }
}

function bindEvents() {
  refs.authRefreshBtn.addEventListener('click', () => {
    void startQrLoginFlow()
  })
  refs.authSpotifyAutoLoginBtn.addEventListener('click', () => {
    void handleAuthSpotifyAutoLogin()
  })
  refs.tabOwned.addEventListener('click', () => {
    void setActiveTab('owned')
  })
  refs.tabSpotify.addEventListener('click', () => {
    void setActiveTab('spotify')
  })
  refs.tabSubscribed.addEventListener('click', () => {
    void setActiveTab('subscribed')
  })
  refs.tabExplore.addEventListener('click', () => {
    void setActiveTab('explore')
  })
  refs.tabArtists.addEventListener('click', () => {
    void setActiveTab('artists')
  })
  refs.createOwnedPlaylistBtn.addEventListener('click', () => {
    openPlaylistEditorForCreate()
  })
  refs.themeToggleBtn.addEventListener('click', toggleTheme)
  refs.locateCurrentBtn.addEventListener('click', locateCurrentTrack)
  refs.settingsBtn.addEventListener('click', toggleSettingsPanel)
  refs.settingsBackdrop.addEventListener('click', closeSettingsPanel)
  refs.settingsCloseBtn.addEventListener('click', closeSettingsPanel)
  refs.playlistEditorBackdrop.addEventListener('click', closePlaylistEditor)
  refs.playlistEditorCloseBtn.addEventListener('click', closePlaylistEditor)
  refs.playlistEditorCancelBtn.addEventListener('click', closePlaylistEditor)
  refs.playlistEditorForm.addEventListener('submit', (event) => {
    event.preventDefault()
    void submitPlaylistEditor()
  })
  refs.playlistEditorCoverInput.addEventListener('change', () => {
    void handlePlaylistEditorCoverChange()
  })
  refs.playlistEditorCoverResetBtn.addEventListener('click', resetPlaylistEditorCoverSelection)
  refs.playlistEditorDeleteBtn.addEventListener('click', () => {
    void deleteOwnedPlaylistFromEditor()
  })
  refs.uiScaleRange.addEventListener('input', handleUiScaleInput)
  refs.uiScaleRange.addEventListener('change', handleUiScaleCommit)
  refs.playlistRecommendationsToggle.addEventListener('change', handleSettingsChange)
  refs.likedPlaylistDisplayModeSelect.addEventListener('change', handleSettingsChange)
  refs.defaultAudioQualitySelect.addEventListener('change', handleSettingsChange)
  refs.autoAdjustAudioQualityToggle.addEventListener('change', handleSettingsChange)
  refs.settingsUpdateCheckBtn.addEventListener('click', () => {
    void refreshAppUpdateStatus({ force: true })
  })
  refs.settingsUpdateInstallBtn.addEventListener('click', () => {
    void installLatestAppUpdate()
  })
  refs.settingsLogoutBtn.addEventListener('click', () => {
    void handleLogout()
  })
  refs.settingsSpotifyAutoLoginBtn.addEventListener('click', () => {
    void handleSettingsSpotifyAutoLogin()
  })
  refs.settingsSpotifyRefreshBtn.addEventListener('click', () => {
    void refreshSpotifyImportLibrary()
  })
  refs.settingsSpotifyClearBtn.addEventListener('click', () => {
    void clearSpotifyImportConnection()
  })
  refs.settingsSpotifySyncToNeteaseBtn.addEventListener('click', () => {
    void handleSpotifySyncToNetease()
  })
  refs.settingsSpotifySyncToSpotifyBtn.addEventListener('click', () => {
    void handleNeteaseSyncToSpotify()
  })
  refs.searchClearBtn.addEventListener('mousedown', (event) => {
    event.preventDefault()
  })
  refs.searchClearBtn.addEventListener('click', () => {
    void clearSearch({ focus: true })
  })
  refs.searchInput.addEventListener('input', (event) => {
    if (state.exploreArtistFilterKey) {
      state.exploreArtistFilterKey = ''
    }
    setSearchState(event.target.value)
    scheduleSearchRefresh()
  })
  refs.wallScroll.addEventListener('scroll', () => {
    if (!shouldKeepContextMenuOpenOnScroll()) {
      closeContextMenu()
    }
    hideAlbumHoverPreview()
    handleWallScroll()
  }, { passive: true })
  refs.wallColumns.addEventListener('click', handleWallClick)
  refs.wallColumns.addEventListener('contextmenu', handleWallContextMenu)
  refs.wallColumns.addEventListener('dragstart', handleWallDragStart)
  refs.wallColumns.addEventListener('dragover', handleWallDragOver)
  refs.wallColumns.addEventListener('drop', handleWallDrop)
  refs.wallColumns.addEventListener('dragend', handleWallDragEnd)
  refs.wallColumns.addEventListener('pointerover', handleWallPointerOver)
  refs.wallColumns.addEventListener('pointerout', handleWallPointerOut)
  refs.playlistUndoLayer.addEventListener('click', handlePlaylistUndoLayerClick)
  refs.contextMenu.addEventListener('click', handleContextMenuClick)
  refs.playBtn.addEventListener('click', togglePlayback)
  refs.prevBtn.addEventListener('click', previousTrack)
  refs.nextBtn.addEventListener('click', () => nextTrack({ fromEnded: false }))
  refs.shuffleBtn.addEventListener('click', () => {
    state.shuffle = !state.shuffle
    renderPlayer()
  })
  refs.repeatBtn.addEventListener('click', cycleRepeatMode)
  refs.progressRange.addEventListener('input', () => {
    if (!Number.isFinite(refs.audio.duration) || refs.audio.duration <= 0) return
    refs.currentTime.textContent = formatTime((Number(refs.progressRange.value) / 1000) * refs.audio.duration)
  })
  refs.progressRange.addEventListener('change', () => {
    if (!Number.isFinite(refs.audio.duration) || refs.audio.duration <= 0) return
    refs.audio.currentTime = (Number(refs.progressRange.value) / 1000) * refs.audio.duration
  })
  refs.volumeRange.addEventListener('input', () => {
    refs.audio.volume = Number(refs.volumeRange.value) / 100
  })
  refs.audio.addEventListener('play', () => {
    state.isPlaying = true
    renderPlayer()
  })
  refs.audio.addEventListener('pause', () => {
    state.isPlaying = false
    renderPlayer()
  })
  refs.audio.addEventListener('loadedmetadata', () => {
    updatePreviewState()
    updateProgressUI()
    renderPlayer()
  })
  refs.audio.addEventListener('timeupdate', updateProgressUI)
  refs.audio.addEventListener('ended', () => {
    if (state.repeat === 'one') return playQueueIndex(state.queueIndex)
    nextTrack({ fromEnded: true })
  })
  refs.audio.addEventListener('error', () => {
    state.isResolving = false
    showToast(TEXT.unavailableTrack, 'error')
    renderPlayer()
  })
  window.addEventListener('resize', () => {
    hideAlbumHoverPreview()
    scheduleWallRender()
    renderPlaylistUndoNotice()
  })
  window.addEventListener('online', () => scheduleAudioQualityRefresh(AUDIO_QUALITY_REFRESH_REASON_NETWORK))
  window.addEventListener('offline', () => scheduleAudioQualityRefresh(AUDIO_QUALITY_REFRESH_REASON_NETWORK))
  const connection = getNavigatorConnection()
  if (connection && typeof connection.addEventListener === 'function') {
    connection.addEventListener('change', () => scheduleAudioQualityRefresh(AUDIO_QUALITY_REFRESH_REASON_NETWORK))
  }
  window.addEventListener('blur', closeContextMenu)
  window.addEventListener('blur', hideAlbumHoverPreview)
  window.addEventListener('blur', clearPlaylistDragState)
  window.addEventListener('blur', clearTrackDragState)
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('mousedown', handleDocumentPointerDown, true)
  document.addEventListener('mouseup', scheduleTrackDragStateRecovery, true)
  document.addEventListener('pointerup', scheduleTrackDragStateRecovery, true)
  document.addEventListener('dragend', clearPlaylistDragState, true)
  document.addEventListener('dragend', scheduleTrackDragStateCleanup, true)
  document.addEventListener('drop', scheduleTrackDragStateCleanup)
  document.addEventListener('visibilitychange', handleDocumentVisibilityChange)
  refs.audio.volume = Number(refs.volumeRange.value) / 100
}

function wireBridge() {
  if (appBridge && typeof appBridge.onProgress === 'function') {
    appBridge.onProgress((payload) => {
      refs.loadingStage.textContent = payload?.message || ''
      refs.progressBar.style.width = `${payload?.pct || 0}%`
    })
  }
  if (appBridge && typeof appBridge.onPlaylistPatch === 'function') {
    appBridge.onPlaylistPatch((payload) => mergePlaylistPatch(payload?.playlists || [], { done: Boolean(payload?.done) }))
  }
  if (appBridge && typeof appBridge.onSubscribedPlaylistRemovalFailed === 'function') {
    appBridge.onSubscribedPlaylistRemovalFailed((payload) => handleSubscribedPlaylistRemovalFailed(payload))
  }
}

function setSpotifyImportBusy(busy) {
  state.spotifyImport.busy = Boolean(busy)
  if (refs.authSpotifyAutoLoginBtn) {
    refs.authSpotifyAutoLoginBtn.disabled = Boolean(busy)
  }
  if (refs.settingsSpotifyAutoLoginBtn) {
    refs.settingsSpotifyAutoLoginBtn.disabled = Boolean(busy)
  }
  renderSettings()
}

function setSpotifySyncBusy(busy) {
  state.spotifySync.busy = Boolean(busy)
  renderSettings()
}

async function fetchSpotifyImportState() {
  if (!appBridge || typeof appBridge.getSpotifyImportState !== 'function') {
    state.spotifyImport = {
      ...state.spotifyImport,
      connected: false,
      account: null,
      storageMode: '',
      updatedAt: '',
      busy: false,
    }
    renderSettings()
    return state.spotifyImport
  }

  const result = await appBridge.getSpotifyImportState()
  if (!result?.ok) {
    return state.spotifyImport
  }

  state.spotifyImport = {
    ...state.spotifyImport,
    connected: Boolean(result.connected),
    account: result.account || null,
    storageMode: result.storageMode || '',
    updatedAt: result.updatedAt || '',
    busy: state.spotifyImport.busy,
  }
  renderSettings()
  return state.spotifyImport
}

function formatAppVersion(version) {
  const normalized = String(version || '').trim().replace(/^[vV]/, '')
  return normalized ? `v${normalized}` : '未知版本'
}

function formatAppUpdateDate(value) {
  if (!value) {
    return ''
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return ''
  }

  return parsed.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  })
}

function setAppUpdateBusy(busy, action = '') {
  state.appUpdate.busy = Boolean(busy)
  state.appUpdate.action = busy ? action : ''
  renderSettings()
}

function applyAppUpdateResult(result, errorStage = '') {
  state.appUpdate.checked = true
  state.appUpdate.currentVersion = String(
    result?.currentVersion || state.appUpdate.currentVersion || ''
  ).trim()
  state.appUpdate.latestVersion = String(result?.latestVersion || '').trim()
  state.appUpdate.releaseName = String(result?.releaseName || '').trim()
  state.appUpdate.releaseUrl = String(result?.releaseUrl || '').trim()
  state.appUpdate.publishedAt = String(result?.publishedAt || '').trim()
  state.appUpdate.updateAvailable = Boolean(result?.updateAvailable)
  state.appUpdate.installSupported = Boolean(result?.installSupported)
  state.appUpdate.installMessage = String(result?.installMessage || '').trim()
  state.appUpdate.error = result?.ok ? '' : String(result?.error || '').trim()
  state.appUpdate.errorStage = state.appUpdate.error ? errorStage : ''
  state.appUpdate.busy = false
  state.appUpdate.action = ''
  renderSettings()
}

function getAppUpdateStatusText() {
  if (state.appUpdate.busy && state.appUpdate.action === 'restart') {
    return TEXT.appUpdateRestarting
  }

  if (state.appUpdate.busy && state.appUpdate.action === 'install') {
    const targetVersion = state.appUpdate.latestVersion
      ? ` ${formatAppVersion(state.appUpdate.latestVersion)}`
      : ''
    return `正在下载${targetVersion} 更新包...`
  }

  if (state.appUpdate.busy) {
    return TEXT.appUpdateChecking
  }

  if (state.appUpdate.error) {
    const prefix = state.appUpdate.errorStage === 'install'
      ? TEXT.appUpdateInstallFailed
      : TEXT.appUpdateCheckFailed
    return `${prefix}：${state.appUpdate.error}`
  }

  if (state.appUpdate.updateAvailable) {
    const dateLabel = formatAppUpdateDate(state.appUpdate.publishedAt)
    return dateLabel
      ? `${TEXT.appUpdateAvailable} ${formatAppVersion(state.appUpdate.latestVersion)} · 发布于 ${dateLabel}`
      : `${TEXT.appUpdateAvailable} ${formatAppVersion(state.appUpdate.latestVersion)}`
  }

  if (state.appUpdate.checked) {
    return `${TEXT.appUpdateLatest} · 当前 ${formatAppVersion(state.appUpdate.currentVersion)}`
  }

  return `当前版本 ${formatAppVersion(state.appUpdate.currentVersion)}`
}

function getAppUpdateHintText() {
  if (state.appUpdate.busy && state.appUpdate.action === 'restart') {
    return '更新包已经准备好，正在关闭当前应用并启动新版。'
  }

  if (state.appUpdate.busy && state.appUpdate.action === 'install') {
    return '更新包下载完成后，会自动关闭应用、替换当前目录并重新打开。'
  }

  if (state.appUpdate.busy) {
    return '正在访问 GitHub Releases 检查最新发布。'
  }

  if (state.appUpdate.updateAvailable && state.appUpdate.installMessage) {
    return state.appUpdate.installMessage
  }

  if (state.appUpdate.updateAvailable) {
    return '一键更新会覆盖当前便携版目录，登录状态和偏好设置仍保存在 Electron 的 userData 目录。'
  }

  if (state.appUpdate.installMessage) {
    return state.appUpdate.installMessage
  }

  if (state.appUpdate.error) {
    return '这不会影响当前使用，可以稍后重试。'
  }

  return '启动后会自动检查 GitHub Releases；发现新版本后，可以直接一键下载并重启更新。'
}

async function refreshAppUpdateStatus({ force = false, silent = false } = {}) {
  if (state.appUpdate.busy) {
    return false
  }

  if (!appBridge || typeof appBridge.checkAppUpdate !== 'function') {
    applyAppUpdateResult({
      ok: false,
      error: '当前环境不支持更新检查。',
      currentVersion: state.appUpdate.currentVersion,
      latestVersion: '',
      releaseName: '',
      releaseUrl: '',
      publishedAt: '',
      updateAvailable: false,
      installSupported: false,
      installMessage: '',
    }, 'check')
    if (!silent) {
      showToast('当前环境不支持更新检查。', 'error')
    }
    return false
  }

  setAppUpdateBusy(true, 'check')

  let result = null
  try {
    result = await appBridge.checkAppUpdate({ force })
  } catch (error) {
    result = {
      ok: false,
      error: error?.message || String(error),
      currentVersion: state.appUpdate.currentVersion,
      latestVersion: '',
      releaseName: '',
      releaseUrl: '',
      publishedAt: '',
      updateAvailable: false,
      installSupported: false,
      installMessage: '',
    }
  }

  applyAppUpdateResult(result, 'check')

  if (!silent) {
    if (!result?.ok) {
      showToast(result?.error || TEXT.appUpdateCheckFailed, 'error')
    } else if (result.updateAvailable) {
      showToast(`${TEXT.appUpdateAvailable} ${formatAppVersion(result.latestVersion)}`)
    } else {
      showToast(`${TEXT.appUpdateLatest}（${formatAppVersion(result.currentVersion)}）`)
    }
  }

  return Boolean(result?.ok)
}

async function installLatestAppUpdate() {
  if (state.appUpdate.busy) {
    return false
  }

  if (!state.appUpdate.updateAvailable) {
    const checked = await refreshAppUpdateStatus({ force: true, silent: true })
    if (!checked || !state.appUpdate.updateAvailable) {
      showToast(TEXT.appUpdateLatest)
      return false
    }
  }

  if (!appBridge || typeof appBridge.installAppUpdate !== 'function') {
    showToast(TEXT.appUpdateInstallFailed, 'error')
    return false
  }

  setAppUpdateBusy(true, 'install')

  let result = null
  try {
    result = await appBridge.installAppUpdate()
  } catch (error) {
    result = {
      ok: false,
      error: error?.message || String(error),
    }
  }

  if (!result?.ok) {
    state.appUpdate.busy = false
    state.appUpdate.action = ''
    state.appUpdate.error = String(result?.error || TEXT.appUpdateInstallFailed)
    state.appUpdate.errorStage = 'install'
    renderSettings()
    showToast(state.appUpdate.error, 'error')
    return false
  }

  state.appUpdate.busy = true
  state.appUpdate.action = 'restart'
  renderSettings()
  showToast(TEXT.appUpdateRestarting)
  return true
}

function replaceImportedPlatformPlaylists(sourcePlatform, playlists) {
  const normalizedSourcePlatform = String(sourcePlatform || '').trim()
  const nextImportedPlaylists = (playlists || []).map(normalizePlaylist)
  if (normalizedSourcePlatform === 'spotify') {
    setSpotifyPlaylists(sortWallPlaylists(nextImportedPlaylists))
  } else {
    const nextPlaylists = [
      ...state.playlists.filter((playlist) => getPlaylistSourcePlatform(playlist) !== normalizedSourcePlatform),
      ...nextImportedPlaylists,
    ]
    setPlaylists(sortWallPlaylists(nextPlaylists))
  }

  if (
    state.activeTab === 'owned'
    && !getOwnedPlaylists().length
    && !getSubscribedPlaylists().length
    && getSpotifyPlaylists().length
  ) {
    state.activeTab = 'spotify'
  } else if (state.activeTab === 'owned' && !getOwnedPlaylists().length && getSubscribedPlaylists().length) {
    state.activeTab = 'subscribed'
  }
  if (!(state.queuePlaylistId === null && state.currentTrackId === null)) {
    syncQueueWithPlaylists()
  }
  renderTabs()
  renderHeader()
  renderPlayer()
  applyFilters({ syncAll: true })
}

async function applySpotifyImportResult(result, { replaceApp = false } = {}) {
  if (!result?.ok) {
    return false
  }

  if (replaceApp) {
    resetAppState()
    state.neteaseAuthenticated = false
  }

  await fetchSpotifyImportState()

  if (!state.account || !state.neteaseAuthenticated) {
    state.account = result.account || {
      userId: 0,
      nickname: 'Spotify 导入',
      avatarUrl: '',
      sourcePlatform: 'spotify',
      spotifyUserId: '',
    }
  }

  replaceImportedPlatformPlaylists('spotify', result.playlists || [])

  if (refs.app.classList.contains('hidden')) {
    await revealApp()
  }

  if (result.storageMode === 'plain-text-fallback') {
    showToast(TEXT.spotifyImportPlaintextWarning, 'error')
  }

  return true
}

async function startSpotifyImportLogin({ replaceApp = false, silent = false } = {}) {
  if (!appBridge || typeof appBridge.startSpotifyImportLogin !== 'function') {
    showToast(TEXT.spotifyImportConnectFailed, 'error')
    return false
  }

  setSpotifyImportBusy(true)
  if (!silent) {
    showToast(TEXT.spotifyImportLoginWindowOpened)
  }

  const result = await appBridge.startSpotifyImportLogin()
  setSpotifyImportBusy(false)

  if (!result?.ok) {
    if (result?.cancelled) {
      return false
    }

    if (replaceApp) {
      showAuthScreen(`${TEXT.spotifyImportConnectFailed}${result?.error || TEXT.initFailed}`)
    }
    showToast(`${TEXT.spotifyImportConnectFailed}${result?.error || TEXT.initFailed}`, 'error')
    return false
  }

  const applied = await applySpotifyImportResult(result, { replaceApp })
  if (applied && !silent) {
    showToast(TEXT.spotifyImportConnected)
  }

  return applied
}

async function refreshSpotifyImportLibrary({ replaceApp = false, silent = false } = {}) {
  const spotifyImportState = await fetchSpotifyImportState()
  if (!spotifyImportState.connected) {
    return false
  }

  if (!appBridge || typeof appBridge.refreshSpotifyImport !== 'function') {
    return false
  }

  setSpotifyImportBusy(true)
  if (replaceApp) {
    showLoadingScreen(TEXT.spotifyImportLoading)
  }

  const result = await appBridge.refreshSpotifyImport()
  setSpotifyImportBusy(false)

  if (!result?.ok) {
    if (!silent) {
      showToast(`${TEXT.spotifyImportConnectFailed}${result?.error || TEXT.initFailed}`, 'error')
    }
    return false
  }

  const applied = await applySpotifyImportResult(result, { replaceApp })
  if (applied && !silent) {
    showToast(TEXT.spotifyImportConnected)
  }

  return applied
}

async function clearSpotifyImportConnection({ silent = false } = {}) {
  if (!appBridge || typeof appBridge.clearSpotifyImport !== 'function') {
    return
  }

  setSpotifyImportBusy(true)
  const result = await appBridge.clearSpotifyImport()
  setSpotifyImportBusy(false)

  if (!result?.ok) {
    showToast(result?.error || TEXT.spotifyImportConnectFailed, 'error')
    return
  }

  state.spotifyImport = {
    ...state.spotifyImport,
    connected: false,
    account: null,
    storageMode: '',
    updatedAt: '',
    busy: false,
  }

  setSpotifyPlaylists([])
  if (state.activeTab === 'spotify') {
    state.activeTab = getOwnedPlaylists().length
      ? 'owned'
      : getSubscribedPlaylists().length
        ? 'subscribed'
        : 'owned'
  }
  if (!(state.queuePlaylistId === null && state.currentTrackId === null)) {
    syncQueueWithPlaylists()
  }
  renderTabs()
  renderHeader()
  renderPlayer()
  applyFilters({ syncAll: true })
  renderSettings()

  if (!state.neteaseAuthenticated && !state.playlists.length && !state.spotifyPlaylists.length) {
    resetAppState()
    showAuthScreen()
    await startQrLoginFlow()
    return
  }

  if (!silent) {
    showToast(TEXT.spotifyImportCleared)
  }
}

async function handleAuthSpotifyAutoLogin() {
  await startSpotifyImportLogin({
    replaceApp: true,
  })
}

async function handleSettingsSpotifyAutoLogin() {
  await startSpotifyImportLogin()
}

function applySyncedNeteasePlaylists(playlists) {
  let nextPlaylists = state.playlists.slice()

  for (const playlist of (playlists || []).map(normalizePlaylist)) {
    nextPlaylists = upsertPlaylistIntoLibrary(nextPlaylists, playlist)
  }

  setPlaylists(sortWallPlaylists(nextPlaylists))
  if (!(state.queuePlaylistId === null && state.currentTrackId === null)) {
    syncQueueWithPlaylists()
  }
  renderTabs()
  renderHeader()
  renderPlayer()
  applyFilters({ syncAll: true })
}

async function handleSpotifySyncToNetease() {
  if (!canUseNeteaseFeatures() || !appBridge || typeof appBridge.syncSpotifyLibraryToNetease !== 'function') {
    showToast(TEXT.exploreRequiresNetease, 'error')
    return
  }

  setSpotifySyncBusy(true)
  let result = null

  try {
    result = await appBridge.syncSpotifyLibraryToNetease(state.spotifyPlaylists)
  } finally {
    setSpotifySyncBusy(false)
  }

  if (!result?.ok) {
    showToast(result?.error || TEXT.spotifySyncFailed, 'error')
    return
  }

  applySyncedNeteasePlaylists(result.playlists || [])
  const summary = result.summary || {}
  const summaryText = [
    summary.createdCount ? `新建 ${summary.createdCount} 张` : '',
    summary.addedTrackCount ? `新增 ${summary.addedTrackCount} 首` : '',
    summary.unresolvedTrackCount ? `未匹配 ${summary.unresolvedTrackCount} 首` : '',
  ].filter(Boolean).join('，')
  showToast(summaryText ? `${TEXT.spotifySyncToNeteaseDone} · ${summaryText}` : TEXT.spotifySyncToNeteaseDone)
}

async function handleNeteaseSyncToSpotify() {
  if (!canUseNeteaseFeatures() || !appBridge || typeof appBridge.syncNeteaseLibraryToSpotify !== 'function') {
    showToast(TEXT.exploreRequiresNetease, 'error')
    return
  }

  setSpotifySyncBusy(true)
  let result = null

  try {
    result = await appBridge.syncNeteaseLibraryToSpotify(state.playlists)
  } finally {
    setSpotifySyncBusy(false)
  }

  if (!result?.ok) {
    showToast(result?.error || TEXT.spotifySyncFailed, 'error')
    return
  }

  await refreshSpotifyImportLibrary({ silent: true })
  const summary = result.summary || {}
  const summaryText = [
    summary.createdCount ? `新建 ${summary.createdCount} 张` : '',
    summary.addedTrackCount ? `新增 ${summary.addedTrackCount} 首` : '',
    summary.unresolvedTrackCount ? `未匹配 ${summary.unresolvedTrackCount} 首` : '',
  ].filter(Boolean).join('，')
  showToast(summaryText ? `${TEXT.spotifySyncToSpotifyDone} · ${summaryText}` : TEXT.spotifySyncToSpotifyDone)
}

async function init() {
  showLoadingScreen()
  const result = await appBridge.init()
  if (!result.ok) {
    refs.loadingStage.textContent = `${TEXT.loadingFailed}${result.error}`
    refs.progressBar.style.background = '#111111'
    showToast(result.error || TEXT.initFailed, 'error')
    return
  }

  if (result.needsLogin) {
    resetAppState()
    state.neteaseAuthenticated = false
    const restoredSpotify = await refreshSpotifyImportLibrary({ replaceApp: true, silent: true })
    if (restoredSpotify) {
      return
    }
    showAuthScreen()
    await startQrLoginFlow()
    return
  }

  state.neteaseAuthenticated = true
  state.account = result.account || null
  hydratePlaybackStats(result.playback)
  setPlaylists(sortWallPlaylists((result.playlists || []).map(normalizePlaylist)))
  await revealApp()
  renderTabs()
  renderHeader()
  renderPlayer()
  applyFilters()
  silentlyPreloadExplorePlaylists()

  if (result.sessionStorageMode === 'plain-text-fallback') {
    showToast(TEXT.plaintextSessionWarning, 'error')
  }

  if (!state.playlists.length) {
    showToast(TEXT.noPlaylists, 'error')
  }

  await refreshSpotifyImportLibrary({ silent: true })
}

function renderExploreLoadingState() {
  if (state.activeTab !== 'explore') {
    return
  }

  renderEmptyState(getSourcePlaylists())
  scheduleWallRenderWithOptions({ immediate: true, syncAll: true })
}

function silentlyPreloadExplorePlaylists() {
  if (!canUseNeteaseFeatures()) {
    return
  }

  if (state.activeTab === 'explore') {
    return
  }

  const normalizedQuery = normalizeQuery(state.search)
  const requestKey = buildExploreRequestKey(normalizedQuery)
  if (normalizedQuery) {
    return
  }

  if (
    state.exploreLoaded
    && state.exploreQuery === normalizedQuery
    && !state.exploreArtistSearchRef
    && !state.exploreError
  ) {
    return
  }

  if (state.exploreLoading && renderRuntime.exploreRequestKey === requestKey) {
    return
  }

  void loadExplorePlaylists(normalizedQuery)
}

function silentlyPreloadArtistPlaylists() {
  if (!canUseNeteaseFeatures()) {
    return
  }

  if (!appBridge || typeof appBridge.getArtistSongs !== 'function') {
    return
  }

  for (const playlist of state.artistPlaylists) {
    queueArtistPlaylistHydration(playlist.id, { includeCollapsed: true })
  }
}

function buildExploreArtistSearchRef(artistRef = '', artistName = '', seedTrackId = 0) {
  const normalizedArtistId = Number(artistRef || 0)
  const normalizedSeedTrackId = Number(seedTrackId || 0)
  const refParts = []
  if (normalizedSeedTrackId > 0) {
    refParts.push(`track:${normalizedSeedTrackId}`)
  }
  if (normalizedArtistId > 0) {
    refParts.push(`id:${normalizedArtistId}`)
  }

  const normalizedArtistName = normalizeQuery(artistName || artistRef || '')
  if (normalizedArtistName) {
    refParts.push(`name:${normalizedArtistName}`)
  }

  return refParts.join('|')
}

function buildExploreRequestKey(query = '', artistRef = '', artistName = '', seedTrackId = 0) {
  return `${normalizeQuery(query)}::${buildExploreArtistSearchRef(artistRef, artistName, seedTrackId)}`
}

async function loadExplorePlaylists(query = '', {
  force = false,
  limit = 0,
  artistRef = '',
  artistName = '',
  seedTrackId = 0,
} = {}) {
  const normalizedQuery = normalizeQuery(query)
  const artistSearchRef = buildExploreArtistSearchRef(artistRef, artistName, seedTrackId)
  const requestKey = buildExploreRequestKey(query, artistRef, artistName, seedTrackId)
  if (
    !force
    && state.exploreLoaded
    && state.exploreQuery === normalizedQuery
    && state.exploreArtistSearchRef === artistSearchRef
    && !state.exploreError
  ) {
    if (state.activeTab === 'explore') {
      applyFilters()
    }
    return
  }

  if (
    !force
    && state.exploreLoading
    && renderRuntime.exploreRequestKey === requestKey
    && renderRuntime.exploreRequestPromise
  ) {
    renderExploreLoadingState()
    await renderRuntime.exploreRequestPromise
    return
  }

  const requestToken = ++renderRuntime.exploreRequestToken
  state.exploreLoading = true
  state.exploreError = ''
  renderRuntime.exploreRequestKey = requestKey

  renderExploreLoadingState()

  const requestPromise = (async () => {
    let result
    try {
      const requestOptions = { query }
      const requestArtistRef = Number(artistRef || 0) > 0
        ? Number(artistRef || 0)
        : String(artistRef || artistName || query || '').trim()
      const numericLimit = Number(limit)
      if (Number.isFinite(numericLimit) && numericLimit > 0) {
        requestOptions.limit = Math.max(1, Math.round(numericLimit))
      }
      if (artistSearchRef && requestArtistRef) {
        requestOptions.artistRef = requestArtistRef
        requestOptions.artistName = String(artistName || query || '').trim()
      }
      if (Number(seedTrackId || 0) > 0) {
        requestOptions.seedTrackId = Number(seedTrackId || 0)
      }
      result = await appBridge.getExplorePlaylists(requestOptions)
    } catch (error) {
      result = {
        ok: false,
        error: error?.message || String(error),
        playlists: [],
      }
    }

    if (requestToken !== renderRuntime.exploreRequestToken) {
      return
    }

    state.exploreLoading = false
    if (!result?.ok) {
      state.exploreError = result?.error || TEXT.exploreFailed
      setExplorePlaylists([], query, { artistSearchRef })
      renderTabs()
      if (state.activeTab === 'explore') {
        showToast(state.exploreError, 'error')
        applyFilters({ syncAll: true })
      }
      return
    }

    state.exploreError = ''
    setExplorePlaylists((result.playlists || []).map(normalizePlaylist), query, { artistSearchRef })
    renderTabs()

    if (state.activeTab === 'explore') {
      applyFilters({ syncAll: true })
    }
  })()

  renderRuntime.exploreRequestPromise = requestPromise

  try {
    await requestPromise
  } finally {
    if (requestToken === renderRuntime.exploreRequestToken) {
      renderRuntime.exploreRequestKey = ''
      renderRuntime.exploreRequestPromise = null
    }
  }
}

async function revealApp() {
  stopAuthPolling()
  refs.authScreen.classList.add('hidden')
  refs.loading.classList.add('hidden')
  refs.app.classList.remove('hidden')
  await new Promise((resolve) => window.requestAnimationFrame(() => window.requestAnimationFrame(resolve)))
}

function showLoadingScreen(message = TEXT.loadingDefault) {
  refs.loading.classList.remove('hidden')
  refs.authScreen.classList.add('hidden')
  refs.app.classList.add('hidden')
  refs.loadingStage.textContent = message
  refs.progressBar.style.width = '0%'
  refs.progressBar.style.background = '#111111'
}

function showAuthScreen(message = TEXT.authLoadingQr) {
  refs.loading.classList.add('hidden')
  refs.app.classList.add('hidden')
  refs.authScreen.classList.remove('hidden')
  refs.authStage.textContent = message
}

function stopAuthPolling() {
  window.clearTimeout(renderRuntime.authPollTimer)
  renderRuntime.authPollTimer = 0
}

async function startQrLoginFlow() {
  stopAuthPolling()
  renderRuntime.authLoginKey = ''
  refs.authRefreshBtn.disabled = true
  refs.authStage.textContent = TEXT.authLoadingQr

  const result = await appBridge.startQrLogin()
  refs.authRefreshBtn.disabled = false

  if (!result.ok) {
    refs.authStage.textContent = `${TEXT.authFailed}${result.error || TEXT.initFailed}`
    showToast(result.error || TEXT.initFailed, 'error')
    return
  }

  renderRuntime.authLoginKey = result.key || ''
  if (result.qrImage) {
    refs.authQrImage.src = result.qrImage
  }
  refs.authStage.textContent = TEXT.authWaiting
  scheduleQrLoginCheck()
}

function scheduleQrLoginCheck() {
  stopAuthPolling()
  renderRuntime.authPollTimer = window.setTimeout(() => {
    void checkQrLoginStatus()
  }, QR_LOGIN_POLL_MS)
}

async function checkQrLoginStatus() {
  if (!renderRuntime.authLoginKey) {
    return
  }

  const result = await appBridge.checkQrLogin(renderRuntime.authLoginKey)
  if (!result.ok) {
    refs.authStage.textContent = `${TEXT.authFailed}${result.error || TEXT.initFailed}`
    showToast(result.error || TEXT.initFailed, 'error')
    return
  }

  if (result.status === 'waiting') {
    refs.authStage.textContent = result.message || TEXT.authWaiting
    scheduleQrLoginCheck()
    return
  }

  if (result.status === 'confirm') {
    refs.authStage.textContent = result.message || TEXT.authConfirm
    scheduleQrLoginCheck()
    return
  }

  if (result.status === 'expired') {
    refs.authStage.textContent = result.message || TEXT.authExpired
    return
  }

  if (result.status === 'authorized') {
    refs.authStage.textContent = result.message || TEXT.authLoggedIn
    showLoadingScreen(TEXT.authLoggedIn)
    showToast(TEXT.loginSuccess)
    await init()
  }
}

function resetAppState() {
  stopAuthPolling()
  closeContextMenu()
  hideAlbumHoverPreview()
  closePlaylistEditor()
  dismissPlaylistUndoNotice()
  cancelWallRenderWork()
  state.account = null
  state.playlists = []
  state.spotifyPlaylists = []
  state.explorePlaylists = []
  state.artistPlaylists = []
  state.playlistMap = new Map()
  state.recommendations = new Map()
  state.activeTab = 'owned'
  state.visiblePlaylists = []
  setSearchState('')
  state.exploreLoaded = false
  state.exploreLoading = false
  state.exploreQuery = ''
  state.exploreArtistSearchRef = ''
  state.exploreArtistFilterKey = ''
  state.exploreError = ''
  state.queue = []
  state.queueMode = ''
  state.queuePlaylistId = null
  state.queueContextLabel = ''
  state.queueIndex = -1
  state.currentTrackId = null
  state.isPlaying = false
  state.isResolving = false
  state.isPreview = false
  state.localPlayCounts = new Map()
  state.cloudPlayCounts = new Map()
  state.combinedPlayCounts = new Map()
  state.trackPlayTiers = new Map()
  state.artistPlaylistSets = new Map()
  state.artistPlaylistEntriesByKey = new Map()
  state.artistPlaylistIdByKey = new Map()
  state.artistRemoteTracksByKey = new Map()
  state.totalOwnedPlaylistCount = 0
  renderRuntime.expandedArtistTrackKeys = new Set()
  renderRuntime.artistHydrationSessionId += 1
  renderRuntime.artistHydrationQueue = []
  renderRuntime.artistHydrationInFlight = 0
  renderRuntime.artistHydrationRerenderPending = false
  renderRuntime.wallColumns = []
  renderRuntime.wallNodeMaps = []
  renderRuntime.wallPlacementsByColumn = []
  renderRuntime.wallTrackAnchors = new Map()
  renderRuntime.wallRenderedKeys = []
  renderRuntime.renderedPlaylistIds = new Set()
  renderRuntime.renderedTrackKey = ''
  renderRuntime.renderedRecommendationKey = ''
  renderRuntime.renderedPlaylistId = null
  renderRuntime.trackRangeAnchorKey = ''
  renderRuntime.exploreRequestToken = 0
  renderRuntime.exploreRequestKey = ''
  renderRuntime.exploreRequestPromise = null
  renderRuntime.subscribingPlaylistIds = new Set()
  renderRuntime.playlistRemovalPendingIds = new Set()
  renderRuntime.playlistUndoNotice = null
  renderRuntime.playlistDragState = null
  renderRuntime.playlistDragSourceCard = null
  renderRuntime.playlistDragIndicator = null
  renderRuntime.playlistEditorState = null
  refs.playlistEditorForm.reset()
  refs.playlistEditorBackdrop.classList.add('hidden')
  refs.playlistEditor.classList.add('hidden')
  refs.playlistUndoLayer.replaceChildren()
  refs.wallColumns.replaceChildren()
  refs.wallEmpty.classList.add('hidden')
  refs.audio.pause()
  refs.audio.removeAttribute('src')
  refs.audio.load()
  state.currentPlaybackRequestedQuality = ''
  state.currentPlaybackResolvedLevel = ''
  state.spotifySync.busy = false
  renderPlayer()
}

async function handleLogout() {
  closeSettingsPanel()
  const result = await appBridge.logout()

  if (!result.ok) {
    showToast(result.error || TEXT.logoutFailed, 'error')
    return
  }

  resetAppState()
  state.neteaseAuthenticated = false
  showToast(TEXT.logoutDone)
  const restoredSpotify = await refreshSpotifyImportLibrary({ replaceApp: true, silent: true })
  if (restoredSpotify) {
    return
  }
  showAuthScreen()
  await startQrLoginFlow()
}

function buildPlaylistProfile(playlistName, tracks) {
  const artistCounts = {}
  const albumCounts = {}

  for (const track of tracks) {
    for (const artistKey of getTrackArtistKeys(track)) {
      artistCounts[artistKey] = Number(artistCounts[artistKey] || 0) + 1
    }

    const albumKey = getAlbumKey(track)
    if (albumKey) {
      albumCounts[albumKey] = Number(albumCounts[albumKey] || 0) + 1
    }
  }

  return {
    artistCounts,
    albumCounts,
    searchText: normalizeQuery(playlistName || ''),
  }
}

function buildArtistKey(artistId, artistName) {
  const normalizedArtistId = Number(artistId || 0)
  if (normalizedArtistId > 0) {
    return `id:${normalizedArtistId}`
  }

  const normalizedArtistName = normalizeQuery(artistName)
  return normalizedArtistName ? `name:${normalizedArtistName}` : ''
}

function getTrackArtistEntries(track) {
  const seen = new Set()
  const rawEntries = Array.isArray(track?.artistEntries) && track.artistEntries.length
    ? track.artistEntries
    : (track?.artists || []).map((artist) => ({
      id: 0,
      name: typeof artist === 'string' ? artist : artist?.name,
    }))

  return rawEntries.flatMap((artist) => {
    const name = String(artist?.name || artist || '').trim()
    const id = Number(artist?.id || artist?.artistId || 0)
    const key = buildArtistKey(id, name)
    if (!key || seen.has(key)) {
      return []
    }

    seen.add(key)
    return [{ key, id, name }]
  })
}

function getTrackArtistKeys(track) {
  return getTrackArtistEntries(track).map((artist) => artist.key)
}

function playlistContainsArtistKey(playlist, artistKey = '') {
  const normalizedArtistKey = String(artistKey || '').trim()
  if (!normalizedArtistKey) {
    return true
  }

  return (playlist?.tracks || []).some((track) => getTrackArtistKeys(track).includes(normalizedArtistKey))
}

function getAlbumKey(track) {
  const albumId = Number(track?.albumId || 0)
  if (albumId > 0) {
    return `id:${albumId}`
  }

  const albumName = normalizeQuery(track?.album || '')
  return albumName ? `name:${albumName}` : ''
}

function rebuildArtistIndex() {
  const sets = new Map()
  const owned = getOwnedPlaylists()
  state.totalOwnedPlaylistCount = owned.length

  for (const playlist of owned) {
    const seen = new Set()
    for (const track of playlist.tracks) {
      for (const artistKey of getTrackArtistKeys(track)) {
        if (seen.has(artistKey)) continue
        seen.add(artistKey)
        let s = sets.get(artistKey)
        if (!s) {
          s = new Set()
          sets.set(artistKey, s)
        }
        s.add(playlist.id)
      }
    }
  }

  state.artistPlaylistSets = sets
}

function hashArtistKey(artistKey) {
  let hash = 2166136261

  for (let index = 0; index < artistKey.length; index += 1) {
    hash ^= artistKey.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }

  return hash >>> 0
}

function buildArtistPlaylistId(artistKey) {
  return -(ARTIST_PLAYLIST_ID_OFFSET + hashArtistKey(artistKey))
}

function compareArtistPlaylists(left, right) {
  return Number(right.artistImportance || 0) - Number(left.artistImportance || 0)
    || Number(right.artistPlayScore || 0) - Number(left.artistPlayScore || 0)
    || Number(right.artistLikedTrackCount || 0) - Number(left.artistLikedTrackCount || 0)
    || Number(right.artistOwnedTrackCount || 0) - Number(left.artistOwnedTrackCount || 0)
    || Number(right.artistSourcePlaylistCount || 0) - Number(left.artistSourcePlaylistCount || 0)
    || Number(right.artistOccurrenceCount || 0) - Number(left.artistOccurrenceCount || 0)
    || String(left.name || '').localeCompare(String(right.name || ''), 'zh-CN')
    || left.id - right.id
}

function computeTrackCareScore(track) {
  const playCount = Number(track?._artistPlayCount || 0)
  const likedBoost = Number(track?._artistLikedPlaylistCount || 0) * 260
  const ownedBoost = Number(track?._artistOwnedPlaylistCount || 0) * 90
  const subscribedBoost = Number(track?._artistSubscribedPlaylistCount || 0) * 11
  const spreadBoost = Number(track?._artistSourcePlaylistIds?.size || 0) * 18
  const occurrenceBoost = Number(track?._artistOccurrenceCount || 0) * 12
  const playScore = (Math.sqrt(playCount) * 110) + (Math.log2(playCount + 1) * 60)

  return playScore + likedBoost + ownedBoost + subscribedBoost + spreadBoost + occurrenceBoost
}

function computeArtistImportance(entry, tracks) {
  const likedTrackCount = tracks.filter((track) => Number(track?._artistLikedPlaylistCount || 0) > 0).length
  const ownedTrackCount = tracks.filter((track) => Number(track?._artistOwnedPlaylistCount || 0) > 0).length
  const subscribedTrackCount = tracks.filter((track) => Number(track?._artistSubscribedPlaylistCount || 0) > 0).length
  const playScore = tracks.reduce((sum, track) => sum + Number(track?._artistCareScore || 0), 0)
  const totalPlayCount = tracks.reduce((sum, track) => sum + Number(track?._artistPlayCount || 0), 0)
  const topTrackPlayCount = tracks.reduce((max, track) => Math.max(max, Number(track?._artistPlayCount || 0)), 0)
  const ownedPlaylistCount = Number(entry?.ownedPlaylistIds?.size || 0)
  const subscribedPlaylistCount = Number(entry?.subscribedPlaylistIds?.size || 0)
  const cappedSubscribedPlaylistCount = Math.min(subscribedPlaylistCount, 50)
  const sourcePlaylistCount = Number(entry?.sourcePlaylistIds?.size || 0)
  const occurrenceCount = Number(entry?.occurrenceCount || 0)
  const trackCount = tracks.length

  const importance = playScore
    + (likedTrackCount * 280)
    + (ownedTrackCount * 96)
    + (subscribedTrackCount * 18)
    + (ownedPlaylistCount * 60)
    + (cappedSubscribedPlaylistCount * 5)
    + (sourcePlaylistCount * 18)
    + (trackCount * 24)
    + (occurrenceCount * 12)
    + (topTrackPlayCount * 8)

  return {
    importance,
    likedTrackCount,
    ownedTrackCount,
    playScore,
    sourcePlaylistCount,
    subscribedTrackCount,
    totalPlayCount,
    topTrackPlayCount,
  }
}

function compareArtistTracks(left, right) {
  return Number(right._artistCareScore || 0) - Number(left._artistCareScore || 0)
    || Number(right._artistPlayCount || 0) - Number(left._artistPlayCount || 0)
    || Number(right._artistLikedPlaylistCount || 0) - Number(left._artistLikedPlaylistCount || 0)
    || Number(right._artistOwnedPlaylistCount || 0) - Number(left._artistOwnedPlaylistCount || 0)
    || Number(right._artistSourcePlaylistIds?.size || 0) - Number(left._artistSourcePlaylistIds?.size || 0)
    || Number(right._artistOccurrenceCount || 0) - Number(left._artistOccurrenceCount || 0)
    || Number(left._artistFirstSeenOrder || 0) - Number(right._artistFirstSeenOrder || 0)
    || Number(left.position || 0) - Number(right.position || 0)
    || Number(left.id || 0) - Number(right.id || 0)
}

function isArtistPlaylistExpanded(artistKey) {
  return Boolean(artistKey && renderRuntime.expandedArtistTrackKeys.has(String(artistKey)))
}

function toArtistTrackOutput(track, position = 0) {
  const artistEntries = normalizeTrackArtistEntries(track?.artistEntries, track?.artists || [])
  return {
    id: Number(track?.id || 0),
    position: Number(position || track?.position || 0),
    name: track?.name || '\u672a\u547d\u540d',
    artists: artistEntries.map((artist) => artist.name),
    artistEntries,
    album: track?.album || '',
    albumId: Number(track?.albumId || 0),
    albumCoverUrl: track?.albumCoverUrl || '',
    durationMs: Number(track?.durationMs || 0),
  }
}

function getArtistTrackStats(entry) {
  return [...entry.trackMap.values()]
    .map((track) => ({
      ...track,
      _artistLikedPlaylistCount: Number(track._artistLikedPlaylistIds?.size || 0),
      _artistOwnedPlaylistCount: Number(track._artistOwnedPlaylistIds?.size || 0),
      _artistSubscribedPlaylistCount: Number(track._artistSubscribedPlaylistIds?.size || 0),
    }))
    .map((track) => ({
      ...track,
      _artistCareScore: computeTrackCareScore(track),
    }))
}

function buildArtistTrackPool(entry, trackStats) {
  const remoteState = state.artistRemoteTracksByKey.get(entry.key)
  const localTracks = trackStats.slice().sort(compareArtistTracks)

  if (!Array.isArray(remoteState?.tracks) || remoteState.tracks.length === 0) {
    return localTracks
      .map((track, index) => toArtistTrackOutput(track, index + 1))
  }

  const localTracksById = new Map(localTracks.map((track) => [track.id, track]))
  const seen = new Set()
  const remoteTracks = remoteState.tracks.flatMap((track, index) => {
    const normalizedTrackId = Number(track?.id || 0)
    if (normalizedTrackId <= 0 || seen.has(normalizedTrackId)) {
      return []
    }

    seen.add(normalizedTrackId)
    const localTrack = localTracksById.get(normalizedTrackId)
    return [toArtistTrackOutput({
      ...localTrack,
      ...track,
      artists: Array.isArray(track?.artists) && track.artists.length ? track.artists : (localTrack?.artists || []),
      artistEntries: Array.isArray(track?.artistEntries) && track.artistEntries.length
        ? track.artistEntries
        : (localTrack?.artistEntries || []),
    }, index + 1)]
  })

  const localOnlyTracks = localTracks
    .filter((track) => !seen.has(track.id))
    .map((track) => toArtistTrackOutput(track))

  return [...remoteTracks, ...localOnlyTracks]
    .map((track, index) => ({
      ...track,
      position: index + 1,
    }))
}

function computeArtistSummaryTrackCount(entry, artistStats, allTracks) {
  const knownTrackCount = Math.max(
    0,
    Number(allTracks?.length || 0),
    Number(entry?.trackMap?.size || 0)
  )
  if (knownTrackCount <= 0) {
    return 0
  }

  const hardCap = Math.min(ARTIST_SUMMARY_TRACK_COUNT_MAX, knownTrackCount)
  if (hardCap <= ARTIST_SUMMARY_TRACK_COUNT_MIN) {
    return hardCap
  }

  const rawScore = (
    (Math.log10(Number(artistStats?.importance || 0) + 10) * 1.35)
    + (Math.log10(Number(artistStats?.totalPlayCount || 0) + 1) * 1.6)
    + (Math.log10(Number(artistStats?.topTrackPlayCount || 0) + 1) * 0.9)
    + (Math.min(Number(artistStats?.likedTrackCount || 0), 6) * 1.45)
    + (Math.min(Number(artistStats?.ownedTrackCount || 0), 10) * 0.45)
    + (Math.min(Number(artistStats?.sourcePlaylistCount || 0), 8) * 0.5)
    + (Math.min(Number(entry?.occurrenceCount || 0), 18) * 0.2)
  )

  const computedCount = ARTIST_SUMMARY_TRACK_COUNT_MIN + Math.round(rawScore)
  return clamp(computedCount, Math.min(ARTIST_SUMMARY_TRACK_COUNT_MIN, hardCap), hardCap)
}

function buildArtistPlaylistFromEntry(entry) {
  const trackStats = getArtistTrackStats(entry)
  const artistStats = computeArtistImportance(entry, trackStats)
  const allTracks = buildArtistTrackPool(entry, trackStats)
  const remoteState = state.artistRemoteTracksByKey.get(entry.key)
  const artistId = Number(entry.artistId || remoteState?.artistId || 0)
  const summaryTrackCount = computeArtistSummaryTrackCount(entry, artistStats, allTracks)
  const expanded = isArtistPlaylistExpanded(entry.key)
  const tracks = expanded ? allTracks.slice() : allTracks.slice(0, summaryTrackCount)
  const knownTrackCount = allTracks.length

  return normalizePlaylist({
    id: buildArtistPlaylistId(entry.key),
    sourcePlaylistId: 0,
    name: entry.name,
    creatorId: 0,
    creatorName: '',
    subscribed: false,
    isArtist: true,
    artistKey: entry.key,
    artistId,
    artistName: entry.name,
    artistImportance: artistStats.importance,
    artistPlayScore: artistStats.playScore,
    artistPlayCount: artistStats.totalPlayCount,
    artistTopTrackPlayCount: artistStats.topTrackPlayCount,
    artistLikedTrackCount: artistStats.likedTrackCount,
    artistOwnedTrackCount: artistStats.ownedTrackCount,
    artistSubscribedTrackCount: artistStats.subscribedTrackCount,
    artistSourcePlaylistCount: artistStats.sourcePlaylistCount,
    artistOccurrenceCount: entry.occurrenceCount,
    artistHydrating: Boolean(remoteState?.loading),
    artistTracksSource: Array.isArray(remoteState?.tracks) && remoteState.tracks.length ? 'remote' : 'library',
    artistExpanded: expanded,
    artistSummaryTrackCount: summaryTrackCount,
    artistDisplayedTrackCount: tracks.length,
    artistTotalTrackCount: knownTrackCount,
    artistAllTracksComplete: Boolean(remoteState?.complete),
    artistAllTracks: allTracks,
    trackCount: knownTrackCount,
    coverUrl: resolveDominantAlbumCover(allTracks, allTracks[0]?.albumCoverUrl || ''),
    tracks,
    hydrated: true,
    hydrating: false,
  })
}

function pruneArtistRemoteTracksByKey(validArtistKeys) {
  const validKeys = new Set(validArtistKeys || [])
  state.artistRemoteTracksByKey = new Map(
    [...state.artistRemoteTracksByKey.entries()].filter(([artistKey]) => validKeys.has(artistKey))
  )
  renderRuntime.artistHydrationQueue = renderRuntime.artistHydrationQueue.filter((artistKey) => validKeys.has(artistKey))
}

function rebuildArtistPlaylists() {
  const artists = new Map()
  let artistOrder = 0
  let trackOrder = 0

  for (const playlist of state.playlists) {
    if (playlist.tracksError) {
      continue
    }

    for (const track of playlist.tracks || []) {
      const trackArtists = getTrackArtistEntries(track)
      if (!trackArtists.length) {
        continue
      }

      for (const artist of trackArtists) {
        let entry = artists.get(artist.key)
        if (!entry) {
          entry = {
            key: artist.key,
            artistId: Number(artist.id || 0),
            name: artist.name || '\u672a\u77e5\u827a\u4eba',
            firstSeenOrder: artistOrder,
            occurrenceCount: 0,
            sourcePlaylistIds: new Set(),
            ownedPlaylistIds: new Set(),
            subscribedPlaylistIds: new Set(),
            trackMap: new Map(),
          }
          artists.set(artist.key, entry)
          artistOrder += 1
        } else if (!entry.artistId && Number(artist.id || 0) > 0) {
          entry.artistId = Number(artist.id || 0)
        }

        entry.occurrenceCount += 1
        entry.sourcePlaylistIds.add(playlist.id)
        if (isOwnedPlaylist(playlist) && !isLikedPlaylist(playlist)) {
          entry.ownedPlaylistIds.add(playlist.id)
        } else if (!isLikedPlaylist(playlist)) {
          entry.subscribedPlaylistIds.add(playlist.id)
        }

        let trackEntry = entry.trackMap.get(track.id)
        if (!trackEntry) {
          trackEntry = {
            ...track,
            _artistOccurrenceCount: 0,
            _artistSourcePlaylistIds: new Set(),
            _artistOwnedPlaylistIds: new Set(),
            _artistSubscribedPlaylistIds: new Set(),
            _artistLikedPlaylistIds: new Set(),
            _artistPlayCount: Number(state.combinedPlayCounts.get(track.id) || 0),
            _artistFirstSeenOrder: trackOrder,
          }
          entry.trackMap.set(track.id, trackEntry)
          trackOrder += 1
        }

        trackEntry._artistOccurrenceCount += 1
        trackEntry._artistSourcePlaylistIds.add(playlist.id)
        if (isLikedPlaylist(playlist)) {
          trackEntry._artistLikedPlaylistIds.add(playlist.id)
        } else if (isOwnedPlaylist(playlist)) {
          trackEntry._artistOwnedPlaylistIds.add(playlist.id)
        } else {
          trackEntry._artistSubscribedPlaylistIds.add(playlist.id)
        }
      }
    }
  }

  state.artistPlaylistEntriesByKey = artists
  pruneArtistRemoteTracksByKey(artists.keys())

  const artistPlaylists = [...artists.values()]
    .map((entry) => buildArtistPlaylistFromEntry(entry))
    .sort(compareArtistPlaylists)

  state.artistPlaylists = artistPlaylists
  state.artistPlaylistIdByKey = new Map(artistPlaylists.map((playlist) => [playlist.artistKey, playlist.id]))
}

function normalizeTrackArtistEntries(artistEntries, fallbackArtists = []) {
  const rawEntries = Array.isArray(artistEntries) && artistEntries.length
    ? artistEntries
    : (fallbackArtists || []).map((artist) => ({
      id: 0,
      name: typeof artist === 'string' ? artist : artist?.name,
    }))

  const seen = new Set()
  const normalized = []
  for (const artist of rawEntries) {
    const name = String(artist?.name || artist || '').trim()
    const id = Number(artist?.id || artist?.artistId || 0)
    const key = buildArtistKey(id, name)
    if (!key || seen.has(key)) {
      continue
    }

    seen.add(key)
    normalized.push({ id, key, name })
  }

  return normalized
}

function normalizePlaylistTrack(track, index = 0) {
  const artistEntries = normalizeTrackArtistEntries(track?.artistEntries, track?.artists || [])
  const artists = artistEntries.map((artist) => artist.name)

  return {
    id: Number(track?.id || 0),
    sourceTrackId: String(track?.sourceTrackId || '').trim(),
    sourcePlatform: String(track?.sourcePlatform || '').trim(),
    platformTrackUri: String(track?.platformTrackUri || '').trim(),
    playbackTrackId: Number(track?.playbackTrackId || 0),
    playbackSourcePlatform: String(track?.playbackSourcePlatform || '').trim(),
    resolvedTrackId: Number(track?.resolvedTrackId || 0),
    position: Number(track?.position || index + 1),
    name: track?.name || '\u672a\u547d\u540d',
    artists,
    artistEntries,
    album: track?.album || '',
    albumId: Number(track?.albumId || 0),
    albumCoverUrl: track?.albumCoverUrl || '',
    durationMs: Number(track?.durationMs || 0),
    externalUrl: String(track?.externalUrl || '').trim(),
    searchText: normalizeQuery([
      track?.name || '',
      track?.album || '',
      artists.join(' '),
    ].join(' ')),
  }
}

function normalizePlaylist(playlist) {
  if (playlist?._normalized) {
    return playlist
  }

  const sourcePlaylistId = Number(playlist.sourcePlaylistId || playlist.id || 0)
  const isExplore = Boolean(playlist.isExplore)
  const isArtist = Boolean(playlist.isArtist)
  const normalizedArtistAllTracks = isArtist
    ? (playlist.artistAllTracks || playlist.tracks || []).map((track, index) => normalizePlaylistTrack(track, index))
      .filter((track) => track.id > 0)
    : []
  const tracks = (playlist.tracks || []).map((track, index) => normalizePlaylistTrack(track, index))
    .filter((track) => track.id > 0)

  return {
    id: isExplore ? -Math.abs(sourcePlaylistId) : Number(playlist.id),
    sourcePlaylistId,
    sourcePlatform: String(playlist.sourcePlatform || '').trim(),
    platformPlaylistId: String(playlist.platformPlaylistId || '').trim(),
    platformOwnerId: String(playlist.platformOwnerId || '').trim(),
    name: playlist.name || '\u672a\u547d\u540d\u6b4c\u5355',
    trackCount: Number(playlist.trackCount || tracks.length || 0),
    coverUrl: playlist.coverUrl || '',
    dominantAlbumCoverUrl: resolveDominantAlbumCover(tracks, playlist.coverUrl || ''),
    specialType: Number(playlist.specialType || 0),
    creatorId: Number(playlist.creatorId || 0),
    creatorName: playlist.creatorName || '',
    description: String(playlist.description || ''),
    subscribed: Boolean(playlist.subscribed),
    playCount: Number(playlist.playCount || 0),
    copywriter: playlist.copywriter || '',
    exploreSourceLabel: playlist.exploreSourceLabel || '',
    externalUrl: String(playlist.externalUrl || '').trim(),
    importReadOnly: Boolean(playlist.importReadOnly),
    isExplore,
    isArtist,
    artistKey: playlist.artistKey || '',
    artistId: Number(playlist.artistId || 0),
    artistName: playlist.artistName || playlist.name || '',
    artistImportance: Number(playlist.artistImportance || 0),
    artistPlayScore: Number(playlist.artistPlayScore || 0),
    artistPlayCount: Number(playlist.artistPlayCount || 0),
    artistTopTrackPlayCount: Number(playlist.artistTopTrackPlayCount || 0),
    artistLikedTrackCount: Number(playlist.artistLikedTrackCount || 0),
    artistOwnedTrackCount: Number(playlist.artistOwnedTrackCount || 0),
    artistSubscribedTrackCount: Number(playlist.artistSubscribedTrackCount || 0),
    artistSourcePlaylistCount: Number(playlist.artistSourcePlaylistCount || 0),
    artistOccurrenceCount: Number(playlist.artistOccurrenceCount || 0),
    artistHydrating: Boolean(playlist.artistHydrating),
    artistTracksSource: playlist.artistTracksSource || '',
    artistExpanded: Boolean(playlist.artistExpanded),
    artistSummaryTrackCount: Number(playlist.artistSummaryTrackCount || 0),
    artistDisplayedTrackCount: Number(playlist.artistDisplayedTrackCount || tracks.length || 0),
    artistTotalTrackCount: Number(
      playlist.artistTotalTrackCount
      || normalizedArtistAllTracks.length
      || playlist.trackCount
      || tracks.length
      || 0
    ),
    artistAllTracksComplete: Boolean(playlist.artistAllTracksComplete),
    artistTrackDisplayLimit: normalizeArtistTrackDisplayLimit(
      playlist.artistTrackDisplayLimit ?? state.settings.artistTrackDisplayLimit
    ),
    artistAllTracks: normalizedArtistAllTracks,
    tracks,
    profile: buildPlaylistProfile(playlist.name || '', tracks),
    tracksError: playlist.tracksError || '',
    hydrated: Boolean(playlist.hydrated),
    hydrating: Boolean(playlist.hydrating) && !playlist.hydrated,
    searchText: normalizeQuery([
      playlist.name || '',
      playlist.artistName || '',
      playlist.creatorName || '',
      playlist.exploreSourceLabel || '',
    ].join(' ')),
    _normalized: true,
  }
}

function refreshPlaylistMap() {
  state.playlistMap = new Map([
    ...state.playlists.map((playlist) => [playlist.id, playlist]),
    ...state.spotifyPlaylists.map((playlist) => [playlist.id, playlist]),
    ...state.explorePlaylists.map((playlist) => [playlist.id, playlist]),
    ...state.artistPlaylists.map((playlist) => [playlist.id, playlist]),
  ])
}

function replaceArtistPlaylistByKey(artistKey, nextPlaylist) {
  const currentIndex = state.artistPlaylists.findIndex((playlist) => playlist.artistKey === artistKey)
  if (currentIndex === -1) {
    return false
  }

  const nextArtistPlaylists = state.artistPlaylists.slice()
  nextArtistPlaylists[currentIndex] = nextPlaylist
  nextArtistPlaylists.sort(compareArtistPlaylists)
  state.artistPlaylists = nextArtistPlaylists
  state.artistPlaylistIdByKey = new Map(nextArtistPlaylists.map((playlist) => [playlist.artistKey, playlist.id]))
  refreshPlaylistMap()
  syncQueueWithPlaylists()
  return true
}

function refreshArtistPlaylistByKey(artistKey, { rerender = false } = {}) {
  const entry = state.artistPlaylistEntriesByKey.get(artistKey)
  if (!entry) {
    return false
  }

  const nextPlaylist = buildArtistPlaylistFromEntry(entry)
  const replaced = replaceArtistPlaylistByKey(artistKey, nextPlaylist)
  if (!replaced) {
    return false
  }

  if (rerender) {
    renderTabs()
    renderHeader()
    renderPlayer()
    applyFilters({ syncAll: true })
  }

  return true
}

function toggleArtistTrackExpansion(playlistId) {
  const playlist = getPlaylistById(playlistId)
  if (!playlist?.isArtist || !playlist.artistKey) {
    return
  }

  if (isArtistPlaylistExpanded(playlist.artistKey)) {
    renderRuntime.expandedArtistTrackKeys.delete(playlist.artistKey)
    refreshArtistPlaylistByKey(playlist.artistKey, { rerender: state.activeTab === 'artists' })
    return
  }

  renderRuntime.expandedArtistTrackKeys.add(playlist.artistKey)
  refreshArtistPlaylistByKey(playlist.artistKey, { rerender: state.activeTab === 'artists' })
  queueArtistPlaylistHydration(playlist.id, { includeCollapsed: true, force: true })
}

function setPlaylists(playlists) {
  state.playlists = playlists
  rebuildTrackPlayTiers()
  rebuildArtistIndex()
  rebuildArtistPlaylists()
  refreshPlaylistMap()
  silentlyPreloadArtistPlaylists()
  refreshAllRecommendationTracks()
}

function setSpotifyPlaylists(playlists) {
  state.spotifyPlaylists = playlists
  refreshPlaylistMap()
  refreshAllRecommendationTracks()
}

function setExplorePlaylists(playlists, query = '', options = {}) {
  state.explorePlaylists = playlists
  state.exploreLoaded = true
  state.exploreQuery = normalizeQuery(query)
  state.exploreArtistSearchRef = String(options.artistSearchRef || '').trim()
  refreshPlaylistMap()
}

function resolveDominantAlbumCover(tracks, fallbackCoverUrl) {
  const coverCount = new Map()
  let bestCoverUrl = fallbackCoverUrl || ''
  let bestCount = 0

  for (const track of tracks) {
    const coverUrl = track.albumCoverUrl || ''
    if (!coverUrl) {
      continue
    }

    const key = track.albumId > 0 ? `album:${track.albumId}` : `cover:${track.album}|${coverUrl}`
    const next = (coverCount.get(key)?.count || 0) + 1
    coverCount.set(key, { count: next, coverUrl })

    if (next > bestCount) {
      bestCount = next
      bestCoverUrl = coverUrl
    }
  }

  return bestCoverUrl
}

function sortWallPlaylists(playlists) {
  return [...playlists].sort((left, right) => {
    const diff = Math.max(right.trackCount, right.tracks.length) - Math.max(left.trackCount, left.tracks.length)
    return diff || left.id - right.id
  })
}

function mergePlaylistPatch(playlists, { done = false } = {}) {
  if (Array.isArray(playlists) && playlists.length) {
    renderRuntime.pendingPlaylistPatches.push(...playlists)
  }
  renderRuntime.pendingPatchDone = renderRuntime.pendingPatchDone || done

  window.clearTimeout(renderRuntime.patchFlushTimer)
  if (renderRuntime.pendingPatchDone) {
    flushPlaylistPatches()
    return
  }

  renderRuntime.patchFlushTimer = window.setTimeout(() => {
    flushPlaylistPatches()
  }, PATCH_COALESCE_MS)
}

function flushPlaylistPatches() {
  window.clearTimeout(renderRuntime.patchFlushTimer)
  renderRuntime.patchFlushTimer = 0

  if (!renderRuntime.pendingPlaylistPatches.length) {
    renderRuntime.pendingPatchDone = false
    return
  }

  const patchesById = new Map()
  for (const playlist of renderRuntime.pendingPlaylistPatches) {
    const playlistId = Number(playlist?.id || 0)
    if (playlistId > 0) {
      patchesById.set(playlistId, playlist)
    }
  }

  renderRuntime.pendingPlaylistPatches = []
  renderRuntime.pendingPatchDone = false

  const nextPlaylists = state.playlists.slice()
  const indexById = new Map(nextPlaylists.map((playlist, index) => [playlist.id, index]))

  for (const patch of Array.from(patchesById.values(), normalizePlaylist)) {
    const index = indexById.get(patch.id)
    if (index === undefined) {
      nextPlaylists.push(patch)
    } else {
      nextPlaylists[index] = { ...nextPlaylists[index], ...patch }
    }
  }

  setPlaylists(sortWallPlaylists(nextPlaylists))
  syncQueueWithPlaylists()
  renderTabs()
  renderHeader()
  renderPlayer()
  applyFilters()
}

function syncQueueWithPlaylists() {
  if (state.queueMode !== 'playlist' || !state.queuePlaylistId) return
  const playlist = getPlaylistById(state.queuePlaylistId)
  if (!playlist) {
    clearCurrentPlayback()
    renderPlayer()
    syncWallPlaybackState()
    return
  }
  if (getPlaylistSourcePlatform(playlist) === 'spotify') {
    return
  }
  if (!playlist.tracks.length) return
  const queueTracks = (playlist.tracks || []).filter((track) => String(track?.sourcePlatform || '').trim() !== 'spotify')
  const currentTrackId = state.currentTrackId
  state.queue = queueTracks
  if (currentTrackId) {
    const nextIndex = queueTracks.findIndex((track) => track.id === currentTrackId)
    if (nextIndex >= 0) {
      state.queueIndex = nextIndex
      return
    }
  }
  if (state.queueIndex >= queueTracks.length) {
    state.queueIndex = queueTracks.length - 1
  }
}

function getOwnedPlaylists() {
  const accountId = Number(state.account?.userId || 0)
  return applyStoredPlaylistOrder(
    state.playlists.filter((playlist) => Number(playlist.creatorId || 0) === accountId),
    'owned'
  )
}

function getSubscribedPlaylists() {
  const accountId = Number(state.account?.userId || 0)
  return applyStoredPlaylistOrder(
    state.playlists.filter((playlist) => Number(playlist.creatorId || 0) !== accountId),
    'subscribed'
  )
}

function getSpotifyPlaylists() {
  return applyStoredPlaylistOrder(state.spotifyPlaylists, 'spotify')
}

function getExplorePlaylists() {
  return applyStoredPlaylistOrder(state.explorePlaylists, 'explore')
}

function getArtistPlaylists() {
  return applyStoredPlaylistOrder(state.artistPlaylists, 'artists')
}

function getLibraryPlaylistBySourceId(sourcePlaylistId) {
  const normalizedSourcePlaylistId = Number(sourcePlaylistId || 0)
  if (normalizedSourcePlaylistId <= 0) {
    return null
  }

  return state.playlists.find((playlist) =>
    Number(playlist.id || 0) === normalizedSourcePlaylistId
    || Number(playlist.sourcePlaylistId || 0) === normalizedSourcePlaylistId
  ) || null
}

function isExplorePlaylistSubscribed(playlist) {
  if (!playlist?.isExplore) {
    return false
  }
  return Boolean(getLibraryPlaylistBySourceId(playlist.sourcePlaylistId || playlist.id))
}

function isExplorePlaylistSubscribing(playlist) {
  return Boolean(playlist?.isExplore && renderRuntime.subscribingPlaylistIds.has(Number(playlist.id)))
}

function getPlaylistSourcePlatform(playlist) {
  return String(playlist?.sourcePlatform || '').trim() || 'netease'
}

function getTrackSourcePlatform(track) {
  return String(track?.sourcePlatform || '').trim() || 'netease'
}

function isImportedReadOnlyPlaylist(playlist) {
  return Boolean(playlist?.importReadOnly || getPlaylistSourcePlatform(playlist) !== 'netease')
}

function canOpenSpotifyPlaylist(playlist) {
  return getPlaylistSourcePlatform(playlist) === 'spotify'
    && Boolean(String(playlist?.externalUrl || '').trim())
}

function canOpenSpotifyTrack(track) {
  return getTrackSourcePlatform(track) === 'spotify'
    && Boolean(String(track?.externalUrl || '').trim())
}

function canUseNeteaseFeatures() {
  return Boolean(state.neteaseAuthenticated)
}

function canRemoveSubscribedPlaylist(playlist) {
  return Boolean(
    playlist
    && !playlist.isExplore
    && !playlist.isArtist
    && !isOwnedPlaylist(playlist)
    && !isImportedReadOnlyPlaylist(playlist)
  )
}

function canEditOwnedPlaylist(playlist) {
  return Boolean(
    playlist
    && !playlist.isExplore
    && !playlist.isArtist
    && isOwnedPlaylist(playlist)
    && !isLikedPlaylist(playlist)
  )
}

function isSubscribedPlaylistRemoving(playlist) {
  return Boolean(canRemoveSubscribedPlaylist(playlist) && renderRuntime.playlistRemovalPendingIds.has(Number(playlist.id)))
}

function buildLibraryPlaylistFromExplore(playlist, overrides = {}) {
  const sourcePlaylistId = Number(playlist?.sourcePlaylistId || playlist?.id || 0)
  return normalizePlaylist({
    ...playlist,
    ...overrides,
    _normalized: false,
    id: sourcePlaylistId,
    sourcePlaylistId,
    isExplore: false,
    subscribed: true,
  })
}

function shouldPreserveExistingPlaylistTracks(existingPlaylist, nextPlaylist) {
  if (!Array.isArray(existingPlaylist?.tracks) || !existingPlaylist.tracks.length) {
    return false
  }

  const nextTracks = Array.isArray(nextPlaylist?.tracks) ? nextPlaylist.tracks : []
  if (nextTracks.length) {
    return false
  }

  return Number(nextPlaylist?.trackCount || 0) > 0 || Boolean(nextPlaylist?.hydrating)
}

function upsertPlaylistIntoLibrary(playlists, playlist) {
  const nextPlaylist = normalizePlaylist({
    ...playlist,
    _normalized: false,
  })
  const existingIndex = playlists.findIndex((item) => Number(item.id || 0) === Number(nextPlaylist.id || 0))
  if (existingIndex === -1) {
    return [...playlists, nextPlaylist]
  }

  const existingPlaylist = playlists[existingIndex]
  const preserveExistingTracks = shouldPreserveExistingPlaylistTracks(existingPlaylist, playlist)
  const expectedTrackCount = Math.max(
    Number(playlist?.trackCount || 0),
    Number(existingPlaylist?.trackCount || 0),
    existingPlaylist.tracks.length
  )
  const preservedHydrated = existingPlaylist?.hydrated !== undefined
    ? Boolean(existingPlaylist.hydrated)
    : existingPlaylist.tracks.length >= expectedTrackCount
  const preservedHydrating = !preservedHydrated && (
    Boolean(existingPlaylist?.hydrating)
    || expectedTrackCount > existingPlaylist.tracks.length
  )
  const nextPlaylists = playlists.slice()
  nextPlaylists[existingIndex] = preserveExistingTracks
    ? normalizePlaylist({
      ...existingPlaylist,
      ...playlist,
      _normalized: false,
      tracks: existingPlaylist.tracks,
      tracksError: playlist?.tracksError || existingPlaylist.tracksError || '',
      hydrated: preservedHydrated,
      hydrating: preservedHydrating,
    })
    : nextPlaylist
  return nextPlaylists
}

function getSourcePlaylists() {
  if (state.activeTab === 'explore') {
    return getExplorePlaylists()
  }
  if (state.activeTab === 'spotify') {
    return getSpotifyPlaylists()
  }
  if (state.activeTab === 'artists') {
    return getArtistPlaylists()
  }
  return state.activeTab === 'owned' ? getOwnedPlaylists() : getSubscribedPlaylists()
}

function getPlaylistTab(playlistOrId) {
  const playlist = playlistOrId && typeof playlistOrId === 'object'
    ? playlistOrId
    : getPlaylistById(playlistOrId)

  if (!playlist) {
    return ''
  }

  if (playlist.isExplore) {
    return 'explore'
  }

  if (getPlaylistSourcePlatform(playlist) === 'spotify') {
    return 'spotify'
  }

  if (playlist.isArtist) {
    return 'artists'
  }

  return isOwnedPlaylist(playlist) ? 'owned' : 'subscribed'
}

function shouldPersistPlaylistOrderForTab(tab) {
  return tab === 'owned'
}

function shouldPersistCollapsedStateForTab(tab) {
  return tab === 'owned' || tab === 'spotify' || tab === 'subscribed'
}

function getPlaylistOrderIdsForTab(tab) {
  if (shouldPersistPlaylistOrderForTab(tab)) {
    return normalizePlaylistOrderIds(state.settings.ownedPlaylistOrderIds)
  }

  return normalizePlaylistOrderIds(state.uiSession?.playlistOrderByTab?.[tab])
}

function setPlaylistOrderIdsForTab(tab, orderIds, { persist = true } = {}) {
  const normalizedOrderIds = normalizePlaylistOrderIds(orderIds)
  if (shouldPersistPlaylistOrderForTab(tab)) {
    const currentOrderIds = normalizePlaylistOrderIds(state.settings.ownedPlaylistOrderIds)
    if (arraysEqual(currentOrderIds, normalizedOrderIds)) {
      return false
    }

    state.settings.ownedPlaylistOrderIds = normalizedOrderIds
    if (persist) {
      saveSettings()
    }
    return true
  }

  const currentOrderIds = normalizePlaylistOrderIds(state.uiSession?.playlistOrderByTab?.[tab])
  if (arraysEqual(currentOrderIds, normalizedOrderIds)) {
    return false
  }

  state.uiSession.playlistOrderByTab = {
    ...normalizePlaylistOrderByTab(state.uiSession.playlistOrderByTab),
    [tab]: normalizedOrderIds,
  }
  if (persist) {
    saveUiSessionState()
  }
  return true
}

function playlistWallLayoutsEqual(left, right) {
  const normalizedLeft = normalizePlaylistWallLayout(left)
  const normalizedRight = normalizePlaylistWallLayout(right)
  if (normalizedLeft.columns !== normalizedRight.columns) {
    return false
  }

  return normalizedLeft.columnPlaylistIds.every((columnPlaylistIds, columnIndex) => {
    return arraysEqual(columnPlaylistIds, normalizedRight.columnPlaylistIds[columnIndex] || [])
  })
}

function getPlaylistWallLayoutForTab(tab) {
  return normalizePlaylistWallLayout(state.uiSession?.playlistWallLayoutByTab?.[tab])
}

function setPlaylistWallLayoutForTab(tab, layout, { persist = true } = {}) {
  const normalizedLayout = normalizePlaylistWallLayout(layout)
  const currentLayout = getPlaylistWallLayoutForTab(tab)
  if (playlistWallLayoutsEqual(currentLayout, normalizedLayout)) {
    return false
  }

  state.uiSession.playlistWallLayoutByTab = {
    ...normalizePlaylistWallLayoutByTab(state.uiSession.playlistWallLayoutByTab),
    [tab]: normalizedLayout,
  }
  if (persist) {
    saveUiSessionState()
  }
  return true
}

function getCollapsedPlaylistIdsForTab(tab) {
  return shouldPersistCollapsedStateForTab(tab)
    ? normalizeCollapsedPlaylistIds(state.settings.collapsedPlaylistIds)
    : normalizeCollapsedPlaylistIds(state.uiSession.collapsedPlaylistIds)
}

function setCollapsedPlaylistIdsForTab(tab, collapsedPlaylistIds, { persist = true } = {}) {
  const normalizedIds = normalizeCollapsedPlaylistIds(collapsedPlaylistIds)
  if (shouldPersistCollapsedStateForTab(tab)) {
    const currentIds = normalizeCollapsedPlaylistIds(state.settings.collapsedPlaylistIds)
    if (arraysEqual(currentIds, normalizedIds)) {
      return false
    }

    state.settings.collapsedPlaylistIds = normalizedIds
    if (persist) {
      saveSettings()
    }
    return true
  }

  const currentIds = normalizeCollapsedPlaylistIds(state.uiSession.collapsedPlaylistIds)
  if (arraysEqual(currentIds, normalizedIds)) {
    return false
  }

  state.uiSession.collapsedPlaylistIds = normalizedIds
  if (persist) {
    saveUiSessionState()
  }
  return true
}

function applyStoredPlaylistOrder(playlists, tab) {
  const orderIds = getPlaylistOrderIdsForTab(tab)
  if (!orderIds.length) {
    return playlists.slice()
  }

  const indexById = new Map(orderIds.map((id, index) => [id, index]))
  return playlists
    .map((playlist, index) => ({ playlist, index }))
    .sort((left, right) => {
      const leftRank = indexById.has(left.playlist.id)
        ? indexById.get(left.playlist.id)
        : Number.MAX_SAFE_INTEGER
      const rightRank = indexById.has(right.playlist.id)
        ? indexById.get(right.playlist.id)
        : Number.MAX_SAFE_INTEGER
      return leftRank - rightRank || left.index - right.index
    })
    .map((entry) => entry.playlist)
}

function rememberTabScrollPosition(tab = state.activeTab) {
  if (!refs.wallScroll || !state.tabScrollPositions || !(tab in state.tabScrollPositions)) {
    return
  }

  state.tabScrollPositions[tab] = Math.max(0, Math.round(refs.wallScroll.scrollTop || 0))
}

function queueTabScrollRestore(tab) {
  if (!state.tabScrollPositions || !(tab in state.tabScrollPositions)) {
    renderRuntime.pendingTabScrollRestore = null
    return
  }

  renderRuntime.pendingTabScrollRestore = {
    tab,
    top: Math.max(0, Math.round(state.tabScrollPositions[tab] || 0)),
  }
}

function shouldDeferPendingTabScrollRestore(pendingRestore = renderRuntime.pendingTabScrollRestore) {
  if (!pendingRestore || pendingRestore.tab !== state.activeTab || !refs.wallScroll) {
    return false
  }

  const maxScrollTop = Math.max(0, refs.wallScroll.scrollHeight - refs.wallScroll.clientHeight)
  return pendingRestore.top > maxScrollTop
    && state.activeTab === 'explore'
    && state.exploreLoading
    && maxScrollTop <= 0
}

function restorePendingTabScrollPosition() {
  const pendingRestore = renderRuntime.pendingTabScrollRestore
  if (!pendingRestore || pendingRestore.tab !== state.activeTab || !refs.wallScroll) {
    return
  }

  const maxScrollTop = Math.max(0, refs.wallScroll.scrollHeight - refs.wallScroll.clientHeight)
  const targetTop = clamp(pendingRestore.top, 0, maxScrollTop)
  const scrollChanged = Math.abs(refs.wallScroll.scrollTop - targetTop) > 1
  refs.wallScroll.scrollTop = targetTop

  if (renderRuntime.wallColumns.length && scrollChanged) {
    renderWallViewport({ force: true })
  }

  if (shouldDeferPendingTabScrollRestore(pendingRestore)) {
    return
  }

  state.tabScrollPositions[pendingRestore.tab] = targetTop
  renderRuntime.pendingTabScrollRestore = null
}

function activateTab(tab, { restoreTargetScroll = true } = {}) {
  if (state.activeTab === tab) {
    return false
  }

  rememberTabScrollPosition()
  state.activeTab = tab
  renderRuntime.pendingTabScrollRestore = null
  if (restoreTargetScroll) {
    queueTabScrollRestore(tab)
  }
  renderTabs()
  renderHeader()
  return true
}

async function setActiveTab(tab) {
  if (state.activeTab === tab) return
  closeContextMenu()
  if (tab === 'explore' && !canUseNeteaseFeatures()) {
    showToast(TEXT.exploreRequiresNetease, 'error')
    return
  }
  activateTab(tab)
  if (tab === 'explore') {
    await loadExplorePlaylists(state.search)
    return
  }
  applyFilters()
}

function renderTabs() {
  const ownedCount = formatNumber(getOwnedPlaylists().length)
  const spotifyCount = formatNumber(getSpotifyPlaylists().length)
  const subscribedCount = formatNumber(getSubscribedPlaylists().length)
  const exploreCount = formatNumber(getExplorePlaylists().length)
  const artistsCount = formatNumber(getArtistPlaylists().length)
  refs.tabOwnedCount.textContent = ownedCount
  refs.tabSpotifyCount.textContent = spotifyCount
  refs.tabSubscribedCount.textContent = subscribedCount
  refs.tabExploreCount.textContent = exploreCount
  refs.tabArtistsCount.textContent = artistsCount
  setButtonLabel(refs.tabOwned, `${TEXT.tabOwned} ${ownedCount}`)
  setButtonLabel(refs.tabSpotify, `${TEXT.tabSpotify} ${spotifyCount}`)
  setButtonLabel(refs.tabSubscribed, `${TEXT.tabSubscribed} ${subscribedCount}`)
  setButtonLabel(refs.tabExplore, `${TEXT.tabExplore} ${exploreCount}`)
  setButtonLabel(refs.tabArtists, `${TEXT.tabArtists} ${artistsCount}`)
  refs.tabOwned.classList.toggle('is-active', state.activeTab === 'owned')
  refs.tabSpotify.classList.toggle('is-active', state.activeTab === 'spotify')
  refs.tabSubscribed.classList.toggle('is-active', state.activeTab === 'subscribed')
  refs.tabExplore.classList.toggle('is-active', state.activeTab === 'explore')
  refs.tabArtists.classList.toggle('is-active', state.activeTab === 'artists')
  refs.tabOwned.setAttribute('aria-selected', String(state.activeTab === 'owned'))
  refs.tabSpotify.setAttribute('aria-selected', String(state.activeTab === 'spotify'))
  refs.tabSubscribed.setAttribute('aria-selected', String(state.activeTab === 'subscribed'))
  refs.tabExplore.setAttribute('aria-selected', String(state.activeTab === 'explore'))
  refs.tabArtists.setAttribute('aria-selected', String(state.activeTab === 'artists'))
  refs.tabSpotify.classList.toggle('hidden', !state.spotifyImport.connected && !state.spotifyPlaylists.length)
  refs.tabExplore.disabled = !canUseNeteaseFeatures()
}

function renderSearchInput() {
  refs.searchInput.placeholder = state.activeTab === 'explore'
    ? TEXT.searchExplorePlaceholder
    : state.activeTab === 'spotify'
      ? TEXT.searchSpotifyPlaceholder
      : state.activeTab === 'artists'
        ? TEXT.searchArtistsPlaceholder
        : TEXT.searchLibraryPlaceholder

  const hasSearchValue = Boolean(refs.searchInput.value || state.search)
  refs.searchClearBtn.classList.toggle('hidden', !hasSearchValue)
  refs.searchClearBtn.disabled = !hasSearchValue
  refs.searchClearBtn.setAttribute('aria-label', TEXT.clearSearch)
  refs.searchClearBtn.title = TEXT.clearSearch
}

function setSearchState(value = '') {
  const nextValue = String(value || '')
  state.search = nextValue
  if (refs.searchInput.value !== nextValue) {
    refs.searchInput.value = nextValue
  }
  renderSearchInput()
}

function scheduleSearchRefresh() {
  window.clearTimeout(renderRuntime.searchTimer)
  renderRuntime.searchTimer = window.setTimeout(() => {
    if (state.activeTab === 'explore') {
      void loadExplorePlaylists(state.search)
      return
    }
    applyFilters()
  }, SEARCH_DEBOUNCE_MS)
}

async function clearSearch({ focus = false, syncAll = true } = {}) {
  window.clearTimeout(renderRuntime.searchTimer)
  setSearchState('')
  state.exploreArtistFilterKey = ''

  if (state.activeTab === 'explore') {
    await loadExplorePlaylists('')
  } else {
    applyFilters({ syncAll })
  }

  if (focus) {
    refs.searchInput.focus()
  }
}

function renderHeader() {
  const nickname = state.account?.nickname || '\u5f53\u524d\u8d26\u53f7'
  if (refs.accountLine) {
    refs.accountLine.textContent = nickname
  }
  refs.createOwnedPlaylistBtn.classList.toggle('hidden', state.activeTab !== 'owned' || !canUseNeteaseFeatures())
  renderSearchInput()
}

function applyFilters({ syncAll = false } = {}) {
  closeContextMenu()
  hideAlbumHoverPreview()
  const source = getSourcePlaylists()
  const query = normalizeQuery(state.search)
  if (state.activeTab === 'explore') {
    const visibleSource = state.exploreArtistFilterKey
      ? source.filter((playlist) => playlistContainsArtistKey(playlist, state.exploreArtistFilterKey))
      : source
    state.visiblePlaylists = visibleSource.map((playlist) => ({
      ...playlist,
      wallTracks: playlist.tracks,
      matchedCount: playlist.tracks.length,
      searchMode: query ? 'remote' : 'all',
    }))
    pruneTrackSelection()
    renderEmptyState(source)
    scheduleWallRenderWithOptions({ immediate: true, syncAll })
    return
  }

  const likedPlaylistCollectedTrackIds = state.activeTab === 'owned'
    && state.settings.likedPlaylistDisplayMode === LIKED_PLAYLIST_DISPLAY_MODE_UNCOLLECTED
    ? buildCollectedTrackIdSetForLikedPlaylist(source)
    : null

  state.visiblePlaylists = source.flatMap((playlist) => {
    const wallTracks = resolvePlaylistWallTracks(playlist, likedPlaylistCollectedTrackIds)
    if (wallTracks === null) {
      return []
    }

    if (!query) {
      if (shouldHideEmptyFilteredLikedPlaylist(playlist, wallTracks)) {
        return []
      }

      return [{ ...playlist, wallTracks, matchedCount: wallTracks.length, searchMode: 'all' }]
    }

    const playlistMatch = playlist.searchText.includes(query)
    const searchableTracks = playlist.isArtist && Array.isArray(playlist.artistAllTracks) && playlist.artistAllTracks.length
      ? playlist.artistAllTracks
      : wallTracks
    const matchedTracks = playlistMatch ? wallTracks : searchableTracks.filter((track) => trackMatches(track, query))
    if (!playlistMatch && !matchedTracks.length) {
      return []
    }

    if (shouldHideEmptyFilteredLikedPlaylist(playlist, matchedTracks)) {
      return []
    }

    return [{ ...playlist, wallTracks: matchedTracks, matchedCount: matchedTracks.length, searchMode: playlistMatch ? 'playlist' : 'track' }]
  })

  pruneTrackSelection()
  renderEmptyState(source)
  scheduleWallRenderWithOptions({ immediate: true, syncAll })
}

function buildCollectedTrackIdSetForLikedPlaylist(playlists) {
  const collectedTrackIds = new Set()

  for (const playlist of playlists) {
    if (isLikedPlaylist(playlist) || playlist.tracksError) {
      continue
    }

    for (const track of playlist.tracks || []) {
      collectedTrackIds.add(track.id)
    }
  }

  return collectedTrackIds
}

function resolvePlaylistWallTracks(playlist, likedPlaylistCollectedTrackIds) {
  if (!isLikedPlaylist(playlist)) {
    return playlist.tracks
  }

  const displayMode = normalizeLikedPlaylistDisplayMode(state.settings.likedPlaylistDisplayMode)
  if (displayMode === LIKED_PLAYLIST_DISPLAY_MODE_HIDDEN) {
    return null
  }

  if (
    displayMode !== LIKED_PLAYLIST_DISPLAY_MODE_UNCOLLECTED
    || playlist.hydrating
    || playlist.tracksError
    || !(likedPlaylistCollectedTrackIds instanceof Set)
  ) {
    return playlist.tracks
  }

  return playlist.tracks.filter((track) => !likedPlaylistCollectedTrackIds.has(track.id))
}

function shouldHideEmptyFilteredLikedPlaylist(playlist, tracks) {
  return isLikedPlaylist(playlist)
    && normalizeLikedPlaylistDisplayMode(state.settings.likedPlaylistDisplayMode) === LIKED_PLAYLIST_DISPLAY_MODE_UNCOLLECTED
    && !playlist.hydrating
    && !playlist.tracksError
    && !tracks.length
}

function renderExploreLoadingIndicator() {
  const show = state.activeTab === 'explore' && state.exploreLoading
  refs.exploreLoadingIndicator.classList.toggle('hidden', !show)
  refs.wallView.setAttribute('aria-busy', String(show))

  if (!show) {
    return
  }

  refs.exploreLoadingText.textContent = queryHasContent()
    ? TEXT.loadingExploreSearch
    : TEXT.loadingExplore
}

function renderEmptyState(sourcePlaylists) {
  renderExploreLoadingIndicator()

  if (state.activeTab === 'explore' && state.exploreLoading) {
    refs.wallEmpty.querySelector('.empty-title').textContent = TEXT.loadingExplore
    refs.wallEmpty.querySelector('.empty-copy').textContent = '\u6b63\u5728\u62c9\u53d6\u6bcf\u65e5\u63a8\u9001\u4e0e\u793e\u533a\u6b4c\u5355\u3002'
    return
  }

  if (state.activeTab === 'explore' && state.exploreError && !sourcePlaylists.length) {
    refs.wallEmpty.querySelector('.empty-title').textContent = TEXT.exploreFailed
    refs.wallEmpty.querySelector('.empty-copy').textContent = state.exploreError
    return
  }

  if (!sourcePlaylists.length) {
    refs.wallEmpty.querySelector('.empty-title').textContent = state.activeTab === 'explore'
      ? TEXT.emptyExplore
      : state.activeTab === 'spotify'
        ? TEXT.emptySpotify
      : state.activeTab === 'artists'
        ? TEXT.emptyArtists
        : TEXT.emptyTab
    refs.wallEmpty.querySelector('.empty-copy').textContent = state.activeTab === 'explore'
      ? '\u53ef\u4ee5\u76f4\u63a5\u641c\u7d22\u793e\u533a\u6b4c\u5355\uff0c\u6216\u7a0d\u540e\u518d\u8bd5\u3002'
      : state.activeTab === 'spotify'
        ? '连上 Spotify 之后，这里会单独显示你的 Spotify 歌单。'
      : state.activeTab === 'artists'
        ? '\u8fd9\u91cc\u4f1a\u81ea\u52a8\u6309\u4f60\u5df2\u52a0\u8f7d\u7684\u66f2\u5e93\u805a\u5408\u51fa\u827a\u4eba\u6b4c\u5355\u3002'
        : '\u8fd9\u4e2a\u5206\u533a\u8fd8\u6ca1\u6709\u6b4c\u5355\u3002'
    return
  }
  if (!state.visiblePlaylists.length && queryHasContent()) {
    refs.wallEmpty.querySelector('.empty-title').textContent = state.activeTab === 'explore'
      ? TEXT.emptyExplore
      : TEXT.noMatch
    refs.wallEmpty.querySelector('.empty-copy').textContent = state.activeTab === 'explore'
      ? '\u6362\u4e2a\u641c\u7d22\u8bcd\uff0c\u770b\u770b\u522b\u7684\u793e\u533a\u6b4c\u5355\u3002'
      : state.activeTab === 'artists'
        ? '\u6362\u4e2a\u827a\u4eba\u540d\u6216\u6b4c\u540d\uff0c\u770b\u770b\u522b\u7684\u827a\u4eba\u6b4c\u5355\u3002'
      : '\u6362\u4e2a\u5173\u952e\u8bcd\uff0c\u6216\u8005\u5207\u6362\u5230\u53e6\u4e00\u4e2a tab \u3002'
    return
  }
  refs.wallEmpty.querySelector('.empty-title').textContent = '\u5f53\u524d\u6ca1\u6709\u53ef\u663e\u793a\u7684\u6b4c\u5355'
  refs.wallEmpty.querySelector('.empty-copy').textContent = '\u6362\u4e2a\u5173\u952e\u8bcd\uff0c\u6216\u8005\u5207\u6362\u5230\u53e6\u4e00\u4e2a tab \u3002'
}

function queryHasContent() {
  return Boolean(normalizeQuery(state.search))
}

function renderWall({ syncAll = false } = {}) {
  cancelWallRenderWork()

  const token = ++renderRuntime.wallRenderToken
  const columns = computeColumns()
  const wallItems = buildWallItems(state.visiblePlaylists)
  state.layout.columns = columns

  if (!wallItems.length) {
    refs.wallColumns.replaceChildren()
    refs.wallEmpty.classList.remove('hidden')
    renderRuntime.wallColumns = []
    renderRuntime.wallNodeMaps = []
    renderRuntime.wallPlacementsByColumn = []
    renderRuntime.wallTrackAnchors = new Map()
    renderRuntime.wallRenderedKeys = []
    renderRuntime.renderedPlaylistIds = new Set()
    syncWallPlaybackState()
    restorePendingTabScrollPosition()
    return
  }

  refs.wallEmpty.classList.add('hidden')
  const wallPlan = buildWallPlan(wallItems, columns)
  const columnNodes = Array.from({ length: columns }, (_, columnIndex) => {
    const column = document.createElement('div')
    column.className = 'wall-column'
    column.style.height = `${wallPlan.columnHeights[columnIndex]}px`
    return column
  })

  refs.wallColumns.replaceChildren(...columnNodes)
  renderRuntime.wallColumns = columnNodes
  renderRuntime.wallNodeMaps = Array.from({ length: columns }, () => new Map())
  renderRuntime.wallPlacementsByColumn = wallPlan.placementsByColumn
  renderRuntime.wallTrackAnchors = wallPlan.trackAnchors
  renderRuntime.wallRenderedKeys = new Array(columns).fill('')
  renderRuntime.renderedPlaylistIds = new Set()

  renderWallViewport({ token, force: true, syncAll })
  restorePendingTabScrollPosition()
}

function placeWallItem({
  item,
  columnIndex,
  metrics,
  placementsByColumn,
  columnHeights,
  trackAnchors,
}) {
  const height = estimateCardHeight(item)
  const top = columnHeights[columnIndex]
  const placement = {
    key: String(item.playlist.id),
    columnIndex,
    item,
    top,
    height,
    bottom: top + height,
  }

  placementsByColumn[columnIndex].push(placement)
  const visibleTracks = getRenderablePlaylistTracks(item.playlist)
  for (let trackIndex = 0; trackIndex < visibleTracks.length; trackIndex += 1) {
    const track = visibleTracks[trackIndex]
    trackAnchors.set(`${item.playlist.id}:${track.id}`, {
      top: placement.top + metrics.headerHeight + (trackIndex * metrics.rowHeight),
      playlistId: item.playlist.id,
    })
  }

  columnHeights[columnIndex] = placement.bottom + metrics.gap
}

function buildBalancedWallPlan(playlists, columns) {
  const metrics = getLayoutMetrics()
  const columnHeights = new Array(columns).fill(0)
  const placementsByColumn = Array.from({ length: columns }, () => [])
  const trackAnchors = new Map()

  for (const item of playlists) {
    placeWallItem({
      item,
      columnIndex: indexOfSmallest(columnHeights),
      metrics,
      placementsByColumn,
      columnHeights,
      trackAnchors,
    })
  }

  return {
    placementsByColumn,
    columnHeights: columnHeights.map((height) => Math.max(0, height - metrics.gap)),
    trackAnchors,
  }
}

function buildWallPlanFromColumnLayout(playlists, columns, columnLayout) {
  const normalizedLayout = normalizePlaylistWallLayout(columnLayout)
  const metrics = getLayoutMetrics()
  const columnHeights = new Array(columns).fill(0)
  const placementsByColumn = Array.from({ length: columns }, () => [])
  const trackAnchors = new Map()
  const itemByPlaylistId = new Map(
    playlists.map((item) => [Number(item?.playlist?.id || 0), item]).filter(([playlistId]) => playlistId > 0)
  )
  const usedPlaylistIds = new Set()

  for (let columnIndex = 0; columnIndex < columns; columnIndex += 1) {
    const columnPlaylistIds = normalizedLayout.columnPlaylistIds[columnIndex] || []
    for (const playlistId of columnPlaylistIds) {
      if (usedPlaylistIds.has(playlistId) || !itemByPlaylistId.has(playlistId)) {
        continue
      }

      placeWallItem({
        item: itemByPlaylistId.get(playlistId),
        columnIndex,
        metrics,
        placementsByColumn,
        columnHeights,
        trackAnchors,
      })
      usedPlaylistIds.add(playlistId)
    }
  }

  for (const item of playlists) {
    const playlistId = Number(item?.playlist?.id || 0)
    if (playlistId <= 0 || usedPlaylistIds.has(playlistId)) {
      continue
    }

    placeWallItem({
      item,
      columnIndex: indexOfSmallest(columnHeights),
      metrics,
      placementsByColumn,
      columnHeights,
      trackAnchors,
    })
  }

  return {
    placementsByColumn,
    columnHeights: columnHeights.map((height) => Math.max(0, height - metrics.gap)),
    trackAnchors,
  }
}

function buildWallPlan(playlists, columns) {
  const preferredLayout = getPlaylistWallLayoutForTab(state.activeTab)
  if (
    preferredLayout.columns === columns
    && preferredLayout.columnPlaylistIds.some((columnPlaylistIds) => columnPlaylistIds.length)
  ) {
    return buildWallPlanFromColumnLayout(playlists, columns, preferredLayout)
  }

  return buildBalancedWallPlan(playlists, columns)
}

function buildWallItems(playlists) {
  return playlists.map((playlist) => ({ playlist }))
}

function renderWallViewport({ token = renderRuntime.wallRenderToken, force = false } = {}) {
  if (token !== renderRuntime.wallRenderToken) {
    return
  }

  const columnNodes = renderRuntime.wallColumns
  if (!columnNodes.length) {
    return
  }

  const viewportTop = refs.wallScroll.scrollTop
  const viewportBottom = viewportTop + refs.wallScroll.clientHeight
  const metrics = getLayoutMetrics()
  const overscan = Math.max(metrics.overscanPx, refs.wallScroll.clientHeight)
  const startY = Math.max(0, viewportTop - overscan)
  const endY = viewportBottom + overscan
  const nextRenderedPlaylistIds = new Set()

  for (let columnIndex = 0; columnIndex < columnNodes.length; columnIndex += 1) {
    const placements = renderRuntime.wallPlacementsByColumn[columnIndex] || []
    const visiblePlacements = collectVisiblePlacements(placements, startY, endY)
    const placementKey = visiblePlacements.map((placement) => placement.key).join('|')
    const nodeMap = renderRuntime.wallNodeMaps[columnIndex]

    if (force || renderRuntime.wallRenderedKeys[columnIndex] !== placementKey) {
      reconcileColumnCards(
        columnNodes[columnIndex],
        nodeMap,
        visiblePlacements
      )
      renderRuntime.wallRenderedKeys[columnIndex] = placementKey
    }

    for (const placement of visiblePlacements) {
      const node = nodeMap.get(placement.key)
      if (node) {
        updatePlaylistCardNode(node, placement, { force })
      }
      nextRenderedPlaylistIds.add(placement.item.playlist.id)
    }
  }

  renderRuntime.renderedPlaylistIds = nextRenderedPlaylistIds
  syncWallPlaybackState()
  syncTrackSelectionState()
  primeVisibleArtistPlaylists()
  primeVisibleRecommendations()
}

function reconcileColumnCards(columnNode, nodeMap, visiblePlacements) {
  const keepKeys = new Set(visiblePlacements.map((placement) => placement.key))

  for (const [key, node] of nodeMap.entries()) {
    if (keepKeys.has(key)) {
      continue
    }
    node.remove()
    nodeMap.delete(key)
  }

  let previousNode = null
  for (const placement of visiblePlacements) {
    let node = nodeMap.get(placement.key)
    if (!node) {
      node = createPlaylistCardNode(placement)
      nodeMap.set(placement.key, node)
    }

    const nextSibling = previousNode ? previousNode.nextSibling : columnNode.firstChild
    if (node.parentNode !== columnNode) {
      columnNode.insertBefore(node, nextSibling)
    } else if (node !== nextSibling) {
      columnNode.insertBefore(node, nextSibling)
    }

    previousNode = node
  }
}

function collectVisiblePlacements(placements, startY, endY) {
  if (!placements.length) {
    return []
  }

  const visible = []
  for (let index = findPlacementStartIndex(placements, startY); index < placements.length; index += 1) {
    const placement = placements[index]
    if (placement.top > endY) {
      break
    }
    visible.push(placement)
  }
  return visible
}

function findPlacementStartIndex(placements, startY) {
  let low = 0
  let high = placements.length - 1
  let result = placements.length

  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    if (placements[mid].bottom >= startY) {
      result = mid
      high = mid - 1
    } else {
      low = mid + 1
    }
  }

  return result
}

function renderPositionedPlaylistCard(placement) {
  return renderPlaylistCard(placement, getPlaylistRowWindow(placement))
}

function createPlaylistCardNode(placement) {
  const template = document.createElement('template')
  template.innerHTML = renderPositionedPlaylistCard(placement).trim()
  return template.content.firstElementChild
}

function updatePlaylistCardNode(node, placement, { force = false } = {}) {
  const playlist = placement.item.playlist
  const rowWindow = getPlaylistRowWindow(placement)
  const totalCount = Math.max(playlist.trackCount, playlist.tracks.length)
  const headerKey = getPlaylistHeaderRenderKey(playlist, totalCount)
  const collapsed = isPlaylistCollapsed(playlist)
  const intrinsicHeight = estimateCardHeight(placement.item)

  node.classList.toggle('is-current', state.queuePlaylistId === playlist.id)
  node.classList.toggle('is-collapsed', collapsed)
  node.style.top = `${Math.round(placement.top)}px`
  node.style.setProperty('contain-intrinsic-size', `auto ${intrinsicHeight}px`)

  if (force || node.dataset.headerKey !== headerKey) {
    const headerNode = node.querySelector('.playlist-header')
    if (headerNode) {
      headerNode.outerHTML = renderPlaylistHeader(playlist, totalCount)
    }
    node.dataset.headerKey = headerKey
  }

  if (force || node.dataset.rowWindowKey !== rowWindow.key) {
    const rowsNode = node.querySelector('.playlist-rows')
    if (!rowsNode) {
      return
    }

    rowsNode.innerHTML = renderPlaylistRows(placement, rowWindow)
    node.dataset.rowWindowKey = rowWindow.key
  }
}

function renderPlaylistCard(placement, rowWindow) {
  const playlist = placement.item.playlist
  const totalCount = Math.max(playlist.trackCount, playlist.tracks.length)
  const intrinsicHeight = estimateCardHeight(placement.item)
  const headerKey = getPlaylistHeaderRenderKey(playlist, totalCount)

  return `
    <article
      class="playlist-card${state.queuePlaylistId === playlist.id ? ' is-current' : ''}${isPlaylistCollapsed(playlist) ? ' is-collapsed' : ''}"
      data-playlist-id="${playlist.id}"
      data-header-key="${escapeHtml(headerKey)}"
      data-row-window-key="${rowWindow.key}"
      style="top: ${Math.round(placement.top)}px; contain-intrinsic-size: auto ${intrinsicHeight}px;"
    >
      ${renderPlaylistHeader(playlist, totalCount)}
      <div class="playlist-rows">${renderPlaylistRows(placement, rowWindow)}</div>
    </article>
  `
}

function getPlaylistHeaderRenderKey(playlist, totalCount) {
  const collapsedState = isPlaylistCollapsed(playlist) ? 'collapsed' : 'expanded'
  const artistExpansionState = playlist.isArtist
    ? (playlist.artistExpanded ? 'artist-expanded' : 'artist-collapsed')
    : ''
  const subscribeState = playlist.isExplore
    ? isExplorePlaylistSubscribed(playlist)
      ? 'subscribed'
      : isExplorePlaylistSubscribing(playlist)
        ? 'loading'
        : 'idle'
    : ''
  const removeState = canRemoveSubscribedPlaylist(playlist)
    ? isSubscribedPlaylistRemoving(playlist)
      ? 'loading'
      : 'idle'
    : ''
  return [
    playlist.name || '',
    totalCount,
    describePlaylistMeta(playlist, totalCount),
    playlist.dominantAlbumCoverUrl || '',
    collapsedState,
    artistExpansionState,
    subscribeState,
    removeState,
  ].join('|')
}

function renderPlaylistHeader(playlist, totalCount) {
  const collapsed = isPlaylistCollapsed(playlist)
  const collapseLabel = collapsed ? TEXT.expandPlaylist : TEXT.collapsePlaylist
  const coverStyle = playlist.dominantAlbumCoverUrl
    ? ` style="--playlist-cover-image: url('${escapeHtml(playlist.dominantAlbumCoverUrl)}');"`
    : ''

  return `
    <div class="playlist-header${playlist.dominantAlbumCoverUrl ? ' has-cover' : ''}"${coverStyle}>
      <button
        class="playlist-header-main"
        type="button"
        data-toggle-playlist-collapse="${playlist.id}"
        data-drag-playlist="${playlist.id}"
        draggable="true"
        title="${escapeHtml(collapseLabel)}"
        aria-label="${escapeHtml(collapseLabel)}"
        aria-expanded="${collapsed ? 'false' : 'true'}"
      >
        <span class="playlist-copy">
          <span class="playlist-title" title="${escapeHtml(playlist.name)}">${escapeHtml(playlist.name)}</span>
          <span class="playlist-meta">${describePlaylistMeta(playlist, totalCount)}</span>
        </span>
      </button>
      ${renderPlaylistHeaderAction(playlist)}
    </div>
  `
}

function renderPlaylistHeaderAction(playlist) {
  if (playlist?.isArtist) {
    const expanded = Boolean(playlist.artistExpanded)
    const label = expanded ? TEXT.shrinkArtistTracks : TEXT.expandArtistTracks
    return `
      <div class="playlist-header-actions">
        <button
          class="playlist-header-action playlist-header-action--artist-toggle${expanded ? ' is-expanded' : ''}"
          type="button"
          data-toggle-artist-track-expansion="${playlist.id}"
          title="${escapeHtml(label)}"
          aria-label="${escapeHtml(label)}"
          aria-pressed="${expanded ? 'true' : 'false'}"
        >${renderArtistTrackExpansionIcon(expanded)}</button>
      </div>
    `
  }

  if (canOpenSpotifyPlaylist(playlist)) {
    const label = TEXT.spotifyOpenPlaylist
    return `
      <div class="playlist-header-actions">
        <button
          class="playlist-header-action"
          type="button"
          data-open-spotify-playlist="${playlist.id}"
          title="${escapeHtml(label)}"
          aria-label="${escapeHtml(label)}"
        >${renderOpenExternalIcon()}</button>
      </div>
    `
  }

  if (canEditOwnedPlaylist(playlist)) {
    const label = TEXT.editOwnedPlaylist
    return `
      <div class="playlist-header-actions">
        <button
          class="playlist-header-action"
          type="button"
          data-open-owned-playlist-editor="${playlist.id}"
          title="${escapeHtml(label)}"
          aria-label="${escapeHtml(label)}"
        >${renderPlaylistEditIcon()}</button>
      </div>
    `
  }

  if (state.activeTab === 'subscribed' && canRemoveSubscribedPlaylist(playlist)) {
    const removing = isSubscribedPlaylistRemoving(playlist)
    const label = TEXT.removeSubscribedPlaylist
    const className = removing
      ? 'playlist-header-action is-loading is-danger'
      : 'playlist-header-action is-danger'

    return `
      <div class="playlist-header-actions">
        <button
          class="${className}"
          type="button"
          data-remove-subscribed-playlist="${playlist.id}"
          title="${escapeHtml(label)}"
          aria-label="${escapeHtml(label)}"
          ${removing ? 'disabled' : ''}
        >&times;</button>
      </div>
    `
  }

  if (!playlist?.isExplore) {
    return ''
  }

  const subscribed = isExplorePlaylistSubscribed(playlist)
  const subscribing = isExplorePlaylistSubscribing(playlist)
  const label = subscribed ? TEXT.subscribedPlaylist : TEXT.subscribePlaylist
  const symbol = subscribed ? '&#10003;' : subscribing ? '&#8230;' : '+'
  const className = subscribed
    ? 'playlist-header-action is-active'
    : subscribing
      ? 'playlist-header-action is-loading'
      : 'playlist-header-action'

  return `
    <div class="playlist-header-actions">
      <button
        class="${className}"
        type="button"
        data-subscribe-playlist="${playlist.id}"
        title="${escapeHtml(label)}"
        aria-label="${escapeHtml(label)}"
        ${subscribed || subscribing ? 'disabled' : ''}
      >${symbol}</button>
    </div>
  `
}

function renderArtistTrackExpansionIcon(expanded) {
  const paths = expanded
    ? [
      'M2.5 5.5V2.5H5.5',
      'M10.5 2.5H13.5V5.5',
      'M13.5 10.5V13.5H10.5',
      'M5.5 13.5H2.5V10.5',
      'M6 6 2.5 2.5',
      'M10 6 13.5 2.5',
      'M10 10 13.5 13.5',
      'M6 10 2.5 13.5',
    ]
    : [
      'M5.5 2.5H2.5V5.5',
      'M13.5 5.5V2.5H10.5',
      'M10.5 13.5H13.5V10.5',
      'M2.5 10.5V13.5H5.5',
      'M2.5 2.5 6 6',
      'M13.5 2.5 10 6',
      'M13.5 13.5 10 10',
      'M2.5 13.5 6 10',
    ]

  return `
    <svg class="playlist-header-action-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      ${paths.map((path) => `<path d="${path}"></path>`).join('')}
    </svg>
  `
}

function renderPlaylistEditIcon() {
  return `
    <svg class="playlist-header-action-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M3 11.75 11.2 3.55a1.4 1.4 0 0 1 1.98 0l.27.27a1.4 1.4 0 0 1 0 1.98L5.25 14H3z"></path>
      <path d="M9.9 4.85 12.15 7.1"></path>
    </svg>
  `
}

function renderOpenExternalIcon() {
  return `
    <svg class="playlist-header-action-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M9.5 2.5H13.5V6.5"></path>
      <path d="M8 8 13.5 2.5"></path>
      <path d="M13.5 8.5V12a1.5 1.5 0 0 1-1.5 1.5H4A1.5 1.5 0 0 1 2.5 12V4A1.5 1.5 0 0 1 4 2.5H7.5"></path>
    </svg>
  `
}

function describePlaylistMeta(playlist, totalCount) {
  if (isImportedReadOnlyPlaylist(playlist)) {
    const parts = [
      'Spotify',
      `${formatNumber(totalCount)} \u9996`,
      playlist.creatorName || '',
    ].filter(Boolean)
    return parts.join(' \u00b7 ')
  }

  if (playlist.isArtist) {
    const displayedCount = Number(playlist.artistDisplayedTrackCount || playlist.tracks?.length || 0)
    const knownTotalCount = Math.max(
      displayedCount,
      Number(playlist.artistTotalTrackCount || totalCount || 0)
    )
    const countLabel = !playlist.artistExpanded
      && Boolean(playlist.artistAllTracksComplete)
      && knownTotalCount > displayedCount
      ? `${formatNumber(displayedCount)}/${formatNumber(knownTotalCount)} \u9996`
      : `${formatNumber(displayedCount || knownTotalCount)} \u9996`
    const parts = [
      countLabel,
      playlist.artistSourcePlaylistCount ? `${formatNumber(playlist.artistSourcePlaylistCount)} \u5f20\u6b4c\u5355` : '',
      playlist.artistPlayCount ? `${formatNumber(playlist.artistPlayCount)} \u6b21\u64ad\u653e` : '',
    ].filter(Boolean)
    return parts.join(' \u00b7 ')
  }
  if (playlist.isExplore) {
    const parts = [
      playlist.exploreSourceLabel || '',
      playlist.creatorName || '',
      `${formatNumber(totalCount)} \u9996`,
    ].filter(Boolean)
    return parts.join(' \u00b7 ')
  }
  if (playlist.tracksError) {
    return `${formatNumber(totalCount)} \u9996`
  }
  return `${formatNumber(totalCount)} \u9996`
}

function renderPlaylistRows(placement, rowWindow) {
  const playlist = placement.item.playlist
  if (isPlaylistCollapsed(playlist)) {
    return ''
  }

  const tracks = playlist.wallTracks || []

  if (!tracks.length) {
    const message = playlist.hydrating ? TEXT.hydratingPlaylist : (playlist.tracksError || TEXT.emptyPlaylist)
    return `<div class="playlist-placeholder">${escapeHtml(message)}</div>`
  }

  const rows = tracks
    .slice(rowWindow.start, rowWindow.end)
    .map((track) => renderTrackRow(track, playlist.id))
    .join('')
  const topSpacer = rowWindow.topSpacer > 0
    ? `<div class="playlist-row-spacer" style="height: ${rowWindow.topSpacer}px" aria-hidden="true"></div>`
    : ''
  const bottomSpacer = rowWindow.bottomSpacer > 0
    ? `<div class="playlist-row-spacer" style="height: ${rowWindow.bottomSpacer}px" aria-hidden="true"></div>`
    : ''
  const recommendationSection = rowWindow.showRecommendations
    ? renderPlaylistRecommendationsSection(playlist)
    : ''
  return `${topSpacer}${rows}${bottomSpacer}${recommendationSection}`
}

function renderTrackRow(track, playlistId) {
  const playlist = getPlaylistById(playlistId)
  const canDrag = canMutatePlaylistOrder(playlist)
  const isPlaying = state.currentTrackId === track.id
  const isSelected = isTrackSelected(playlistId, track.id)
  const isFocusFlashing = renderRuntime.focusFlashTrackKey === getTrackSelectionKey(playlistId, track.id)
  const artists = track.artists.join('\u3001') || '\u672a\u77e5\u827a\u4eba'
  const albumCoverUrl = track.albumCoverUrl || ''
  const albumCoverAttr = albumCoverUrl
    ? ` data-album-cover-url="${escapeHtml(albumCoverUrl)}"`
    : ''
  const tierMark = renderTrackTierMark(track.id)

  return `
    <button
      class="track-row${isPlaying ? ' is-playing' : ''}${isSelected ? ' is-selected' : ''}${isFocusFlashing ? ' is-focus-flash' : ''}"
      type="button"
      data-play-track="1"
      data-playlist-id="${playlistId}"
      data-track-id="${track.id}"
      data-track-name="${escapeHtml(track.name)}"${albumCoverAttr}
      draggable="${canDrag ? 'true' : 'false'}"
      aria-selected="${isSelected ? 'true' : 'false'}"
    >
      <span class="track-name" title="${escapeHtml(track.name)}">${tierMark}<span class="track-name-label">${escapeHtml(track.name)}</span></span>
      <span class="track-meta" title="${escapeHtml(artists)}">${escapeHtml(artists)}</span>
    </button>
  `
}

function renderTrackTierMark(trackId) {
  const tier = getTrackPlayTier(trackId)
  if (!tier) {
    return ''
  }

  return `<span class="track-tier-mark${tier === 'gold' ? ' track-tier-mark--gold' : ''}" aria-hidden="true">\u2605</span>`
}

function shouldRenderPlaylistRecommendations(item) {
  return state.settings.showPlaylistRecommendations
    && !isPlaylistCollapsed(item.playlist)
    && !item.playlist.isExplore
    && !item.playlist.isArtist
    && !isImportedReadOnlyPlaylist(item.playlist)
    && item.playlist.hydrated
    && !item.playlist.tracksError
    && item.playlist.tracks.length > 0
}

function pickPlaylistRecommendationSeedTrackIds(playlist) {
  const tracks = playlist.tracks || []
  if (!tracks.length) {
    return []
  }

  const candidateIndexes = [
    0,
    Math.floor(tracks.length * 0.2),
    Math.floor(tracks.length * 0.5),
    Math.floor(tracks.length * 0.8),
    tracks.length - 1,
  ]

  return [...new Set(candidateIndexes
    .map((index) => tracks[clamp(index, 0, Math.max(0, tracks.length - 1))]?.id)
    .filter((trackId) => Number(trackId) > 0))]
}

function scoreTrackAgainstPlaylist(track, playlist, options) {
  const profile = playlist.profile || { artistCounts: {}, albumCounts: {}, searchText: '' }
  const useIdf = !options || options.useIdf !== false
  const totalPlaylists = state.totalOwnedPlaylistCount || 1
  let score = 0

  for (const artistKey of getTrackArtistKeys(track)) {
    const count = Number(profile.artistCounts?.[artistKey] || 0)
    if (count > 0) {
      const idfWeight = useIdf
        ? Math.max(1, Math.log2(totalPlaylists / (state.artistPlaylistSets.get(artistKey)?.size || 1)))
        : 1
      score += count * 14 * idfWeight
    }
    if (profile.searchText && profile.searchText.includes(artistKey)) {
      score += 18
    }
  }

  const albumKey = getAlbumKey(track)
  if (albumKey) {
    score += Number(profile.albumCounts?.[albumKey] || 0) * 20
  }

  const albumText = normalizeQuery(track.album || '')
  if (albumText && profile.searchText && profile.searchText.includes(albumText)) {
    score += 10
  }

  if (useIdf) {
    score += computeCooccurrenceBonus(track, profile)
  }

  return score
}

function computeCooccurrenceBonus(track, profile) {
  const trackArtistKeys = getTrackArtistKeys(track)
  const unmatched = trackArtistKeys.filter((key) => !profile.artistCounts?.[key])
  if (unmatched.length === 0) return 0

  const playlistTopArtists = Object.entries(profile.artistCounts || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map((entry) => entry[0])

  if (playlistTopArtists.length === 0) return 0

  let bestJaccard = 0
  for (const artistA of unmatched) {
    const setA = state.artistPlaylistSets.get(artistA)
    if (!setA || setA.size === 0) continue

    for (const artistB of playlistTopArtists) {
      const setB = state.artistPlaylistSets.get(artistB)
      if (!setB || setB.size === 0) continue

      let intersection = 0
      for (const id of setA) {
        if (setB.has(id)) intersection++
      }
      const union = setA.size + setB.size - intersection
      const jaccard = union > 0 ? intersection / union : 0
      if (jaccard > bestJaccard) bestJaccard = jaccard
    }
  }

  return bestJaccard * 20
}

function getPlaylistRowWindow(placement) {
  const metrics = getLayoutMetrics()
  const playlist = placement.item.playlist
  const tracks = getRenderablePlaylistTracks(playlist)
  const recommendationHeight = shouldRenderPlaylistRecommendations(placement.item)
    ? metrics.recommendationHeight
    : 0

  if (isPlaylistCollapsed(playlist)) {
    return {
      key: 'collapsed',
      start: 0,
      end: 0,
      topSpacer: 0,
      bottomSpacer: 0,
      showRecommendations: false,
    }
  }

  if (!tracks.length) {
    return {
      key: 'empty',
      start: 0,
      end: 0,
      topSpacer: 0,
      bottomSpacer: 0,
      showRecommendations: false,
    }
  }

  const viewportTop = refs.wallScroll.scrollTop
  const viewportBottom = viewportTop + refs.wallScroll.clientHeight
  const bodyTop = placement.top + metrics.headerHeight
  const totalRows = tracks.length
  const minWindow = Math.max(
    WALL_ROW_WINDOW_STEP * 3,
    Math.ceil((refs.wallScroll.clientHeight || 0) / metrics.rowHeight)
  )

  let start = Math.floor((viewportTop - bodyTop) / metrics.rowHeight) - WALL_ROW_OVERSCAN
  let end = Math.ceil((viewportBottom - bodyTop) / metrics.rowHeight) + WALL_ROW_OVERSCAN

  start = clamp(start, 0, totalRows)
  end = clamp(end, 0, totalRows)

  if (end < start + minWindow) {
    end = Math.min(totalRows, start + minWindow)
    start = Math.max(0, Math.min(start, end - minWindow))
  }

  start = Math.max(0, Math.floor(start / WALL_ROW_WINDOW_STEP) * WALL_ROW_WINDOW_STEP)
  end = Math.min(totalRows, Math.ceil(end / WALL_ROW_WINDOW_STEP) * WALL_ROW_WINDOW_STEP)

  if (end <= start) {
    end = Math.min(totalRows, start + WALL_ROW_WINDOW_STEP)
  }

  const showRecommendations = recommendationHeight > 0 && end >= totalRows

  return {
    key: `${start}:${end}:${totalRows}:${showRecommendations ? 1 : 0}`,
    start,
    end,
    topSpacer: start * metrics.rowHeight,
    bottomSpacer: Math.max(
      0,
      ((totalRows - end) * metrics.rowHeight) + (showRecommendations ? 0 : recommendationHeight)
    ),
    showRecommendations,
  }
}

function renderPlaylistRecommendationsSection(playlist) {
  return `
    <section class="playlist-recommendations" data-playlist-id="${playlist.id}">
      <div class="playlist-recommendations-title">${TEXT.recommendationsTitle}</div>
      <div class="playlist-recommendations-body">${renderPlaylistRecommendationsBody(playlist.id)}</div>
    </section>
  `
}

function renderPlaylistRecommendationsBody(playlistId) {
  const recommendationState = state.recommendations.get(Number(playlistId))
  if (!recommendationState || recommendationState.status === 'idle' || recommendationState.status === 'loading') {
    if (renderRuntime.recommendationGlobalError) {
      return `<div class="playlist-recommendations-placeholder">${escapeHtml(renderRuntime.recommendationGlobalError)}</div>`
    }
    return `<div class="playlist-recommendations-placeholder">${TEXT.recommendationsLoading}</div>`
  }

  if (recommendationState.status === 'error') {
    return `<div class="playlist-recommendations-placeholder">${escapeHtml(recommendationState.errorMessage || TEXT.recommendationsFailed)}</div>`
  }

  if (!recommendationState.tracks.length) {
    return `<div class="playlist-recommendations-placeholder">${TEXT.recommendationsEmpty}</div>`
  }

  return recommendationState.tracks.map((track) => renderRecommendationRow(playlistId, track, recommendationState)).join('')
}

function renderRecommendationRow(playlistId, track, recommendationState) {
  const adding = recommendationState.addingTrackIds.has(track.id)
  const isPlaying = state.queueMode === 'recommendation'
    && Number(state.queuePlaylistId || 0) === Number(playlistId)
    && Number(state.currentTrackId || 0) === Number(track.id)
  const buttonText = adding ? '...' : '+'
  const buttonTitle = TEXT.addToPlaylist
  const artists = track.artists.join('\u3001') || '\u672a\u77e5\u827a\u4eba'
  const tierMark = renderTrackTierMark(track.id)
  const trackLabel = `${track.name} / ${artists}`

  return `
    <div
      class="recommendation-row"
      data-recommendation-row="1"
      data-playlist-id="${playlistId}"
      data-track-id="${track.id}"
    >
      <button
        class="recommendation-play-btn${isPlaying ? ' is-playing' : ''}"
        type="button"
        data-play-recommend-track="1"
        data-playlist-id="${playlistId}"
        data-track-id="${track.id}"
      >${tierMark}<span class="recommendation-text" title="${escapeHtml(trackLabel)}">${escapeHtml(trackLabel)}</span></button>
      <button
        class="recommendation-add-btn"
        type="button"
        data-add-recommend-track="1"
        data-playlist-id="${playlistId}"
        data-track-id="${track.id}"
        title="${escapeHtml(buttonTitle)}"
        ${adding ? 'disabled' : ''}
      >${escapeHtml(buttonText)}</button>
    </div>
  `
}

function primeVisibleArtistPlaylists() {
  if (state.activeTab !== 'artists') {
    return
  }

  if (!appBridge || typeof appBridge.getArtistSongs !== 'function') {
    return
  }

  for (const playlistId of renderRuntime.renderedPlaylistIds) {
    queueArtistPlaylistHydration(playlistId)
  }
}

function buildArtistResolveContext(artistKey) {
  const entry = state.artistPlaylistEntriesByKey.get(artistKey)
  if (!entry?.trackMap?.size) {
    return null
  }

  const trackStats = getArtistTrackStats(entry).sort(compareArtistTracks)
  const trackNames = []
  const albumNames = []
  const seenTrackNames = new Set()
  const seenAlbumNames = new Set()

  for (const track of trackStats) {
    const normalizedTrackName = normalizeQuery(track?.name || '')
    if (normalizedTrackName && !seenTrackNames.has(normalizedTrackName) && trackNames.length < 6) {
      seenTrackNames.add(normalizedTrackName)
      trackNames.push(String(track.name || '').trim())
    }

    const normalizedAlbumName = normalizeQuery(track?.album || '')
    if (normalizedAlbumName && !seenAlbumNames.has(normalizedAlbumName) && albumNames.length < 6) {
      seenAlbumNames.add(normalizedAlbumName)
      albumNames.push(String(track.album || '').trim())
    }

    if (trackNames.length >= 6 && albumNames.length >= 6) {
      break
    }
  }

  if (!trackNames.length && !albumNames.length) {
    return null
  }

  return { trackNames, albumNames }
}

function resolveArtistHydrationRef(playlist, remoteState = null) {
  const artistKey = String(playlist?.artistKey || '')
  const artistId = Number(playlist?.artistId || remoteState?.artistId || 0)
  if (artistId > 0) {
    return {
      artistId,
      artistRef: artistId,
      resolveContext: null,
    }
  }

  const artistName = String(playlist?.artistName || playlist?.name || '').trim()
  return {
    artistId: 0,
    artistRef: artistName,
    resolveContext: buildArtistResolveContext(artistKey),
  }
}

function queueArtistPlaylistHydration(playlistId, options = {}) {
  if (!canUseNeteaseFeatures()) {
    return
  }

  const playlist = getPlaylistById(playlistId)
  const includeCollapsed = options.includeCollapsed === true
  const force = options.force === true
  if (!playlist?.isArtist || (!includeCollapsed && isPlaylistCollapsed(playlist))) {
    return
  }

  const artistKey = playlist.artistKey || ''
  const remoteState = state.artistRemoteTracksByKey.get(artistKey)
  const artistRequest = resolveArtistHydrationRef(playlist, remoteState)
  const expanded = isArtistPlaylistExpanded(artistKey)
  const requestedMaxCount = expanded ? 0 : ARTIST_SUMMARY_TRACK_COUNT_MAX
  if (!artistKey || !artistRequest.artistRef) {
    return
  }

  if (!expanded && !force && Number(artistRequest.artistId || 0) <= 0) {
    return
  }

  const currentTrackCount = Array.isArray(remoteState?.tracks) ? remoteState.tracks.length : 0
  const isCovered = expanded
    ? Boolean(remoteState?.complete)
    : currentTrackCount >= ARTIST_SUMMARY_TRACK_COUNT_MAX
  const isAlreadyQueued = renderRuntime.artistHydrationQueue.includes(artistKey)
  const isAlreadyLoading = Boolean(remoteState?.loading)
    && (expanded ? remoteState?.requestedAll === true : Number(remoteState?.requestedMaxCount || 0) >= ARTIST_SUMMARY_TRACK_COUNT_MAX)
  const hasMatchingError = Boolean(remoteState?.error)
    && (expanded ? remoteState?.requestedAll === true : Number(remoteState?.requestedMaxCount || 0) >= ARTIST_SUMMARY_TRACK_COUNT_MAX)
  if (!force && (isCovered || isAlreadyQueued || isAlreadyLoading || hasMatchingError)) {
    return
  }

  state.artistRemoteTracksByKey.set(artistKey, {
    ...(remoteState || {}),
    artistId: artistRequest.artistId,
    loading: true,
    requestedAll: expanded,
    requestedMaxCount,
  })
  refreshArtistPlaylistByKey(artistKey)

  renderRuntime.artistHydrationQueue.push(artistKey)
  processArtistHydrationQueue()
}

function processArtistHydrationQueue() {
  while (
    renderRuntime.artistHydrationInFlight < ARTIST_TRACK_HYDRATION_CONCURRENCY
    && renderRuntime.artistHydrationQueue.length
  ) {
    const artistKey = renderRuntime.artistHydrationQueue.shift()
    const sessionId = renderRuntime.artistHydrationSessionId
    renderRuntime.artistHydrationInFlight += 1

    void hydrateArtistPlaylistTracks(artistKey, sessionId).finally(() => {
      if (sessionId !== renderRuntime.artistHydrationSessionId) {
        return
      }

      renderRuntime.artistHydrationInFlight = Math.max(0, renderRuntime.artistHydrationInFlight - 1)
      processArtistHydrationQueue()
      flushPendingArtistHydrationRerender()
    })
  }
}

function queuePendingArtistHydrationRerender() {
  if (state.activeTab !== 'artists') {
    return
  }

  renderRuntime.artistHydrationRerenderPending = true
}

function flushPendingArtistHydrationRerender() {
  if (!renderRuntime.artistHydrationRerenderPending) {
    return
  }

  if (state.activeTab !== 'artists') {
    renderRuntime.artistHydrationRerenderPending = false
    return
  }

  if (renderRuntime.artistHydrationQueue.length || renderRuntime.artistHydrationInFlight > 0) {
    return
  }

  renderRuntime.artistHydrationRerenderPending = false
  renderTabs()
  renderHeader()
  renderPlayer()
  applyFilters({ syncAll: true })
}

async function hydrateArtistPlaylistTracks(artistKey, sessionId) {
  if (sessionId !== renderRuntime.artistHydrationSessionId) {
    return
  }

  const playlist = state.artistPlaylists.find((item) => item.artistKey === artistKey) || null
  const previousState = state.artistRemoteTracksByKey.get(artistKey) || {}
  const artistRequest = resolveArtistHydrationRef(playlist, previousState)
  const expanded = isArtistPlaylistExpanded(artistKey)
  const requestedMaxCount = expanded ? 0 : ARTIST_SUMMARY_TRACK_COUNT_MAX
  if (!playlist || !artistRequest.artistRef) {
    return
  }

  const result = await appBridge.getArtistSongs(artistRequest.artistRef, requestedMaxCount, {
    resolveContext: artistRequest.resolveContext || null,
  })
  if (sessionId !== renderRuntime.artistHydrationSessionId) {
    return
  }

  if (!state.artistPlaylistEntriesByKey.has(artistKey)) {
    return
  }

  const resolvedArtistId = Number(result?.artistId || artistRequest.artistId || previousState?.artistId || 0)
  const shouldRerenderImmediately = state.activeTab === 'artists' && expanded

  if (!result?.ok) {
    state.artistRemoteTracksByKey.set(artistKey, {
      ...previousState,
      artistId: resolvedArtistId,
      loading: false,
      error: result?.error || TEXT.goToArtistPlaylistFailed,
      requestedAll: expanded,
      requestedMaxCount,
    })
    refreshArtistPlaylistByKey(artistKey, { rerender: shouldRerenderImmediately })
    if (!shouldRerenderImmediately) {
      queuePendingArtistHydrationRerender()
    }
    return
  }

  state.artistRemoteTracksByKey.set(artistKey, {
    ...previousState,
    artistId: resolvedArtistId,
    loading: false,
    error: '',
    requestedAll: expanded,
    requestedMaxCount,
    complete: requestedMaxCount <= 0
      || (requestedMaxCount > 0 && (result.tracks || []).length < requestedMaxCount),
    tracks: (result.tracks || []).map((track, index) => normalizePlaylistTrack(track, index)),
  })
  refreshArtistPlaylistByKey(artistKey, { rerender: shouldRerenderImmediately })
  if (!shouldRerenderImmediately) {
    queuePendingArtistHydrationRerender()
  }
}

function primeVisibleRecommendations() {
  if (!state.settings.showPlaylistRecommendations) {
    return
  }

  for (const playlistId of renderRuntime.renderedPlaylistIds) {
    queuePlaylistRecommendationLoad(playlistId)
  }
}

function queuePlaylistRecommendationLoad(playlistId) {
  const playlist = getPlaylistById(playlistId)
  if (!playlist || !playlist.tracks.length || isPlaylistCollapsed(playlist)) {
    return
  }

  const currentState = ensureRecommendationState(playlistId)
  if (renderRuntime.recommendationGlobalError) {
    currentState.status = 'error'
    currentState.tracks = []
    currentState.poolTracks = []
    currentState.errorMessage = renderRuntime.recommendationGlobalError
    updatePlaylistRecommendationNodes(playlistId)
    return
  }

  if (currentState.status === 'loading' || currentState.status === 'ready' || currentState.status === 'error') {
    return
  }

  currentState.status = 'loading'
  currentState.errorMessage = ''
  updatePlaylistRecommendationNodes(playlistId)

  if (!renderRuntime.recommendationQueue.includes(playlistId)) {
    renderRuntime.recommendationQueue.push(playlistId)
  }
  processRecommendationQueue()
}

function resetRecommendationRuntime() {
  renderRuntime.recommendationSessionId += 1
  renderRuntime.recommendationGlobalError = ''
  renderRuntime.recommendationQueue = []
  renderRuntime.recommendationInFlight = 0
  state.recommendations = new Map()
}

function applyRecommendationGlobalError(message) {
  renderRuntime.recommendationGlobalError = message
  renderRuntime.recommendationQueue = []
  renderRuntime.recommendationInFlight = 0

  for (const playlist of state.visiblePlaylists) {
    if (!playlist.hydrated || playlist.tracksError || !playlist.tracks.length) {
      continue
    }

    const recommendationState = ensureRecommendationState(playlist.id)
    recommendationState.status = 'error'
    recommendationState.tracks = []
    recommendationState.poolTracks = []
    recommendationState.errorMessage = message
    updatePlaylistRecommendationNodes(playlist.id)
  }
}

function ensureRecommendationState(playlistId) {
  const normalizedId = Number(playlistId)
  if (!state.recommendations.has(normalizedId)) {
    state.recommendations.set(normalizedId, {
      status: 'idle',
      tracks: [],
      poolTracks: [],
      errorMessage: '',
      addingTrackIds: new Set(),
    })
  }
  return state.recommendations.get(normalizedId)
}

function refreshAllRecommendationTracks() {
  for (const [playlistId, recommendationState] of state.recommendations.entries()) {
    if (recommendationState.status !== 'ready') {
      continue
    }

    refreshRecommendationTracks(playlistId, recommendationState)
  }
}

function refreshRecommendationTracks(playlistId, recommendationState = ensureRecommendationState(playlistId)) {
  const playlist = getPlaylistById(playlistId)
  recommendationState.tracks = pickVisibleRecommendationTracks(playlist, recommendationState.poolTracks)
  syncRecommendationQueueWithVisibleTracks(playlistId, recommendationState.tracks)
}

function pickVisibleRecommendationTracks(playlist, poolTracks) {
  const existingIds = new Set((playlist?.tracks || []).map((track) => track.id))
  return (poolTracks || [])
    .filter((track) => track.id > 0 && !existingIds.has(track.id))
    .slice(0, RECOMMENDATION_COUNT)
}

function syncRecommendationQueueWithVisibleTracks(playlistId, tracks) {
  if (state.queueMode !== 'recommendation' || Number(state.queuePlaylistId || 0) !== Number(playlistId)) {
    return
  }

  const currentTrackId = Number(state.currentTrackId || 0)
  if (!currentTrackId) {
    return
  }

  const nextIndex = tracks.findIndex((track) => track.id === currentTrackId)
  if (nextIndex === -1) {
    return
  }

  state.queue = tracks
  state.queueIndex = nextIndex
}

function processRecommendationQueue() {
  while (renderRuntime.recommendationInFlight < RECOMMENDATION_CONCURRENCY && renderRuntime.recommendationQueue.length) {
    const playlistId = renderRuntime.recommendationQueue.shift()
    const sessionId = renderRuntime.recommendationSessionId
    renderRuntime.recommendationInFlight += 1
    void fetchPlaylistRecommendations(playlistId, sessionId).finally(() => {
      if (sessionId !== renderRuntime.recommendationSessionId) {
        return
      }
      renderRuntime.recommendationInFlight = Math.max(0, renderRuntime.recommendationInFlight - 1)
      processRecommendationQueue()
    })
  }
}

async function fetchPlaylistRecommendations(playlistId, sessionId) {
  if (sessionId !== renderRuntime.recommendationSessionId) {
    return
  }

  const playlist = getPlaylistById(playlistId)
  const recommendationState = ensureRecommendationState(playlistId)
  if (!playlist || !playlist.tracks.length) {
    recommendationState.status = 'empty'
    recommendationState.tracks = []
    recommendationState.poolTracks = []
    recommendationState.errorMessage = ''
    updatePlaylistRecommendationNodes(playlistId)
    return
  }

  const seedTrackIds = pickPlaylistRecommendationSeedTrackIds(playlist)
  if (!seedTrackIds.length) {
    recommendationState.status = 'empty'
    recommendationState.tracks = []
    recommendationState.poolTracks = []
    recommendationState.errorMessage = ''
    updatePlaylistRecommendationNodes(playlistId)
    return
  }

  const result = await appBridge.getPlaylistRecommendations(playlistId, seedTrackIds, RECOMMENDATION_FETCH_COUNT)
  if (sessionId !== renderRuntime.recommendationSessionId) {
    return
  }

  if (!result.ok) {
    if (Number(result.code || 0) === 301) {
      applyRecommendationGlobalError(result.error || TEXT.recommendationsFailed)
      return
    }

    recommendationState.status = 'error'
    recommendationState.tracks = []
    recommendationState.poolTracks = []
    recommendationState.errorMessage = result.error || TEXT.recommendationsFailed
    updatePlaylistRecommendationNodes(playlistId)
    return
  }

  recommendationState.status = 'ready'
  recommendationState.errorMessage = ''
  recommendationState.poolTracks = (result.tracks || [])
    .filter((track) => track.id > 0)
    .map((track) => ({
      ...track,
      _recommendationScore: scoreTrackAgainstPlaylist(track, playlist),
    }))
    .sort((left, right) => right._recommendationScore - left._recommendationScore || left.id - right.id)
  refreshRecommendationTracks(playlistId, recommendationState)
  updatePlaylistRecommendationNodes(playlistId)
}

function updatePlaylistRecommendationNodes(playlistId) {
  const sections = refs.wallColumns.querySelectorAll(`.playlist-recommendations[data-playlist-id="${playlistId}"] .playlist-recommendations-body`)
  if (!sections.length) {
    return
  }

  const html = renderPlaylistRecommendationsBody(playlistId)
  sections.forEach((section) => {
    section.innerHTML = html
  })
}

function updatePlaylistRecommendationNodesForVisible() {
  const playlistIds = [...new Set(Array.from(refs.wallColumns.querySelectorAll('.playlist-recommendations[data-playlist-id]'))
    .map((section) => Number(section.getAttribute('data-playlist-id')))
    .filter((playlistId) => playlistId > 0))]

  for (const playlistId of playlistIds) {
    updatePlaylistRecommendationNodes(playlistId)
  }
}

async function addRecommendedTrackToPlaylist(playlistId, trackId) {
  const playlist = getPlaylistById(playlistId)
  const recommendationState = ensureRecommendationState(playlistId)
  const track = recommendationState.tracks.find((item) => item.id === Number(trackId))

  if (!playlist || !track || recommendationState.addingTrackIds.has(track.id)) {
    return
  }

  recommendationState.addingTrackIds.add(track.id)
  updatePlaylistRecommendationNodes(playlistId)

  const result = await appBridge.addTrackToPlaylist(playlistId, track)
  recommendationState.addingTrackIds.delete(track.id)

  if (!result.ok) {
    updatePlaylistRecommendationNodes(playlistId)
    showToast(result.error || TEXT.addToPlaylistFailed, 'error')
    return
  }

  const nextPlaylist = normalizePlaylist({
    ...playlist,
    _normalized: false,
    trackCount: Math.max(playlist.trackCount, playlist.tracks.length) + 1,
    tracks: [...playlist.tracks, { ...track, position: playlist.tracks.length + 1 }],
  })
  const nextPlaylists = state.playlists.map((item) => item.id === playlist.id ? nextPlaylist : item)
  setPlaylists(sortWallPlaylists(nextPlaylists))
  syncQueueWithPlaylists()
  renderTabs()
  renderHeader()
  renderPlayer()
  applyFilters({ syncAll: true })
  showToast(`${context.keepSource ? TEXT.copyToPlaylistDone : TEXT.moveToPlaylistDone}\uff1a${targetPlaylist.name}`)
  return
  showToast(TEXT.addToPlaylistDone)
}

async function subscribeExplorePlaylistFromCard(playlistId) {
  const playlist = getPlaylistById(playlistId)
  if (!playlist || !playlist.isExplore) {
    return
  }

  if (isExplorePlaylistSubscribed(playlist) || isExplorePlaylistSubscribing(playlist)) {
    return
  }

  renderRuntime.subscribingPlaylistIds.add(playlist.id)
  renderWallViewport({ force: true })

  const result = await appBridge.subscribePlaylist(buildLibraryPlaylistFromExplore(playlist))
  renderRuntime.subscribingPlaylistIds.delete(playlist.id)

  if (!result?.ok) {
    renderWallViewport({ force: true })
    showToast(result?.error || TEXT.subscribePlaylistFailed, 'error')
    return
  }

  const nextPlaylist = normalizePlaylist(result.playlist || buildLibraryPlaylistFromExplore(playlist))
  setPlaylists(sortWallPlaylists(upsertPlaylistIntoLibrary(state.playlists, nextPlaylist)))
  if (!(state.queuePlaylistId === null && state.currentTrackId === null)) {
    syncQueueWithPlaylists()
  }
  renderTabs()
  renderHeader()
  renderPlayer()
  applyFilters({ syncAll: true })
  showToast(TEXT.subscribePlaylistDone)
}

function clonePlaylistSnapshot(playlist) {
  if (!playlist) {
    return null
  }

  return {
    id: Number(playlist.id || 0),
    sourcePlaylistId: Number(playlist.sourcePlaylistId || playlist.id || 0),
    name: playlist.name || '',
    trackCount: Math.max(Number(playlist.trackCount || 0), playlist.tracks?.length || 0),
    coverUrl: playlist.coverUrl || '',
    specialType: Number(playlist.specialType || 0),
    creatorId: Number(playlist.creatorId || 0),
    creatorName: playlist.creatorName || '',
    subscribed: true,
    playCount: Number(playlist.playCount || 0),
    copywriter: playlist.copywriter || '',
    exploreSourceLabel: playlist.exploreSourceLabel || '',
    isExplore: Boolean(playlist.isExplore),
    isArtist: Boolean(playlist.isArtist),
    artistKey: playlist.artistKey || '',
    artistId: Number(playlist.artistId || 0),
    artistName: playlist.artistName || playlist.name || '',
    artistImportance: Number(playlist.artistImportance || 0),
    artistSourcePlaylistCount: Number(playlist.artistSourcePlaylistCount || 0),
    artistOccurrenceCount: Number(playlist.artistOccurrenceCount || 0),
    tracksError: playlist.tracksError || '',
    hydrated: Boolean(playlist.hydrated),
    hydrating: Boolean(playlist.hydrating),
    tracks: (playlist.tracks || []).map((track, index) => ({
      id: Number(track.id || 0),
      position: Number(track.position || index + 1),
      name: track.name || '',
      artists: Array.isArray(track.artists) ? track.artists.slice() : [],
      artistEntries: normalizeTrackArtistEntries(track.artistEntries, track.artists || []).map((artist) => ({
        id: Number(artist.id || 0),
        name: artist.name,
      })),
      album: track.album || '',
      albumId: Number(track.albumId || 0),
      albumCoverUrl: track.albumCoverUrl || '',
      durationMs: Number(track.durationMs || 0),
    })),
  }
}

function buildPlaylistUndoAnchor(buttonRect) {
  if (!buttonRect) {
    return {
      preferredLeft: Math.max(12, window.innerWidth - 248),
      referenceLeft: Math.max(12, window.innerWidth - 248),
      top: 16,
    }
  }

  return {
    preferredLeft: Math.round(buttonRect.right + 12),
    referenceLeft: Math.round(buttonRect.left),
    top: Math.round(buttonRect.top - 6),
  }
}

function clearPlaylistUndoTimer() {
  window.clearTimeout(renderRuntime.playlistUndoTimer)
  renderRuntime.playlistUndoTimer = 0
}

function schedulePlaylistUndoDismiss() {
  clearPlaylistUndoTimer()
  renderRuntime.playlistUndoTimer = window.setTimeout(() => {
    dismissPlaylistUndoNotice()
  }, PLAYLIST_UNDO_NOTICE_MS)
}

function dismissPlaylistUndoNotice() {
  clearPlaylistUndoTimer()
  renderRuntime.playlistUndoNotice = null
  renderPlaylistUndoNotice()
}

function renderPlaylistUndoNotice() {
  if (!refs.playlistUndoLayer) {
    return
  }

  refs.playlistUndoLayer.replaceChildren()
  const noticeState = renderRuntime.playlistUndoNotice
  if (!noticeState?.playlist) {
    return
  }

  const notice = document.createElement('div')
  notice.className = `playlist-undo-notice${noticeState.restoring ? ' is-busy' : ''}`
  notice.innerHTML = `
    <button
      class="playlist-undo-notice__close"
      type="button"
      data-close-playlist-undo
      aria-label="${escapeHtml(TEXT.close)}"
      title="${escapeHtml(TEXT.close)}"
      ${noticeState.restoring ? 'disabled' : ''}
    >&times;</button>
    <div class="playlist-undo-notice__title">${escapeHtml(TEXT.playlistUndoPrompt)}</div>
    <div class="playlist-undo-notice__actions">
      <button
        class="playlist-undo-notice__action"
        type="button"
        data-undo-remove-playlist
        ${noticeState.restoring ? 'disabled' : ''}
      >${escapeHtml(noticeState.restoring ? TEXT.restoreSubscribedPlaylistBusy : TEXT.restoreSubscribedPlaylist)}</button>
    </div>
  `
  refs.playlistUndoLayer.appendChild(notice)

  const rect = notice.getBoundingClientRect()
  const width = Math.max(220, Math.round(rect.width || 0))
  const height = Math.max(96, Math.round(rect.height || 0))
  const anchor = noticeState.anchor || buildPlaylistUndoAnchor(null)
  let left = anchor.preferredLeft
  if (left + width > window.innerWidth - 8) {
    left = anchor.referenceLeft - width - 12
  }
  left = clamp(left, 8, Math.max(8, window.innerWidth - width - 8))
  const top = clamp(anchor.top, 8, Math.max(8, window.innerHeight - height - 8))

  notice.style.left = `${Math.round(left)}px`
  notice.style.top = `${Math.round(top)}px`
}

async function restoreRemovedSubscribedPlaylist() {
  const noticeState = renderRuntime.playlistUndoNotice
  if (!noticeState?.playlist || noticeState.restoring) {
    return
  }

  if (!appBridge || typeof appBridge.restoreSubscribedPlaylist !== 'function') {
    showToast(TEXT.restoreSubscribedPlaylistFailed, 'error')
    return
  }

  clearPlaylistUndoTimer()
  noticeState.restoring = true
  renderPlaylistUndoNotice()

  const playlistSnapshot = clonePlaylistSnapshot(noticeState.playlist)
  const result = await appBridge.restoreSubscribedPlaylist(playlistSnapshot)
  if (!result?.ok) {
    noticeState.restoring = false
    renderRuntime.playlistUndoNotice = noticeState
    renderPlaylistUndoNotice()
    schedulePlaylistUndoDismiss()
    showToast(result?.error || TEXT.restoreSubscribedPlaylistFailed, 'error')
    return
  }

  dismissPlaylistUndoNotice()
  setPlaylists(sortWallPlaylists(upsertPlaylistIntoLibrary(state.playlists, playlistSnapshot)))
  if (!(state.queuePlaylistId === null && state.currentTrackId === null)) {
    syncQueueWithPlaylists()
  }
  renderTabs()
  renderHeader()
  renderPlayer()
  applyFilters({ syncAll: true })
}

function handleSubscribedPlaylistRemovalFailed(payload) {
  const playlistSnapshot = payload?.playlist ? clonePlaylistSnapshot(payload.playlist) : null
  if (playlistSnapshot?.id) {
    if (Number(renderRuntime.playlistUndoNotice?.playlist?.id || 0) === Number(playlistSnapshot.id)) {
      dismissPlaylistUndoNotice()
    }

    setPlaylists(sortWallPlaylists(upsertPlaylistIntoLibrary(state.playlists, playlistSnapshot)))
    if (!(state.queuePlaylistId === null && state.currentTrackId === null)) {
      syncQueueWithPlaylists()
    }
    renderTabs()
    renderHeader()
    renderPlayer()
    applyFilters({ syncAll: true })
  }

  showToast(payload?.error || TEXT.removeSubscribedPlaylistFailed, 'error')
}

async function removeSubscribedPlaylistFromCard(playlistId, buttonRect) {
  const normalizedPlaylistId = Number(playlistId || 0)
  const playlist = getPlaylistById(normalizedPlaylistId)

  if (!canRemoveSubscribedPlaylist(playlist) || isSubscribedPlaylistRemoving(playlist)) {
    return
  }

  const activeUndoPlaylistId = Number(renderRuntime.playlistUndoNotice?.playlist?.id || 0)
  if (activeUndoPlaylistId > 0 && activeUndoPlaylistId !== normalizedPlaylistId) {
    showToast(TEXT.playlistUndoPending, 'error')
    return
  }

  if (!appBridge || typeof appBridge.removeSubscribedPlaylist !== 'function') {
    showToast(TEXT.removeSubscribedPlaylistFailed, 'error')
    return
  }

  renderRuntime.playlistRemovalPendingIds.add(normalizedPlaylistId)
  renderWallViewport({ force: true })

  const playlistSnapshot = clonePlaylistSnapshot(playlist)
  const result = await appBridge.removeSubscribedPlaylist(playlistSnapshot)
  renderRuntime.playlistRemovalPendingIds.delete(normalizedPlaylistId)

  if (!result?.ok) {
    renderWallViewport({ force: true })
    showToast(result?.error || TEXT.removeSubscribedPlaylistFailed, 'error')
    return
  }

  setPlaylists(sortWallPlaylists(
    state.playlists.filter((item) => Number(item.id || 0) !== normalizedPlaylistId)
  ))
  if (!(state.queuePlaylistId === null && state.currentTrackId === null)) {
    syncQueueWithPlaylists()
  }
  renderTabs()
  renderHeader()
  renderPlayer()
  applyFilters({ syncAll: true })

  renderRuntime.playlistUndoNotice = {
    playlist: playlistSnapshot,
    anchor: buildPlaylistUndoAnchor(buttonRect),
    restoring: false,
  }
  renderPlaylistUndoNotice()
  schedulePlaylistUndoDismiss()
}

function handlePlaylistUndoLayerClick(event) {
  const target = event.target instanceof Element ? event.target : null
  const undoButton = target ? target.closest('[data-undo-remove-playlist]') : null
  if (undoButton) {
    void restoreRemovedSubscribedPlaylist()
    return
  }

  const closeButton = target ? target.closest('[data-close-playlist-undo]') : null
  if (closeButton) {
    dismissPlaylistUndoNotice()
  }
}

function handleWallClick(event) {
  if (event instanceof MouseEvent && event.button !== 0) {
    return
  }

  closeContextMenu()
  hideAlbumHoverPreview()
  const target = event.target instanceof Element ? event.target : null
  const removePlaylistButton = target ? target.closest('[data-remove-subscribed-playlist]') : null
  if (removePlaylistButton) {
    void removeSubscribedPlaylistFromCard(
      Number(removePlaylistButton.getAttribute('data-remove-subscribed-playlist')),
      removePlaylistButton.getBoundingClientRect()
    )
    return
  }
  const subscribeButton = target ? target.closest('[data-subscribe-playlist]') : null
  if (subscribeButton) {
    void subscribeExplorePlaylistFromCard(Number(subscribeButton.getAttribute('data-subscribe-playlist')))
    return
  }
  const editOwnedPlaylistButton = target ? target.closest('[data-open-owned-playlist-editor]') : null
  if (editOwnedPlaylistButton) {
    void openPlaylistEditorForOwnedPlaylist(Number(editOwnedPlaylistButton.getAttribute('data-open-owned-playlist-editor')))
    return
  }
  const openSpotifyPlaylistButton = target ? target.closest('[data-open-spotify-playlist]') : null
  if (openSpotifyPlaylistButton) {
    void openSpotifyPlaylistFromCard(Number(openSpotifyPlaylistButton.getAttribute('data-open-spotify-playlist')))
    return
  }
  const artistExpansionButton = target ? target.closest('[data-toggle-artist-track-expansion]') : null
  if (artistExpansionButton) {
    toggleArtistTrackExpansion(Number(artistExpansionButton.getAttribute('data-toggle-artist-track-expansion')))
    return
  }
  const collapseButton = target ? target.closest('[data-toggle-playlist-collapse]') : null
  if (collapseButton) {
    const playlistId = Number(collapseButton.getAttribute('data-toggle-playlist-collapse'))
    if (consumeSuppressedPlaylistCollapseClick(playlistId)) {
      return
    }

    togglePlaylistCollapsed(playlistId)
    return
  }
  const addButton = target ? target.closest('[data-add-recommend-track]') : null
  if (addButton) {
    clearTrackSelection()
    addRecommendedTrackToPlaylist(
      Number(addButton.getAttribute('data-playlist-id')),
      Number(addButton.getAttribute('data-track-id'))
    )
    return
  }
  const recommendationRow = target ? target.closest('[data-play-recommend-track]') : null
  if (recommendationRow) {
    clearTrackSelection()
    playRecommendedTrack(
      Number(recommendationRow.getAttribute('data-playlist-id')),
      Number(recommendationRow.getAttribute('data-track-id'))
    )
    return
  }
  const row = target ? target.closest('[data-play-track]') : null
  if (!row) {
    clearTrackSelection()
    return
  }

  if (handleTrackSelectionClick(event, row)) {
    return
  }

  const rowInfo = getTrackRowSelectionInfo(row)
  if (rowInfo) {
    renderRuntime.trackRangeAnchorKey = rowInfo.key
  }
  clearTrackSelection()
  playFromPlaylist(Number(row.dataset.playlistId), Number(row.dataset.trackId))
}

function handleWallContextMenu(event) {
  hideAlbumHoverPreview()
  const target = event.target instanceof Element ? event.target : null
  const context = resolveTrackContextMenuState(target)

  if (!context) {
    closeContextMenu()
    return
  }

  event.preventDefault()
  renderRuntime.contextMenuTrack = context
  openContextMenu(event.clientX, event.clientY)
}

function openContextMenu(clientX, clientY) {
  renderContextMenu()
  renderRuntime.contextMenuOpenedAt = Date.now()
  refs.contextMenu.classList.remove('hidden', 'context-menu--submenu-left')
  refs.contextMenu.style.left = '0px'
  refs.contextMenu.style.top = '0px'

  const viewportPadding = 8
  const menuWidth = refs.contextMenu.offsetWidth || 224
  const menuHeight = refs.contextMenu.offsetHeight || 52
  const left = clamp(
    clientX,
    viewportPadding,
    Math.max(viewportPadding, window.innerWidth - menuWidth - viewportPadding)
  )
  const top = clamp(
    clientY,
    viewportPadding,
    Math.max(viewportPadding, window.innerHeight - menuHeight - viewportPadding)
  )
  refs.contextMenu.style.left = `${left}px`
  refs.contextMenu.style.top = `${top}px`

  const submenuEntries = [...refs.contextMenu.querySelectorAll('.context-menu-group')]
    .map((group) => ({
      group,
      submenu: group.querySelector('.context-menu-submenu'),
    }))
    .filter(({ group, submenu }) => group instanceof HTMLElement && submenu instanceof HTMLElement)
  if (!submenuEntries.length) {
    return
  }

  const submenuWidth = submenuEntries.reduce(
    (maxWidth, entry) => Math.max(maxWidth, entry.submenu.offsetWidth || 180),
    180
  )
  const spaceRight = window.innerWidth - (left + menuWidth) - viewportPadding
  const spaceLeft = left - viewportPadding
  if (spaceRight < submenuWidth && spaceLeft > spaceRight) {
    refs.contextMenu.classList.add('context-menu--submenu-left')
  }

  for (const entry of submenuEntries) {
    const submenuHeight = entry.submenu.offsetHeight || Math.min(480, entry.submenu.scrollHeight + 8)
    const submenuTop = clamp(
      top + entry.group.offsetTop,
      viewportPadding,
      Math.max(viewportPadding, window.innerHeight - submenuHeight - viewportPadding)
    ) - top - entry.group.offsetTop
    entry.submenu.style.setProperty('--context-menu-submenu-top', `${submenuTop}px`)
  }
}

function closeContextMenu() {
  renderRuntime.contextMenuTrack = null
  renderRuntime.contextMenuOpenedAt = 0
  refs.contextMenu.classList.add('hidden')
  refs.contextMenu.classList.remove('context-menu--submenu-left')
  refs.contextMenu.replaceChildren()
}

function shouldKeepContextMenuOpenOnScroll() {
  return !refs.contextMenu.classList.contains('hidden')
    && (Date.now() - Number(renderRuntime.contextMenuOpenedAt || 0)) < CONTEXT_MENU_SCROLL_GUARD_MS
}

function createContextMenuButton(item) {
  const button = document.createElement('button')
  button.className = 'context-menu-item'
  button.type = 'button'

  if (item.className) {
    button.classList.add(item.className)
  }
  if (item.id) {
    button.id = item.id
  }
  if (item.action) {
    button.dataset.contextAction = item.action
  }
  if (item.playlistId) {
    button.dataset.targetPlaylistId = String(item.playlistId)
  }
  if (item.artistPlaylistId) {
    button.dataset.targetArtistPlaylistId = String(item.artistPlaylistId)
  }
  if (item.artistKey) {
    button.dataset.artistKey = item.artistKey
  }
  if (item.artistId) {
    button.dataset.artistId = String(item.artistId)
  }
  if (item.seedTrackId) {
    button.dataset.seedTrackId = String(item.seedTrackId)
  }
  if (item.searchQuery) {
    button.dataset.searchQuery = item.searchQuery
  }
  if (item.disabled) {
    button.disabled = true
  }
  if (item.hint) {
    const label = document.createElement('span')
    label.className = 'context-menu-item__label'
    label.textContent = item.label

    const hint = document.createElement('span')
    hint.className = 'context-menu-item__hint'
    hint.textContent = item.hint

    button.append(label, hint)
  } else {
    button.textContent = item.label
  }

  return button
}

function renderContextMenu() {
  const context = renderRuntime.contextMenuTrack
  if (!context) {
    refs.contextMenu.replaceChildren()
    return
  }

  const items = buildContextMenuItems(context)
  const fragment = document.createDocumentFragment()

  for (const item of items) {
    if (item.type === 'divider') {
      const divider = document.createElement('div')
      divider.className = 'context-menu-divider'
      fragment.appendChild(divider)
      continue
    }

    if (item.type === 'submenu') {
      const group = document.createElement('div')
      group.className = 'context-menu-group'

      const trigger = createContextMenuButton({
        className: 'context-menu-item--submenu-trigger',
        hint: '>',
        label: item.label,
      })
      trigger.setAttribute('aria-haspopup', 'menu')

      const submenu = document.createElement('div')
      submenu.className = 'context-menu-submenu'

      for (const child of item.children) {
        submenu.appendChild(createContextMenuButton(child))
      }

      group.append(trigger, submenu)
      fragment.appendChild(group)
      continue
    }

    fragment.appendChild(createContextMenuButton(item))
  }

  refs.contextMenu.replaceChildren(fragment)
}

function buildContextMenuItems(context) {
  const pinToTopPlan = getContextMenuPinToTopPlan(context)
  const transferItems = (context.transferTargets || []).length
    ? context.transferTargets.map((target) => ({
      action: 'transfer-track',
      label: target.name,
      type: 'button',
      playlistId: target.id,
      disabled: target.disabled,
    }))
    : [{
      action: 'transfer-track',
      label: TEXT.noMoveTarget,
      type: 'button',
      disabled: true,
    }]

  const items = []

  if (canOpenSpotifyTrack(context?.track)) {
    items.push({
      action: 'open-track-in-spotify',
      label: TEXT.spotifyOpenTrack,
      type: 'button',
    })
  }

  if (!canOpenSpotifyTrack(context?.track) || (context.transferTargets || []).length) {
    if (items.length) {
      items.push({ type: 'divider' })
    }

    items.push({
      children: transferItems,
      label: context.transferLabel || '\u52a0\u5165\u5230',
      type: 'submenu',
    })
  }

  if (pinToTopPlan || context.canRemove) {
    if (items.length) {
      items.push({ type: 'divider' })
    }
    if (pinToTopPlan) {
      items.push({
        action: 'pin-track-to-top',
        id: 'context-pin-track-btn',
        label: TEXT.pinToTop,
        type: 'button',
      })
    }
  }

  if (context.canRemove) {
    items.push({
      action: 'remove-track',
      id: 'context-remove-track-btn',
      label: TEXT.removeFromPlaylist,
      type: 'button',
    })
  }

  const artistTargets = (context.artistTargets || []).map((target) => ({
    action: 'go-to-artist-playlist',
    artistKey: target.key,
    artistPlaylistId: target.playlistId,
    disabled: target.disabled,
    label: target.name,
    type: 'button',
  }))
  const artistExploreTargets = (context.artistExploreTargets || []).map((target) => ({
    action: 'search-artist-community-playlists',
    artistId: target.artistId,
    artistKey: target.key,
    seedTrackId: target.seedTrackId,
    disabled: target.disabled,
    label: target.name,
    searchQuery: target.searchQuery,
    type: 'button',
  }))

  if (artistExploreTargets.length) {
    if (items.length) {
      items.push({ type: 'divider' })
    }
    if (artistExploreTargets.length === 1) {
      items.push({
        ...artistExploreTargets[0],
        id: 'context-search-artist-community-playlists-btn',
        label: TEXT.searchArtistCommunityPlaylists,
      })
    } else {
      items.push({
        children: artistExploreTargets,
        label: TEXT.searchArtistCommunityPlaylists,
        type: 'submenu',
      })
    }
  }

  if (artistTargets.length) {
    if (items.length) {
      items.push({ type: 'divider' })
    }
    if (artistTargets.length === 1) {
      items.push({
        ...artistTargets[0],
        label: TEXT.goToArtistPlaylist,
      })
    } else {
      items.push({
        children: artistTargets,
        label: TEXT.goToArtistPlaylist,
        type: 'submenu',
      })
    }
  }

  return items
}

function getContextMenuPinToTopPlan(context) {
  const playlistId = Number(context?.playlistId || 0)
  const trackId = Number(context?.trackId || 0)
  const trackIds = (context?.tracks || [context?.track])
    .map((track) => Number(track?.id || 0))
    .filter((id) => id > 0)

  if (playlistId <= 0 || trackId <= 0 || !trackIds.length) {
    return null
  }

  return buildTrackMovePlan({
    sourcePlaylistId: playlistId,
    targetPlaylistId: playlistId,
    trackId,
    trackIds,
    targetIndex: 0,
  })
}

function resolveTrackContextMenuState(target) {
  if (!(target instanceof Element)) {
    return null
  }

  const recommendationRow = target.closest('.recommendation-row[data-playlist-id][data-track-id]')
  if (recommendationRow) {
    clearTrackSelection()
    const playlistId = Number(recommendationRow.getAttribute('data-playlist-id'))
    const trackId = Number(recommendationRow.getAttribute('data-track-id'))
    const playlist = getPlaylistById(playlistId)
    const recommendationState = ensureRecommendationState(playlistId)
    const track = recommendationState.tracks.find((item) => item.id === trackId)
      || recommendationState.poolTracks.find((item) => item.id === trackId)

    if (!playlist || !track) {
      return null
    }

    return {
      canRemove: false,
      artistExploreTargets: getArtistExploreContextTargets(track),
      artistTargets: getArtistContextTargets(track),
      keepSource: true,
      playlistId,
      sourceType: 'recommendation',
      track,
      trackId,
      transferLabel: '\u52a0\u5165\u5230',
      transferTargets: getRecommendedTransferTargets(track),
    }
  }

  const row = target.closest('[data-play-track]')
  if (!row) {
    return null
  }

  const info = ensureTrackSelectionForContextRow(row)
  const playlistId = Number(info?.playlistId || row.getAttribute('data-playlist-id'))
  const trackId = Number(info?.trackId || row.getAttribute('data-track-id'))
  const playlist = getPlaylistById(playlistId)
  const tracks = getSelectedPlaylistTracks(playlistId)
  const track = tracks[0] || playlist?.tracks.find((item) => item.id === trackId)

  if (!playlist || !track) {
    return null
  }

  const keepSource = !isOwnedPlaylist(playlist) || isLikedPlaylist(playlist)
  const importedReadOnly = isImportedReadOnlyPlaylist(playlist)
  return {
    canRemove: isOwnedPlaylist(playlist) && !importedReadOnly,
    artistExploreTargets: tracks.length > 1 ? [] : getArtistExploreContextTargets(track),
    artistTargets: tracks.length > 1
      ? []
      : getArtistContextTargets(track, {
        excludeArtistKey: playlist.isArtist ? playlist.artistKey : '',
      }),
    keepSource,
    playlistId,
    sourceType: 'playlist',
    track,
    trackId,
    trackCount: Math.max(1, tracks.length),
    tracks: tracks.length ? tracks : [track],
    transferLabel: keepSource ? '\u52a0\u5165\u5230' : '\u79fb\u52a8\u5230',
    transferTargets: importedReadOnly
      ? []
      : getRecommendedTransferTargets(tracks.length ? tracks : [track], {
        excludePlaylistIds: [playlist.id],
      }),
  }
}

function getRecommendedTransferTargets(trackInput, options = {}) {
  const tracks = (Array.isArray(trackInput) ? trackInput : [trackInput])
    .filter((track) => track && Number(track.id) > 0)

  if (!tracks.length) {
    return []
  }

  if (tracks.some((track) => String(track?.sourcePlatform || '').trim() === 'spotify')) {
    return []
  }

  const excludedIds = new Set((options.excludePlaylistIds || []).map((id) => Number(id)).filter((id) => id > 0))
  const candidates = getOwnedPlaylists()
    .filter((playlist) => !excludedIds.has(playlist.id) && !playlist.tracksError)
    .map((playlist) => {
      const transferableTracks = tracks.filter((track) => !playlist.tracks.some((item) => item.id === track.id))
      const availableCount = transferableTracks.length
      const alreadyContains = availableCount === 0
      const scoreTracks = availableCount ? transferableTracks : tracks
      return {
        playlist,
        availableCount,
        alreadyContains,
        score: alreadyContains
          ? -1
          : scoreTracks.reduce((sum, track) => sum + scoreTrackAgainstPlaylist(track, playlist), 0) / scoreTracks.length,
        fallbackScore: alreadyContains
          ? -1
          : scoreTracks.reduce((sum, track) => sum + scoreTrackAgainstPlaylist(
            { ...track, artists: [track.name, ...track.artists], album: '', albumId: 0 },
            { profile: { artistCounts: {}, albumCounts: {}, searchText: playlist.searchText } },
            { useIdf: false },
          ), 0) / scoreTracks.length,
      }
    })

  return candidates
    .sort((left, right) =>
      Number(right.alreadyContains) - Number(left.alreadyContains)
      || right.availableCount - left.availableCount
      || right.score - left.score
      || right.fallbackScore - left.fallbackScore
      || right.playlist.trackCount - left.playlist.trackCount
      || left.playlist.id - right.playlist.id)
    .map((entry) => ({
      id: entry.playlist.id,
      name: entry.playlist.name,
      disabled: entry.alreadyContains,
    }))
}

function getArtistContextTargets(track, options = {}) {
  const excludeArtistKey = normalizeQuery(options.excludeArtistKey || '')
  return getTrackArtistEntries(track).flatMap((artist) => {
    if (artist.key === excludeArtistKey) {
      return []
    }

    const playlistId = Number(state.artistPlaylistIdByKey.get(artist.key) || 0)
    return [{
      key: artist.key,
      name: artist.name,
      playlistId,
      disabled: !playlistId || artist.key === excludeArtistKey,
    }]
  })
}

function getArtistExploreContextTargets(track) {
  return getTrackArtistEntries(track).flatMap((artist) => {
    const searchQuery = String(artist.name || '').trim()
    if (!searchQuery) {
      return []
    }

    return [{
      artistId: Number(artist.id || 0),
      key: artist.key,
      name: artist.name,
      seedTrackId: Number(track?.id || 0),
      searchQuery,
      disabled: false,
    }]
  })
}

function updateTrackFocusFlashState(trackKey, isFlashing, { restart = false } = {}) {
  const { playlistId, trackId } = parseTrackSelectionKey(trackKey)
  if (!playlistId || !trackId) {
    return
  }

  const row = refs.wallColumns.querySelector(`.track-row[data-playlist-id="${playlistId}"][data-track-id="${trackId}"]`)
  if (!row) {
    return
  }

  if (restart) {
    row.classList.remove('is-focus-flash')
    void row.offsetWidth
  }

  row.classList.toggle('is-focus-flash', isFlashing)
}

function flashTrackFocus(playlistId, trackId) {
  const trackKey = getTrackSelectionKey(playlistId, trackId)
  if (!trackKey) {
    return
  }

  window.clearTimeout(renderRuntime.focusFlashTimer)
  renderRuntime.focusFlashTimer = 0

  if (renderRuntime.focusFlashTrackKey) {
    updateTrackFocusFlashState(renderRuntime.focusFlashTrackKey, false)
  }

  renderRuntime.focusFlashTrackKey = trackKey
  updateTrackFocusFlashState(trackKey, true, { restart: true })

  renderRuntime.focusFlashTimer = window.setTimeout(() => {
    updateTrackFocusFlashState(trackKey, false)
    if (renderRuntime.focusFlashTrackKey === trackKey) {
      renderRuntime.focusFlashTrackKey = ''
    }
    renderRuntime.focusFlashTimer = 0
  }, TRACK_FOCUS_FLASH_MS)
}

function ensureArtistTrackVisibleInPlaylist(playlistId, trackId) {
  const playlist = getPlaylistById(playlistId)
  if (!playlist?.isArtist || !playlist.artistKey) {
    return false
  }

  if ((playlist.tracks || []).some((track) => Number(track.id || 0) === Number(trackId || 0))) {
    return false
  }

  const entry = state.artistPlaylistEntriesByKey.get(playlist.artistKey)
  const sourceTrack = entry?.trackMap?.get(Number(trackId || 0))
  if (!sourceTrack) {
    return false
  }

  const nextTracks = [toArtistTrackOutput(sourceTrack), ...(playlist.tracks || [])]
  const nextPlaylist = normalizePlaylist({
    ...playlist,
    _normalized: false,
    trackCount: Math.max(Number(playlist.trackCount || 0), nextTracks.length),
    tracks: nextTracks,
  })
  if (!replaceArtistPlaylistByKey(playlist.artistKey, nextPlaylist)) {
    return false
  }

  applyFilters({ syncAll: true })
  return true
}

async function focusTrackRowInPlaylist(playlistId, trackId) {
  const normalizedPlaylistId = Number(playlistId || 0)
  const normalizedTrackId = Number(trackId || 0)
  if (!normalizedPlaylistId || !normalizedTrackId) {
    return null
  }

  if (setPlaylistCollapsed(normalizedPlaylistId, false, { persist: true, rerender: true })) {
    await new Promise((resolve) => window.requestAnimationFrame(() => window.requestAnimationFrame(resolve)))
  }

  const anchor = renderRuntime.wallTrackAnchors.get(`${normalizedPlaylistId}:${normalizedTrackId}`)
  if (anchor) {
    const targetTop = clamp(
      Math.round(anchor.top - refs.wallScroll.clientHeight * 0.35),
      0,
      Math.max(0, refs.wallScroll.scrollHeight - refs.wallScroll.clientHeight)
    )
    refs.wallScroll.scrollTop = targetTop
    renderWallViewport({ force: true })
  }

  await new Promise((resolve) => window.requestAnimationFrame(() => window.requestAnimationFrame(resolve)))

  const row = refs.wallColumns.querySelector(`.track-row[data-playlist-id="${normalizedPlaylistId}"][data-track-id="${normalizedTrackId}"]`)
  if (!(row instanceof HTMLElement)) {
    if (!ensureArtistTrackVisibleInPlaylist(normalizedPlaylistId, normalizedTrackId)) {
      return null
    }

    await new Promise((resolve) => window.requestAnimationFrame(() => window.requestAnimationFrame(resolve)))
    const fallbackRow = refs.wallColumns.querySelector(`.track-row[data-playlist-id="${normalizedPlaylistId}"][data-track-id="${normalizedTrackId}"]`)
    if (!(fallbackRow instanceof HTMLElement)) {
      return null
    }

    flashTrackFocus(normalizedPlaylistId, normalizedTrackId)
    return fallbackRow
  }

  flashTrackFocus(normalizedPlaylistId, normalizedTrackId)
  return row
}

async function focusPlaylistCardInTab(tab, playlistId, options = {}) {
  const normalizedPlaylistId = Number(playlistId || 0)
  if (normalizedPlaylistId === 0) {
    showToast(options.errorMessage || TEXT.locateFailed, 'error')
    return false
  }

  if (state.activeTab !== tab) {
    activateTab(tab, { restoreTargetScroll: false })
  }

  if (state.search) {
    await clearSearch({ syncAll: true })
  } else {
    applyFilters({ syncAll: true })
  }

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const placement = getWallPlacementByPlaylistId(normalizedPlaylistId)
    if (placement) {
      const targetTop = clamp(
        Math.round(placement.top - refs.wallScroll.clientHeight * 0.28),
        0,
        Math.max(0, refs.wallScroll.scrollHeight - refs.wallScroll.clientHeight)
      )
      refs.wallScroll.scrollTop = targetTop
      renderWallViewport({ force: true })
    }

    await new Promise((resolve) => window.requestAnimationFrame(() => window.requestAnimationFrame(resolve)))

    const card = refs.wallColumns.querySelector(`.playlist-card[data-playlist-id="${normalizedPlaylistId}"]`)
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
      if (options.successMessage) {
        showToast(options.successMessage)
      }
      return true
    }
  }

  showToast(options.errorMessage || TEXT.locateFailed, 'error')
  return false
}

async function jumpToArtistPlaylistFromContextMenu(artistPlaylistId, artistKey = '') {
  const sourceTrackId = Number(renderRuntime.contextMenuTrack?.trackId || 0)
  closeContextMenu()

  const normalizedArtistKey = normalizeQuery(artistKey)
  const targetPlaylistId = Number(artistPlaylistId || state.artistPlaylistIdByKey.get(normalizedArtistKey) || 0)
  if (!targetPlaylistId) {
    showToast(TEXT.goToArtistPlaylistFailed, 'error')
    return
  }

  const focused = await focusPlaylistCardInTab('artists', targetPlaylistId, {
    errorMessage: TEXT.goToArtistPlaylistFailed,
  })
  if (!focused) {
    return
  }

  if (sourceTrackId) {
    await focusTrackRowInPlaylist(targetPlaylistId, sourceTrackId)
  }

  showToast(TEXT.goToArtistPlaylistDone)
}

async function searchArtistCommunityPlaylistsFromContextMenu(searchQuery = '', artistKey = '', artistId = 0, seedTrackId = 0) {
  closeContextMenu()

  const normalizedQuery = String(searchQuery || '').trim()
  if (!normalizedQuery) {
    showToast(TEXT.searchArtistCommunityPlaylistsFailed, 'error')
    return
  }

  if (!canUseNeteaseFeatures()) {
    showToast(TEXT.exploreRequiresNetease, 'error')
    return
  }

  setSearchState(normalizedQuery)

  if (state.activeTab !== 'explore') {
    activateTab('explore', { restoreTargetScroll: false })
  }

  await loadExplorePlaylists(normalizedQuery, {
    force: true,
    limit: 36,
    artistRef: Number(artistId || 0) > 0 ? Number(artistId || 0) : normalizedQuery,
    artistName: normalizedQuery,
    seedTrackId: Number(seedTrackId || 0),
  })
}

async function openExternalUrl(url, failureText = TEXT.spotifyOpenFailed) {
  const normalizedUrl = String(url || '').trim()
  if (!normalizedUrl) {
    showToast(failureText, 'error')
    return false
  }

  try {
    if (appBridge && typeof appBridge.openExternalUrl === 'function') {
      const result = await appBridge.openExternalUrl(normalizedUrl)
      if (!result?.ok) {
        showToast(result?.error || failureText, 'error')
        return false
      }

      return true
    }

    const opened = window.open(normalizedUrl, '_blank', 'noopener,noreferrer')
    if (!opened) {
      showToast(failureText, 'error')
      return false
    }

    return true
  } catch (error) {
    showToast(error?.message || failureText, 'error')
    return false
  }
}

async function openSpotifyPlaylistFromCard(playlistId) {
  const playlist = getPlaylistById(playlistId)
  if (!canOpenSpotifyPlaylist(playlist)) {
    showToast(TEXT.spotifyOpenFailed, 'error')
    return
  }

  await openExternalUrl(playlist.externalUrl, TEXT.spotifyOpenFailed)
}

async function openSpotifyTrackFromContextMenu() {
  const track = renderRuntime.contextMenuTrack?.track || null
  closeContextMenu()

  if (!canOpenSpotifyTrack(track)) {
    showToast(TEXT.spotifyOpenFailed, 'error')
    return
  }

  await openExternalUrl(track.externalUrl, TEXT.spotifyOpenFailed)
}

async function pinTracksToTopFromContextMenu() {
  const context = renderRuntime.contextMenuTrack
  closeContextMenu()

  const plan = getContextMenuPinToTopPlan(context)
  if (!plan) {
    return
  }

  await commitTrackMovePlan(plan)
  clearTrackSelection()
}

function handleContextMenuClick(event) {
  const target = event.target instanceof Element ? event.target.closest('[data-context-action]') : null
  if (!target || !(target instanceof HTMLButtonElement) || target.disabled) {
    return
  }

  const action = target.dataset.contextAction || ''
  if (action === 'open-track-in-spotify') {
    void openSpotifyTrackFromContextMenu()
    return
  }

  if (action === 'remove-track') {
    void removeTrackFromContextMenu()
    return
  }

  if (action === 'pin-track-to-top') {
    void pinTracksToTopFromContextMenu()
    return
  }

  if (action === 'transfer-track') {
    void transferTrackFromContextMenu(Number(target.dataset.targetPlaylistId))
    return
  }

  if (action === 'go-to-artist-playlist') {
    void jumpToArtistPlaylistFromContextMenu(
      Number(target.dataset.targetArtistPlaylistId),
      target.dataset.artistKey || ''
    )
    return
  }

  if (action === 'search-artist-community-playlists') {
    void searchArtistCommunityPlaylistsFromContextMenu(
      target.dataset.searchQuery || '',
      target.dataset.artistKey || '',
      Number(target.dataset.artistId || 0),
      Number(target.dataset.seedTrackId || 0)
    )
  }
}

function handleWallPointerOver(event) {
  const target = event.target instanceof Element ? event.target : null
  const row = target ? target.closest('[data-play-track]') : null
  if (!row) {
    return
  }

  const related = event.relatedTarget instanceof Element ? event.relatedTarget.closest('[data-play-track]') : null
  if (related === row) {
    return
  }

  scheduleAlbumHoverPreview(row)
}

function handleWallPointerOut(event) {
  const target = event.target instanceof Element ? event.target : null
  const row = target ? target.closest('[data-play-track]') : null
  if (!row) {
    return
  }

  const related = event.relatedTarget instanceof Element ? event.relatedTarget.closest('[data-play-track]') : null
  if (related === row) {
    return
  }

  const rowKey = getTrackRowKey(row)
  if (renderRuntime.albumHoverPendingKey === rowKey || renderRuntime.albumHoverTrackKey === rowKey) {
    hideAlbumHoverPreview()
  }
}

function scheduleAlbumHoverPreview(row) {
  const albumCoverUrl = row.getAttribute('data-album-cover-url') || ''
  const rowKey = getTrackRowKey(row)

  if (!albumCoverUrl) {
    hideAlbumHoverPreview()
    return
  }

  if (renderRuntime.albumHoverTrackKey === rowKey && !refs.albumHoverPreview.classList.contains('hidden')) {
    positionAlbumHoverPreview()
    return
  }

  if (renderRuntime.albumHoverPendingKey === rowKey) {
    return
  }

  window.clearTimeout(renderRuntime.albumHoverTimer)
  renderRuntime.albumHoverPendingKey = rowKey
  renderRuntime.albumHoverTimer = window.setTimeout(() => {
    showAlbumHoverPreview(row)
  }, ALBUM_HOVER_DELAY_MS)
}

function showAlbumHoverPreview(row) {
  const albumCoverUrl = row.getAttribute('data-album-cover-url') || ''
  const rowKey = getTrackRowKey(row)
  if (!albumCoverUrl || renderRuntime.albumHoverPendingKey !== rowKey) {
    return
  }

  renderRuntime.albumHoverTimer = 0
  renderRuntime.albumHoverPendingKey = ''
  renderRuntime.albumHoverTrackKey = rowKey
  refs.albumHoverPreviewImage.src = albumCoverUrl
  refs.albumHoverPreviewImage.alt = `${row.getAttribute('data-track-name') || '歌曲'} 专辑封面`
  refs.albumHoverPreview.classList.remove('hidden')
  positionAlbumHoverPreview()
}

function hideAlbumHoverPreview() {
  window.clearTimeout(renderRuntime.albumHoverTimer)
  renderRuntime.albumHoverTimer = 0
  renderRuntime.albumHoverPendingKey = ''
  renderRuntime.albumHoverTrackKey = ''
  refs.albumHoverPreview.classList.add('hidden')
  refs.albumHoverPreview.style.left = ''
  refs.albumHoverPreview.style.top = ''
  refs.albumHoverPreviewImage.removeAttribute('src')
  refs.albumHoverPreviewImage.alt = ''
}

function positionAlbumHoverPreview() {
  if (refs.albumHoverPreview.classList.contains('hidden')) {
    return
  }

  const metrics = getLayoutMetrics()

  const row = refs.wallColumns.querySelector(`.track-row[data-playlist-id="${renderRuntime.albumHoverTrackKey.split(':')[0] || ''}"][data-track-id="${renderRuntime.albumHoverTrackKey.split(':')[1] || ''}"]`)
  if (!row) {
    hideAlbumHoverPreview()
    return
  }

  const previewWidth = refs.albumHoverPreview.offsetWidth || 112
  const previewHeight = refs.albumHoverPreview.offsetHeight || 112
  const rowRect = row.getBoundingClientRect()
  const left = clamp(
    Math.round(rowRect.right - previewWidth),
    metrics.albumHoverPadding,
    Math.max(metrics.albumHoverPadding, window.innerWidth - previewWidth - metrics.albumHoverPadding)
  )
  let top = rowRect.top - previewHeight - metrics.albumHoverGap
  if (top < metrics.albumHoverPadding) {
    top = rowRect.bottom + metrics.albumHoverGap
  }
  top = clamp(
    Math.round(top),
    metrics.albumHoverPadding,
    Math.max(metrics.albumHoverPadding, window.innerHeight - previewHeight - metrics.albumHoverPadding)
  )

  refs.albumHoverPreview.style.left = `${left}px`
  refs.albumHoverPreview.style.top = `${top}px`
}

function getTrackRowKey(row) {
  return `${row.getAttribute('data-playlist-id') || ''}:${row.getAttribute('data-track-id') || ''}`
}

function getTrackSelectionKey(playlistId, trackId) {
  return `${Number(playlistId) || 0}:${Number(trackId) || 0}`
}

function parseTrackSelectionKey(key) {
  const [playlistId, trackId] = String(key || '').split(':').map((value) => Number(value || 0))
  return { playlistId, trackId }
}

function getTrackRowSelectionInfo(row) {
  if (!(row instanceof Element)) {
    return null
  }

  const playlistId = Number(row.getAttribute('data-playlist-id'))
  const trackId = Number(row.getAttribute('data-track-id'))
  if (playlistId <= 0 || trackId <= 0) {
    return null
  }

  return {
    key: getTrackSelectionKey(playlistId, trackId),
    playlistId,
    trackId,
  }
}

function isTrackSelected(playlistId, trackId) {
  return renderRuntime.selectedTrackKeys.has(getTrackSelectionKey(playlistId, trackId))
}

function syncTrackSelectionState() {
  if (!refs.wallColumns) {
    return
  }

  refs.wallColumns.querySelectorAll('.track-row[data-play-track]').forEach((row) => {
    const info = getTrackRowSelectionInfo(row)
    const selected = info ? renderRuntime.selectedTrackKeys.has(info.key) : false
    row.classList.toggle('is-selected', selected)
    row.setAttribute('aria-selected', String(selected))
  })
}

function clearTrackSelection() {
  const hadSelection = renderRuntime.selectedTrackKeys.size > 0
  renderRuntime.selectedTrackKeys = new Set()
  renderRuntime.selectedTrackAnchorKey = ''
  renderRuntime.selectedPlaylistId = 0

  if (hadSelection) {
    syncTrackSelectionState()
  }
}

function setTrackSelection(keys, { anchorKey = '' } = {}) {
  const normalizedKeys = [...new Set((keys || []).filter(Boolean))]
  renderRuntime.selectedTrackKeys = new Set(normalizedKeys)

  if (!normalizedKeys.length) {
    renderRuntime.selectedTrackAnchorKey = ''
    renderRuntime.selectedPlaylistId = 0
    syncTrackSelectionState()
    return
  }

  const { playlistId } = parseTrackSelectionKey(normalizedKeys[0])
  renderRuntime.selectedPlaylistId = playlistId
  renderRuntime.selectedTrackAnchorKey = normalizedKeys.includes(anchorKey)
    ? anchorKey
    : normalizedKeys[normalizedKeys.length - 1]
  renderRuntime.trackRangeAnchorKey = renderRuntime.selectedTrackAnchorKey
  syncTrackSelectionState()
}

function getTrackRangeAnchorInfo(playlistId) {
  const normalizedPlaylistId = Number(playlistId || 0)
  if (normalizedPlaylistId <= 0) {
    return null
  }

  if (
    renderRuntime.selectedTrackKeys.size
    && Number(renderRuntime.selectedPlaylistId || 0) === normalizedPlaylistId
  ) {
    const selectedAnchor = parseTrackSelectionKey(renderRuntime.selectedTrackAnchorKey)
    if (selectedAnchor.playlistId === normalizedPlaylistId && selectedAnchor.trackId > 0) {
      return selectedAnchor
    }
  }

  const rangeAnchor = parseTrackSelectionKey(renderRuntime.trackRangeAnchorKey)
  if (rangeAnchor.playlistId === normalizedPlaylistId && rangeAnchor.trackId > 0) {
    return rangeAnchor
  }

  return null
}

function getSelectableTracksForPlaylist(playlistId) {
  const visiblePlaylist = state.visiblePlaylists.find((playlist) => playlist.id === Number(playlistId))
  if (visiblePlaylist) {
    return visiblePlaylist.wallTracks || []
  }

  return getPlaylistById(playlistId)?.tracks || []
}

function buildTrackSelectionRange(playlistId, anchorTrackId, targetTrackId) {
  const tracks = getSelectableTracksForPlaylist(playlistId)
  const fallbackKey = getTrackSelectionKey(playlistId, targetTrackId)
  if (!tracks.length) {
    return [fallbackKey]
  }

  const anchorIndex = tracks.findIndex((track) => track.id === Number(anchorTrackId))
  const targetIndex = tracks.findIndex((track) => track.id === Number(targetTrackId))
  if (anchorIndex === -1 || targetIndex === -1) {
    return [fallbackKey]
  }

  const start = Math.min(anchorIndex, targetIndex)
  const end = Math.max(anchorIndex, targetIndex)
  return tracks.slice(start, end + 1).map((track) => getTrackSelectionKey(playlistId, track.id))
}

function handleTrackSelectionClick(event, row) {
  const info = getTrackRowSelectionInfo(row)
  if (!info) {
    return false
  }

  const toggleSelection = Boolean(event.ctrlKey || event.metaKey)
  const rangeSelection = Boolean(event.shiftKey)
  if (!toggleSelection && !rangeSelection) {
    return false
  }

  const samePlaylistSelection = renderRuntime.selectedTrackKeys.size > 0
    && Number(renderRuntime.selectedPlaylistId || 0) === info.playlistId
  if (rangeSelection) {
    const anchor = getTrackRangeAnchorInfo(info.playlistId)
    const rangeKeys = buildTrackSelectionRange(
      info.playlistId,
      anchor?.trackId || info.trackId,
      info.trackId
    )
    setTrackSelection(rangeKeys, { anchorKey: info.key })
    return true
  }

  if (!samePlaylistSelection) {
    setTrackSelection([info.key], { anchorKey: info.key })
    return true
  }

  const nextKeys = new Set(renderRuntime.selectedTrackKeys)
  if (nextKeys.has(info.key)) {
    nextKeys.delete(info.key)
  } else {
    nextKeys.add(info.key)
  }

  setTrackSelection([...nextKeys], { anchorKey: info.key })
  return true
}

function getSelectedPlaylistTracks(playlistId) {
  const playlist = getPlaylistById(playlistId)
  if (!playlist) {
    return []
  }

  return playlist.tracks.filter((track) =>
    renderRuntime.selectedTrackKeys.has(getTrackSelectionKey(playlistId, track.id))
  )
}

function ensureTrackSelectionForContextRow(row) {
  const info = getTrackRowSelectionInfo(row)
  if (!info) {
    return null
  }

  if (!isTrackSelected(info.playlistId, info.trackId) || Number(renderRuntime.selectedPlaylistId || 0) !== info.playlistId) {
    setTrackSelection([info.key], { anchorKey: info.key })
  }

  return info
}

function pruneTrackSelection() {
  if (!renderRuntime.selectedTrackKeys.size) {
    return
  }

  const playlistId = Number(renderRuntime.selectedPlaylistId || 0)
  if (playlistId <= 0) {
    clearTrackSelection()
    return
  }

  const visiblePlaylist = state.visiblePlaylists.find((playlist) => playlist.id === playlistId)
  if (!visiblePlaylist) {
    clearTrackSelection()
    return
  }

  const nextKeys = (visiblePlaylist.wallTracks || [])
    .map((track) => getTrackSelectionKey(playlistId, track.id))
    .filter((key) => renderRuntime.selectedTrackKeys.has(key))

  if (!nextKeys.length) {
    clearTrackSelection()
    return
  }

  const anchorKey = nextKeys.includes(renderRuntime.selectedTrackAnchorKey)
    ? renderRuntime.selectedTrackAnchorKey
    : nextKeys[nextKeys.length - 1]

  if (
    nextKeys.length !== renderRuntime.selectedTrackKeys.size
    || anchorKey !== renderRuntime.selectedTrackAnchorKey
  ) {
    setTrackSelection(nextKeys, { anchorKey })
  }
}

function handleDocumentPointerDown(event) {
  if (refs.contextMenu.classList.contains('hidden')) {
    hideAlbumHoverPreview()
    return
  }

  const target = event.target instanceof Element ? event.target : null
  if (target && refs.contextMenu.contains(target)) {
    return
  }

  closeContextMenu()
  hideAlbumHoverPreview()
}

function normalizeTrackPositions(tracks) {
  return (tracks || []).map((track, index) => ({
    ...track,
    position: index + 1,
  }))
}

function buildPlaylistWithTracks(playlist, tracks) {
  if (!playlist) {
    return playlist
  }

  const nextTracks = normalizeTrackPositions(tracks)

  return normalizePlaylist({
    ...playlist,
    _normalized: false,
    trackCount: nextTracks.length,
    tracks: nextTracks,
  })
}

function buildPlaylistWithTrackAdded(playlist, track) {
  if (!playlist || !track || playlist.tracks.some((item) => item.id === track.id)) {
    return playlist
  }

  return buildPlaylistWithTracks(playlist, [...playlist.tracks, track])
}

function buildPlaylistWithoutTrack(playlist, trackId) {
  if (!playlist) {
    return playlist
  }

  return buildPlaylistWithTracks(
    playlist,
    playlist.tracks.filter((track) => track.id !== Number(trackId))
  )
}

function canMutatePlaylistOrder(playlist) {
  if (!playlist || !isOwnedPlaylist(playlist) || playlist.tracksError) {
    return false
  }

  return !playlist.hydrating && playlist.tracks.length >= Math.max(Number(playlist.trackCount || 0), 0)
}

function tracksHaveSameOrder(leftTracks, rightTracks) {
  if ((leftTracks || []).length !== (rightTracks || []).length) {
    return false
  }

  return (leftTracks || []).every((track, index) => track.id === rightTracks[index]?.id)
}

function reorderTracksToIndex(tracks, trackId, targetIndex) {
  const fromIndex = (tracks || []).findIndex((track) => track.id === Number(trackId))
  if (fromIndex === -1) {
    return null
  }

  const nextTracks = tracks.slice()
  const [movedTrack] = nextTracks.splice(fromIndex, 1)
  const normalizedTargetIndex = clamp(Number(targetIndex) || 0, 0, (tracks || []).length)
  const insertionIndex = clamp(
    fromIndex < normalizedTargetIndex ? normalizedTargetIndex - 1 : normalizedTargetIndex,
    0,
    nextTracks.length
  )
  nextTracks.splice(insertionIndex, 0, movedTrack)
  return normalizeTrackPositions(nextTracks)
}

function moveTracksToIndex(tracks, trackIds, targetIndex) {
  const normalizedTrackIds = [...new Set((trackIds || []).map((id) => Number(id)).filter((id) => id > 0))]
  if (!normalizedTrackIds.length) {
    return null
  }

  const movedTrackIdSet = new Set(normalizedTrackIds)
  const movedTracks = (tracks || []).filter((track) => movedTrackIdSet.has(Number(track.id)))
  if (movedTracks.length !== normalizedTrackIds.length) {
    return null
  }

  const remainingTracks = (tracks || []).filter((track) => !movedTrackIdSet.has(Number(track.id)))
  const normalizedTargetIndex = clamp(Number(targetIndex) || 0, 0, (tracks || []).length)
  const removedBeforeTarget = (tracks || [])
    .slice(0, normalizedTargetIndex)
    .filter((track) => movedTrackIdSet.has(Number(track.id)))
    .length
  const insertionIndex = clamp(normalizedTargetIndex - removedBeforeTarget, 0, remainingTracks.length)
  const nextTracks = remainingTracks.slice()
  nextTracks.splice(insertionIndex, 0, ...movedTracks)
  return normalizeTrackPositions(nextTracks)
}

function insertTrackAtIndex(tracks, track, targetIndex) {
  const nextTracks = tracks.slice()
  nextTracks.splice(clamp(targetIndex, 0, nextTracks.length), 0, track)
  return normalizeTrackPositions(nextTracks)
}

function insertTracksAtIndex(tracks, movedTracks, targetIndex) {
  const nextTracks = (tracks || []).slice()
  nextTracks.splice(clamp(Number(targetIndex) || 0, 0, nextTracks.length), 0, ...(movedTracks || []))
  return normalizeTrackPositions(nextTracks)
}

function resolveArtistAnchoredTrackIndex(targetTracks, movedTracks, fallbackTargetIndex, mode = 'prefer-artist') {
  const artistKeys = new Set((movedTracks || []).flatMap((track) => getTrackArtistKeys(track)))
  const normalizedFallbackIndex = clamp(Number(fallbackTargetIndex) || 0, 0, (targetTracks || []).length)
  if (!artistKeys.size) {
    return normalizedFallbackIndex
  }

  let lastMatchingIndex = -1
  for (let index = 0; index < (targetTracks || []).length; index += 1) {
    const targetTrack = targetTracks[index]
    const hasArtistMatch = getTrackArtistKeys(targetTrack).some((artistKey) => artistKeys.has(artistKey))
    if (hasArtistMatch) {
      lastMatchingIndex = index
    }
  }

  if (lastMatchingIndex === -1) {
    return normalizedFallbackIndex
  }

  const artistAnchorIndex = lastMatchingIndex + 1
  return mode === 'preserve-lower-bound'
    ? Math.max(normalizedFallbackIndex, artistAnchorIndex)
    : artistAnchorIndex
}

function insertTracksWithArtistAnchor(targetTracks, movedTracks, fallbackTargetIndex, mode = 'prefer-artist') {
  return insertTracksAtIndex(
    targetTracks,
    movedTracks,
    resolveArtistAnchoredTrackIndex(targetTracks, movedTracks, fallbackTargetIndex, mode)
  )
}

function buildTrackMovePlan({
  sourcePlaylistId,
  targetPlaylistId,
  trackId,
  trackIds,
  targetIndex,
  targetPlacementMode = 'preserve-lower-bound',
}) {
  const sourcePlaylist = getPlaylistById(sourcePlaylistId)
  const targetPlaylist = getPlaylistById(targetPlaylistId)
  const normalizedTrackIds = [...new Set((trackIds || [trackId]).map((id) => Number(id)).filter((id) => id > 0))]
  const tracks = sourcePlaylist?.tracks.filter((item) => normalizedTrackIds.includes(Number(item.id))) || []
  const track = tracks.find((item) => item.id === Number(trackId)) || tracks[0] || null

  if (!sourcePlaylist || !targetPlaylist || !track || tracks.length !== normalizedTrackIds.length) {
    return null
  }

  if (!canMutatePlaylistOrder(sourcePlaylist) || !canMutatePlaylistOrder(targetPlaylist)) {
    return null
  }

  if (
    sourcePlaylist.id !== targetPlaylist.id
    && tracks.some((movedTrack) => targetPlaylist.tracks.some((item) => item.id === movedTrack.id))
  ) {
    return null
  }

  if (sourcePlaylist.id === targetPlaylist.id) {
    const nextTracks = moveTracksToIndex(sourcePlaylist.tracks, normalizedTrackIds, targetIndex)
    if (!nextTracks || tracksHaveSameOrder(sourcePlaylist.tracks, nextTracks)) {
      return null
    }

    return {
      samePlaylist: true,
      keepSource: false,
      sourcePlaylist,
      targetPlaylist,
      tracks,
      trackIds: normalizedTrackIds,
      track,
      sourceTracks: nextTracks,
      targetTracks: nextTracks,
    }
  }

  const keepSource = isLikedPlaylist(sourcePlaylist)
  const nextTargetTracks = insertTracksWithArtistAnchor(
    targetPlaylist.tracks,
    tracks,
    targetIndex,
    targetPlacementMode
  )
  const movedTrackIdSet = new Set(normalizedTrackIds)
  const nextSourceTracks = keepSource
    ? sourcePlaylist.tracks.slice()
    : sourcePlaylist.tracks.filter((item) => !movedTrackIdSet.has(Number(item.id)))

  return {
    samePlaylist: false,
    keepSource,
    sourcePlaylist,
    targetPlaylist,
    tracks,
    trackIds: normalizedTrackIds,
    track,
    sourceTracks: normalizeTrackPositions(nextSourceTracks),
    targetTracks: nextTargetTracks,
  }
}

function applyTrackMovePlan(plan) {
  const nextPlaylists = state.playlists.map((playlist) => {
    if (playlist.id === plan.targetPlaylist.id) {
      return buildPlaylistWithTracks(playlist, plan.targetTracks)
    }

    if (!plan.samePlaylist && !plan.keepSource && playlist.id === plan.sourcePlaylist.id) {
      return buildPlaylistWithTracks(playlist, plan.sourceTracks)
    }

    return playlist
  })

  setPlaylists(sortWallPlaylists(nextPlaylists))

  if (
    !plan.samePlaylist
    && !plan.keepSource
    && state.queuePlaylistId === plan.sourcePlaylist.id
    && (plan.trackIds || []).includes(Number(state.currentTrackId || 0))
  ) {
    clearCurrentPlayback()
  } else {
    syncQueueWithPlaylists()
  }

  renderTabs()
  renderHeader()
  renderPlayer()
  applyFilters({ syncAll: true })
}

async function commitTrackMovePlan(plan) {
  if (!appBridge || typeof appBridge.commitPlaylistTrackMove !== 'function') {
    showToast(plan.samePlaylist ? TEXT.reorderPlaylistFailed : TEXT.moveToPlaylistFailed, 'error')
    return false
  }

  renderRuntime.playlistMutationPending = true
  let result = null

  try {
    result = await appBridge.commitPlaylistTrackMove({
      sourcePlaylistId: plan.sourcePlaylist.id,
      targetPlaylistId: plan.targetPlaylist.id,
      track: plan.track,
      tracks: plan.tracks,
      trackIds: plan.trackIds,
      keepSource: plan.keepSource,
      sourceTracks: plan.keepSource ? null : plan.sourceTracks,
      targetTracks: plan.targetTracks,
    })
  } finally {
    renderRuntime.playlistMutationPending = false
  }

  if (!result?.ok) {
    showToast(
      result?.error || (plan.samePlaylist ? TEXT.reorderPlaylistFailed : TEXT.moveToPlaylistFailed),
      'error'
    )
    return false
  }

  applyTrackMovePlan(plan)

  if (plan.samePlaylist) {
    showToast(TEXT.reorderPlaylistDone)
    return true
  }

  showToast(`${plan.keepSource ? TEXT.copyToPlaylistDone : TEXT.moveToPlaylistDone}\uff1a${plan.targetPlaylist.name}`)
  return true
}

function reorderPlaylistCollection(playlists, sourcePlaylistId, targetPlaylistId, position) {
  const nextPlaylists = (playlists || []).slice()
  const sourceIndex = nextPlaylists.findIndex((playlist) => playlist.id === Number(sourcePlaylistId))
  const targetIndex = nextPlaylists.findIndex((playlist) => playlist.id === Number(targetPlaylistId))
  if (sourceIndex === -1 || targetIndex === -1) {
    return null
  }

  const [movedPlaylist] = nextPlaylists.splice(sourceIndex, 1)
  const targetOffset = position === 'after' ? 1 : 0
  const insertionIndex = clamp(
    sourceIndex < targetIndex ? (targetIndex - 1) + targetOffset : targetIndex + targetOffset,
    0,
    nextPlaylists.length
  )
  nextPlaylists.splice(insertionIndex, 0, movedPlaylist)

  const changed = nextPlaylists.some((playlist, index) => playlist.id !== playlists[index]?.id)
  return changed ? nextPlaylists : null
}

function getPlaylistWallLayoutFromPlacements(placementsByColumn = renderRuntime.wallPlacementsByColumn) {
  if (!Array.isArray(placementsByColumn) || !placementsByColumn.length) {
    return normalizePlaylistWallLayout()
  }

  return normalizePlaylistWallLayout({
    columns: placementsByColumn.length,
    columnPlaylistIds: placementsByColumn.map((placements) => {
      return (placements || [])
        .map((placement) => Number(placement?.item?.playlist?.id || 0))
        .filter((playlistId) => playlistId > 0)
    }),
  })
}

function reorderPlaylistWallLayout(layout, sourcePlaylistId, targetPlaylistId, position, targetColumnIndex = -1) {
  const normalizedLayout = normalizePlaylistWallLayout(layout)
  if (!normalizedLayout.columns || !normalizedLayout.columnPlaylistIds.length) {
    return null
  }

  const sourceId = Number(sourcePlaylistId || 0)
  const targetId = Number(targetPlaylistId || 0)
  if (sourceId <= 0) {
    return null
  }

  const nextColumnPlaylistIds = normalizedLayout.columnPlaylistIds.map((columnPlaylistIds) => columnPlaylistIds.slice())
  const sourceColumnIndex = nextColumnPlaylistIds.findIndex((columnPlaylistIds) => columnPlaylistIds.includes(sourceId))
  const fallbackTargetColumnIndex = nextColumnPlaylistIds.findIndex((columnPlaylistIds) => columnPlaylistIds.includes(targetId))
  const resolvedTargetColumnIndex = (
    Number.isInteger(targetColumnIndex)
    && targetColumnIndex >= 0
    && targetColumnIndex < nextColumnPlaylistIds.length
  )
    ? targetColumnIndex
    : fallbackTargetColumnIndex

  if (sourceColumnIndex === -1 || resolvedTargetColumnIndex === -1) {
    return null
  }

  const sourceColumnPlaylistIds = nextColumnPlaylistIds[sourceColumnIndex]
  const sourceIndex = sourceColumnPlaylistIds.findIndex((playlistId) => playlistId === sourceId)
  if (sourceIndex === -1) {
    return null
  }

  sourceColumnPlaylistIds.splice(sourceIndex, 1)
  const targetColumnPlaylistIds = nextColumnPlaylistIds[resolvedTargetColumnIndex]
  let insertionIndex = 0
  if (targetId > 0) {
    const targetIndex = targetColumnPlaylistIds.findIndex((playlistId) => playlistId === targetId)
    if (targetIndex === -1) {
      return null
    }

    insertionIndex = position === 'after' ? targetIndex + 1 : targetIndex
    if (sourceColumnIndex === resolvedTargetColumnIndex && sourceIndex < insertionIndex) {
      insertionIndex -= 1
    }
  }

  targetColumnPlaylistIds.splice(clamp(insertionIndex, 0, targetColumnPlaylistIds.length), 0, sourceId)
  const nextLayout = normalizePlaylistWallLayout({
    columns: normalizedLayout.columns,
    columnPlaylistIds: nextColumnPlaylistIds,
  })
  return playlistWallLayoutsEqual(normalizedLayout, nextLayout)
    ? null
    : nextLayout
}

function getVisualPlaylistOrderIdsFromPlacements(placementsByColumn) {
  return (placementsByColumn || [])
    .flatMap((placements) => placements || [])
    .slice()
    .sort((left, right) => left.top - right.top || left.columnIndex - right.columnIndex)
    .map((placement) => Number(placement?.item?.playlist?.id || 0))
    .filter((playlistId) => playlistId > 0)
}

function buildPlaylistMovePlan({ sourcePlaylistId, targetPlaylistId, position, columnIndex = -1 }) {
  const tab = state.activeTab
  const sourcePlaylists = getSourcePlaylists()
  const currentWallLayout = getPlaylistWallLayoutFromPlacements()
  const nextWallLayout = reorderPlaylistWallLayout(
    currentWallLayout,
    sourcePlaylistId,
    targetPlaylistId,
    position,
    columnIndex
  )

  if (nextWallLayout) {
    const nextWallPlan = buildWallPlanFromColumnLayout(buildWallItems(sourcePlaylists), nextWallLayout.columns, nextWallLayout)
    return {
      tab,
      sourcePlaylistId: Number(sourcePlaylistId),
      targetPlaylistId: Number(targetPlaylistId),
      position,
      orderIds: getVisualPlaylistOrderIdsFromPlacements(nextWallPlan.placementsByColumn),
      wallLayout: nextWallLayout,
    }
  }

  const nextPlaylists = reorderPlaylistCollection(sourcePlaylists, sourcePlaylistId, targetPlaylistId, position)
  if (!nextPlaylists) {
    return null
  }

  return {
    tab,
    sourcePlaylistId: Number(sourcePlaylistId),
    targetPlaylistId: Number(targetPlaylistId),
    position,
    orderIds: nextPlaylists.map((playlist) => playlist.id),
  }
}

function applyPlaylistMovePlan(plan) {
  const orderChanged = setPlaylistOrderIdsForTab(plan.tab, plan.orderIds)
  const layoutChanged = plan.wallLayout
    ? setPlaylistWallLayoutForTab(plan.tab, plan.wallLayout)
    : false

  if (!orderChanged && !layoutChanged) {
    return
  }

  if (orderChanged && shouldPersistPlaylistOrderForTab(plan.tab)) {
    void syncPlaylistOrderToServer(plan.orderIds)
  }

  applyFilters({ syncAll: true })
}

async function syncPlaylistOrderToServer(orderIds) {
  if (!appBridge || typeof appBridge.commitPlaylistOrder !== 'function') {
    return
  }
  try {
    const result = await appBridge.commitPlaylistOrder(orderIds)
    if (result && result.ok === false && result.error) {
      console.warn('[playlist] sync order failed:', result.error)
    }
  } catch (error) {
    console.warn('[playlist] sync order error:', error)
  }
}

function clearPlaylistDragIndicator() {
  if (Number.isInteger(renderRuntime.playlistDragIndicator?.columnIndex)) {
    const column = renderRuntime.wallColumns[renderRuntime.playlistDragIndicator.columnIndex]
    if (column) {
      column.classList.remove('is-playlist-drop-column')
      column.style.removeProperty('--playlist-drop-y')
    }
  }

  if (renderRuntime.playlistDragIndicator?.playlistId) {
    const card = refs.wallColumns.querySelector(`.playlist-card[data-playlist-id="${renderRuntime.playlistDragIndicator.playlistId}"]`)
    card?.classList.remove('is-playlist-drop-before', 'is-playlist-drop-after')
  }

  renderRuntime.playlistDragIndicator = null
}

function setPlaylistDragIndicator(indicator) {
  const current = renderRuntime.playlistDragIndicator
  if (
    current?.playlistId === indicator?.playlistId
    && current?.position === indicator?.position
    && current?.columnIndex === indicator?.columnIndex
    && Math.abs(Number(current?.y || 0) - Number(indicator?.y || 0)) < 1
  ) {
    return
  }

  clearPlaylistDragIndicator()
  if (!indicator) {
    return
  }

  const card = refs.wallColumns.querySelector(`.playlist-card[data-playlist-id="${indicator.playlistId}"]`)
  card?.classList.add(indicator.position === 'before' ? 'is-playlist-drop-before' : 'is-playlist-drop-after')
  if (Number.isInteger(indicator.columnIndex)) {
    const column = renderRuntime.wallColumns[indicator.columnIndex]
    if (column) {
      column.classList.add('is-playlist-drop-column')
      column.style.setProperty('--playlist-drop-y', `${Math.round(indicator.y || 0)}px`)
    }
  }
  renderRuntime.playlistDragIndicator = indicator
}

function clearDragIndicator() {
  if (renderRuntime.dragIndicator?.type === 'row') {
    const row = refs.wallColumns.querySelector(
      `.track-row[data-playlist-id="${renderRuntime.dragIndicator.playlistId}"][data-track-id="${renderRuntime.dragIndicator.trackId}"]`
    )
    row?.classList.remove('is-drop-before', 'is-drop-after')
  }

  if (renderRuntime.dragIndicator?.type === 'card') {
    const card = refs.wallColumns.querySelector(`.playlist-card[data-playlist-id="${renderRuntime.dragIndicator.playlistId}"]`)
    card?.classList.remove('is-drop-target', 'is-drop-target-start', 'is-drop-target-end')
  }

  renderRuntime.dragIndicator = null
}

function setDragIndicator(indicator) {
  const sameIndicator = JSON.stringify(renderRuntime.dragIndicator) === JSON.stringify(indicator)
  if (sameIndicator) {
    return
  }

  clearDragIndicator()

  if (!indicator) {
    return
  }

  if (indicator.type === 'row') {
    const row = refs.wallColumns.querySelector(`.track-row[data-playlist-id="${indicator.playlistId}"][data-track-id="${indicator.trackId}"]`)
    row?.classList.add(indicator.position === 'before' ? 'is-drop-before' : 'is-drop-after')
  } else if (indicator.type === 'card') {
    const card = refs.wallColumns.querySelector(`.playlist-card[data-playlist-id="${indicator.playlistId}"]`)
    if (card) {
      card.classList.add('is-drop-target')
      card.classList.add(indicator.position === 'start' ? 'is-drop-target-start' : 'is-drop-target-end')
    }
  }

  renderRuntime.dragIndicator = indicator
}

function scheduleTrackDragStateCleanup(delayOrEvent = 0) {
  const delayMs = typeof delayOrEvent === 'number' ? delayOrEvent : 0
  if (!renderRuntime.dragState && !renderRuntime.dragSourceRow && !renderRuntime.dragIndicator) {
    return
  }

  if (renderRuntime.dragCleanupTimer) {
    window.clearTimeout(renderRuntime.dragCleanupTimer)
  }

  renderRuntime.dragCleanupTimer = window.setTimeout(() => {
    renderRuntime.dragCleanupTimer = 0
    clearTrackDragState()
  }, Math.max(0, delayMs))
}

function scheduleTrackDragStateRecovery() {
  scheduleTrackDragStateCleanup(48)
}

function handleDocumentVisibilityChange() {
  if (document.hidden) {
    clearPlaylistDragState()
    clearTrackDragState()
  }
}

function clearTrackDragState() {
  if (renderRuntime.dragCleanupTimer) {
    window.clearTimeout(renderRuntime.dragCleanupTimer)
    renderRuntime.dragCleanupTimer = 0
  }

  if (renderRuntime.dragSourceRow instanceof HTMLElement) {
    renderRuntime.dragSourceRow.classList.remove('is-dragging')
    renderRuntime.dragSourceRow.blur()
  }

  refs.wallColumns.querySelectorAll('.track-row.is-dragging').forEach((row) => {
    row.classList.remove('is-dragging')
  })

  if (document.activeElement instanceof HTMLElement && document.activeElement.closest('.track-row[data-play-track]')) {
    document.activeElement.blur()
  }

  renderRuntime.dragSourceRow = null
  clearDragIndicator()
  renderRuntime.dragState = null
}

function clearPlaylistDragState() {
  const draggedPlaylistId = Number(
    renderRuntime.playlistDragState?.sourcePlaylistId
    || renderRuntime.playlistDragSourceCard?.getAttribute?.('data-playlist-id')
    || 0
  )

  if (renderRuntime.playlistDragSourceCard instanceof HTMLElement) {
    renderRuntime.playlistDragSourceCard.classList.remove('is-playlist-dragging')
  }

  refs.wallColumns?.querySelectorAll?.('.playlist-card.is-playlist-dragging').forEach((card) => {
    card.classList.remove('is-playlist-dragging')
  })

  renderRuntime.playlistDragSourceCard = null
  clearPlaylistDragIndicator()
  renderRuntime.playlistDragState = null
  if (draggedPlaylistId > 0) {
    suppressPlaylistCollapseClick(draggedPlaylistId)
  }
}

function suppressPlaylistCollapseClick(playlistId, durationMs = PLAYLIST_DRAG_CLICK_SUPPRESS_MS) {
  renderRuntime.playlistDragSuppressedId = Number(playlistId || 0)
  renderRuntime.playlistDragSuppressUntil = window.performance.now() + Math.max(0, durationMs)
}

function consumeSuppressedPlaylistCollapseClick(playlistId) {
  const normalizedPlaylistId = Number(playlistId || 0)
  if (normalizedPlaylistId <= 0 || renderRuntime.playlistDragSuppressedId !== normalizedPlaylistId) {
    return false
  }

  if (window.performance.now() > renderRuntime.playlistDragSuppressUntil) {
    renderRuntime.playlistDragSuppressedId = 0
    renderRuntime.playlistDragSuppressUntil = 0
    return false
  }

  renderRuntime.playlistDragSuppressedId = 0
  renderRuntime.playlistDragSuppressUntil = 0
  return true
}

function resolvePlaylistDropColumn(target, clientX) {
  const columnCandidates = renderRuntime.wallColumns
    .map((columnNode, columnIndex) => ({
      columnNode,
      columnIndex,
      placements: renderRuntime.wallPlacementsByColumn[columnIndex] || [],
    }))

  if (!columnCandidates.length) {
    return null
  }

  const directColumn = target?.closest('.wall-column')
  if (directColumn) {
    const directMatch = columnCandidates.find((candidate) => candidate.columnNode === directColumn)
    if (directMatch) {
      return directMatch
    }
  }

  let bestCandidate = null
  let bestDistance = Number.POSITIVE_INFINITY

  for (const candidate of columnCandidates) {
    const rect = candidate.columnNode.getBoundingClientRect()
    const distance = clientX < rect.left
      ? rect.left - clientX
      : clientX > rect.right
        ? clientX - rect.right
        : 0

    if (distance < bestDistance) {
      bestDistance = distance
      bestCandidate = candidate
      if (distance === 0) {
        break
      }
    }
  }

  return bestCandidate
}

function getMeasuredPlaylistPlacementsForColumn(columnIndex) {
  const columnNode = renderRuntime.wallColumns[columnIndex]
  const placements = renderRuntime.wallPlacementsByColumn[columnIndex] || []
  if (!columnNode || !placements.length) {
    return {
      columnNode,
      placements,
      columnHeight: 0,
    }
  }

  const columnRect = columnNode.getBoundingClientRect()
  const columnHeight = Math.max(0, columnRect.height)
  const measuredBoundsByPlaylistId = new Map()

  columnNode.querySelectorAll('.playlist-card[data-playlist-id]').forEach((card) => {
    const playlistId = Number(card.getAttribute('data-playlist-id'))
    if (playlistId <= 0) {
      return
    }

    const rect = card.getBoundingClientRect()
    const top = clamp(rect.top - columnRect.top, 0, columnHeight)
    const bottom = clamp(rect.bottom - columnRect.top, 0, columnHeight)
    measuredBoundsByPlaylistId.set(playlistId, {
      top,
      bottom: Math.max(top, bottom),
    })
  })

  return {
    columnNode,
    columnHeight,
    placements: placements.map((placement) => {
      const playlistId = Number(placement?.item?.playlist?.id || 0)
      const measuredBounds = measuredBoundsByPlaylistId.get(playlistId)
      if (!measuredBounds) {
        return placement
      }

      return {
        ...placement,
        top: measuredBounds.top,
        bottom: measuredBounds.bottom,
        height: Math.max(0, measuredBounds.bottom - measuredBounds.top),
      }
    }),
  }
}

function resolvePlaylistGapTarget(columnIndex, clientY) {
  const {
    columnNode,
    placements,
    columnHeight,
  } = getMeasuredPlaylistPlacementsForColumn(columnIndex)
  if (!columnNode) {
    return null
  }

  if (!placements.length) {
    return {
      columnIndex,
      playlistId: 0,
      position: 'before',
      y: 0,
    }
  }

  const columnRect = columnNode.getBoundingClientRect()
  const relativeY = clamp(clientY - columnRect.top, 0, columnHeight)
  const gapTargets = []
  const firstPlacement = placements[0]
  gapTargets.push({
    playlistId: firstPlacement.item.playlist.id,
    position: 'before',
    y: Math.max(0, firstPlacement.top),
  })

  for (let index = 1; index < placements.length; index += 1) {
    const previousPlacement = placements[index - 1]
    const nextPlacement = placements[index]
    gapTargets.push({
      playlistId: nextPlacement.item.playlist.id,
      position: 'before',
      y: (previousPlacement.bottom + nextPlacement.top) / 2,
    })
  }

  const lastPlacement = placements[placements.length - 1]
  gapTargets.push({
    playlistId: lastPlacement.item.playlist.id,
    position: 'after',
    y: lastPlacement.bottom,
  })

  let closestGapTarget = gapTargets[0]
  let closestDistance = Math.abs(relativeY - closestGapTarget.y)

  for (let index = 1; index < gapTargets.length; index += 1) {
    const candidate = gapTargets[index]
    const distance = Math.abs(relativeY - candidate.y)
    if (distance < closestDistance) {
      closestDistance = distance
      closestGapTarget = candidate
    }
  }

  return {
    columnIndex,
    ...closestGapTarget,
  }
}

function resolvePlaylistDropTarget(event) {
  const dragState = renderRuntime.playlistDragState
  if (!dragState || dragState.tab !== state.activeTab) {
    return null
  }

  const target = event.target instanceof Element ? event.target : null
  const column = resolvePlaylistDropColumn(target, event.clientX)
  if (!column) {
    return null
  }

  const gapTarget = resolvePlaylistGapTarget(column.columnIndex, event.clientY)
  if (!gapTarget) {
    return null
  }

  const targetPlaylistId = Number(gapTarget.playlistId)
  const position = gapTarget.position
  const plan = buildPlaylistMovePlan({
    sourcePlaylistId: dragState.sourcePlaylistId,
    targetPlaylistId,
    position,
    columnIndex: column.columnIndex,
  })
  if (!plan) {
    return null
  }

  return {
    indicator: {
      columnIndex: column.columnIndex,
      playlistId: targetPlaylistId,
      position,
      y: gapTarget.y,
    },
    plan,
  }
}

function getDraggedTrackIdsForRow(playlistId, trackId) {
  const normalizedPlaylistId = Number(playlistId || 0)
  const normalizedTrackId = Number(trackId || 0)
  const playlist = getPlaylistById(normalizedPlaylistId)
  if (!playlist || normalizedTrackId <= 0) {
    return []
  }

  const useSelection = Number(renderRuntime.selectedPlaylistId || 0) === normalizedPlaylistId
    && isTrackSelected(normalizedPlaylistId, normalizedTrackId)
  if (!useSelection) {
    return [normalizedTrackId]
  }

  const selectedTrackIds = playlist.tracks
    .filter((track) => isTrackSelected(normalizedPlaylistId, track.id))
    .map((track) => Number(track.id))
  return selectedTrackIds.length ? selectedTrackIds : [normalizedTrackId]
}

function buildDropTargetForRow(dragState, row, clientY) {
  const playlistId = Number(row.getAttribute('data-playlist-id'))
  const playlist = getPlaylistById(playlistId)
  const hoveredTrackId = Number(row.getAttribute('data-track-id'))

  if (!playlist || !canMutatePlaylistOrder(playlist)) {
    return null
  }

  const hoveredIndex = playlist.tracks.findIndex((track) => track.id === hoveredTrackId)
  if (hoveredIndex === -1) {
    return null
  }

  const rect = row.getBoundingClientRect()
  const position = clientY < rect.top + (rect.height / 2) ? 'before' : 'after'
  const targetIndex = position === 'before' ? hoveredIndex : hoveredIndex + 1

  const plan = buildTrackMovePlan({
    sourcePlaylistId: dragState.sourcePlaylistId,
    targetPlaylistId: playlist.id,
    trackId: dragState.trackId,
    trackIds: dragState.trackIds,
    targetIndex,
    targetPlacementMode: 'preserve-lower-bound',
  })
  if (!plan) {
    return null
  }

  return {
    indicator: {
      type: 'row',
      playlistId: playlist.id,
      trackId: hoveredTrackId,
      position,
    },
    plan,
  }
}

function buildDropTargetForCard(dragState, card, position) {
  const playlistId = Number(card.getAttribute('data-playlist-id'))
  const playlist = getPlaylistById(playlistId)
  if (!playlist || !canMutatePlaylistOrder(playlist)) {
    return null
  }

  const targetIndex = position === 'start' ? 0 : playlist.tracks.length

  const plan = buildTrackMovePlan({
    sourcePlaylistId: dragState.sourcePlaylistId,
    targetPlaylistId: playlist.id,
    trackId: dragState.trackId,
    trackIds: dragState.trackIds,
    targetIndex,
    targetPlacementMode: 'prefer-artist',
  })
  if (!plan) {
    return null
  }

  return {
    indicator: {
      type: 'card',
      playlistId: playlist.id,
      position,
    },
    plan,
  }
}

function resolveTrackDropTarget(event) {
  const dragState = renderRuntime.dragState
  if (!dragState) {
    return null
  }

  const target = event.target instanceof Element ? event.target : null
  if (!target) {
    return null
  }

  const row = target.closest('.track-row[data-play-track]')
  if (row) {
    return buildDropTargetForRow(dragState, row, event.clientY)
  }

  const header = target.closest('.playlist-header')
  const headerCard = header?.closest('.playlist-card[data-playlist-id]')
  if (headerCard) {
    return buildDropTargetForCard(dragState, headerCard, 'start')
  }

  const card = target.closest('.playlist-card[data-playlist-id]')
  if (card) {
    return buildDropTargetForCard(dragState, card, 'end')
  }

  return null
}

function handlePlaylistHeaderDragStart(event, handle) {
  const sourcePlaylistId = Number(handle.getAttribute('data-drag-playlist'))
  const playlist = getPlaylistById(sourcePlaylistId)
  const tab = getPlaylistTab(playlist)
  if (!playlist || !tab || tab !== state.activeTab) {
    event.preventDefault()
    return
  }

  clearTrackDragState()
  clearPlaylistDragState()
  renderRuntime.playlistDragState = {
    tab,
    sourcePlaylistId,
  }

  const sourceCard = handle.closest('.playlist-card[data-playlist-id]')
  renderRuntime.playlistDragSourceCard = sourceCard instanceof HTMLElement ? sourceCard : null
  renderRuntime.playlistDragSourceCard?.classList.add('is-playlist-dragging')
  closeContextMenu()
  hideAlbumHoverPreview()

  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', `playlist:${tab}:${sourcePlaylistId}`)
  }
}

function handleWallDragStart(event) {
  const target = event.target instanceof Element ? event.target : null
  const playlistHandle = target?.closest('[data-drag-playlist]')
  if (playlistHandle) {
    handlePlaylistHeaderDragStart(event, playlistHandle)
    return
  }

  const row = target?.closest('.track-row[data-play-track]')

  if (!row || renderRuntime.playlistMutationPending) {
    event.preventDefault()
    return
  }

  const sourcePlaylistId = Number(row.getAttribute('data-playlist-id'))
  const trackId = Number(row.getAttribute('data-track-id'))
  const playlist = getPlaylistById(sourcePlaylistId)
  const trackIds = getDraggedTrackIdsForRow(sourcePlaylistId, trackId)

  if (!playlist || !canMutatePlaylistOrder(playlist) || !trackIds.length) {
    event.preventDefault()
    return
  }

  clearTrackSelection()
  clearPlaylistDragState()
  clearTrackDragState()
  renderRuntime.dragState = {
    sourcePlaylistId,
    trackId,
    trackIds,
  }

  renderRuntime.dragSourceRow = row
  row.blur()
  const draggedTrackIdSet = new Set(trackIds)
  refs.wallColumns.querySelectorAll(`.track-row[data-playlist-id="${sourcePlaylistId}"]`).forEach((trackRow) => {
    const rowTrackId = Number(trackRow.getAttribute('data-track-id'))
    trackRow.classList.toggle('is-dragging', draggedTrackIdSet.has(rowTrackId))
  })
  row.addEventListener('dragend', scheduleTrackDragStateCleanup, { once: true })
  closeContextMenu()
  hideAlbumHoverPreview()

  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = isLikedPlaylist(playlist) ? 'copyMove' : 'move'
    event.dataTransfer.setData('text/plain', `${sourcePlaylistId}:${trackIds.join(',')}`)
  }
}

function handleWallDragOver(event) {
  if (renderRuntime.playlistDragState) {
    const playlistDropTarget = resolvePlaylistDropTarget(event)
    if (!playlistDropTarget) {
      clearPlaylistDragIndicator()
      return
    }

    event.preventDefault()
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move'
    }
    setPlaylistDragIndicator(playlistDropTarget.indicator)
    return
  }

  if (!renderRuntime.dragState || renderRuntime.playlistMutationPending) {
    return
  }

  const dropTarget = resolveTrackDropTarget(event)
  if (!dropTarget) {
    clearDragIndicator()
    return
  }

  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = dropTarget.plan.keepSource ? 'copy' : 'move'
  }
  setDragIndicator(dropTarget.indicator)
}

function handleWallDrop(event) {
  if (renderRuntime.playlistDragState) {
    const playlistDropTarget = resolvePlaylistDropTarget(event)
    clearPlaylistDragState()

    if (!playlistDropTarget) {
      return
    }

    event.preventDefault()
    applyPlaylistMovePlan(playlistDropTarget.plan)
    return
  }

  if (!renderRuntime.dragState || renderRuntime.playlistMutationPending) {
    return
  }

  const dropTarget = resolveTrackDropTarget(event)
  clearTrackDragState()

  if (!dropTarget) {
    return
  }

  event.preventDefault()
  void commitTrackMovePlan(dropTarget.plan)
}

function handleWallDragEnd() {
  clearPlaylistDragState()
  clearTrackDragState()
}

function clearCurrentPlayback() {
  refs.audio.pause()
  refs.audio.removeAttribute('src')
  refs.audio.load()
  state.queue = []
  state.queueMode = ''
  state.queuePlaylistId = null
  state.queueContextLabel = ''
  state.queueIndex = -1
  state.currentTrackId = null
  state.isPlaying = false
  state.isResolving = false
  state.isPreview = false
  state.currentPlaybackRequestedQuality = ''
  state.currentPlaybackResolvedLevel = ''
}

async function transferTrackFromContextMenu(targetPlaylistId) {
  const context = renderRuntime.contextMenuTrack
  closeContextMenu()

  if (!context || Number(targetPlaylistId || 0) <= 0) {
    return
  }

  const sourcePlaylist = getPlaylistById(context.playlistId)
  const targetPlaylist = getPlaylistById(targetPlaylistId)
  const tracks = (context.tracks || [context.track]).filter((track) => track && Number(track.id) > 0)
  const keepSource = Boolean(context.keepSource)

  if (!sourcePlaylist || !targetPlaylist || !tracks.length || !canMutatePlaylistOrder(targetPlaylist)) {
    return
  }

  if (!keepSource && !canMutatePlaylistOrder(sourcePlaylist)) {
    return
  }

  const tracksToAdd = tracks.filter((track) => !targetPlaylist.tracks.some((item) => item.id === track.id))
  if (!tracksToAdd.length) {
    return
  }

  clearTrackSelection()
  const movedTrackIdSet = new Set(tracksToAdd.map((track) => Number(track.id)))
  const plan = {
    samePlaylist: false,
    keepSource,
    sourcePlaylist,
    targetPlaylist,
    tracks: tracksToAdd,
    trackIds: [...movedTrackIdSet],
    track: tracksToAdd.find((track) => track.id === Number(context.track?.id)) || tracksToAdd[0] || null,
    sourceTracks: normalizeTrackPositions(
      keepSource
        ? sourcePlaylist.tracks.slice()
        : sourcePlaylist.tracks.filter((item) => !movedTrackIdSet.has(Number(item.id)))
    ),
    targetTracks: insertTracksWithArtistAnchor(
      targetPlaylist.tracks,
      tracksToAdd,
      targetPlaylist.tracks.length,
      'prefer-artist'
    ),
  }

  await commitTrackMovePlan(plan)

  /*
  const finalPlaylists = nextPlaylists.map((playlist) => {
    if (playlist.id === nextTargetPlaylist.id) {
      return nextTargetPlaylist
    }
    if (nextSourcePlaylist && playlist.id === nextSourcePlaylist.id) {
      return nextSourcePlaylist
    }
    return playlist
  })

  setPlaylists(sortWallPlaylists(finalPlaylists))
  clearTrackSelection()
  if (removedCurrentTrack) {
    clearCurrentPlayback()
  } else if (!(state.queuePlaylistId === null && state.currentTrackId === null)) {
    syncQueueWithPlaylists()
  }
  renderTabs()
  renderHeader()
  renderPlayer()
  applyFilters({ syncAll: true })
  showToast(`${context.keepSource ? TEXT.copyToPlaylistDone : TEXT.moveToPlaylistDone}\uff1a${targetPlaylist.name}`)
  return
  showToast(`${context.keepSource ? TEXT.copyToPlaylistDone : TEXT.moveToPlaylistDone}：${targetPlaylist.name}`)
  */
}

async function removeTrackFromContextMenu() {
  const context = renderRuntime.contextMenuTrack
  closeContextMenu()

  if (!context) {
    return
  }

  const playlist = getPlaylistById(context.playlistId)
  if (!playlist) {
    return
  }

  const tracks = (context.tracks || [context.track]).filter((track) => track && Number(track.id) > 0)
  let nextPlaylist = playlist
  let removedCurrentTrack = false

  for (const track of tracks) {
    const result = await appBridge.removeTrackFromPlaylist(context.playlistId, track.id)
    if (!result.ok) {
      if (nextPlaylist !== playlist) {
        const partialPlaylists = state.playlists.map((item) => item.id === playlist.id ? nextPlaylist : item)
        setPlaylists(sortWallPlaylists(partialPlaylists))
        if (removedCurrentTrack) {
          clearCurrentPlayback()
        } else {
          syncQueueWithPlaylists()
        }
        renderTabs()
        renderHeader()
        renderPlayer()
        applyFilters({ syncAll: true })
      }
      showToast(result.error || TEXT.removeFromPlaylistFailed, 'error')
      clearTrackSelection()
      return
    }

    nextPlaylist = buildPlaylistWithoutTrack(nextPlaylist, track.id)
    removedCurrentTrack = removedCurrentTrack
      || (state.queuePlaylistId === context.playlistId && state.currentTrackId === track.id)
  }

  const nextPlaylists = state.playlists.map((item) => item.id === playlist.id ? nextPlaylist : item)
  setPlaylists(sortWallPlaylists(nextPlaylists))
  clearTrackSelection()

  if (removedCurrentTrack) {
    clearCurrentPlayback()
  } else {
    syncQueueWithPlaylists()
  }

  renderTabs()
  renderHeader()
  renderPlayer()
  applyFilters({ syncAll: true })
  showToast(TEXT.removeFromPlaylistDone)
}

function syncWallPlaybackState() {
  const nextTrackKey = state.currentTrackId && state.queuePlaylistId && state.queueMode === 'playlist'
    ? `${state.queuePlaylistId}:${state.currentTrackId}`
    : ''
  const nextRecommendationKey = state.currentTrackId && state.queuePlaylistId && state.queueMode === 'recommendation'
    ? `${state.queuePlaylistId}:${state.currentTrackId}`
    : ''

  if (renderRuntime.renderedTrackKey && renderRuntime.renderedTrackKey !== nextTrackKey) {
    updateTrackRowState(renderRuntime.renderedTrackKey, false)
  }

  if (renderRuntime.renderedRecommendationKey && renderRuntime.renderedRecommendationKey !== nextRecommendationKey) {
    updateRecommendationRowState(renderRuntime.renderedRecommendationKey, false)
  }

  if (renderRuntime.renderedPlaylistId && renderRuntime.renderedPlaylistId !== state.queuePlaylistId) {
    updatePlaylistCardState(renderRuntime.renderedPlaylistId, false)
  }

  if (nextTrackKey) {
    updateTrackRowState(nextTrackKey, true)
  }

  if (nextRecommendationKey) {
    updateRecommendationRowState(nextRecommendationKey, true)
  }

  if (state.queuePlaylistId) {
    updatePlaylistCardState(state.queuePlaylistId, true)
  }

  renderRuntime.renderedTrackKey = nextTrackKey
  renderRuntime.renderedRecommendationKey = nextRecommendationKey
  renderRuntime.renderedPlaylistId = state.queuePlaylistId || null
}

function updateTrackRowState(trackKey, isPlaying) {
  const [playlistId, trackId] = String(trackKey).split(':')
  const row = refs.wallColumns.querySelector(`.track-row[data-playlist-id="${playlistId}"][data-track-id="${trackId}"]`)
  if (!row) {
    return
  }

  row.classList.toggle('is-playing', isPlaying)
}

function updateRecommendationRowState(trackKey, isPlaying) {
  const [playlistId, trackId] = String(trackKey).split(':')
  const row = refs.wallColumns.querySelector(`.recommendation-play-btn[data-playlist-id="${playlistId}"][data-track-id="${trackId}"]`)
  if (!row) {
    return
  }

  row.classList.toggle('is-playing', isPlaying)
}

function updatePlaylistCardState(playlistId, isCurrent) {
  const cards = refs.wallColumns.querySelectorAll(`.playlist-card[data-playlist-id="${playlistId}"]`)
  if (!cards.length) {
    return
  }

  cards.forEach((card) => {
    card.classList.toggle('is-current', isCurrent)
  })
}

function isOwnedPlaylist(playlist) {
  return Number(playlist.creatorId || 0) === Number(state.account?.userId || 0)
}

function isLikedPlaylist(playlist) {
  return Number(playlist?.specialType || 0) === 5
}

async function playSpotifyPlaylist(playlist, trackId) {
  if (!playlist || !playlist.tracks.length) {
    return
  }

  if (!appBridge || typeof appBridge.resolveSpotifyPlayback !== 'function') {
    showToast(TEXT.spotifyImportReadonlyTrack, 'error')
    return
  }

  showToast(TEXT.spotifyPlaybackResolving)
  const result = await appBridge.resolveSpotifyPlayback(playlist)
  if (!result?.ok) {
    showToast(result?.error || TEXT.spotifyImportReadonlyTrack, 'error')
    return
  }

  const queueTracks = (result.resolvedTracks || []).map((track) => normalizePlaylistTrack(track))
  const queueIndex = queueTracks.findIndex((track) => Number(track.id || 0) === Number(trackId || 0))
  if (queueIndex === -1 || !queueTracks.length) {
    showToast(TEXT.spotifyPlaybackUnmatched, 'error')
    return
  }

  state.queue = queueTracks
  state.queueMode = 'playlist'
  state.queuePlaylistId = playlist.id
  state.queueContextLabel = ''
  await playQueueIndex(queueIndex)
}

async function playFromPlaylist(playlistId, trackId) {
  const playlist = getPlaylistById(playlistId)
  if (!playlist || !playlist.tracks.length) return
  if (getPlaylistSourcePlatform(playlist) === 'spotify') {
    await playSpotifyPlaylist(playlist, trackId)
    return
  }
  const queueTracks = (playlist.tracks || []).filter((track) => String(track?.sourcePlatform || '').trim() !== 'spotify')
  const selectedTrack = (playlist.tracks || []).find((track) => track.id === trackId)
  if (!selectedTrack || String(selectedTrack?.sourcePlatform || '').trim() === 'spotify' || !queueTracks.length) {
    showToast(TEXT.spotifyImportReadonlyTrack, 'error')
    return
  }
  const queueIndex = queueTracks.findIndex((track) => track.id === trackId)
  if (queueIndex === -1) return
  state.queue = queueTracks
  state.queueMode = 'playlist'
  state.queuePlaylistId = playlistId
  state.queueContextLabel = ''
  await playQueueIndex(queueIndex)
}

async function playRecommendedTrack(playlistId, trackId) {
  const playlist = getPlaylistById(playlistId)
  const recommendationState = ensureRecommendationState(playlistId)
  const queue = recommendationState.tracks || []
  const queueIndex = queue.findIndex((track) => track.id === Number(trackId))
  if (!queue.length || queueIndex === -1) {
    return
  }

  state.queue = queue
  state.queueMode = 'recommendation'
  state.queuePlaylistId = playlistId
  state.queueContextLabel = playlist ? `${playlist.name} / ${TEXT.recommendationsTitle}` : TEXT.recommendationsTitle
  await playQueueIndex(queueIndex)
}

function waitForAudioMetadata(timeoutMs = AUDIO_SOURCE_WAIT_TIMEOUT_MS) {
  return new Promise((resolve, reject) => {
    let settled = false
    let timer = 0

    const cleanup = () => {
      refs.audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      refs.audio.removeEventListener('error', handleError)
      if (timer) {
        window.clearTimeout(timer)
        timer = 0
      }
    }

    const handleLoadedMetadata = () => {
      if (settled) {
        return
      }

      settled = true
      cleanup()
      resolve()
    }

    const handleError = () => {
      if (settled) {
        return
      }

      settled = true
      cleanup()
      reject(new Error(TEXT.unavailableTrack))
    }

    refs.audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    refs.audio.addEventListener('error', handleError)
    timer = window.setTimeout(() => {
      if (settled) {
        return
      }

      settled = true
      cleanup()
      reject(new Error(TEXT.playbackFailed))
    }, timeoutMs)
  })
}

async function loadResolvedAudioSource(url, { resumeAtSeconds = 0, autoplay = true } = {}) {
  const needsMetadata = resumeAtSeconds > 0 || !autoplay
  refs.audio.src = url

  if (needsMetadata) {
    const metadataReady = waitForAudioMetadata()
    refs.audio.load()
    await metadataReady

    if (resumeAtSeconds > 0 && Number.isFinite(refs.audio.duration) && refs.audio.duration > 0) {
      refs.audio.currentTime = Math.min(
        resumeAtSeconds,
        Math.max(0, refs.audio.duration - 0.25)
      )
    }
  }

  if (autoplay) {
    await refs.audio.play()
  }
}

async function resolveQueueTrackSource(track, options = {}) {
  const requestedQuality = getRequestedAudioQualityPreference(
    options?.preferredQuality ?? state.settings.defaultAudioQuality
  )
  const autoplay = options?.autoplay !== false
  const resumeAtSeconds = Math.max(0, Number(options?.resumeAtSeconds || 0) || 0)
  const shouldRecordPlay = Boolean(options?.recordPlay)
  const playbackTrackId = Number(track?.playbackTrackId || track?.id || 0)

  state.currentTrackId = track.id
  state.isResolving = true
  state.isPreview = false
  syncWallPlaybackState()
  renderPlayer()

  const token = ++state.playToken
  const result = await appBridge.getSongUrl(playbackTrackId, {
    preferredQuality: requestedQuality,
  })
  if (token !== state.playToken) {
    return { ok: false, cancelled: true }
  }

  state.isResolving = false

  if (!result.ok || !result.url) {
    if (!refs.audio.src || state.currentTrackId === track.id) {
      state.currentPlaybackRequestedQuality = ''
      state.currentPlaybackResolvedLevel = ''
    }
    showToast(result.error || TEXT.noPlayableUrl, 'error')
    renderPlayer()
    syncWallPlaybackState()
    return { ok: false }
  }

  try {
    state.isPreview = isPreviewByDuration(track.durationMs, result.streamDurationMs)
    await loadResolvedAudioSource(result.url, {
      resumeAtSeconds,
      autoplay,
    })
    state.currentPlaybackRequestedQuality = requestedQuality
    state.currentPlaybackResolvedLevel = String(result.level || '')
    if (shouldRecordPlay && playbackTrackId > 0) {
      void recordTrackPlay(playbackTrackId)
    }
  } catch (error) {
    if ((error.message || '') !== TEXT.unavailableTrack) {
      showToast(error.message || TEXT.playbackFailed, 'error')
    }
    return { ok: false }
  } finally {
    renderPlayer()
    syncWallPlaybackState()
  }

  return { ok: true }
}

function scheduleAudioQualityRefresh(reason = AUDIO_QUALITY_REFRESH_REASON_SETTINGS) {
  renderRuntime.pendingAudioQualityRefreshReason = reason === AUDIO_QUALITY_REFRESH_REASON_NETWORK
    && renderRuntime.pendingAudioQualityRefreshReason === AUDIO_QUALITY_REFRESH_REASON_SETTINGS
    ? AUDIO_QUALITY_REFRESH_REASON_SETTINGS
    : reason
  window.clearTimeout(renderRuntime.audioQualityRefreshTimer)
  renderRuntime.audioQualityRefreshTimer = window.setTimeout(() => {
    const refreshReason = renderRuntime.pendingAudioQualityRefreshReason || reason
    renderRuntime.audioQualityRefreshTimer = 0
    renderRuntime.pendingAudioQualityRefreshReason = ''
    void refreshCurrentTrackAudioQuality(refreshReason)
  }, AUDIO_QUALITY_SWITCH_DEBOUNCE_MS)
}

async function refreshCurrentTrackAudioQuality(reason = AUDIO_QUALITY_REFRESH_REASON_SETTINGS) {
  const track = getCurrentTrack()
  if (!track || !refs.audio.src || state.isResolving || navigator.onLine === false) {
    return
  }

  const nextRequestedQuality = getRequestedAudioQualityPreference()
  if (nextRequestedQuality === state.currentPlaybackRequestedQuality) {
    return
  }

  // Keep passive connection telemetry from interrupting the current song mid-playback.
  if (reason === AUDIO_QUALITY_REFRESH_REASON_NETWORK && state.isPlaying) {
    return
  }

  await resolveQueueTrackSource(track, {
    preferredQuality: state.settings.defaultAudioQuality,
    resumeAtSeconds: Number.isFinite(refs.audio.currentTime) ? refs.audio.currentTime : 0,
    autoplay: !refs.audio.paused,
    recordPlay: false,
  })
}

async function playQueueIndex(index) {
  if (!state.queue.length || index < 0 || index >= state.queue.length) return
  state.queueIndex = index
  const track = state.queue[index]
  await resolveQueueTrackSource(track, { recordPlay: true })
}

async function recordTrackPlay(trackId) {
  if (!state.account?.userId || !appBridge || typeof appBridge.recordTrackPlay !== 'function') {
    return
  }

  const result = await appBridge.recordTrackPlay(state.account.userId, trackId)
  if (!result?.ok) {
    return
  }

  state.localPlayCounts.set(Number(trackId), Number(result.localPlayCount || 0))
  rebuildTrackPlayTiers()
  renderWallViewport({ force: true })
  updatePlaylistRecommendationNodesForVisible()
}

function togglePlayback() {
  if (state.queueIndex === -1) {
    const firstTrack = getFirstVisibleTrack()
    if (firstTrack) {
      playFromPlaylist(firstTrack.playlistId, firstTrack.trackId)
    }
    return
  }

  if (!refs.audio.src && state.queueIndex >= 0) {
    playQueueIndex(state.queueIndex)
    return
  }

  if (refs.audio.paused) {
    refs.audio.play().catch((error) => showToast(error.message || TEXT.playbackFailed, 'error'))
  } else {
    refs.audio.pause()
  }
}

function getFirstVisibleTrack() {
  for (const playlist of state.visiblePlaylists) {
    if (playlist.wallTracks[0]) {
      return { playlistId: playlist.id, trackId: playlist.wallTracks[0].id }
    }
  }
  return null
}

function previousTrack() {
  if (refs.audio.currentTime > 3) {
    refs.audio.currentTime = 0
    return
  }
  if (!state.queue.length) return
  if (state.shuffle && state.queue.length > 1) {
    playQueueIndex(randomQueueIndex())
    return
  }

  const target = state.queueIndex > 0
    ? state.queueIndex - 1
    : state.repeat === 'all'
      ? state.queue.length - 1
      : state.queueIndex

  playQueueIndex(target)
}

function nextTrack({ fromEnded }) {
  if (!state.queue.length) return
  if (state.shuffle && state.queue.length > 1) {
    playQueueIndex(randomQueueIndex())
    return
  }

  let target = state.queueIndex + 1
  if (target >= state.queue.length) {
    if (state.repeat === 'all') {
      target = 0
    } else if (fromEnded) {
      refs.audio.pause()
      state.isPlaying = false
      renderPlayer()
      return
    } else {
      return
    }
  }

  playQueueIndex(target)
}

function randomQueueIndex() {
  if (state.queue.length <= 1) return state.queueIndex
  let next = state.queueIndex
  while (next === state.queueIndex) {
    next = Math.floor(Math.random() * state.queue.length)
  }
  return next
}

function cycleRepeatMode() {
  const modes = ['all', 'one', 'off']
  state.repeat = modes[(modes.indexOf(state.repeat) + 1) % modes.length]
  renderPlayer()
}

function renderPlayer() {
  const track = getCurrentTrack()
  refs.locateCurrentBtn.disabled = !track || !state.queuePlaylistId
  syncPlayerButtonState(Boolean(track))
  if (!track) {
    updatePlayerCover(null)
    refs.playerTitle.textContent = TEXT.notPlaying
    refs.playerMeta.textContent = TEXT.pickTrack
    updateProgressUI()
    return
  }

  const playlist = state.queuePlaylistId ? getPlaylistById(state.queuePlaylistId) : null
  const contextLabel = state.queueContextLabel || playlist?.name || ''
  updatePlayerCover(track)
  refs.playerTitle.textContent = state.isResolving ? `${TEXT.resolving}${track.name}` : track.name
  refs.playerMeta.textContent = [track.artists.join('\u3001'), contextLabel, state.isPreview ? TEXT.previewTrack : ''].filter(Boolean).join(' / ')
  updateProgressUI()
}

function updatePlayerCover(track) {
  if (!refs.playerCover || !refs.playerCoverImage) {
    return
  }

  const coverUrl = track?.albumCoverUrl || ''
  if (!coverUrl) {
    refs.playerCover.classList.add('hidden')
    refs.playerCoverImage.removeAttribute('src')
    refs.playerCoverImage.alt = ''
    return
  }

  refs.playerCover.classList.remove('hidden')
  refs.playerCoverImage.src = coverUrl
  refs.playerCoverImage.alt = `${track?.name || '\u6b4c\u66f2'} \u4e13\u8f91\u5c01\u9762`
}

function updatePreviewState() {
  const track = getCurrentTrack()
  if (!track) {
    state.isPreview = false
    return
  }

  const nextPreviewState = isPreviewByDuration(track.durationMs, Math.round((refs.audio.duration || 0) * 1000))
  if (!state.isPreview && nextPreviewState) {
    showToast(TEXT.previewTrack)
  }
  state.isPreview = nextPreviewState
}

function isPreviewByDuration(expectedDurationMs, actualDurationMs) {
  return expectedDurationMs > 0
    && actualDurationMs > 0
    && expectedDurationMs - actualDurationMs >= PREVIEW_DURATION_GAP_MS
}

function toggleTheme() {
  const nextTheme = state.theme === 'light' ? 'dark' : 'light'
  applyTheme(nextTheme)
  showToast(nextTheme === 'dark' ? TEXT.switchedDark : TEXT.switchedLight)
}

function applyTheme(theme, { silent = false, persistLocal = true } = {}) {
  state.theme = theme === 'dark' ? 'dark' : 'light'
  document.body.dataset.theme = state.theme
  refs.themeToggleBtn.setAttribute('aria-label', state.theme === 'dark' ? '\u5207\u5230\u767d\u5e95' : '\u5207\u5230\u9ed1\u5e95')
  refs.themeToggleBtn.setAttribute('title', state.theme === 'dark' ? '\u5207\u5230\u767d\u5e95' : '\u5207\u5230\u9ed1\u5e95')
  refs.themeToggleBtn.dataset.theme = state.theme

  if (persistLocal) {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, state.theme)
    } catch {}
  }

  if (!silent) {
    void persistPreferences()
  }
}

function renderSettings() {
  syncSpotifyImportActionLabels()
  applyUiScale(state.settings.uiScale)
  refs.playlistRecommendationsToggle.checked = Boolean(state.settings.showPlaylistRecommendations)
  refs.likedPlaylistDisplayModeSelect.value = normalizeLikedPlaylistDisplayMode(
    state.settings.likedPlaylistDisplayMode
  )
  refs.defaultAudioQualitySelect.value = normalizeAudioQualityPreference(
    state.settings.defaultAudioQuality
  )
  refs.autoAdjustAudioQualityToggle.checked = state.settings.autoAdjustAudioQuality !== false
  const spotifyBusy = Boolean(state.spotifyImport.busy)
  const spotifyConnected = Boolean(state.spotifyImport.connected)
  const spotifySyncBusy = Boolean(state.spotifySync.busy)
  refs.settingsSpotifyAutoLoginBtn.disabled = spotifyBusy
  refs.settingsSpotifyRefreshBtn.disabled = spotifyBusy || !spotifyConnected
  refs.settingsSpotifyClearBtn.disabled = spotifyBusy || !spotifyConnected
  refs.settingsSpotifySyncToNeteaseBtn.disabled = spotifyBusy || spotifySyncBusy || !spotifyConnected || !canUseNeteaseFeatures()
  refs.settingsSpotifySyncToSpotifyBtn.disabled = spotifyBusy || spotifySyncBusy || !spotifyConnected || !canUseNeteaseFeatures()
  refs.settingsSpotifyStatus.textContent = spotifyBusy
    ? TEXT.spotifyImportLoading
    : spotifyConnected
      ? `${TEXT.spotifyImportStatusConnected}${state.spotifyImport.account?.nickname || 'Spotify'}`
      : TEXT.spotifyImportStatusDisconnected
  refs.settingsUpdateHint.textContent = getAppUpdateHintText()
  refs.settingsUpdateStatus.textContent = getAppUpdateStatusText()
  refs.settingsUpdateStatus.classList.toggle('is-error', Boolean(state.appUpdate.error) && !state.appUpdate.busy)
  refs.settingsUpdateStatus.classList.toggle(
    'is-highlight',
    Boolean(state.appUpdate.updateAvailable) && !state.appUpdate.error
  )
  refs.settingsUpdateCheckBtn.disabled = Boolean(state.appUpdate.busy)
  refs.settingsUpdateCheckBtn.textContent = state.appUpdate.busy && state.appUpdate.action !== 'install'
    ? TEXT.appUpdateCheckBusy
    : TEXT.appUpdateCheckButton
  refs.settingsUpdateInstallBtn.classList.toggle('hidden', !state.appUpdate.updateAvailable)
  refs.settingsUpdateInstallBtn.disabled = Boolean(state.appUpdate.busy) || !state.appUpdate.installSupported
  refs.settingsUpdateInstallBtn.textContent = state.appUpdate.busy && state.appUpdate.action === 'install'
    ? TEXT.appUpdateInstallBusy
    : state.appUpdate.latestVersion
      ? `一键更新到 ${formatAppVersion(state.appUpdate.latestVersion)}`
      : TEXT.appUpdateInstallButton
}

function toggleSettingsPanel() {
  const open = refs.settingsPanel.classList.toggle('is-open')
  refs.settingsBackdrop.classList.toggle('hidden', !open)
  if (open && !state.appUpdate.checked && !state.appUpdate.busy) {
    void refreshAppUpdateStatus({ silent: true })
  }
}

function closeSettingsPanel() {
  refs.settingsPanel.classList.remove('is-open')
  refs.settingsBackdrop.classList.add('hidden')
}

function syncPlaylistEditorUi() {
  const editorState = renderRuntime.playlistEditorState
  const open = Boolean(editorState)
  refs.playlistEditor.classList.toggle('hidden', !open)
  refs.playlistEditorBackdrop.classList.toggle('hidden', !open)
  if (!open) {
    return
  }

  const creating = editorState.mode === 'create'
  const busy = Boolean(editorState.saving || editorState.deleting)
  const previewUrl = editorState.coverUpload?.previewUrl || editorState.currentCoverUrl || ''

  refs.playlistEditorKicker.textContent = creating ? TEXT.createOwnedPlaylist : TEXT.editOwnedPlaylist
  refs.playlistEditorTitle.textContent = creating ? TEXT.playlistEditorCreateTitle : TEXT.playlistEditorEditTitle
  refs.playlistEditorSaveBtn.textContent = creating ? TEXT.playlistEditorSaveCreate : TEXT.playlistEditorSaveUpdate
  refs.playlistEditorDeleteBtn.classList.toggle('hidden', creating)
  refs.playlistEditorDeleteBtn.textContent = editorState.deleting
    ? `${TEXT.deleteOwnedPlaylist}...`
    : TEXT.deleteOwnedPlaylist
  refs.playlistEditorSaveBtn.disabled = busy
  refs.playlistEditorDeleteBtn.disabled = busy
  refs.playlistEditorCancelBtn.disabled = busy
  refs.playlistEditorCloseBtn.disabled = busy
  refs.playlistEditorName.disabled = busy
  refs.playlistEditorDescription.disabled = busy
  refs.playlistEditorCoverInput.disabled = busy
  refs.playlistEditorCoverResetBtn.disabled = busy

  refs.playlistEditorCoverPreview.classList.toggle('hidden', !previewUrl)
  refs.playlistEditorCoverEmpty.classList.toggle('hidden', Boolean(previewUrl))
  if (previewUrl) {
    refs.playlistEditorCoverPreview.src = previewUrl
    refs.playlistEditorCoverPreview.alt = `${refs.playlistEditorName.value || TEXT.playlistEditorName} ${TEXT.playlistEditorCover}`
  } else {
    refs.playlistEditorCoverPreview.removeAttribute('src')
    refs.playlistEditorCoverPreview.alt = ''
  }

  refs.playlistEditorCoverResetBtn.classList.toggle('hidden', !editorState.coverUpload)
}

function openPlaylistEditor(editorState) {
  closeContextMenu()
  hideAlbumHoverPreview()
  closeSettingsPanel()
  renderRuntime.playlistEditorState = editorState
  refs.playlistEditorName.value = editorState.playlist?.name || ''
  refs.playlistEditorDescription.value = editorState.playlist?.description || ''
  refs.playlistEditorCoverInput.value = ''
  syncPlaylistEditorUi()
  window.requestAnimationFrame(() => {
    refs.playlistEditorName.focus()
    refs.playlistEditorName.select()
  })
}

function closePlaylistEditor() {
  const editorState = renderRuntime.playlistEditorState
  if (editorState?.saving || editorState?.deleting) {
    return
  }

  renderRuntime.playlistEditorState = null
  refs.playlistEditorForm.reset()
  refs.playlistEditorCoverInput.value = ''
  refs.playlistEditorCoverPreview.removeAttribute('src')
  refs.playlistEditorCoverPreview.classList.add('hidden')
  refs.playlistEditorCoverEmpty.classList.remove('hidden')
  refs.playlistEditorBackdrop.classList.add('hidden')
  refs.playlistEditor.classList.add('hidden')
}

function openPlaylistEditorForCreate() {
  openPlaylistEditor({
    mode: 'create',
    playlist: {
      id: 0,
      name: '',
      description: '',
      coverUrl: '',
    },
    currentCoverUrl: '',
    coverUpload: null,
    saving: false,
    deleting: false,
  })
}

async function openPlaylistEditorForOwnedPlaylist(playlistId) {
  const playlist = getPlaylistById(playlistId)
  if (!canEditOwnedPlaylist(playlist)) {
    return
  }

  let nextPlaylist = playlist
  if (appBridge && typeof appBridge.getOwnedPlaylistSummary === 'function') {
    const result = await appBridge.getOwnedPlaylistSummary(playlistId)
    if (result?.ok && result.playlist) {
      nextPlaylist = normalizePlaylist({
        ...playlist,
        ...result.playlist,
        _normalized: false,
      })
      setPlaylists(upsertPlaylistIntoLibrary(state.playlists, nextPlaylist))
    } else if (result?.error) {
      showToast(result.error, 'error')
    }
  }

  openPlaylistEditor({
    mode: 'edit',
    playlist: nextPlaylist,
    currentCoverUrl: nextPlaylist.coverUrl || '',
    coverUpload: null,
    saving: false,
    deleting: false,
  })
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(reader.error || new Error(TEXT.playlistEditorPickCoverFailed))
    reader.readAsDataURL(file)
  })
}

function loadImageElement(src) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error(TEXT.playlistEditorPickCoverFailed))
    image.src = src
  })
}

function dataUrlToUint8Array(dataUrl) {
  const [, base64] = String(dataUrl || '').split(',', 2)
  const binary = window.atob(base64 || '')
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }
  return bytes
}

async function convertImageFileToJpegPayload(file) {
  const sourceUrl = await fileToDataUrl(file)
  const image = await loadImageElement(sourceUrl)
  const maxSide = 1200
  const scale = Math.min(1, maxSide / Math.max(image.naturalWidth || 1, image.naturalHeight || 1))
  const width = Math.max(1, Math.round((image.naturalWidth || 1) * scale))
  const height = Math.max(1, Math.round((image.naturalHeight || 1) * scale))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error(TEXT.playlistEditorPickCoverFailed)
  }

  context.drawImage(image, 0, 0, width, height)
  const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.9)
  return {
    name: String(file?.name || 'playlist-cover').replace(/\.[a-z0-9]+$/i, '') + '.jpg',
    previewUrl: jpegDataUrl,
    data: dataUrlToUint8Array(jpegDataUrl),
  }
}

async function handlePlaylistEditorCoverChange() {
  const editorState = renderRuntime.playlistEditorState
  const file = refs.playlistEditorCoverInput.files?.[0]
  if (!editorState || !file) {
    return
  }

  try {
    editorState.coverUpload = await convertImageFileToJpegPayload(file)
    syncPlaylistEditorUi()
  } catch (error) {
    refs.playlistEditorCoverInput.value = ''
    editorState.coverUpload = null
    syncPlaylistEditorUi()
    showToast(error.message || TEXT.playlistEditorPickCoverFailed, 'error')
  }
}

function resetPlaylistEditorCoverSelection() {
  const editorState = renderRuntime.playlistEditorState
  if (!editorState || editorState.saving || editorState.deleting) {
    return
  }

  editorState.coverUpload = null
  refs.playlistEditorCoverInput.value = ''
  syncPlaylistEditorUi()
}

function refreshUiAfterOwnedPlaylistMutation() {
  syncQueueWithPlaylists()
  renderTabs()
  renderHeader()
  renderPlayer()
  applyFilters({ syncAll: true })
}

function removeOwnedPlaylistLocalState(playlistId) {
  const normalizedPlaylistId = Number(playlistId || 0)
  if (normalizedPlaylistId <= 0) {
    return
  }

  const nextOrderIds = getPlaylistOrderIdsForTab('owned').filter((id) => id !== normalizedPlaylistId)
  setPlaylistOrderIdsForTab('owned', nextOrderIds, { persist: true })

  const nextCollapsedIds = getCollapsedPlaylistIdsForTab('owned').filter((id) => id !== normalizedPlaylistId)
  setCollapsedPlaylistIdsForTab('owned', nextCollapsedIds, { persist: true })

  if (renderRuntime.selectedPlaylistId === normalizedPlaylistId) {
    clearTrackSelection()
  }

  const removedCurrentPlaylist = Number(state.queuePlaylistId || 0) === normalizedPlaylistId
  setPlaylists(state.playlists.filter((playlist) => Number(playlist.id || 0) !== normalizedPlaylistId))
  if (removedCurrentPlaylist) {
    clearCurrentPlayback()
  } else {
    syncQueueWithPlaylists()
  }
}

async function submitPlaylistEditor() {
  const editorState = renderRuntime.playlistEditorState
  if (!editorState || editorState.saving || editorState.deleting) {
    return
  }

  const name = refs.playlistEditorName.value.trim()
  if (!name) {
    showToast(TEXT.playlistEditorNameRequired, 'error')
    refs.playlistEditorName.focus()
    return
  }

  const description = refs.playlistEditorDescription.value.trim()
  editorState.saving = true
  syncPlaylistEditorUi()

  const coverFile = editorState.coverUpload
    ? {
      name: editorState.coverUpload.name,
      previewUrl: editorState.coverUpload.previewUrl,
      data: editorState.coverUpload.data,
    }
    : null

  try {
    if (!appBridge) {
      throw new Error(editorState.mode === 'create' ? TEXT.createOwnedPlaylistFailed : TEXT.updateOwnedPlaylistFailed)
    }

    if (editorState.mode === 'create') {
      const result = await appBridge.createOwnedPlaylist({
        name,
        description,
        coverFile,
      })
      if (!result?.ok || !result.playlist) {
        throw new Error(result?.error || TEXT.createOwnedPlaylistFailed)
      }

      setPlaylists(upsertPlaylistIntoLibrary(state.playlists, result.playlist))
      const ownedIds = getOwnedPlaylists()
        .filter((playlist) => Number(playlist.id || 0) !== Number(result.playlist.id || 0))
        .map((playlist) => playlist.id)
      setPlaylistOrderIdsForTab('owned', [Number(result.playlist.id || 0), ...ownedIds], { persist: true })
      editorState.saving = false
      closePlaylistEditor()
      refreshUiAfterOwnedPlaylistMutation()
      showToast(TEXT.createOwnedPlaylistDone)
      return
    }

    const result = await appBridge.updateOwnedPlaylist({
      playlist: editorState.playlist,
      name,
      description,
      coverFile,
    })
    if (!result?.ok || !result.playlist) {
      throw new Error(result?.error || TEXT.updateOwnedPlaylistFailed)
    }

    setPlaylists(upsertPlaylistIntoLibrary(state.playlists, result.playlist))
    editorState.saving = false
    closePlaylistEditor()
    refreshUiAfterOwnedPlaylistMutation()
    showToast(TEXT.updateOwnedPlaylistDone)
  } catch (error) {
    editorState.saving = false
    syncPlaylistEditorUi()
    showToast(error.message || (editorState.mode === 'create' ? TEXT.createOwnedPlaylistFailed : TEXT.updateOwnedPlaylistFailed), 'error')
  }
}

async function deleteOwnedPlaylistFromEditor() {
  const editorState = renderRuntime.playlistEditorState
  const playlist = editorState?.playlist
  if (!editorState || editorState.mode !== 'edit' || editorState.saving || editorState.deleting || !canEditOwnedPlaylist(playlist)) {
    return
  }

  if (!window.confirm(TEXT.playlistEditorDeleteConfirm)) {
    return
  }

  editorState.deleting = true
  syncPlaylistEditorUi()

  try {
    const result = await appBridge.deleteOwnedPlaylist({ playlist })
    if (!result?.ok) {
      throw new Error(result?.error || TEXT.deleteOwnedPlaylistFailed)
    }

    editorState.deleting = false
    closePlaylistEditor()
    removeOwnedPlaylistLocalState(playlist.id)
    refreshUiAfterOwnedPlaylistMutation()
    showToast(TEXT.deleteOwnedPlaylistDone)
  } catch (error) {
    editorState.deleting = false
    syncPlaylistEditorUi()
    showToast(error.message || TEXT.deleteOwnedPlaylistFailed, 'error')
  }
}

function handleSettingsChange() {
  const nextShowPlaylistRecommendations = refs.playlistRecommendationsToggle.checked
  const nextLikedPlaylistDisplayMode = normalizeLikedPlaylistDisplayMode(
    refs.likedPlaylistDisplayModeSelect.value
  )
  const nextDefaultAudioQuality = normalizeAudioQualityPreference(
    refs.defaultAudioQualitySelect.value
  )
  const nextAutoAdjustAudioQuality = refs.autoAdjustAudioQualityToggle.checked
  const recommendationsChanged = nextShowPlaylistRecommendations !== state.settings.showPlaylistRecommendations
  const audioQualityChanged = nextDefaultAudioQuality !== state.settings.defaultAudioQuality
    || nextAutoAdjustAudioQuality !== state.settings.autoAdjustAudioQuality

  state.settings.showPlaylistRecommendations = nextShowPlaylistRecommendations
  state.settings.likedPlaylistDisplayMode = nextLikedPlaylistDisplayMode
  state.settings.defaultAudioQuality = nextDefaultAudioQuality
  state.settings.autoAdjustAudioQuality = nextAutoAdjustAudioQuality

  if (recommendationsChanged) {
    resetRecommendationRuntime()
  }

  saveSettings()
  if (audioQualityChanged) {
    scheduleAudioQualityRefresh(AUDIO_QUALITY_REFRESH_REASON_SETTINGS)
  }
  applyFilters({ syncAll: true })
}

function handleUiScaleInput(event) {
  applyUiScale(event.target.value, { rerender: true })
}

function handleUiScaleCommit() {
  saveSettings()
}

function applyUiScale(scale, { rerender = false } = {}) {
  const normalizedScale = normalizeUiScale(scale)
  const changed = normalizedScale !== state.settings.uiScale
  state.settings.uiScale = normalizedScale

  document.documentElement.style.setProperty('--ui-scale', (normalizedScale / 100).toFixed(2))
  if (refs.uiScaleRange) {
    refs.uiScaleRange.value = String(normalizedScale)
  }
  if (refs.uiScaleValue) {
    refs.uiScaleValue.textContent = `${normalizedScale}%`
    refs.uiScaleValue.value = `${normalizedScale}%`
  }

  if (changed && rerender) {
    scheduleWallRenderWithOptions({ immediate: true, syncAll: true })
  }
}

function saveSettings() {
  try {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(state.settings))
  } catch {}

  void persistPreferences()
}

function loadUiSessionState() {
  try {
    const raw = window.sessionStorage.getItem(SESSION_LAYOUT_STORAGE_KEY) || '{}'
    return normalizeUiSessionState(JSON.parse(raw))
  } catch {
    return normalizeUiSessionState()
  }
}

function saveUiSessionState() {
  try {
    window.sessionStorage.setItem(SESSION_LAYOUT_STORAGE_KEY, JSON.stringify(state.uiSession))
  } catch {}
}

function loadStoredTheme() {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY)
    return value === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

function loadStoredSettings() {
  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY) || '{}'
    const parsed = JSON.parse(raw)
    return {
      showPlaylistRecommendations: Boolean(parsed.showPlaylistRecommendations),
      likedPlaylistDisplayMode: normalizeLikedPlaylistDisplayMode(parsed.likedPlaylistDisplayMode),
      defaultAudioQuality: normalizeAudioQualityPreference(parsed.defaultAudioQuality),
      autoAdjustAudioQuality: parsed.autoAdjustAudioQuality !== false,
      artistTrackDisplayLimit: normalizeArtistTrackDisplayLimit(parsed.artistTrackDisplayLimit),
      collapsedPlaylistIds: normalizeCollapsedPlaylistIds(parsed.collapsedPlaylistIds),
      ownedPlaylistOrderIds: normalizePlaylistOrderIds(parsed.ownedPlaylistOrderIds),
      uiScale: normalizeUiScale(parsed.uiScale),
    }
  } catch {
    return {
      showPlaylistRecommendations: false,
      likedPlaylistDisplayMode: LIKED_PLAYLIST_DISPLAY_MODE_ALL,
      defaultAudioQuality: AUDIO_QUALITY_BEST,
      autoAdjustAudioQuality: true,
      artistTrackDisplayLimit: ARTIST_TRACK_DISPLAY_LIMIT_DEFAULT,
      collapsedPlaylistIds: [],
      ownedPlaylistOrderIds: [],
      uiScale: UI_SCALE_DEFAULT,
    }
  }
}

async function hydrateStoredPreferences() {
  if (!appBridge || typeof appBridge.getPreferences !== 'function') {
    return
  }

  const result = await appBridge.getPreferences()
  if (!result?.ok || !result.preferences) {
    return
  }

  state.theme = result.preferences.theme === 'dark' ? 'dark' : 'light'
  state.settings.showPlaylistRecommendations = Boolean(
    result.preferences.showPlaylistRecommendations
  )
  state.settings.likedPlaylistDisplayMode = normalizeLikedPlaylistDisplayMode(
    result.preferences.likedPlaylistDisplayMode
  )
  state.settings.defaultAudioQuality = normalizeAudioQualityPreference(
    result.preferences.defaultAudioQuality
  )
  state.settings.autoAdjustAudioQuality = result.preferences.autoAdjustAudioQuality !== false
  state.settings.artistTrackDisplayLimit = normalizeArtistTrackDisplayLimit(
    result.preferences.artistTrackDisplayLimit
  )
  state.settings.collapsedPlaylistIds = normalizeCollapsedPlaylistIds(
    result.preferences.collapsedPlaylistIds
  )
  state.settings.ownedPlaylistOrderIds = normalizePlaylistOrderIds(
    result.preferences.ownedPlaylistOrderIds
  )
  state.settings.uiScale = normalizeUiScale(result.preferences.uiScale)

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, state.theme)
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(state.settings))
  } catch {}
}

async function persistPreferences() {
  if (!appBridge || typeof appBridge.savePreferences !== 'function') {
    return
  }

  await appBridge.savePreferences({
    theme: state.theme,
    showPlaylistRecommendations: Boolean(state.settings.showPlaylistRecommendations),
    likedPlaylistDisplayMode: normalizeLikedPlaylistDisplayMode(state.settings.likedPlaylistDisplayMode),
    defaultAudioQuality: normalizeAudioQualityPreference(state.settings.defaultAudioQuality),
    autoAdjustAudioQuality: state.settings.autoAdjustAudioQuality !== false,
    artistTrackDisplayLimit: normalizeArtistTrackDisplayLimit(state.settings.artistTrackDisplayLimit),
    collapsedPlaylistIds: normalizeCollapsedPlaylistIds(state.settings.collapsedPlaylistIds),
    ownedPlaylistOrderIds: normalizePlaylistOrderIds(state.settings.ownedPlaylistOrderIds),
    uiScale: normalizeUiScale(state.settings.uiScale),
  })
}

async function locateCurrentTrack() {
  const track = getCurrentTrack()
  if (!track || !state.queuePlaylistId) {
    showToast(TEXT.noCurrentTrack, 'error')
    return
  }

  const playlist = getPlaylistById(state.queuePlaylistId)
  if (!playlist) {
    showToast(TEXT.locateFailed, 'error')
    return
  }

  const nextTab = getPlaylistTab(playlist)
  if (!nextTab) {
    showToast(TEXT.locateFailed, 'error')
    return
  }
  if (state.activeTab !== nextTab) {
    activateTab(nextTab, { restoreTargetScroll: false })
  }

  setPlaylistCollapsed(state.queuePlaylistId, false, { persist: true, rerender: false })

  if (state.search) {
    await clearSearch({ syncAll: true })
  } else {
    applyFilters({ syncAll: true })
  }

  if (state.queueMode === 'recommendation') {
    const placement = getWallPlacementByPlaylistId(state.queuePlaylistId)
    if (placement) {
      const targetTop = clamp(
        Math.round((placement.top + placement.height) - refs.wallScroll.clientHeight * 0.65),
        0,
        Math.max(0, refs.wallScroll.scrollHeight - refs.wallScroll.clientHeight)
      )
      refs.wallScroll.scrollTop = targetTop
      renderWallViewport({ force: true })
    }

    await new Promise((resolve) => window.requestAnimationFrame(() => window.requestAnimationFrame(resolve)))

    const recommendationRow = refs.wallColumns.querySelector(`.recommendation-play-btn[data-playlist-id="${state.queuePlaylistId}"][data-track-id="${track.id}"]`)
    if (recommendationRow) {
      recommendationRow.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
      showToast(TEXT.locatedCurrent)
      return
    }
  }

  const row = await focusTrackRowInPlaylist(state.queuePlaylistId, track.id)
  if (!row) {
    showToast(TEXT.locateFailed, 'error')
    return
  }

  showToast(TEXT.locatedCurrent)
}

function getWallPlacementByPlaylistId(playlistId) {
  for (const placements of renderRuntime.wallPlacementsByColumn) {
    const placement = (placements || []).find((item) => item.item.playlist.id === Number(playlistId))
    if (placement) {
      return placement
    }
  }

  return null
}

function formatRepeatButton() {
  if (state.repeat === 'one') return TEXT.repeatOne
  if (state.repeat === 'off') return TEXT.repeatOff
  return TEXT.repeatAll
}

function setButtonLabel(button, label) {
  button.setAttribute('aria-label', label)
  button.title = label
}

function syncPlayerButtonState(hasTrack) {
  const isPlaying = hasTrack && !refs.audio.paused
  setButtonLabel(refs.playBtn, isPlaying ? TEXT.pause : TEXT.play)
  refs.playBtn.dataset.state = isPlaying ? 'playing' : 'paused'
  setButtonLabel(refs.prevBtn, TEXT.prev)
  setButtonLabel(refs.nextBtn, TEXT.next)
  setButtonLabel(refs.shuffleBtn, state.shuffle ? TEXT.shuffleOn : TEXT.shuffleOff)
  refs.shuffleBtn.dataset.active = String(state.shuffle)
  setButtonLabel(refs.repeatBtn, formatRepeatButton())
  refs.repeatBtn.dataset.mode = state.repeat
}

function updateProgressUI() {
  const current = Number.isFinite(refs.audio.currentTime) ? refs.audio.currentTime : 0
  const total = Number.isFinite(refs.audio.duration) ? refs.audio.duration : 0
  refs.currentTime.textContent = formatTime(current)
  refs.totalTime.textContent = formatTime(total)
  refs.progressRange.value = total > 0 ? String(Math.round((current / total) * 1000)) : '0'
}

function computeColumns() {
  const metrics = getLayoutMetrics()
  const scrollWidth = Math.max(refs.wallScroll?.clientWidth || 0, window.innerWidth || 0)
  const availableWidth = Math.max(
    metrics.cardWidth,
    scrollWidth - (metrics.wallPaddingX * 2)
  )
  const autoColumns = Math.floor((availableWidth + metrics.gap) / (metrics.cardWidth + metrics.gap))
  return clamp(autoColumns, 1, WALL_MAX_COLUMNS)
}

function estimateCardHeight(item) {
  const metrics = getLayoutMetrics()
  const collapsed = isPlaylistCollapsed(item.playlist)
  const rowCount = collapsed ? 0 : (item.playlist.wallTracks?.length || 0)
  const bodyHeight = collapsed
    ? 0
    : rowCount
      ? rowCount * metrics.rowHeight
      : metrics.placeholderHeight
  const recommendationHeight = shouldRenderPlaylistRecommendations(item) ? metrics.recommendationHeight : 0
  return metrics.headerHeight + bodyHeight + recommendationHeight + metrics.footerHeight + 2
}

function setPlaylistCollapsed(playlistId, collapsed, options = {}) {
  const normalizedPlaylistId = getPlaylistCollapseId(playlistId)
  if (!Number.isSafeInteger(normalizedPlaylistId) || normalizedPlaylistId === 0) {
    return false
  }

  const playlistTab = getPlaylistTab(playlistId)
  if (!playlistTab) {
    return false
  }

  const {
    persist = true,
    rerender = true,
    syncAll = true,
  } = options

  const currentIds = getCollapsedPlaylistIdsForTab(playlistTab)
  const alreadyCollapsed = currentIds.includes(normalizedPlaylistId)
  if (collapsed === alreadyCollapsed) {
    return false
  }

  const nextIds = collapsed
    ? normalizeCollapsedPlaylistIds([...currentIds, normalizedPlaylistId])
    : currentIds.filter((id) => id !== normalizedPlaylistId)

  if (collapsed && Number(renderRuntime.selectedPlaylistId || 0) === normalizedPlaylistId) {
    clearTrackSelection()
  }

  setCollapsedPlaylistIdsForTab(playlistTab, nextIds, { persist })

  if (rerender) {
    scheduleWallRenderWithOptions({ immediate: true, syncAll })
  }

  return true
}

function togglePlaylistCollapsed(playlistId) {
  const normalizedPlaylistId = getPlaylistCollapseId(playlistId)
  if (!normalizedPlaylistId) {
    return
  }

  setPlaylistCollapsed(normalizedPlaylistId, !isPlaylistCollapsed(normalizedPlaylistId))
}

function indexOfSmallest(values) {
  let smallestIndex = 0
  for (let index = 1; index < values.length; index += 1) {
    if (values[index] < values[smallestIndex]) smallestIndex = index
  }
  return smallestIndex
}

function scheduleWallRender() {
  scheduleWallRenderWithOptions()
}

function handleWallScroll() {
  if (!shouldDeferPendingTabScrollRestore()) {
    rememberTabScrollPosition()
  }

  if (!renderRuntime.wallColumns.length) {
    return
  }

  if (renderRuntime.wallViewportFrame) {
    return
  }

  renderRuntime.wallViewportFrame = window.requestAnimationFrame(() => {
    renderRuntime.wallViewportFrame = 0
    renderWallViewport()
  })
}

function scheduleWallRenderWithOptions({ immediate = false, syncAll = false } = {}) {
  window.clearTimeout(scheduleWallRender.timer)
  cancelWallRenderWork()

  const run = () => {
    renderRuntime.wallRenderFrame = 0
    if (!refs.app.classList.contains('hidden')) {
      renderWall({ syncAll })
    }
  }

  if (immediate) {
    run()
    return
  }

  scheduleWallRender.timer = window.setTimeout(() => {
    renderRuntime.wallRenderFrame = window.requestAnimationFrame(run)
  }, 60)
}

function cancelWallRenderWork() {
  if (renderRuntime.wallRenderFrame) {
    window.cancelAnimationFrame(renderRuntime.wallRenderFrame)
    renderRuntime.wallRenderFrame = 0
  }

  if (renderRuntime.wallViewportFrame) {
    window.cancelAnimationFrame(renderRuntime.wallViewportFrame)
    renderRuntime.wallViewportFrame = 0
  }

}

function handleKeydown(event) {
  const target = event.target
  const editing = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement

  if (event.key === 'Escape' && !refs.contextMenu.classList.contains('hidden')) {
    closeContextMenu()
    return
  }

  if (event.key === 'Escape' && renderRuntime.playlistUndoNotice?.playlist) {
    dismissPlaylistUndoNotice()
    return
  }

  if (event.key === 'Escape' && !refs.albumHoverPreview.classList.contains('hidden')) {
    hideAlbumHoverPreview()
    return
  }

  if (event.key === 'Escape' && !refs.playlistEditor.classList.contains('hidden')) {
    closePlaylistEditor()
    return
  }

  if (event.key === 'Escape' && refs.settingsPanel.classList.contains('is-open')) {
    closeSettingsPanel()
    return
  }

  if (event.key === 'Escape' && renderRuntime.selectedTrackKeys.size) {
    clearTrackSelection()
    return
  }

  if (event.key === '/' && !editing) {
    event.preventDefault()
    refs.searchInput.focus()
    refs.searchInput.select()
    return
  }

  if (editing) {
    if (event.key === 'Escape') target.blur()
    return
  }

  if (event.code === 'Space') {
    event.preventDefault()
    togglePlayback()
  } else if (event.key === '1') {
    void setActiveTab('owned')
  } else if (event.key === '2') {
    void setActiveTab('subscribed')
  } else if (event.key === '3') {
    void setActiveTab('explore')
  } else if (event.key === '4') {
    void setActiveTab('artists')
  } else if (event.key.toLowerCase() === 'n') {
    nextTrack({ fromEnded: false })
  } else if (event.key.toLowerCase() === 'p') {
    previousTrack()
  }
}

function getCurrentTrack() {
  if (state.queueIndex < 0 || state.queueIndex >= state.queue.length) return null
  return state.queue[state.queueIndex]
}

function getPlaylistById(playlistId) {
  return state.playlistMap.get(Number(playlistId)) || null
}

function trackMatches(track, query) {
  return track.searchText.includes(query)
}

function normalizeQuery(value) {
  return String(value || '').trim().toLowerCase()
}

function formatTime(seconds) {
  const safe = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0
  return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, '0')}`
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString('zh-CN')
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div')
  toast.className = `toast${type === 'error' ? ' error' : ''}`
  toast.textContent = message
  refs.toastWrap.appendChild(toast)
  window.setTimeout(() => toast.remove(), 2800)
}
