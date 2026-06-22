# Experiences hub + nav streamline — Design

**Date:** 2026-06-21
**Status:** Approved design, pending implementation plan.
**Type:** Information-architecture change to the homepage nav + a new hub page.

## Goal

The homepage hero renders all 12 `navigationItems` as a flat row of pills, and
five of them are interactive AI experiences (Threat Lab, Red Team, In the Chair,
Playground, AI Tools) that have accumulated recently. Collapse those five into a
single "Interactive" pill that leads to a dedicated `/experiences` hub page. This
streamlines the hero from 12 pills to 8, gives the experiences a real shareable
home, and keeps every experience discoverable via the ⌘K command palette.

## Decisions (resolved)

- Hub is a **dedicated page** at `/experiences` (not an on-page section).
- The hero pill is named **"Interactive"** (the existing career-history pill
  stays "Experience"; no name collision).
- The five experiences are removed from the visible hero pills but remain in the
  ⌘K command palette by name.

## Section 1: The hub page `/experiences`

A new route `app/experiences/page.tsx` that showcases the five interactive tools
as cards, matching the existing sub-page pattern (e.g. `app/agentic-ai-threats`):
dark theme, a "Security for AI" eyebrow/badge, a back-to-home link, a header with
title and intro, then a responsive card grid.

Each card shows: title, a one-line description, and links to the experience.
Proposed order (most engaging first):

1. **Prompt Injection Playground** → `/playground`
2. **In the Chair** → `/in-the-chair`
3. **Red Team Your AI Policy** → `/red-team`
4. **Agentic AI Threat Lab** → `/agentic-ai-threats`
5. **AI Tools** (Ask Paul advisor, AI Readiness Assessment, Executive Briefing) →
   `/ai-tools`

Content lives in `lib/data.ts` as a new exported `experiences` array (per the
"content lives in data.ts" convention), shape:
`{ title: string; description: string; href: string }[]`. The page maps over it,
so adding a sixth experience later is a one-line edit. Text cards only for v1
(no thumbnails; OG-card previews are a possible later enhancement).

Page metadata: title and description in house style, plus `openGraph`/`twitter`
text metadata (no custom OG image required for v1).

## Section 2: Nav reduction (`lib/data.ts` `navigationItems`)

Remove the five experience entries (Threat Lab, Red Team, In the Chair,
Playground, AI Tools) and replace them with a single
`{ label: 'Interactive', href: '/experiences' }`, placed where the experiences
were (immediately after "Practice Areas"). Resulting hero pills (8):
About, Practice Areas, Interactive, Insights, Blog, Impact, Experience, Contact.

`components/Hero.tsx` needs no code change; it maps `navigationItems` and will
render the shorter list automatically.

## Section 3: Keep the ⌘K command palette comprehensive

`components/CommandPalette.tsx` currently builds its command list from
`navigationItems` only. After the nav reduction, the five experiences would
disappear from the palette too (typing "Red Team" would find nothing). To prevent
that regression, the palette will build its commands from `navigationItems`
**plus** the new `experiences` array (each experience as a navigate command to
its `href`). Deduplicate by `href` so the "Interactive" nav entry and any overlap
do not double up. Net: the hero shows 8 pills; the palette still reaches every
experience by name.

## Section 4: Constraints

- House style: no em dashes, no AI-tell vocabulary in any added copy (titles,
  descriptions, page intro).
- Content lives in `lib/data.ts`; the hub page and palette consume it.
- No change to the five experience routes themselves, their APIs, or the OG
  cards. This is purely IA + a new presentational page.
- No new dependencies.

## Section 5: Testing

- **Unit (deterministic, Vitest):** create `lib/data.test.ts` (or extend) to
  assert: `navigationItems` includes an entry with `href: '/experiences'` and no
  longer includes `/agentic-ai-threats`, `/red-team`, `/in-the-chair`,
  `/playground`, or `/ai-tools`; the `experiences` array has five entries, each
  with a non-empty `title`, `description`, and an in-app `href` starting with `/`.
- **Controller smoke:** `/experiences` returns 200 and its HTML contains all five
  titles and their hrefs; the homepage hero HTML shows "Interactive" and none of
  the five old experience pill labels in the nav; the five experience routes still
  return 200; `npx tsc --noEmit` and `npm run build` pass with `/experiences`
  listed.
- ⌘K behavior (palette includes the experiences) is verified by reading the
  command-list construction in the diff plus a manual check.

## Out of scope (YAGNI)

- OG-card thumbnail previews on the hub cards (later enhancement).
- A follow/subscribe capture on the hub (separate idea).
- Reordering or trimming the remaining non-experience pills (only the experiences
  were the stated bloat).
- Breaking "AI Tools" into its three sub-tools as separate cards (kept as one).

## Build sequence (for the plan)

1. `lib/data.ts`: add the `experiences` array; update `navigationItems` (remove
   five, add "Interactive"). Add data unit tests.
2. `app/experiences/page.tsx`: the hub page rendering the cards from `experiences`.
3. `components/CommandPalette.tsx`: include `experiences` in the command list
   (deduped by href).
4. Controller smoke + build verification.
