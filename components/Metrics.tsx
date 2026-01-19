'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Section, SectionTitle } from '@/components/ui/Section'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { useResumeData } from '@/lib/DataContext'

export function Metrics() {
  const { metrics } = useResumeData()
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <Section id="impact" className="bg-slate-900/50">
      <SectionTitle subtitle="Quantifiable results from technology leadership initiatives">
        Impact Metrics
      </SectionTitle>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onMouseEnter={() => setHoveredId(metric.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="relative group"
          >
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-8
                          hover:border-accent/30 transition-all duration-300 h-full">
              {/* Category tag */}
              <span className="inline-block px-2 py-1 text-xs font-mono text-accent/70 bg-accent/10 rounded mb-4">
                {metric.category}
              </span>

              {/* Main metric */}
              <div className="mb-4">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  <AnimatedCounter
                    value={metric.value}
                    prefix={metric.prefix}
                    suffix={metric.suffix}
                    duration={1.5}
                  />
                </div>
                <h3 className="text-lg font-semibold text-slate-300">{metric.label}</h3>
              </div>

              {/* Description on hover */}
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{
                  opacity: hoveredId === metric.id ? 1 : 0.7,
                  height: 'auto'
                }}
                className="text-sm text-slate-400 leading-relaxed"
              >
                {metric.description}
              </motion.p>

              {/* Decorative gradient */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent/5 to-transparent
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom decoration */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-12 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent"
      />
    </Section>
  )
}
