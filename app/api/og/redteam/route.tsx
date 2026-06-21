import { ImageResponse } from 'next/og'
import { decodeCardParams } from '@/lib/redteam-card'

export const runtime = 'edge'

const BAND_COLOR: Record<string, string> = {
  Emerging: '#f87171',
  Developing: '#fbbf24',
  Strong: '#34d399',
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const card = decodeCardParams(searchParams)
  const accent = BAND_COLOR[card.band]

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0b1120',
          color: '#e2e8f0',
          padding: '64px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 28, color: '#94a3b8', letterSpacing: 1 }}>
            RED TEAM YOUR AI POLICY
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 24 }}>
            <div style={{ fontSize: 96, fontWeight: 700, color: accent }}>{card.band}</div>
            <div style={{ fontSize: 48, color: '#64748b', marginLeft: 32 }}>
              {card.score}/100
            </div>
          </div>
          <div style={{ fontSize: 34, marginTop: 16, maxWidth: 1000 }}>{card.verdict}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {card.gaps.map((g, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', fontSize: 26, marginTop: 8 }}>
              <div style={{ color: accent, marginRight: 12 }}>•</div>
              <div style={{ color: '#cbd5e1' }}>{g}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, color: '#94a3b8' }}>
          <div>Analyzed by Paul Falor's AI policy red-team</div>
          <div>paulfalor.com/red-team</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
