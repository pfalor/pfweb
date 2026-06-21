import type { Metadata } from 'next'
import RedTeamClient from './RedTeamClient'

export const metadata: Metadata = {
  title: 'Red Team Your AI Policy | Paul Falor',
  description:
    'Paste your AI policy, a vendor\'s AI-safety claims, or a model card and get an instant red-team teardown against NIST AI RMF, the EU AI Act, and the OWASP LLM Top 10. Nothing is stored.',
  openGraph: {
    title: 'Red Team Your AI Policy',
    description:
      'Grade your AI policy against NIST AI RMF, the EU AI Act, and the OWASP LLM Top 10 in seconds.',
    images: ['/api/og/redteam'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Red Team Your AI Policy',
    description:
      'Grade your AI policy against NIST AI RMF, the EU AI Act, and the OWASP LLM Top 10 in seconds.',
    images: ['/api/og/redteam'],
  },
}

export default function RedTeamPage() {
  return <RedTeamClient />
}
