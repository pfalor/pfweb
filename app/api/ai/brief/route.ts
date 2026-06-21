import { NextRequest, NextResponse } from 'next/server'
import { generateBriefing } from '@/lib/ai/tools'
import { rateLimit } from '@/lib/ai/ratelimit'

export const runtime = 'nodejs'
export const maxDuration = 45

const MAX_LEN = 120

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const limit = rateLimit(`brief:${ip}`)
  if (!limit.ok) {
    return NextResponse.json({ error: 'Too many requests. Please slow down.' }, { status: 429, headers: { 'retry-after': String(limit.retryAfterSec) } })
  }

  let body: { role?: string; industry?: string; concern?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const role = (body.role ?? '').trim().slice(0, MAX_LEN)
  const industry = (body.industry ?? '').trim().slice(0, MAX_LEN)
  const concern = (body.concern ?? '').trim().slice(0, 300)
  if (!role || !industry) {
    return NextResponse.json({ error: 'Role and industry are required.' }, { status: 400 })
  }

  try {
    const result = await generateBriefing({ role, industry, concern: concern || undefined })
    return NextResponse.json(result)
  } catch (err) {
    console.error('[ai/brief] error', err)
    return NextResponse.json({ error: 'The briefing generator is unavailable right now. Please try again.' }, { status: 502 })
  }
}
