// ============================================================================
// THE AI CONTROL GAP — questions + scoring
// ============================================================================
// Six executive questions across two axes. Adoption (Q1-Q3) tends to outrun
// Control (Q4-Q6); the space between is "the Control Gap." Scoring is
// deterministic; the AI writes the tailored diagnosis. Shared by the page UI
// and the API route. See docs/superpowers/specs/2026-06-25-ai-control-gap-design.md
// ============================================================================

export interface ControlGapOption {
  label: string
  value: 0 | 1 | 2
}

export interface ControlGapQuestion {
  axis: 'adoption' | 'control'
  text: string
  options: ControlGapOption[]
}

export const CONTROL_GAP_QUESTIONS: ControlGapQuestion[] = [
  {
    axis: 'adoption',
    text: 'How widely is generative AI used across your business today?',
    options: [
      { label: 'Isolated pilots, one or two functions', value: 0 },
      { label: 'Several functions and growing', value: 1 },
      { label: 'Embedded across most of the business', value: 2 },
    ],
  },
  {
    axis: 'adoption',
    text: "Are people using AI tools the organization hasn't sanctioned?",
    options: [
      { label: "No evidence of it, or it's blocked", value: 0 },
      { label: 'Probably, but we lack visibility', value: 1 },
      { label: 'Yes, widely and openly', value: 2 },
    ],
  },
  {
    axis: 'adoption',
    text: 'Are you deploying AI agents that take actions, not just answer questions?',
    options: [
      { label: 'Not yet', value: 0 },
      { label: 'Piloting a few', value: 1 },
      { label: 'In production with real system access', value: 2 },
    ],
  },
  {
    axis: 'control',
    text: 'Who owns AI governance and risk in your organization?',
    options: [
      { label: 'No clear owner yet', value: 0 },
      { label: 'Shared informally across teams', value: 1 },
      { label: 'A named owner with mandate and budget', value: 2 },
    ],
  },
  {
    axis: 'control',
    text: 'Do you know what data flows into the AI tools your people use?',
    options: [
      { label: 'Limited visibility', value: 0 },
      { label: 'Partial, for sanctioned tools only', value: 1 },
      { label: 'Yes, monitored across the data lifecycle', value: 2 },
    ],
  },
  {
    axis: 'control',
    text: 'Do you have guardrails and monitoring on AI outputs and agent actions?',
    options: [
      { label: 'Not yet', value: 0 },
      { label: 'Basic policies, limited enforcement', value: 1 },
      { label: 'Active guardrails and continuous evaluation', value: 2 },
    ],
  },
]

export interface ControlGapScore {
  adoption: number // 0-6
  control: number // 0-6
  gap: number // adoption - control
  band: 'aligned' | 'widening' | 'critical'
  weakestControl: string // text of the lowest-scoring control question
}

export function validateAnswers(
  input: unknown
): { ok: true; answers: number[] } | { ok: false; error: string } {
  if (!Array.isArray(input) || input.length !== CONTROL_GAP_QUESTIONS.length) {
    return { ok: false, error: 'Expected six answers.' }
  }
  for (const v of input) {
    if (!Number.isInteger(v) || v < 0 || v > 2) {
      return { ok: false, error: 'Each answer must be 0, 1, or 2.' }
    }
  }
  return { ok: true, answers: input as number[] }
}

export function scoreControlGap(answers: number[]): ControlGapScore {
  const adoption = answers.slice(0, 3).reduce((a, b) => a + b, 0)
  const control = answers.slice(3, 6).reduce((a, b) => a + b, 0)
  const gap = adoption - control

  let band: ControlGapScore['band'] = 'aligned'
  if (gap >= 4) band = 'critical'
  else if (gap >= 2) band = 'widening'

  // Weakest control question: lowest value among Q4-Q6; ties pick the earliest.
  const controlAnswers = answers.slice(3, 6)
  let weakestIdx = 0
  for (let i = 1; i < controlAnswers.length; i++) {
    if (controlAnswers[i] < controlAnswers[weakestIdx]) weakestIdx = i
  }
  const weakestControl = CONTROL_GAP_QUESTIONS[3 + weakestIdx].text

  return { adoption, control, gap, band, weakestControl }
}
