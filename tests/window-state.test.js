const test = require('node:test')
const assert = require('node:assert/strict')

const {
  areWindowStatesEqual,
  isWindowStateReachable,
  needsWindowStateCorrection,
  resolveWindowState,
} = require('../src/main/window-state')

const PRIMARY_DISPLAY = {
  isPrimary: true,
  workArea: {
    x: 0,
    y: 0,
    width: 1920,
    height: 1080,
  },
}

const SECONDARY_DISPLAY = {
  isPrimary: false,
  workArea: {
    x: 1920,
    y: 0,
    width: 1600,
    height: 900,
  },
}

test('resolveWindowState preserves reachable bounds', () => {
  const resolved = resolveWindowState(
    { x: 100, y: 60, width: 1280, height: 820 },
    [PRIMARY_DISPLAY, SECONDARY_DISPLAY]
  )

  assert.deepEqual(resolved, {
    x: 100,
    y: 60,
    width: 1280,
    height: 820,
    minWidth: 1180,
    minHeight: 760,
  })
})

test('resolveWindowState recenters when there is no saved position', () => {
  const resolved = resolveWindowState(
    { width: 1280, height: 820 },
    [PRIMARY_DISPLAY]
  )

  assert.deepEqual(resolved, {
    x: 320,
    y: 130,
    width: 1280,
    height: 820,
    minWidth: 1180,
    minHeight: 760,
  })
})

test('resolveWindowState clamps off-screen bounds back into the nearest display', () => {
  const resolved = resolveWindowState(
    { x: 3600, y: 80, width: 1280, height: 820 },
    [PRIMARY_DISPLAY, SECONDARY_DISPLAY]
  )

  assert.deepEqual(resolved, {
    x: 2240,
    y: 80,
    width: 1280,
    height: 820,
    minWidth: 1180,
    minHeight: 760,
  })
})

test('resolveWindowState shrinks a saved window to fit a smaller work area', () => {
  const resolved = resolveWindowState(
    { x: 40, y: 20, width: 1280, height: 820 },
    [{
      isPrimary: true,
      workArea: {
        x: 0,
        y: 0,
        width: 1366,
        height: 728,
      },
    }]
  )

  assert.deepEqual(resolved, {
    x: 40,
    y: 0,
    width: 1280,
    height: 728,
    minWidth: 1180,
    minHeight: 728,
  })
})

test('isWindowStateReachable requires the title bar area to stay visible', () => {
  assert.equal(
    isWindowStateReachable(
      { x: 100, y: 20, width: 1200, height: 800 },
      [PRIMARY_DISPLAY]
    ),
    true
  )

  assert.equal(
    isWindowStateReachable(
      { x: 100, y: -140, width: 1200, height: 800 },
      [PRIMARY_DISPLAY]
    ),
    false
  )
})

test('needsWindowStateCorrection detects removed-display and oversize cases', () => {
  assert.equal(
    needsWindowStateCorrection(
      { x: 2100, y: 40, width: 1280, height: 820 },
      [PRIMARY_DISPLAY]
    ),
    true
  )

  assert.equal(
    needsWindowStateCorrection(
      { x: 40, y: 20, width: 1280, height: 820 },
      [PRIMARY_DISPLAY, SECONDARY_DISPLAY]
    ),
    false
  )
})

test('areWindowStatesEqual compares normalized bounds', () => {
  assert.equal(
    areWindowStatesEqual(
      { x: '10.4', y: 20, width: '1280', height: 820 },
      { x: 10, y: 20, width: 1280, height: 820 }
    ),
    true
  )
})
