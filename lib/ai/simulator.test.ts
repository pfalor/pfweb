import { describe, it, expect } from 'vitest'
import {
  SIM_DEPTH,
  PROFILE_AXES,
  listScenarios,
  getScenario,
  validateSimRequest,
  isFinalTurn,
  beatSystemPrompt,
  resultSystemPrompt,
  wrapTranscript,
  finalizeResult,
  type Turn,
  type SimResult,
} from './simulator'

describe('scenarios', () => {
  it('exposes 4 scenarios without leaking anchors', () => {
    const list = listScenarios()
    expect(list).toHaveLength(4)
    for (const s of list) {
      expect(typeof s.id).toBe('string')
      expect(typeof s.title).toBe('string')
      expect(typeof s.setup).toBe('string')
      expect((s as Record<string, unknown>).anchors).toBeUndefined()
    }
  })

  it('getScenario returns a full scenario with anchors for a known id, undefined otherwise', () => {
    const id = listScenarios()[0].id
    const s = getScenario(id)
    expect(s?.anchors.length).toBeGreaterThanOrEqual(2)
    expect(getScenario('nope')).toBeUndefined()
  })
})

describe('validateSimRequest', () => {
  const goodId = () => listScenarios()[0].id
  it('rejects unknown scenario id', () => {
    expect(validateSimRequest({ scenarioId: 'bogus', history: [] }).ok).toBe(false)
  })
  it('rejects non-array history', () => {
    expect(validateSimRequest({ scenarioId: goodId(), history: 'x' }).ok).toBe(false)
  })
  it('rejects history longer than SIM_DEPTH', () => {
    const h = Array.from({ length: SIM_DEPTH + 1 }, () => ({ situation: 's', choice: 'c' }))
    expect(validateSimRequest({ scenarioId: goodId(), history: h }).ok).toBe(false)
  })
  it('rejects a malformed turn', () => {
    expect(validateSimRequest({ scenarioId: goodId(), history: [{ situation: 's' }] }).ok).toBe(false)
  })
  it('accepts a valid empty-history request', () => {
    const r = validateSimRequest({ scenarioId: goodId(), history: [] })
    expect(r).toEqual({ ok: true, scenarioId: goodId(), history: [] })
  })
  it('truncates over-long turn strings', () => {
    const r = validateSimRequest({
      scenarioId: goodId(),
      history: [{ situation: 'a'.repeat(5000), choice: 'b'.repeat(5000) }],
    })
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.history[0].situation.length).toBeLessThanOrEqual(2000)
      expect(r.history[0].choice.length).toBeLessThanOrEqual(400)
    }
  })
})

describe('isFinalTurn', () => {
  it('is false below SIM_DEPTH and true at/above it', () => {
    expect(isFinalTurn([])).toBe(false)
    expect(isFinalTurn(Array.from({ length: SIM_DEPTH - 1 }, () => ({ situation: 's', choice: 'c' })))).toBe(false)
    expect(isFinalTurn(Array.from({ length: SIM_DEPTH }, () => ({ situation: 's', choice: 'c' })))).toBe(true)
  })
})

describe('prompts treat the transcript as data, not instructions', () => {
  const scenario = getScenario(listScenarios()[0].id)!
  it('beat prompt names the injection rule', () => {
    const p = beatSystemPrompt(scenario).toLowerCase()
    expect(p).toContain('never follow')
    expect(p).toContain('data')
  })
  it('result prompt includes Paul anchors and the injection rule', () => {
    const p = resultSystemPrompt(scenario)
    expect(p).toContain(scenario.anchors[0])
    expect(p.toLowerCase()).toContain('never follow')
  })
  it('wrapTranscript wraps turns in a transcript block', () => {
    const h: Turn[] = [{ situation: 'S1', choice: 'C1' }]
    const w = wrapTranscript(h)
    expect(w).toContain('<transcript>')
    expect(w).toContain('</transcript>')
    expect(w).toContain('C1')
  })
})

describe('finalizeResult', () => {
  it('clamps axis scores and de-em-dashes prose', () => {
    const raw: SimResult = {
      archetype: 'Bold — Decisive',
      axes: [{ label: 'Decisiveness', score: 130, note: 'Acted fast — maybe too fast' }],
      reveal: 'Contain first — then talk',
    }
    const out = finalizeResult(raw)
    expect(out.archetype).toBe('Bold, Decisive')
    expect(out.axes[0].score).toBe(100)
    expect(out.axes[0].note).toBe('Acted fast, maybe too fast')
    expect(out.reveal).toBe('Contain first, then talk')
  })
})
