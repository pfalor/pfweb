import { describe, it, expect } from 'vitest'
import { injectionPatterns } from './guardrails'

describe('injectionPatterns', () => {
  it('returns a non-empty list of { type, source } entries', () => {
    const patterns = injectionPatterns()
    expect(patterns.length).toBeGreaterThanOrEqual(6)
    for (const p of patterns) {
      expect(typeof p.type).toBe('string')
      expect(p.type.length).toBeGreaterThan(0)
      expect(typeof p.source).toBe('string')
      expect(p.source.length).toBeGreaterThan(0)
    }
  })
  it('includes known attack types', () => {
    const types = injectionPatterns().map((p) => p.type)
    expect(types).toContain('Instruction override')
    expect(types).toContain('System prompt extraction')
  })
})
