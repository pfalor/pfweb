// ============================================================================
// INSIGHTS / POINT-OF-VIEW ARTICLES
// ============================================================================
// Long-form thought leadership rendered at /insights/<slug>.
// Each article's `body` is Markdown. The `sources` list powers the citations
// block at the bottom of each page. This content also feeds the grounded
// knowledge base used by the site's AI features.
//
// Prose style: see CLAUDE.md "Writing voice & guidelines". No em dashes.
// ============================================================================

export interface InsightSource {
  label: string
  url: string
}

export interface Insight {
  slug: string
  title: string
  category: string
  dek: string
  date: string
  readingTimeMinutes: number
  body: string
  sources: InsightSource[]
}

export const insights: Insight[] = [
  // --------------------------------------------------------------------------
  // 1. SECURITY FOR AI
  // --------------------------------------------------------------------------
  {
    slug: 'securing-the-enterprise-rush-to-genai',
    title: 'Securing the Enterprise Rush to GenAI',
    category: 'Security for AI',
    dek: 'Adoption is outrunning governance by a wide margin. The defining risk of this era is not an exotic zero-day. It is the debt between how fast we deploy AI and how slowly we learn to control it.',
    date: '2026-06-21',
    readingTimeMinutes: 7,
    body: `In a single year, the share of organizations using generative AI in at least one business function jumped from 33% to 71%, according to Stanford HAI's 2025 AI Index. A shift that fast is a stampede. I want to be clear that the boldness behind it is correct. The enterprises that win the next decade will be the ones that put frontier models to work first. My concern is not the speed. It is the gap the speed is opening underneath us.

The controls have not kept pace. IBM's 2025 Cost of a Data Breach report found that 63% of breached organizations either have no AI governance policy or are still building one, and concluded bluntly that AI adoption is greatly outpacing AI security and governance. We have a governance debt. Like most debt, it compounds quietly until it all comes due at once.

## Shadow AI is a leadership problem

The most common way that debt surfaces is shadow AI, meaning employees using unsanctioned tools with corporate data. Microsoft's 2024 Work Trend Index found that 78% of AI users bring their own AI tools to work. Security vendors that monitor data flows report that roughly a third of the content employees paste into AI tools is sensitive. Discount any single vendor figure if you like; the pattern holds across several of them.

The instinct is to treat this as an employee discipline problem. I think that is backwards. People reach for unsanctioned tools because the sanctioned ones are slow, gated, or absent. When the official path takes a quarter to approve and the unofficial path takes thirty seconds, you have not written a security policy. You have created a workaround. The IBM data puts a price on it. One in five organizations suffered a breach tied to shadow AI, those breaches cost an average of $670,000 more, and 97% of the organizations that had an AI system breached lacked proper AI access controls.

> Shadow AI does not yield to a stricter ban. It yields to a faster yes: a sanctioned, secured path that beats the workaround on convenience.

## The new attack surface is real, and the failures are ordinary

The technical risks are well catalogued now. The OWASP Top 10 for LLM Applications (2025) ranks prompt injection first, followed by sensitive information disclosure, supply chain risk, data and model poisoning, improper output handling, and excessive agency. None of these is hypothetical. Samsung banned external generative AI on company devices in 2023 after engineers pasted semiconductor source code and a confidential meeting transcript into a public chatbot in three separate incidents over about three weeks. Wiz researchers documented Microsoft accidentally exposing 38 terabytes of internal data, including secrets and tens of thousands of internal messages, through a single over-permissioned cloud token attached to an AI training repository. In early 2025, Wiz found a DeepSeek database sitting open on the internet with plaintext chat history and API keys.

The most clarifying finding I have read comes from Microsoft's own AI Red Team, which published lessons from probing 100 generative AI products. Their conclusion: most of the damaging failures came from simple, familiar issues like unpatched dependencies, credentials in source code, and missing input and output sanitization, rather than exotic machine-learning attacks. That should be both reassuring and uncomfortable. Reassuring, because the disciplines that secure AI are mostly disciplines we already know. Uncomfortable, because we are skipping them in the rush.

## Agents change the threat model

Everything above is the first wave, and it is mostly a confidentiality problem. Sensitive data goes somewhere it should not. The second wave is different in kind. When you give an AI agent tools and privileges, the risk is no longer only what it might say but what it might do. OWASP's agentic threat taxonomy names memory poisoning, tool misuse, privilege compromise, and rogue agents as the new attack surface.

Gartner expects agentic AI to be embedded in a third of enterprise software by 2028, up from less than 1% in 2024. It also predicts that more than 40% of agentic AI projects will be cancelled by the end of 2027, citing cost, unclear value, and inadequate risk controls. Read those two forecasts together and the message is plain. Agents are coming whether or not we are ready, and the projects that fail will mostly fail on governance rather than capability.

I keep seeing the same pattern. Organizations provision AI agents the way they once provisioned over-privileged service accounts: broad standing access, weak identity, no human in the loop on consequential actions. We spent fifteen years learning that lesson with machine identities. We do not have fifteen years to relearn it with agents. Identity, least privilege, and human approval for irreversible actions are the perimeter now.

## Liability is catching up to security

If the engineering case does not move your board, the legal one will. A Canadian tribunal held Air Canada liable for its chatbot's misrepresentation and rejected the argument that the bot was somehow a separate entity. The principle is now on the record: you own your AI's outputs. On the regulatory side, the EU AI Act carries penalties of up to 35 million euros or 7% of global turnover, with obligations phasing in over the next several years. NIST has published a Generative AI Profile under its AI Risk Management Framework that explicitly calls for red-teaming, and ISO/IEC 42001 has arrived as the first certifiable AI management system standard.

All of this points to an emerging standard of care. Within a year or two, "we didn't know" will not hold up, technically or legally.

## What good looks like

The throughline of my practice is that you can adopt AI boldly because you have built the foundation to contain its risks. In practice that means five things. Sanction and secure fast, so the approved tools beat the workaround. Inventory where AI is actually being used, and put real access controls around it. Build guardrails and continuous evaluation into the model lifecycle, from data and fine-tuning through deployment and agentic workflows, instead of testing once at launch. Secure the AI supply chain, including model provenance, data lineage, and third-party and open-source model risk. And treat governance as the thing that lets the business move faster with confidence, rather than the thing that pushes it into the shadows.

The enterprises that get this right will not be the most cautious ones. They will be the ones that made adoption safe enough to be aggressive.`,
    sources: [
      { label: 'Stanford HAI: 2025 AI Index Report (Economy)', url: 'https://hai.stanford.edu/ai-index/2025-ai-index-report' },
      { label: 'IBM: Cost of a Data Breach Report 2025', url: 'https://www.ibm.com/reports/data-breach' },
      { label: 'Microsoft & LinkedIn: 2024 Work Trend Index', url: 'https://www.microsoft.com/en-us/worklab/work-trend-index/ai-at-work-is-here-now-comes-the-hard-part' },
      { label: 'OWASP: Top 10 for LLM Applications 2025', url: 'https://genai.owasp.org/llm-top-10/' },
      { label: 'Wiz Research: 38TB of Microsoft AI data exposed', url: 'https://www.wiz.io/blog/38-terabytes-of-private-data-accidentally-exposed-by-microsoft-ai-researchers' },
      { label: 'Wiz Research: Exposed DeepSeek database', url: 'https://www.wiz.io/blog/wiz-research-uncovers-exposed-deepseek-database-leak' },
      { label: 'Microsoft: Lessons from Red Teaming 100 Generative AI Products', url: 'https://www.microsoft.com/en-us/security/blog/2025/01/13/3-takeaways-from-red-teaming-100-generative-ai-products/' },
      { label: 'OWASP: Agentic AI: Threats and Mitigations', url: 'https://genai.owasp.org/resource/agentic-ai-threats-and-mitigations/' },
      { label: 'Gartner: Over 40% of agentic AI projects will be canceled by 2027', url: 'https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027' },
      { label: 'NIST: AI 600-1, Generative AI Profile', url: 'https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf' },
      { label: 'Moffatt v. Air Canada (CRT, 2024)', url: 'https://www.canlii.org/en/bc/bccrt/doc/2024/2024bccrt149/2024bccrt149.html' },
    ],
  },

  // --------------------------------------------------------------------------
  // 2. AI FOR SECURITY
  // --------------------------------------------------------------------------
  {
    slug: 'rebuilding-the-soc-for-an-ai-speed-adversary',
    title: 'Rebuilding the SOC for an AI-Speed Adversary',
    category: 'AI for Security',
    dek: 'Attackers compressed breakout time to minutes and deleted the cost of expertise. You cannot defend a machine-speed adversary at human speed.',
    date: '2026-06-21',
    readingTimeMinutes: 8,
    body: `The arithmetic of the security operations center has inverted, and most defenders have not noticed yet.

Start with the attacker's clock. CrowdStrike's 2026 Global Threat Report puts the average eCrime breakout time, the gap between an initial foothold and lateral movement, at 29 minutes, with the fastest observed at 27 seconds. A few years ago that number was measured in hours. Mandiant found the average time to exploit a vulnerability after disclosure collapsed to five days, down from sixty-three a few years earlier, with most exploited vulnerabilities being zero-days. Ransomware now lands within a day of initial access in more than half of incidents.

Now the defender's clock. Mandiant's M-Trends reports a global median dwell time around eleven days, and IBM's 2025 breach data shows a mean time to identify and contain of 241 days. That 241 figure is celebrated as a nine-year low. Hold the two clocks side by side. The adversary moves in minutes. We respond in months. This is not a tuning problem. It is a structural mismatch, and you cannot close a structural mismatch with overtime.

## The defenders are already underwater

The mismatch is worse because the human capacity to fix it does not exist. ISC2's workforce study put the global cybersecurity gap at 4.76 million unfilled roles against a workforce that grew by roughly 0.1% in a year. In its 2025 study, ISC2 reported that 95% of organizations face at least one security skills gap and that 88% suffered a significant security event they attribute to that shortage. The single most in-demand skill they identified was AI.

The analysts we do have are drowning. Industry state-of-the-SOC research consistently describes thousands of alerts a day, roughly half of them false positives, and a large fraction never investigated at all. The human cost follows. Tines' Voice of the SOC found 63% of analysts reporting burnout and more than half saying they were likely to change jobs within the year. You cannot out-hire this. You cannot out-suffer it either.

## AI did not invent new attacks. It deleted the cost of expertise.

This is the part that should reframe the conversation. When Microsoft and OpenAI jointly disrupted five nation-state groups misusing large language models in early 2024, their notable finding was that they had not yet seen particularly novel AI-enabled attack techniques. The tradecraft was familiar. What changed was the economics of who can run it.

AI-generated phishing, per Microsoft's 2025 Digital Defense Report, achieves a 54% click-through rate against 12% for manually written lures, and the report estimates AI can make a phishing campaign up to fifty times more profitable. CrowdStrike logged a 442% surge in voice phishing between the first and second halves of 2024. Engineering firm Arup lost 25.6 million dollars to a single deepfake video call in which the CFO and the colleagues on screen were all AI-generated. Deloitte projects that generative-AI-enabled fraud losses in the US will reach 40 billion dollars by 2027.

Then came the threshold moments. Anthropic disclosed a case of "vibe hacking" in which one low-skilled criminal used an AI coding agent to run an extortion campaign against at least seventeen organizations in a single month. Google's threat intelligence group documented the first malware seen querying a large language model mid-execution to generate its own commands. And in late 2025 Anthropic reported disrupting what it described as the first AI-orchestrated cyber-espionage campaign, in which the model executed an estimated 80 to 90% of the tactical operations against roughly thirty targets, with human operators stepping in at only a handful of decision points.

> The real disruption is not a new weapon. It is the collapse of the skill barrier. Assume every adversary now operates near the capability ceiling rather than the floor.

## The rebuild: AI owns scale, humans own consequence

The case for AI in defense is no longer a slide in a deck. It is measured. CrowdStrike reports that its agentic triage agrees with expert human triage more than 98% of the time and saves customers an average of more than forty hours of manual work per week. Microsoft's randomized controlled trials found that Security Copilot made newer analysts markedly more accurate and roughly a quarter faster. Google's Big Sleep agent became the first AI to find a previously unknown, exploitable memory-safety vulnerability in widely used real-world software, and it has since found real CVEs. The productivity case is settled.

The part the vendors undersell is that autonomy is itself a new attack surface. Automation bias leads people to over-trust machine output. Dense, multi-step agent action traces become effectively uninterpretable. An agent that can take a production server offline to contain a threat can also cause the outage it was meant to prevent. The goal is not to automate fastest. It is to engineer the trust boundary deliberately.

So the rebuild I advocate is human-on-the-loop rather than human-out-of-the-loop. Let AI own the work that scales and exhausts people: triage, enrichment, correlation, first-pass investigation, the relentless winnowing of those thousands of daily alerts. Reserve for humans the work that requires judgment and carries consequence: irreversible remediation, attribution calls, and anything that touches production or customers. The boundary between those two zones is the single most important design decision in a modern SOC.

## Where to start

Three moves, in order. First, instrument your real numbers: breakout-time exposure, mean time to respond, and the ratio of alerts to actual investigations. You cannot rebuild what you have not measured, and the gap is almost always wider than leadership believes. Second, point AI at your highest-volume, lowest-judgment workflows first, because triage and enrichment give you the fastest relief and the safest failure modes. Third, before you automate any consequential action, write down the trust boundary explicitly: what the machine may do alone, what requires a human, and how a person can see and reverse what the machine did.

The organizations that win the next phase will not be the ones that automate the most. They will be the ones that restored symmetry of speed against the adversary while keeping human judgment exactly where it belongs.`,
    sources: [
      { label: 'CrowdStrike: 2026 Global Threat Report', url: 'https://www.crowdstrike.com/en-us/global-threat-report/' },
      { label: 'Mandiant: Time-to-Exploit Trends', url: 'https://cloud.google.com/blog/topics/threat-intelligence/time-to-exploit-trends-2023' },
      { label: 'Mandiant: M-Trends 2025', url: 'https://cloud.google.com/blog/topics/threat-intelligence/m-trends-2025' },
      { label: 'IBM: Cost of a Data Breach Report 2025', url: 'https://www.ibm.com/reports/data-breach' },
      { label: 'ISC2: 2024 Cybersecurity Workforce Study', url: 'https://www.isc2.org/Insights/2024/10/ISC2-2024-Cybersecurity-Workforce-Study' },
      { label: 'Tines: Voice of the SOC 2023', url: 'https://www.tines.com/reports/voice-of-the-soc-2023/' },
      { label: 'Microsoft: Digital Defense Report 2025', url: 'https://www.microsoft.com/en-us/security/security-insider/threat-landscape/microsoft-digital-defense-report-2025' },
      { label: 'Fortune: Arup $25.6M deepfake fraud', url: 'https://fortune.com/europe/2024/05/17/arup-deepfake-fraud-scam-victim-hong-kong-25-million-cfo/' },
      { label: 'Deloitte: Generative AI and the fraud landscape', url: 'https://www.deloitte.com/us/en/insights/industry/financial-services/deepfake-banking-fraud-risk-on-the-rise.html' },
      { label: 'Anthropic: Detecting and countering misuse of AI (Aug 2025)', url: 'https://www.anthropic.com/news/detecting-countering-misuse-aug-2025' },
      { label: 'Anthropic: Disrupting AI espionage (Nov 2025)', url: 'https://www.anthropic.com/news/disrupting-AI-espionage' },
      { label: 'Google: From Naptime to Big Sleep', url: 'https://googleprojectzero.blogspot.com/2024/10/from-naptime-to-big-sleep.html' },
      { label: 'CrowdStrike: Charlotte AI agentic detection triage', url: 'https://www.crowdstrike.com/en-us/blog/agentic-ai-innovation-in-cybersecurity-charlotte-ai-detection-triage/' },
      { label: 'Microsoft & OpenAI: Staying ahead of threat actors in the age of AI', url: 'https://www.microsoft.com/en-us/security/blog/2024/02/14/staying-ahead-of-threat-actors-in-the-age-of-ai/' },
    ],
  },

  // --------------------------------------------------------------------------
  // 3. DATA PROTECTION
  // --------------------------------------------------------------------------
  {
    slug: 'shrinking-the-blast-radius',
    title: 'Shrinking the Blast Radius',
    category: 'Data Protection',
    dek: 'You cannot guarantee a breach will not happen. You can decide how much it costs when it does. Encryption, tokenization, and minimization are blast-radius controls, not prevention controls.',
    date: '2026-06-21',
    readingTimeMinutes: 8,
    body: `Most security budgets are still built on a quiet assumption, which is that with enough investment we can keep attackers out. After two decades in this field, including time as a CIO who owned the consequences, I no longer believe that assumption survives contact with the data. Breaches are not going down. The honest planning posture is that a serious compromise is a matter of when, not if, and that the variable actually within your control is not whether attackers get in but how much they can reach once they do.

That variable has a name. Blast radius. And IBM's breach economics show it is the most leveraged thing a security leader can manage.

## The data points to containment, not prevention

IBM's 2025 Cost of a Data Breach report put the global average at 4.44 million dollars and the US average at a record 10.22 million. The averages hide the real lesson, which lives in the spread. In the 2024 report, breaches involving data spread across multiple environments, on-premises and cloud and SaaS at once, cost more than 5 million dollars and took 283 days to resolve, the longest of any category. Breaches involving shadow data, meaning data sitting in stores nobody was managing, occurred in 35% of cases, cost 16% more, and took over a quarter longer to identify.

Read those numbers as a single sentence. The more places your sensitive data lives, and the less you know about where it is, the more a breach costs and the longer it bleeds. That is the blast-radius problem, quantified. Meanwhile the threat keeps widening. Verizon's 2025 Data Breach Investigations Report found ransomware present in 44% of breaches, up from 32%, and the share of breaches involving a third party doubled to 30%.

> Prevention spending has plateaued in effectiveness. The asymmetric return is now in reducing what is exposed when, not if, an attacker gets in.

## You cannot lose what you do not have

The cheapest data to protect is the data you never collected, or have already deleted. That used to be a privacy argument. It is now a security control with regulatory teeth.

GDPR has always required data minimization, which means personal data must be adequate, relevant, and limited to what is necessary, and kept no longer than necessary. What is new is enforcement of over-retention as an offense in its own right. In early 2026, France's data protection authority fined a major telecom 42 million euros after finding it had retained millions of records without justification for an excessive period, and that the over-retained data enlarged the blast radius of a breach affecting tens of millions of subscribers. In the US, California's privacy regulator made data minimization the subject of its very first enforcement advisory and called it a foundational principle. Nineteen states now have comprehensive privacy laws on the books.

NIST states the point plainly in its guidance on protecting personal data: the likelihood of harm from a breach is greatly reduced if an organization minimizes the amount of personal data it uses, collects, and stores. The most under-used security control in most enterprises is the delete key. Over-retained data carries no business value and full breach liability.

## Encrypt now for the breach you will have in 2030

Minimization shrinks the target. Encryption and tokenization shrink what an attacker gets even after reaching it. Tokenization removes the real sensitive values, such as card numbers and identifiers, from most of your systems entirely, which is why it collapses both PCI scope and breach exposure at the same time. Format-preserving encryption, standardized by NIST, lets you protect structured data without breaking the applications that depend on its shape. None of this is new. It is under-applied.

A second clock is running that most roadmaps ignore. Adversaries are already harvesting encrypted data today to decrypt later, once quantum computers mature. This harvest-now, decrypt-later threat is not science fiction for data with a long shelf life. Financial records, health data, and trade secrets stolen now may still be sensitive when the cryptography protecting them fails. NIST finalized the first post-quantum cryptography standards in 2024, and national authorities have set migration deadlines around 2035. Any data you encrypt today with a multi-decade confidentiality requirement belongs on a path to post-quantum protection.

These are not three separate initiatives. Tokenization, format-preserving encryption, and post-quantum migration form one continuous data-protection roadmap, sequenced by the shelf life of what you are protecting.

## Data protection is the foundation under safe AI

Every AI initiative ultimately runs on data, which makes data both the prize and the liability. IBM's 2025 data found that one in five organizations suffered a breach tied to shadow AI, with a cost premium of roughly 670,000 dollars, and that 97% of organizations with a breached AI system lacked proper access controls. Security vendors that monitor AI usage report that a large and rising share of the data flowing into AI tools is sensitive, and that most of it moves through non-corporate accounts where security cannot see it.

You cannot govern AI you cannot see, and you cannot protect tomorrow's data with yesterday's cryptography. Data protection is not a workstream sitting beside your AI strategy. It is the foundation underneath it.

## Where to start

Three priorities. First, find your data, especially the shadow data, because the 35% of breaches that involve unmanaged stores are by definition stores you would not have thought to protect. Discovery comes before everything else. Second, minimize aggressively: shorten retention, delete what has no purpose, and treat every field you collect as a liability you have chosen to carry. Third, apply encryption and tokenization according to the shelf life of the data, and put anything with a long confidentiality horizon on a post-quantum path now.

You will not prevent every breach. You can decide, well ahead of time, how small the blast radius will be when one happens. That decision sits at the heart of data protection, and it is one of the highest-return choices a security leader can make.`,
    sources: [
      { label: 'IBM: Cost of a Data Breach Report 2025', url: 'https://www.ibm.com/reports/data-breach' },
      { label: 'IBM: 2024 Cost of a Data Breach (newsroom)', url: 'https://newsroom.ibm.com/2024-07-30-ibm-report-escalating-data-breach-disruption-pushes-costs-to-new-highs' },
      { label: 'Verizon: 2025 Data Breach Investigations Report', url: 'https://www.verizon.com/business/resources/reports/dbir/' },
      { label: 'ITRC: 2024 Annual Data Breach Report', url: 'https://www.idtheftcenter.org/publication/2024-data-breach-report/' },
      { label: 'GDPR: Article 5 (data minimisation & storage limitation)', url: 'https://gdpr-info.eu/art-5-gdpr/' },
      { label: 'CNIL: Sanction of Free (2026)', url: 'https://www.cnil.fr/en/sanction-free-2026' },
      { label: 'CPPA: Enforcement Advisory 2024-01 (data minimization)', url: 'https://cppa.ca.gov/pdf/enfadvisory202401.pdf' },
      { label: 'NIST: SP 800-122 (protecting PII)', url: 'https://csrc.nist.gov/pubs/sp/800/122/final' },
      { label: 'NIST: Post-Quantum Cryptography standards (FIPS 203/204/205)', url: 'https://csrc.nist.gov/news/2024/postquantum-cryptography-fips-approved' },
      { label: 'NIST: SP 800-38G (format-preserving encryption)', url: 'https://csrc.nist.gov/pubs/sp/800/38/g/upd1/final' },
    ],
  },
]

export function getInsight(slug: string): Insight | undefined {
  return insights.find((i) => i.slug === slug)
}

export function getInsightSlugs(): string[] {
  return insights.map((i) => i.slug)
}
