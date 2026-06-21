'use client'

import { useState } from 'react'
import type { RedteamResult } from '@/lib/ai/redteam'
import { encodeCardParams, type CardData } from '@/lib/redteam-card'

interface ApiResponse {
  result: RedteamResult
  model: string
  truncated: boolean
  pii: { found: boolean; types: string[] }
  injectionNoted: boolean
}

const BAND_STYLE: Record<string, string> = {
  Emerging: 'text-red-400',
  Developing: 'text-amber-400',
  Strong: 'text-emerald-400',
}

const SEVERITY_STYLE: Record<string, string> = {
  high: 'border-red-500/60 text-red-300',
  medium: 'border-amber-500/60 text-amber-300',
  low: 'border-slate-500/60 text-slate-300',
}

export default function RedTeamClient() {
  const [doc, setDoc] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<ApiResponse | null>(null)
  const [showScore, setShowScore] = useState(false)
  const [copied, setCopied] = useState(false)

  async function analyze() {
    setLoading(true)
    setError(null)
    setData(null)
    setShowScore(false)
    try {
      const res = await fetch('/api/ai/redteam', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ document: doc }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? 'Something went wrong.')
        return
      }
      setData(json as ApiResponse)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function cardHref(result: RedteamResult): string {
    const card: CardData = {
      band: result.band,
      score: result.score,
      verdict: result.verdict,
      gaps: result.gaps.slice(0, 3).map((g) => g.finding),
    }
    return `/api/og/redteam?${encodeCardParams(card)}`
  }

  async function copySummary(summary: string) {
    await navigator.clipboard.writeText(summary)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const result = data?.result

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-slate-200">
      <h1 className="text-3xl font-bold text-white">Red Team Your AI Policy</h1>
      <p className="mt-3 text-slate-400">
        Paste an AI acceptable-use policy, a vendor&apos;s AI-safety claims, or a model card. You
        get a red-team teardown against NIST AI RMF, the EU AI Act, and the OWASP LLM Top 10, with
        a board-ready summary.
      </p>

      <p className="mt-4 rounded-md border border-slate-700 bg-slate-800/40 px-4 py-3 text-sm text-slate-400">
        Analyzed in memory, never stored. Nothing you paste leaves this session.
      </p>

      <textarea
        className="mt-6 h-64 w-full rounded-md border border-slate-700 bg-slate-900 p-4 text-sm text-slate-100 outline-none focus:border-slate-500"
        placeholder="Paste your AI policy, vendor claims, or model card here..."
        value={doc}
        onChange={(e) => setDoc(e.target.value)}
      />

      <button
        className="mt-4 rounded-md bg-emerald-600 px-5 py-2.5 font-medium text-white disabled:opacity-50"
        onClick={analyze}
        disabled={loading || doc.trim().length < 40}
      >
        {loading ? 'Analyzing...' : 'Red team it'}
      </button>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      {data?.pii.found && (
        <p className="mt-4 text-sm text-amber-300">
          We spotted what looks like PII ({data.pii.types.join(', ')}). You can redact it; the
          analysis works on the policy language alone.
        </p>
      )}

      {result && (
        <section className="mt-10">
          <div className="flex items-baseline gap-4">
            <span className={`text-4xl font-bold ${BAND_STYLE[result.band]}`}>{result.band}</span>
            <button
              className="text-sm text-slate-400 underline"
              onClick={() => setShowScore((s) => !s)}
            >
              {showScore ? `Score: ${result.score}/100` : 'Show score'}
            </button>
          </div>

          <p className="mt-3 text-lg text-slate-100">{result.verdict}</p>

          <h2 className="mt-8 text-xl font-semibold text-white">Top gaps</h2>
          <ul className="mt-3 space-y-3">
            {result.gaps.map((g, i) => (
              <li key={i} className={`rounded-md border bg-slate-800/30 p-4 ${SEVERITY_STYLE[g.severity]}`}>
                <div className="text-xs uppercase tracking-wide">
                  {g.severity} · {g.framework}
                </div>
                <div className="mt-1 text-slate-100">{g.finding}</div>
                <div className="mt-2 text-sm text-slate-300">Fix: {g.fix}</div>
              </li>
            ))}
          </ul>

          <h2 className="mt-8 text-xl font-semibold text-white">Board-ready summary</h2>
          <p className="mt-2 text-slate-200">{result.boardSummary}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              className="rounded-md border border-slate-600 px-4 py-2 text-sm text-slate-200"
              onClick={() => copySummary(result.boardSummary)}
            >
              {copied ? 'Copied' : 'Copy summary'}
            </button>
            <a
              className="rounded-md border border-slate-600 px-4 py-2 text-sm text-slate-200"
              href={cardHref(result)}
              download="ai-policy-red-team.png"
              target="_blank"
              rel="noreferrer"
            >
              Download card
            </a>
          </div>

          <p className="mt-6 text-xs text-slate-500">Graded by {data.model}.</p>
        </section>
      )}
    </main>
  )
}
