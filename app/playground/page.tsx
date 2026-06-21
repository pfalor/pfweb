import type { Metadata } from 'next'
import {
  STARTER_ATTACKS,
  redactSecret,
  vulnerableSystemPrompt,
  hardenedSystemPrompt,
  OUTPUT_BLOCK_MESSAGE,
} from '@/lib/ai/playground'
import { injectionPatterns } from '@/lib/ai/guardrails'
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

const recipe = {
  framing:
    "The secret lives in the prompt on purpose. That is the real-world failure: anything in a model's context, including API keys, hidden instructions, or other users' data, can be extracted unless you add controls. Both bots below hold the same secret in the same place. The only difference is the defenses. Here is exactly how each one is built.",
  vulnerablePrompt: redactSecret(vulnerableSystemPrompt()),
  hardenedPrompt: redactSecret(hardenedSystemPrompt()),
  injectionPatterns: injectionPatterns(),
  outputFilterNote:
    'Even if the model slips, the reply is scanned for the secret (normalized for case, spacing, and light obfuscation) and replaced before it leaves the server. It is deterministic, so no clever prompt can defeat it.',
  outputBlockMessage: OUTPUT_BLOCK_MESSAGE,
  transparencyNote:
    'Showing this recipe does not weaken the hardened bot. The only protected value is fake, the bots have no tools or real data, and the output filter is deterministic.',
}

export default function PlaygroundPage() {
  return <PlaygroundClient starterAttacks={STARTER_ATTACKS} recipe={recipe} />
}
