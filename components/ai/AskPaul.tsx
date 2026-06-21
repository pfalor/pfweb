'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Safety {
  injectionDetected: boolean
  attackType: string | null
  piiFound: boolean
  piiTypes: string[]
}

interface Meta {
  citations: string[]
  onScope: boolean
  model: string
  routedReason: string
  safety: Safety
}

interface Msg {
  role: 'user' | 'assistant'
  content: string
  meta?: Meta
  error?: boolean
}

const STARTERS = [
  'What does Paul mean by "shrinking the blast radius"?',
  'How should enterprises secure GenAI adoption?',
  'What is Paul\'s take on AI in the SOC?',
]

export function AskPaul() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [redTeam, setRedTeam] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  async function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed || loading) return
    const userMsg: Msg = { role: 'user', content: trimmed }
    const history = messages.map((m) => ({ role: m.role, content: m.content }))
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, history, redTeam }),
      })
      const data = await res.json()
      if (!res.ok) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.error || 'Something went wrong.', error: true }])
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.answer,
            meta: {
              citations: data.citations ?? [],
              onScope: data.onScope,
              model: data.model,
              routedReason: data.routedReason,
              safety: data.safety,
            },
          },
        ])
      }
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Network error. Please try again.', error: true }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Launcher */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.4 }}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-full
                   bg-accent hover:bg-accent/90 text-white font-medium shadow-lg shadow-accent/20
                   transition-colors duration-200"
        aria-label="Ask Paul's AI assistant"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {open ? 'Close' : 'Ask Paul'}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-5 z-50 w-[calc(100vw-2.5rem)] sm:w-[420px] h-[600px] max-h-[calc(100vh-7rem)]
                       flex flex-col bg-primary-900 border border-slate-700/70 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-700/60 bg-slate-800/40">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-semibold text-sm">Ask Paul</div>
                  <div className="text-[11px] text-slate-400">Grounded AI assistant · answers only from Paul&apos;s work</div>
                </div>
                <label className="flex items-center gap-1.5 cursor-pointer select-none" title="Try to jailbreak the assistant and watch the guardrails respond">
                  <span className="text-[11px] text-slate-400">Red team</span>
                  <button
                    type="button"
                    onClick={() => setRedTeam((r) => !r)}
                    className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${redTeam ? 'bg-rose-500/80' : 'bg-slate-600'}`}
                    aria-pressed={redTeam}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${redTeam ? 'translate-x-4' : ''}`} />
                  </button>
                </label>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.length === 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-slate-400">
                    Ask about Paul&apos;s perspective on securing AI, defending with AI, or data protection. Answers are grounded in his published work, with sources shown.
                  </p>
                  <div className="space-y-2">
                    {STARTERS.map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="block w-full text-left text-sm text-slate-300 bg-slate-800/50 hover:bg-slate-800
                                   border border-slate-700/50 hover:border-accent/40 rounded-lg px-3 py-2 transition-colors duration-150"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={m.role === 'user' ? 'flex justify-end' : ''}>
                  {m.role === 'user' ? (
                    <div className="max-w-[85%] bg-accent/90 text-white text-sm rounded-2xl rounded-br-sm px-3.5 py-2">
                      {m.content}
                    </div>
                  ) : (
                    <div className="max-w-full">
                      <div className={`text-sm leading-relaxed rounded-2xl rounded-bl-sm px-3.5 py-2.5 ${m.error ? 'bg-rose-950/40 text-rose-200 border border-rose-800/40' : 'bg-slate-800/60 text-slate-200'}`}>
                        <div className="prose prose-invert prose-sm max-w-none prose-p:my-1.5 prose-li:my-0.5 prose-a:text-accent">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                        </div>
                      </div>
                      {m.meta && <TransparencyPanel meta={m.meta} />}
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => { e.preventDefault(); send(input) }}
              className="p-3 border-t border-slate-700/60 bg-slate-800/30"
            >
              <div className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input) }
                  }}
                  placeholder={redTeam ? 'Try to jailbreak the assistant...' : 'Ask about Paul\'s work...'}
                  rows={1}
                  maxLength={1000}
                  className="flex-1 resize-none bg-slate-900/70 border border-slate-700/60 focus:border-accent/60 rounded-lg
                             px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none max-h-24"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-accent hover:bg-accent/90
                             disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors duration-150"
                  aria-label="Send"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <p className="mt-1.5 text-[10px] text-slate-600">AI representation of Paul, grounded in his published work. Not legal or security advice.</p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function Chip({ tone, children }: { tone: 'ok' | 'warn' | 'info' | 'model'; children: React.ReactNode }) {
  const styles = {
    ok: 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40',
    warn: 'bg-rose-950/40 text-rose-300 border-rose-800/40',
    info: 'bg-slate-800/60 text-slate-300 border-slate-700/50',
    model: 'bg-accent/10 text-accent border-accent/30',
  }[tone]
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border ${styles}`}>
      {children}
    </span>
  )
}

function TransparencyPanel({ meta }: { meta: Meta }) {
  return (
    <div className="mt-2 flex flex-wrap gap-1.5 px-1">
      <Chip tone="model">⚙ {meta.model}</Chip>
      {meta.onScope ? <Chip tone="ok">✓ On-scope</Chip> : <Chip tone="info">↪ Off-scope, declined</Chip>}
      <Chip tone={meta.safety.piiFound ? 'warn' : 'ok'}>
        {meta.safety.piiFound ? '⚠ PII detected (not stored)' : '✓ No PII'}
      </Chip>
      {meta.safety.injectionDetected && (
        <Chip tone="warn">🛡 Blocked: {meta.safety.attackType}</Chip>
      )}
      {meta.citations.map((c) => (
        <Chip key={c} tone="info">📎 {c}</Chip>
      ))}
      <div className="w-full text-[10px] text-slate-500 mt-0.5">{meta.routedReason}</div>
    </div>
  )
}
