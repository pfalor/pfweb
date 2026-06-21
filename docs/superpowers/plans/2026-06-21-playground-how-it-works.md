# Playground "How this works" Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a collapsible "How this works" panel to `/playground` that reveals both system prompts (secret redacted) and the three hardened defense layers, framed honestly around in-context/system-prompt leakage.

**Architecture:** The page (a server component) assembles a `recipe` object with the secret already redacted server-side and passes it to the client as a prop, the same way `STARTER_ATTACKS` is passed today. Two new pure helpers expose the data: `redactSecret` (in `lib/ai/playground.ts`) and `injectionPatterns` (in `lib/ai/guardrails.ts`). The client renders a native `<details>` disclosure. No new model calls, no storage, and the secret never reaches the browser.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind, Vitest (already configured).

## Global Constraints

- **No em dashes** in any visitor-facing copy; no AI-tell vocabulary. (CLAUDE.md.)
- **The secret must never reach the browser.** All prompt text shown on the page is redacted server-side (`FLAG-SWORDFISH-2026` becomes `{{SECRET}}`) before it is passed to the client. The controller smoke test confirms `FLAG-SWORDFISH` is absent from the served `/playground` HTML and from `.next/static`.
- **No `dangerouslySetInnerHTML`.** All recipe text renders as escaped React children.
- **Do NOT import `lib/ai/playground.ts` or `lib/ai/guardrails.ts` into the client component.** The server `page.tsx` builds the `recipe` and passes it as a plain-data prop; the client receives only strings/arrays.
- Dev server runs on port **42069** (`npm run dev`).

---

### Task 1: Expose redacted recipe data (`redactSecret`, `OUTPUT_BLOCK_MESSAGE`, `injectionPatterns`)

Two pure helpers and one export, with unit tests. These let the server page assemble the panel data without the secret leaking.

**Files:**
- Modify: `lib/ai/playground.ts` (export `OUTPUT_BLOCK_MESSAGE`; add `redactSecret`)
- Test: `lib/ai/playground.test.ts` (append `redactSecret` tests)
- Modify: `lib/ai/guardrails.ts` (add `injectionPatterns`)
- Test: `lib/ai/guardrails.test.ts` (create; test `injectionPatterns`)

**Interfaces:**
- Consumes: `SECRET` (existing, `lib/ai/playground.ts`); `INJECTION_PATTERNS` (existing private const, `lib/ai/guardrails.ts`).
- Produces:
  - `redactSecret(text: string): string` — replaces every occurrence of `SECRET` with the literal `{{SECRET}}`.
  - `OUTPUT_BLOCK_MESSAGE: string` (now exported).
  - `injectionPatterns(): { type: string; source: string }[]` — `INJECTION_PATTERNS` as display data.

- [ ] **Step 1: Write the failing test for `redactSecret`**

The existing `lib/ai/playground.test.ts` already imports `SECRET`, `vulnerableSystemPrompt`, and `hardenedSystemPrompt` from `./playground` (from the original playground build). Add `redactSecret` and `OUTPUT_BLOCK_MESSAGE` to that existing top import statement (do not create a second `from './playground'` import). Then append this `describe` block to the file:
```ts
describe('redactSecret', () => {
  it('replaces the secret with the {{SECRET}} placeholder', () => {
    expect(redactSecret(`the code is ${SECRET}`)).toBe('the code is {{SECRET}}')
  })
  it('replaces every occurrence', () => {
    expect(redactSecret(`${SECRET} and ${SECRET}`)).toBe('{{SECRET}} and {{SECRET}}')
  })
  it('leaves text without the secret unchanged', () => {
    expect(redactSecret('no secret here')).toBe('no secret here')
  })
  it('redacts the secret out of the real system prompts', () => {
    expect(redactSecret(vulnerableSystemPrompt())).not.toContain(SECRET)
    expect(redactSecret(hardenedSystemPrompt())).not.toContain(SECRET)
  })
  it('exposes the output block message as a non-empty string', () => {
    expect(typeof OUTPUT_BLOCK_MESSAGE).toBe('string')
    expect(OUTPUT_BLOCK_MESSAGE.length).toBeGreaterThan(0)
  })
})
```
If `SECRET`, `vulnerableSystemPrompt`, or `hardenedSystemPrompt` is somehow not already imported in the file, add it to the existing import.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `redactSecret` / `OUTPUT_BLOCK_MESSAGE` are not exported.

- [ ] **Step 3: Implement in `lib/ai/playground.ts`**

Change the `OUTPUT_BLOCK_MESSAGE` declaration to export it:
```ts
export const OUTPUT_BLOCK_MESSAGE =
  'I cannot share that. (Output filter, Layer 3: the protected value appeared in my response, so it was blocked before leaving the server.)'
```

Add `redactSecret` immediately after the `containsSecret` function (so it sits with the other secret helpers):
```ts
// Replace the secret with a placeholder so prompt text can be shown on the page
// without leaking the value. Used server-side before passing prompts to the client.
export function redactSecret(text: string): string {
  return text.split(SECRET).join('{{SECRET}}')
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS (the new `redactSecret` block plus all existing suites).

- [ ] **Step 5: Write the failing test for `injectionPatterns`**

Create `lib/ai/guardrails.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { injectionPatterns } from './guardrails'

