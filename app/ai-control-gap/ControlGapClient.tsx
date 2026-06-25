// app/ai-control-gap/ControlGapClient.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import ControlGapChart from '@/components/ControlGapChart'
import { CONTROL_GAP_QUESTIONS, scoreControlGap } from '@/lib/controlgap'

type Phase = 'intro' | 'quiz' | 'result'

interface Result {
  adoption: number
  control: number
  gap: number
  band: 'aligned' | 'widening' | 'critical'
  weakestControl: string
  diagnosis: string
  topMove: string
}

const BAND_COPY: Record<Result['band'], string> = {
  aligned: 'Aligned. Your control is keeping pace with adoption. Hold that discipline as you scale.',
  widening: 'Widening. Adoption is pulling ahead of your ability to govern it. This is the moment to close the distance.',
  critical: 'Critical. The gap is wide. Adoption has outrun control, and the exposure compounds with every new use.',
}

export default function ControlGapClient() {
  const [phase, setPhase] = useState<Phase>('intro')
  const [answers, setAnswers] = useState<number[]>(Array(CONTROL_GAP_QUESTIONS.length).fill(-1))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<Result | null>(null)

  const allAnswered = answers.every((a) => a >= 0)
  const preview = allAnswered ? scoreControlGap(answers) : null

  function setAnswer(qIdx: number, value: number) {
    setAnswers((prev) => prev.map((a, i) => (i === qIdx ? value : a)))
  }

  async function submit() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/ai/controlgap', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ answers }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Something went wrong.')
      }
      setResult(await res.json())
      setPhase('result')
    } catch (e) {
      // Graceful degradation: show the deterministic gap even if the AI is down.
      setError(e instanceof Error ? e.message : 'Something went wrong.')
      const s = scoreControlGap(answers)
      setResult({ ...s, diagnosis: '', topMove: '' })
      setPhase('result')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-slate-100">
      {/* Beat 1 — the model */}
      {phase === 'intro' && (
        <section className="space-y-8">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
              The framework
            </p>
            <h1 className="text-4xl font-bold leading-tight">The AI Control Gap</h1>
            <p className="text-lg text-slate-300">
              The danger isn&apos;t the AI. It&apos;s the gap between how fast you adopt it and how
              fast you can control it. Adoption climbs fast. Control climbs slowly. Everything that
              keeps a board up at night lives in the space between.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <ControlGapChart />
          </div>
          <button
            onClick={() => setPhase('quiz')}
            className="rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-slate-900 transition hover:bg-emerald-400"
          >
            Find your gap
          </button>
        </section>
      )}

      {/* Beat 2 — the mirror */}
      {phase === 'quiz' && (
        <section className="space-y-8">
          <h2 className="text-2xl font-bold">Locate your organization</h2>
          <ol className="space-y-8">
            {CONTROL_GAP_QUESTIONS.map((q, qi) => (
              <li key={qi} className="space-y-3">
                <p className="font-medium">
                  <span className="mr-2 text-xs uppercase tracking-wider text-slate-400">
                    {q.axis}
                  </span>
                  {q.text}
                </p>
                <div className="flex flex-col gap-2">
                  {q.options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setAnswer(qi, opt.value)}
                      className={`rounded-lg border px-4 py-2 text-left text-sm transition ${
                        answers[qi] === opt.value
                          ? 'border-emerald-400 bg-emerald-400/10'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ol>

          {preview && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <ControlGapChart adoption={preview.adoption} control={preview.control} animate={false} />
            </div>
          )}

          <button
            disabled={!allAnswered || loading}
            onClick={submit}
            className="rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-slate-900 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? 'Reading your gap...' : 'See my diagnosis'}
          </button>
        </section>
      )}

      {/* Beat 3 — the diagnosis */}
      {phase === 'result' && result && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <ControlGapChart adoption={result.adoption} control={result.control} />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-widest text-rose-300">
              Your control gap: {result.gap} of 6
            </p>
            <p className="text-lg text-slate-200">{BAND_COPY[result.band]}</p>
          </div>

          {result.diagnosis ? (
            <div className="space-y-4">
              <p className="text-slate-200">{result.diagnosis}</p>
              <div className="rounded-lg border-l-2 border-emerald-400 bg-white/5 px-5 py-4">
                <p className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
                  The first move
                </p>
                <p className="mt-1 text-slate-100">{result.topMove}</p>
              </div>
            </div>
          ) : (
            <p className="text-slate-400">
              Your widest exposure is here: {result.weakestControl}. The live diagnosis is
              unavailable right now, but the gap above is real. {error}
            </p>
          )}

          <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 p-6">
            <p className="text-slate-200">
              Want this as a board-ready briefing for your situation?
            </p>
            <Link
              href="/ai-tools"
              className="mt-3 inline-block rounded-lg bg-emerald-500 px-5 py-2.5 font-semibold text-slate-900 transition hover:bg-emerald-400"
            >
              Generate an executive briefing
            </Link>
          </div>

          <button
            onClick={() => {
              setAnswers(Array(CONTROL_GAP_QUESTIONS.length).fill(-1))
              setResult(null)
              setPhase('intro')
            }}
            className="text-sm text-slate-400 underline hover:text-slate-200"
          >
            Start over
          </button>
        </motion.section>
      )}
    </main>
  )
}
