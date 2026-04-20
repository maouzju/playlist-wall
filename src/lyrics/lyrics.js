(() => {
  const bridge = window.lyricsBridge
  if (!bridge) {
    console.error('lyricsBridge is unavailable')
    return
  }

  const root = document.getElementById('lyrics-root')
  const mainEl = document.getElementById('lyrics-main')
  const translateEl = document.getElementById('lyrics-translate')
  const btnFontDec = document.getElementById('lyrics-btn-font-dec')
  const btnFontInc = document.getElementById('lyrics-btn-font-inc')
  const btnLock = document.getElementById('lyrics-btn-lock')
  const btnClose = document.getElementById('lyrics-btn-close')
  const colorCurrentInput = document.getElementById('lyrics-color-current')
  const colorTranslateInput = document.getElementById('lyrics-color-translate')

  const FONT_MIN = 16
  const FONT_MAX = 80
  const FONT_STEP = 2
  const TRANSLATE_MATCH_TOLERANCE_SEC = 0.35

  const state = {
    trackId: null,
    lrcLines: [],
    tlrcLines: [],
    currentIndex: -1,
    fallbackTitle: '',
    fallbackReason: '',
    locked: false,
    prefs: {
      fontSize: 36,
      colorCurrent: '#ffffff',
      colorTranslate: '#cfd8e6',
    },
  }

  function parseLRC(text) {
    if (typeof text !== 'string' || !text.trim()) return []
    const re = /\[(\d+):(\d+)(?:[.:](\d+))?\]/g
    const lines = []
    text.split(/\r?\n/).forEach((raw) => {
      if (!raw) return
      re.lastIndex = 0
      const timestamps = []
      let match
      while ((match = re.exec(raw)) !== null) {
        const min = Number(match[1]) || 0
        const sec = Number(match[2]) || 0
        const rawMs = match[3] || ''
        let fracSec = 0
        if (rawMs) {
          const digits = rawMs.slice(0, 3).padEnd(3, '0')
          fracSec = Number(digits) / 1000
        }
        timestamps.push(min * 60 + sec + fracSec)
      }
      const text = raw.replace(/\[[^\]]*\]/g, '').trim()
      if (!text || !timestamps.length) return
      timestamps.forEach((time) => {
        lines.push({ time, text })
      })
    })
    return lines.sort((a, b) => a.time - b.time)
  }

  function findLineIndex(lines, currentTime) {
    if (!lines.length) return -1
    let lo = 0
    let hi = lines.length - 1
    if (currentTime < lines[0].time) return -1
    if (currentTime >= lines[hi].time) return hi
    while (lo <= hi) {
      const mid = (lo + hi) >> 1
      const midTime = lines[mid].time
      const nextTime = lines[mid + 1] ? lines[mid + 1].time : Number.POSITIVE_INFINITY
      if (currentTime >= midTime && currentTime < nextTime) return mid
      if (currentTime < midTime) hi = mid - 1
      else lo = mid + 1
    }
    return -1
  }

  function findTranslation(lines, targetTime) {
    if (!lines.length || !Number.isFinite(targetTime)) return ''
    let best = ''
    let bestDiff = Infinity
    for (const line of lines) {
      const diff = Math.abs(line.time - targetTime)
      if (diff < bestDiff && diff <= TRANSLATE_MATCH_TOLERANCE_SEC) {
        best = line.text
        bestDiff = diff
      }
      if (line.time > targetTime + TRANSLATE_MATCH_TOLERANCE_SEC) break
    }
    return best
  }

  function applyPrefsToUi(prefs) {
    if (!prefs) return
    state.prefs = {
      fontSize: Number(prefs.fontSize) || 36,
      colorCurrent: prefs.colorCurrent || '#ffffff',
      colorTranslate: prefs.colorTranslate || '#cfd8e6',
    }
    root.style.setProperty('--lyrics-font-size', `${state.prefs.fontSize}px`)
    root.style.setProperty('--lyrics-color-current', state.prefs.colorCurrent)
    root.style.setProperty('--lyrics-color-translate', state.prefs.colorTranslate)
    if (colorCurrentInput) colorCurrentInput.value = state.prefs.colorCurrent
    if (colorTranslateInput) colorTranslateInput.value = state.prefs.colorTranslate
  }

  function applyLockedStateToUi(locked) {
    state.locked = Boolean(locked)
    root.dataset.locked = state.locked ? 'true' : 'false'
    if (btnLock) btnLock.textContent = state.locked ? '解锁' : '锁定'
  }

  function renderLine(index) {
    if (state.fallbackReason && !state.lrcLines.length) {
      mainEl.textContent = state.fallbackReason
      translateEl.textContent = ''
      return
    }
    if (!state.lrcLines.length) {
      mainEl.textContent = state.fallbackTitle || '桌面歌词 · 等待播放'
      translateEl.textContent = ''
      return
    }
    if (index < 0) {
      mainEl.textContent = state.fallbackTitle || state.lrcLines[0].text
      translateEl.textContent = ''
      return
    }
    const line = state.lrcLines[index]
    mainEl.textContent = line.text
    translateEl.textContent = findTranslation(state.tlrcLines, line.time)
  }

  function onPlaybackTime(payload) {
    if (!payload) return
    if (payload.trackId != null && state.trackId != null && Number(payload.trackId) !== Number(state.trackId)) {
      return
    }
    const nextIndex = findLineIndex(state.lrcLines, Number(payload.currentTime) || 0)
    if (nextIndex !== state.currentIndex) {
      state.currentIndex = nextIndex
      renderLine(nextIndex)
    }
  }

  function onLyricsData(payload) {
    if (!payload) return
    state.trackId = payload.trackId != null ? Number(payload.trackId) : null
    state.lrcLines = parseLRC(payload.lrc)
    state.tlrcLines = parseLRC(payload.tlrc)
    state.currentIndex = -1
    const titleParts = [payload.title || '', payload.artist || ''].filter(Boolean)
    state.fallbackTitle = titleParts.join(' — ')
    if (payload.errorMessage) {
      state.fallbackReason = `歌词获取失败：${payload.errorMessage}`
    } else if (payload.noLyric) {
      state.fallbackReason = '纯音乐，暂无歌词'
    } else if (!state.lrcLines.length) {
      state.fallbackReason = state.fallbackTitle ? '' : '该歌曲暂无歌词'
    } else {
      state.fallbackReason = ''
    }
    renderLine(-1)
  }

  function onPrefsChange(prefs) {
    applyPrefsToUi(prefs)
  }

  function changeFontSize(delta) {
    const next = Math.max(FONT_MIN, Math.min(FONT_MAX, state.prefs.fontSize + delta))
    if (next === state.prefs.fontSize) return
    state.prefs.fontSize = next
    root.style.setProperty('--lyrics-font-size', `${next}px`)
    bridge.saveLyricsPrefs({ fontSize: next })
  }

  function toggleLock() {
    const next = !state.locked
    bridge.saveLyricsPrefs({ locked: next })
  }

  btnFontDec && btnFontDec.addEventListener('click', () => changeFontSize(-FONT_STEP))
  btnFontInc && btnFontInc.addEventListener('click', () => changeFontSize(FONT_STEP))
  btnLock && btnLock.addEventListener('click', toggleLock)
  btnClose && btnClose.addEventListener('click', () => {
    bridge.closeLyricsWindow()
  })
  colorCurrentInput && colorCurrentInput.addEventListener('change', (event) => {
    const value = event.target.value
    state.prefs.colorCurrent = value
    root.style.setProperty('--lyrics-color-current', value)
    bridge.saveLyricsPrefs({ colorCurrent: value })
  })
  colorTranslateInput && colorTranslateInput.addEventListener('change', (event) => {
    const value = event.target.value
    state.prefs.colorTranslate = value
    root.style.setProperty('--lyrics-color-translate', value)
    bridge.saveLyricsPrefs({ colorTranslate: value })
  })

  bridge.onLyricsData(onLyricsData)
  bridge.onPlaybackTime(onPlaybackTime)
  bridge.onPrefsChange(onPrefsChange)
  if (typeof bridge.onLockedChange === 'function') {
    bridge.onLockedChange((payload) => applyLockedStateToUi(payload && payload.locked))
  }
  bridge.getLyricsPrefs().then((result) => {
    if (result && result.ok && result.lyrics) {
      applyPrefsToUi(result.lyrics)
    }
  })

  const HOVER_HIDE_DELAY_MS = 600
  let hideHoverTimer = 0
  function showHover() {
    if (hideHoverTimer) {
      clearTimeout(hideHoverTimer)
      hideHoverTimer = 0
    }
    if (root.dataset.hover !== 'true') root.dataset.hover = 'true'
  }
  function scheduleHideHover() {
    if (hideHoverTimer) clearTimeout(hideHoverTimer)
    hideHoverTimer = window.setTimeout(() => {
      hideHoverTimer = 0
      root.dataset.hover = 'false'
    }, HOVER_HIDE_DELAY_MS)
  }
  document.addEventListener('mousemove', showHover)
  document.addEventListener('mouseover', showHover)
  document.addEventListener('mouseout', (event) => {
    if (!event.relatedTarget) scheduleHideHover()
  })
  window.addEventListener('blur', scheduleHideHover)
})()
