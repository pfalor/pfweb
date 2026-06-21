// Pure encode/decode for the shareable playground result card. Shared by the
// result client (builds the link) and the next/og route (renders from it).
// No storage: all card data travels in the URL.

export interface PlaygroundCardData {
  attempts: number
  crackedVulnerable: boolean
  hardenedHeld: boolean
}

export function encodePlaygroundParams(card: PlaygroundCardData): string {
  const p = new URLSearchParams()
  p.set('attempts', String(Math.min(999, Math.max(0, Math.round(card.attempts)))))
  p.set('cracked', card.crackedVulnerable ? '1' : '0')
  p.set('held', card.hardenedHeld ? '1' : '0')
  return p.toString()
}

export function decodePlaygroundParams(params: URLSearchParams): PlaygroundCardData {
  const attempts = Math.min(999, Math.max(0, Math.round(Number(params.get('attempts')) || 0)))
  return {
    attempts,
    crackedVulnerable: params.get('cracked') === '1',
    hardenedHeld: params.get('held') === '1',
  }
}
