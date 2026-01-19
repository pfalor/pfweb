'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type AIProvider = 'openai' | 'anthropic'

interface Education {
  degree: string
  major: string
  school: string
  location: string
  year: string
  gpa?: string
}

interface EducationEditorProps {
  data: Education[]
  onChange: (data: Education[]) => void
  provider: AIProvider
}

export function EducationEditor({ data, onChange }: EducationEditorProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0)

  const updateEducation = (index: number, updates: Partial<Education>) => {
    onChange(data.map((edu, i) => i === index ? { ...edu, ...updates } : edu))
  }

  const addEducation = () => {
    onChange([...data, {
      degree: 'Degree Type',
      major: 'Major / Field of Study',
      school: 'University Name',
      location: 'City, State',
      year: new Date().getFullYear().toString()
    }])
    setExpandedIndex(data.length)
  }

  const removeEducation = (index: number) => {
    onChange(data.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Education</h2>
        <button
          onClick={addEducation}
          className="px-4 py-2 bg-accent hover:bg-accent/90 text-white text-sm rounded-lg
                   transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Education
        </button>
      </div>

      <div className="space-y-4">
        {data.map((edu, index) => (
          <div
            key={index}
            className="bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
            >
              <div className="text-left">
                <h3 className="text-white font-medium">{edu.school}</h3>
                <p className="text-sm text-slate-400">{edu.degree} - {edu.year}</p>
              </div>
              <motion.svg
                animate={{ rotate: expandedIndex === index ? 180 : 0 }}
                className="w-5 h-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </motion.svg>
            </button>

            <AnimatePresence>
              {expandedIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-4 border-t border-slate-700/50 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Degree</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => updateEducation(index, { degree: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg
                                   text-white text-sm focus:outline-none focus:border-accent transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Major / Field</label>
                        <input
                          type="text"
                          value={edu.major}
                          onChange={(e) => updateEducation(index, { major: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg
                                   text-white text-sm focus:outline-none focus:border-accent transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">School</label>
                        <input
                          type="text"
                          value={edu.school}
                          onChange={(e) => updateEducation(index, { school: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg
                                   text-white text-sm focus:outline-none focus:border-accent transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Location</label>
                        <input
                          type="text"
                          value={edu.location}
                          onChange={(e) => updateEducation(index, { location: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg
                                   text-white text-sm focus:outline-none focus:border-accent transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Year</label>
                        <input
                          type="text"
                          value={edu.year}
                          onChange={(e) => updateEducation(index, { year: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg
                                   text-white text-sm focus:outline-none focus:border-accent transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">GPA (optional)</label>
                        <input
                          type="text"
                          value={edu.gpa || ''}
                          onChange={(e) => updateEducation(index, { gpa: e.target.value || undefined })}
                          placeholder="4.0"
                          className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg
                                   text-white text-sm focus:outline-none focus:border-accent transition-colors"
                        />
                      </div>
                    </div>

                    {/* Delete button */}
                    <div className="pt-4 border-t border-slate-700/50">
                      <button
                        onClick={() => removeEducation(index)}
                        className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm rounded-lg
                                 transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete Education
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}
