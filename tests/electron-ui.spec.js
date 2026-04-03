const path = require('path')
const { test, expect } = require('playwright/test')

const rendererPath = path.resolve(__dirname, '../src/renderer/index.html').replace(/\\/g, '/')
const PAGE_URL = `file:///${rendererPath}?mock=1`
const AUTH_PAGE_URL = `file:///${rendererPath}?mock=1&auth=1`
const PROGRESSIVE_PAGE_URL = `file:///${rendererPath}?mock=1&progressive=1`
const HUGE_PAGE_URL = `file:///${rendererPath}?mock=1&huge=1`
const EXPLORE_DELAY_PAGE_URL = `file:///${rendererPath}?mock=1&exploreDelay=900`
const PRE_INIT_EXPLORE_PAGE_URL = `file:///${rendererPath}?mock=1&initDelay=900&exploreDelay=900`

test.use({
  viewport: { width: 1440, height: 960 },
})

async function waitForWall(page, url = PAGE_URL) {
  await page.goto(url)
  await page.waitForSelector('.playlist-card')
}

async function closeSettingsPanel(page) {
  await page.keyboard.press('Escape')
  await expect(page.locator('#settings-panel')).not.toHaveClass(/is-open/)
}

async function dragTrack(page, sourceSelector, targetSelector, placement = 'after') {
  await page.evaluate(({ sourceSelector, targetSelector, placement }) => {
    const source = document.querySelector(sourceSelector)
    const target = document.querySelector(targetSelector)
    if (!source || !target) {
      throw new Error(`drag target missing: ${sourceSelector} -> ${targetSelector}`)
    }

    const sourceRect = source.getBoundingClientRect()
    const targetRect = target.getBoundingClientRect()
    const clientX = Math.round(targetRect.left + Math.min(24, Math.max(10, targetRect.width / 2)))
    const clientY = placement === 'before'
      ? Math.round(targetRect.top + 2)
      : Math.round(targetRect.bottom - 2)
    const sourceX = Math.round(sourceRect.left + Math.min(24, Math.max(10, sourceRect.width / 2)))
    const sourceY = Math.round(sourceRect.top + (sourceRect.height / 2))
    const dataTransfer = new DataTransfer()

    source.dispatchEvent(new DragEvent('dragstart', {
      bubbles: true,
      cancelable: true,
      clientX: sourceX,
      clientY: sourceY,
      dataTransfer,
    }))
    target.dispatchEvent(new DragEvent('dragover', {
      bubbles: true,
      cancelable: true,
      clientX,
      clientY,
      dataTransfer,
    }))
    target.dispatchEvent(new DragEvent('drop', {
      bubbles: true,
      cancelable: true,
      clientX,
      clientY,
      dataTransfer,
    }))
    source.dispatchEvent(new DragEvent('dragend', {
      bubbles: true,
      cancelable: true,
      clientX,
      clientY,
      dataTransfer,
    }))
  }, { sourceSelector, targetSelector, placement })
}

async function dragPlaylistHeader(page, sourcePlaylistId, targetPlaylistId, placement = 'after') {
  await page.evaluate(({ sourcePlaylistId, targetPlaylistId, placement }) => {
    const source = document.querySelector(`.playlist-card[data-playlist-id="${sourcePlaylistId}"] [data-drag-playlist="${sourcePlaylistId}"]`)
    const target = document.querySelector(`.playlist-card[data-playlist-id="${targetPlaylistId}"]`)
    if (!source || !target) {
      throw new Error(`playlist drag target missing: ${sourcePlaylistId} -> ${targetPlaylistId}`)
    }

    const sourceRect = source.getBoundingClientRect()
    const targetRect = target.getBoundingClientRect()
    const clientX = Math.round(targetRect.left + Math.min(40, Math.max(16, targetRect.width / 2)))
    const clientY = placement === 'before'
      ? Math.round(targetRect.top + 2)
      : Math.round(targetRect.bottom - 2)
    const sourceX = Math.round(sourceRect.left + Math.min(40, Math.max(16, sourceRect.width / 2)))
    const sourceY = Math.round(sourceRect.top + (sourceRect.height / 2))
    const dataTransfer = new DataTransfer()

    source.dispatchEvent(new DragEvent('dragstart', {
      bubbles: true,
      cancelable: true,
      clientX: sourceX,
      clientY: sourceY,
      dataTransfer,
    }))
    target.dispatchEvent(new DragEvent('dragover', {
      bubbles: true,
      cancelable: true,
      clientX,
      clientY,
      dataTransfer,
    }))
    target.dispatchEvent(new DragEvent('drop', {
      bubbles: true,
      cancelable: true,
      clientX,
      clientY,
      dataTransfer,
    }))
    source.dispatchEvent(new DragEvent('dragend', {
      bubbles: true,
      cancelable: true,
      clientX,
      clientY,
      dataTransfer,
    }))
  }, { sourcePlaylistId, targetPlaylistId, placement })
}

async function scrollWallTo(page, top) {
  await page.locator('#wall-scroll').evaluate((node, nextTop) => {
    node.scrollTop = nextTop
  }, top)
  await page.waitForTimeout(150)
  return page.locator('#wall-scroll').evaluate((node) => node.scrollTop)
}

async function getVisiblePlaylistOrder(page) {
  return page.evaluate(() => {
    return Array.from(document.querySelectorAll('.playlist-card[data-playlist-id]'))
      .map((node) => ({
        id: node.getAttribute('data-playlist-id'),
        top: Math.round(node.getBoundingClientRect().top),
        left: Math.round(node.getBoundingClientRect().left),
      }))
      .sort((left, right) => left.top - right.top || left.left - right.left)
      .map((entry) => entry.id)
  })
}

test('shows qr login before entering the wall', async ({ page }) => {
  await page.goto(AUTH_PAGE_URL)

  await expect(page.locator('#auth-screen')).toBeVisible()
  await expect(page.locator('#auth-qr-image')).toBeVisible()
  await expect(page.locator('#auth-stage')).toContainText(/\u626b\u7801|\u767b\u5f55\u6210\u529f/)

  await expect(page.locator('#app')).toBeVisible({ timeout: 10000 })
  await expect(page.locator('#auth-screen')).toBeHidden()
  await expect(page.locator('.playlist-card').first()).toBeVisible()
})

test('renders a dense 7-column wall with top actions', async ({ page }) => {
  await waitForWall(page)

  await expect(page.locator('#tab-owned')).toHaveClass(/is-active/)
  await expect(page.locator('.wall-column')).toHaveCount(7)
  await expect(page.locator('#locate-current-btn')).toBeVisible()
  await expect(page.locator('#theme-toggle-btn')).toBeVisible()
  await expect(page.locator('#settings-btn')).toBeVisible()

  const firstHeader = page.locator('.playlist-card').first().locator('.playlist-header')
  await expect(firstHeader).toHaveClass(/has-cover/)
  await expect(firstHeader.locator('.playlist-title')).not.toHaveText('')
  await expect(firstHeader.locator('.playlist-meta')).toContainText('首')

  const firstRow = page.locator('.track-row').first()
  await expect(firstRow.locator('.track-name')).toHaveCount(1)
  await expect(firstRow.locator('.track-meta')).toHaveCount(1)
  await expect(firstRow.locator('.track-tier-mark')).toHaveCount(1)
})

test('explore playlists preload silently after app init', async ({ page }) => {
  await waitForWall(page, EXPLORE_DELAY_PAGE_URL)

  await expect(page.locator('#tab-owned')).toHaveClass(/is-active/)
  await expect(page.locator('#explore-loading-indicator')).toHaveClass(/hidden/)
  await expect.poll(async () => {
    const text = await page.locator('#tab-explore-count').textContent()
    return Number(text || 0)
  }, { timeout: 2500 }).toBeGreaterThan(0)

  await page.click('#tab-explore')
  await expect(page.locator('#tab-explore')).toHaveClass(/is-active/)
  await expect(page.locator('.playlist-card').first().locator('.playlist-meta')).toContainText(/\u6bcf\u65e5\u63a8\u9001|\u63a8\u8350|\u7cbe\u9009/)
})

test('explore preload starts before app init finishes', async ({ page }) => {
  await page.goto(PRE_INIT_EXPLORE_PAGE_URL)

  await expect(page.locator('#loading')).toBeVisible()
  await expect(page.locator('#app')).toBeHidden()
  await expect.poll(async () => {
    return page.evaluate(() => window.__mockStats?.exploreRequestCount || 0)
  }, { timeout: 700 }).toBeGreaterThan(0)

  await page.waitForSelector('.playlist-card')
  await expect(page.locator('#tab-explore-count')).not.toHaveText('0')
})

