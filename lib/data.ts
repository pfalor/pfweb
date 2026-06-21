// ============================================================================
// PAUL FALOR - SITE DATA
// ============================================================================
// This file contains all content for paulfalor.com
// Edit the values below to update the website content
// ============================================================================

// ----------------------------------------------------------------------------
// PERSONAL INFORMATION
// ----------------------------------------------------------------------------
export const personalInfo = {
  name: 'Paul Falor',
  title: 'Practice Lead | Secure, Responsible AI & Data Protection | Americas',
  location: 'Atlanta, GA',
  email: 'paulfalor@gmail.com',
  phone: '(404) 840-9450',
  linkedin: 'https://www.linkedin.com/in/pfalor',
  summary: `I lead Accenture's Secure, Responsible AI & Data Protection practice across the Americas, covering the United States, Canada, and Latin America, helping enterprises adopt AI boldly without outrunning their ability to secure it. My work spans three fronts: building the foundation, guardrails, and controls that let the business use GenAI and frontier models safely; reimagining security operations with AI to match adversaries who now move faster and at lower cost; and protecting the data itself, so that when something does go wrong the exposure and blast radius stay contained. With more than 20 years leading global security and technology operations, including time as a CIO, I bring a practitioner's perspective to every engagement: strategy grounded in operational reality.`,
}

// ----------------------------------------------------------------------------
// CREDENTIALS & AWARDS
// ----------------------------------------------------------------------------
export const credentials = [
  { label: 'Georgia CIO of the Year', type: 'award', subtitle: 'InspireCIO' },
]

// ----------------------------------------------------------------------------
// QUICK STATS (shown in summary section)
// ----------------------------------------------------------------------------
export const stats = [
  { value: 20, suffix: '+', label: 'Years in Security & IT' },
  { value: 5, suffix: '', label: 'Countries Secured' },
  { value: 1, suffix: 'B+', label: 'Revenue Enabled', prefix: '$' },
  { value: 6, suffix: '', label: 'M&A Integrations Led' },
]

// ----------------------------------------------------------------------------
// PRACTICE AREAS (Secure Digital Core)
// ----------------------------------------------------------------------------
export const practiceAreas = [
  {
    id: 'security-for-ai',
    title: 'Security for AI',
    icon: 'ai-shield',
    headline: 'Adopt AI boldly, with a foundation built to contain its risks.',
    description: `GenAI and frontier models are reshaping how the business operates, but they also open a new attack surface: prompt injection, model and data poisoning, sensitive-data leakage, and agents that act with real privileges. I help organizations put the foundation, guardrails, and controls in place, including AI governance, model and pipeline security, runtime guardrails, and continuous evaluation, so the enterprise can capture AI's upside without inheriting unmanaged risk.`,
    outcomes: [
      'Establish AI governance and risk frameworks aligned to NIST AI RMF, ISO 42001, and the EU AI Act',
      'Embed guardrails and continuous evaluation across the model lifecycle, from data and fine-tuning to deployment and agentic workflows',
      'Secure the AI supply chain: model provenance, data lineage, and third-party and open-source model risk',
    ],
  },
  {
    id: 'ai-for-security',
    title: 'AI for Security',
    icon: 'ai-defense',
    headline: 'Attackers already use AI. Your defense has to answer in kind.',
    description: `AI has lowered the barrier to entry for attackers and collapsed the time from intent to impact. Defending at that speed means rebuilding security operations around AI rather than bolting it on. I help organizations redefine the methodology and processes so AI accelerates detection, triage, investigation, and response, through agentic SOC workflows, automated threat analysis, and human-in-the-loop decisioning that keeps analysts focused on what matters.`,
    outcomes: [
      'Reduced mean time to detect by 75% and mean time to respond by 60% through modern, automation-driven security operations',
      'Design AI-augmented SOC operating models for triage, enrichment, and response, with human-in-the-loop guardrails',
      'Reduced average vulnerability age from 45 to 12 days with 99% critical patch compliance',
    ],
  },
  {
    id: 'data-protection',
    title: 'Data Protection',
    icon: 'data',
    headline: "You can't always prevent the breach. You can shrink the blast radius.",
    description: `Every AI and digital initiative ultimately runs on data, which makes data both the prize and the liability. I help organizations minimize exposure across the data lifecycle with the full set of data protection disciplines: data security and classification, encryption, tokenization, and minimization. The goal is simple: reduce how much sensitive data is exposed, and contain the damage if an attacker ever gets through.`,
    outcomes: [
      'Implement encryption, tokenization, and data minimization to reduce sensitive-data exposure and blast radius',
      'Built risk and compliance programs aligned with ISO 27001, HITRUST, HIPAA, and GDPR, certified on first audit with zero critical findings',
      'Design data classification and governance frameworks across multiple regulatory regimes',
    ],
  },
]

