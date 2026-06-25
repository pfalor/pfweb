'use client'

import Link from 'next/link'
import { Section } from '@/components/ui/Section'
import ControlGapChart from '@/components/ControlGapChart'

export function ControlGapTeaser() {
  return (
    <Section id="control-gap">
      <div className="grid items-center gap-10 md:grid-cols-2">
        {/* Copy */}
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            The framework
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">The AI Control Gap</h2>
          <p className="text-lg text-slate-300 leading-relaxed">
            The danger isn&apos;t the AI. It&apos;s the gap between how fast you adopt it and how
            fast you can control it. See where your organization sits in 90 seconds.
          </p>
          <Link
            href="/ai-control-gap"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent hover:bg-accent/90 font-semibold text-white transition-colors duration-200"
          >
            Find your gap
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Compact chart */}
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-6">
          <ControlGapChart compact />
        </div>
      </div>
    </Section>
  )
}
