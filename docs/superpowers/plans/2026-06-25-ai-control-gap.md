# The AI Control Gap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `/ai-control-gap`, Paul's signature framework page: teach the two-curve "Control Gap" model, let an executive locate themselves on it via six scored questions, and generate an AI diagnosis in Paul's voice.

**Architecture:** Pure scoring/questions in `lib/controlgap.ts` (mirrors `lib/assessment.ts`). AI diagnosis in `lib/ai/controlgap.ts` via `generateObject` grounded in `compactContext()` (mirrors `lib/ai/tools.ts`). A hardened API route mirrors `app/api/ai/brief/route.ts`. A server page + client component mirror the `red-team` split. An animated SVG chart component renders the two curves and is reused as a homepage teaser.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind, framer-motion (^12), `ai` (^6) + `zod` (^3) through the Vercel AI Gateway, vitest (^2).

## Global Constraints

- **Writing voice (CLAUDE.md):** No em dashes anywhere in user-facing copy or model output. Vary sentence length. Take a position. Avoid the vocabulary tics (delve, leverage, robust, seamless, etc.). The AI system prompt must state these constraints; model output is additionally run through `deEmDash`.
- **Edit content files directly.** Do not use the `/admin` UI (it regenerates `lib/data.ts`).
- **Models:** diagnosis uses `'anthropic/claude-sonnet-4.6'` via the gateway (paid credits enabled). Match the model-string style in `lib/ai/tools.ts`.
- **Answer contract:** six answers, ordered Q1..Q6, each an integer `0|1|2`. Q1-Q3 are the Adoption axis; Q4-Q6 are the Control axis. The server recomputes all scores; it never trusts a client-supplied gap or diagnosis.
- **Graceful degradation:** Beats 1 and 2 (model + mirror) must work with zero AI. Only Beat 3 (diagnosis) calls the gateway; a gateway failure shows a friendly message and the briefing link, it does not break the page.
- **Test runner:** `npm test` runs `vitest run`. Tests are colocated (`*.test.ts`).

---

### Task 1: Scoring + questions library

**Files:**
- Create: `lib/controlgap.ts`
- Test: `lib/controlgap.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `interface ControlGapOption { label: string; value: 0 | 1 | 2 }`
  - `interface ControlGapQuestion { axis: 'adoption' | 'control'; text: string; options: ControlGapOption[] }`
  - `const CONTROL_GAP_QUESTIONS: ControlGapQuestion[]` (length 6: 3 adoption, then 3 control)
  - `interface ControlGapScore { adoption: number; control: number; gap: number; band: 'aligned' | 'widening' | 'critical'; weakestControl: string }`
  - `function validateAnswers(input: unknown): { ok: true; answers: number[] } | { ok: false; error: string }`
  - `function scoreControlGap(answers: number[]): ControlGapScore`

- [ ] **Step 1: Write the failing test**

```ts
// lib/controlgap.test.ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- controlgap`
Expected: FAIL — `Cannot find module './controlgap'`.

- [ ] **Step 3: Write minimal implementation**

```ts
// lib/controlgap.ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- controlgap`
Expected: PASS (all cases in `lib/controlgap.test.ts`).

- [ ] **Step 5: Commit**

```bash
git add lib/controlgap.ts lib/controlgap.test.ts
git commit -m "feat: control gap scoring and question set"
```

---

### Task 2: AI diagnosis library

**Files:**
- Create: `lib/ai/controlgap.ts`
- Test: `lib/ai/controlgap.test.ts`

**Interfaces:**
- Consumes: `scoreControlGap`, `ControlGapScore`, `CONTROL_GAP_QUESTIONS` from `lib/controlgap.ts`; `compactContext` from `lib/ai/knowledge.ts`; `deEmDash` from `lib/ai/text.ts`.
- Produces:
  - `interface ControlGapDiagnosis { diagnosis: string; topMove: string }`
  - `interface ControlGapResult extends ControlGapScore { diagnosis: string; topMove: string }`
  - `function controlGapSystemPrompt(): string`
  - `function buildDiagnosisRequest(answers: number[], score: ControlGapScore): string`
  - `function finalizeResult(raw: ControlGapDiagnosis, score: ControlGapScore): ControlGapResult`
  - `async function generateDiagnosis(answers: number[]): Promise<ControlGapResult>`

