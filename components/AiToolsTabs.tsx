'use client'

import { useState } from 'react'
import { AiReadinessAssessment } from '@/components/AiReadinessAssessment'
import { ExecBriefingGenerator } from '@/components/ExecBriefingGenerator'

const TABS = [
  { id: 'assessment', label: 'AI Readiness Assessment', blurb: 'Six questions across the three focus areas → a tailored maturity readout.' },
  { id: 'briefing', label: 'Executive Briefing', blurb: 'Your role and industry → a one-page AI-risk briefing.' },
] as const

export function AiToolsTabs() {
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('assessment')

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors duration-200
              ${tab === t.id ? 'bg-accent/15 border-accent/50 text-accent' : 'bg-slate-800/40 border-slate-700/50 text-slate-300 hover:border-slate-600'}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <p className="text-sm text-slate-500 mb-8">{TABS.find((t) => t.id === tab)!.blurb}</p>

      <div className="bg-slate-900/30 border border-slate-700/50 rounded-2xl p-6 md:p-8">
        {tab === 'assessment' ? <AiReadinessAssessment /> : <ExecBriefingGenerator />}
      </div>
    </div>
  )
}