describe('injectionPatterns', () => {
  it('returns a non-empty list of { type, source } entries', () => {
    const patterns = injectionPatterns()
    expect(patterns.length).toBeGreaterThanOrEqual(6)
    for (const p of patterns) {
      expect(typeof p.type).toBe('string')
      expect(p.type.length).toBeGreaterThan(0)
      expect(typeof p.source).toBe('string')
      expect(p.source.length).toBeGreaterThan(0)
    }
  })
  it('includes known attack types', () => {
    const types = injectionPatterns().map((p) => p.type)
    expect(types).toContain('Instruction override')
    expect(types).toContain('System prompt extraction')
  })
})
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot find `injectionPatterns` in `./guardrails`.

- [ ] **Step 7: Implement in `lib/ai/guardrails.ts`**

Add, immediately after the `detectInjection` function:
```ts
// Read-only view of the injection patterns for display ("how this works" panel).
// The patterns are non-sensitive (OWASP-style) and already implied by behavior.
export function injectionPatterns(): { type: string; source: string }[] {
  return INJECTION_PATTERNS.map((p) => ({ type: p.type, source: p.re.source }))
}
```

- [ ] **Step 8: Run tests to verify they pass**

Run: `npm test`
Expected: PASS (all suites).

- [ ] **Step 9: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 10: Commit**

```bash
git add lib/ai/playground.ts lib/ai/playground.test.ts lib/ai/guardrails.ts lib/ai/guardrails.test.ts
git commit -m "feat: expose redactSecret, OUTPUT_BLOCK_MESSAGE, injectionPatterns for the recipe panel"
```

---

### Task 2: Assemble the `recipe` prop and render the "How this works" panel

The server page builds the redacted recipe; the client renders a collapsible disclosure. Verified by controller smoke test (including the redaction check).

**Files:**
- Modify: `app/playground/page.tsx`
- Modify: `app/playground/PlaygroundClient.tsx`

**Interfaces:**
- Consumes: `redactSecret`, `vulnerableSystemPrompt`, `hardenedSystemPrompt`, `OUTPUT_BLOCK_MESSAGE`, `STARTER_ATTACKS` (`@/lib/ai/playground`); `injectionPatterns` (`@/lib/ai/guardrails`).
- Produces: a `recipe` prop on `PlaygroundClient` with shape
  `{ framing: string; vulnerablePrompt: string; hardenedPrompt: string; injectionPatterns: { type: string; source: string }[]; outputFilterNote: string; outputBlockMessage: string; transparencyNote: string }`.

- [ ] **Step 1: Build the recipe in `app/playground/page.tsx`**

Replace the entire file with:
```tsx
import type { Metadata } from 'next'
import {
  STARTER_ATTACKS,
  redactSecret,
  vulnerableSystemPrompt,
  hardenedSystemPrompt,
  OUTPUT_BLOCK_MESSAGE,
} from '@/lib/ai/playground'
import { injectionPatterns } from '@/lib/ai/guardrails'
import PlaygroundClient from './PlaygroundClient'

export const metadata: Metadata = {
  title: 'Prompt Injection Playground | Paul Falor',
  description:
    'Try to jailbreak two AI assistants side by side. One has no defenses, one is hardened with real layered controls. See which layer stops each attack. Nothing real is exposed.',
  openGraph: {
    title: 'Prompt Injection Playground',
    description: 'Can you jailbreak the AI? Attack two assistants side by side. One has defenses, one does not.',
    images: ['/api/og/playground'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prompt Injection Playground',
    description: 'Can you jailbreak the AI? Attack two assistants side by side. One has defenses, one does not.',
    images: ['/api/og/playground'],
  },
}

const recipe = {
  framing:
    "The secret lives in the prompt on purpose. That is the real-world failure: anything in a model's context, including API keys, hidden instructions, or other users' data, can be extracted unless you add controls. Both bots below hold the same secret in the same place. The only difference is the defenses. Here is exactly how each one is built.",
  vulnerablePrompt: redactSecret(vulnerableSystemPrompt()),
  hardenedPrompt: redactSecret(hardenedSystemPrompt()),
  injectionPatterns: injectionPatterns(),
  outputFilterNote:
    'Even if the model slips, the reply is scanned for the secret (normalized for case, spacing, and light obfuscation) and replaced before it leaves the server. It is deterministic, so no clever prompt can defeat it.',
  outputBlockMessage: OUTPUT_BLOCK_MESSAGE,
  transparencyNote:
    'Showing this recipe does not weaken the hardened bot. The only protected value is fake, the bots have no tools or real data, and the output filter is deterministic.',
}

export default function PlaygroundPage() {
  return <PlaygroundClient starterAttacks={STARTER_ATTACKS} recipe={recipe} />
}
```

- [ ] **Step 2: Add the `recipe` prop type and panel to `app/playground/PlaygroundClient.tsx`**

