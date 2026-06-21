'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Section, SectionTitle } from '@/components/ui/Section'
import { useResumeData } from '@/lib/DataContext'

const icons: { [key: string]: React.ReactElement } = {
  platform: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
    </svg>
  ),
  cloud: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
    </svg>
  ),
  lock: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
  network: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  ),
  // Security for AI — a chip/AI core protected by a shield
  'ai-shield': (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9.5 12a2.5 2.5 0 105 0 2.5 2.5 0 00-5 0zM12 9.5V8m0 8v-1.5m2.5-2.5H16m-8 0H9.5" />
    </svg>
  ),
  // AI for Security — radar sweep / active detection
  'ai-defense': (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 12a9 9 0 11-6.36-8.6M12 12l6-6M12 12a4 4 0 10-2.83-1.17" />
    </svg>
  ),
  // Data Protection — secured datastore
  data: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 7c0-1.66 3.58-3 8-3s8 1.34 8 3-3.58 3-8 3-8-1.34-8-3z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 7v5c0 1.66 3.58 3 8 3 .7 0 1.37-.03 2-.1M20 7v3" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M16 16.5a1.5 1.5 0 013 0V18m-4 0h5a1 1 0 011 1v2a1 1 0 01-1 1h-5a1 1 0 01-1-1v-2a1 1 0 011-1z" />
    </svg>
  ),
}

export function PracticeAreas() {
  const { practiceAreas } = useResumeData()
  const [expandedId, setExpandedId] = useState<string | null>(practiceAreas[0]?.id ?? null)

  return (
    <Section id="practice-areas">
      <SectionTitle subtitle="Where I help enterprises secure AI, defend with AI, and protect the data underneath">
        Practice Areas
      </SectionTitle>

      <div className="space-y-4">
        {practiceAreas.map((area, index) => {
          const isExpanded = expandedId === area.id
          const cta = (area as { cta?: { label: string; href: string } }).cta
          return (
            <motion.div
              key={area.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div
                className={`bg-slate-800/30 border rounded-xl overflow-hidden transition-all duration-300
                  ${isExpanded ? 'border-accent/30' : 'border-slate-700/50 hover:border-slate-600/50'}`}
              >
                {/* Header - always visible */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : area.id)}
                  className="w-full flex items-center gap-4 p-6 text-left group"
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300
                    ${isExpanded ? 'bg-accent/20 text-accent' : 'bg-slate-800/50 text-slate-400 group-hover:text-accent'}`}>
                    {icons[area.icon]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-white">{area.title}</h3>
                    <p className="text-sm text-slate-400 mt-1">{area.headline}</p>
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-slate-500 shrink-0"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </button>

                {/* Expandable content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-0">
                        <div className="border-t border-slate-700/50 pt-6">
                          {/* POV description */}
                          <p className="text-slate-300 leading-relaxed mb-6">
                            {area.description}
                          </p>

                          {/* Outcomes */}
                          <div>
                            <h4 className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">
                              Track Record
                            </h4>
                            <ul className="space-y-2">
                              {area.outcomes.map((outcome, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-slate-400">
                                  <svg className="w-4 h-4 text-accent shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                                  </svg>
                                  {outcome}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {cta && (
                            <Link
                              href={cta.href}
                              className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-lg bg-accent/10 border border-accent/30
                                       text-accent text-sm font-medium hover:bg-accent/20 transition-colors duration-200"
                            >
                              {cta.label}
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </Link>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )
        })}
      </div>
    </Section>
  )
}
