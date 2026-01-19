// ============================================================================
// PAUL FALOR - RESUME DATA
// ============================================================================
// This file contains all content for paulfalor.com
// Edit the values below to update the website content
// ============================================================================

// ----------------------------------------------------------------------------
// PERSONAL INFORMATION
// ----------------------------------------------------------------------------
export const personalInfo = {
  name: 'Paul Falor',
  title: 'CIO & Security Executive | Digital Transformation Leader',
  location: 'Atlanta, GA',
  email: 'paulfalor@gmail.com',
  phone: '(404) 840-9450',
  linkedin: 'https://www.linkedin.com/in/pfalor',
  summary: `Results-driven executive with a proven track record leading global IT operations, security programs, and digital transformation initiatives that increase business value. Deep expertise in people industries including professional services, staffing, and consulting. Skilled at aligning technology strategy with enterprise objectives for public, private, and PE-backed organizations.`,
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
  { value: 20, suffix: '+', label: 'Years Experience' },
  { value: 5, suffix: '', label: 'Countries Led' },
  { value: 1, suffix: 'B+', label: 'Revenue Enabled', prefix: '$' },
  { value: 6, suffix: '', label: 'Acquisitions Integrated' },
]

// ----------------------------------------------------------------------------
// WORK EXPERIENCE
// ----------------------------------------------------------------------------
export const experience = [
  {
    id: 1,
    company: 'North Highland',
    role: 'Chief Information Officer, Senior Managing Director, Security & Technology',
    period: 'October 2014 - Present',
    location: 'Atlanta, GA',
    highlights: [
      'Led global technology operations across 5 countries and time zones, overseeing security, compliance, product development, infrastructure, data & analytics, and enterprise applications.',
      'Established global secure digital core spanning cloud, network, data, and platform security. Reduced MTTD by 75%, MTTR by 60%, decreased average vulnerability age from 45 to 12 days, and achieved 99% critical patch compliance.',
    ],
    metrics: [
      { label: 'MTTD Reduction', value: '75%' },
      { label: 'Uptime', value: '99.95%' },
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
]

// ----------------------------------------------------------------------------
// THOUGHT LEADERSHIP (Coming Soon placeholders)
// ----------------------------------------------------------------------------
export const thoughtLeadership = [
  {
    title: 'The Future of AI in Enterprise Security',
    category: 'AI Strategy',
    description: 'Exploring how generative AI is transforming threat detection and response',
    status: 'coming-soon',
  },
  {
    title: 'Building a Repeatable M&A Playbook',
    category: 'M&A Integration',
    description: 'Lessons learned from 6 successful technology integrations',
    status: 'coming-soon',
  },
  {
    title: 'Digital Transformation in Professional Services',
    category: 'Digital Transformation',
    description: 'Key insights from replacing 19 legacy systems with modern platforms',
    status: 'coming-soon',
  },
]

// ----------------------------------------------------------------------------
// PROJECTS (Coming Soon placeholders)
// ----------------------------------------------------------------------------
export const projects = [
  {
    title: 'AI Security Assistant',
    description: 'An AI-powered tool for automated security analysis and recommendations',
    tags: ['AI', 'Security', 'Automation'],
    status: 'coming-soon',
  },
  {
    title: 'M&A Tech Assessment Framework',
    description: 'Repeatable framework for technology due diligence in acquisitions',
    tags: ['M&A', 'Framework', 'Assessment'],
    status: 'coming-soon',
  },
  {
    title: 'Compliance Dashboard',
    description: 'Real-time compliance monitoring across multiple frameworks',
    tags: ['Compliance', 'Dashboard', 'Monitoring'],
    status: 'coming-soon',
  },
]

// ----------------------------------------------------------------------------
// NAVIGATION
// ----------------------------------------------------------------------------
export const navigationItems = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Impact', href: '#impact' },
  { label: 'Expertise', href: '#expertise' },
  { label: 'Education', href: '#education' },
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
CIO & Security Executive | Digital Transformation Leader
Location: Atlanta, GA
Georgia CIO of the Year - InspireCIO
20+ years leading global IT operations & security programs`,
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
