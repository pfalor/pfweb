import { NextRequest, NextResponse } from 'next/server'
import { generateAssessment } from '@/lib/ai/tools'
import { ASSESSMENT_QUESTIONS } from '@/lib/assessment'
import { rateLimit } from '@/lib/ai/ratelimit'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const limit = rateLimit(`assess:${ip}`)
  if (!limit.ok) {
    return NextResponse.json({ error: 'Too many requests. Please slow down.' }, { status: 429, headers: { 'retry-after': String(limit.retryAfterSec) } })
  }

  let body: { answers?: number[] }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const answers = body.answers
  if (!Array.isArray(answers) || answers.length !== ASSESSMENT_QUESTIONS.length || !answers.every((a) => a >= 1 && a <= 4)) {
    return NextResponse.json({ error: 'Please answer all questions.' }, { status: 400 })
  }

  try {
    const result = await generateAssessment(answers)
    return NextResponse.json(result)
  } catch (err) {
    console.error('[ai/assess] error', err)
    return NextResponse.json({ error: 'The assessment is unavailable right now. Please try again.' }, { status: 502 })
  }
}