test('artist playlists preload silently after app init', async ({ page }) => {
  await waitForWall(page)

  await expect(page.locator('#tab-owned')).toHaveClass(/is-active/)
  await expect.poll(async () => {
    return page.evaluate(() => window.__mockStats?.artistRequestCount || 0)
  }, { timeout: 2500 }).toBeGreaterThan(0)
})

test('explore tab loads discovery playlists and supports remote playlist search', async ({ page }) => {
  await waitForWall(page)

  await page.click('#tab-explore')
  await expect(page.locator('#tab-explore')).toHaveClass(/is-active/)
  await expect(page.locator('.playlist-card').first()).toBeVisible()
  await expect(page.locator('.playlist-card').first().locator('.playlist-meta')).toContainText(/\u63a8\u9001|\u63a8\u8350|\u7cbe\u9009/)

  await page.fill('#search-input', 'Jazz')
  await expect(page.locator('.playlist-card')).toHaveCount(1)
  await expect(page.locator('.playlist-card').first().locator('.playlist-title')).toContainText('Jazz')
})

test('switching tabs restores each tab scroll position', async ({ page }) => {
  await page.setViewportSize({ width: 420, height: 640 })
  await waitForWall(page, HUGE_PAGE_URL)

  const ownedTop = await scrollWallTo(page, 960)
  expect(ownedTop).toBeGreaterThan(300)

  await page.click('#tab-subscribed')
  await expect(page.locator('#tab-subscribed')).toHaveClass(/is-active/)
  const subscribedTop = await scrollWallTo(page, 720)
  expect(subscribedTop).toBeGreaterThan(200)

  await page.click('#tab-owned')
  await expect(page.locator('#tab-owned')).toHaveClass(/is-active/)
  await expect.poll(async () => {
    const currentTop = await page.locator('#wall-scroll').evaluate((node) => node.scrollTop)
    return Math.abs(currentTop - ownedTop)
  }).toBeLessThanOrEqual(2)

  await page.click('#tab-subscribed')
  await expect(page.locator('#tab-subscribed')).toHaveClass(/is-active/)
  await expect.poll(async () => {
    const currentTop = await page.locator('#wall-scroll').evaluate((node) => node.scrollTop)
    return Math.abs(currentTop - subscribedTop)
  }).toBeLessThanOrEqual(2)
})

test('playlist headers can drag-sort subscribed playlists and keep that order within the session', async ({ page }) => {
  await waitForWall(page)

  await page.click('#tab-subscribed')
  await expect(page.locator('#tab-subscribed')).toHaveClass(/is-active/)
  await expect.poll(async () => getVisiblePlaylistOrder(page)).toEqual(['202', '201', '203'])

  await dragPlaylistHeader(page, 203, 201, 'before')

  await expect.poll(async () => getVisiblePlaylistOrder(page)).toEqual(['202', '203', '201'])

  await page.click('#tab-owned')
  await page.click('#tab-subscribed')
  await expect.poll(async () => getVisiblePlaylistOrder(page)).toEqual(['202', '203', '201'])
})

test('owned playlist header order persists after reload', async ({ page }) => {
  await waitForWall(page)
  await expect.poll(async () => getVisiblePlaylistOrder(page)).toEqual(['101', '102', '103'])

  await dragPlaylistHeader(page, 103, 102, 'before')
  await expect.poll(async () => getVisiblePlaylistOrder(page)).toEqual(['101', '103', '102'])

  await page.reload()
  await page.waitForSelector('.playlist-card')
  await expect.poll(async () => getVisiblePlaylistOrder(page)).toEqual(['101', '103', '102'])
})

test('owned and subscribed collapsed playlists persist after reload', async ({ page }) => {
  await waitForWall(page)

  await page.click('.playlist-card[data-playlist-id="102"] [data-toggle-playlist-collapse="102"]')
  await expect(page.locator('.playlist-card[data-playlist-id="102"]')).toHaveClass(/is-collapsed/)

  await page.click('#tab-subscribed')
  await page.click('.playlist-card[data-playlist-id="201"] [data-toggle-playlist-collapse="201"]')
  await expect(page.locator('.playlist-card[data-playlist-id="201"]')).toHaveClass(/is-collapsed/)

  await page.reload()
  await page.waitForSelector('.playlist-card')
  await expect(page.locator('.playlist-card[data-playlist-id="102"]')).toHaveClass(/is-collapsed/)

  await page.click('#tab-subscribed')
  await expect(page.locator('.playlist-card[data-playlist-id="201"]')).toHaveClass(/is-collapsed/)
})

test('explore tab shows loading feedback while community playlists are fetching', async ({ page }) => {
  await waitForWall(page, EXPLORE_DELAY_PAGE_URL)

  await page.click('#tab-explore')
  await expect(page.locator('#explore-loading-indicator')).toBeVisible()
  await expect(page.locator('#explore-loading-indicator')).toContainText('\u52a0\u8f7d\u63a2\u7d22\u6b4c\u5355')
  await expect(page.locator('#wall-empty')).toHaveClass(/hidden/)
  await expect(page.locator('.playlist-card[data-playlist-id="102"]')).toHaveCount(1)

  await expect(page.locator('#explore-loading-indicator')).toHaveClass(/hidden/)
  await expect(page.locator('.playlist-card').first().locator('.playlist-meta')).toContainText(/\u63a8\u9001|\u63a8\u8350|\u7cbe\u9009/)
})

test('explore playlist header plus subscribes the playlist into subscribed tab', async ({ page }) => {
  await waitForWall(page)

  const subscribedCountBefore = Number(await page.locator('#tab-subscribed-count').textContent())

  await page.click('#tab-explore')
  const firstCard = page.locator('.playlist-card').first()
  const title = ((await firstCard.locator('.playlist-title').textContent()) || '').trim()
  const subscribeButton = firstCard.locator('[data-subscribe-playlist]')

  await expect(subscribeButton).toHaveText('+')
  await subscribeButton.click()

  await expect(subscribeButton).toBeDisabled()
  await expect(subscribeButton).toContainText('\u2713')
  await expect(page.locator('#tab-subscribed-count')).toHaveText(String(subscribedCountBefore + 1))

  await page.click('#tab-subscribed')
  await page.fill('#search-input', title)
  await expect(page.locator('.playlist-card')).toHaveCount(1)
  await expect(page.locator('.playlist-card').first().locator('.playlist-title')).toContainText(title)
})

test('artist tab groups artists by importance and context menu can jump to the matching artist track', async ({ page }) => {
  await waitForWall(page)
  await page.setViewportSize({ width: 320, height: 900 })

  await page.click('#tab-artists')
  await expect(page.locator('#tab-artists')).toHaveClass(/is-active/)
  await expect(page.locator('#tab-artists-count')).toHaveText('5')
  await expect(page.locator('.playlist-card').first().locator('.playlist-title')).toContainText('\u827a\u672f\u5bb6 1')
  await expect(page.locator('.playlist-card').first().locator('.playlist-meta')).toContainText('\u6b21\u64ad\u653e')

  await page.fill('#search-input', '\u827a\u672f\u5bb6 3')
  await expect(page.locator('.playlist-card')).toHaveCount(1)
  await expect(page.locator('.playlist-card').first().locator('.playlist-title')).toContainText('\u827a\u672f\u5bb6 3')

  await page.fill('#search-input', '')
  await expect(page.locator('#search-input')).toHaveValue('')

  await page.click('#tab-owned')
  await page.fill('#search-input', '\u827a\u672f\u5bb6 5')
  const sourceRow = page.locator('.playlist-card[data-playlist-id="102"] .track-row[data-track-id="102005"]')
  await expect(sourceRow).toBeVisible()
  await sourceRow.click({ button: 'right' })

  const jumpButton = page.locator('#context-menu [data-context-action="go-to-artist-playlist"]')
  await expect(jumpButton).toBeVisible()
  await jumpButton.evaluate((node) => node.click())

  await expect(page.locator('#tab-artists')).toHaveClass(/is-active/)
  await expect(page.locator('#search-input')).toHaveValue('')
  const targetCard = page.locator('.playlist-card', {
    has: page.locator('.playlist-title', { hasText: '\u827a\u672f\u5bb6 5' }),
  }).first()
  await expect(targetCard).toBeVisible()
  const targetRow = targetCard.locator('.track-row[data-track-id="102005"]')
  await expect(targetRow).toBeVisible()
  await expect(targetRow).toHaveClass(/is-focus-flash/)

  const position = await page.evaluate(() => {
    const container = document.getElementById('wall-scroll')
    const cards = Array.from(document.querySelectorAll('.playlist-card'))
    const card = cards.find((node) => node.querySelector('.playlist-title')?.textContent?.includes('\u827a\u672f\u5bb6 5'))
    const containerRect = container.getBoundingClientRect()
    const rowRect = card?.querySelector('.track-row[data-track-id="102005"]')?.getBoundingClientRect()
    return {
      scrollTop: container.scrollTop,
      top: rowRect?.top || 0,
      bottom: rowRect?.bottom || 0,
      containerTop: containerRect.top,
      containerBottom: containerRect.bottom,
    }
  })

  expect(position.scrollTop).toBeGreaterThan(0)
  expect(position.top).toBeGreaterThan(position.containerTop - 1)
  expect(position.bottom).toBeLessThan(position.containerBottom + 1)
})

