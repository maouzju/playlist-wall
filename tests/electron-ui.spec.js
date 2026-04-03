const path = require('path')
const { test, expect } = require('playwright/test')

const rendererPath = path.resolve(__dirname, '../src/renderer/index.html').replace(/\\/g, '/')
const PAGE_URL = `file:///${rendererPath}?mock=1`
const AUTH_PAGE_URL = `file:///${rendererPath}?mock=1&auth=1`
const PROGRESSIVE_PAGE_URL = `file:///${rendererPath}?mock=1&progressive=1`
const HUGE_PAGE_URL = `file:///${rendererPath}?mock=1&huge=1`

test.use({
  viewport: { width: 1440, height: 960 },
})

async function waitForWall(page, url = PAGE_URL) {
  await page.goto(url)
  await page.waitForSelector('.playlist-card')
}

test('shows qr login before entering the wall', async ({ page }) => {
  await page.goto(AUTH_PAGE_URL)

  await expect(page.locator('#auth-screen')).toBeVisible()
  await expect(page.locator('#auth-qr-image')).toBeVisible()
  await expect(page.locator('#auth-stage')).toContainText('扫码')

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

test('locate jumps to the active track and restores the right tab', async ({ page }) => {
  await waitForWall(page)

  await page.click('#tab-subscribed')
  const targetRow = page.locator('.track-row').last()
  const trackId = await targetRow.getAttribute('data-track-id')
  await targetRow.click()
  await expect(page.locator(`.track-row[data-track-id="${trackId}"]`)).toHaveClass(/is-playing/)

  await page.click('#tab-owned')
  await page.fill('#search-input', '不会命中的关键词')
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
  await page.click('#settings-close-btn')

  const firstRecommendationSection = page.locator('.playlist-recommendations').first()
  await expect(firstRecommendationSection).toBeVisible()

  const playlistId = await firstRecommendationSection.getAttribute('data-playlist-id')
  const recommendationButton = firstRecommendationSection.locator('.recommendation-play-btn').first()
  const trackId = await recommendationButton.getAttribute('data-track-id')

  await recommendationButton.click()
  await expect(page.locator('#locate-current-btn')).toBeEnabled()

  await page.click('#tab-subscribed')
  await page.fill('#search-input', '涓嶄細鍛戒腑鐨勬帹鑽愬叧閿瘝')
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
  await expect(page.locator('.playlist-placeholder')).toContainText('正在继续展开')
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
  await page.click('#settings-close-btn')

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
  await expect(page.locator('#player-title')).toContainText('推荐')
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

test('liked playlist context menu recommends move targets without removing source track', async ({ page }) => {
  await waitForWall(page)

  const likedCard = page.locator('.playlist-card[data-playlist-id="101"]')
  const firstRow = likedCard.locator('.track-row').first()
  const trackId = await firstRow.getAttribute('data-track-id')

  await firstRow.click({ button: 'right' })
  const moveTrigger = page.locator('#context-menu .context-menu-item--submenu-trigger')
  await expect(moveTrigger).toBeVisible()

  const triggerBox = await moveTrigger.boundingBox()
  await moveTrigger.hover()

  const submenu = page.locator('#context-menu .context-menu-submenu')
  await expect(submenu).toBeVisible()
  const submenuBox = await submenu.boundingBox()
  expect(submenuBox.x).toBeGreaterThan(triggerBox.x + triggerBox.width - 8)

  const moveButton = submenu.locator('[data-context-action="move-track"]').first()
  await expect(moveButton).toBeVisible()
  await expect(submenu.locator('[data-context-action="move-track"]')).toHaveCount(2)

  const targetPlaylistId = await moveButton.getAttribute('data-target-playlist-id')
  const targetCard = page.locator(`.playlist-card[data-playlist-id="${targetPlaylistId}"]`)
  const targetMetaBefore = await targetCard.locator('.playlist-meta').textContent()
  const targetCountBefore = Number((targetMetaBefore || '0').match(/\d+/)?.[0] || 0)

  await moveButton.click()
  await expect(likedCard.locator(`.track-row[data-track-id="${trackId}"]`)).toHaveCount(1)
  await expect(targetCard.locator('.playlist-meta')).toContainText(String(targetCountBefore + 1))
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

test('wall can reach the bottom after recommendations expand', async ({ page }) => {
  await waitForWall(page, HUGE_PAGE_URL)

  await page.click('#settings-btn')
  await page.check('#playlist-recommendations-toggle')
  await page.click('#settings-close-btn')

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
