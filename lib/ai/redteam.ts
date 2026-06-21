// ============================================================================
// RED TEAM YOUR AI POLICY — analysis module
// ============================================================================
// Grades a pasted AI policy / vendor claims / model card against industry
// frameworks. The pasted document is ALWAYS treated as untrusted data, never as
// instructions. Routes through the Vercel AI Gateway (Sonnet, Haiku fallback),
// mirroring lib/ai/advisor.ts.
// ============================================================================

export function truncateDocument(
  text: string,
  max = 12000
): { text: string; truncated: boolean } {
  if (text.length <= max) return { text, truncated: false }
  return { text: text.slice(0, max), truncated: true }
}