test('artist playlists show a computed summary and can expand to all tracks', async ({ page }) => {
  await waitForWall(page)

  await page.click('#tab-artists')
  const firstCard = page.locator('.playlist-card').first()
  const firstArtistMeta = firstCard.locator('.playlist-meta')
  const expansionButton = firstCard.locator('[data-toggle-artist-track-expansion]')

  await expect(expansionButton).toHaveAttribute('aria-label', '扩大')
  await expect(expansionButton.locator('svg')).toHaveCount(1)

  const summaryInfo = await page.evaluate(() => {
    const text = document.querySelector('.playlist-card .playlist-meta')?.textContent || ''
    const match = text.match(/(\d+)(?:\/(\d+))?\s*首/)
    return {
      displayed: Number(match?.[1] || 0),
      total: Number(match?.[2] || 0),
    }
  })

  expect(summaryInfo.displayed).toBeGreaterThanOrEqual(3)
  expect(summaryInfo.displayed).toBeLessThanOrEqual(20)
  expect(summaryInfo.total).toBeLessThanOrEqual(20)

  await expansionButton.click()
  await expect(expansionButton).toHaveAttribute('aria-label', '缩小')
  await expect(firstArtistMeta).toContainText('160 首')

  await expansionButton.click()
  await expect(expansionButton).toHaveAttribute('aria-label', '扩大')
  await expect.poll(async () => {
    return page.evaluate(() => {
      const text = document.querySelector('.playlist-card .playlist-meta')?.textContent || ''
      const match = text.match(/(\d+)\/(\d+)\s*首/)
      return {
        displayed: Number(match?.[1] || 0),
        total: Number(match?.[2] || 0),
      }
    })
  }).toEqual({
    displayed: summaryInfo.displayed,
    total: 160,
  })
})

test('audio quality settings affect playback requests and persist across reload', async ({ page }) => {
  await waitForWall(page)

  await page.locator('.track-row').first().click()
  await expect.poll(async () => {
    return page.evaluate(() => window.__mockLastSongUrlRequest?.options?.preferredQuality || '')
  }).toBe('best')

  await page.evaluate(() => {
    window.__mockConnection = {
      effectiveType: '4g',
      downlink: 10,
      saveData: true,
      addEventListener() {},
    }
  })

  await page.locator('.track-row').nth(1).click()
  await expect.poll(async () => {
    return page.evaluate(() => window.__mockLastSongUrlRequest?.options?.preferredQuality || '')
  }).toBe('standard')

  await page.click('#settings-btn')
  await expect(page.locator('#settings-panel')).toHaveClass(/is-open/)
  await page.selectOption('#default-audio-quality-select', 'exhigh')
  await page.uncheck('#auto-adjust-audio-quality-toggle')
  await closeSettingsPanel(page)

  await page.locator('.track-row').nth(2).click()
  await expect.poll(async () => {
    return page.evaluate(() => window.__mockLastSongUrlRequest?.options?.preferredQuality || '')
  }).toBe('exhigh')

  await page.reload()
  await page.waitForSelector('.playlist-card')
  await page.click('#settings-btn')
  await expect(page.locator('#default-audio-quality-select')).toHaveValue('exhigh')
  await expect(page.locator('#auto-adjust-audio-quality-toggle')).not.toBeChecked()
})

test('network auto quality changes do not reload the current track mid-playback', async ({ page }) => {
  await page.addInitScript(() => {
    let lastRequest = null
    let requestCount = 0

    Object.defineProperty(window, '__mockLastSongUrlRequest', {
      configurable: true,
      get() {
        return lastRequest
      },
      set(value) {
        lastRequest = value
        requestCount += 1
        window.__mockSongUrlRequestCount = requestCount
      },
    })

    window.__mockSongUrlRequestCount = 0
  })

  await waitForWall(page)

  await page.locator('.track-row').first().click()
  await expect.poll(async () => {
    return page.evaluate(() => window.__mockSongUrlRequestCount || 0)
  }).toBe(1)

  await page.evaluate(() => {
    function createSilentWavUrl(durationSeconds = 2, sampleRate = 8000) {
      const sampleCount = Math.max(1, Math.round(durationSeconds * sampleRate))
      const dataLength = sampleCount * 2
      const buffer = new ArrayBuffer(44 + dataLength)
      const view = new DataView(buffer)
      const writeString = (offset, value) => {
        for (let index = 0; index < value.length; index += 1) {
          view.setUint8(offset + index, value.charCodeAt(index))
        }
      }

      writeString(0, 'RIFF')
      view.setUint32(4, 36 + dataLength, true)
      writeString(8, 'WAVE')
      writeString(12, 'fmt ')
      view.setUint32(16, 16, true)
      view.setUint16(20, 1, true)
      view.setUint16(22, 1, true)
      view.setUint32(24, sampleRate, true)
      view.setUint32(28, sampleRate * 2, true)
      view.setUint16(32, 2, true)
      view.setUint16(34, 16, true)
      writeString(36, 'data')
      view.setUint32(40, dataLength, true)

      return URL.createObjectURL(new Blob([buffer], { type: 'audio/wav' }))
    }

    const audio = document.getElementById('audio')
    audio.src = createSilentWavUrl()
    audio.dispatchEvent(new Event('play'))
    window.__mockConnection = {
      effectiveType: '4g',
      downlink: 10,
      saveData: true,
    }
    window.scheduleAudioQualityRefresh('network')
  })

  await page.waitForTimeout(350)
  await expect.poll(async () => {
    return page.evaluate(() => window.__mockSongUrlRequestCount || 0)
  }).toBe(1)
})

test('artist track rows stay stable while hovered', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 })
  await waitForWall(page)

  await page.click('#tab-artists')
  const hoverRow = page.locator('.playlist-card').first().locator('.track-row').first()
  await expect(hoverRow).toBeVisible()

  const before = await hoverRow.boundingBox()
  await hoverRow.hover()
  await page.waitForTimeout(160)

  const after = await hoverRow.boundingBox()
  const transform = await hoverRow.evaluate((node) => getComputedStyle(node).transform)

  expect(before).not.toBeNull()
  expect(after).not.toBeNull()
  expect(Math.abs((after?.x || 0) - (before?.x || 0))).toBeLessThanOrEqual(0.5)
  expect(Math.abs((after?.y || 0) - (before?.y || 0))).toBeLessThanOrEqual(0.5)
  expect(transform).toBe('none')
})

test('playlist header can collapse rows and remember the collapsed state after reload', async ({ page }) => {
  await waitForWall(page)

  const card = page.locator('.playlist-card[data-playlist-id="101"]')
  const toggle = card.locator('[data-toggle-playlist-collapse="101"]')

  await expect(card.locator('.track-row').first()).toBeVisible()
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')

  await toggle.click()

  await expect(card).toHaveClass(/is-collapsed/)
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(card.locator('.track-row')).toHaveCount(0)

  await page.reload()
  await page.waitForSelector('.playlist-card[data-playlist-id="101"]')

  const persistedCard = page.locator('.playlist-card[data-playlist-id="101"]')
  const persistedToggle = persistedCard.locator('[data-toggle-playlist-collapse="101"]')
  await expect(persistedCard).toHaveClass(/is-collapsed/)
  await expect(persistedToggle).toHaveAttribute('aria-expanded', 'false')
  await expect(persistedCard.locator('.track-row')).toHaveCount(0)

  await persistedToggle.click()
  await expect(persistedCard).not.toHaveClass(/is-collapsed/)
  await expect(persistedToggle).toHaveAttribute('aria-expanded', 'true')
  await expect(persistedCard.locator('.track-row').first()).toBeVisible()
})

test('player shows the album cover for the current track', async ({ page }) => {
  await waitForWall(page)

  const firstRow = page.locator('.track-row').first()
  await firstRow.click()

  await expect(page.locator('#player-cover')).toBeVisible()
  await expect(page.locator('#player-cover-image')).toHaveAttribute('src', /.+/)
})

