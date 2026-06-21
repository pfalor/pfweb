import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/ai/ratelimit'
import {
  validateSimRequest,
  isFinalTurn,
  generateBeat,
  generateResult,
  SIM_DEPTH,
} from '@/lib/ai/simulator'

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

  const valid = validateSimRequest(body)
  if (!valid.ok) {
    return NextResponse.json({ error: valid.error }, { status: 400 })
  }

  try {
    if (isFinalTurn(valid.history)) {
      const resultLimit = rateLimit(`sim-result:${ip}`, { max: 5 })
      if (!resultLimit.ok) {
        return NextResponse.json(
          { error: 'Too many results requested. Please slow down.' },
          { status: 429, headers: { 'retry-after': String(resultLimit.retryAfterSec) } }
        )
      }
      const { result, model } = await generateResult(valid.scenarioId, valid.history)
      return NextResponse.json({ kind: 'result', result, model })
    }
    const { beat, model } = await generateBeat(valid.scenarioId, valid.history)
    return NextResponse.json({
      kind: 'beat',
      beat,
      model,
      turn: valid.history.length + 1,
      total: SIM_DEPTH,
    })
  } catch (err) {
    console.error('[ai/simulate] error', err)
    return NextResponse.json(
      { error: 'The simulator is unavailable right now. Please try again.' },
      { status: 502 }
    )
  }
}
