// Pure encode/decode for the shareable leadership-profile card. Shared by the
// result client (builds the link) and the next/og route (renders from it).
// No storage: all card data travels in the URL.

export interface ProfileAxis {
  label: string
  score: number
}

export interface ProfileCardData {
  scenario: string
  archetype: string
  axes: ProfileAxis[]
}

function clampScore(raw: string): number {
  return Math.min(100, Math.max(0, Math.round(Number(raw) || 0)))
}

export function encodeProfileParams(card: ProfileCardData): string {
  const p = new URLSearchParams()
  p.set('scenario', card.scenario.slice(0, 80))
  p.set('archetype', card.archetype.slice(0, 60))
  card.axes.slice(0, 4).forEach((a) => {
    p.append('axis', `${a.label.slice(0, 40)}:${Math.min(100, Math.max(0, Math.round(a.score)))}`)
  })
  return p.toString()
}

export function decodeProfileParams(params: URLSearchParams): ProfileCardData {
  const scenario = (params.get('scenario') ?? '').slice(0, 80)
  const archetype = (params.get('archetype') ?? '').slice(0, 60)
  const axes: ProfileAxis[] = params
    .getAll('axis')
    .slice(0, 4)
    .map((raw) => {
      // Split on the LAST colon so labels may themselves contain a colon.
      const idx = raw.lastIndexOf(':')
      const label = idx === -1 ? raw : raw.slice(0, idx)
      const score = idx === -1 ? 0 : clampScore(raw.slice(idx + 1))
      return { label: label.slice(0, 40), score }
    })
  return { scenario, archetype, axes }
}
