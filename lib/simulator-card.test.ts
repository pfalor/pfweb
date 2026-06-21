import { describe, it, expect } from 'vitest'
import { encodeProfileParams, decodeProfileParams, type ProfileCardData } from './simulator-card'

describe('simulator profile card params', () => {
  it('round-trips profile data', () => {
    const card: ProfileCardData = {
      scenario: 'The Leaking Agent',
      archetype: 'Decisive Container',
      axes: [
        { label: 'Decisiveness', score: 82 },
        { label: 'Containment', score: 74 },
        { label: 'Stakeholder Communication', score: 61 },
        { label: 'Responsible-AI Rigor', score: 70 },
      ],
    }
    const decoded = decodeProfileParams(new URLSearchParams(encodeProfileParams(card)))
    expect(decoded).toEqual(card)
  })

  it('clamps scores, caps at 4 axes, and defends bad input', () => {
    const params = new URLSearchParams()
    params.set('scenario', 'x')
    params.set('archetype', 'y')
    params.append('axis', 'A:250')
    params.append('axis', 'B:-5')
    params.append('axis', 'C:not-a-number')
    params.append('axis', 'D:50')
    params.append('axis', 'E:99')
    const decoded = decodeProfileParams(params)
    expect(decoded.axes).toHaveLength(4)
    expect(decoded.axes[0]).toEqual({ label: 'A', score: 100 })
    expect(decoded.axes[1]).toEqual({ label: 'B', score: 0 })
    expect(decoded.axes[2]).toEqual({ label: 'C', score: 0 })
  })

  it('handles labels containing a colon', () => {
    const card: ProfileCardData = {
      scenario: 's',
      archetype: 'a',
      axes: [{ label: 'Comms: external', score: 40 }],
    }
    const decoded = decodeProfileParams(new URLSearchParams(encodeProfileParams(card)))
    expect(decoded.axes[0]).toEqual({ label: 'Comms: external', score: 40 })
  })
})
