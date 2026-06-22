# Experiences Hub + Nav Streamline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Collapse the five interactive-experience pills into one "Interactive" pill that leads to a new `/experiences` hub page, cutting the homepage hero from 12 pills to 8 while keeping every experience reachable via the ⌘K command palette.

**Architecture:** A new `experiences` content array in `lib/data.ts` drives both the hub page and the command palette. `navigationItems` loses the five experience entries and gains one "Interactive" entry. A new server page `app/experiences/page.tsx` renders the experiences as cards (matching the existing `app/agentic-ai-threats` page style). `components/CommandPalette.tsx` adds the experiences to its command list so nothing becomes less discoverable. `components/Hero.tsx` is unchanged (it maps `navigationItems`).

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind, Vitest (already configured).

## Global Constraints

- **No em dashes** in any copy (titles, descriptions, page intro); no AI-tell vocabulary. (CLAUDE.md.)
- **Content lives in `lib/data.ts`.** The hub page and command palette consume the `experiences` array; do not hardcode the list in the components.
- **No change** to the five experience routes, their APIs, or their OG cards. This is IA + a new presentational page only.
- **No new dependencies.**
- Dev server runs on port **42069** (`npm run dev`).

---

### Task 1: Content + nav data (`lib/data.ts`) with tests

Add the `experiences` array and rewrite `navigationItems` to drop the five experience entries and add "Interactive". Unit-tested.

**Files:**
- Modify: `lib/data.ts` (the `navigationItems` array near line 384; add an `experiences` export)
- Test: `lib/data.test.ts` (create)

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `experiences: { title: string; description: string; href: string }[]` (five entries)
  - `navigationItems` updated: includes `{ label: 'Interactive', href: '/experiences' }`; no longer includes `/agentic-ai-threats`, `/red-team`, `/in-the-chair`, `/playground`, `/ai-tools`.

- [ ] **Step 1: Write the failing test**

