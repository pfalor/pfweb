import type { Metadata } from 'next'
import Link from 'next/link'
import { AiToolsTabs } from '@/components/AiToolsTabs'

export const metadata: Metadata = {
  title: 'Interactive AI Tools | Paul Falor',
  description:
    'Two quick, AI-powered tools: an AI security readiness assessment and a tailored executive briefing generator, grounded in Paul Falor’s Secure, Responsible AI & Data Protection practice.',
  openGraph: {
    title: 'Interactive AI Tools | Paul Falor',
    description: 'Gauge your AI-security maturity, or generate a tailored executive AI-risk briefing.',
    url: 'https://paulfalor.com/ai-tools',
    type: 'website',
  },
}

export default function AiToolsPage() {
  return (
    <main className="min-h-screen bg-primary-900 grid-bg">
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-12 md:py-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-accent transition-colors duration-200 mb-10"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Home
        </Link>

        <header className="mb-12">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-medium uppercase tracking-wider mb-5">
            Interactive
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-5 text-balance">
            AI Tools
          </h1>
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
            Two quick ways to get something useful in two minutes. Both run on a cost-aware model and use only what you enter to generate the result, which is never stored.
          </p>
        </header>

        <AiToolsTabs />
      </div>
    </main>
  )
}
