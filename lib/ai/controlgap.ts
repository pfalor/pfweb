// ============================================================================
// AI CONTROL GAP — diagnosis generation
// ============================================================================
// Turns six scored answers into a short, tailored diagnosis in Paul's voice.
// Grounds on the compact practice context and routes through the Gateway.
// Mirrors lib/ai/tools.ts. Sonnet 4.6 (paid Gateway credits enabled).
// ============================================================================

import { generateObject } from 'ai'
import { z } from 'zod'
import { compactContext } from './knowledge'
import { deEmDash } from './text'
import {
  scoreControlGap,
  CONTROL_GAP_QUESTIONS,
  type ControlGapScore,
} from '../controlgap'

const MODEL = 'anthropic/claude-sonnet-4.6'
const CONTEXT = compactContext()

export interface ControlGapDiagnosis {
  diagnosis: string
  topMove: string
}

export interface ControlGapResult extends ControlGapScore {
  diagnosis: string
  topMove: string
}

const DiagnosisSchema = z.object({
  diagnosis: z
    .string()
    .describe(
      "One sharp paragraph (3-5 sentences) in Paul's voice naming the executive's specific control gap and why it matters. No em dashes."
    ),
  topMove: z
    .string()
    .describe('The single highest-leverage move to close the gap, one sentence. No em dashes.'),
})

export function controlGapSystemPrompt(): string {
  return `You are Paul Falor's AI assistant writing a short, tailored diagnosis for a senior executive who just located their organization on Paul's "AI Control Gap" model. The model has two curves: Adoption Velocity (how fast they are putting AI to work) and Control Maturity (how fast their ability to govern and secure it keeps up). The space between is the Control Gap, where the risk lives.

Ground your diagnosis in Paul's practice and positions below. Be specific and practical, not generic. Name the real consequence of their particular gap. Do not invent details about the respondent or fabricate statistics. Write in Paul's practitioner voice: clear, opinionated, varied sentence length. No em dashes.

${CONTEXT}`
}

export function buildDiagnosisRequest(answers: number[], score: ControlGapScore): string {
  const lines = CONTROL_GAP_QUESTIONS.map((q, i) => {
    const opt = q.options.find((o) => o.value === answers[i])
    return `(${q.axis}) ${q.text} -> ${opt ? opt.label : 'n/a'}`
  }).join('\n')

  return `The executive's answers:
${lines}

Scores: Adoption: ${score.adoption} of 6. Control: ${score.control} of 6. Control gap: ${score.gap} (${score.band}).
Their weakest control area is: "${score.weakestControl}".

Write the diagnosis paragraph and the single top move. Speak directly to this gap.`
}

export function finalizeResult(
  raw: ControlGapDiagnosis,
  score: ControlGapScore
): ControlGapResult {
  return {
    ...score,
    diagnosis: deEmDash(raw.diagnosis),
    topMove: deEmDash(raw.topMove),
  }
}

export async function generateDiagnosis(answers: number[]): Promise<ControlGapResult> {
  const score = scoreControlGap(answers)
  const { object } = await generateObject({
    model: MODEL,
    schema: DiagnosisSchema,
    system: controlGapSystemPrompt(),
    messages: [{ role: 'user', content: buildDiagnosisRequest(answers, score) }],
  })
  return finalizeResult(object, score)
}
