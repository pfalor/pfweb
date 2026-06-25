// app/ai-control-gap/page.tsx
import type { Metadata } from 'next'
import ControlGapClient from './ControlGapClient'

export const metadata: Metadata = {
  title: 'The AI Control Gap | Paul Falor',
  description:
    "The danger isn't the AI. It's the gap between how fast you adopt it and how fast you can control it. Locate your organization on the model in 90 seconds.",
  openGraph: {
    title: 'The AI Control Gap',
    description:
      'Adoption is outrunning control. See where your organization sits on the model, and the one move that closes the gap.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The AI Control Gap',
    description:
      'Adoption is outrunning control. See where your organization sits on the model.',
  },
}

export default function AiControlGapPage() {
  return <ControlGapClient />
}
