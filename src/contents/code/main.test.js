/**
 * Jest test suite for main file of our comic plugin.
 * NOTE: Jest does not exactly match the environment of KDE JavaScript.
 */

const main = require('./main')

/* global expect test */

test('when no padding needed', () => {
  expect(main.zeroPad('1234')).toBe('1234')
})

test('default padding is 4', () => {
  expect(main.zeroPad('12')).toBe('0012')
})

test('padding specified exactly', () => {
  expect(main.zeroPad('12', 2)).toBe('12')
})

test('default padding undefined input', () => {
  expect(main.zeroPad()).toBe('0000')
})

test('default padding null input', () => {
  expect(main.zeroPad(null)).toBe('0000')
})
