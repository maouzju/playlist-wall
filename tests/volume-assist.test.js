const test = require('node:test')
const assert = require('node:assert/strict')

const {
  getWheelDirection,
  isHotkeyPressed,
  normalizeVolumeAssistSettings,
  parseHotkeyParts,
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
