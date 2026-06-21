'use client'

import { useState } from 'react'
import type { VulnerableResult, HardenedResult, PlaygroundTurn } from '@/lib/ai/playground'
import { encodePlaygroundParams, type PlaygroundCardData } from '@/lib/playground-card'

interface ApiResponse {
  vulnerable: VulnerableResult
  hardened: HardenedResult
  injection: { detected: boolean; attackType: string | null }
}

export default function PlaygroundClient({
  starterAttacks,
}: {
  starterAttacks: { label: string; prompt: string }[]
}) {
  const [message, setMessage] = useState('')
  const [vulnHistory, setVulnHistory] = useState<PlaygroundTurn[]>([])
  const [hardHistory, setHardHistory] = useState<PlaygroundTurn[]>([])
  const [vuln, setVuln] = useState<VulnerableResult | null>(null)
  const [hard, setHard] = useState<HardenedResult | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [cracked, setCracked] = useState(false)
  const [breached, setBreached] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [copyFailed, setCopyFailed] = useState(false)

  async function attack(attackText: string) {
    const text = attackText.trim()
    if (!text || loading) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/ai/playground', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: text, vulnerableHistory: vulnHistory, hardenedHistory: hardHistory }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? 'Something went wrong.')
        return
      }
      const data = json as ApiResponse
      setVuln(data.vulnerable)
      setHard(data.hardened)
      setAttempts((n) => n + 1)
      if (data.vulnerable.leaked) setCracked(true)
      if (data.hardened.leaked) setBreached(true)
      setVulnHistory((prev) => [...prev, { role: 'user', content: text }, { role: 'assistant', content: data.vulnerable.reply }])
      setHardHistory((prev) => [...prev, { role: 'user', content: text }, { role: 'assistant', content: data.hardened.reply }])
      setMessage('')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setMessage('')
    setVulnHistory([])
    setHardHistory([])
    setVuln(null)
    setHard(null)
    setAttempts(0)
    setCracked(false)
    setBreached(false)
    setError(null)
  }

  function cardHref(): string {
    const card: PlaygroundCardData = { attempts, crackedVulnerable: cracked, hardenedHeld: !breached }
    return `/api/og/playground?${encodePlaygroundParams(card)}`
  }

  async function copyCard() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/playground`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopyFailed(true)
      setTimeout(() => setCopyFailed(false), 2000)
    }
  }

  const hardenedBadge = hard
    ? hard.blockedLayer === 'input'
      ? `Blocked at Layer 1 (input guardrail): ${hard.technique}`
      : hard.blockedLayer === 'output'
        ? 'Blocked at Layer 3 (output filter)'
        : 'Handled by Layer 2 (defensive prompt)'
    : null

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 text-slate-200">
      <h1 className="text-3xl font-bold text-white">Prompt Injection Playground</h1>
      <p className="mt-3 max-w-3xl text-slate-400">
        Two AI assistants below share the same secret code. The one on the left has no defenses. The
        one on the right is hardened with real layered controls. Your job is to trick them into
        leaking the secret. The secret is fake, so nothing real is at stake.
      </p>

      <div className="mt-6">
        <textarea
          className="h-24 w-full rounded-md border border-slate-700 bg-slate-900 p-3 text-sm text-slate-100 outline-none focus:border-slate-500"
          placeholder="Type an attack, or pick a starter below..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            className="rounded-md bg-emerald-600 px-5 py-2 font-medium text-white disabled:opacity-50"
            onClick={() => attack(message)}
            disabled={loading || message.trim().length === 0}
          >
            {loading ? 'Attacking...' : 'Attack both'}
          </button>
          <span className="text-sm text-slate-500">Attempts: {attempts}</span>
          {cracked && <span className="text-sm text-red-400">Vulnerable bot cracked</span>}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {starterAttacks.map((a) => (
            <button
              key={a.label}
              onClick={() => attack(a.prompt)}
              disabled={loading}
              className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:border-slate-500 disabled:opacity-50"
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-md border border-red-500/40 bg-slate-800/30 p-5">
          <h2 className="text-lg font-semibold text-red-300">Vulnerable bot</h2>
          <p className="mt-1 text-xs text-slate-500">No defenses</p>
          <div className="mt-4 min-h-[6rem] whitespace-pre-wrap text-slate-100">
            {vuln ? vuln.reply : 'Awaiting your first attack.'}
          </div>
          {vuln?.leaked && <p className="mt-3 text-sm font-medium text-red-400">Secret leaked.</p>}
        </div>

        <div className="rounded-md border border-emerald-500/40 bg-slate-800/30 p-5">
          <h2 className="text-lg font-semibold text-emerald-300">Hardened bot</h2>
          <p className="mt-1 text-xs text-slate-500">Input guardrail, defensive prompt, output filter</p>
          <div className="mt-4 min-h-[6rem] whitespace-pre-wrap text-slate-100">
            {hard ? hard.reply : 'Awaiting your first attack.'}
          </div>
          {hardenedBadge && <p className="mt-3 text-sm text-emerald-300">{hardenedBadge}</p>}
        </div>
      </div>

      {attempts > 0 && (
        <div className="mt-8 flex flex-wrap gap-3">
          <button className="rounded-md border border-slate-600 px-4 py-2 text-sm text-slate-200" onClick={copyCard}>
            {copyFailed ? 'Copy failed' : copied ? 'Link copied' : 'Copy link'}
          </button>
          <a
            className="rounded-md border border-slate-600 px-4 py-2 text-sm text-slate-200"
            href={cardHref()}
            download="prompt-injection-playground.png"
            target="_blank"
            rel="noreferrer"
          >
            Download card
          </a>
          <button className="rounded-md border border-slate-600 px-4 py-2 text-sm text-slate-200" onClick={reset}>
            Start over
          </button>
        </div>
      )}
    </main>
  )
}
