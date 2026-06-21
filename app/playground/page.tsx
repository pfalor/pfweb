import type { Metadata } from 'next'
import { STARTER_ATTACKS } from '@/lib/ai/playground'
import PlaygroundClient from './PlaygroundClient'

export const metadata: Metadata = {
  title: 'Prompt Injection Playground | Paul Falor',
  description:
    'Try to jailbreak two AI assistants side by side. One has no defenses, one is hardened with real layered controls. See which layer stops each attack. Nothing real is exposed.',
  openGraph: {
    title: 'Prompt Injection Playground',
    description: 'Can you jailbreak the AI? Attack two assistants side by side. One has defenses, one does not.',
    images: ['/api/og/playground'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prompt Injection Playground',
    description: 'Can you jailbreak the AI? Attack two assistants side by side. One has defenses, one does not.',
    images: ['/api/og/playground'],
  },
}

export default function PlaygroundPage() {
  return <PlaygroundClient starterAttacks={STARTER_ATTACKS} />
}
