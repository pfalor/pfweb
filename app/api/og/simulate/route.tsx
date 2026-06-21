import { ImageResponse } from 'next/og'
import { decodeProfileParams } from '@/lib/simulator-card'

export const runtime = 'edge'

const BG = '#0b1120'
const ACCENT = '#34d399'

function Cover() {
  return (
    <div
      style={{
        width: '1200px',
        height: '630px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: BG,
        color: '#e2e8f0',
        padding: '64px',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 28, color: '#94a3b8', letterSpacing: 1 }}>IN THE CHAIR</div>
        <div style={{ fontSize: 76, fontWeight: 700, marginTop: 24, maxWidth: 1040 }}>
          {'Could you run the AI crisis?'}
        </div>
        <div style={{ fontSize: 32, color: '#94a3b8', marginTop: 16, maxWidth: 1000 }}>
          {'Take the executive seat in a live security incident. See how you lead.'}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, color: '#94a3b8' }}>
        <div>{'An interactive simulation by Paul Falor'}</div>
        <div>{'paulfalor.com/in-the-chair'}</div>
      </div>
    </div>
  )
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  if (searchParams.get('archetype') === null) {
    return new ImageResponse(<Cover />, { width: 1200, height: 630 })
  }
  const card = decodeProfileParams(searchParams)
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: BG,
          color: '#e2e8f0',
          padding: '64px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 26, color: '#94a3b8', letterSpacing: 1 }}>
            {`IN THE CHAIR / ${card.scenario}`}
          </div>
          <div style={{ fontSize: 72, fontWeight: 700, color: ACCENT, marginTop: 18 }}>
            {card.archetype}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {card.axes.map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', marginTop: 14 }}>
              <div style={{ display: 'flex', width: 520, fontSize: 28, color: '#cbd5e1' }}>{a.label}</div>
              <div style={{ display: 'flex', width: 360, height: 18, background: '#1e293b', borderRadius: 9 }}>
                <div style={{ display: 'flex', width: `${a.score * 3.6}px`, height: 18, background: ACCENT, borderRadius: 9 }} />
              </div>
              <div style={{ display: 'flex', fontSize: 26, color: '#94a3b8', marginLeft: 20 }}>{`${a.score}`}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, color: '#94a3b8' }}>
          <div>{'In the Chair, by Paul Falor'}</div>
          <div>{'paulfalor.com/in-the-chair'}</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
