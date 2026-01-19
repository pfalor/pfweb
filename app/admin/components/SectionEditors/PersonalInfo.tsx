'use client'

import { AIToolbar } from '../AIToolbar'

type AIProvider = 'openai' | 'anthropic'

interface PersonalInfoData {
  name: string
  title: string
  location: string
  email: string
  phone: string
  linkedin: string
  summary: string
}

interface PersonalInfoEditorProps {
  data: PersonalInfoData
  onChange: (data: PersonalInfoData) => void
  provider: AIProvider
}

export function PersonalInfoEditor({ data, onChange, provider }: PersonalInfoEditorProps) {
  const updateField = (field: keyof PersonalInfoData, value: string) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">Personal Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Name</label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => updateField('name', e.target.value)}
            className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg
                     text-white focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Title</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => updateField('title', e.target.value)}
            className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg
                     text-white focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Location</label>
          <input
            type="text"
            value={data.location}
            onChange={(e) => updateField('location', e.target.value)}
            className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg
                     text-white focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => updateField('email', e.target.value)}
            className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg
                     text-white focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Phone</label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg
                     text-white focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">LinkedIn</label>
          <input
            type="url"
            value={data.linkedin}
            onChange={(e) => updateField('linkedin', e.target.value)}
            className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg
                     text-white focus:outline-none focus:border-accent transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-400 mb-1">Summary</label>
        <textarea
          value={data.summary}
          onChange={(e) => updateField('summary', e.target.value)}
          rows={4}
          className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg
                   text-white focus:outline-none focus:border-accent transition-colors resize-none"
        />
        <div className="mt-2">
          <AIToolbar
            content={data.summary}
            onRewrite={(newContent) => updateField('summary', newContent)}
            provider={provider}
            context="This is the professional summary for a technology executive resume"
          />
        </div>
      </div>
    </div>
  )
}
