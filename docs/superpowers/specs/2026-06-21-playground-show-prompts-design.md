# Playground "How this works" panel — Design

**Date:** 2026-06-21
**Status:** Approved design, pending implementation plan.
**Type:** Enhancement to the shipped Prompt Injection Playground (`/playground`).

## Goal

Add a "How this works" panel to the Playground that reveals the actual defense
recipe behind both bots, so visitors can see how the demo works and recreate it.
The panel reframes the demo around its real lesson: the secret lives in the
prompt on purpose, because the vulnerability being demonstrated is in-context /
system-prompt leakage (OWASP LLM07) — anything in a model's context can be
extracted unless you add controls. Showing the (redacted) prompts makes that
point sharper: both bots hold the same secret in the same place, and the only
difference is the layered controls around it.

## The honest framing (the headline of the panel)

The panel leads with a short, plain statement, roughly:

> The secret lives in the prompt on purpose. That is the real-world failure:
> anything in a model's context (API keys, hidden instructions, other users'
> data) can be extracted unless you add controls. The two bots below hold the
> same secret in the same spot. The only difference is the defenses. Here is
> exactly how each one is built.

## What the panel shows

A single collapsible "How this works" disclosure, collapsed by default, placed
below the two bot panels (so visitors play first, then reveal the mechanics).
When expanded it shows three parts:

1. **The two system prompts, side by side**, with the secret value replaced by
   the placeholder `{{SECRET}}`. The vulnerable bot's naive prompt next to the
   hardened bot's defensive prompt makes the wording difference obvious.
2. **The three hardened layers**, as the "recreate it" recipe:
   - **Layer 1, input guardrail (deterministic):** the injection patterns the
     guardrail matches, shown as a list of `{ type, regex source }` (e.g.
     "Instruction override", "System prompt extraction"). A known pattern is
     blocked before the model is ever called.
   - **Layer 2, defensive system prompt:** the hardened prompt shown above,
     called out as Layer 2.
   - **Layer 3, output filter (deterministic):** a short explanation that the
     model's reply is scanned for the secret (normalized for case, spacing, and
     light obfuscation) and redacted before it leaves the server, plus the actual
     block message the filter substitutes.
3. A one-line note that this transparency is intentional: the only protected
   value is the fake secret, and the deterministic Layer 3 cannot be prompted
   around, so disclosing the recipe does not weaken the hardened bot.

## Architecture and data flow (security-critical)

The secret must never reach the browser. The page is a server component, so it
assembles all panel data server-side with the secret already redacted, and
passes plain strings/arrays to the client as props (the same pattern already
used for `STARTER_ATTACKS`). The client receives no secret and no `ai` import.

- `lib/ai/playground.ts`:
  - Add `redactSecret(text: string): string` — replaces every occurrence of
    `SECRET` with the literal `{{SECRET}}`. Used to sanitize prompt text before
    it leaves the server.
- `lib/ai/guardrails.ts`:
  - Add `injectionPatterns(): { type: string; source: string }[]` — a read-only
    accessor exposing the existing `INJECTION_PATTERNS` as display data
    (`type` plus `re.source`). This is non-sensitive (the patterns are
    OWASP-style and already implied by the bot's behavior).
- `app/playground/page.tsx` (server): build a `recipe` object and pass it as a
  prop:
  ```ts
  const recipe = {
    framing: '...the honest framing line...',
    vulnerablePrompt: redactSecret(vulnerableSystemPrompt()),
    hardenedPrompt: redactSecret(hardenedSystemPrompt()),
    injectionPatterns: injectionPatterns(),
    outputFilterNote: '...',
    outputBlockMessage: OUTPUT_BLOCK_MESSAGE, // export this constant
    transparencyNote: '...',
  }
  ```
  All strings are redacted/non-sensitive. `OUTPUT_BLOCK_MESSAGE` is exported from
  `playground.ts` so the page can show the real filter message.
- `app/playground/PlaygroundClient.tsx`: add a collapsed `<details>`-style
  disclosure rendering `recipe`. Prompts render in monospace, preformatted, as
  escaped text (no `dangerouslySetInnerHTML`).

## Security and safety

- **Redaction must be airtight.** Because the prompt text is now intentionally
  rendered on the page, `redactSecret` must remove every occurrence of the
  secret. A controller smoke check confirms `FLAG-SWORDFISH` does not appear in
  the served `/playground` HTML even with the panel present, and the client
  bundle check (no secret in `.next/static`) still holds.
- **Intentional disclosure is acceptable.** Revealing the defensive prompt and
  the injection patterns tells attackers how the hardened bot defends. This is
  fine: the only protected value is fake, the bots have no tools or real data,
  and Layer 3 is a deterministic output filter that cannot be defeated by
  crafting a cleverer prompt. The spec notes this so it is a considered choice,
  not an oversight.
- **No XSS:** all recipe text renders as escaped React children.
- **No storage; no new model calls.** The panel is static content derived from
  server-side constants.

## Writing voice

All hand-written copy (framing, notes, labels) follows CLAUDE.md house style:
no em dashes, no AI-tell vocabulary, concrete and direct.

## Testing

- **Unit (deterministic, TDD):**
  - `redactSecret` — replaces the secret with `{{SECRET}}`; the result does not
    contain the secret; leaves other text unchanged; handles multiple
    occurrences.
  - `injectionPatterns()` — returns one entry per `INJECTION_PATTERNS` item, each
    with a non-empty `type` and `source`; contains known types like
    "Instruction override".
- **Manual smoke (controller):** the panel renders and expands; the two redacted
  prompts and the three layers display; the served `/playground` HTML does NOT
  contain `FLAG-SWORDFISH` (redaction holds); the live game still works
  (vulnerable leaks, hardened holds) unchanged.

## Out of scope (YAGNI)

- Copy-to-clipboard for the prompts (visitors can select text; a later nicety).
- A downloadable "starter kit" of the prompts/patterns.
- Showing live per-attempt internals (which pattern matched this turn) beyond the
  existing hardened badge.

## Build sequence (for the plan)

1. `redactSecret` + export `OUTPUT_BLOCK_MESSAGE` in `lib/ai/playground.ts`
   (+ tests).
2. `injectionPatterns()` accessor in `lib/ai/guardrails.ts` (+ tests).
3. `page.tsx` assembles the `recipe` prop; `PlaygroundClient.tsx` renders the
   collapsible panel (+ controller smoke incl. the redaction check).
