const { execFileSync } = require('child_process')

const VOLUME_ASSIST_TARGET_APP = 'app'
const VOLUME_ASSIST_TARGET_SYSTEM = 'system'
const VOLUME_ASSIST_DEFAULT_HOTKEY = 'Alt'
const VOLUME_ASSIST_STEP = 5

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function normalizeVolumeAssistTarget(input) {
  return input === VOLUME_ASSIST_TARGET_SYSTEM
    ? VOLUME_ASSIST_TARGET_SYSTEM
    : VOLUME_ASSIST_TARGET_APP
}

function normalizeVolumeAssistHotkey(input) {
  const tokens = String(input || '')
    .split('+')
    .map((token) => token.trim())
    .filter(Boolean)

  const modifierMap = new Map([
    ['control', 'Ctrl'],
    ['ctrl', 'Ctrl'],
    ['shift', 'Shift'],
    ['alt', 'Alt'],
    ['option', 'Alt'],
    ['meta', 'Meta'],
    ['cmd', 'Meta'],
    ['command', 'Meta'],
    ['super', 'Meta'],
    ['win', 'Meta'],
    ['windows', 'Meta'],
  ])
  const modifierOrder = ['Ctrl', 'Shift', 'Alt', 'Meta']
  const modifiers = new Set()
  let mainKey = ''

  for (const token of tokens) {
    const mappedModifier = modifierMap.get(token.toLowerCase())
    if (mappedModifier) {
      modifiers.add(mappedModifier)
      continue
    }

    if (!mainKey) {
      mainKey = token.length === 1 ? token.toUpperCase() : token
    }
  }

  const parts = modifierOrder.filter((modifier) => modifiers.has(modifier))
  if (mainKey) {
    parts.push(mainKey)
  }

  return parts.length ? parts.join('+') : VOLUME_ASSIST_DEFAULT_HOTKEY
}

function normalizeVolumeAssistSettings(input = {}) {
  const raw = input && typeof input === 'object' ? input : {}
  return {
    enabled: Boolean(raw.enabled),
    target: normalizeVolumeAssistTarget(raw.target),
    hotkey: normalizeVolumeAssistHotkey(raw.hotkey),
  }
}

function parseHotkeyParts(hotkey) {
  const parts = normalizeVolumeAssistHotkey(hotkey).split('+').filter(Boolean)
  const modifiers = new Set()
  let key = ''

  for (const part of parts) {
    if (part === 'Ctrl' || part === 'Shift' || part === 'Alt' || part === 'Meta') {
      modifiers.add(part)
    } else if (!key) {
      key = part
    }
  }

  return { modifiers, key }
}

function isHotkeyPressed(inputEvent = {}, hotkey) {
  const { modifiers, key } = parseHotkeyParts(hotkey)

  if (modifiers.has('Ctrl') && !inputEvent.control) {
    return false
  }
  if (modifiers.has('Shift') && !inputEvent.shift) {
    return false
  }
  if (modifiers.has('Alt') && !inputEvent.alt) {
    return false
  }
  if (modifiers.has('Meta') && !inputEvent.meta) {
    return false
  }

  if (!key) {
    return modifiers.size > 0
  }

  const pressedKey = String(inputEvent.key || '').trim()
  if (!pressedKey) {
    return false
  }

  return pressedKey.toLowerCase() === key.toLowerCase()
}

function getWheelDirection(inputEvent = {}) {
  const deltaY = Number(inputEvent.deltaY || 0)
  const deltaX = Number(inputEvent.deltaX || 0)

  if (Math.abs(deltaY) >= Math.abs(deltaX) && deltaY !== 0) {
    return deltaY < 0 ? 1 : -1
  }

  if (deltaX !== 0) {
    return deltaX < 0 ? 1 : -1
  }

  return 0
}

function adjustWindowsSystemVolume(direction, step = VOLUME_ASSIST_STEP) {
  if (process.platform !== 'win32') {
    throw new Error('系统音量辅助调节当前只支持 Windows。')
  }

  if (!Number.isFinite(Number(direction)) || Number(direction) === 0) {
    throw new Error('Invalid volume direction')
  }

  const normalizedDirection = direction > 0 ? 1 : -1
  const safeStep = clamp(Math.round(Number(step) || VOLUME_ASSIST_STEP), 1, 20)
  const virtualKey = normalizedDirection > 0 ? '0xAF' : '0xAE'
  const repeatCount = Math.max(1, safeStep)
  const script = [
    'Add-Type -TypeDefinition \'using System; using System.Runtime.InteropServices; public static class VolumeKeys { [DllImport("user32.dll")] public static extern void keybd_event(byte bVk, byte bScan, uint dwFlags, UIntPtr dwExtraInfo); }\'',
    `$vk = [byte]${virtualKey}`,
    `for ($i = 0; $i -lt ${repeatCount}; $i++) { [VolumeKeys]::keybd_event($vk, 0, 0, [UIntPtr]::Zero); [VolumeKeys]::keybd_event($vk, 0, 2, [UIntPtr]::Zero) }`,
  ].join('; ')

  execFileSync(
    'powershell.exe',
    ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-Command', script],
    { windowsHide: true, stdio: 'pipe', timeout: 3000 }
  )
}

module.exports = {
  VOLUME_ASSIST_DEFAULT_HOTKEY,
  VOLUME_ASSIST_TARGET_APP,
  VOLUME_ASSIST_TARGET_SYSTEM,
  VOLUME_ASSIST_STEP,
  normalizeVolumeAssistSettings,
  normalizeVolumeAssistHotkey,
  parseHotkeyParts,
  isHotkeyPressed,
  getWheelDirection,
  adjustWindowsSystemVolume,
}
