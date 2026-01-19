'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Section, SectionTitle } from '@/components/ui/Section'
import { Badge } from '@/components/ui/Badge'
import { useResumeData } from '@/lib/DataContext'

export function Timeline() {
  const { experience } = useResumeData()
  const [expandedId, setExpandedId] = useState<number | null>(null)

  return (
    <Section id="experience">
      <SectionTitle subtitle="A track record of technology leadership and transformation">
        Career Timeline
      </SectionTitle>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-0 md:left-1/2 transform md:-translate-x-px top-0 bottom-0 w-px bg-gradient-to-b from-accent via-slate-600 to-slate-800" />

        {/* Experience items */}
        <div className="space-y-12">
          {experience.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative flex items-start gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
            >
              {/* Timeline dot */}
              <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-accent border-4 border-primary-900 z-10" />

              {/* Content card */}
              <div className={`ml-8 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setExpandedId(expandedId === job.id ? null : job.id)}
                  className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 cursor-pointer
                            hover:border-accent/30 transition-all duration-300"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">{job.company}</h3>
                      <p className="text-accent font-medium">{job.role}</p>
                    </div>
                    <Badge variant="outline" size="sm">
                      {job.period}
                    </Badge>
                  </div>

                  {/* Location */}
                  <p className="text-sm text-slate-500 mb-4 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.location}
                  </p>

                  {/* Metrics preview */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.metrics.slice(0, 3).map((metric) => (
                      <span
                        key={metric.label}
                        className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-md font-mono"
                      >
                        {metric.value} {metric.label}
                      </span>
                    ))}
                  </div>

                  {/* Expand indicator */}
                  <div className="flex items-center text-sm text-slate-500">
                    <motion.span
                      animate={{ rotate: expandedId === job.id ? 180 : 0 }}
                      className="mr-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </motion.span>
                    {expandedId === job.id ? 'Show less' : 'Show details'}
                  </div>

                  {/* Expanded content */}
                  <AnimatePresence>
                    {expandedId === job.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 mt-4 border-t border-slate-700/50">
                          <h4 className="text-sm font-semibold text-white mb-3">Key Achievements</h4>
                          <ul className="space-y-2">
                            {job.highlights.map((highlight, i) => (
                              <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-start gap-2 text-sm text-slate-400"
                              >
                                <span className="text-accent mt-1">•</span>
                                {highlight}
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  )
}
