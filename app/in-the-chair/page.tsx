import type { Metadata } from 'next'
import { listScenarios } from '@/lib/ai/simulator'
import InTheChairClient from './InTheChairClient'

export const metadata: Metadata = {
  title: 'In the Chair | Paul Falor',
  description:
    'Take the executive seat in a live AI security incident. Make the calls, get a leadership profile, and see how Paul Falor would have played it.',
  openGraph: {
    title: 'In the Chair',
    description: 'Could you run the AI crisis? Take the executive seat and see how you lead.',
    images: ['/api/og/simulate'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'In the Chair',
    description: 'Could you run the AI crisis? Take the executive seat and see how you lead.',
    images: ['/api/og/simulate'],
  },
}

export default function InTheChairPage() {
  return <InTheChairClient scenarios={listScenarios()} />
}
