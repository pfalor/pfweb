// ============================================================================
// GENERATIVE TOOLS — AI Readiness Assessment + Executive Briefing
// ============================================================================
// Both ground on Paul's compact practice context and route through the Gateway.
// Currently on Haiku 4.5 (free-tier eligible). To raise quality once paid
// Gateway credits are enabled, switch ASSESS_MODEL to Sonnet and BRIEF_MODEL
// to Opus — no other change needed.
// ============================================================================

import { generateObject } from 'ai'
import { z } from 'zod'
import { compactContext } from './knowledge'
import { scoreAssessment, ASSESSMENT_QUESTIONS } from '../assessment'

const ASSESS_MODEL = 'anthropic/claude-sonnet-4.6' // tailored maturity recommendations
const BRIEF_MODEL = 'anthropic/claude-opus-4.8' //   premium one-page briefing

const CONTEXT = compactContext()

function deEmDash(text: string): string {
  return text.replace(/\s*[—–]\s*/g, ', ')
}

// --- AI Readiness Assessment ---

const AssessmentAiSchema = z.object({
  summary: z.string().describe('2-3 sentence read on overall AI-security maturity, in Paul’s voice. No em dashes.'),
  recommendations: z
    .array(
      z.object({
        area: z.string().describe('Exactly one of: Security for AI, AI for Security, Data Protection'),
        recommendation: z.string().describe('One specific, practical next step for this area given the maturity level.'),
      })
    )
    .describe('Exactly three items, one per focus area.'),
  topPriority: z.string().describe('The single highest-leverage move to make first, one sentence.'),
})

export type AssessmentResult = {
  overall: number
  overallLevel: string
  areas: { area: string; score: number; level: string; recommendation: string }[]
  summary: string
  topPriority: string
}

export async function generateAssessment(answers: number[]): Promise<AssessmentResult> {
  const scored = scoreAssessment(answers)

  const answerLines = ASSESSMENT_QUESTIONS.map((q, i) => {
    const opt = q.options.find((o) => o.value === answers[i])
    return `(${q.area}) ${q.text} → ${opt ? opt.label : 'n/a'}`
  }).join('\n')

  const levelLines = scored.areas.map((a) => `${a.area}: ${a.level}`).join('; ')

  const { object } = await generateObject({
    model: ASSESS_MODEL,
    schema: AssessmentAiSchema,
    system: `You are Paul Falor's AI assistant generating a concise AI-security maturity readout for an executive. Ground your guidance in Paul's practice and positions below. Be specific and practical, not generic. Do not invent the respondent's details. No em dashes.

${CONTEXT}`,
    messages: [
      {
        role: 'user',
        content: `Here are the respondent's answers:\n${answerLines}\n\nComputed maturity levels: ${levelLines}.\n\nWrite a short overall summary, exactly one recommendation per focus area (use the exact area names), and the single top priority.`,
      },
    ],
  })

  const byArea = new Map(object.recommendations.map((r) => [r.area, r.recommendation]))
  return {
    overall: scored.overall,
    overallLevel: scored.overallLevel,
    areas: scored.areas.map((a) => ({
      ...a,
      recommendation: deEmDash(byArea.get(a.area) ?? ''),
    })),
    summary: deEmDash(object.summary),
    topPriority: deEmDash(object.topPriority),
  }
}

// --- Executive Briefing ---

const BriefSchema = z.object({
  title: z.string().describe('A specific, executive-appropriate title for the briefing.'),
  markdown: z.string().describe('A one-page briefing in markdown with 3-4 short sections and a brief closing. No em dashes.'),
})

export type BriefResult = z.infer<typeof BriefSchema>

export async function generateBriefing(opts: { role: string; industry: string; concern?: string }): Promise<BriefResult> {
  const { object } = await generateObject({
    model: BRIEF_MODEL,
    schema: BriefSchema,
    system: `You are Paul Falor's AI assistant producing a tailored, one-page executive briefing on AI security and data protection risk. Ground it in Paul's three focus areas and positions below. Write for a senior executive: clear, specific, non-generic, lightly opinionated, in Paul's practitioner voice. Structure as markdown with 3-4 short sections (e.g. what is at stake, the top risks, what good looks like / first moves) and a one-line closing. Keep it to roughly 350-500 words. Do not fabricate statistics or client names. No em dashes.

${CONTEXT}`,
    messages: [
      {
        role: 'user',
        content: `Audience role: ${opts.role}\nIndustry: ${opts.industry}${opts.concern ? `\nPrimary concern: ${opts.concern}` : ''}\n\nWrite the tailored briefing.`,
      },
    ],
  })
  return { title: deEmDash(object.title), markdown: deEmDash(object.markdown) }
}