test('short artist names do not truncate nearby track titles', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 })
  await waitForWall(page)

  const metrics = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('.track-row')).slice(0, 4)
    const names = ['nobody answers', 'lightning strikes', 'light prayer', 'You May Crawl']
    const artists = ['winnie', 'winnie', 'winnie', 'School Food Punishment']

    rows.forEach((row, index) => {
      const label = row.querySelector('.track-name-label')
      const meta = row.querySelector('.track-meta')
      if (label && names[index]) {
        label.textContent = names[index]
      }
      if (meta && artists[index]) {
        meta.textContent = artists[index]
      }
    })

    return rows.map((row) => {
      const label = row.querySelector('.track-name-label')
      const meta = row.querySelector('.track-meta')
      return {
        name: label?.textContent || '',
        labelWidth: label?.getBoundingClientRect().width || 0,
        labelScrollWidth: label?.scrollWidth || 0,
        meta: meta?.textContent || '',
      }
    })
  })

  for (const item of metrics.slice(0, 3)) {
    expect(item.meta).toBe('winnie')
    expect(item.labelScrollWidth).toBeLessThanOrEqual(item.labelWidth + 1)
  }
})

test('album cover preview appears after 200ms hover delay', async ({ page }) => {
  await waitForWall(page)

  const hoverRow = page.locator('.track-row').nth(5)
  const rowBox = await hoverRow.boundingBox()
  const hoverX = Math.round(rowBox.x + 24)
  const hoverY = Math.round(rowBox.y + (rowBox.height / 2))

  await page.mouse.move(hoverX, hoverY)
  await page.waitForTimeout(100)
  await expect(page.locator('#album-hover-preview')).toBeHidden()

  await page.waitForTimeout(140)
  await expect(page.locator('#album-hover-preview')).toBeVisible()

  const preview = await page.locator('#album-hover-preview').boundingBox()
  expect(preview.y + preview.height).toBeLessThanOrEqual(rowBox.y + 1)
  expect(preview.x).toBeGreaterThan(rowBox.x + (rowBox.width * 0.3))

  await page.mouse.move(4, 4)
  await expect(page.locator('#album-hover-preview')).toBeHidden()
})

test('theme toggle persists across reload', async ({ page }) => {
  await waitForWall(page)

  await expect(page.locator('body')).toHaveAttribute('data-theme', 'light')
  await page.click('#theme-toggle-btn')
  await expect(page.locator('body')).toHaveAttribute('data-theme', 'dark')

  const darkBackground = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
  expect(darkBackground).toBe('rgb(11, 11, 11)')

  await page.reload()
  await page.waitForSelector('.playlist-card')
  await expect(page.locator('body')).toHaveAttribute('data-theme', 'dark')

  await page.click('#theme-toggle-btn')
  await expect(page.locator('body')).toHaveAttribute('data-theme', 'light')
})

test('ui scale slider changes column count and persists across reload', async ({ page }) => {
  await waitForWall(page)

  const before = await page.evaluate(() => {
    const card = document.querySelector('.playlist-card')
    const row = document.querySelector('.track-row')
    return {
      columnCount: document.querySelectorAll('.wall-column').length,
      cardWidth: Math.round(card?.getBoundingClientRect().width || 0),
      rowHeight: Math.round(row?.getBoundingClientRect().height || 0),
    }
  })

  await page.click('#settings-btn')
  await expect(page.locator('#settings-panel')).toHaveClass(/is-open/)

  await page.locator('#ui-scale-range').evaluate((node) => {
    node.value = '125'
    node.dispatchEvent(new Event('input', { bubbles: true }))
    node.dispatchEvent(new Event('change', { bubbles: true }))
  })

  await expect(page.locator('#ui-scale-value')).toHaveText('125%')
  const after = await page.evaluate(() => {
    const card = document.querySelector('.playlist-card')
    const row = document.querySelector('.track-row')
    return {
      columnCount: document.querySelectorAll('.wall-column').length,
      cardWidth: Math.round(card?.getBoundingClientRect().width || 0),
      rowHeight: Math.round(row?.getBoundingClientRect().height || 0),
    }
  })

  expect(after.columnCount).toBeLessThan(before.columnCount)
  expect(after.cardWidth).toBeGreaterThan(before.cardWidth)
  expect(after.rowHeight).toBeGreaterThan(before.rowHeight)

  await page.reload()
  await page.waitForSelector('.playlist-card')

  const persisted = await page.evaluate(() => {
    const card = document.querySelector('.playlist-card')
    const row = document.querySelector('.track-row')
    return {
      columnCount: document.querySelectorAll('.wall-column').length,
      cardWidth: Math.round(card?.getBoundingClientRect().width || 0),
      rowHeight: Math.round(row?.getBoundingClientRect().height || 0),
    }
  })

  expect(persisted.columnCount).toBe(after.columnCount)
  expect(persisted.cardWidth).toBe(after.cardWidth)
  expect(persisted.rowHeight).toBe(after.rowHeight)

  await page.click('#settings-btn')
  await expect(page.locator('#ui-scale-value')).toHaveText('125%')
})

test('liked playlist display mode can show only uncollected tracks', async ({ page }) => {
  await waitForWall(page)

  const likedCard = page.locator('.playlist-card[data-playlist-id="101"]')
  await expect(likedCard.locator('.track-row[data-track-id="101001"]')).toHaveCount(1)
  await expect(likedCard.locator('.track-row[data-track-id="101002"]')).toHaveCount(1)

  await page.click('#settings-btn')
  await expect(page.locator('#settings-panel')).toHaveClass(/is-open/)
  await page.selectOption('#liked-playlist-display-mode-select', 'uncollected')
  await closeSettingsPanel(page)

  await expect(likedCard.locator('.track-row[data-track-id="101001"]')).toHaveCount(1)
  await expect(likedCard.locator('.track-row[data-track-id="101002"]')).toHaveCount(0)
})

test('liked playlist can be hidden and setting persists across reload', async ({ page }) => {
  await waitForWall(page)

  await expect(page.locator('.playlist-card[data-playlist-id="101"]')).toHaveCount(1)

  await page.click('#settings-btn')
  await expect(page.locator('#settings-panel')).toHaveClass(/is-open/)
  await page.selectOption('#liked-playlist-display-mode-select', 'hidden')
  await closeSettingsPanel(page)

  await expect(page.locator('.playlist-card[data-playlist-id="101"]')).toHaveCount(0)

  await page.reload()
  await page.waitForSelector('.playlist-card')

  await expect(page.locator('.playlist-card[data-playlist-id="101"]')).toHaveCount(0)
  await page.click('#settings-btn')
  await expect(page.locator('#liked-playlist-display-mode-select')).toHaveValue('hidden')
})

test('subscribed playlist can be removed and restored from the undo notice', async ({ page }) => {
  await waitForWall(page)

  await page.click('#tab-subscribed')
  const subscribedCard = page.locator('.playlist-card[data-playlist-id="201"]')
  await expect(subscribedCard).toHaveCount(1)

  const removeButton = subscribedCard.locator('[data-remove-subscribed-playlist]')
  await expect(removeButton).toBeVisible()
  await removeButton.click()

  const undoNotice = page.locator('#playlist-undo-layer .playlist-undo-notice')
  await expect(subscribedCard).toHaveCount(0)
  await expect(undoNotice).toBeVisible()
  await expect(undoNotice).toContainText('\u662f\u5426\u64a4\u9500')
  await expect(undoNotice.locator('[data-undo-remove-playlist]')).toBeVisible()
  await expect(undoNotice.locator('[data-close-playlist-undo]')).toBeVisible()

  await undoNotice.locator('[data-undo-remove-playlist]').click()

  await expect(page.locator('#playlist-undo-layer .playlist-undo-notice')).toHaveCount(0)
  await expect(page.locator('.playlist-card[data-playlist-id="201"]')).toHaveCount(1)
})

test('subscribed playlist undo notice auto-dismisses after 20 seconds', async ({ page }) => {
  await page.addInitScript(() => {
    const nativeSetTimeout = window.setTimeout.bind(window)
    window.setTimeout = (handler, timeout = 0, ...args) => {
      return nativeSetTimeout(handler, timeout === 20000 ? 60 : timeout, ...args)
    }
  })

  await waitForWall(page)

  await page.click('#tab-subscribed')
  const subscribedCard = page.locator('.playlist-card[data-playlist-id="201"]')
  await subscribedCard.locator('[data-remove-subscribed-playlist]').click()

  const undoNotice = page.locator('#playlist-undo-layer .playlist-undo-notice')
  await expect(undoNotice).toBeVisible()
  await page.waitForTimeout(120)
  await expect(undoNotice).toHaveCount(0)
})

