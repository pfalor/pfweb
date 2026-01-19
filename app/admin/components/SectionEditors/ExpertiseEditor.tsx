'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type AIProvider = 'openai' | 'anthropic'

interface ExpertiseArea {
  title: string
  icon: string
  skills: string[]
}

interface ExpertiseData {
  [key: string]: ExpertiseArea
}

interface ExpertiseEditorProps {
  data: ExpertiseData
  onChange: (data: ExpertiseData) => void
  provider: AIProvider
}

const ICONS = ['shield', 'transform', 'brain', 'merge', 'users', 'code', 'cloud', 'chart']

export function ExpertiseEditor({ data, onChange }: ExpertiseEditorProps) {
  const [expandedKey, setExpandedKey] = useState<string | null>(Object.keys(data)[0] || null)

  const updateArea = (key: string, updates: Partial<ExpertiseArea>) => {
    onChange({
      ...data,
      [key]: { ...data[key], ...updates }
    })
  }

  const updateSkill = (areaKey: string, index: number, value: string) => {
    const area = data[areaKey]
    const newSkills = [...area.skills]
    newSkills[index] = value
    updateArea(areaKey, { skills: newSkills })
  }

  const addSkill = (areaKey: string) => {
    const area = data[areaKey]
    updateArea(areaKey, { skills: [...area.skills, ''] })
  }

  const removeSkill = (areaKey: string, index: number) => {
    const area = data[areaKey]
    const newSkills = area.skills.filter((_, i) => i !== index)
    updateArea(areaKey, { skills: newSkills })
  }

  const addArea = () => {
    const newKey = `area_${Date.now()}`
    onChange({
      ...data,
      [newKey]: {
        title: 'New Expertise Area',
        icon: 'code',
        skills: ['']
      }
    })
    setExpandedKey(newKey)
  }

  const removeArea = (key: string) => {
    const newData = { ...data }
    delete newData[key]
    onChange(newData)
  }

  const renameArea = (oldKey: string, newKey: string) => {
    if (oldKey === newKey || !newKey.trim()) return
    if (data[newKey]) return // Key already exists

    const newData: ExpertiseData = {}
    for (const [k, v] of Object.entries(data)) {
      if (k === oldKey) {
        newData[newKey] = v
      } else {
        newData[k] = v
      }
    }
    onChange(newData)
    setExpandedKey(newKey)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Expertise Areas</h2>
        <button
          onClick={addArea}
          className="px-4 py-2 bg-accent hover:bg-accent/90 text-white text-sm rounded-lg
                   transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Area
        </button>
      </div>

      <div className="space-y-4">
        {Object.entries(data).map(([key, area]) => (
          <div
            key={key}
            className="bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setExpandedKey(expandedKey === key ? null : key)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-accent">
                  <IconDisplay icon={area.icon} />
                </span>
                <div className="text-left">
                  <h3 className="text-white font-medium">{area.title}</h3>
                  <p className="text-xs text-slate-500">{area.skills.length} skills</p>
                </div>
              </div>
              <motion.svg
                animate={{ rotate: expandedKey === key ? 180 : 0 }}
                className="w-5 h-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </motion.svg>
            </button>

            <AnimatePresence>
              {expandedKey === key && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-4 border-t border-slate-700/50 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Key (ID)</label>
                        <input
                          type="text"
                          value={key}
                          onChange={(e) => renameArea(key, e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                          className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg
                                   text-white text-sm focus:outline-none focus:border-accent transition-colors font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Title</label>
                        <input
                          type="text"
                          value={area.title}
                          onChange={(e) => updateArea(key, { title: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg
                                   text-white text-sm focus:outline-none focus:border-accent transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Icon</label>
                        <select
                          value={area.icon}
                          onChange={(e) => updateArea(key, { icon: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg
                                   text-white text-sm focus:outline-none focus:border-accent transition-colors"
                        >
                          {ICONS.map(icon => (
                            <option key={icon} value={icon}>{icon}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Skills */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-slate-400">Skills</label>
                        <button
                          onClick={() => addSkill(key)}
                          className="text-accent hover:text-accent/80 text-sm transition-colors"
                        >
                          + Add Skill
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {area.skills.map((skill, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={skill}
                              onChange={(e) => updateSkill(key, index, e.target.value)}
                              className="flex-1 px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg
                                       text-white text-sm focus:outline-none focus:border-accent transition-colors"
                            />
                            <button
                              onClick={() => removeSkill(key, index)}
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
                        onClick={() => removeArea(key)}
                        className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm rounded-lg
                                 transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete Area
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

function IconDisplay({ icon }: { icon: string }) {
  switch (icon) {
    case 'shield':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    case 'transform':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    case 'brain':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    case 'merge':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      )
    case 'users':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    default:
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      )
  }
}
