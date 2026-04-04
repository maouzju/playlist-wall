const WINDOW_DEFAULT_WIDTH = 1280
const WINDOW_DEFAULT_HEIGHT = 820
const WINDOW_DEFAULT_MIN_WIDTH = 1180
const WINDOW_DEFAULT_MIN_HEIGHT = 760
const WINDOW_REACHABLE_HEADER_HEIGHT = 80
const WINDOW_REACHABLE_MIN_VISIBLE_WIDTH = 120
const WINDOW_REACHABLE_MIN_VISIBLE_HEIGHT = 40

function clamp(value, min, max) {
  if (max < min) {
    return min
  }

  return Math.min(max, Math.max(min, value))
}

function normalizeCoordinate(input) {
  const numeric = Number(input)
  if (!Number.isFinite(numeric)) {
    return null
  }

  return Math.round(numeric)
}

function normalizeDimension(input, fallback) {
  const numeric = Number(input)
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return Math.max(1, Math.round(fallback))
  }

  return Math.max(1, Math.round(numeric))
}

function getDefaultWindowState() {
  return {
    x: null,
    y: null,
    width: WINDOW_DEFAULT_WIDTH,
    height: WINDOW_DEFAULT_HEIGHT,
  }
}

function normalizeWindowState(input = {}, fallback = getDefaultWindowState()) {
  const base = {
    ...getDefaultWindowState(),
    ...(fallback && typeof fallback === 'object' ? fallback : {}),
  }

  return {
    x: normalizeCoordinate(input?.x),
    y: normalizeCoordinate(input?.y),
    width: normalizeDimension(input?.width, base.width),
    height: normalizeDimension(input?.height, base.height),
  }
}

function normalizeDisplayWorkArea(input) {
  const source = input?.workArea && typeof input.workArea === 'object'
    ? input.workArea
    : input

  return {
    x: normalizeCoordinate(source?.x) ?? 0,
    y: normalizeCoordinate(source?.y) ?? 0,
    width: normalizeDimension(source?.width, WINDOW_DEFAULT_WIDTH),
    height: normalizeDimension(source?.height, WINDOW_DEFAULT_HEIGHT),
  }
}

function normalizeDisplays(displays = []) {
  if (!Array.isArray(displays) || !displays.length) {
    return [{
      isPrimary: true,
      workArea: normalizeDisplayWorkArea(),
    }]
  }

  const hasPrimaryDisplay = displays.some((display) => Boolean(display?.isPrimary))

  return displays.map((display, index) => ({
    isPrimary: hasPrimaryDisplay ? Boolean(display?.isPrimary) : index === 0,
    workArea: normalizeDisplayWorkArea(display),
  }))
}

function getPrimaryDisplay(displays) {
  return displays.find((display) => display.isPrimary) || displays[0]
}

function getRectIntersection(left, right) {
  if (!left || !right) {
    return null
  }

  const x = Math.max(left.x, right.x)
  const y = Math.max(left.y, right.y)
  const rightEdge = Math.min(left.x + left.width, right.x + right.width)
  const bottomEdge = Math.min(left.y + left.height, right.y + right.height)
  const width = rightEdge - x
  const height = bottomEdge - y

  if (width <= 0 || height <= 0) {
    return null
  }

  return { x, y, width, height }
}

function getRectArea(rect) {
  return rect ? rect.width * rect.height : 0
}

function getRectCenter(rect) {
  return {
    x: rect.x + (rect.width / 2),
    y: rect.y + (rect.height / 2),
  }
}

function getDistanceSquared(left, right) {
  const deltaX = left.x - right.x
  const deltaY = left.y - right.y
  return (deltaX ** 2) + (deltaY ** 2)
}

function getWindowHeaderBounds(bounds) {
  return {
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: Math.max(1, Math.min(WINDOW_REACHABLE_HEADER_HEIGHT, bounds.height)),
  }
}

function isWindowStateReachable(input, displays = []) {
  const bounds = normalizeWindowState(input)
  if (!Number.isFinite(bounds.x) || !Number.isFinite(bounds.y)) {
    return false
  }

  const headerBounds = getWindowHeaderBounds(bounds)
  const requiredVisibleWidth = Math.min(WINDOW_REACHABLE_MIN_VISIBLE_WIDTH, headerBounds.width)
  const requiredVisibleHeight = Math.min(WINDOW_REACHABLE_MIN_VISIBLE_HEIGHT, headerBounds.height)

  return normalizeDisplays(displays).some((display) => {
    const intersection = getRectIntersection(headerBounds, display.workArea)
    return Boolean(
      intersection
      && intersection.width >= requiredVisibleWidth
      && intersection.height >= requiredVisibleHeight
    )
  })
}

