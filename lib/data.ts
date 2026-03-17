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
  title: 'Cybersecurity Practice Lead | Secure Digital Core',
  location: 'Atlanta, GA',
  email: 'paulfalor@gmail.com',
  phone: '(404) 840-9450',
  linkedin: 'https://www.linkedin.com/in/pfalor',
  summary: `I lead the Secure Digital Core cybersecurity practice for the US at Accenture, helping enterprises architect and operate security programs that keep pace with cloud adoption, platform modernization, and evolving threats. With 20+ years leading global security and technology operations — including serving as CIO — I bring a practitioner's perspective to every engagement: security strategy grounded in operational reality.`,
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
    id: 'platform-security',
    title: 'Platform Security',
    icon: 'platform',
    headline: 'Your platforms are your business — they should be secured like it.',
    description: `Enterprise platforms like SAP, ServiceNow, and Salesforce are the operational backbone of most large organizations, yet their security posture is often an afterthought. I help clients embed security into platform architecture from day one — identity governance, secure configuration management, and continuous posture monitoring — so that the systems running the business aren't also the ones exposing it.`,
    outcomes: [
      'Built comprehensive platform security program spanning ERP, HRIS, PSA, and CRM during multi-year digital transformation',
      'Achieved compliance certification on first audit with zero critical findings across ISO27001, HITRUST, and GDPR',
      'Replaced 19 legacy systems with hardened, modern platform stack',
    ],
  },
  {
    id: 'cloud-application-security',
    title: 'Cloud & Application Security',
    icon: 'cloud',
    headline: 'Cloud adoption outpaces security controls at most enterprises.',
    description: `The shift to cloud-native architectures creates tremendous opportunity — and tremendous exposure. I work with organizations to build cloud security programs that scale with adoption: CSPM/CWPP implementation, DevSecOps pipeline integration, container and API security, and cloud-native detection and response. The goal is security that enables speed rather than blocking it.`,
    outcomes: [
      'Executed full-scale cloud migration reducing TCO by 30% while strengthening security posture',
      'Architected near real-time disaster recovery — 99.95% uptime, RTO reduced from 48 hours to 4 hours',
      'Reduced mean time to detect by 75% and mean time to respond by 60% through cloud-native security operations',
    ],
  },
  {
    id: 'zero-trust',
    title: 'Zero Trust',
    icon: 'lock',
    headline: 'Trust is a vulnerability. Verify everything, continuously.',
    description: `Zero Trust isn't a product you buy — it's an architecture you build. I help organizations move beyond perimeter-based security toward identity-centric, least-privilege models aligned with NIST ZTA. That means microsegmentation, continuous verification, conditional access policies, and a maturity roadmap that meets the organization where it is today and moves it forward pragmatically.`,
    outcomes: [
      'Established global secure digital core spanning cloud, network, data, and platform security',
      'Reduced average vulnerability age from 45 to 12 days with 99% critical patch compliance',
      'Designed identity governance frameworks across 5 countries and multiple regulatory regimes',
    ],
  },
  {
    id: 'sase-infrastructure',
    title: 'SASE & Infrastructure Security',
    icon: 'network',
    headline: 'The network perimeter dissolved. Security architecture must evolve with it.',
    description: `With distributed workforces, cloud workloads, and SaaS sprawl, traditional network security models no longer hold. I help clients design and implement SASE architectures that converge SD-WAN, secure web gateways, CASB, and ZTNA into a unified security fabric — protecting users, data, and applications regardless of where they sit.`,
    outcomes: [
      'Led global technology operations across 5 countries with unified security architecture',
      'Implemented advanced threat and vulnerability management reducing remediation time by 87%',
      'Built security programs spanning on-prem, cloud, and hybrid infrastructure environments',
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
    role: 'Managing Director, Secure Digital Core Cybersecurity Practice Lead — US',
    period: 'March 2026 - Present',
    location: 'Atlanta, GA',
    highlights: [
      'Lead the US Secure Digital Core cybersecurity practice, helping enterprises architect and operate security programs across platform, cloud, application, zero trust, and infrastructure domains.',
      'Advise C-suite and CISO clients on security strategy, translating complex technical risk into business-aligned roadmaps.',
      'Drive practice growth across Platform Security, Cloud & Application Security, Zero Trust, and SASE & Infrastructure Security.',
    ],
    metrics: [
      { label: 'Scope', value: 'US Practice' },
      { label: 'Focus', value: 'Cybersecurity' },
      { label: 'Domains', value: '4 Practice Areas' },
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
    title: 'Why Zero Trust Fails Without Platform Security',
    category: 'Zero Trust',
    description: 'Most Zero Trust initiatives focus on network and identity — but ignore the platforms where data actually lives',
    status: 'coming-soon',
  },
  {
    title: 'The CISO\'s Cloud Security Blind Spot',
    category: 'Cloud Security',
    description: 'Cloud-native doesn\'t mean cloud-secure. The gaps most organizations miss during migration.',
    status: 'coming-soon',
  },
  {
    title: 'SASE Beyond the Buzzword',
    category: 'SASE',
    description: 'What a pragmatic SASE rollout actually looks like — and what vendors won\'t tell you',
    status: 'coming-soon',
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
Cybersecurity Practice Lead | Secure Digital Core @ Accenture
Location: Atlanta, GA
Georgia CIO of the Year - InspireCIO
20+ years leading global security & technology operations`,
  skills: `Technical Expertise
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Security:     ISO27001, HITRUST, PCI-DSS, SOC2
Compliance:   HIPAA, GDPR, NIST 800-53
Cloud:        Full-scale migration, 99.95% uptime
AI/ML:        AI-assisted development, 90%+ efficiency gains
Leadership:   Global teams across 5 countries`,
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