The live `generateObject` call is not unit-tested (matches `lib/ai/redteam.test.ts`, which tests only the pure helpers). Tests cover the prompt builders and `finalizeResult`.

- [ ] **Step 1: Write the failing test**

```ts
// lib/ai/controlgap.test.ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- ai/controlgap`
Expected: FAIL — `Cannot find module './controlgap'`.

- [ ] **Step 3: Write minimal implementation**

```ts
// lib/ai/controlgap.ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- ai/controlgap`
Expected: PASS (three describe blocks).

- [ ] **Step 5: Commit**

```bash
git add lib/ai/controlgap.ts lib/ai/controlgap.test.ts
git commit -m "feat: control gap AI diagnosis generation"
```

---

### Task 3: API route

**Files:**
- Create: `app/api/ai/controlgap/route.ts`

**Interfaces:**
- Consumes: `validateAnswers` from `lib/controlgap.ts`; `generateDiagnosis` from `lib/ai/controlgap.ts`; `rateLimit` from `lib/ai/ratelimit.ts`.
- Produces: `POST` handler. Request body `{ answers: number[] }`. Success returns the `ControlGapResult` JSON. Errors: 400 (bad body), 429 (rate limit), 502 (model failure).

This route has no pure logic of its own beyond validation already covered by Task 1's tests; it is verified by the manual smoke test in Step 3 and by Task 5's end-to-end walk. No separate unit test (matches `app/api/ai/brief/route.ts`, which has none).

- [ ] **Step 1: Write the implementation**

```ts
// app/api/ai/controlgap/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { generateDiagnosis } from '@/lib/ai/controlgap'
import { validateAnswers } from '@/lib/controlgap'
import { rateLimit } from '@/lib/ai/ratelimit'

export const runtime = 'nodejs'
export const maxDuration = 45

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const limit = rateLimit(`controlgap:${ip}`)
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many requests. Please slow down.' },
      { status: 429, headers: { 'retry-after': String(limit.retryAfterSec) } }
    )
  }

  let body: { answers?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const parsed = validateAnswers(body.answers)
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }

  try {
    const result = await generateDiagnosis(parsed.answers)
    return NextResponse.json(result)
  } catch (err) {
    console.error('[ai/controlgap] error', err)
    return NextResponse.json(
      { error: 'The diagnosis is unavailable right now. Please try again.' },
      { status: 502 }
    )
  }
}
```

- [ ] **Step 2: Verify it compiles and validation works**

Run: `npm run build`
Expected: build succeeds with the new route listed.

Then start `npm run dev` and smoke-test validation (no model call needed for the 400 path):

Run: `curl -s -X POST localhost:42069/api/ai/controlgap -H 'content-type: application/json' -d '{"answers":[0,1]}'`
Expected: `{"error":"Expected six answers."}` with HTTP 400.

- [ ] **Step 3: Commit**

```bash
git add app/api/ai/controlgap/route.ts
git commit -m "feat: control gap diagnosis API route"
```

---

### Task 4: Two-curve chart component

**Files:**
- Create: `components/ControlGapChart.tsx`

**Interfaces:**
- Consumes: nothing from earlier tasks (pure presentational).
- Produces: default export `ControlGapChart`.

  ```ts
  interface ControlGapChartProps {
    adoption?: number   // 0-6, controls the Control-curve vs Adoption-curve heights
    control?: number    // 0-6
    animate?: boolean    // animate curves in on mount (default true)
    compact?: boolean    // smaller variant for the homepage teaser (default false)
  }
  ```

  When `adoption`/`control` are omitted, render the canonical illustrative shape (adoption steep, control shallow). When provided, scale the two curve endpoints to those scores so the shaded gap reflects the visitor's result.

This is a visual component; it is verified by eye in Task 5's manual walk, not by a unit test (matches the other interactive components, which have no component tests).