// ----------------------------------------------------------------------------
// WORK EXPERIENCE
// ----------------------------------------------------------------------------
export const experience = [
  {
    id: 0,
    company: 'Accenture',
    role: 'Managing Director, Secure, Responsible AI & Data Protection Practice Lead for the Americas',
    period: 'March 2026 - Present',
    location: 'Atlanta, GA',
    highlights: [
      'Lead the Secure, Responsible AI & Data Protection practice across the Americas (US, Canada, and LATAM), helping enterprises adopt AI safely while protecting the data underneath.',
      'Advise C-suite, CISO, and CDO clients on Security for AI, AI for Security, and Data Protection, translating fast-moving technical risk into business-aligned roadmaps.',
      'Drive growth across a rapidly expanding practice spanning AI governance and guardrails, AI-augmented security operations, and data protection.',
    ],
    metrics: [
      { label: 'Scope', value: 'Americas' },
      { label: 'Focus', value: 'Secure & Responsible AI' },
      { label: 'Domains', value: '3 Practice Areas' },
    ],
  },
  {
    id: 1,
    company: 'North Highland',
    role: 'Chief Information Officer, Senior Managing Director, Security & Technology',
    period: 'October 2014 - March 2026',
    location: 'Atlanta, GA',
    highlights: [
      'Led global technology operations across 5 countries and time zones, overseeing security, compliance, product development, infrastructure, data & analytics, and enterprise applications.',
      'Established global secure digital core spanning cloud, network, data, and platform security. Reduced MTTD by 75%, MTTR by 60%, decreased average vulnerability age from 45 to 12 days, and achieved 99% critical patch compliance.',
      'Led multi-year digital transformation, replacing 19 legacy systems with comprehensive ERP, HRIS, PSA, FIN, and CRM implementation.',
      'Led technology due diligence and post-deal integration for 6 acquisitions, creating a repeatable M&A playbook to execute at scale.',
      'Built and led high-performing technology team with 86% engagement scores, consistently 15% above organizational average. Reduced attrition by 40%.',
      'Championed AI-assisted product development methodology, reducing cost and time to market by over 90%.',
      'Created comprehensive risk and compliance program aligned with ISO27001, HITRUST, HIPAA, GDPR, and UK CyberEssentials. Achieved certification on first audit with zero critical findings.',
      'Executed full-scale cloud migration, reducing TCO by 30%. Architected near real-time disaster recovery, achieving 99.95% uptime and reducing RTO from 48 hours to 4 hours.',
    ],
    metrics: [
      { label: 'MTTD Reduction', value: '75%' },
      { label: 'Uptime', value: '99.95%' },
      { label: 'TCO Reduction', value: '30%' },
    ],
  },
  {
    id: 2,
    company: 'Global Payments',
    role: 'Director, Threat & Vulnerability Management',
    period: 'April 2013 - October 2014',
    location: 'Atlanta, GA',
    highlights: [
      'Led the Threat & Vulnerability Management (TVM) program for one of the world\'s largest payment processors, transforming cyber risks into actionable data-driven insights.',
      'Built and managed high-performing security teams, including vulnerability analysts, application security assessors, penetration testers, and data loss prevention specialists.',
      'Developed a robust governance framework with policies, standards, and procedures to ensure regulatory compliance with PCI-DSS and SOC2 guidelines.',
      'Optimized security operations by implementing advanced vulnerability assessment methodologies. Reduced time to remediate by 87% and time to detect by 91%.',
      'Served as a strategic security advisor, integrating security best practices into all phases of software development lifecycle.',
    ],
    metrics: [
      { label: 'Remediation Time', value: '-87%' },
      { label: 'Detection Time', value: '-91%' },
      { label: 'Compliance', value: 'PCI-DSS' },
    ],
  },
  {
    id: 3,
    company: 'Truist',
    role: 'Vice President, IT Audit Manager',
    period: 'March 2012 - April 2013',
    location: 'Atlanta, GA',
    highlights: [
      'Led end-to-end technology audit engagements, including planning, scoping, risk assessment, control testing, results validation, and reporting.',
      'Served as the primary liaison and trusted advisor to Truist\'s Technology & Risk teams, strengthening collaboration and risk mitigation strategies.',
      'Provided strategic technology audit insights to executive leadership, leveraging prior security leadership experience and industry best practices.',
      'Engaged with technology leadership in steering committees, project meetings, and strategic planning sessions.',
      'Conducted quarterly enterprise risk assessments to identify emerging threats and inform the IT audit roadmap.',
    ],
    metrics: [
      { label: 'Role', value: 'VP' },
      { label: 'Focus', value: 'IT Audit' },
      { label: 'Scope', value: 'Enterprise' },
    ],
  },
  {
    id: 4,
    company: 'TRX',
    role: 'Director, Information Security',
    period: 'May 2008 - March 2012',
    location: 'Atlanta, GA',
    highlights: [
      'Established the first Information Security program for a leading SaaS travel provider, building a strong security foundation to protect global technology assets.',
      'Led a team of cybersecurity professionals safeguarding critical information assets for a global technology hosting company.',
      'Owned and maintained compliance programs, including PCI-DSS and NIST SP 800-53.',
      'Designed and implemented an enterprise Threat & Vulnerability Management program, enhancing risk detection, mitigation, and security posture.',
      'Served as the primary security liaison for customers and conducted vendor security assessments.',
    ],
    metrics: [
      { label: 'Program', value: 'Built from scratch' },
      { label: 'Compliance', value: 'PCI-DSS' },
      { label: 'Framework', value: 'NIST 800-53' },
    ],
  },
  {
    id: 5,
    company: 'KPMG',
    role: 'Information Protection Senior Associate',
    period: 'May 2005 - May 2008',
    location: 'Atlanta, GA',
    highlights: [
      'Conducted and managed internal and external vulnerability assessments and penetration testing, leveraging both manual and automated tools.',
      'Supported compliance initiatives for PCI-DSS, HIPAA, and ISO 17799, driving readiness assessments and remediation efforts.',
      'Developed and deployed enterprise-wide Security Policies and Procedures, enhancing governance and security best practices.',
      'Led strategic Identity and Access Management (IAM) planning and implementation.',
      'Provided subject matter expertise for Security and Logical Access controls in Financial Statement and SOX audits.',
    ],
    metrics: [
      { label: 'Clients', value: 'Fortune 500' },
      { label: 'Focus', value: 'Security' },
      { label: 'Compliance', value: 'SOX/PCI' },
    ],
  },
]

