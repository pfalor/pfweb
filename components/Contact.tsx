'use client'

import { motion } from 'framer-motion'
import { Section, SectionTitle } from '@/components/ui/Section'
import { useResumeData } from '@/lib/DataContext'

export function Contact() {
  const { personalInfo } = useResumeData()

  return (
    <Section id="contact">
      <SectionTitle subtitle="Let's connect and explore opportunities">
        Get In Touch
      </SectionTitle>

      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 md:p-12"
        >
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact info */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>

              <div className="space-y-6">
                {/* Email */}
                <motion.a
                  href={`mailto:${personalInfo.email}`}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center
                                group-hover:bg-accent/20 transition-colors">
                    <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Email</p>
                    <p className="text-white group-hover:text-accent transition-colors">
                      {personalInfo.email}
                    </p>
                  </div>
                </motion.a>

                {/* LinkedIn */}
                <motion.a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center
                                group-hover:bg-accent/20 transition-colors">
                    <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">LinkedIn</p>
                    <p className="text-white group-hover:text-accent transition-colors">
                      Connect with me
                    </p>
                  </div>
                </motion.a>

                {/* Location */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Location</p>
                    <p className="text-white">{personalInfo.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick message */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Quick Connect</h3>
              <p className="text-slate-400 mb-6">
                Interested in discussing technology leadership, digital transformation,
                or cybersecurity strategy? I&apos;d love to connect.
              </p>

              <div className="space-y-4">
                <motion.a
                  href={`mailto:${personalInfo.email}?subject=Hello from paulfalor.com`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="block w-full px-6 py-4 bg-accent hover:bg-accent/90 text-white font-medium
                           rounded-lg text-center transition-colors duration-300"
                >
                  Send an Email
                </motion.a>

                <motion.a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="block w-full px-6 py-4 bg-slate-700/50 hover:bg-slate-700 text-white font-medium
                           rounded-lg text-center transition-colors duration-300 border border-slate-600/50"
                >
                  Connect on LinkedIn
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center text-slate-500 text-sm"
        >
          <p>&copy; {new Date().getFullYear()} Paul Falor. All rights reserved.</p>
          <p className="mt-2 font-mono text-xs">
            Built with Next.js, Tailwind CSS, and Framer Motion
          </p>
        </motion.footer>
      </div>
    </Section>
  )
}
