import type { Metadata } from 'next'
import Link from 'next/link'
import { AgenticThreatLab } from '@/components/AgenticThreatLab'

export const metadata: Metadata = {
  title: 'Anatomy of an Agentic AI Attack | Paul Falor',
  description:
    'An interactive walkthrough of how agentic AI attacks unfold, and the controls that stop them. Grounded in the OWASP agentic threat taxonomy (T1–T15) and the OWASP Top 10 for Agentic Applications.',
  openGraph: {
    title: 'Anatomy of an Agentic AI Attack | Paul Falor',
    description:
      'Run a simulated agentic AI exploit step by step, then deploy the controls that break the chain. Grounded in OWASP.',
    url: 'https://paulfalor.com/agentic-ai-threats',
    type: 'article',
  },
}

export default function AgenticThreatsPage() {
  return (
    <main className="min-h-screen bg-primary-900 grid-bg">
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-12 md:py-20">
        <Link
          href="/#practice-areas"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-accent transition-colors duration-200 mb-10"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to practice
        </Link>

        <header className="mb-12">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-medium uppercase tracking-wider mb-5">
            Security for AI
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-5 text-balance">
            Anatomy of an Agentic AI Attack
          </h1>
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
            Agentic AI introduces a new attack surface: agents that remember, hold privileges, use tools, and talk to each other. Pick a threat, run the exploit step by step, then deploy the controls that break the chain. These are the threat models my practice helps clients defend against.
          </p>
        </header>

        <AgenticThreatLab />

        <section className="mt-16 pt-8 border-t border-slate-700/50">
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent/90 text-white font-medium rounded-lg transition-colors duration-300"
          >
            Discuss securing your AI agents
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </section>
      </div>
    </main>
  )
}
