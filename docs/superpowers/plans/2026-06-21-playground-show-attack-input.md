# Playground: Show the Attack Input — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the actual attack visible on `/playground`: starter chips pre-fill the textarea instead of auto-sending, and the exact sent attack is echoed above the result panels.

**Architecture:** A single client-component change in `app/playground/PlaygroundClient.tsx`. No server, API, secret, or model impact. Adds one piece of state (`lastAttack`), changes the starter chip `onClick` from send-immediately to pre-fill, captures the sent text on a successful attack, and renders an echo block.

**Tech Stack:** Next.js 14 App Router (client component), TypeScript, Tailwind.

## Global Constraints

- **No em dashes** in any added copy; no AI-tell vocabulary. (CLAUDE.md.)
- **Client-only change.** No edits to `lib/ai/*`, the route, the OG card, or the page server component. No new imports.
- **No `dangerouslySetInnerHTML`.** The echoed attack renders as escaped React text.
- Dev server runs on port **42069** (`npm run dev`).

---

### Task 1: Pre-fill starter chips and echo the sent attack

All edits are in `app/playground/PlaygroundClient.tsx`. There is no unit test (pure client UI, consistent with the other client components); verification is `tsc` + `build` + a controller browser smoke test.

**Files:**
- Modify: `app/playground/PlaygroundClient.tsx`

**Interfaces:**
- Consumes: existing component state (`message`/`setMessage`), the existing `attack(attackText: string)` and `reset()` functions, and the `starterAttacks` prop.
- Produces: no new exports (internal behavior change only).

- [ ] **Step 1: Add the `lastAttack` state**

In `app/playground/PlaygroundClient.tsx`, find the state declarations block. After this line:
```tsx
  const [copyFailed, setCopyFailed] = useState(false)
```
add:
```tsx
  const [lastAttack, setLastAttack] = useState<string | null>(null)
```

- [ ] **Step 2: Capture the sent attack on success**

In the `attack()` function, the success path currently ends with `setMessage('')`. Change this block:
```tsx
      setVulnHistory((prev) => [...prev, { role: 'user', content: text }, { role: 'assistant', content: data.vulnerable.reply }])
      setHardHistory((prev) => [...prev, { role: 'user', content: text }, { role: 'assistant', content: data.hardened.reply }])
      setMessage('')
```
to:
```tsx
      setVulnHistory((prev) => [...prev, { role: 'user', content: text }, { role: 'assistant', content: data.vulnerable.reply }])
      setHardHistory((prev) => [...prev, { role: 'user', content: text }, { role: 'assistant', content: data.hardened.reply }])
      setLastAttack(text)
      setMessage('')
```

- [ ] **Step 3: Clear the echo on reset**

In the `reset()` function, after the existing `setError(null)` line inside `reset`, add:
```tsx
    setLastAttack(null)
```
(Add it among the other `set...` resets in `reset()`, e.g. immediately after `setError(null)`.)

- [ ] **Step 4: Make starter chips pre-fill instead of auto-send**

Find the starter-chip button (it maps over `starterAttacks`). Change its handler from:
```tsx
              onClick={() => attack(a.prompt)}
```
to:
```tsx
              onClick={() => setMessage(a.prompt)}
```
Leave everything else about the chip (the `disabled={loading}`, className, `key`, label) unchanged.

- [ ] **Step 5: Render the echo block above the result panels**

Find the error line and the result grid. They look like:
```tsx
      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
```
Insert the echo block between them, so it becomes:
```tsx
      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      {lastAttack && (
        <div className="mt-6 rounded-md border border-slate-700 bg-slate-800/30 px-4 py-3">
          <div className="text-xs uppercase tracking-wide text-slate-500">Attack sent</div>
          <p className="mt-1 whitespace-pre-wrap font-mono text-sm text-slate-200">{lastAttack}</p>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
```

- [ ] **Step 6: Typecheck and build**

Run: `npx tsc --noEmit && npm run build`
Expected: no type errors; build succeeds and lists `/playground`.

- [ ] **Step 7: Controller browser smoke test**

Start the dev server: `npm run dev`. Then:
```bash
# Confirm the page still renders and the starter labels are present.
curl -s http://localhost:42069/playground | grep -q "Instruction override" && echo "PAGE OK" || echo "PAGE MISSING"
```
Then in a browser at `http://localhost:42069/playground`, verify by hand:
- Clicking a starter chip (e.g. "Instruction override") puts its text into the textarea and does NOT send (both panels still show "Awaiting your first attack.", attempt counter stays 0).
- Editing the text then clicking "Attack both" sends it; an "Attack sent" block appears above the two panels showing the exact string, and the bots respond.
- Typing a custom attack and clicking "Attack both" echoes that custom text.
- Clicking "Start over" clears the echo (and the panels).

Stop the dev server when done.

- [ ] **Step 8: Commit**

```bash
git add app/playground/PlaygroundClient.tsx
git commit -m "feat: playground shows the attack input (pre-fill starters, echo sent attack)"
```

---

## Notes for the implementer

- This is a behavior change to the starter chips: they now PRE-FILL rather than send. That is intentional (the visitor should see and be able to edit the attack before sending). Do not also auto-send.
- `lastAttack` echoes only the visitor's own attack text. It never contains bot output or the secret, so there is no redaction concern.
- Keep the echo copy in house style: no em dashes. The label "Attack sent" is the only added copy.
