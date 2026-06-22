import type { Metadata } from 'next'
import Link from 'next/link'
import { experiences } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Interactive AI Experiences | Paul Falor',
  description:
    'Hands-on tools for secure and responsible AI: jailbreak a hardened assistant, run an AI security incident from the executive chair, red-team your AI policy, and more.',
  openGraph: {
    title: 'Interactive AI Experiences | Paul Falor',
    description: 'Hands-on tools for secure and responsible AI.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Interactive AI Experiences | Paul Falor',
    description: 'Hands-on tools for secure and responsible AI.',
  },
}

export default function ExperiencesPage() {
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
          Back to home
        </Link>

        <header className="mb-12">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-medium uppercase tracking-wider mb-5">
            Security for AI
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-5 text-balance">
            Interactive AI Experiences
          </h1>
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
            Hands-on demonstrations of the work my practice does. Try to break a hardened AI, run an AI security incident from the executive chair, or grade your own AI policy. Each one is a real, working tool.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {experiences.map((exp) => (
            <Link
              key={exp.href}
              href={exp.href}
              className="block rounded-lg border border-slate-700/50 bg-slate-800/40 p-6 hover:border-accent/50 transition-colors duration-300"
            >
              <h2 className="text-xl font-semibold text-white">{exp.title}</h2>
              <p className="mt-2 text-slate-400">{exp.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm text-accent">
                Open
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
