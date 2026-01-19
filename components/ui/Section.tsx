'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface SectionProps {
  id?: string
  children: ReactNode
  className?: string
  fullWidth?: boolean
}

export function Section({ id, children, className = '', fullWidth = false }: SectionProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      className={`py-20 md:py-28 ${fullWidth ? '' : 'px-6 md:px-8'} ${className}`}
    >
      <div className={fullWidth ? '' : 'max-w-6xl mx-auto'}>
        {children}
      </div>
    </motion.section>
  )
}

export function SectionTitle({ children, subtitle }: { children: ReactNode; subtitle?: string }) {
  return (
    <div className="mb-12 md:mb-16">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{children}</h2>
      {subtitle && (
        <p className="text-lg text-slate-400 max-w-2xl">{subtitle}</p>
      )}
    </div>
  )
}