test('locate jumps to the active track and restores the right tab', async ({ page }) => {
  await waitForWall(page)

  await page.click('#tab-subscribed')
  const targetRow = page.locator('.track-row').last()
  const trackId = await targetRow.getAttribute('data-track-id')
  await targetRow.click()
  await expect(page.locator(`.track-row[data-track-id="${trackId}"]`)).toHaveClass(/is-playing/)

  await page.click('#tab-owned')
  await page.fill('#search-input', 'no-hit-keyword-locate')
  await expect(page.locator('#wall-empty')).toBeVisible()

  await page.click('#locate-current-btn')
  await expect(page.locator('#tab-subscribed')).toHaveClass(/is-active/)
  await expect(page.locator('#search-input')).toHaveValue('')

  const position = await page.evaluate((id) => {
    const container = document.getElementById('wall-scroll')
    const row = document.querySelector(`.track-row[data-track-id="${id}"]`)
    const containerRect = container.getBoundingClientRect()
    const rowRect = row.getBoundingClientRect()
    return {
      top: rowRect.top,
      bottom: rowRect.bottom,
      containerTop: containerRect.top,
      containerBottom: containerRect.bottom,
    }
  }, trackId)

  expect(position.top).toBeGreaterThan(position.containerTop)
  expect(position.bottom).toBeLessThan(position.containerBottom)
})

test('locate jumps to the current recommendation inside its source playlist', async ({ page }) => {
  await waitForWall(page)

  await page.click('#settings-btn')
  await expect(page.locator('#settings-panel')).toHaveClass(/is-open/)
  await page.check('#playlist-recommendations-toggle')
  await closeSettingsPanel(page)

  const firstRecommendationSection = page.locator('.playlist-recommendations').first()
  await expect(firstRecommendationSection).toBeVisible()

  const playlistId = await firstRecommendationSection.getAttribute('data-playlist-id')
  const recommendationButton = firstRecommendationSection.locator('.recommendation-play-btn').first()
  const trackId = await recommendationButton.getAttribute('data-track-id')

  await recommendationButton.click()
  await expect(page.locator('#locate-current-btn')).toBeEnabled()

  await page.click('#tab-subscribed')
  await page.fill('#search-input', 'no-hit-keyword-recommend')
  await expect(page.locator('#wall-empty')).toBeVisible()

  await page.click('#locate-current-btn')
  await expect(page.locator('#tab-owned')).toHaveClass(/is-active/)
  await expect(page.locator('#search-input')).toHaveValue('')

  const targetButton = page.locator(`.recommendation-play-btn[data-playlist-id="${playlistId}"][data-track-id="${trackId}"]`)
  await expect(targetButton).toBeVisible()
  await expect(targetButton).toHaveClass(/is-playing/)

  const position = await page.evaluate(({ currentPlaylistId, currentTrackId }) => {
    const container = document.getElementById('wall-scroll')
    const row = document.querySelector(`.recommendation-play-btn[data-playlist-id="${currentPlaylistId}"][data-track-id="${currentTrackId}"]`)
    const containerRect = container.getBoundingClientRect()
    const rowRect = row.getBoundingClientRect()
    return {
      top: rowRect.top,
      bottom: rowRect.bottom,
      containerTop: containerRect.top,
      containerBottom: containerRect.bottom,
    }
  }, { currentPlaylistId: playlistId, currentTrackId: trackId })

  expect(position.top).toBeGreaterThan(position.containerTop)
  expect(position.bottom).toBeLessThan(position.containerBottom)
})

test('progressive hydration opens the wall before tracks finish expanding', async ({ page }) => {
  await page.goto(PROGRESSIVE_PAGE_URL)
  await expect(page.locator('#app')).toBeVisible()
  await expect(page.locator('#loading')).toHaveClass(/hidden/)
  await expect(page.locator('.playlist-placeholder')).toContainText('\u6b63\u5728\u7ee7\u7eed\u5c55\u5f00')
  await expect(page.locator('.wall-column')).toHaveCount(7)

  await expect(page.locator('.playlist-placeholder')).toHaveCount(0)
  await expect(page.locator('.playlist-card[data-playlist-id="101"]')).toHaveCount(1)

  const hydratedRows = await page.locator('.playlist-card[data-playlist-id="101"] .track-row').count()
  expect(hydratedRows).toBeGreaterThan(40)
})

test('recommended tracks can be added into a playlist', async ({ page }) => {
  await waitForWall(page)

  await page.click('#settings-btn')
  await expect(page.locator('#settings-panel')).toHaveClass(/is-open/)
  await page.check('#playlist-recommendations-toggle')
  await closeSettingsPanel(page)

  const firstRecommendationSection = page.locator('.playlist-recommendations').first()
  await expect(firstRecommendationSection).toBeVisible()

  const playlistId = await firstRecommendationSection.getAttribute('data-playlist-id')
  const recommendationSection = page.locator(`.playlist-recommendations[data-playlist-id="${playlistId}"]`)
  await expect(recommendationSection.locator('.recommendation-add-btn').first()).toBeVisible()
  await expect(recommendationSection.locator('.recommendation-play-btn').first()).toBeVisible()

  const beforeTrackIds = await recommendationSection.locator('.recommendation-play-btn').evaluateAll((nodes) => {
    return nodes.map((node) => node.getAttribute('data-track-id')).filter(Boolean)
  })
  const addedTrackId = beforeTrackIds[0]

  await recommendationSection.locator('.recommendation-play-btn').first().click()
  await expect(page.locator('#player-title')).toContainText('\u63a8\u8350')
  await expect(page.locator('#player-cover')).toBeVisible()
  await expect(page.locator('#player-cover-image')).toHaveAttribute('src', /.+/)

  const targetCard = page.locator(`.playlist-card[data-playlist-id="${playlistId}"]`)
  const metaBefore = await targetCard.locator('.playlist-meta').textContent()
  const countBefore = Number((metaBefore || '0').match(/\d+/)?.[0] || 0)

  await recommendationSection.locator('.recommendation-add-btn').first().click()
  await expect.poll(async () => {
    const metaText = await targetCard.locator('.playlist-meta').textContent()
    return Number((metaText || '0').match(/\d+/)?.[0] || 0)
  }).toBe(countBefore + 1)

  await expect(recommendationSection.locator(`.recommendation-play-btn[data-track-id="${addedTrackId}"]`)).toHaveCount(0)
  await expect.poll(async () => recommendationSection.locator('.recommendation-play-btn').count()).toBe(beforeTrackIds.length)

  const afterTrackIds = await recommendationSection.locator('.recommendation-play-btn').evaluateAll((nodes) => {
    return nodes.map((node) => node.getAttribute('data-track-id')).filter(Boolean)
  })
  expect(afterTrackIds).not.toContain(addedTrackId)
  expect(afterTrackIds.some((trackId) => !beforeTrackIds.includes(trackId))).toBeTruthy()
})

test('liked playlist context menu pins already-added targets to the top without removing source track', async ({ page }) => {
  await waitForWall(page)

  const likedCard = page.locator('.playlist-card[data-playlist-id="101"]')
  const overlapRow = likedCard.locator('.track-row[data-track-id="101002"]')
  const trackId = await overlapRow.getAttribute('data-track-id')

  await overlapRow.click({ button: 'right' })
  const moveTrigger = page.locator('#context-menu .context-menu-item--submenu-trigger')
  await expect(moveTrigger).toBeVisible()

  const triggerBox = await moveTrigger.boundingBox()
  await moveTrigger.click()

  const submenu = page.locator('#context-menu .context-menu-submenu')
  await expect(submenu).toBeVisible()
  const submenuBox = await submenu.boundingBox()
  expect(submenuBox.x).toBeGreaterThan(triggerBox.x + triggerBox.width - 8)

  const transferButtons = submenu.locator('[data-context-action="transfer-track"]')
  await expect(transferButtons).toHaveCount(2)

  const alreadyAddedButton = transferButtons.first()
  const moveButton = transferButtons.nth(1)
  await expect(alreadyAddedButton).toBeDisabled()
  await expect(alreadyAddedButton).toHaveAttribute('data-target-playlist-id', '102')
  await expect(moveButton).toBeEnabled()

  const targetPlaylistId = await moveButton.getAttribute('data-target-playlist-id')
  const targetCard = page.locator(`.playlist-card[data-playlist-id="${targetPlaylistId}"]`)
  const targetMetaBefore = await targetCard.locator('.playlist-meta').textContent()
  const targetCountBefore = Number((targetMetaBefore || '0').match(/\d+/)?.[0] || 0)

  await moveButton.click()
  await expect(likedCard.locator(`.track-row[data-track-id="${trackId}"]`)).toHaveCount(1)
  await expect(targetCard.locator('.playlist-meta')).toContainText(String(targetCountBefore + 1))
})

