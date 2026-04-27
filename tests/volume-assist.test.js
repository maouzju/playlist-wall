const test = require('node:test')
const assert = require('node:assert/strict')

const {
  getWheelDirection,
  isHotkeyPressed,
  normalizeVolumeAssistSettings,
  parseHotkeyParts,
  parseVolumeAssistWheelLine,
  parseWindowsHookHotkey,
} = require('../src/main/volume-assist')

test('normalizeVolumeAssistSettings defaults to app volume with Alt hotkey', () => {
  assert.deepEqual(normalizeVolumeAssistSettings(), {
    enabled: false,
    target: 'app',
    hotkey: 'Alt',
  })
})

test('normalizeVolumeAssistSettings normalizes target and hotkey', () => {
  assert.deepEqual(
    normalizeVolumeAssistSettings({
      enabled: true,
      target: 'system',
      hotkey: 'control+shift+m',
    }),
    {
      enabled: true,
      target: 'system',
      hotkey: 'Ctrl+Shift+M',
    }
  )
})

test('parseHotkeyParts separates modifiers and main key', () => {
  const parsed = parseHotkeyParts('Ctrl+Alt+V')
  assert.deepEqual([...parsed.modifiers], ['Ctrl', 'Alt'])
  assert.equal(parsed.key, 'V')
})

test('isHotkeyPressed supports modifier-only and key-combo hotkeys', () => {
  assert.equal(isHotkeyPressed({ alt: true }, 'Alt'), true)
  assert.equal(isHotkeyPressed({ alt: false }, 'Alt'), false)
  assert.equal(isHotkeyPressed({ control: true, shift: true, key: 'x' }, 'Ctrl+Shift+X'), true)
  assert.equal(isHotkeyPressed({ control: true, shift: false, key: 'x' }, 'Ctrl+Shift+X'), false)
})

test('getWheelDirection maps upward wheel to volume up', () => {
  assert.equal(getWheelDirection({ deltaY: -120 }), 1)
  assert.equal(getWheelDirection({ deltaY: 120 }), -1)
  assert.equal(getWheelDirection({ deltaY: 0 }), 0)
})


test('parseWindowsHookHotkey maps modifier-only and key-combo hotkeys for the global listener', () => {
  assert.deepEqual(parseWindowsHookHotkey('Alt'), {
    hotkey: 'Alt',
    ctrl: false,
    shift: false,
    alt: true,
    meta: false,
    keyVk: 0,
  })

  assert.deepEqual(parseWindowsHookHotkey('Ctrl+Shift+X'), {
    hotkey: 'Ctrl+Shift+X',
    ctrl: true,
    shift: true,
    alt: false,
    meta: false,
    keyVk: 88,
  })
})

test('parseVolumeAssistWheelLine extracts global wheel directions', () => {
  assert.equal(parseVolumeAssistWheelLine('{"direction":1}'), 1)
  assert.equal(parseVolumeAssistWheelLine('{"direction":-1}'), -1)
  assert.equal(parseVolumeAssistWheelLine('{"direction":0}'), 0)
  assert.equal(parseVolumeAssistWheelLine('not json'), 0)
})