Create `lib/data.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { navigationItems, experiences } from './data'

describe('navigationItems', () => {
  it('includes the Interactive hub link', () => {
    expect(navigationItems.map((n) => n.href)).toContain('/experiences')
  })
  it('no longer lists the individual experience routes', () => {
    const hrefs = navigationItems.map((n) => n.href)
    for (const gone of ['/agentic-ai-threats', '/red-team', '/in-the-chair', '/playground', '/ai-tools']) {
      expect(hrefs).not.toContain(gone)
    }
  })
})

describe('experiences', () => {
  it('lists five experiences, each with a title, description, and in-app href', () => {
    expect(experiences).toHaveLength(5)
    for (const e of experiences) {
      expect(e.title.length).toBeGreaterThan(0)
      expect(e.description.length).toBeGreaterThan(0)
      expect(e.href.startsWith('/')).toBe(true)
    }
  })
  it('covers exactly the five experience routes', () => {
    expect(experiences.map((e) => e.href).sort()).toEqual(
      ['/agentic-ai-threats', '/ai-tools', '/in-the-chair', '/playground', '/red-team']
    )
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `experiences` is not exported, and `navigationItems` still contains the experience routes.

- [ ] **Step 3: Add the `experiences` array**

In `lib/data.ts`, immediately above the `export const navigationItems = [` line, add:
```ts
// INTERACTIVE EXPERIENCES — surfaced on the /experiences hub and in the command palette.
export const experiences = [
  {
    title: 'Prompt Injection Playground',
    description:
      'Try to jailbreak two AI assistants side by side. One has no defenses, one is hardened. See which layer stops each attack.',
    href: '/playground',
  },
  {
    title: 'In the Chair',
    description:
      'Take the executive seat in a live AI security incident. Make the calls, then see how I would have played it.',
    href: '/in-the-chair',
  },
  {
    title: 'Red Team Your AI Policy',
    description:
      'Paste your AI policy, a vendor\'s claims, or a model card and get a framework-graded teardown against NIST AI RMF, the EU AI Act, and the OWASP LLM Top 10.',
    href: '/red-team',
  },
  {
    title: 'Agentic AI Threat Lab',
    description:
      'Run a simulated agentic AI exploit step by step, then deploy the controls that break the chain. Grounded in the OWASP agentic threat taxonomy.',
    href: '/agentic-ai-threats',
  },
  {
    title: 'AI Tools',
    description:
      'Ask Paul, a grounded advisor on secure and responsible AI, plus an AI Readiness Assessment and an Executive Briefing generator.',
    href: '/ai-tools',
  },
]
```

- [ ] **Step 4: Update `navigationItems`**

Replace the entire existing `navigationItems` array with:
```ts
export const navigationItems = [
  { label: 'About', href: '#about' },
  { label: 'Practice Areas', href: '#practice-areas' },
  { label: 'Interactive', href: '/experiences' },
  { label: 'Insights', href: '#thought-leadership' },
  { label: 'Blog', href: 'https://blog.paulfalor.com' },
  { label: 'Impact', href: '#impact' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
]
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test`
Expected: PASS (the new data tests plus all existing suites).

- [ ] **Step 6: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add lib/data.ts lib/data.test.ts
git commit -m "feat: add experiences content array; streamline nav to an Interactive hub link"
```

---

### Task 2: The `/experiences` hub page

A server component rendering the experiences as cards, matching the `app/agentic-ai-threats/page.tsx` style.

**Files:**
- Create: `app/experiences/page.tsx`

**Interfaces:**
- Consumes: `experiences` (`@/lib/data`).
- Produces: route `/experiences`.

- [ ] **Step 1: Create the page**

Create `app/experiences/page.tsx`:
```tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { experiences } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Interactive AI Experiences | Paul Falor',
  description:
    'Hands-on tools for secure and responsible AI: jailbreak a hardened assistant, run an AI security incident from the executive chair, red-team your AI policy, and more.',
  openGraph: {
    title: 'Interactive AI Experiences | Paul Falor',
    description: 'Hands-on tools for secure and responsible AI.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Interactive AI Experiences | Paul Falor',
    description: 'Hands-on tools for secure and responsible AI.',
  },
}

export default function ExperiencesPage() {
  return (
    <main className="min-h-screen bg-primary-900 grid-bg">
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-12 md:py-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-accent transition-colors duration-200 mb-10"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to home
        </Link>

        <header className="mb-12">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-medium uppercase tracking-wider mb-5">
            Security for AI
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-5 text-balance">
            Interactive AI Experiences
          </h1>
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
            Hands-on demonstrations of the work my practice does. Try to break a hardened AI, run an AI security incident from the executive chair, or grade your own AI policy. Each one is a real, working tool.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {experiences.map((exp) => (
            <Link
              key={exp.href}
              href={exp.href}
              className="block rounded-lg border border-slate-700/50 bg-slate-800/40 p-6 hover:border-accent/50 transition-colors duration-300"
            >
              <h2 className="text-xl font-semibold text-white">{exp.title}</h2>
              <p className="mt-2 text-slate-400">{exp.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm text-accent">
                Open
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Typecheck and build**

Run: `npx tsc --noEmit && npm run build`
Expected: no type errors; build succeeds and lists `/experiences` (static).

- [ ] **Step 3: Commit**

```bash
git add app/experiences/page.tsx
git commit -m "feat: /experiences hub page listing the interactive experiences"
```

---

### Task 3: Keep the experiences in the ⌘K command palette

Add the experiences to the palette's command list so they remain reachable by name after leaving the nav.

**Files:**
- Modify: `components/CommandPalette.tsx`

**Interfaces:**
- Consumes: `experiences` (`@/lib/data`).
- Produces: no new exports (adds navigate commands to the existing palette).

- [ ] **Step 1: Import `experiences`**

In `components/CommandPalette.tsx`, change the data import line:
```tsx
import { navigationItems } from '@/lib/data'
```
to:
```tsx
import { navigationItems, experiences } from '@/lib/data'
```

- [ ] **Step 2: Add experience commands to the list**

In the `commands` array, immediately AFTER the `...navigationItems.map((item) => ({ ... })),` spread block (it ends with `category: 'Navigation',` then `})),`), insert this second spread:
```tsx
    ...experiences
      .filter((exp) => !navigationItems.some((n) => n.href === exp.href))
      .map((exp) => ({
        id: exp.href,
        label: `Go to ${exp.title}`,
        action: () => {
          window.location.href = exp.href
          setIsOpen(false)
        },
        category: 'Experiences',
      })),
