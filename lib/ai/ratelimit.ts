// ============================================================================
// BEST-EFFORT RATE LIMIT
// ============================================================================
// In-memory per-IP sliding window. Good enough for a personal-traffic site to
// blunt abuse and runaway cost; not durable across serverless instances. The
// Vercel AI Gateway provides the authoritative per-user/spend limits behind it.
// ============================================================================

const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 12

const hits = new Map<string, number[]>()

export function rateLimit(key: string): { ok: boolean; retryAfterSec: number } {
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS)
  if (recent.length >= MAX_PER_WINDOW) {
    const oldest = recent[0]
    return { ok: false, retryAfterSec: Math.ceil((WINDOW_MS - (now - oldest)) / 1000) }
  }
  recent.push(now)
  hits.set(key, recent)
  // Opportunistic cleanup to bound memory.
  if (hits.size > 5000) {
    hits.forEach((v, k) => {
      if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k)
    })
  }
  return { ok: true, retryAfterSec: 0 }
}
