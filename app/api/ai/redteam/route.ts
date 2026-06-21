import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/ai/ratelimit'
import { detectInjection, detectPii } from '@/lib/ai/guardrails'
import { validateDocument, truncateDocument, analyzePolicy } from '@/lib/ai/redteam'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const limit = rateLimit(ip)
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many requests. Please slow down.' },
      { status: 429, headers: { 'retry-after': String(limit.retryAfterSec) } }
    )
  }

  let body: { document?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const valid = validateDocument(body.document)
  if (!valid.ok) {
    return NextResponse.json({ error: valid.error }, { status: 400 })
  }

  const { text, truncated } = truncateDocument(valid.document)

  // Deterministic checks: PII warning reinforces the privacy promise; injection
  // is informational only (the prompt already treats the doc as untrusted data).
  const pii = detectPii(text)
  const injection = detectInjection(text)

  try {
    const { result, model } = await analyzePolicy(text)
    return NextResponse.json({
      result,
      model,
      truncated,
      pii: { found: pii.found, types: pii.types },
      injectionNoted: injection.detected,
    })
  } catch (err) {
    console.error('[ai/redteam] error', err)
    return NextResponse.json(
      { error: 'Analysis is unavailable right now. Please try again.' },
      { status: 502 }
    )
  }
}
