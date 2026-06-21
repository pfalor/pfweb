import { ImageResponse } from 'next/og'
import { decodePlaygroundParams } from '@/lib/playground-card'

export const runtime = 'edge'

const BG = '#0b1120'
const RED = '#f87171'
const GREEN = '#34d399'

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
        <div style={{ fontSize: 28, color: '#94a3b8', letterSpacing: 1 }}>PROMPT INJECTION PLAYGROUND</div>
        <div style={{ fontSize: 76, fontWeight: 700, marginTop: 24, maxWidth: 1040 }}>
          {'Can you jailbreak the AI?'}
        </div>
        <div style={{ fontSize: 32, color: '#94a3b8', marginTop: 16, maxWidth: 1000 }}>
          {'Attack two assistants side by side. One has defenses. One does not.'}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, color: '#94a3b8' }}>
        <div>{'An interactive demo by Paul Falor'}</div>
        <div>{'paulfalor.com/playground'}</div>
      </div>
    </div>
  )
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  if (searchParams.get('attempts') === null) {
    return new ImageResponse(<Cover />, { width: 1200, height: 630 })
  }
  const card = decodePlaygroundParams(searchParams)
  const vulnLine = card.crackedVulnerable
    ? `Cracked the vulnerable AI in ${card.attempts} ${card.attempts === 1 ? 'try' : 'tries'}`
    : `The vulnerable AI held after ${card.attempts} ${card.attempts === 1 ? 'try' : 'tries'}`
  const hardenedLine = card.hardenedHeld ? 'The hardened AI held' : 'The hardened AI was breached'
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
          <div style={{ fontSize: 28, color: '#94a3b8', letterSpacing: 1 }}>PROMPT INJECTION PLAYGROUND</div>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 28 }}>
            <div style={{ display: 'flex', fontSize: 40, color: card.crackedVulnerable ? RED : GREEN }}>
              {vulnLine}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 20 }}>
            <div style={{ display: 'flex', fontSize: 40, color: card.hardenedHeld ? GREEN : RED }}>
              {hardenedLine}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, color: '#94a3b8' }}>
          <div>{'Prompt Injection Playground, by Paul Falor'}</div>
          <div>{'paulfalor.com/playground'}</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