test('context menu stays near the clicked track while submenu reflows inside a narrow viewport', async ({ page }) => {
  const viewport = { width: 520, height: 650 }
  await page.setViewportSize(viewport)
  await waitForWall(page, HUGE_PAGE_URL)

  const row = page.locator('.playlist-card[data-playlist-id="1011"] .track-row[data-track-id="1011009"]')
  const rowBox = await row.boundingBox()
  if (!rowBox) {
    throw new Error('expected the target row to be visible')
  }

  const clickX = Math.round(rowBox.x + Math.min(24, Math.max(10, rowBox.width / 2)))
  const clickY = Math.round(rowBox.y + (rowBox.height / 2))
  await page.mouse.click(clickX, clickY, { button: 'right' })

  const menu = page.locator('#context-menu')
  await expect(menu).toBeVisible()
  const menuBox = await menu.boundingBox()
  if (!menuBox) {
    throw new Error('expected the context menu to be visible')
  }
  expect(Math.abs(menuBox.x - clickX)).toBeLessThanOrEqual(2)
  expect(Math.abs(menuBox.y - clickY)).toBeLessThanOrEqual(2)
  expect(menuBox.x + menuBox.width).toBeLessThanOrEqual(viewport.width)
  expect(menuBox.y + menuBox.height).toBeLessThanOrEqual(viewport.height)

  const moveTrigger = menu.locator('.context-menu-item--submenu-trigger')
  await moveTrigger.click()

  const submenu = menu.locator('.context-menu-submenu')
  await expect(submenu).toBeVisible()
  const submenuBox = await submenu.boundingBox()
  if (!submenuBox) {
    throw new Error('expected the submenu to be visible')
  }
  expect(submenuBox.x).toBeGreaterThanOrEqual(8)
  expect(submenuBox.y).toBeGreaterThanOrEqual(8)
  expect(submenuBox.x + submenuBox.width).toBeLessThanOrEqual(viewport.width)
  expect(submenuBox.y + submenuBox.height).toBeLessThanOrEqual(viewport.height)
})

test('subscribed tracks can be added to an owned playlist via context menu', async ({ page }) => {
  await waitForWall(page)

  await page.click('#tab-subscribed')
  const subscribedCard = page.locator('.playlist-card[data-playlist-id="201"]')
  const firstRow = subscribedCard.locator('.track-row').first()
  const trackId = await firstRow.getAttribute('data-track-id')
  const trackName = await firstRow.locator('.track-name-label').textContent()

  await firstRow.click({ button: 'right' })
  await expect(page.locator('#context-menu')).toBeVisible()
  await expect(page.locator('#context-remove-track-btn')).toHaveCount(0)

  const moveTrigger = page.locator('#context-menu .context-menu-item--submenu-trigger')
  await moveTrigger.click()

  const submenu = page.locator('#context-menu .context-menu-submenu')
  const addButton = submenu.locator('[data-context-action="transfer-track"]:not([disabled])').first()
  await expect(addButton).toBeVisible()

  const targetPlaylistId = await addButton.getAttribute('data-target-playlist-id')
  await addButton.click()

  await page.click('#tab-owned')
  await page.fill('#search-input', trackName || '')
  const targetCard = page.locator(`.playlist-card[data-playlist-id="${targetPlaylistId}"]`)
  await expect(targetCard.locator(`.track-row[data-track-id="${trackId}"]`)).toHaveCount(1)
})

test('explore tracks can be added to an owned playlist via context menu', async ({ page }) => {
  await waitForWall(page)

  await page.click('#tab-explore')
  const exploreCard = page.locator('.playlist-card').first()
  const firstRow = exploreCard.locator('.track-row').first()
  const trackId = await firstRow.getAttribute('data-track-id')
  const trackName = await firstRow.locator('.track-name-label').textContent()

  await firstRow.click({ button: 'right' })
  await expect(page.locator('#context-menu')).toBeVisible()
  await expect(page.locator('#context-remove-track-btn')).toHaveCount(0)

  const moveTrigger = page.locator('#context-menu .context-menu-item--submenu-trigger')
  await moveTrigger.click()

  const submenu = page.locator('#context-menu .context-menu-submenu')
  const addButton = submenu.locator('[data-context-action="transfer-track"]:not([disabled])').first()
  await expect(addButton).toBeVisible()

  const targetPlaylistId = await addButton.getAttribute('data-target-playlist-id')
  await addButton.click()

  await page.click('#tab-owned')
  await page.fill('#search-input', trackName || '')
  const targetCard = page.locator(`.playlist-card[data-playlist-id="${targetPlaylistId}"]`)
  await expect(targetCard.locator(`.track-row[data-track-id="${trackId}"]`)).toHaveCount(1)
})

test('recommended tracks support the context menu add flow', async ({ page }) => {
  await waitForWall(page)

  await page.click('#settings-btn')
  await expect(page.locator('#settings-panel')).toHaveClass(/is-open/)
  await page.check('#playlist-recommendations-toggle')
  await closeSettingsPanel(page)

  const recommendationSection = page.locator('.playlist-recommendations').first()
  await expect(recommendationSection).toBeVisible()

  const recommendationRow = recommendationSection.locator('.recommendation-row').first()
  const trackId = await recommendationRow.getAttribute('data-track-id')
  const trackLabel = await recommendationRow.locator('.recommendation-text').textContent()
  const trackName = (trackLabel || '').split('/')[0].trim()

  await recommendationRow.click({ button: 'right' })
  await expect(page.locator('#context-menu')).toBeVisible()
  const targetPlaylistId = await page.evaluate(() => {
    const menu = document.getElementById('context-menu')
    if (!menu || menu.classList.contains('hidden')) {
      throw new Error('context menu is not open')
    }
    if (menu.querySelector('#context-remove-track-btn')) {
      throw new Error('recommendation context menu should not show remove action')
    }
    const button = menu.querySelector('[data-context-action="transfer-track"]:not([disabled])')
    if (!(button instanceof HTMLButtonElement)) {
      throw new Error('missing transfer target in recommendation context menu')
    }

    const playlistId = Number(button.dataset.targetPlaylistId || 0)
    if (playlistId <= 0) {
      throw new Error('invalid recommendation target playlist id')
    }

    button.click()
    return playlistId
  })
  const targetCard = page.locator(`.playlist-card[data-playlist-id="${targetPlaylistId}"]`)
  await page.fill('#search-input', trackName)
  await expect(targetCard.locator(`.track-row[data-track-id="${trackId}"]`)).toHaveCount(1)
})

test('tracks support ctrl multi-select and shift range select', async ({ page }) => {
  await waitForWall(page)

  const card = page.locator('.playlist-card[data-playlist-id="102"]')
  const row1 = card.locator('.track-row[data-track-id="102001"]')
  const row2 = card.locator('.track-row[data-track-id="102002"]')
  const row3 = card.locator('.track-row[data-track-id="102003"]')

  await row1.click({ modifiers: ['Control'] })
  await row3.click({ modifiers: ['Control'] })
  await expect(card.locator('.track-row.is-selected')).toHaveCount(2)
  await expect(row1).toHaveClass(/is-selected/)
  await expect(row3).toHaveClass(/is-selected/)

  await page.keyboard.press('Escape')
  await expect(card.locator('.track-row.is-selected')).toHaveCount(0)

  await row1.click({ modifiers: ['Control'] })
  await row3.click({ modifiers: ['Shift'] })
  await expect(card.locator('.track-row.is-selected')).toHaveCount(3)
  await expect(row1).toHaveClass(/is-selected/)
  await expect(row2).toHaveClass(/is-selected/)
  await expect(row3).toHaveClass(/is-selected/)

  await page.keyboard.press('Escape')
  await expect(card.locator('.track-row.is-selected')).toHaveCount(0)

  await row1.click()
  await expect(card.locator('.track-row.is-selected')).toHaveCount(0)

  await row3.click({ modifiers: ['Shift'] })
  await expect(card.locator('.track-row.is-selected')).toHaveCount(3)
  await expect(row1).toHaveClass(/is-selected/)
  await expect(row2).toHaveClass(/is-selected/)
  await expect(row3).toHaveClass(/is-selected/)
})

