'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Section, SectionTitle } from '@/components/ui/Section'
import { Badge } from '@/components/ui/Badge'
import { projects } from '@/lib/data'

export function Projects() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setEmail('')
  }

  return (
    <Section id="projects">
      <SectionTitle subtitle="Personal builds exploring AI, security, and automation">
        Projects & Builds
      </SectionTitle>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {projects.map((project, index) => (
          <motion.div
            key={project.title}
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

              {/* Project icon */}
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-white mb-2">{project.title}</h3>
              <p className="text-sm text-slate-400 mb-4">{project.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="outline" size="sm">{tag}</Badge>
                ))}
              </div>

              {/* Decorative gradient */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accent/10 to-transparent rounded-bl-full" />
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
          Interested in these projects?
        </h3>
        <p className="text-slate-400 mb-6">
          Sign up to be notified when projects are released and get early access.
        </p>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-6 py-4 bg-accent/20 border border-accent/30 rounded-lg text-accent"
          >
            Awesome! You&apos;ll be first to know when projects launch.
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
              Get Updates
            </button>
          </form>
        )}
      </motion.div>
    </Section>
  )
}
