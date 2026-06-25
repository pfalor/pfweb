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
