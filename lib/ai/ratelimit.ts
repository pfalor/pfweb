// ============================================================================
// BEST-EFFORT RATE LIMIT
// ============================================================================
// In-memory per-IP sliding window. Good enough for a personal-traffic site to
// blunt abuse and runaway cost; not durable across serverless instances. The
// Vercel AI Gateway provides the authoritative per-user/spend limits behind it.
// ============================================================================

const hits = new Map<string, number[]>()

export function rateLimit(
  key: string,
  opts?: { max?: number; windowMs?: number }
): { ok: boolean; retryAfterSec: number } {
  const windowMs = opts?.windowMs ?? 60_000
  const max = opts?.max ?? 12
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs)
  if (recent.length >= max) {
    const oldest = recent[0]
    return { ok: false, retryAfterSec: Math.ceil((windowMs - (now - oldest)) / 1000) }
  }
  recent.push(now)
  hits.set(key, recent)
  // Opportunistic cleanup to bound memory.
  if (hits.size > 5000) {
    hits.forEach((v, k) => {
      if (v.every((t) => now - t >= windowMs)) hits.delete(k)
    })
  }
  return { ok: true, retryAfterSec: 0 }
}
