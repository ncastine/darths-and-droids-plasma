/**
 * Jest test suite for main file of our comic plugin.
 * NOTE: Jest does not exactly match the environment of KDE JavaScript.
 */

const main = require('./main')

/* global test expect */

test('when no padding needed', () => {
  expect(main.zeroPad('1234')).toBe('1234')
})

test('default padding is 4', () => {
  expect(main.zeroPad('12')).toBe('0012')
})

test('padding specified exactly', () => {
  expect(main.zeroPad('12', 2)).toBe('12')
})
