// ============================================================================
// GROUNDED KNOWLEDGE BASE
// ============================================================================
// Assembles a single curated context string from the site's own content
// (lib/data.ts + lib/insights.ts). The "Ask Paul" advisor answers ONLY from
// this corpus and cites the section labels defined here. Context-stuffing, not
// a vector DB — the corpus is small enough to fit in one prompt.
// ============================================================================

import { personalInfo, practiceAreas, experience, credentials, education, stats } from './../data'
import { insights } from './../insights'

// Canonical citation labels. The model is instructed to cite using these exact
// strings, so the transparency panel can render reliable source chips.
export const SOURCE_LABELS = {
  about: 'About — role & background',
  ...Object.fromEntries(practiceAreas.map((p) => [p.id, `Practice Area: ${p.title}`])),
  ...Object.fromEntries(insights.map((i) => [i.slug, `Insight: ${i.title}`])),
  experience: 'Experience & track record',
} as const

export function buildKnowledgeBase(): string {
  const parts: string[] = []

  // --- About ---
  parts.push(`## [${SOURCE_LABELS.about}]
Name: ${personalInfo.name}
Title: ${personalInfo.title}
Location: ${personalInfo.location}
Summary: ${personalInfo.summary}
Credentials: ${credentials.map((c) => `${c.label} (${c.subtitle})`).join('; ')}
At-a-glance: ${stats.map((s) => `${s.prefix ?? ''}${s.value}${s.suffix} ${s.label}`).join('; ')}
Education: ${education.map((e) => `${e.degree}, ${e.school} (${e.year})`).join('; ')}`)

  // --- Practice areas ---
  for (const p of practiceAreas) {
    parts.push(`## [${SOURCE_LABELS[p.id as keyof typeof SOURCE_LABELS]}]
Headline: ${p.headline}
${p.description}
Track record: ${p.outcomes.join(' | ')}`)
  }

  // --- Experience ---
  parts.push(`## [${SOURCE_LABELS.experience}]
${experience
  .map((e) => `${e.role}, ${e.company} (${e.period}): ${e.highlights.join(' ')}`)
  .join('\n')}`)

  // --- Insights / POVs (full text) ---
  for (const i of insights) {
    parts.push(`## [${SOURCE_LABELS[i.slug as keyof typeof SOURCE_LABELS]}]
Thesis: ${i.dek}
${i.body}`)
  }

  return parts.join('\n\n')
}

// The list of valid citation labels, for prompt instructions + validation.
export function citationLabels(): string[] {
  return Object.values(SOURCE_LABELS)
}
