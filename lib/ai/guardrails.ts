// ============================================================================
// GUARDRAILS
// ============================================================================
// Lightweight, deterministic input checks that run before the model call.
// These power the transparency panel ("scope check", "no PII") and lay the
// groundwork for the "Red Team It" demo. They are a first line, not the only
// line — the system prompt also instructs the model to refuse manipulation.
// ============================================================================

export interface InjectionResult {
  detected: boolean
  attackType: string | null
  matched: string | null
}

// Common direct prompt-injection / jailbreak patterns. Intentionally readable
// so the Red Team demo can explain WHAT it caught and WHY.
const INJECTION_PATTERNS: { type: string; re: RegExp }[] = [
  { type: 'Instruction override', re: /\b(ignore|disregard|forget)\b.{0,30}\b(previous|prior|above|earlier|all)\b.{0,20}\b(instructions?|prompts?|rules?|context)\b/i },
  { type: 'System prompt extraction', re: /\b(show|reveal|print|repeat|output|tell me|what (is|are))\b.{0,40}\b(system prompt|your (instructions?|prompt|rules|guidelines)|initial prompt)\b/i },
  { type: 'Role / persona override', re: /\b(you are now|act as|pretend (to be|you)|from now on you|new persona|roleplay as)\b/i },
  { type: 'Jailbreak (DAN-style)', re: /\b(DAN|do anything now|developer mode|jailbreak|no restrictions|without any (rules|filter|guardrails?))\b/i },
  { type: 'Guardrail bypass', re: /\b(bypass|override|turn off|disable)\b.{0,25}\b(safety|guardrails?|filters?|restrictions?|rules?)\b/i },
  { type: 'Instruction injection via delimiter', re: /(\[\/?(system|inst|assistant)\]|<\/?(system|instructions?)>|###\s*system)/i },
]

export function detectInjection(input: string): InjectionResult {
  for (const p of INJECTION_PATTERNS) {
    const m = input.match(p.re)
    if (m) return { detected: true, attackType: p.type, matched: m[0] }
  }
  return { detected: false, attackType: null, matched: null }
}

export interface PiiResult {
  found: boolean
  types: string[]
}

const PII_PATTERNS: { type: string; re: RegExp }[] = [
  { type: 'email', re: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i },
  { type: 'phone', re: /(\+?\d{1,2}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/ },
  { type: 'SSN', re: /\b\d{3}-\d{2}-\d{4}\b/ },
  { type: 'credit card', re: /\b(?:\d[ -]?){13,16}\b/ },
]

export function detectPii(input: string): PiiResult {
  const types = PII_PATTERNS.filter((p) => p.re.test(input)).map((p) => p.type)
  return { found: types.length > 0, types }
}
