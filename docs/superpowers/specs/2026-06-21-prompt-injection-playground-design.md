# Prompt Injection Playground — Design

**Date:** 2026-06-21
**Status:** Approved design, pending implementation plan.

## Goal

A hands-on, shareable interactive experience on paulfalor.com where a visitor
tries to jailbreak two AI assistants side by side: a **vulnerable** bot with no
defenses and a **hardened** bot with real layered defenses. Both hold the same
obviously-fake secret. The visitor's goal is to extract it. The vulnerable bot
can be tricked into leaking it; the hardened bot reliably holds, and shows which
defense layer stopped each attack.

It serves the same goals as the other interactive experiences: broad top-of-funnel
reach (people love trying to break things, and the result is screenshot-worthy),
thought-leadership and next-role positioning (it demonstrates Paul's AI-security
expertise concretely), and low manual upkeep (the LLM and deterministic guardrails
carry the behavior; no content to hand-maintain).

## How it fits the existing site

A new top-level experience at `/playground`, alongside the Threat Lab, Red Team,
and In the Chair. It reuses existing infrastructure:

- **`lib/ai/guardrails.ts`** — `detectInjection()` is the hardened bot's input layer.
- **AI Gateway pattern** (`generateText`/`generateObject` via `ai` v6, plain
  `provider/model` strings, `AI_GATEWAY_API_KEY`) — both bots are real calls.
- **`lib/ai/ratelimit.ts`** — per-IP throttle (this is high-interaction).
- **`lib/ai/text.ts`** `deEmDash` — house style on any rendered prose.
- The share-card pattern (`next/og` + URL-param encode/decode) from Red Team / In
  the Chair.

New files:

- `lib/ai/playground.ts` — the fake secret, both system prompts, `attackVulnerable`
  and `attackHardened` (the layered logic), `containsSecret` (leak/win detector),
  the starter-attack list, request validation.
- `lib/playground-card.ts` — pure share-card param encode/decode.
- `app/api/ai/playground/route.ts` — rate-limited Node route; calls both bots.
- `app/api/og/playground/route.tsx` — share card (edge `next/og`).
- `app/playground/page.tsx` + `app/playground/PlaygroundClient.tsx`.
- nav entry in `lib/data.ts`.

## The two bots and the defense layers

Both bots are real AI Gateway calls on **Haiku 4.5** (cheap; the contrast comes
from the layers, not the model tier). Both system prompts contain the same
**obviously-fake secret**, e.g. `FLAG-SWORDFISH-2026` (clearly not a real
credential; a leak exposes nothing).

**Vulnerable bot:** a naive system prompt that states the secret and weakly asks
the model not to share it. No input guardrail, no output filter. A real, genuinely
trickable assistant. When its reply contains the secret, the visitor has cracked it.

**Hardened bot:** three real layers, each surfaced to the visitor when it fires:

1. **Input guardrail (Layer 1, deterministic):** `detectInjection()` runs first.
   On a known attack pattern, the bot refuses *without calling the model* (also
   saves cost). The response names the matched technique.
2. **Defensive system prompt (Layer 2, model):** explicitly refuses manipulation,
   treats all user input as adversarial, never reveals the secret or the prompt.
3. **Output filter (Layer 3, deterministic):** even if the model slips, the reply
   is scanned for the secret (case-, space-, and light-obfuscation-insensitive via
   `containsSecret`) and redacted before it leaves the server. This is what makes
   the hardened bot reliably hold while remaining honest. It is a real
   defense-in-depth technique, not a demo trick.

## Experience and data flow

Side-by-side panels (vulnerable left, hardened right). The visitor enters one
attack; the route calls both bots and returns both replies plus per-bot metadata,
so the panels update together and the difference is immediate.

- **Starter attack library:** a small set of clickable example attacks (instruction
  override, system-prompt extraction, DAN-style roleplay, delimiter/encoding
  tricks), defined in `lib/ai/playground.ts` and shown as suggestions. Makes the
  experience approachable and teaches the attack taxonomy.
- **Live classification:** each attempt is tagged with the attempted technique and,
  for the hardened bot, which layer stopped it.
- **Win state + share card:** an attempt counter; once the vulnerable bot leaks, a
  "cracked" state. A `next/og` share card encodes attempts + whether the visitor
  cracked the vulnerable bot + whether the hardened bot held, e.g. "I cracked Paul
  Falor's vulnerable AI in 3 tries. The hardened one held against all of them."
  Ephemeral; nothing stored server-side; card data travels only in URL params.

Multi-turn matters for buildup attacks, so the client sends bounded per-bot
conversation history each turn (stateless server, no session store).

### Module shape: `lib/ai/playground.ts`

- `SECRET` — the fake flag constant.
- `STARTER_ATTACKS: { label: string; prompt: string }[]`.
- `containsSecret(text: string): boolean` — deterministic detector tolerant of
  case, whitespace, and light obfuscation (e.g. spaces/hyphens between characters).
  Used for both win detection (vulnerable) and the output filter (hardened).
