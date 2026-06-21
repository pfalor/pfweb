import { describe, it, expect } from 'vitest'
import { truncateDocument } from './redteam'

describe('truncateDocument', () => {
  it('leaves short text untouched', () => {
    const r = truncateDocument('short policy text', 12000)
    expect(r).toEqual({ text: 'short policy text', truncated: false })
  })

  it('truncates and flags long text', () => {
    const long = 'a'.repeat(13000)
    const r = truncateDocument(long, 12000)
    expect(r.truncated).toBe(true)
    expect(r.text).toHaveLength(12000)
  })
})
