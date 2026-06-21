'use client'

import { useState } from 'react'
import type { Beat, SimResult, Turn } from '@/lib/ai/simulator'
import { encodeProfileParams, type ProfileCardData } from '@/lib/simulator-card'

interface ScenarioCard { id: string; title: string; setup: string }

interface BeatResponse { kind: 'beat'; beat: Beat; model: string; turn: number; total: number }
interface ResultResponse { kind: 'result'; result: SimResult; model: string }
type SimResponse = BeatResponse | ResultResponse

const AXIS_COLOR = 'bg-emerald-400'

export default function InTheChairClient({ scenarios }: { scenarios: ScenarioCard[] }) {
  const [scenario, setScenario] = useState<ScenarioCard | null>(null)
  const [history, setHistory] = useState<Turn[]>([])
  const [beat, setBeat] = useState<BeatResponse | null>(null)
  const [result, setResult] = useState<SimResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [copyFailed, setCopyFailed] = useState(false)

  async function post(scenarioId: string, nextHistory: Turn[]) {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/ai/simulate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ scenarioId, history: nextHistory }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? 'Something went wrong.')
        return
      }
      const data = json as SimResponse
      if (data.kind === 'beat') {
        setBeat(data)
      } else {
        setResult(data.result)
        setBeat(null)
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function start(s: ScenarioCard) {
    setScenario(s)
    setHistory([])
    setBeat(null)
    setResult(null)
    setError(null)
    void post(s.id, [])
  }

  function choose(choice: string) {
    if (!scenario || !beat) return
    const nextHistory = [...history, { situation: beat.beat.situation, choice }]
    setHistory(nextHistory)
    void post(scenario.id, nextHistory)
  }

  function reset() {
    setScenario(null)
    setHistory([])
    setBeat(null)
    setResult(null)
    setError(null)
  }

  function cardHref(r: SimResult): string {
    const card: ProfileCardData = {
      scenario: scenario?.title ?? 'In the Chair',
      archetype: r.archetype,
      axes: r.axes.map((a) => ({ label: a.label, score: a.score })),
    }
    return `/api/og/simulate?${encodeProfileParams(card)}`
  }

  async function copyReveal(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopyFailed(true)
      setTimeout(() => setCopyFailed(false), 2000)
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-slate-200">
      <h1 className="text-3xl font-bold text-white">In the Chair</h1>
      <p className="mt-3 text-slate-400">
        You are the security and AI executive. A crisis is unfolding. Make the calls, then see how
        you led and how Paul would have played it.
      </p>

      {error && <p className="mt-6 text-sm text-red-400">{error}</p>}

      {/* Scenario picker */}
      {!scenario && (
        <div className="mt-8 space-y-4">
          {scenarios.map((s) => (
            <button
              key={s.id}
              onClick={() => start(s)}
              className="block w-full rounded-md border border-slate-700 bg-slate-800/40 p-5 text-left hover:border-slate-500"
            >
              <div className="text-lg font-semibold text-white">{s.title}</div>
              <div className="mt-1 text-sm text-slate-400">{s.setup}</div>
            </button>
          ))}
        </div>
      )}

      {/* In progress */}
      {scenario && !result && (
        <section className="mt-8">
          <div className="text-xs uppercase tracking-wide text-slate-500">
            {scenario.title}
            {beat ? ` · decision ${beat.turn} of ${beat.total}` : ''}
          </div>
          {loading && <p className="mt-4 text-slate-400">Thinking through what happens next...</p>}
          {!loading && beat && (
            <>
              <p className="mt-4 text-lg text-slate-100">{beat.beat.situation}</p>
              <div className="mt-6 space-y-3">
                {beat.beat.choices.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => choose(c)}
                    disabled={loading}
                    className="block w-full rounded-md border border-slate-600 bg-slate-800/30 p-4 text-left text-slate-100 hover:border-emerald-500 disabled:opacity-50"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {/* Result */}
      {result && (
        <section className="mt-8">
          <div className="text-xs uppercase tracking-wide text-slate-500">{scenario?.title}</div>
          <h2 className="mt-2 text-3xl font-bold text-emerald-400">{result.archetype}</h2>

          <div className="mt-6 space-y-4">
            {result.axes.map((a, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-200">{a.label}</span>
                  <span className="text-slate-400">{a.score}</span>
                </div>
                <div className="mt-1 h-2 w-full rounded bg-slate-700">
                  <div className={`h-2 rounded ${AXIS_COLOR}`} style={{ width: `${a.score}%` }} />
                </div>
                <p className="mt-1 text-sm text-slate-400">{a.note}</p>
              </div>
            ))}
          </div>

          <h3 className="mt-8 text-xl font-semibold text-white">How I would have played it</h3>
          <div className="mt-2 whitespace-pre-wrap text-slate-200">{result.reveal}</div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              className="rounded-md border border-slate-600 px-4 py-2 text-sm text-slate-200"
              onClick={() => copyReveal(result.reveal)}
            >
              {copyFailed ? 'Copy failed' : copied ? 'Copied' : 'Copy the reveal'}
            </button>
            <a
              className="rounded-md border border-slate-600 px-4 py-2 text-sm text-slate-200"
              href={cardHref(result)}
              download="in-the-chair-profile.png"
              target="_blank"
              rel="noreferrer"
            >
              Download card
            </a>
            <button
              className="rounded-md border border-slate-600 px-4 py-2 text-sm text-slate-200"
              onClick={reset}
            >
              Try another scenario
            </button>
          </div>
        </section>
      )}
    </main>
  )
}
