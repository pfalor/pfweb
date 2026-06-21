// ============================================================================
// AI READINESS ASSESSMENT — questions, areas, scoring
// ============================================================================
// Six executive-level questions, two per focus area. Each option maps to a
// maturity value 1-4. Levels are computed deterministically; the AI writes the
// tailored recommendations. Shared by the quiz UI and the API route.
// ============================================================================

export interface AssessmentOption {
  label: string
  value: 1 | 2 | 3 | 4
}

export interface AssessmentQuestion {
  area: string
  text: string
  options: AssessmentOption[]
}

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    area: 'Security for AI',
    text: 'How is generative AI being adopted across your organization?',
    options: [
      { label: 'Ad hoc — employees use whatever tools they find, no policy', value: 1 },
      { label: 'Some sanctioned tools with informal guidance', value: 2 },
      { label: 'Approved tools with a usage policy and access controls', value: 3 },
      { label: 'A governed program with guardrails and continuous evaluation', value: 4 },
    ],
  },
  {
    area: 'Security for AI',
    text: 'Do you have AI governance — an inventory, a risk framework, and approvals?',
    options: [
      { label: 'None yet', value: 1 },
      { label: 'In development', value: 2 },
      { label: 'Defined and partially adopted', value: 3 },
      { label: 'Operationalized and audited (e.g. NIST AI RMF, ISO 42001)', value: 4 },
    ],
  },
  {
    area: 'AI for Security',
    text: 'How much is AI used in your security operations today?',
    options: [
      { label: 'Not at all', value: 1 },
      { label: 'Piloting copilots and assistants', value: 2 },
      { label: 'AI-assisted triage and enrichment in production', value: 3 },
      { label: 'Agentic workflows with human-on-the-loop oversight', value: 4 },
    ],
  },
  {
    area: 'AI for Security',
    text: 'Can you detect and respond at the speed attackers now move?',
    options: [
      { label: 'Mostly manual; response is measured in days', value: 1 },
      { label: 'Some automation; response in hours', value: 2 },
      { label: 'Automated detection and fast, consistent response', value: 3 },
      { label: 'Continuously measured and optimized against benchmarks', value: 4 },
    ],
  },
  {
    area: 'Data Protection',
    text: 'How well do you know where your sensitive data actually lives?',
    options: [
      { label: 'Largely unknown — significant shadow data', value: 1 },
      { label: 'A partial inventory of key systems', value: 2 },
      { label: 'Classified and mapped across the estate', value: 3 },
      { label: 'Continuously discovered and monitored', value: 4 },
    ],
  },
  {
    area: 'Data Protection',
    text: 'What limits the blast radius if a breach happens?',
    options: [
      { label: 'Minimal controls beyond perimeter defense', value: 1 },
      { label: 'Encryption at rest and in transit', value: 2 },
      { label: 'Tokenization and data minimization in key systems', value: 3 },
      { label: 'Comprehensive controls including a post-quantum roadmap', value: 4 },
    ],
  },
]

export const ASSESSMENT_AREAS = ['Security for AI', 'AI for Security', 'Data Protection'] as const

export const MATURITY_LEVELS = ['Foundational', 'Developing', 'Defined', 'Advanced'] as const

export function levelLabel(score: number): string {
  const i = Math.min(4, Math.max(1, Math.round(score)))
  return MATURITY_LEVELS[i - 1]
}

export interface AreaScore {
  area: string
  score: number
  level: string
}

// answers: array of 6 values (1-4), aligned to ASSESSMENT_QUESTIONS order.
export function scoreAssessment(answers: number[]): { areas: AreaScore[]; overall: number; overallLevel: string } {
  const areas: AreaScore[] = ASSESSMENT_AREAS.map((area) => {
    const idxs = ASSESSMENT_QUESTIONS.map((q, i) => (q.area === area ? i : -1)).filter((i) => i >= 0)
    const vals = idxs.map((i) => answers[i]).filter((v) => typeof v === 'number')
    const score = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0
    return { area, score, level: levelLabel(score) }
  })
  const overall = areas.reduce((a, b) => a + b.score, 0) / areas.length
  return { areas, overall, overallLevel: levelLabel(overall) }
}
