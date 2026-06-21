import { describe, it, expect } from 'vitest'
import { encodePlaygroundParams, decodePlaygroundParams, type PlaygroundCardData } from './playground-card'

describe('playground card params', () => {
  it('round-trips card data', () => {
    const card: PlaygroundCardData = { attempts: 5, crackedVulnerable: true, hardenedHeld: true }
    const decoded = decodePlaygroundParams(new URLSearchParams(encodePlaygroundParams(card)))
    expect(decoded).toEqual(card)
  })

  it('round-trips false booleans', () => {
    const card: PlaygroundCardData = { attempts: 0, crackedVulnerable: false, hardenedHeld: false }
    const decoded = decodePlaygroundParams(new URLSearchParams(encodePlaygroundParams(card)))
    expect(decoded).toEqual(card)
  })

  it('clamps attempts and coerces garbage booleans on decode', () => {
    const params = new URLSearchParams('attempts=99999&cracked=maybe&held=1')
    const decoded = decodePlaygroundParams(params)
    expect(decoded.attempts).toBe(999)
    expect(decoded.crackedVulnerable).toBe(false)
    expect(decoded.hardenedHeld).toBe(true)
  })
})
