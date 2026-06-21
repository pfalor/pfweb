import type { Metadata } from 'next'
import RedTeamClient from './RedTeamClient'

export const metadata: Metadata = {
  title: 'Red Team Your AI Policy | Paul Falor',
  description:
    'Paste your AI policy, a vendor\'s AI-safety claims, or a model card and get an instant red-team teardown against NIST AI RMF, the EU AI Act, and the OWASP LLM Top 10. Nothing is stored.',
}

export default function RedTeamPage() {
  return <RedTeamClient />
}
