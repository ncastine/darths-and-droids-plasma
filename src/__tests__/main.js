/**
 * Jest test suite for the main.js entrypoint file of our comic plugin.
 * NOTE: NodeJS does not really match the environment of KDE JavaScript.
 * But we can at least test our custom functions.
 */

const main = require('../contents/code/main')

/* global describe expect test */

describe('zero padding', () => {
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
})
