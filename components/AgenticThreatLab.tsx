'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { exploitFlows, asiTop10, threatTaxonomy, owaspSources } from '@/lib/agentic-threats'

type Phase = 'idle' | 'exploit' | 'defended'
const STEP_MS = 2200

export function AgenticThreatLab() {
  const [flowId, setFlowId] = useState(exploitFlows[0].id)
  const [phase, setPhase] = useState<Phase>('idle')
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const flow = exploitFlows.find((f) => f.id === flowId)!
  const lastStep = flow.steps.length - 1
  const atEnd = step >= lastStep

  function reset() {
    setPhase('idle')
    setStep(0)
    setPlaying(false)
  }

  function run(next: Phase) {
    setPhase(next)
    setStep(0)
    setPlaying(true)
  }

  // Auto-advance
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current)
    if (playing && phase !== 'idle' && step < lastStep) {
      timer.current = setTimeout(() => setStep((s) => s + 1), STEP_MS)
    } else if (step >= lastStep) {
      setPlaying(false)
    }
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [playing, phase, step, lastStep])

  const current = phase === 'idle' ? null : flow.steps[step]

  return (
    <div className="space-y-10">
      {/* Threat selector */}
      <div className="flex flex-wrap gap-2">
        {exploitFlows.map((f) => {
          const active = f.id === flowId
          return (
            <button
              key={f.id}
              onClick={() => { setFlowId(f.id); reset() }}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors duration-200
                ${active
                  ? 'bg-accent/15 border-accent/50 text-accent'
                  : 'bg-slate-800/40 border-slate-700/50 text-slate-300 hover:border-slate-600'}`}
            >
              {f.name}
            </button>
          )
        })}
      </div>

      {/* Theme + ref */}
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="text-xl font-bold text-white">{flow.name}</h3>
        <span className="text-xs font-mono text-accent">{flow.owaspRef}</span>
        <p className="w-full text-slate-400 mt-1">{flow.theme}</p>
      </div>

      {/* Attack chain diagram */}
      <div className="bg-slate-900/40 border border-slate-700/50 rounded-xl p-5 overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {flow.nodes.map((node, i) => {
            const reached = phase !== 'idle' && i <= step
            const isCurrent = phase !== 'idle' && i === step
            const tone =
              phase === 'exploit' && reached
                ? 'border-rose-500/70 bg-rose-950/40 text-rose-200'
                : phase === 'defended' && reached
                ? 'border-emerald-500/70 bg-emerald-950/40 text-emerald-200'
                : 'border-slate-700 bg-slate-800/40 text-slate-400'
            return (
              <div key={node} className="flex items-center">
                <motion.div
                  animate={isCurrent ? { scale: [1, 1.06, 1] } : { scale: 1 }}
                  transition={{ duration: 0.6, repeat: isCurrent ? Infinity : 0, repeatDelay: 0.4 }}
                  className={`relative shrink-0 px-3 py-2 rounded-lg border text-xs font-medium text-center min-w-[84px] transition-colors duration-300 ${tone}`}
                >
                  {phase === 'defended' && reached && (
                    <span className="absolute -top-2 -right-2 text-emerald-400 text-sm">🛡</span>
                  )}
                  {node}
                </motion.div>
                {i < flow.nodes.length - 1 && (
                  <div className={`w-6 sm:w-10 h-0.5 shrink-0 transition-colors duration-300
                    ${phase === 'exploit' && i < step ? 'bg-rose-500/60'
                      : phase === 'defended' && i < step ? 'bg-emerald-500/60'
                      : 'bg-slate-700'}`} />
                )}
              </div>
            )
          })}
        </div>

        {/* Outcome banner */}
        <AnimatePresence>
          {atEnd && phase === 'exploit' && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-950/50 border border-rose-700/50 text-rose-200 text-sm">
              ✗ Breach — the attack reached impact
            </motion.div>
          )}
          {atEnd && phase === 'defended' && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/50 border border-emerald-700/50 text-emerald-200 text-sm">
              ✓ Contained — controls break the chain at every step
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Step detail */}
      <div className="min-h-[180px]">
        {current ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${phase}-${step}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-semibold">
                  Step {step + 1} of {flow.steps.length} — {current.title}
                </h4>
                <span className="text-xs font-mono text-slate-500">{flow.owaspRef}</span>
              </div>
              <dl className="space-y-2.5 text-sm">
                <div className="flex gap-3">
                  <dt className="shrink-0 w-24 text-rose-400 font-medium">Attacker</dt>
                  <dd className="text-slate-300">{current.attacker}</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="shrink-0 w-24 text-slate-500 font-medium">Goes wrong</dt>
                  <dd className="text-slate-400">{current.goesWrong}</dd>
                </div>
                {phase === 'defended' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 pt-1">
                    <dt className="shrink-0 w-24 text-emerald-400 font-medium">Control</dt>
                    <dd className="text-emerald-100">
                      {current.control}
                      {current.controlRef && (
                        <span className="block mt-1 text-xs text-emerald-300/70">{current.controlRef}</span>
                      )}
                    </dd>
                  </motion.div>
                )}
              </dl>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="bg-slate-800/20 border border-dashed border-slate-700/50 rounded-xl p-8 text-center text-slate-400">
            Run the exploit to see how this attack unfolds step by step. Then deploy the controls that stop it.
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => run('exploit')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-rose-600/90 hover:bg-rose-600 text-white font-medium transition-colors duration-200"
        >
          ▶ Run exploit
        </button>
        <button
          onClick={() => run('defended')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-600 text-white font-medium transition-colors duration-200"
        >
          🛡 Deploy defenses
        </button>
        {phase !== 'idle' && (
          <div className="flex items-center gap-1 ml-auto">
            <button
              onClick={() => { setPlaying(false); setStep((s) => Math.max(0, s - 1)) }}
              disabled={step === 0}
              className="px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-slate-300 text-sm disabled:opacity-30 hover:border-slate-600"
            >
              ← Prev
            </button>
            <button
              onClick={() => { setPlaying(false); setStep((s) => Math.min(lastStep, s + 1)) }}
              disabled={atEnd}
              className="px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-slate-300 text-sm disabled:opacity-30 hover:border-slate-600"
            >
              Next →
            </button>
            <button
              onClick={reset}
              className="px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-slate-400 text-sm hover:border-slate-600"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {/* Reference grids */}
      <div className="pt-8 border-t border-slate-700/50 grid lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-sm font-semibold text-accent uppercase tracking-wider mb-1">
            OWASP Top 10 for Agentic Applications
          </h3>
          <p className="text-xs text-slate-500 mb-4">Official ranked list, released Dec 2025 (ASI01–ASI10).</p>
          <ol className="space-y-1.5">
            {asiTop10.map((a) => (
              <li key={a.id} className="flex items-baseline gap-2 text-sm">
                <span className="font-mono text-xs text-accent shrink-0 w-12">{a.id}</span>
                <span className="text-slate-300">{a.name}</span>
                <span className="ml-auto text-xs text-slate-600 font-mono shrink-0">{a.maps}</span>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-accent uppercase tracking-wider mb-1">
            Threats & Mitigations Taxonomy
          </h3>
          <p className="text-xs text-slate-500 mb-4">Full technical reference, T1–T15 (v1.0 Feb 2025, v1.1 Dec 2025).</p>
          <ol className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
            {threatTaxonomy.map((t) => (
              <li key={t.id} className="flex items-baseline gap-2 text-sm">
                <span className="font-mono text-xs text-slate-500 shrink-0 w-8">{t.id}</span>
                <span className="text-slate-300">{t.name}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Sources */}
      <div className="pt-6 border-t border-slate-700/50">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Sources</h3>
        <ul className="space-y-1.5">
          {owaspSources.map((s) => (
            <li key={s.url} className="text-sm">
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-accent transition-colors duration-200">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
