'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type AIProvider = 'openai' | 'anthropic'
type AIAction = 'rewrite' | 'generate' | 'suggest'

interface AIToolbarProps {
  content: string
  onRewrite: (newContent: string) => void
  provider: AIProvider
  context?: string
  disabled?: boolean
}

export function AIToolbar({ content, onRewrite, provider, context, disabled }: AIToolbarProps) {
  const [isLoading, setIsLoading] = useState<AIAction | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<string | null>(null)

  const handleAIAction = async (action: AIAction) => {
    if (!content.trim()) {
      setError('No content to process')
      return
    }

    setIsLoading(action)
    setError(null)
    setSuggestions(null)

    try {
      const res = await fetch('/api/admin/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          content,
          provider,
          context,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'AI request failed')
      }

      if (action === 'suggest') {
        setSuggestions(data.result)
      } else {
        onRewrite(data.result)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI request failed')
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleAIAction('rewrite')}
          disabled={disabled || isLoading !== null}
          className="px-3 py-1.5 bg-accent/20 hover:bg-accent/30 text-accent text-sm rounded-md
                   transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
        >
          {isLoading === 'rewrite' ? (
            <LoadingSpinner />
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
          Rewrite
        </button>

        <button
          onClick={() => handleAIAction('suggest')}
          disabled={disabled || isLoading !== null}
          className="px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 text-sm rounded-md
                   transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
        >
          {isLoading === 'suggest' ? (
            <LoadingSpinner />
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          )}
          Suggest
        </button>

        <span className="text-xs text-slate-500 ml-2">
          Using {provider === 'openai' ? 'GPT-4o' : 'Claude'}
        </span>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2"
          >
            {error}
          </motion.div>
        )}

        {suggestions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-purple-500/10 border border-purple-500/20 rounded-md p-3"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-400 text-sm font-medium">AI Suggestions</span>
              <button
                onClick={() => setSuggestions(null)}
                className="text-slate-500 hover:text-slate-300 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="text-sm text-slate-300 whitespace-pre-wrap">{suggestions}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function LoadingSpinner() {
  return (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  )
}

interface GenerateButtonProps {
  onGenerate: (content: string) => void
  provider: AIProvider
  context?: string
  placeholder?: string
}

export function GenerateButton({ onGenerate, provider, context, placeholder = 'Describe what to generate...' }: GenerateButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/admin/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate',
          content: prompt,
          provider,
          context,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Generation failed')
      }

      onGenerate(data.result)
      setPrompt('')
      setIsOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 text-sm rounded-md
                 transition-colors flex items-center gap-1.5"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Generate
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-lg p-3 z-10 shadow-xl"
          >
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={placeholder}
              className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-md
                       text-white text-sm placeholder-slate-500 focus:outline-none focus:border-accent
                       resize-none"
              rows={3}
              autoFocus
            />

            {error && (
              <p className="text-red-400 text-xs mt-2">{error}</p>
            )}

            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-3 py-1.5 text-slate-400 hover:text-white text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={isLoading || !prompt.trim()}
                className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-sm rounded-md
                         transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                {isLoading && <LoadingSpinner />}
                Generate
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