- [ ] **Step 1: Write the implementation**

```tsx
// components/ControlGapChart.tsx
'use client'

import { motion } from 'framer-motion'

interface ControlGapChartProps {
  adoption?: number
  control?: number
  animate?: boolean
  compact?: boolean
}

// viewBox space
const W = 600
const H = 340
const PAD = 36

// Map a 0-6 score to a curve end-height (higher score => higher curve).
// Defaults give the canonical "adoption steep, control shallow" illustration.
function endY(score: number | undefined, fallback: number): number {
  const s = typeof score === 'number' ? Math.max(0, Math.min(6, score)) : null
  const top = PAD
  const bottom = H - PAD
  if (s === null) return fallback
  return bottom - (s / 6) * (bottom - top)
}

// Cubic path from bottom-left baseline rising to (W-PAD, endHeight).
function curvePath(endYVal: number): string {
  const x0 = PAD
  const y0 = H - PAD
  const x1 = W - PAD
  const cx = PAD + (x1 - x0) * 0.55
  return `M ${x0} ${y0} C ${cx} ${y0}, ${cx} ${endYVal}, ${x1} ${endYVal}`
}

export default function ControlGapChart({
  adoption,
  control,
  animate = true,
  compact = false,
}: ControlGapChartProps) {
  const adoptionY = endY(adoption, PAD + 18) // steep by default
  const controlY = endY(control, H - PAD - 90) // shallow by default

  const adoptionD = curvePath(adoptionY)
  const controlD = curvePath(controlY)

  // Shaded gap between the two end points on the right edge.
  const gapPath = `M ${W - PAD} ${adoptionY} L ${W - PAD} ${controlY} L ${PAD} ${H - PAD} Z`

  const draw = animate
    ? { initial: { pathLength: 0 }, animate: { pathLength: 1 }, transition: { duration: 1.1, ease: 'easeInOut' } }
    : {}

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Two curves: Adoption Velocity rising fast above Control Maturity rising slowly, with the gap between them shaded as the Control Gap."
      className={compact ? 'w-full max-w-sm' : 'w-full max-w-2xl'}
    >
      {/* axes */}
      <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="currentColor" strokeOpacity="0.2" />
      <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="currentColor" strokeOpacity="0.2" />

      {/* shaded control gap */}
      <motion.path
        d={gapPath}
        className="fill-rose-500/15"
        initial={animate ? { opacity: 0 } : false}
        animate={animate ? { opacity: 1 } : undefined}
        transition={{ delay: 0.9, duration: 0.6 }}
      />

      {/* control maturity (slow) */}
      <motion.path d={controlD} fill="none" className="stroke-sky-400" strokeWidth={3} {...draw} />
      {/* adoption velocity (fast) */}
      <motion.path d={adoptionD} fill="none" className="stroke-emerald-400" strokeWidth={3} {...draw} />

      {!compact && (
        <>
          <text x={W - PAD} y={adoptionY - 10} textAnchor="end" className="fill-emerald-400 text-[13px] font-medium">
            Adoption Velocity
          </text>
          <text x={W - PAD} y={controlY + 22} textAnchor="end" className="fill-sky-400 text-[13px] font-medium">
            Control Maturity
          </text>
          <text
            x={(W - PAD + PAD) / 2}
            y={(adoptionY + (H - PAD)) / 2}
            textAnchor="middle"
            className="fill-rose-300 text-[13px] font-semibold"
          >
            The Control Gap
          </text>
        </>
      )}
    </svg>
  )
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npm run build`
Expected: build succeeds (component is imported in Task 5; for now confirm no type error by temporarily importing it, or rely on Task 5's build). If building standalone, add `export default` is present and props are optional, so a bare `<ControlGapChart />` type-checks.

- [ ] **Step 3: Commit**

```bash
git add components/ControlGapChart.tsx
git commit -m "feat: animated two-curve control gap chart"
```

---

### Task 5: The page and interactive client (three beats)

**Files:**
- Create: `app/ai-control-gap/page.tsx`
- Create: `app/ai-control-gap/ControlGapClient.tsx`

**Interfaces:**
- Consumes: `ControlGapChart` (Task 4); `CONTROL_GAP_QUESTIONS`, `scoreControlGap` (Task 1); the `/api/ai/controlgap` route (Task 3). Result shape from the route is `ControlGapResult` (`{ adoption, control, gap, band, weakestControl, diagnosis, topMove }`).
- Produces: the `/ai-control-gap` route. No exports consumed by later tasks.

- [ ] **Step 1: Write the server page**

```tsx
// app/ai-control-gap/page.tsx
import type { Metadata } from 'next'
import ControlGapClient from './ControlGapClient'

export const metadata: Metadata = {
  title: 'The AI Control Gap | Paul Falor',
  description:
    "The danger isn't the AI. It's the gap between how fast you adopt it and how fast you can control it. Locate your organization on the model in 90 seconds.",
  openGraph: {
    title: 'The AI Control Gap',
    description:
      'Adoption is outrunning control. See where your organization sits on the model, and the one move that closes the gap.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The AI Control Gap',
    description:
      'Adoption is outrunning control. See where your organization sits on the model.',
  },
}

export default function AiControlGapPage() {
  return <ControlGapClient />
}
```

- [ ] **Step 2: Write the client component**

```tsx
// app/ai-control-gap/ControlGapClient.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import ControlGapChart from '@/components/ControlGapChart'
import { CONTROL_GAP_QUESTIONS, scoreControlGap } from '@/lib/controlgap'

type Phase = 'intro' | 'quiz' | 'result'

interface Result {
  adoption: number
  control: number
  gap: number
  band: 'aligned' | 'widening' | 'critical'
  weakestControl: string
  diagnosis: string
  topMove: string
}

const BAND_COPY: Record<Result['band'], string> = {
  aligned: 'Aligned. Your control is keeping pace with adoption. Hold that discipline as you scale.',
  widening: 'Widening. Adoption is pulling ahead of your ability to govern it. This is the moment to close the distance.',
  critical: 'Critical. The gap is wide. Adoption has outrun control, and the exposure compounds with every new use.',
}

export default function ControlGapClient() {
  const [phase, setPhase] = useState<Phase>('intro')
  const [answers, setAnswers] = useState<number[]>(Array(CONTROL_GAP_QUESTIONS.length).fill(-1))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<Result | null>(null)

  const allAnswered = answers.every((a) => a >= 0)
  const preview = allAnswered ? scoreControlGap(answers) : null

  function setAnswer(qIdx: number, value: number) {
    setAnswers((prev) => prev.map((a, i) => (i === qIdx ? value : a)))
  }

  async function submit() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/ai/controlgap', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ answers }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Something went wrong.')
      }
      setResult(await res.json())
      setPhase('result')
    } catch (e) {
      // Graceful degradation: show the deterministic gap even if the AI is down.
      setError(e instanceof Error ? e.message : 'Something went wrong.')
      const s = scoreControlGap(answers)
      setResult({ ...s, diagnosis: '', topMove: '' })
      setPhase('result')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-slate-100">
      {/* Beat 1 — the model */}
      {phase === 'intro' && (
        <section className="space-y-8">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
              The framework
            </p>
            <h1 className="text-4xl font-bold leading-tight">The AI Control Gap</h1>
            <p className="text-lg text-slate-300">
              The danger isn&apos;t the AI. It&apos;s the gap between how fast you adopt it and how
              fast you can control it. Adoption climbs fast. Control climbs slowly. Everything that
              keeps a board up at night lives in the space between.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <ControlGapChart />
          </div>
          <button
            onClick={() => setPhase('quiz')}
            className="rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-slate-900 transition hover:bg-emerald-400"
          >
            Find your gap
          </button>
        </section>
      )}

      {/* Beat 2 — the mirror */}
      {phase === 'quiz' && (
        <section className="space-y-8">
          <h2 className="text-2xl font-bold">Locate your organization</h2>
          <ol className="space-y-8">
            {CONTROL_GAP_QUESTIONS.map((q, qi) => (
              <li key={qi} className="space-y-3">
                <p className="font-medium">
                  <span className="mr-2 text-xs uppercase tracking-wider text-slate-400">
                    {q.axis}
                  </span>
                  {q.text}
                </p>
                <div className="flex flex-col gap-2">
                  {q.options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setAnswer(qi, opt.value)}
                      className={`rounded-lg border px-4 py-2 text-left text-sm transition ${
                        answers[qi] === opt.value
                          ? 'border-emerald-400 bg-emerald-400/10'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ol>

          {preview && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <ControlGapChart adoption={preview.adoption} control={preview.control} animate={false} />
            </div>
          )}

          <button
            disabled={!allAnswered || loading}
            onClick={submit}
            className="rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-slate-900 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? 'Reading your gap...' : 'See my diagnosis'}
          </button>
        </section>
      )}

      {/* Beat 3 — the diagnosis */}
      {phase === 'result' && result && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <ControlGapChart adoption={result.adoption} control={result.control} />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-widest text-rose-300">
              Your control gap: {result.gap} of 6
            </p>
            <p className="text-lg text-slate-200">{BAND_COPY[result.band]}</p>
          </div>

          {result.diagnosis ? (
            <div className="space-y-4">
              <p className="text-slate-200">{result.diagnosis}</p>
              <div className="rounded-lg border-l-2 border-emerald-400 bg-white/5 px-5 py-4">
                <p className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
                  The first move
                </p>
                <p className="mt-1 text-slate-100">{result.topMove}</p>
              </div>
            </div>
          ) : (
            <p className="text-slate-400">
              Your widest exposure is here: {result.weakestControl}. The live diagnosis is
              unavailable right now, but the gap above is real. {error}
            </p>
          )}

          <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 p-6">
            <p className="text-slate-200">
              Want this as a board-ready briefing for your situation?
            </p>
            <Link
              href="/ai-tools"
              className="mt-3 inline-block rounded-lg bg-emerald-500 px-5 py-2.5 font-semibold text-slate-900 transition hover:bg-emerald-400"
            >
              Generate an executive briefing
            </Link>
          </div>

          <button
            onClick={() => {
              setAnswers(Array(CONTROL_GAP_QUESTIONS.length).fill(-1))
              setResult(null)
              setPhase('intro')
            }}
            className="text-sm text-slate-400 underline hover:text-slate-200"
          >
            Start over
          </button>
        </motion.section>
      )}
    </main>
  )
}
```

- [ ] **Step 3: Build and walk the full flow**

Run: `npm run build` then `npm run dev`.
Then in a browser at `localhost:42069/ai-control-gap`:
- Beat 1 renders the curve and the one-liner. "Find your gap" advances.
- Answer all six. The preview chart updates; "See my diagnosis" enables only when all six are set.
- Submit. The diagnosis renders in Paul's voice with no em dashes, the gap number matches `adoption - control`, and the briefing CTA links to `/ai-tools`.
- Confirm the all-low set (`[0,0,0,0,0,0]`) and all-high set (`[2,2,2,2,2,2]`) both read sensibly.

- [ ] **Step 4: Commit**

```bash
git add app/ai-control-gap/page.tsx app/ai-control-gap/ControlGapClient.tsx
git commit -m "feat: AI control gap page and interactive three-beat flow"
```

---

### Task 6: Discoverability — experiences entry + homepage teaser

**Files:**
- Modify: `lib/data.ts` (append to the `experiences` array)
- Modify: `app/ClientPage.tsx` (add a teaser band linking to `/ai-control-gap`)

**Interfaces:**
- Consumes: `ControlGapChart` (Task 4); the `/ai-control-gap` route (Task 5).
- Produces: nothing consumed downstream.

Note: confirm the exact homepage insertion point with Paul before placing the band (the spec left the slot open). Default below is a band directly above the Thought Leadership / Insights section.

- [ ] **Step 1: Add the experiences entry**

In `lib/data.ts`, append this object as the first item of the `experiences` array (so the signature framework leads the hub):

```ts
  {
    title: 'The AI Control Gap',
    description:
      "The danger isn't the AI. It's the gap between how fast you adopt it and how fast you can control it. Locate your organization on the model in 90 seconds.",
    href: '/ai-control-gap',
  },
