const test = require('node:test')
const assert = require('node:assert/strict')

const {
  normalizeArtistTrackDisplayLimit,
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