test('owned tracks can be removed via context menu', async ({ page }) => {
  await waitForWall(page)

  const firstOwnedCard = page.locator('.playlist-card[data-playlist-id="102"]')
  const firstRow = firstOwnedCard.locator('.track-row').first()
  const trackId = await firstRow.getAttribute('data-track-id')

  await firstRow.click({ button: 'right' })
  await expect(page.locator('#context-menu')).toBeVisible()
  await page.click('#context-remove-track-btn')

  await expect(page.locator('#context-menu')).toBeHidden()
  await expect(page.locator(`.track-row[data-track-id="${trackId}"]`)).toHaveCount(0)
})

test('selected owned tracks can be removed together via context menu', async ({ page }) => {
  await waitForWall(page)

  const card = page.locator('.playlist-card[data-playlist-id="102"]')
  const row1 = card.locator('.track-row[data-track-id="102001"]')
  const row2 = card.locator('.track-row[data-track-id="102002"]')

  await row1.click({ modifiers: ['Control'] })
  await row2.click({ modifiers: ['Control'] })
  await expect(card.locator('.track-row.is-selected')).toHaveCount(2)

  await row2.click({ button: 'right' })
  await expect(page.locator('#context-menu')).toBeVisible()
  await page.evaluate(() => {
    const button = document.getElementById('context-remove-track-btn')
    if (!(button instanceof HTMLButtonElement)) {
      throw new Error('missing remove button for selected owned tracks')
    }
    button.click()
  })

  await expect(card.locator('.track-row[data-track-id="102001"]')).toHaveCount(0)
  await expect(card.locator('.track-row[data-track-id="102002"]')).toHaveCount(0)
  await expect(card.locator('.track-row.is-selected')).toHaveCount(0)
})

test('selected subscribed tracks can be added together via context menu', async ({ page }) => {
  await waitForWall(page)

  await page.click('#tab-subscribed')
  const subscribedCard = page.locator('.playlist-card[data-playlist-id="201"]')
  const row1 = subscribedCard.locator('.track-row[data-track-id="201001"]')
  const row2 = subscribedCard.locator('.track-row[data-track-id="201002"]')
  const trackName1 = await row1.locator('.track-name-label').textContent()
  const trackName2 = await row2.locator('.track-name-label').textContent()

  await row1.click({ modifiers: ['Control'] })
  await row2.click({ modifiers: ['Control'] })
  await expect(subscribedCard.locator('.track-row.is-selected')).toHaveCount(2)

  await row2.click({ button: 'right' })
  await expect(page.locator('#context-menu')).toBeVisible()
  const targetPlaylistId = await page.evaluate(() => {
    const menu = document.getElementById('context-menu')
    if (!menu || menu.classList.contains('hidden')) {
      throw new Error('context menu is not open')
    }

    const button = menu.querySelector('[data-context-action="transfer-track"]:not([disabled])')
    if (!(button instanceof HTMLButtonElement)) {
      throw new Error('missing transfer target for selected subscribed tracks')
    }

    const playlistId = Number(button.dataset.targetPlaylistId || 0)
    if (playlistId <= 0) {
      throw new Error('invalid transfer target playlist id')
    }

    button.click()
    return playlistId
  })

  await page.click('#tab-owned')
  const targetCard = page.locator(`.playlist-card[data-playlist-id="${targetPlaylistId}"]`)
  await page.fill('#search-input', trackName1 || '')
  await expect(targetCard.locator('.track-row[data-track-id="201001"]')).toHaveCount(1)
  await page.fill('#search-input', trackName2 || '')
  await expect(targetCard.locator('.track-row[data-track-id="201002"]')).toHaveCount(1)
})

test('tracks can be drag-sorted within the same playlist', async ({ page }) => {
  await waitForWall(page)

  const card = page.locator('.playlist-card[data-playlist-id="102"]')
  const beforeIds = await card.locator('.track-row').evaluateAll((nodes) => {
    return nodes.slice(0, 4).map((node) => node.getAttribute('data-track-id'))
  })

  await dragTrack(
    page,
    '.playlist-card[data-playlist-id="102"] .track-row[data-track-id="102001"]',
    '.playlist-card[data-playlist-id="102"] .track-row[data-track-id="102003"]',
    'after'
  )

  await expect.poll(async () => {
    return card.locator('.track-row').evaluateAll((nodes) => {
      return nodes.slice(0, 4).map((node) => node.getAttribute('data-track-id'))
    })
  }).toEqual([beforeIds[1], beforeIds[2], beforeIds[0], beforeIds[3]])
})

test('selected tracks drag together within the same playlist', async ({ page }) => {
  await waitForWall(page)

  const card = page.locator('.playlist-card[data-playlist-id="102"]')
  const row1 = card.locator('.track-row[data-track-id="102001"]')
  const row3 = card.locator('.track-row[data-track-id="102003"]')
  await row1.click({ modifiers: ['Control'] })
  await row3.click({ modifiers: ['Control'] })
  await expect(card.locator('.track-row.is-selected')).toHaveCount(2)

  await dragTrack(
    page,
    '.playlist-card[data-playlist-id="102"] .track-row[data-track-id="102003"]',
    '.playlist-card[data-playlist-id="102"] .track-row[data-track-id="102004"]',
    'after'
  )

  await expect.poll(async () => {
    return card.locator('.track-row').evaluateAll((nodes) => {
      return nodes.slice(0, 4).map((node) => node.getAttribute('data-track-id'))
    })
  }).toEqual(['102002', '102004', '102001', '102003'])
})

test('tracks can be dragged into another playlist at a chosen position', async ({ page }) => {
  await waitForWall(page)

  const sourceCard = page.locator('.playlist-card[data-playlist-id="102"]')
  const targetCard = page.locator('.playlist-card[data-playlist-id="103"]')
  const sourceMetaBefore = await sourceCard.locator('.playlist-meta').textContent()
  const targetMetaBefore = await targetCard.locator('.playlist-meta').textContent()
  const sourceCountBefore = Number((sourceMetaBefore || '0').match(/\d+/)?.[0] || 0)
  const targetCountBefore = Number((targetMetaBefore || '0').match(/\d+/)?.[0] || 0)

  await dragTrack(
    page,
    '.playlist-card[data-playlist-id="102"] .track-row[data-track-id="102001"]',
    '.playlist-card[data-playlist-id="103"] .track-row[data-track-id="103002"]',
    'before'
  )

  await expect.poll(async () => {
    return targetCard.locator('.track-row').evaluateAll((nodes) => {
      return nodes.slice(0, 4).map((node) => node.getAttribute('data-track-id'))
    })
  }).toEqual(['103001', '102001', '103002', '103003'])

  await expect.poll(async () => {
    return sourceCard.locator('.track-row').evaluateAll((nodes) => {
      return nodes.slice(0, 3).map((node) => node.getAttribute('data-track-id'))
    })
  }).toEqual(['102002', '102003', '102004'])

  await expect(sourceCard.locator('.playlist-meta')).toContainText(String(sourceCountBefore - 1))
  await expect(targetCard.locator('.playlist-meta')).toContainText(String(targetCountBefore + 1))
})

test('selected tracks drag together into another playlist', async ({ page }) => {
  await waitForWall(page)

  const sourceCard = page.locator('.playlist-card[data-playlist-id="102"]')
  const targetCard = page.locator('.playlist-card[data-playlist-id="103"]')
  const row1 = sourceCard.locator('.track-row[data-track-id="102001"]')
  const row2 = sourceCard.locator('.track-row[data-track-id="102002"]')
  const sourceMetaBefore = await sourceCard.locator('.playlist-meta').textContent()
  const targetMetaBefore = await targetCard.locator('.playlist-meta').textContent()
  const sourceCountBefore = Number((sourceMetaBefore || '0').match(/\d+/)?.[0] || 0)
  const targetCountBefore = Number((targetMetaBefore || '0').match(/\d+/)?.[0] || 0)

  await row1.click({ modifiers: ['Control'] })
  await row2.click({ modifiers: ['Control'] })
  await expect(sourceCard.locator('.track-row.is-selected')).toHaveCount(2)

  await dragTrack(
    page,
    '.playlist-card[data-playlist-id="102"] .track-row[data-track-id="102002"]',
    '.playlist-card[data-playlist-id="103"] .track-row[data-track-id="103002"]',
    'before'
  )

  await expect.poll(async () => {
    return targetCard.locator('.track-row').evaluateAll((nodes) => {
      return nodes.slice(0, 5).map((node) => node.getAttribute('data-track-id'))
    })
  }).toEqual(['103001', '102001', '102002', '103002', '103003'])

  await expect.poll(async () => {
    return sourceCard.locator('.track-row').evaluateAll((nodes) => {
      return nodes.slice(0, 3).map((node) => node.getAttribute('data-track-id'))
    })
  }).toEqual(['102003', '102004', '102005'])

  await expect(sourceCard.locator('.playlist-meta')).toContainText(String(sourceCountBefore - 2))
  await expect(targetCard.locator('.playlist-meta')).toContainText(String(targetCountBefore + 2))
})