// ----------------------------------------------------------------------------
// IMPACT METRICS (dashboard section)
// ----------------------------------------------------------------------------
export const metrics = [
  {
    id: 1,
    value: 75,
    suffix: '%',
    label: 'MTTD Reduction',
    description: 'Mean Time to Detect security incidents reduced through advanced security operations',
    category: 'Security',
  },
  {
    id: 2,
    value: 99.95,
    suffix: '%',
    label: 'System Uptime',
    description: 'Enterprise system availability with near real-time disaster recovery',
    category: 'Operations',
  },
  {
    id: 3,
    value: 1,
    suffix: 'B+',
    prefix: '$',
    label: 'Revenue Enabled',
    description: 'New revenue opportunities through compliance certifications and market expansion',
    category: 'Business Impact',
  },
  {
    id: 4,
    value: 90,
    suffix: '%+',
    label: 'AI Dev Efficiency',
    description: 'Cost and time to market reduction through AI-assisted product development',
    category: 'Innovation',
  },
  {
    id: 5,
    value: 30,
    suffix: '%',
    label: 'TCO Reduction',
    description: 'Total cost of ownership reduced through cloud migration and modernization',
    category: 'Efficiency',
  },
  {
    id: 6,
    value: 6,
    suffix: '',
    label: 'M&A Integrations',
    description: 'Successful technology due diligence and post-deal integrations',
    category: 'Growth',
  },
]

// ----------------------------------------------------------------------------
// EXPERTISE AREAS
// ----------------------------------------------------------------------------
export const expertise = {
  security: {
    title: 'Security & Compliance',
    icon: 'shield',
    skills: [
      'ISO 27001',
      'HITRUST',
      'HIPAA',
      'GDPR',
      'PCI-DSS',
      'SOC 2',
      'NIST SP 800-53',
      'UK CyberEssentials',
      'Threat & Vulnerability Management',
      'Security Operations',
    ],
  },
  digital: {
    title: 'Digital Transformation',
    icon: 'transform',
    skills: [
      'Cloud Migration',
      'ERP Implementation',
      'Legacy System Modernization',
      'Global Standardization',
      'Disaster Recovery',
      'Infrastructure Optimization',
    ],
  },
  ai: {
    title: 'AI & Emerging Tech',
    icon: 'brain',
    skills: [
      'AI-Assisted Development',
      'Product Development Methodology',
      'Data & Analytics',
      'Process Automation',
      'Technology Innovation',
    ],
  },
  ma: {
    title: 'M&A Technology Integration',
    icon: 'merge',
    skills: [
      'Technology Due Diligence',
      'Post-Deal Integration',
      'M&A Playbook Development',
      'Cost Takeout Analysis',
      'Enterprise Value Maximization',
    ],
  },
  leadership: {
    title: 'Executive Leadership',
    icon: 'users',
    skills: [
      'Global Team Leadership (5 countries)',
      'Board & PE Communication',
      'Budget Optimization (23% cost reduction)',
      'Vendor Negotiation',
      'High-Performing Teams (86% engagement)',
      'Talent Development & Retention',
    ],
  },
}