```

- [ ] **Step 3: Typecheck and build**

Run: `npx tsc --noEmit && npm run build`
Expected: no type errors; build succeeds.

- [ ] **Step 4: Commit**

```bash
git add components/CommandPalette.tsx
git commit -m "feat: include experiences in the command palette so they stay discoverable"
```

---

### Task 4: Final verification (build + controller smoke)

Confirms the whole IA change end to end. The smoke runs against a dev server and needs no live LLM.

**Files:** none (verification only).

- [ ] **Step 1: Full test + typecheck + build**

Run: `npm test && npx tsc --noEmit && npm run build`
Expected: all unit tests pass; no type errors; build lists `/experiences` and still lists `/playground`, `/red-team`, `/in-the-chair`, `/agentic-ai-threats`, `/ai-tools`.

- [ ] **Step 2: Start the dev server**

Run: `npm run dev`
Expected: ready on `http://localhost:42069`.

- [ ] **Step 3: Smoke — hub page renders all five experiences**

```bash
html=$(curl -s http://localhost:42069/experiences)
for t in "Prompt Injection Playground" "In the Chair" "Red Team Your AI Policy" "Agentic AI Threat Lab" "AI Tools"; do
  echo "$html" | grep -q "$t" && echo "CARD present: $t" || echo "CARD MISSING: $t"
done
for h in "/playground" "/in-the-chair" "/red-team" "/agentic-ai-threats" "/ai-tools"; do
  echo "$html" | grep -q "$h" && echo "LINK present: $h" || echo "LINK MISSING: $h"
done
```
Expected: all five cards and all five links present.

- [ ] **Step 4: Smoke — homepage hero is streamlined**

```bash
home=$(curl -s http://localhost:42069/)
echo "$home" | grep -q "Interactive" && echo "Interactive pill: present" || echo "Interactive pill: MISSING"
# The five experience labels should no longer appear as hero nav pills:
for label in "Threat Lab" "Red Team" "In the Chair" "Playground"; do
  echo "$home" | grep -q ">$label<" && echo "OLD PILL still shown: $label" || echo "OLD PILL gone: $label"
done
```
Expected: "Interactive" present; the old experience pills gone from the hero. (Note: the homepage may still mention these names in other prose/sections; the check `>$label<` targets the pill text node specifically.)

- [ ] **Step 5: Smoke — the five routes still work**

```bash
for r in /experiences /playground /in-the-chair /red-team /agentic-ai-threats /ai-tools; do
  echo "$r -> $(curl -s -o /dev/null -w '%{http_code}' http://localhost:42069$r)"
done
```
Expected: all return 200.

- [ ] **Step 6: Manual check — ⌘K still finds the experiences**

In a browser at `http://localhost:42069/`, press ⌘K (or Ctrl+K), type "Red Team", and confirm a "Go to Red Team Your AI Policy" command appears and navigates to `/red-team`. Repeat for "Playground". Stop the dev server when done.

- [ ] **Step 7: Commit (if any verification-driven fixes were needed)**

If Steps 1-6 required no changes, there is nothing to commit. If a fix was needed, commit it with a clear message describing the fix.

---

## Notes for the implementer

- All five experiences (including "AI Tools") leave the nav; the hero ends at 8 pills (About, Practice Areas, Interactive, Insights, Blog, Impact, Experience, Contact).
- Keep the hub-page copy and experience descriptions in house style: no em dashes.
- `components/Hero.tsx` is intentionally untouched; it maps `navigationItems` and streamlines automatically.
- If importing `lib/data.ts` in `lib/data.test.ts` surfaces an unexpected non-node dependency, stop and report it; `data.ts` is plain content/data and should import cleanly under Vitest.
