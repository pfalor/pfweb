# The AI Control Gap — Design Spec

**Date:** 2026-06-25
**Status:** Approved design, pending spec review
**Feature:** 1 of 3 in the executive-facing "visionary layer" initiative (this, then the Signals board, then the personalized board briefing).

## Purpose

Give Paul a named, signature framework that an executive can walk through in
90 seconds, apply to their own organization, and then repeat (attributing it to
Paul) in their next board meeting. The framework is the shared vocabulary the
other two features build on.

**The line the exec leaves with:** *"The danger isn't the AI. It's the gap
between how fast you're adopting it and how fast you can control it."*

**Audience & context:** cold-discovery, warm-follow-up, and referral visitors at
the CEO / board level. No meeting is booked yet; the page's job is to manufacture
the desire for one. Not a practitioner tool. No jargon, no jailbreak demos.

## The framework

Two curves over time:

- **Adoption Velocity** — how fast and broadly the organization is putting AI to
  work. Rises fast.
- **Control Maturity** — how fast the organization's ability to govern, secure,
  and contain AI is keeping up. Rises slowly.

The shaded area between them is **The Control Gap** — "where the risk lives."
This is Paul's actual thesis, already stated in his site summary ("adopt AI
boldly without outrunning your ability to secure it") and his first POV ("the
debt between how fast we deploy AI and how slowly we learn to control it"). We
are naming an idea he already owns, not inventing one.

## Placement

- **Dedicated page:** `/ai-control-gap`, positioned as the signature framework.
- **Homepage teaser:** the curve visual + the one-liner, linking to the page.
  (Exact homepage slot to be decided during planning; likely near the practice
  areas or as a band above thought leadership.)
- **Discovery:** added to the `experiences` array in `lib/data.ts` (so it appears
  on `/experiences` and in the command palette) alongside the existing pieces.

## The flow — three beats

### Beat 1 — The model (teach it)
An animated two-curve chart renders on load: Adoption Velocity climbing fast,
Control Maturity climbing slowly, the gap shaded between them and labeled. Two
sentences in Paul's voice frame it. This is the screenshot-worthy beat. Built
with SVG + framer-motion (already a dependency). No AI, no input.

### Beat 2 — The mirror (locate them)
Six quick questions, three per axis. Each answer is a 3-point scale mapping to a
score of 0 / 1 / 2. As the exec answers, the relevant curve adjusts. When all six
are answered, *their* two curves render with *their* gap shaded and sized.

**Scoring:**
- Adoption score = sum of Q1–Q3 (range 0–6).
- Control score = sum of Q4–Q6 (range 0–6).
- The Control Gap = Adoption − Control. A positive number is the widening gap;
  the wider it is, the more risk exposure.

**Draft questions (Paul to red-line):**

*Adoption Velocity*
1. **How widely is generative AI used across your business today?**
   - Isolated pilots, one or two functions *(0)*
   - Several functions and growing *(1)*
   - Embedded across most of the business *(2)*
2. **Are people using AI tools the organization hasn't sanctioned?**
   - No evidence of it / it's blocked *(0)*
   - Probably, but we lack visibility *(1)*
   - Yes, widely and openly *(2)*
3. **Are you deploying AI agents that take actions, not just answer questions?**
   - Not yet *(0)*
   - Piloting a few *(1)*
   - In production with real system access *(2)*

*Control Maturity*
4. **Who owns AI governance and risk in your organization?**
   - No clear owner yet *(0)*
   - Shared informally across teams *(1)*
   - A named owner with mandate and budget *(2)*
5. **Do you know what data flows into the AI tools your people use?**
   - Limited visibility *(0)*
   - Partial, for sanctioned tools only *(1)*
   - Yes, monitored across the data lifecycle *(2)*
6. **Do you have guardrails and monitoring on AI outputs and agent actions?**
   - Not yet *(0)*
   - Basic policies, limited enforcement *(1)*
   - Active guardrails and continuous evaluation *(2)*

