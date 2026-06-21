# Design: GenAI Thought Leadership + AI Features for paulfalor.com

**Date:** 2026-06-21
**Status:** Approved — phased build
**Owner:** Paul Falor (Practice Lead, Secure, Responsible AI & Data Protection — Americas)

## Goal

Turn the three placeholder "Blog" cards into real, research-backed POV pages, and
add four GenAI features that *dogfood* Secure + Responsible AI — so the site itself
is a live reference implementation that intrigues buyers and hiring managers.

## Guiding principle

Don't just *use* AI — *demonstrate governed* AI. Grounded answers, visible
guardrails, citations, data minimization. The site practices what the practice sells.

## Part A — Three POV pages

- Routes: `/insights/<slug>` (clickable cards; remove "Coming Soon" overlay).
- Length/tone: in-depth, 1,200–1,800 words, real thesis + data + "what to do" close.
- Topics (existing cards):
  1. **Securing the Enterprise Rush to GenAI** — Security for AI
  2. **Rebuilding the SOC for an AI-Speed Adversary** — AI for Security
  3. **Shrinking the Blast Radius** — Data Protection
- Research: parallel agents gather current, citable facts (OWASP LLM Top 10,
  NIST AI RMF / ISO 42001 / EU AI Act, IBM Cost of a Data Breach, agentic-SOC and
  attacker-AI trends). Facts are woven in with sources.

## Part B — Four AI features (shared foundation)

**Grounding:** context-stuffing (no vector DB). Curated knowledge base = `lib/data.ts`
content + the 3 POVs, injected into the system prompt with "answer only from this,
cite, refuse otherwise" instructions.

**Shared infra (`lib/ai/`):**
- `knowledge.ts` — curated KB builder.
- `guardrails.ts` — scope check + prompt-injection detection (shared).
- `client.ts` — Vercel AI SDK + Claude (Sonnet 4.6 chat; Opus option for briefings).
  Reuses existing `ANTHROPIC_API_KEY`.
- `ratelimit.ts` — per-IP throttle + caching; plus Vercel BotID. Cost/abuse control
  doubles as the responsible-AI story.

**Structured response contract:** `{ text, citations[], scopeStatus, safetyFlags }`
so the transparency panel reflects real state.

**Features:**
1. **"Ask Paul" advisor** — streaming chat in Paul's voice, citations, transparency
   panel (sources · scope · no-PII), polite off-scope refusal.
2. **"Red Team It"** — toggle; visitor attempts prompt injection; guardrails catch it
   and the panel explains the attack type + how it was blocked.
3. **AI Readiness assessment** — 6 questions across the 3 focus areas → tailored
   maturity snapshot + recommendations.
4. **Exec briefing generator** — role + industry → one-page tailored AI-risk briefing
   (Opus).

**Lead capture:** optional, ungated. Results show instantly; visitor may optionally
submit an email to receive a copy, which forwards the lead to Paul. (Strong data-
minimization story.)

## Build order (phased; commit/deploy each phase for review)

1. **POVs** — content first; also feeds the AI knowledge base.
2. **AI foundation + "Ask Paul"** — flagship.
3. **Red Team It** — extends the advisor.
4. **AI Readiness assessment**, then **Exec briefing generator**.

## Non-goals / deferred

- Vector/embeddings RAG (corpus too small to justify).
- Touching the stale `/admin` UI (edit `lib/data.ts` directly).
- Publishing to `blog.paulfalor.com` (separate Social Ninja app).

## Constraints / notes

- Stack: Next.js 14 App Router, Tailwind, framer-motion. All content in `lib/data.ts`.
- Deploy = push to `main` → Vercel production auto-deploy.
- Verify SDK version + exact Claude model id against claude-api + vercel:ai-sdk
  references before writing routes.
