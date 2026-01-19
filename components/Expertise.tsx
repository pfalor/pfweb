'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Section, SectionTitle } from '@/components/ui/Section'
import { Badge } from '@/components/ui/Badge'
import { useResumeData } from '@/lib/DataContext'

const icons: { [key: string]: React.ReactElement } = {
  shield: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  transform: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  brain: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  merge: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  ),
  users: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
}

export function Expertise() {
  const { expertise } = useResumeData()
  const [activeCategory, setActiveCategory] = useState<string>('security')
  const categories = Object.entries(expertise)

  return (
    <Section id="expertise">
      <SectionTitle subtitle="Deep expertise across security, technology, and leadership domains">
        Areas of Expertise
      </SectionTitle>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Category selector - sidebar on large screens */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-2">
            {categories.map(([key, category]) => (
              <motion.button
                key={key}
                onClick={() => setActiveCategory(key)}
                whileHover={{ x: 4 }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-300
                  ${activeCategory === key
                    ? 'bg-accent/20 border border-accent/30 text-white'
                    : 'bg-slate-800/30 border border-transparent text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
              >
                <span className={`${activeCategory === key ? 'text-accent' : 'text-slate-500'}`}>
                  {icons[category.icon]}
                </span>
                <span className="font-medium">{category.title}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Skills display */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {categories.map(([key, category]) => (
              activeCategory === key && (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-8"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-accent">{icons[category.icon]}</span>
                    <h3 className="text-2xl font-bold text-white">{category.title}</h3>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {category.skills.map((skill, index) => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                      >
                        <Badge variant="accent">{skill}</Badge>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>
      </div>
    </Section>
  )
}
