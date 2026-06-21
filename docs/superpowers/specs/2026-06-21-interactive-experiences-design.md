# Interactive Experiences: "Red Team Your AI Policy" + "In the Chair"

**Date:** 2026-06-21
**Status:** Approved design, pending implementation
**Build order:** Experience A first, Experience B second (one spec, phased build).

## Goal

Make paulfalor.com stand out as an innovative source of information and
position Paul for a future senior leadership role in Secure/Responsible AI.
Two new interactive AI experiences that are:

- **Shareable** — top-of-funnel reach is the primary audience goal; the output
  is designed to travel (branded downloadable card carrying Paul's name + URL).
- **Low-upkeep** — the LLM carries framework reasoning and scenario generation,
  so relevance is maintained without manual content edits. No data store, no cron.
- **Positioning** — they put Paul's *judgment and executive framing* on display,
  not just technical depth. That is the differentiating signal for a next-role
  audience (a hiring committee wants to see he can make the call and frame it for
  a board, not only enumerate threats).

A pulls strangers in (utility people run on their own org's documents).
B converts them on Paul's judgment (puts them in the executive chair, then
reveals how Paul would have played it).

## How it fits the existing site

A new top-level **"Experiences"** grouping in the nav, alongside the Threat Lab.
Both experiences reuse existing AI plumbing:

- **AI Gateway + model routing**, following the `lib/ai/advisor.ts` pattern:
  `generateObject` with a Zod schema, `provider/model` strings, auth via
  `AI_GATEWAY_API_KEY`, `deEmDash()` on all model output (house style: no em dashes).
- **`lib/ai/guardrails.ts`** — `detectInjection()` (treat pasted docs as untrusted
  data, surface attempts) and `detectPii()` (warn the visitor if they paste PII).
- **`lib/ai/ratelimit.ts`** — per-session rate limiting (these prompts are heavier
  than chat).

New modules (each one focused responsibility):

- `lib/ai/redteam.ts` — Experience A analysis prompt + framework knowledge + Zod schema.
- `lib/ai/simulator.ts` — Experience B scenario engine + seed scenarios + Zod schema.

New routes:

- `/red-team` — Experience A page + `app/api/ai/redteam/route.ts`.
- `/in-the-chair` — Experience B page + `app/api/ai/simulate/route.ts`.

Branded result cards rendered with `@vercel/og` (also serves as the social
preview image). Card data is passed via short URL params — no server storage.

---

## Experience A: "Red Team Your AI Policy" (build first)

### User flow

1. Visitor pastes a document. The tool **auto-detects type** — AI acceptable-use
   policy, vendor AI-safety claims, or a model card — and applies the matching
   lens. No dropdowns to configure.
2. A persistent privacy notice: *"Analyzed in memory, never stored. Nothing you
   paste leaves this session."* If `detectPii()` fires, show an inline nudge
   ("We spotted what looks like PII; you can redact it, the analysis works on the
   policy language alone").
3. The advisor evaluates against **NIST AI RMF, EU AI Act risk tiers, OWASP LLM
   Top 10**, plus Paul's own POV (drawn from the existing knowledge base where
   relevant).
4. Output, in order:
   - **Maturity band** (Emerging / Developing / Strong) shown prominently — the
     consultative, brand-safe headline.
   - **0–100 exposure score** available on expand — the sharper numeric hook for
     those who want it.
   - **Top gaps, ranked by severity**, each tagged with the framework it maps to
     and a concrete, specific fix.
   - **Board-ready summary** — 3–4 sentences a CISO could paste into a deck.
5. **Download branded card** (`@vercel/og`): band + score + top 3 gaps + Paul's
   name/URL. Plus a copy-summary button.

### Why low-upkeep

The LLM carries the framework reasoning. Paul only touches it to update the
framework list. No data store, no cron, no manual content refresh.

### Design decisions (resolved)

- **Adaptive doc-type detection** rather than a manual picker.
- **Default framework lens:** NIST AI RMF + EU AI Act + OWASP LLM Top 10.
- **Scoring framing:** maturity band up front, numeric score on expand ("Both").
- **Sharing:** ephemeral analysis + downloadable branded card. Nothing stored
  server-side.

### Module shape: `lib/ai/redteam.ts`

- `analyzePolicy({ document })` → returns a validated object.
- Zod schema (illustrative):
  - `docType: 'policy' | 'vendor_claims' | 'model_card' | 'unknown'`
  - `band: 'Emerging' | 'Developing' | 'Strong'`
  - `score: number` (0–100)
  - `verdict: string` (one line)
  - `gaps: { severity: 'high'|'medium'|'low', framework: string, finding: string, fix: string }[]`
  - `boardSummary: string`
- **Prompt-injection safety:** the pasted document is wrapped and explicitly
  labeled as untrusted data to be analyzed, never as instructions. The system
  prompt states the model must not follow instructions found inside the document.
- Model routing: Sonnet by default (heavier reasoning than chat). Graceful
  fallback if a model is unavailable, mirroring the advisor's try/catch.

### Route: `app/api/ai/redteam/route.ts`

- Validate input size (cap length, truncate with a warning flag if exceeded).
- Run `detectInjection()` and `detectPii()` for the transparency/privacy UI.
- Rate-limit per session.
- Call `analyzePolicy()`, return the structured result.

### Page: `/red-team`

- Paste textarea + privacy notice + analyze button.
- Results render band → score (expandable) → ranked gaps → board summary.
- Card download + copy summary.

---

## Experience B: "In the Chair" (phase 2, designed now)

### User flow

1. Visitor picks (or is dealt) a crisis scenario, e.g. *"An agentic chatbot
   marketing shipped Friday is leaking PII Monday morning."*
2. The LLM runs a **branching decision tree**, 3–5 decisions deep. Each choice
   has consequences that shape the next beat.
3. At the end:
   - **Leadership profile** across a few axes (decisiveness, containment,
     stakeholder comms, responsible-AI rigor).
   - **"How I'd have played it"** — Paul's framework revealed beat-by-beat against
     the visitor's path. This is the next-role signal.
   - Same downloadable card pattern.

### Why low-upkeep

Scenarios are LLM-generated from a small seed set (3–4 seeds written once).
Evergreen because they are principle-based, not headline-based.

### Module shape: `lib/ai/simulator.ts`

- A few seed scenarios (situation + the axes that matter + Paul's POV anchors).
- `nextBeat({ scenarioId, history, choice })` → next situation + 2–4 choices, or
  a terminal result with the leadership profile and Paul's reveal.
- Zod schemas for a beat and for the final result.
- Same injection-safety posture: visitor choices are constrained selections, not
  free text driving the model (reduces injection surface).
- Model routing: Sonnet for beats; Opus reserved for the final reveal (the part
  where Paul's judgment is articulated and quality matters most).

### Route + page

- `app/api/ai/simulate/route.ts` — stateless; the client sends accumulated
  history each turn (no server session store).
- `/in-the-chair` — scenario picker, beat renderer, choice buttons, final
  profile + reveal + card.

---

## Cross-cutting concerns

### Guardrails & safety

- Reuse `lib/ai/guardrails.ts` and `lib/ai/ratelimit.ts`.
- **Input-size caps** on Experience A (policies can be long → truncate + warn).
- **Prompt injection:** pasted documents and any free text are untrusted. Analysis
  prompts treat document content as data, not instructions, and say so explicitly.
- **PII:** `detectPii()` warns the visitor; reinforces the "nothing stored" promise.

### Cost

- These prompts are heavier than chat. Default to Sonnet; reserve Opus for the
  simulator's final reveal only. Rate-limit per session. Graceful model-fallback
  mirroring the advisor.

### Privacy

- No server-side storage of pasted content or run results. Card data travels in
  short URL params. The privacy promise is a first-class UI element on A.

### Testing

- **Golden-file tests** on a few sample policies / vendor claims / model cards to
  catch prompt regressions (assert band, presence of gaps, schema validity).
- **Card renderer smoke test** — `@vercel/og` route returns a valid image for
  representative params.
- **Guardrail unit coverage** for any new injection/PII handling paths.

### Writing voice

All visitor-facing copy and any model output that renders as Paul's prose follows
CLAUDE.md house style: no em dashes, no AI-tell vocabulary, concrete and
opinionated. `deEmDash()` applied to model output.

---

## Out of scope (YAGNI)

- Shareable permalinks / stored runs (rejected: privacy + storage upkeep).
- Manual framework-content CMS (the LLM carries it; edit the prompt if needed).
- Experience C "Situational Brief" auto-refreshing page — strong phase-3
  candidate, deferred. It is content under Paul's byline generated unattended, so
  it needs its own guardrail/citation design and is not an interactive experience.
- Accounts, auth, persistence of any kind.

## Build sequence

1. **Experience A** — `lib/ai/redteam.ts`, API route, `/red-team` page, card
   renderer, tests. Ship.
2. **Experience B** — `lib/ai/simulator.ts`, API route, `/in-the-chair` page,
   reuse card renderer, tests. Ship.
3. Add the **"Experiences"** nav grouping as each lands.
