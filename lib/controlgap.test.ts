import { describe, it, expect } from 'vitest'
import {
  CONTROL_GAP_QUESTIONS,
  validateAnswers,
  scoreControlGap,
} from './controlgap'

describe('CONTROL_GAP_QUESTIONS', () => {
  it('has six questions, three per axis, each with three 0/1/2 options', () => {
    expect(CONTROL_GAP_QUESTIONS).toHaveLength(6)
    expect(CONTROL_GAP_QUESTIONS.slice(0, 3).every((q) => q.axis === 'adoption')).toBe(true)
    expect(CONTROL_GAP_QUESTIONS.slice(3).every((q) => q.axis === 'control')).toBe(true)
    for (const q of CONTROL_GAP_QUESTIONS) {
      expect(q.options.map((o) => o.value)).toEqual([0, 1, 2])
    }
  })
})

describe('validateAnswers', () => {
  it('accepts six in-range integers', () => {
    expect(validateAnswers([0, 1, 2, 0, 1, 2])).toEqual({ ok: true, answers: [0, 1, 2, 0, 1, 2] })
  })
  it('rejects wrong length', () => {
    expect(validateAnswers([0, 1, 2]).ok).toBe(false)
  })
  it('rejects non-array', () => {
    expect(validateAnswers('nope').ok).toBe(false)
  })
  it('rejects out-of-range or non-integer values', () => {
    expect(validateAnswers([0, 1, 2, 0, 1, 3]).ok).toBe(false)
    expect(validateAnswers([0, 1, 2, 0, 1, 1.5]).ok).toBe(false)
  })
})

describe('scoreControlGap', () => {
  it('sums each axis and derives the gap', () => {
    const s = scoreControlGap([2, 2, 2, 0, 0, 0])
    expect(s.adoption).toBe(6)
    expect(s.control).toBe(0)
    expect(s.gap).toBe(6)
    expect(s.band).toBe('critical')
  })
  it('bands a small gap as aligned', () => {
    const s = scoreControlGap([1, 1, 1, 1, 1, 1])
    expect(s.gap).toBe(0)
    expect(s.band).toBe('aligned')
  })
  it('bands a mid gap as widening', () => {
    expect(scoreControlGap([2, 1, 1, 1, 1, 0]).band).toBe('widening') // gap 2
  })
  it('names the weakest control question (lowest value, ties pick the first)', () => {
    const s = scoreControlGap([2, 2, 2, 1, 0, 0]) // Q5 and Q6 both 0; pick Q5
    expect(s.weakestControl).toBe(CONTROL_GAP_QUESTIONS[4].text)
  })
})
