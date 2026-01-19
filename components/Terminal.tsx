'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { terminalCommands } from '@/lib/data'

interface TerminalProps {
  isOpen: boolean
  onClose: () => void
}

interface HistoryItem {
  command: string
  output: string
}

export function Terminal({ isOpen, onClose }: TerminalProps) {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase()

    let output = ''

    switch (trimmedCmd) {
      case 'help':
        output = terminalCommands.help
        break
      case 'whoami':
        output = terminalCommands.whoami
        break
      case 'skills':
        output = terminalCommands.skills
        break
      case 'exp':
      case 'experience':
        output = terminalCommands.exp
        break
      case 'contact':
        output = terminalCommands.contact
        break
      case 'clear':
        setHistory([])
        return
      case 'exit':
        onClose()
        return
      case '':
        return
      default:
        output = `Command not found: ${cmd}\nType 'help' for available commands.`
    }

    setHistory((prev) => [...prev, { command: cmd, output }])
    setCommandHistory((prev) => [...prev, cmd])
    setHistoryIndex(-1)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    executeCommand(input)
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '')
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '')
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setInput('')
      }
    }
  }

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && history.length === 0) {
      setHistory([{
        command: '',
        output: `Welcome to Paul Falor's Terminal
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type 'help' for available commands.
Type 'exit' or press ESC to close.`
      }])
    }
  }, [isOpen, history.length])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Terminal window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[10%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4"
          >
            <div className="bg-[#0d1117] border border-slate-700 rounded-lg shadow-2xl overflow-hidden">
              {/* Title bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="flex gap-2">
                    <button
                      onClick={onClose}
                      className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
                    />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="ml-4 text-sm text-slate-400 font-mono">paul@paulfalor.com ~ terminal</span>
                </div>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Terminal content */}
              <div
                ref={terminalRef}
                className="p-4 h-96 overflow-y-auto font-mono text-sm"
                onClick={() => inputRef.current?.focus()}
              >
                {/* History */}
                {history.map((item, index) => (
                  <div key={index} className="mb-4">
                    {item.command && (
                      <div className="flex items-center gap-2 text-slate-300">
                        <span className="text-green-400">$</span>
                        <span>{item.command}</span>
                      </div>
                    )}
                    <pre className="text-slate-400 whitespace-pre-wrap mt-1">{item.output}</pre>
                  </div>
                ))}

                {/* Input line */}
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                  <span className="text-green-400">$</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent text-slate-300 focus:outline-none"
                    autoComplete="off"
                    spellCheck={false}
                  />
                  <span className="cursor-blink text-slate-300" />
                </form>
              </div>

              {/* Status bar */}
              <div className="px-4 py-2 bg-[#161b22] border-t border-slate-700 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>Type &apos;help&apos; for commands</span>
                <span>ESC to close</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
