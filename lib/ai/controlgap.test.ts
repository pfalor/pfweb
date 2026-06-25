import { describe, it, expect } from 'vitest'
import {
  controlGapSystemPrompt,
  buildDiagnosisRequest,
  finalizeResult,
} from './controlgap'
import { scoreControlGap } from '../controlgap'

describe('controlGapSystemPrompt', () => {
  it("grounds in Paul's context and forbids em dashes", () => {
    const p = controlGapSystemPrompt()
    expect(p).toMatch(/Paul Falor/)
    expect(p).toMatch(/no em dashes/i)
  })
})

describe('buildDiagnosisRequest', () => {
  it('includes the scores, the gap, and the weakest control area', () => {
    const answers = [2, 2, 2, 0, 0, 0]
    const score = scoreControlGap(answers)
    const req = buildDiagnosisRequest(answers, score)
    expect(req).toMatch(/Adoption: 6/)
    expect(req).toMatch(/Control: 0/)
    expect(req).toMatch(/gap/i)
    expect(req).toContain(score.weakestControl)
  })
})

describe('finalizeResult', () => {
  it('merges the score, strips em dashes from model text', () => {
    const score = scoreControlGap([2, 2, 2, 0, 0, 0])
    const out = finalizeResult(
      { diagnosis: 'Your gap is wide — dangerously so.', topMove: 'Name an owner — today.' },
      score
    )
    expect(out.adoption).toBe(6)
    expect(out.gap).toBe(6)
    expect(out.diagnosis).not.toContain('—')
    expect(out.topMove).not.toContain('—')
  })
})
