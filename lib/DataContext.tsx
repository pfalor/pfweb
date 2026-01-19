'use client'

import { createContext, useContext, ReactNode } from 'react'
import type { ResumeData } from './resume-types'

const DataContext = createContext<ResumeData | null>(null)

export function DataProvider({
  children,
  data
}: {
  children: ReactNode
  data: ResumeData
}) {
  return (
    <DataContext.Provider value={data}>
      {children}
    </DataContext.Provider>
  )
}

export function useResumeData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useResumeData must be used within a DataProvider')
  }
  return context
}