### Beat 3 — The diagnosis (make it theirs)
One sharp paragraph, generated live in Paul's voice via the existing AI gateway,
grounded in his POVs (`lib/ai/knowledge.ts`). It names their single widest gap
(the control question scoring lowest relative to its adoption pressure) and the
one highest-leverage move to close it. It ends with a soft handoff:
*"Want this as a board-ready briefing for your situation?"* — the on-ramp to
feature #3 (personalized briefing). Until that feature ships, the handoff links
to the existing Executive Briefing generator in `/ai-tools`.

## Architecture (follows existing site patterns)

- **`lib/ai/controlgap.ts`** — builds the prompt from the six scored answers +
  the derived gap, calls the model through the gateway, returns the diagnosis
  text. Grounded in `lib/ai/knowledge.ts`. Mirrors `lib/ai/tools.ts`
  (`generateBriefing`). Reuses existing guardrails (`lib/ai/guardrails.ts`).
- **`lib/ai/controlgap.test.ts`** — unit test for scoring + prompt assembly,
  matching the colocated-test convention.
- **`app/api/ai/controlgap/route.ts`** — `runtime = 'nodejs'`, `maxDuration` in
  line with sibling routes, IP rate-limiting via `lib/ai/ratelimit.ts`, strict
  input validation (six enum answers only — reject anything else), try/catch
  returning a friendly 502. Mirrors `app/api/ai/brief/route.ts`.
- **`app/ai-control-gap/page.tsx`** + **`app/ai-control-gap/ControlGapClient.tsx`**
  — server page (metadata, SEO, OG) + client component for the interactive
  chart and questions. Mirrors the `playground` / `red-team` page+client split.
- **`components/` chart** — the two-curve SVG visual, animated with framer-motion.
  Reused at small size for the homepage teaser.
- **`lib/data.ts`** — append an entry to the `experiences` array.

**Input contract (API):** `{ adoption: [0|1|2, 0|1|2, 0|1|2], control: [0|1|2, 0|1|2, 0|1|2] }`.
The server recomputes scores; it never trusts a client-supplied gap or diagnosis.

## Error handling

- Invalid / out-of-range answers → 400.
- Rate limit exceeded → 429 with `retry-after`.
- Model/gateway failure → 502 with a friendly message; **beats 1 and 2 still work
  fully without AI.** The diagnosis is the only AI-dependent piece, so a gateway
  outage degrades gracefully to "diagnosis unavailable, here's the static gap +
  the briefing link" rather than breaking the page.

## Testing

- `lib/ai/controlgap.test.ts`: scoring math (0–6 per axis, gap derivation),
  widest-gap selection logic, prompt assembly includes the right grounding.
- Route-level: input validation rejects malformed/oversized payloads (follow the
  pattern in existing `*.test.ts` route guards if present, else lib-level).
- Manual: walk all-low and all-high answer sets; confirm curves and diagnosis
  read correctly and the voice matches CLAUDE.md guidelines (no em dashes, etc.).

## Writing voice

Beat 1 framing copy and the Beat 3 AI prompt/system message must follow
CLAUDE.md "Writing voice & guidelines": no em dashes, vary sentence length, take
a position, avoid the vocabulary tics. The diagnosis system prompt explicitly
instructs the model on these constraints (the existing AI tools already do this).

## Out of scope (this spec)

- The Signals board (feature #3) and the personalized board briefing (feature #1)
  — separate specs.
- Industry benchmarking / percentiles (the "Mirror + benchmark" variant was
  considered and deferred; needs a defensible scoring basis).
- Saving / accounts / persistence. The mirror is stateless per visit.

## Success criteria

- An executive can go from landing to "their gap" in under 90 seconds.
- The one-liner and the curve visual are screenshot-worthy on their own.
- The diagnosis reads as authentically Paul's voice and names something specific.
- The page degrades gracefully if the AI gateway is down.
- Discoverable from `/experiences`, the command palette, and a homepage teaser.
