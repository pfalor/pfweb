'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export function Card({ children, className = '', hover = true, onClick }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`
        bg-slate-800/50 backdrop-blur-sm border border-slate-700/50
        rounded-xl p-6
        ${hover ? 'cursor-pointer hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  )
}

interface GlassCardProps {
  children: ReactNode
  className?: string
}

export function GlassCard({ children, className = '' }: GlassCardProps) {
  return (
    <div className={`
      bg-white/5 backdrop-blur-md border border-white/10
      rounded-2xl p-6
      ${className}
    `}>
      {children}
    </div>
  )
}
