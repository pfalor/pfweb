import { describe, it, expect } from 'vitest'
import { deEmDash } from './text'

describe('deEmDash', () => {
  it('replaces em and en dashes with a comma', () => {
    expect(deEmDash('clear intent — weak enforcement')).toBe('clear intent, weak enforcement')
    expect(deEmDash('A – B')).toBe('A, B')
  })
  it('leaves text without dashes unchanged', () => {
    expect(deEmDash('no dashes here')).toBe('no dashes here')
  })
})
