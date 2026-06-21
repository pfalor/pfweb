// Pure encode/decode for the shareable result card. Shared by the result page
// (builds the link) and the next/og route (renders from it). No storage: all
// card data travels in the URL.

export interface CardData {
  band: 'Emerging' | 'Developing' | 'Strong'
  score: number
  verdict: string
  gaps: string[]
}

const BANDS: CardData['band'][] = ['Emerging', 'Developing', 'Strong']

export function encodeCardParams(card: CardData): string {
  const p = new URLSearchParams()
  p.set('band', card.band)
  p.set('score', String(card.score))
  p.set('verdict', card.verdict.slice(0, 160))
  card.gaps.slice(0, 3).forEach((g) => p.append('gap', g.slice(0, 90)))
  return p.toString()
}

export function decodeCardParams(params: URLSearchParams): CardData {
  const rawBand = params.get('band') as CardData['band'] | null
  const band = rawBand && BANDS.includes(rawBand) ? rawBand : 'Emerging'
  const score = Math.min(100, Math.max(0, Math.round(Number(params.get('score')) || 0)))
  const verdict = params.get('verdict') ?? ''
  const gaps = params.getAll('gap').slice(0, 3)
  return { band, score, verdict, gaps }
}