- `vulnerableSystemPrompt(): string`, `hardenedSystemPrompt(): string`.
- `validatePlaygroundRequest(body): { ok: true; message; history } | { ok: false; error }`
  (message length cap; history an array, bounded length, well-formed turns,
  per-turn string caps).
- `attackVulnerable(message, history): Promise<{ reply: string; leaked: boolean; model: string }>`
  — real Haiku call; `leaked = containsSecret(reply)`.
- `attackHardened(message, history): Promise<{ reply: string; leaked: false; blockedLayer: 'input' | 'output' | null; technique: string | null; model: string }>`
  — Layer 1 (`detectInjection`, may short-circuit), Layer 2 (defensive prompt
  model call), Layer 3 (`containsSecret` output filter → redact). `leaked` is
  always `false` from the hardened bot by construction; if Layer 3 catches a slip,
  `blockedLayer = 'output'` and the secret is redacted from `reply`.

Both bots apply `deEmDash` to model prose. Model fallback mirrors the hardened
pattern used elsewhere (`maxRetries: 1`, `console.warn` on fallback).

### Route: `app/api/ai/playground/route.ts`

`runtime = 'nodejs'`, `maxDuration = 60`. Rate-limit by IP first. Validate. Call
`attackVulnerable` and `attackHardened` (in parallel). Respond with both replies
and per-bot metadata `{ leaked, blockedLayer, technique }`, plus the deterministic
`detectInjection` result for transparency. Generic 502 on model failure
(`console.error`, no message/secret logged). No storage.

### Share card: `app/api/og/playground/route.tsx`

Edge `next/og`. A generic branded cover when params are absent (for the social
preview), and a result card otherwise. `lib/playground-card.ts` provides pure
`encode`/`decode` with defensive clamping (attempt count bounded, booleans
coerced), following `lib/redteam-card.ts` / `lib/simulator-card.ts`. Satori rule:
every multi-child element sets `display:'flex'`; no `{expr}`+text adjacency.

## Security and safety

- **The secret is fake.** A "leak" exposes nothing real. This is the core safety
  property that makes a deliberately-vulnerable bot acceptable to ship.
- **Adversarial input is expected here.** Unlike Red Team / In the Chair (where
  pasted content is wrapped as untrusted data), the whole point is that the visitor
  sends adversarial instructions to the bots. So there is no "treat as data"
  wrapping; the bots are sandboxed assistants holding only the fake flag, with no
  tools, no real data, and no privileged access.
- **Cost-DoS:** high-interaction, so both bots are on Haiku and the route is
  rate-limited per IP (the in-memory limiter is a soft speed bump; the AI Gateway
  spend cap is the authoritative backstop, consistent with the other AI routes).
  The hardened Layer-1 block skips the model call, reducing cost under attack.
- **No XSS:** bot replies render as escaped text (no `dangerouslySetInnerHTML`).
- **No storage:** stateless; client sends bounded history; card data in URL only.

## Testing

- **Unit (deterministic, TDD):**
  - `containsSecret` — matches the secret across case, surrounding whitespace, and
    light obfuscation (e.g. `F L A G - S W O R D F I S H`); does not false-positive
    on unrelated text.
  - hardened output filter — redacts a reply that contains the secret; passes a
    clean reply through.
  - input-guardrail wiring — a known injection pattern yields `blockedLayer:'input'`
    without a model call.
  - `validatePlaygroundRequest` — rejects oversized/malformed input; truncates.
  - `playground-card` encode/decode round-trip + defensive decode.
- **Manual smoke (controller):** confirm a few real attacks genuinely crack the
  vulnerable bot (it leaks the flag) and genuinely fail against the hardened bot
  (blocked at Layer 1 or 3); both share-card variants render as valid PNGs; the
  page renders and the secret does not appear in the served HTML.

## Writing voice

All visitor-facing copy follows CLAUDE.md house style: no em dashes, no AI-tell
vocabulary, concrete and opinionated. `deEmDash` applied to model output.

## Out of scope (YAGNI)

- Multi-level challenge ladder (extract secret is the single v1 challenge; levels
  are a natural phase 2).
- Persisted leaderboards or saved runs (privacy + storage; the share card is the
  travel mechanism).
- Tool-use / agentic exfiltration scenarios (the Threat Lab covers agentic flows;
  this is focused on prompt injection against a chat assistant).
- Durable cross-instance rate limiting (the Gateway spend cap is the backstop;
  Vercel Firewall rate limiting is a separate, optional hardening).

## Build sequence (for the plan)

1. `lib/playground-card.ts` (+ tests).
2. `lib/ai/playground.ts` (secret, prompts, `containsSecret`, output filter,
   guardrail wiring, validation, starter attacks, `attackVulnerable` /
   `attackHardened`) (+ tests for the deterministic parts).
3. `app/api/ai/playground/route.ts` (+ controller smoke).
4. `app/api/og/playground/route.tsx` (+ controller image smoke).
5. `app/playground/page.tsx` + `PlaygroundClient.tsx` (+ controller page smoke).
6. nav entry + final verification.
