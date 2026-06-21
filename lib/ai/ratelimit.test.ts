import { describe, it, expect } from 'vitest'
import { rateLimit } from './ratelimit'

describe('rateLimit', () => {
  it('blocks after the configured max within the window', () => {
    const key = 'test-key-a'
    for (let i = 0; i < 5; i++) {
      expect(rateLimit(key, { max: 5 }).ok).toBe(true)
    }
    expect(rateLimit(key, { max: 5 }).ok).toBe(false)
  })

  it('defaults to a max of 12 when no opts given', () => {
    const key = 'test-key-b'
    for (let i = 0; i < 12; i++) {
      expect(rateLimit(key).ok).toBe(true)
    }
    expect(rateLimit(key).ok).toBe(false)
  })
})
