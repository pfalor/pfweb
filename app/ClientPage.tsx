'use client'

import { useState } from 'react'
import { DataProvider } from '@/lib/DataContext'
import { Hero } from '@/components/Hero'
import { Summary } from '@/components/Summary'
import { PracticeAreas } from '@/components/PracticeAreas'
import { ThoughtLeadership } from '@/components/ThoughtLeadership'
import { Metrics } from '@/components/Metrics'
import { Timeline } from '@/components/Timeline'
import { Education } from '@/components/Education'
import { Contact } from '@/components/Contact'
import { CommandPalette } from '@/components/CommandPalette'
import { Terminal } from '@/components/Terminal'
import type { ResumeData } from '@/lib/resume-types'

interface ClientPageProps {
  data: ResumeData
}

export function ClientPage({ data }: ClientPageProps) {
  const [terminalOpen, setTerminalOpen] = useState(false)

  return (
    <DataProvider data={data}>
      <main className="min-h-screen bg-primary-900">
        {/* Command Palette */}
        <CommandPalette onOpenTerminal={() => setTerminalOpen(true)} />

        {/* Terminal Easter Egg */}
        <Terminal isOpen={terminalOpen} onClose={() => setTerminalOpen(false)} />

        {/* Main Content */}
        <Hero />
        <Summary />
        <PracticeAreas />
        <ThoughtLeadership />
        <Metrics />
        <Timeline />
        <Education />
        <Contact />
      </main>
    </DataProvider>
  )
}
