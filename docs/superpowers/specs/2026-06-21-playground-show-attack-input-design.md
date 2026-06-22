# Playground: show the attack input (pre-fill + echo) — Design

**Date:** 2026-06-21
**Status:** Approved design, pending implementation plan.
**Type:** Small UX enhancement to the shipped Prompt Injection Playground (`/playground`).

## Goal

Make the actual attack input visible, so visitors learn the phrasing that
produces each result (the most instructive part of the demo). Today, clicking a
starter-attack chip fires a hidden prompt and clears the textarea, so the
visitor sees the result but never the attack that caused it.

Two changes, both in `app/playground/PlaygroundClient.tsx` only:

1. **Pre-fill (starter chips stop auto-sending).** A starter chip currently calls
   `attack(a.prompt)` and immediately sends. Change the chip's `onClick` to
   `setMessage(a.prompt)` instead: it populates the textarea with the attack
   string and does NOT send. The visitor sees exactly what they are about to
   send, can edit it, then clicks "Attack both." The "Attack both" button and the
   type-your-own flow are unchanged.

2. **Echo the sent attack.** Add a `lastAttack` state (`string | null`). In
   `attack()`, on a successful send, set `lastAttack` to the exact sent text
   (before the textarea is cleared). Render it above the two result panels as a
   small labeled block: a "Attack sent:" label and the text in monospace, so the
   phrasing that produced the current result is always visible. `reset()` ("Start
   over") clears it back to `null`.

## Behavior details

- Send still clears the textarea afterward (current behavior); the echo now
  carries the "what was sent" record, so a fresh input box is fine.
- The echo block renders between the error line and the bot-panel grid, styled
  consistently with the page (escaped React text, no `dangerouslySetInnerHTML`).
- Buttons remain disabled while loading (current behavior); pre-filling does not
  trigger a request, so there is no new loading interaction.
- No server/API change, no new model calls, no change to the bots, the share
  card, or the "How this works" panel.

## Constraints

- House style: no em dashes, no AI-tell vocabulary in any added copy.
- No new runtime imports into the client (it already type-imports from
  `@/lib/ai/playground`); `starterAttacks` and `recipe` continue to arrive as
  props.
- No secret exposure concern (this change only echoes the visitor's own attack
  text, never bot output or the secret).

## Testing

Pure client UI, so verified by a controller browser smoke test:
- Click a starter chip → its text appears in the textarea and is NOT sent (no
  request fires, panels unchanged).
- Edit/keep the text, click "Attack both" → an "Attack sent:" echo shows the
  exact string above the two panels, and the bots respond as before.
- Click "Start over" → the echo clears.
No unit tests (consistent with the other client components; the existing unit
suites and `tsc`/`build` must still pass).

## Out of scope (YAGNI)

- Per-bot or per-turn attack history beyond the single most-recent echo.
- Auto-sending on starter click (explicitly replaced by pre-fill).
- Copy-to-clipboard for the echoed attack.

## Build sequence (for the plan)

Single task: edit `PlaygroundClient.tsx` (starter `onClick` to pre-fill, add
`lastAttack` state + capture in `attack()` + clear in `reset()`, render the echo
block), then `tsc` + `build` + controller browser smoke.