function pickBestDisplayForWindowState(input, displays = []) {
  const normalizedDisplays = normalizeDisplays(displays)
  const bounds = normalizeWindowState(input)
  const windowCenter = getRectCenter({
    x: Number.isFinite(bounds.x) ? bounds.x : 0,
    y: Number.isFinite(bounds.y) ? bounds.y : 0,
    width: bounds.width,
    height: bounds.height,
  })

  let bestDisplay = getPrimaryDisplay(normalizedDisplays)
  let bestIntersectionArea = -1
  let bestDistance = Number.POSITIVE_INFINITY

  for (const display of normalizedDisplays) {
    const intersectionArea = getRectArea(getRectIntersection(bounds, display.workArea))
    const distance = getDistanceSquared(windowCenter, getRectCenter(display.workArea))

    if (
      intersectionArea > bestIntersectionArea
      || (intersectionArea === bestIntersectionArea && distance < bestDistance)
      || (
        intersectionArea === bestIntersectionArea
        && distance === bestDistance
        && display.isPrimary
        && !bestDisplay.isPrimary
      )
    ) {
      bestDisplay = display
      bestIntersectionArea = intersectionArea
      bestDistance = distance
    }
  }

  return bestDisplay
}

function getEffectiveMinimumSize(workArea, options = {}) {
  const baseMinWidth = normalizeDimension(options?.minWidth, WINDOW_DEFAULT_MIN_WIDTH)
  const baseMinHeight = normalizeDimension(options?.minHeight, WINDOW_DEFAULT_MIN_HEIGHT)

  return {
    minWidth: clamp(baseMinWidth, 1, workArea.width),
    minHeight: clamp(baseMinHeight, 1, workArea.height),
  }
}

function doesWindowStateFitDisplay(input, display) {
  const bounds = normalizeWindowState(input)
  const workArea = normalizeDisplayWorkArea(display)

  return bounds.width <= workArea.width && bounds.height <= workArea.height
}

function needsWindowStateCorrection(input, displays = []) {
  const bounds = normalizeWindowState(input)
  if (!Number.isFinite(bounds.x) || !Number.isFinite(bounds.y)) {
    return true
  }

  const targetDisplay = pickBestDisplayForWindowState(bounds, displays)
  return !isWindowStateReachable(bounds, displays) || !doesWindowStateFitDisplay(bounds, targetDisplay.workArea)
}

function resolveCenteredBounds(workArea, width, height) {
  return {
    x: workArea.x + Math.round((workArea.width - width) / 2),
    y: workArea.y + Math.round((workArea.height - height) / 2),
    width,
    height,
  }
}

function resolveClampedBounds(input, workArea, minWidth, minHeight) {
  const bounds = normalizeWindowState(input)
  const width = clamp(bounds.width, minWidth, workArea.width)
  const height = clamp(bounds.height, minHeight, workArea.height)

  return {
    x: clamp(bounds.x, workArea.x, workArea.x + workArea.width - width),
    y: clamp(bounds.y, workArea.y, workArea.y + workArea.height - height),
    width,
    height,
  }
}

function resolveWindowState(input = {}, displays = [], options = {}) {
  const fallback = getDefaultWindowState()
  const bounds = normalizeWindowState(input, fallback)
  const normalizedDisplays = normalizeDisplays(displays)
  const targetDisplay = pickBestDisplayForWindowState(bounds, normalizedDisplays)
  const workArea = targetDisplay.workArea
  const { minWidth, minHeight } = getEffectiveMinimumSize(workArea, options)

  if (!Number.isFinite(bounds.x) || !Number.isFinite(bounds.y)) {
    const width = clamp(bounds.width, minWidth, workArea.width)
    const height = clamp(bounds.height, minHeight, workArea.height)
    return {
      ...resolveCenteredBounds(workArea, width, height),
      minWidth,
      minHeight,
    }
  }

  if (!needsWindowStateCorrection(bounds, normalizedDisplays)) {
    return {
      ...bounds,
      minWidth,
      minHeight,
    }
  }

  return {
    ...resolveClampedBounds(bounds, workArea, minWidth, minHeight),
    minWidth,
    minHeight,
  }
}

function areWindowStatesEqual(left, right) {
  const leftBounds = normalizeWindowState(left)
  const rightBounds = normalizeWindowState(right)

  return leftBounds.x === rightBounds.x
    && leftBounds.y === rightBounds.y
    && leftBounds.width === rightBounds.width
    && leftBounds.height === rightBounds.height
}

module.exports = {
  WINDOW_DEFAULT_WIDTH,
  WINDOW_DEFAULT_HEIGHT,
  WINDOW_DEFAULT_MIN_WIDTH,
  WINDOW_DEFAULT_MIN_HEIGHT,
  areWindowStatesEqual,
  doesWindowStateFitDisplay,
  getDefaultWindowState,
  isWindowStateReachable,
  needsWindowStateCorrection,
  normalizeWindowState,
  pickBestDisplayForWindowState,
  resolveWindowState,
}