```

- [ ] **Step 2: Add the homepage teaser band**

First read `app/ClientPage.tsx` to find the section ordering and the import block. Add the import:

```tsx
import Link from 'next/link'
import ControlGapChart from '@/components/ControlGapChart'
```

(If `Link` is already imported, do not duplicate it.)

Then insert this band immediately above the Thought Leadership / Insights section (match the existing section wrapper classes used elsewhere in the file; the block below is self-contained and uses neutral utility classes):

```tsx
<section id="control-gap" className="mx-auto max-w-5xl px-6 py-20">
  <div className="grid items-center gap-10 md:grid-cols-2">
    <div className="space-y-4">
      <p className="text-sm font-semibold uppercase tracking-widest text-emerald-500">
        The framework
      </p>
      <h2 className="text-3xl font-bold">The AI Control Gap</h2>
      <p className="text-lg text-slate-600 dark:text-slate-300">
        The danger isn&apos;t the AI. It&apos;s the gap between how fast you adopt it and how fast
        you can control it. See where your organization sits in 90 seconds.
      </p>
      <Link
        href="/ai-control-gap"
        className="inline-block rounded-lg bg-emerald-500 px-5 py-2.5 font-semibold text-slate-900 transition hover:bg-emerald-400"
      >
        Find your gap
      </Link>
    </div>
    <div className="rounded-xl border border-black/10 bg-white/5 p-6 dark:border-white/10">
      <ControlGapChart compact />
    </div>
  </div>
