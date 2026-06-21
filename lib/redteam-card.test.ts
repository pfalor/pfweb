import { describe, it, expect } from 'vitest'
import { encodeCardParams, decodeCardParams, type CardData } from './redteam-card'

describe('redteam card params', () => {
  it('round-trips card data', () => {
    const card: CardData = {
      band: 'Developing',
      score: 62,
      verdict: 'Solid intent, thin on enforcement.',
      gaps: ['No incident escalation path', 'No model inventory', 'Vague data-retention rule'],
    }
    const decoded = decodeCardParams(new URLSearchParams(encodeCardParams(card)))
    expect(decoded).toEqual(card)
  })

  it('clamps score and defaults a bad band', () => {
    const params = new URLSearchParams('band=Bogus&score=250')
    const decoded = decodeCardParams(params)
    expect(decoded.band).toBe('Emerging')
    expect(decoded.score).toBe(100)
    expect(decoded.gaps).toEqual([])
  })

  it('keeps at most three gaps', () => {
    const card: CardData = { band: 'Strong', score: 88, verdict: 'Good.', gaps: ['a', 'b', 'c', 'd'] }
    const decoded = decodeCardParams(new URLSearchParams(encodeCardParams(card)))
    expect(decoded.gaps).toEqual(['a', 'b', 'c'])
  })

  it('clamps over-length verdict and gaps on decode', () => {
    const params = new URLSearchParams()
    params.set('band', 'Strong')
    params.set('score', '90')
    params.set('verdict', 'v'.repeat(300))
    params.append('gap', 'g'.repeat(200))
    const decoded = decodeCardParams(params)
    expect(decoded.verdict).toHaveLength(160)
    expect(decoded.gaps[0]).toHaveLength(90)
  })
})
