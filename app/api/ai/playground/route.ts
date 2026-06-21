import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/ai/ratelimit'
import { detectInjection } from '@/lib/ai/guardrails'
import { validatePlaygroundRequest, attackVulnerable, attackHardened } from '@/lib/ai/playground'

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

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const valid = validatePlaygroundRequest(body)
  if (!valid.ok) {
    return NextResponse.json({ error: valid.error }, { status: 400 })
  }

  try {
    const [vulnerable, hardened] = await Promise.all([
      attackVulnerable(valid.message, valid.vulnerableHistory),
      attackHardened(valid.message, valid.hardenedHistory),
    ])
    const injection = detectInjection(valid.message)
    return NextResponse.json({
      vulnerable,
      hardened,
      injection: { detected: injection.detected, attackType: injection.attackType },
    })
  } catch (err) {
    console.error('[ai/playground] error', err)
    return NextResponse.json(
      { error: 'The playground is unavailable right now. Please try again.' },
      { status: 502 }
    )
  }
}