</section>
```

- [ ] **Step 3: Build and verify discoverability**

Run: `npm run build` then `npm run dev`.
- Homepage shows the teaser band; "Find your gap" navigates to `/ai-control-gap`.
- `/experiences` lists "The AI Control Gap" first.
- The command palette (open it on the homepage) includes the new entry, since it reads from the same `experiences` array.

- [ ] **Step 4: Commit**

```bash
git add lib/data.ts app/ClientPage.tsx
git commit -m "feat: surface the control gap on the homepage, experiences hub, and palette"
```

---

## Self-Review

**Spec coverage:**
- Named framework + one-liner → Tasks 1, 5 (Beat 1 copy). ✓
- Two-curve animated visual → Task 4, used in Task 5. ✓
- Six scored questions, three per axis → Task 1. ✓
- Their-own-gap mirror → Task 5 (preview + result charts driven by `scoreControlGap`). ✓
- AI diagnosis in Paul's voice, grounded, no em dashes → Task 2 (+ `deEmDash`). ✓
- Hardened route (rate limit, validation, 502) → Task 3. ✓
- Graceful degradation when AI is down → Task 5 `submit()` catch path + Task 3 502. ✓
- Handoff to briefing (`/ai-tools` interim) → Task 5 result CTA. ✓
- Discoverability (experiences array, command palette, homepage teaser) → Task 6. ✓
- Dedicated page `/ai-control-gap` → Task 5. ✓

**Placeholder scan:** No TBD/TODO in code steps. The only open decision (exact homepage slot) is flagged in Task 6 with a concrete default, not left blank.

**Type consistency:** `ControlGapScore` fields (`adoption`, `control`, `gap`, `band`, `weakestControl`) are defined in Task 1 and reused unchanged in Tasks 2, 5. `ControlGapResult` extends it with `diagnosis`, `topMove` (Task 2) and is the exact shape the route returns (Task 3) and the client `Result` type consumes (Task 5). The `band` union (`'aligned' | 'widening' | 'critical'`) is identical across Tasks 1, 2, 5. `validateAnswers` / `scoreControlGap` / `generateDiagnosis` signatures match their call sites.

**Notes for the implementer:** `app/ClientPage.tsx` section classes vary by site theme (light/dark). Task 6 Step 2 uses neutral utilities; if the file has a shared `<Section>` wrapper or consistent padding pattern, prefer it for visual consistency over the raw classes shown.
