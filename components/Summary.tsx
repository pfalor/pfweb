'use client'

import { motion } from 'framer-motion'
import { Section } from '@/components/ui/Section'
import { Badge } from '@/components/ui/Badge'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { useResumeData } from '@/lib/DataContext'

export function Summary() {
  const { personalInfo, credentials, stats } = useResumeData()

  return (
    <Section id="about" className="bg-slate-900/30">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Text content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Executive Summary
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed mb-8">
            {personalInfo.summary}
          </p>

          {/* Credential badges */}
          <div className="flex flex-wrap gap-3">
            {credentials.map((cred, index) => (
              <motion.div
                key={cred.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Badge variant={cred.type === 'award' ? 'accent' : 'default'}>
                  {cred.label}
                  {cred.subtitle && <span className="ml-1 text-slate-500">• {cred.subtitle}</span>}
                </Badge>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-6 text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                <AnimatedCounter
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
              </div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  )
}
