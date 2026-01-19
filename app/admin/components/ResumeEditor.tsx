'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PersonalInfoEditor } from './SectionEditors/PersonalInfo'
import { ExperienceEditor } from './SectionEditors/ExperienceEditor'
import { MetricsEditor } from './SectionEditors/MetricsEditor'
import { ExpertiseEditor } from './SectionEditors/ExpertiseEditor'
import { EducationEditor } from './SectionEditors/EducationEditor'

type AIProvider = 'openai' | 'anthropic'
type Section = 'personal' | 'experience' | 'metrics' | 'expertise' | 'education'

interface ResumeData {
  personalInfo: {
    name: string
    title: string
    location: string
    email: string
    phone: string
    linkedin: string
    summary: string
  }
  credentials: Array<{
    label: string
    subtitle?: string
    type: string
  }>
  stats: Array<{
    value: number
    suffix: string
    label: string
    prefix?: string
  }>
  experience: Array<{
    id: number
    company: string
    role: string
    period: string
    location: string
    highlights: string[]
    metrics: Array<{
      label: string
      value: string
    }>
  }>
  metrics: Array<{
    id: number
    value: number
    suffix: string
    prefix?: string
    label: string
    description: string
    category: string
  }>
  expertise: Record<string, {
    title: string
    icon: string
    skills: string[]
  }>
  education: Array<{
    degree: string
    major: string
    school: string
    location: string
    year: string
    gpa?: string
  }>
}

interface ResumeEditorProps {
  initialData: ResumeData
}

const SECTIONS: { key: Section; label: string; icon: React.ReactNode }[] = [
  {
    key: 'personal',
    label: 'Personal',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    key: 'experience',
    label: 'Experience',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    key: 'metrics',
    label: 'Metrics',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    key: 'expertise',
    label: 'Expertise',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    key: 'education',
    label: 'Education',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
  },
]

export function ResumeEditor({ initialData }: ResumeEditorProps) {
  const [data, setData] = useState<ResumeData>(initialData)
  const [activeSection, setActiveSection] = useState<Section>('personal')
  const [provider, setProvider] = useState<AIProvider>('anthropic')
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [hasChanges, setHasChanges] = useState(false)

  const updateData = <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => {
    setData(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
    setSaveStatus('idle')
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveStatus('idle')

    try {
      const res = await fetch('/api/admin/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to save')
      }

      setSaveStatus('success')
      setHasChanges(false)
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch (error) {
      console.error('Save error:', error)
      setSaveStatus('error')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800/50 border-r border-slate-700/50 flex flex-col">
        <div className="p-4 border-b border-slate-700/50">
          <h1 className="text-lg font-bold text-white">Resume Editor</h1>
          <p className="text-sm text-slate-400">Edit your content</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {SECTIONS.map((section) => (
            <button
              key={section.key}
              onClick={() => setActiveSection(section.key)}
              className={`w-full px-3 py-2 rounded-lg flex items-center gap-3 transition-colors ${
                activeSection === section.key
                  ? 'bg-accent/20 text-accent'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {section.icon}
              {section.label}
            </button>
          ))}
        </nav>

        {/* Provider toggle */}
        <div className="p-4 border-t border-slate-700/50">
          <label className="block text-sm font-medium text-slate-400 mb-2">AI Provider</label>
          <div className="flex bg-slate-900/50 rounded-lg p-1">
            <button
              onClick={() => setProvider('anthropic')}
              className={`flex-1 px-3 py-1.5 rounded-md text-sm transition-colors ${
                provider === 'anthropic'
                  ? 'bg-accent text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Claude
            </button>
            <button
              onClick={() => setProvider('openai')}
              className={`flex-1 px-3 py-1.5 rounded-md text-sm transition-colors ${
                provider === 'openai'
                  ? 'bg-accent text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              GPT-4o
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/30">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-white">
              {SECTIONS.find(s => s.key === activeSection)?.label}
            </h2>
            {hasChanges && (
              <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                Unsaved changes
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <AnimatePresence>
              {saveStatus === 'success' && (
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-green-400 text-sm flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Saved!
                </motion.span>
              )}
              {saveStatus === 'error' && (
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-400 text-sm"
                >
                  Failed to save
                </motion.span>
              )}
            </AnimatePresence>

            <button
              onClick={handleSave}
              disabled={isSaving || !hasChanges}
              className="px-4 py-2 bg-accent hover:bg-accent/90 text-white font-medium rounded-lg
                       transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </header>

        {/* Content area */}
        <div className="flex-1 p-6 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeSection === 'personal' && (
                <PersonalInfoEditor
                  data={data.personalInfo}
                  onChange={(personalInfo) => updateData('personalInfo', personalInfo)}
                  provider={provider}
                />
              )}
              {activeSection === 'experience' && (
                <ExperienceEditor
                  data={data.experience}
                  onChange={(experience) => updateData('experience', experience)}
                  provider={provider}
                />
              )}
              {activeSection === 'metrics' && (
                <MetricsEditor
                  data={data.metrics}
                  onChange={(metrics) => updateData('metrics', metrics)}
                  provider={provider}
                />
              )}
              {activeSection === 'expertise' && (
                <ExpertiseEditor
                  data={data.expertise}
                  onChange={(expertise) => updateData('expertise', expertise)}
                  provider={provider}
                />
              )}
              {activeSection === 'education' && (
                <EducationEditor
                  data={data.education}
                  onChange={(education) => updateData('education', education)}
                  provider={provider}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