// ----------------------------------------------------------------------------
// EDUCATION
// ----------------------------------------------------------------------------
export const education = [
  {
    degree: 'Master of Science in Business Administration',
    major: 'Decision & Information Systems',
    school: 'University of Florida',
    location: 'Gainesville, FL',
    year: '2005',
    gpa: '4.0',
  },
  {
    degree: 'Bachelor of Science in Finance',
    major: 'Minor in Decision & Information Systems',
    school: 'University of Florida',
    location: 'Gainesville, FL',
    year: '2004',
  },
]

// ----------------------------------------------------------------------------
// THOUGHT LEADERSHIP (Coming Soon placeholders)
// ----------------------------------------------------------------------------
export const thoughtLeadership = [
  {
    title: 'Securing the Enterprise Rush to GenAI',
    category: 'Security for AI',
    description: 'Guardrails, governance, and controls that let the business move fast on AI without inheriting unmanaged risk.',
    status: 'published',
    slug: 'securing-the-enterprise-rush-to-genai',
    readingTimeMinutes: 7,
  },
  {
    title: 'Rebuilding the SOC for an AI-Speed Adversary',
    category: 'AI for Security',
    description: 'Attackers have AI and a lower barrier to entry. What a security operation redesigned around AI actually looks like.',
    status: 'published',
    slug: 'rebuilding-the-soc-for-an-ai-speed-adversary',
    readingTimeMinutes: 8,
  },
  {
    title: 'Shrinking the Blast Radius',
    category: 'Data Protection',
    description: 'Why encryption, tokenization, and data minimization are your last and best line of defense.',
    status: 'published',
    slug: 'shrinking-the-blast-radius',
    readingTimeMinutes: 8,
  },
]

// ----------------------------------------------------------------------------
// PROJECTS (kept for compatibility - not currently displayed)
// ----------------------------------------------------------------------------
export const projects: { title: string; description: string; tags: string[]; status: string }[] = []

// ----------------------------------------------------------------------------
// NAVIGATION
// ----------------------------------------------------------------------------
export const navigationItems = [
  { label: 'About', href: '#about' },
  { label: 'Practice Areas', href: '#practice-areas' },
  { label: 'Insights', href: '#thought-leadership' },
  { label: 'Blog', href: 'https://blog.paulfalor.com' },
  { label: 'Impact', href: '#impact' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
]

// ----------------------------------------------------------------------------
// TERMINAL COMMANDS (Easter egg)
// ----------------------------------------------------------------------------
export const terminalCommands = {
  help: `Available commands:
  whoami    - Display profile summary
  skills    - List technical skills
  exp       - Show work experience
  contact   - Get contact information
  clear     - Clear terminal
  exit      - Exit terminal mode`,
  whoami: `Paul Falor
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Practice Lead, Secure, Responsible AI & Data Protection for the Americas @ Accenture
Location: Atlanta, GA
Georgia CIO of the Year - InspireCIO
20+ years leading global security & technology operations`,
  skills: `Focus Areas
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Security for AI:   AI governance, guardrails, model & pipeline security
AI for Security:   AI-augmented SOC, automated detection & response
Data Protection:   Encryption, tokenization, data minimization
Frameworks:        NIST AI RMF, ISO 42001, EU AI Act, ISO27001, GDPR
Leadership:        Practice across US, Canada & LATAM`,
  exp: `Career Timeline
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2014-Present  CIO, North Highland
2013-2014     Director TVM, Global Payments
2012-2013     VP IT Audit, Truist
2008-2012     Director InfoSec, TRX
2005-2008     Sr Associate, KPMG`,
  contact: `Contact Information
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Email:    paulfalor@gmail.com
Phone:    (404) 840-9450
LinkedIn: linkedin.com/in/pfalor
Location: Atlanta, GA`,
}
