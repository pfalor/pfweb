'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { navigationItems } from '@/lib/data'

interface CommandPaletteProps {
  onOpenTerminal: () => void
}

interface Command {
  id: string
  label: string
  shortcut?: string
  action: () => void
  category: string
}

export function CommandPalette({ onOpenTerminal }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const commands: Command[] = [
    ...navigationItems.map((item) => ({
      id: item.href,
      label: `Go to ${item.label}`,
      action: () => {
        document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' })
        setIsOpen(false)
      },
      category: 'Navigation',
    })),
    {
      id: 'terminal',
      label: 'Open Terminal Mode',
      shortcut: 'hack',
      action: () => {
        setIsOpen(false)
        onOpenTerminal()
      },
      category: 'Features',
    },
    {
      id: 'top',
      label: 'Scroll to Top',
      action: () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setIsOpen(false)
      },
      category: 'Navigation',
    },
    {
      id: 'linkedin',
      label: 'Open LinkedIn Profile',
      action: () => {
        window.open('https://www.linkedin.com/in/paulfalor', '_blank')
        setIsOpen(false)
      },
      category: 'Links',
    },
    {
      id: 'email',
      label: 'Send Email',
      action: () => {
        window.location.href = 'mailto:paul@paulfalor.com'
        setIsOpen(false)
      },
      category: 'Links',
    },
  ]

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(search.toLowerCase()) ||
    cmd.shortcut?.toLowerCase() === search.toLowerCase()
  )

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Open command palette
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      setIsOpen((prev) => !prev)
      setSearch('')
      setSelectedIndex(0)
    }

    // Close on escape
    if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }, [])

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
      filteredCommands[selectedIndex].action()
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    setSelectedIndex(0)
  }, [search])

  // Check for "hack" easter egg
  useEffect(() => {
    if (search.toLowerCase() === 'hack') {
      onOpenTerminal()
      setIsOpen(false)
      setSearch('')
    }
  }, [search, onOpenTerminal])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Command palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg z-50 px-4"
          >
            <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-700">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent text-white placeholder:text-slate-500 focus:outline-none"
                />
                <kbd className="hidden sm:inline-block px-2 py-1 text-xs bg-slate-700 text-slate-400 rounded">
                  ESC
                </kbd>
              </div>

              {/* Commands list */}
              <div className="max-h-80 overflow-y-auto py-2">
                {filteredCommands.length === 0 ? (
                  <div className="px-4 py-8 text-center text-slate-500">
                    No commands found
                  </div>
                ) : (
                  <>
                    {/* Group by category */}
                    {['Navigation', 'Features', 'Links'].map((category) => {
                      const categoryCommands = filteredCommands.filter((cmd) => cmd.category === category)
                      if (categoryCommands.length === 0) return null

                      return (
                        <div key={category}>
                          <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase">
                            {category}
                          </div>
                          {categoryCommands.map((cmd) => {
                            const index = filteredCommands.indexOf(cmd)
                            return (
                              <button
                                key={cmd.id}
                                onClick={cmd.action}
                                onMouseEnter={() => setSelectedIndex(index)}
                                className={`w-full flex items-center justify-between px-4 py-3 text-left
                                  ${index === selectedIndex
                                    ? 'bg-accent/20 text-white'
                                    : 'text-slate-300 hover:bg-slate-700/50'
                                  }`}
                              >
                                <span>{cmd.label}</span>
                                {cmd.shortcut && (
                                  <span className="text-xs text-slate-500 font-mono">
                                    {cmd.shortcut}
                                  </span>
                                )}
                              </button>
                            )
                          })}
                        </div>
                      )
                    })}
                  </>
                )}
              </div>

              {/* Footer hint */}
              <div className="px-4 py-3 border-t border-slate-700 flex items-center justify-between text-xs text-slate-500">
                <span>
                  <kbd className="px-1.5 py-0.5 bg-slate-700 rounded mr-1">↑↓</kbd>
                  to navigate
                </span>
                <span>
                  <kbd className="px-1.5 py-0.5 bg-slate-700 rounded mr-1">↵</kbd>
                  to select
                </span>
                <span className="hidden sm:inline">
                  Type <span className="font-mono text-accent">hack</span> for terminal
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
