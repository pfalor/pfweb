import { NextRequest, NextResponse } from 'next/server'
import { askAdvisor, type ChatTurn } from '@/lib/ai/advisor'
import { detectInjection, detectPii } from '@/lib/ai/guardrails'
import { rateLimit } from '@/lib/ai/ratelimit'

export const runtime = 'nodejs'
export const maxDuration = 30

const MAX_MESSAGE_LEN = 1000

export async function POST(req: NextRequest) {
  // Rate limit by client IP (best-effort).
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const limit = rateLimit(ip)
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many requests. Please slow down.' },
      { status: 429, headers: { 'retry-after': String(limit.retryAfterSec) } }
    )
  }

  let body: { message?: string; history?: ChatTurn[]; redTeam?: boolean }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const message = (body.message ?? '').trim()
  if (!message) {
    return NextResponse.json({ error: 'Empty message.' }, { status: 400 })
  }
  if (message.length > MAX_MESSAGE_LEN) {
    return NextResponse.json(
      { error: `Message too long (max ${MAX_MESSAGE_LEN} characters).` },
      { status: 400 }
    )
  }

  // Deterministic input guardrails — power the transparency panel.
  const injection = detectInjection(message)
  const pii = detectPii(message)

  try {
    const result = await askAdvisor({
      message,
      history: Array.isArray(body.history) ? body.history : [],
      redTeam: Boolean(body.redTeam),
    })

    return NextResponse.json({
      answer: result.answer,
      citations: result.citations,
      onScope: result.onScope,
      model: result.model,
      routedReason: result.routedReason,
      safety: {
        injectionDetected: injection.detected,
        attackType: injection.attackType,
        piiFound: pii.found,
        piiTypes: pii.types,
      },
    })
  } catch (err) {
    console.error('[ai/chat] error', err)
    return NextResponse.json(
      { error: 'The assistant is unavailable right now. Please try again.' },
      { status: 502 }
    )
  }
}
