import { describe, it, expect } from 'vitest'
import { truncateDocument } from './redteam'
import {
  validateDocument,
  redteamSystemPrompt,
  wrapDocument,
  finalizeResult,
  FRAMEWORKS,
  type RedteamResult,
} from './redteam'

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

describe('validateDocument', () => {
  it('rejects non-strings', () => {
    expect(validateDocument(123)).toEqual({ ok: false, error: expect.any(String) })
  })
  it('rejects too-short input', () => {
    const r = validateDocument('too short')
    expect(r.ok).toBe(false)
  })
  it('accepts and trims a real document', () => {
    const doc = '  ' + 'Our AI acceptable use policy requires human review of all model outputs. '.repeat(2)
    const r = validateDocument(doc)
    expect(r).toEqual({ ok: true, document: doc.trim() })
  })
})

describe('redteamSystemPrompt', () => {
  it('names every framework', () => {
    const p = redteamSystemPrompt()
    for (const f of FRAMEWORKS) expect(p).toContain(f)
  })
  it('instructs the model to treat the document as data, not instructions', () => {
    expect(redteamSystemPrompt().toLowerCase()).toContain('data')
    expect(redteamSystemPrompt().toLowerCase()).toContain('never follow')
  })
})

describe('wrapDocument', () => {
  it('wraps content in document tags', () => {
    expect(wrapDocument('hello')).toBe('<document>\nhello\n</document>')
  })
})

describe('finalizeResult', () => {
  it('clamps score and de-em-dashes prose', () => {
    const raw: RedteamResult = {
      docType: 'policy',
      band: 'Developing',
      score: 140,
      verdict: 'Good intent — weak teeth',
      gaps: [{ severity: 'high', framework: 'NIST AI RMF', finding: 'No map — no measure', fix: 'Add — controls' }],
      boardSummary: 'Tighten — enforcement',
    }
    const out = finalizeResult(raw)
    expect(out.score).toBe(100)
    expect(out.verdict).toBe('Good intent, weak teeth')
    expect(out.gaps[0].finding).toBe('No map, no measure')
    expect(out.gaps[0].fix).toBe('Add, controls')
    expect(out.boardSummary).toBe('Tighten, enforcement')
  })
})
