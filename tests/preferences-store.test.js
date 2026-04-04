const test = require('node:test')
const assert = require('node:assert/strict')

const {
  normalizeArtistTrackDisplayLimit,
  normalizeAudioQualityPreference,
  normalizePlaylistOrderIds,
  normalizePreferences,
} = require('../src/main/preferences-store')

test('normalizeArtistTrackDisplayLimit clamps invalid values to the supported range', () => {
  assert.equal(normalizeArtistTrackDisplayLimit(undefined), 100)
  assert.equal(normalizeArtistTrackDisplayLimit('oops'), 100)
  assert.equal(normalizeArtistTrackDisplayLimit(1), 20)
  assert.equal(normalizeArtistTrackDisplayLimit(30.4), 30)
  assert.equal(normalizeArtistTrackDisplayLimit(9000), 1000)
})

test('normalizePreferences persists the artist track display limit', () => {
  const preferences = normalizePreferences({
    artistTrackDisplayLimit: '240',
  })

  assert.equal(preferences.artistTrackDisplayLimit, 240)
  assert.equal(preferences.theme, 'light')
  assert.equal(preferences.uiScale, 100)
})

test('normalizePlaylistOrderIds preserves order while removing invalid and duplicate ids', () => {
  assert.deepEqual(
    normalizePlaylistOrderIds([103, '102', 0, 'oops', 103, -201]),
    [103, 102, -201]
  )
})

test('normalizeAudioQualityPreference defaults to best and accepts supported values', () => {
  assert.equal(normalizeAudioQualityPreference(undefined), 'best')
  assert.equal(normalizeAudioQualityPreference('oops'), 'best')
  assert.equal(normalizeAudioQualityPreference('lossless'), 'lossless')
  assert.equal(normalizeAudioQualityPreference('exhigh'), 'exhigh')
  assert.equal(normalizeAudioQualityPreference('standard'), 'standard')
})

test('normalizePreferences persists audio quality preferences', () => {
  const preferences = normalizePreferences({
    defaultAudioQuality: 'lossless',
    autoAdjustAudioQuality: false,
  })

  assert.equal(preferences.defaultAudioQuality, 'lossless')
  assert.equal(preferences.autoAdjustAudioQuality, false)
})

test('normalizePreferences persists owned playlist order ids', () => {
  const preferences = normalizePreferences({
    ownedPlaylistOrderIds: ['103', 102, 103, 0],
  })

  assert.deepEqual(preferences.ownedPlaylistOrderIds, [103, 102])
})

test('normalizePreferences persists window state', () => {
  const preferences = normalizePreferences({
    windowState: {
      x: '48.6',
      y: 96,
      width: '1400',
      height: '900.2',
    },
  })

  assert.deepEqual(preferences.windowState, {
    x: 49,
    y: 96,
    width: 1400,
    height: 900,
  })
})
