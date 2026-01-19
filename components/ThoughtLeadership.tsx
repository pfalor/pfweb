'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Section, SectionTitle } from '@/components/ui/Section'
import { Badge } from '@/components/ui/Badge'
import { thoughtLeadership } from '@/lib/data'

export function ThoughtLeadership() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In production, this would connect to an email service
    setSubmitted(true)
    setEmail('')
  }

  return (
    <Section id="thought-leadership" className="bg-slate-900/30">
      <SectionTitle subtitle="Insights on AI, security, and digital transformation">
        Thought Leadership
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

      {/* Email signup */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-xl mx-auto text-center"
      >
        <h3 className="text-xl font-semibold text-white mb-4">
          Get notified when new content is published
        </h3>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-6 py-4 bg-accent/20 border border-accent/30 rounded-lg text-accent"
          >
            Thanks! You&apos;ll be notified when new content is available.
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg
                       text-white placeholder:text-slate-500 focus:border-accent/50 focus:outline-none
                       transition-colors"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-accent hover:bg-accent/90 text-white font-medium rounded-lg
                       transition-colors duration-300"
            >
              Notify Me
            </button>
          </form>
        )}
      </motion.div>
    </Section>
  )
}