test('dragging from liked playlist copies the track instead of removing it', async ({ page }) => {
  await waitForWall(page)

  const likedCard = page.locator('.playlist-card[data-playlist-id="101"]')
  const targetCard = page.locator('.playlist-card[data-playlist-id="102"]')
  const likedMetaBefore = await likedCard.locator('.playlist-meta').textContent()
  const targetMetaBefore = await targetCard.locator('.playlist-meta').textContent()
  const likedCountBefore = Number((likedMetaBefore || '0').match(/\d+/)?.[0] || 0)
  const targetCountBefore = Number((targetMetaBefore || '0').match(/\d+/)?.[0] || 0)

  await dragTrack(
    page,
    '.playlist-card[data-playlist-id="101"] .track-row[data-track-id="101001"]',
    '.playlist-card[data-playlist-id="102"] .track-row[data-track-id="102002"]',
    'before'
  )

  await expect(likedCard.locator('.track-row[data-track-id="101001"]')).toHaveCount(1)
  await expect(targetCard.locator('.track-row[data-track-id="101001"]')).toHaveCount(1)
  await expect(likedCard.locator('.playlist-meta')).toContainText(String(likedCountBefore))
  await expect(targetCard.locator('.playlist-meta')).toContainText(String(targetCountBefore + 1))
})

test('drag state clears even when dragend only fires on the source row', async ({ page }) => {
  await waitForWall(page)

  const sourceSelector = '.playlist-card[data-playlist-id="102"] .track-row[data-track-id="102001"]'

  await page.evaluate((selector) => {
    const source = document.querySelector(selector)
    if (!source) {
      throw new Error(`drag source missing: ${selector}`)
    }

    const rect = source.getBoundingClientRect()
    const clientX = Math.round(rect.left + Math.min(24, Math.max(10, rect.width / 2)))
    const clientY = Math.round(rect.top + (rect.height / 2))
    const dataTransfer = new DataTransfer()

    source.dispatchEvent(new DragEvent('dragstart', {
      bubbles: true,
      cancelable: true,
      clientX,
      clientY,
      dataTransfer,
    }))
    source.dispatchEvent(new DragEvent('dragend', {
      bubbles: false,
      cancelable: true,
      clientX,
      clientY,
      dataTransfer,
    }))
  }, sourceSelector)

  await expect(page.locator(`${sourceSelector}.is-dragging`)).toHaveCount(0)

  await dragTrack(
    page,
    '.playlist-card[data-playlist-id="102"] .track-row[data-track-id="102001"]',
    '.playlist-card[data-playlist-id="102"] .track-row[data-track-id="102003"]',
    'after'
  )

  await expect.poll(async () => {
    return page.locator('.playlist-card[data-playlist-id="102"] .track-row').evaluateAll((nodes) => {
      return nodes.slice(0, 3).map((node) => node.getAttribute('data-track-id'))
    })
  }).toEqual(['102002', '102003', '102001'])
})

test('native pointer drag can be repeated after drop', async ({ page }) => {
  await waitForWall(page)

  const card = page.locator('.playlist-card[data-playlist-id="102"]')
  const source1 = card.locator('.track-row[data-track-id="102001"]')
  const target1 = card.locator('.track-row[data-track-id="102003"]')
  await source1.dragTo(target1)

  await expect.poll(async () => {
    return card.locator('.track-row').evaluateAll((nodes) => {
      return nodes.slice(0, 4).map((node) => node.getAttribute('data-track-id'))
    })
  }).toEqual(['102002', '102003', '102001', '102004'])

  const source2 = card.locator('.track-row[data-track-id="102002"]')
  const target2 = card.locator('.track-row[data-track-id="102004"]')
  await source2.dragTo(target2)

  await expect.poll(async () => {
    return card.locator('.track-row').evaluateAll((nodes) => {
      return nodes.slice(0, 4).map((node) => node.getAttribute('data-track-id'))
    })
  }).toEqual(['102003', '102001', '102004', '102002'])

  await expect(card.locator('.track-row.is-dragging')).toHaveCount(0)
})

test('clicking an owned track keeps the normal pointer cursor', async ({ page }) => {
  await waitForWall(page)

  const row = page.locator('.playlist-card[data-playlist-id="102"] .track-row[data-track-id="102001"]')
  await row.hover()
  await expect.poll(async () => {
    return row.evaluate((node) => getComputedStyle(node).cursor)
  }).toBe('pointer')

  await row.click()

  await expect(row).not.toHaveClass(/is-dragging/)
  await expect.poll(async () => {
    return row.evaluate((node) => getComputedStyle(node).cursor)
  }).toBe('pointer')
})

test('compact single-line labels keep enough line height for descenders', async ({ page }) => {
  await waitForWall(page)

  await page.click('#settings-btn')
  await page.locator('#ui-scale-range').evaluate((node) => {
    node.value = '125'
    node.dispatchEvent(new Event('input', { bubbles: true }))
    node.dispatchEvent(new Event('change', { bubbles: true }))
  })
  await page.check('#playlist-recommendations-toggle')
  await closeSettingsPanel(page)

  await expect(page.locator('.playlist-recommendations').first()).toBeVisible()

  const metrics = await page.evaluate(() => {
    const readMetrics = (selector) => {
      const node = document.querySelector(selector)
      if (!(node instanceof HTMLElement)) {
        throw new Error(`missing node: ${selector}`)
      }
      const style = getComputedStyle(node)
      return {
        selector,
        fontSize: parseFloat(style.fontSize),
        lineHeight: parseFloat(style.lineHeight),
      }
    }

    return [
      readMetrics('.playlist-card[data-playlist-id="102"] .playlist-title'),
      readMetrics('.playlist-card[data-playlist-id="102"] .track-row[data-track-id="102001"] .track-name'),
      readMetrics('.playlist-card[data-playlist-id="102"] .track-row[data-track-id="102001"] .track-meta'),
      readMetrics('.playlist-recommendations .recommendation-text'),
    ]
  })

  for (const metric of metrics) {
    expect(metric.lineHeight, `${metric.selector} should leave room for descenders`).toBeGreaterThan(metric.fontSize * 1.1)
  }
})

test('wall can reach the bottom after recommendations expand', async ({ page }) => {
  await waitForWall(page, HUGE_PAGE_URL)

  await page.click('#settings-btn')
  await page.check('#playlist-recommendations-toggle')
  await closeSettingsPanel(page)

  await page.locator('#wall-scroll').evaluate((node) => {
    node.scrollTop = node.scrollHeight
  })
  await page.waitForTimeout(500)

  const overflow = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.playlist-card')).reduce((maxOverflow, card) => {
      const parent = card.parentElement
      if (!parent) {
        return maxOverflow
      }
      const overflowPx = Math.max(0, (card.offsetTop + card.offsetHeight) - parent.offsetHeight)
      return Math.max(maxOverflow, overflowPx)
    }, 0)
  })

  expect(overflow).toBeLessThanOrEqual(1)
})

test('huge datasets keep one card per playlist and bound row DOM size', async ({ page }) => {
  await page.goto(HUGE_PAGE_URL)
  await page.waitForSelector('.playlist-card')

  const stats = await page.evaluate(() => window.__mockStats)
  expect(stats.trackCount).toBeGreaterThan(7000)

  const initialRows = await page.locator('.track-row').count()
  expect(initialRows).toBeLessThan(1000)

  const initialPlaylistIds = await page.locator('.playlist-card').evaluateAll((nodes) => {
    return nodes.map((node) => node.getAttribute('data-playlist-id'))
  })
  expect(new Set(initialPlaylistIds).size).toBe(initialPlaylistIds.length)

  await page.locator('#wall-scroll').evaluate((node) => {
    node.scrollTop = Math.round((node.scrollHeight - node.clientHeight) * 0.5)
  })
  await page.waitForTimeout(300)

  const midRows = await page.locator('.track-row').count()
  expect(midRows).toBeLessThan(1000)

  const midPlaylistIds = await page.locator('.playlist-card').evaluateAll((nodes) => {
    return nodes.map((node) => node.getAttribute('data-playlist-id'))
  })
  expect(new Set(midPlaylistIds).size).toBe(midPlaylistIds.length)
})



