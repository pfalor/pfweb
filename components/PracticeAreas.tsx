'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
}

export function PracticeAreas() {
  const { practiceAreas } = useResumeData()
  const [expandedId, setExpandedId] = useState<string | null>(practiceAreas[0]?.id ?? null)

  return (
    <Section id="practice-areas">
      <SectionTitle subtitle="Secure Digital Core — the cybersecurity domains where I help enterprises build resilience">
        Practice Areas
      </SectionTitle>

      <div className="space-y-4">
        {practiceAreas.map((area, index) => {
          const isExpanded = expandedId === area.id
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
