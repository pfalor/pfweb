'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const ROLES = ['CISO', 'CIO', 'CEO / Board', 'Chief Data Officer', 'Chief Risk Officer', 'Other']

interface Brief {
  title: string
  markdown: string
}

export function ExecBriefingGenerator() {
  const [role, setRole] = useState('CISO')
  const [roleOther, setRoleOther] = useState('')
  const [industry, setIndustry] = useState('')
  const [concern, setConcern] = useState('')
  const [loading, setLoading] = useState(false)
  const [brief, setBrief] = useState<Brief | null>(null)
  const [error, setError] = useState<string | null>(null)

  const effectiveRole = role === 'Other' ? roleOther.trim() : role
  const canSubmit = effectiveRole.length > 0 && industry.trim().length > 0 && !loading

  async function generate() {
    if (!canSubmit) return
    setLoading(true)
    setError(null)
    setBrief(null)
    try {
      const res = await fetch('/api/ai/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: effectiveRole, industry: industry.trim(), concern: concern.trim() || undefined }),
      })
      const data = await res.json()
      if (!res.ok) setError(data.error || 'Something went wrong.')
      else setBrief(data)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (brief) {
    const mailto = `mailto:paulfalor@gmail.com?subject=${encodeURIComponent(`Briefing follow-up: ${effectiveRole}, ${industry}`)}&body=${encodeURIComponent(`I generated a briefing on "${brief.title}" and would like to discuss it.`)}`
    return (
      <div className="space-y-6">
        <article className="prose prose-invert prose-lg max-w-none
                        prose-headings:text-white prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3
                        prose-p:text-slate-300 prose-li:text-slate-300 prose-strong:text-white
                        prose-a:text-accent">
          <h1 className="text-2xl font-bold text-white mb-2">{brief.title}</h1>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{brief.markdown}</ReactMarkdown>
        </article>
        <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-700/50">
          <Link href="/#contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent hover:bg-accent/90 text-white font-medium transition-colors duration-200">
            Discuss this with Paul
          </Link>
          <a href={mailto} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-slate-300 hover:border-slate-600 transition-colors duration-200">
            Email Paul about this
          </a>
          <button onClick={() => setBrief(null)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-slate-400 hover:text-white transition-colors duration-200">
            New briefing
          </button>
        </div>
        <p className="text-xs text-slate-600">Generated on demand and not stored. AI representation of Paul’s perspective, not formal advice.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-xl">
      <p className="text-slate-400">
        Tell me who you are and where you operate, and I’ll generate a tailored one-page briefing on what AI security and data protection mean for you right now.
      </p>

      {error && (
        <div className="rounded-lg bg-rose-950/40 border border-rose-800/40 text-rose-200 text-sm px-4 py-3">{error}</div>
      )}

      <div>
        <label className="block text-sm text-slate-400 mb-2">Your role</label>
        <div className="flex flex-wrap gap-2">
          {ROLES.map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors duration-150
                ${role === r ? 'bg-accent/15 border-accent/50 text-accent' : 'bg-slate-800/40 border-slate-700/50 text-slate-300 hover:border-slate-600'}`}
            >
              {r}
            </button>
          ))}
        </div>
        {role === 'Other' && (
          <input
            value={roleOther}
            onChange={(e) => setRoleOther(e.target.value)}
            placeholder="Your title"
            maxLength={120}
            className="mt-3 w-full bg-slate-900/70 border border-slate-700/60 focus:border-accent/60 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none"
          />
        )}
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-2">Industry</label>
        <input
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          placeholder="e.g. healthcare, banking, manufacturing, retail"
          maxLength={120}
          className="w-full bg-slate-900/70 border border-slate-700/60 focus:border-accent/60 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-2">Top concern <span className="text-slate-600">(optional)</span></label>
        <textarea
          value={concern}
          onChange={(e) => setConcern(e.target.value)}
          placeholder="e.g. our teams are adopting GenAI faster than we can govern it"
          rows={2}
          maxLength={300}
          className="w-full resize-none bg-slate-900/70 border border-slate-700/60 focus:border-accent/60 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none"
        />
      </div>

      <motion.button
        onClick={generate}
        disabled={!canSubmit}
        whileTap={{ scale: 0.98 }}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium transition-colors duration-200"
      >
        {loading ? 'Generating…' : 'Generate my briefing'}
      </motion.button>
    </div>
  )
}
