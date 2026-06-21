'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ASSESSMENT_QUESTIONS } from '@/lib/assessment'

interface AreaResult {
  area: string
  score: number
  level: string
  recommendation: string
}
interface Result {
  overall: number
  overallLevel: string
  areas: AreaResult[]
  summary: string
  topPriority: string
}

const TOTAL = ASSESSMENT_QUESTIONS.length

function levelClasses(level: string): string {
  switch (level) {
    case 'Advanced': return 'text-emerald-300 border-emerald-700/50 bg-emerald-950/40'
    case 'Defined': return 'text-accent border-accent/40 bg-accent/10'
    case 'Developing': return 'text-amber-300 border-amber-700/50 bg-amber-950/40'
    default: return 'text-rose-300 border-rose-700/50 bg-rose-950/40'
  }
}

export function AiReadinessAssessment() {
  const [answers, setAnswers] = useState<number[]>(Array(TOTAL).fill(0))
  const [idx, setIdx] = useState(0)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function submit(finalAnswers: number[]) {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/ai/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: finalAnswers }),
      })
      const data = await res.json()
      if (!res.ok) setError(data.error || 'Something went wrong.')
      else setResult(data)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function choose(value: number) {
    const next = [...answers]
    next[idx] = value
    setAnswers(next)
    if (idx < TOTAL - 1) setIdx(idx + 1)
    else submit(next)
  }

  function restart() {
    setAnswers(Array(TOTAL).fill(0))
    setIdx(0)
    setResult(null)
    setError(null)
  }

  // --- Loading ---
  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="inline-flex items-center gap-2 text-slate-400">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" style={{ animationDelay: '0.2s' }} />
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>
        <p className="mt-4 text-slate-400">Analyzing your responses…</p>
      </div>
    )
  }

  // --- Results ---
  if (result) {
    const body = `My AI-security maturity came out as ${result.overallLevel}.\n` +
      result.areas.map((a) => `${a.area}: ${a.level}`).join('\n') +
      `\n\nI'd like to discuss next steps.`
    const mailto = `mailto:paulfalor@gmail.com?subject=${encodeURIComponent('AI Readiness Assessment — let’s discuss')}&body=${encodeURIComponent(body)}`

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-sm text-slate-400">Overall maturity</div>
            <div className="text-2xl font-bold text-white">{result.overallLevel}</div>
          </div>
          <span className={`px-3 py-1.5 rounded-full border text-sm font-medium ${levelClasses(result.overallLevel)}`}>
            {result.overallLevel}
          </span>
        </div>

        <p className="text-slate-300 leading-relaxed">{result.summary}</p>

        <div className="rounded-xl border border-accent/30 bg-accent/5 p-4">
          <div className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">Start here</div>
          <p className="text-slate-200">{result.topPriority}</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {result.areas.map((a) => (
            <div key={a.area} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-semibold text-sm">{a.area}</h4>
              </div>
              <span className={`inline-block px-2 py-0.5 rounded-full border text-xs font-medium mb-3 ${levelClasses(a.level)}`}>
                {a.level}
              </span>
              <p className="text-sm text-slate-400">{a.recommendation}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <Link href="/#contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent hover:bg-accent/90 text-white font-medium transition-colors duration-200">
            Discuss your roadmap with Paul
          </Link>
          <a href={mailto} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-slate-300 hover:border-slate-600 transition-colors duration-200">
            Email these results
          </a>
          <button onClick={restart} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-slate-400 hover:text-white transition-colors duration-200">
            Retake
          </button>
        </div>
        <p className="text-xs text-slate-600">Your answers are used only to generate this readout and are not stored.</p>
      </div>
    )
  }

  // --- Question flow ---
  const q = ASSESSMENT_QUESTIONS[idx]
  return (
    <div className="space-y-6">
      {/* Progress */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span className="text-accent font-medium">{q.area}</span>
          <span>{idx + 1} of {TOTAL}</span>
        </div>
        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
          <motion.div className="h-full bg-accent" animate={{ width: `${((idx) / TOTAL) * 100}%` }} transition={{ duration: 0.3 }} />
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-rose-950/40 border border-rose-800/40 text-rose-200 text-sm px-4 py-3">{error}</div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          <h3 className="text-xl font-semibold text-white mb-5">{q.text}</h3>
          <div className="space-y-2.5">
            {q.options.map((o) => {
              const selected = answers[idx] === o.value
              return (
                <button
                  key={o.value}
                  onClick={() => choose(o.value)}
                  className={`block w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors duration-150
                    ${selected
                      ? 'bg-accent/15 border-accent/50 text-white'
                      : 'bg-slate-800/40 border-slate-700/50 text-slate-300 hover:border-slate-600 hover:bg-slate-800/70'}`}
                >
                  {o.label}
                </button>
              )
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {idx > 0 && (
        <button onClick={() => setIdx(idx - 1)} className="text-sm text-slate-500 hover:text-slate-300 transition-colors duration-150">
          ← Back
        </button>
      )}
    </div>
  )
}
