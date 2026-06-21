# pfweb — project notes for Claude

Personal/professional site for Paul Falor (Practice Lead, Secure, Responsible AI &
Data Protection — Americas, Accenture). Next.js 14 App Router + Tailwind + framer-motion.

## Where content lives

- `lib/data.ts` — all homepage content (name, title, summary, practice areas,
  experience, metrics, education, nav, terminal). Edit directly.
- `lib/insights.ts` — long-form POV articles rendered at `/insights/<slug>`.
- The `/admin` UI is stale/pre-pivot; do NOT save through it (it regenerates
  `lib/data.ts` and drops the practice-areas content). Edit files directly.
- Deploy = push to `main` → Vercel auto-deploys production.

## Writing voice & guidelines (avoid AI tells)

All prose on this site (POVs, summary, practice descriptions) is published under
Paul's name. It must read as human-authored. These guidelines come from current
(2024–2026) editor/linguistics sources on what makes text read as AI-generated.

**The core principle:** the tell is usually *overuse and reflex*, not any single
word or mark. Edit for voice and specificity; don't mechanically scrub vocabulary
into choppy, lifeless prose. Detectors (perplexity/burstiness) are unreliable and
false-flag good technical writing — never treat a score as proof.

### Don't
- **Em dashes** — we avoid them on this site (Paul's call, since it's the #1 tell).
  Use periods, commas, parentheses, or a colon, or restructure the sentence.
  (Note: em dashes are legitimate in good human writing; we just opt out here.)
- **The "not just X, but Y" / "it's not X, it's Y" antithesis.** Powerful once;
  a tell when reflexive. Limit to ~1 per article, max.
- **Ascending false reframe:** "It's not a tool. It's not a platform. It's a movement."
- **Colon-led drama:** "Here's the truth:", "The result:", "The bottom line:".
- **Vocabulary tics:** delve, leverage, utilize, underscore, foster, harness,
  robust, pivotal, crucial, seamless, transformative, vibrant, showcase, boasts,
  landscape, realm, tapestry, testament, "navigate the landscape," "in today's
  fast-paced world," "it's worth noting," "a testament to," "stands as."
- **Formulaic openers/closers:** "In conclusion," "Ultimately," "In today's…".
- **Reflexive rule-of-three.** Two items or four are fine; don't pad to three for rhythm.
- **Fake even-handedness** ("while X has benefits, it also has risks") that dodges a
  position. Take a side.
- **Over-formatting:** bolded key phrases, headers, or bullets where prose carries it.
- **Self-summarizing** — restating the paragraph you just wrote.

### Do
- **Vary sentence length** (burstiness). Mix a short, blunt sentence with a long one.
  Read aloud: if every sentence is the same breath, break it up.
- **Be concrete** — names, numbers, dates, a specific incident. Specificity is the
  clearest human marker and it suits cited thought leadership.
- **Take a real position** and let opinionated, idiosyncratic voice through.
- **Lead each section with its strongest point.**
- **Cite sources** for stats; attribute vendor telemetry as vendor telemetry.
- Allow a little imperfection. Perfectly balanced, uniform paragraphs read as machine.

### Quick check before publishing prose
1. Search the text for `—` (em dash). Should be zero.
2. Count "not X, it's/it is Y" constructions. ≤1 per piece.
3. Scan for the vocabulary-tic list above.
4. Read one paragraph aloud — is there sentence-length variety?
5. Does it state a clear point of view, or hedge?
