'use client'

import { motion } from 'framer-motion'
import { Section, SectionTitle } from '@/components/ui/Section'
import { Badge } from '@/components/ui/Badge'
import { thoughtLeadership } from '@/lib/data'

export function ThoughtLeadership() {
  return (
    <Section id="thought-leadership" className="bg-slate-900/30">
      <SectionTitle subtitle="Perspectives on cybersecurity strategy, architecture, and operations">
        Blog
      </SectionTitle>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {thoughtLeadership.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative group"
          >
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 h-full
                          relative overflow-hidden">
              {/* Coming soon overlay */}
              <div className="absolute inset-0 bg-primary-900/80 backdrop-blur-sm flex items-center justify-center
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <span className="px-4 py-2 bg-accent/20 border border-accent/30 rounded-full text-accent font-medium">
                  Coming Soon
                </span>
              </div>

              {/* Content */}
              <Badge variant="outline" size="sm">{item.category}</Badge>
              <h3 className="text-lg font-semibold text-white mt-4 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-400">{item.description}</p>

              {/* Decorative line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent/50 to-transparent
                            transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Link to blog */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <a
          href="https://blog.paulfalor.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent/90 text-white font-medium rounded-lg
                   transition-colors duration-300"
        >
          Read the Blog
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </motion.div>
    </Section>
  )
}