Change the component's prop signature from:
```tsx
export default function PlaygroundClient({
  starterAttacks,
}: {
  starterAttacks: { label: string; prompt: string }[]
}) {
```
to:
```tsx
export default function PlaygroundClient({
  starterAttacks,
  recipe,
}: {
  starterAttacks: { label: string; prompt: string }[]
  recipe: {
    framing: string
    vulnerablePrompt: string
    hardenedPrompt: string
    injectionPatterns: { type: string; source: string }[]
    outputFilterNote: string
    outputBlockMessage: string
    transparencyNote: string
  }
}) {
```

- [ ] **Step 3: Render the panel**

In `app/playground/PlaygroundClient.tsx`, find the closing `</div>` of the two-panel grid (the `grid grid-cols-1 ... md:grid-cols-2` block that contains the Vulnerable/Hardened panels). Immediately AFTER that grid's closing `</div>` and BEFORE the `{attempts > 0 && (` action-buttons block, insert this `<details>` panel:
```tsx
      <details className="mt-8 rounded-md border border-slate-700 bg-slate-800/20">
        <summary className="cursor-pointer px-5 py-3 text-sm font-medium text-slate-200">
          How this works (see the prompts and defenses)
        </summary>
        <div className="border-t border-slate-700 px-5 py-4 text-sm text-slate-300">
          <p className="text-slate-400">{recipe.framing}</p>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold text-red-300">Vulnerable bot prompt</h3>
              <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded bg-slate-900 p-3 text-xs text-slate-200">
                {recipe.vulnerablePrompt}
              </pre>
            </div>
            <div>
              <h3 className="font-semibold text-emerald-300">Hardened bot prompt (Layer 2)</h3>
              <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded bg-slate-900 p-3 text-xs text-slate-200">
                {recipe.hardenedPrompt}
              </pre>
            </div>
          </div>

          <h3 className="mt-6 font-semibold text-white">The three hardened layers</h3>

          <div className="mt-3">
            <p className="font-medium text-emerald-300">Layer 1: input guardrail (deterministic)</p>
            <p className="mt-1 text-slate-400">
              A known attack pattern is matched and blocked before the model is called. The patterns:
            </p>
            <ul className="mt-2 space-y-1">
              {recipe.injectionPatterns.map((p) => (
                <li key={p.type} className="text-xs">
                  <span className="text-slate-200">{p.type}</span>
                  <code className="ml-2 break-all text-slate-500">{p.source}</code>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <p className="font-medium text-emerald-300">Layer 2: defensive system prompt</p>
            <p className="mt-1 text-slate-400">
              The hardened prompt shown above. It refuses manipulation and never reveals the value.
            </p>
          </div>

          <div className="mt-4">
            <p className="font-medium text-emerald-300">Layer 3: output filter (deterministic)</p>
            <p className="mt-1 text-slate-400">{recipe.outputFilterNote}</p>
            <pre className="mt-2 whitespace-pre-wrap rounded bg-slate-900 p-3 text-xs text-slate-300">
              {recipe.outputBlockMessage}
            </pre>
          </div>

          <p className="mt-6 text-xs text-slate-500">{recipe.transparencyNote}</p>
        </div>
      </details>
```

- [ ] **Step 4: Typecheck and build**

Run: `npx tsc --noEmit && npm run build`
Expected: no type errors; build succeeds and lists `/playground`.

- [ ] **Step 5: Controller smoke test (run by the implementer here, since it needs no live LLM)**

Start the dev server: `npm run dev`. Then in a second terminal:
```bash
# Panel present and redacted; the real secret must NOT appear in the HTML.
html=$(curl -s http://localhost:42069/playground)
echo "$html" | grep -q "How this works" && echo "PANEL: present" || echo "PANEL: MISSING"
echo "$html" | grep -q "{{SECRET}}" && echo "REDACTED PLACEHOLDER: present" || echo "REDACTED PLACEHOLDER: MISSING"
echo "$html" | grep -q "FLAG-SWORDFISH" && echo "LEAK: secret in HTML (FAIL)" || echo "REDACTION OK: secret absent from HTML"
echo "$html" | grep -q "Instruction override" && echo "PATTERNS: present" || echo "PATTERNS: MISSING"
```
Expected: PANEL present, REDACTED PLACEHOLDER present, REDACTION OK (secret absent), PATTERNS present.

Then confirm the secret is not in the client bundle:
```bash
grep -rl "FLAG-SWORDFISH" .next/static 2>/dev/null && echo "BUNDLE LEAK (FAIL)" || echo "BUNDLE OK: secret absent"
```
Expected: BUNDLE OK.

Stop the dev server when done.

- [ ] **Step 6: Commit**

```bash
git add app/playground/page.tsx app/playground/PlaygroundClient.tsx
git commit -m "feat: add How this works recipe panel to the playground"
```

---

## Notes for the implementer

- **Redaction is the security boundary.** The whole point is that the secret value never appears on the page. If the smoke test shows `FLAG-SWORDFISH` in the HTML, stop and fix `redactSecret` before committing.
- The panel is read-only static content. It uses a native `<details>` element, so no React state, no `ai` import, and no model call is involved.
- Keep all copy in house style: no em dashes, no AI-tell vocabulary.
