'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AIToolbar, GenerateButton } from '../AIToolbar'

type AIProvider = 'openai' | 'anthropic'

interface Metric {
  label: string
  value: string
}

interface Experience {
  id: number
  company: string
  role: string
  period: string
  location: string
  highlights: string[]
  metrics: Metric[]
}

interface ExperienceEditorProps {
  data: Experience[]
  onChange: (data: Experience[]) => void
  provider: AIProvider
}

export function ExperienceEditor({ data, onChange, provider }: ExperienceEditorProps) {
  const [expandedId, setExpandedId] = useState<number | null>(data[0]?.id || null)

  const updateExperience = (id: number, updates: Partial<Experience>) => {
    onChange(data.map(exp => exp.id === id ? { ...exp, ...updates } : exp))
  }

  const updateHighlight = (expId: number, index: number, value: string) => {
    const exp = data.find(e => e.id === expId)
    if (!exp) return
    const newHighlights = [...exp.highlights]
    newHighlights[index] = value
    updateExperience(expId, { highlights: newHighlights })
  }

  const addHighlight = (expId: number) => {
    const exp = data.find(e => e.id === expId)
    if (!exp) return
    updateExperience(expId, { highlights: [...exp.highlights, ''] })
  }

  const removeHighlight = (expId: number, index: number) => {
    const exp = data.find(e => e.id === expId)
    if (!exp) return
    const newHighlights = exp.highlights.filter((_, i) => i !== index)
    updateExperience(expId, { highlights: newHighlights })
  }

  const updateMetric = (expId: number, index: number, field: keyof Metric, value: string) => {
    const exp = data.find(e => e.id === expId)
    if (!exp) return
    const newMetrics = [...exp.metrics]
    newMetrics[index] = { ...newMetrics[index], [field]: value }
    updateExperience(expId, { metrics: newMetrics })
  }

  const addMetric = (expId: number) => {
    const exp = data.find(e => e.id === expId)
    if (!exp) return
    updateExperience(expId, { metrics: [...exp.metrics, { label: '', value: '' }] })
  }

  const removeMetric = (expId: number, index: number) => {
    const exp = data.find(e => e.id === expId)
    if (!exp) return
    const newMetrics = exp.metrics.filter((_, i) => i !== index)
    updateExperience(expId, { metrics: newMetrics })
  }

  const addExperience = () => {
    const newId = Math.max(...data.map(e => e.id), 0) + 1
    onChange([...data, {
      id: newId,
      company: 'New Company',
      role: 'Role Title',
      period: 'Start - End',
      location: 'City, State',
      highlights: [''],
      metrics: [{ label: '', value: '' }]
    }])
    setExpandedId(newId)
  }

  const removeExperience = (id: number) => {
    onChange(data.filter(exp => exp.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Work Experience</h2>
        <button
          onClick={addExperience}
          className="px-4 py-2 bg-accent hover:bg-accent/90 text-white text-sm rounded-lg
                   transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Position
        </button>
      </div>

      <div className="space-y-4">
        {data.map((exp) => (
          <div
            key={exp.id}
            className="bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
            >
              <div className="text-left">
                <h3 className="text-white font-medium">{exp.company}</h3>
                <p className="text-sm text-slate-400">{exp.role}</p>
              </div>
              <motion.svg
                animate={{ rotate: expandedId === exp.id ? 180 : 0 }}
                className="w-5 h-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </motion.svg>
            </button>

            <AnimatePresence>
              {expandedId === exp.id && (
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
                        <label className="block text-sm font-medium text-slate-400 mb-1">Company</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg
                                   text-white text-sm focus:outline-none focus:border-accent transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Role</label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => updateExperience(exp.id, { role: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg
                                   text-white text-sm focus:outline-none focus:border-accent transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Period</label>
                        <input
                          type="text"
                          value={exp.period}
                          onChange={(e) => updateExperience(exp.id, { period: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg
                                   text-white text-sm focus:outline-none focus:border-accent transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Location</label>
                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg
                                   text-white text-sm focus:outline-none focus:border-accent transition-colors"
                        />
                      </div>
                    </div>

                    {/* Highlights */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-slate-400">Highlights</label>
                        <div className="flex items-center gap-2">
                          <GenerateButton
                            onGenerate={(content) => {
                              const highlights = content.split('\n').filter(h => h.trim())
                              updateExperience(exp.id, { highlights: [...exp.highlights, ...highlights] })
                            }}
                            provider={provider}
                            context={`Company: ${exp.company}, Role: ${exp.role}`}
                            placeholder="Describe an achievement to generate a highlight for..."
                          />
                          <button
                            onClick={() => addHighlight(exp.id)}
                            className="text-accent hover:text-accent/80 text-sm transition-colors"
                          >
                            + Add Highlight
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {exp.highlights.map((highlight, index) => (
                          <div key={index} className="space-y-1">
                            <div className="flex gap-2">
                              <textarea
                                value={highlight}
                                onChange={(e) => updateHighlight(exp.id, index, e.target.value)}
                                rows={2}
                                className="flex-1 px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg
                                         text-white text-sm focus:outline-none focus:border-accent transition-colors resize-none"
                              />
                              <button
                                onClick={() => removeHighlight(exp.id, index)}
                                className="px-2 text-slate-500 hover:text-red-400 transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                            <AIToolbar
                              content={highlight}
                              onRewrite={(newContent) => updateHighlight(exp.id, index, newContent)}
                              provider={provider}
                              context={`Company: ${exp.company}, Role: ${exp.role}. This is an achievement highlight.`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Metrics */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-slate-400">Metrics</label>
                        <button
                          onClick={() => addMetric(exp.id)}
                          className="text-accent hover:text-accent/80 text-sm transition-colors"
                        >
                          + Add Metric
                        </button>
                      </div>
                      <div className="space-y-2">
                        {exp.metrics.map((metric, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={metric.label}
                              onChange={(e) => updateMetric(exp.id, index, 'label', e.target.value)}
                              placeholder="Label"
                              className="flex-1 px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg
                                       text-white text-sm focus:outline-none focus:border-accent transition-colors"
                            />
                            <input
                              type="text"
                              value={metric.value}
                              onChange={(e) => updateMetric(exp.id, index, 'value', e.target.value)}
                              placeholder="Value"
                              className="w-32 px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg
                                       text-white text-sm focus:outline-none focus:border-accent transition-colors"
                            />
                            <button
                              onClick={() => removeMetric(exp.id, index)}
                              className="px-2 text-slate-500 hover:text-red-400 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delete button */}
                    <div className="pt-4 border-t border-slate-700/50">
                      <button
                        onClick={() => removeExperience(exp.id)}
                        className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm rounded-lg
                                 transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete Position
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
