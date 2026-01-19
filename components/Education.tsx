'use client'

import { motion } from 'framer-motion'
import { Section, SectionTitle } from '@/components/ui/Section'
import { Badge } from '@/components/ui/Badge'
import { useResumeData } from '@/lib/DataContext'

export function Education() {
  const { education, credentials } = useResumeData()
  const awards = credentials.filter(c => c.type === 'award')
  const certifications = credentials.filter(c => c.type === 'certification')

  return (
    <Section id="education" className="bg-slate-900/30">
      <SectionTitle subtitle="Academic foundation and professional recognition">
        Education & Recognition
      </SectionTitle>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Education */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-1">{education[0].school}</h3>
              <p className="text-slate-400">{education[0].location}</p>
            </div>
          </div>

          <div className="space-y-6">
            {education.map((edu, index) => (
              <motion.div
                key={edu.degree}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={index > 0 ? 'pt-6 border-t border-slate-700/50' : ''}
              >
                <p className="text-lg text-white font-medium">{edu.degree}</p>
                <p className="text-accent">{edu.major}</p>
                <div className="flex items-center gap-4 mt-3">
                  <Badge variant="outline">{edu.year}</Badge>
                  {edu.gpa && (
                    <div className="px-3 py-1 bg-accent/20 border border-accent/30 rounded-lg">
                      <span className="text-lg font-bold text-accent">{edu.gpa}</span>
                      <span className="text-sm text-slate-400 ml-1">GPA</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Awards & Certifications */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Awards & Recognition</h3>

          {/* Awards */}
          {awards.map((award, index) => (
            <motion.div
              key={award.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              className="p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-lg mb-4"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">🏆</div>
                <div>
                  <p className="font-semibold text-amber-400">{award.label}</p>
                  {award.subtitle && (
                    <p className="text-sm text-slate-400">{award.subtitle}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Certifications (if any) */}
          {certifications.length > 0 && (
            <>
              <h4 className="text-lg font-semibold text-white mt-6 mb-4">Certifications</h4>
              <div className="space-y-3">
                {certifications.map((cert, index) => (
                  <motion.div
                    key={cert.label}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-white">{cert.label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {/* Placeholder message if no certifications */}
          {certifications.length === 0 && (
            <div className="mt-6 p-4 bg-slate-700/20 border border-slate-700/30 rounded-lg">
              <p className="text-sm text-slate-500 italic">
                Professional certifications can be added to the data file as needed.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </Section>
  )
}
