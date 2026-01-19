import { NextRequest, NextResponse } from 'next/server'
import type { ResumeData } from '@/lib/resume-types'

const GITHUB_API = 'https://api.github.com'

function generateDataFile(data: ResumeData): string {
  const lines: string[] = []

  lines.push(`// ============================================================================`)
  lines.push(`// PAUL FALOR - RESUME DATA`)
  lines.push(`// ============================================================================`)
  lines.push(`// This file contains all content for paulfalor.com`)
  lines.push(`// Edit the values below to update the website content`)
  lines.push(`// ============================================================================`)
  lines.push(``)

  // Personal Info
  lines.push(`// ----------------------------------------------------------------------------`)
  lines.push(`// PERSONAL INFORMATION`)
  lines.push(`// ----------------------------------------------------------------------------`)
  lines.push(`export const personalInfo = {`)
  lines.push(`  name: '${data.personalInfo.name.replace(/'/g, "\\'")}',`)
  lines.push(`  title: '${data.personalInfo.title.replace(/'/g, "\\'")}',`)
  lines.push(`  location: '${data.personalInfo.location.replace(/'/g, "\\'")}',`)
  lines.push(`  email: '${data.personalInfo.email.replace(/'/g, "\\'")}',`)
  lines.push(`  phone: '${data.personalInfo.phone.replace(/'/g, "\\'")}',`)
  lines.push(`  linkedin: '${data.personalInfo.linkedin.replace(/'/g, "\\'")}',`)
  lines.push(`  summary: \`${data.personalInfo.summary.replace(/`/g, '\\`')}\`,`)
  lines.push(`}`)
  lines.push(``)

  // Credentials
  lines.push(`// ----------------------------------------------------------------------------`)
  lines.push(`// CREDENTIALS & AWARDS`)
  lines.push(`// ----------------------------------------------------------------------------`)
  lines.push(`export const credentials = [`)
  for (const cred of data.credentials) {
    const subtitle = cred.subtitle ? `, subtitle: '${cred.subtitle.replace(/'/g, "\\'")}'` : ''
    lines.push(`  { label: '${cred.label.replace(/'/g, "\\'")}', type: '${cred.type}'${subtitle} },`)
  }
  lines.push(`]`)
  lines.push(``)

  // Stats
  lines.push(`// ----------------------------------------------------------------------------`)
  lines.push(`// QUICK STATS (shown in summary section)`)
  lines.push(`// ----------------------------------------------------------------------------`)
  lines.push(`export const stats = [`)
  for (const stat of data.stats) {
    const prefix = stat.prefix ? `, prefix: '${stat.prefix}'` : ''
    lines.push(`  { value: ${stat.value}, suffix: '${stat.suffix}', label: '${stat.label.replace(/'/g, "\\'")}'${prefix} },`)
  }
  lines.push(`]`)
  lines.push(``)

  // Experience
  lines.push(`// ----------------------------------------------------------------------------`)
  lines.push(`// WORK EXPERIENCE`)
  lines.push(`// ----------------------------------------------------------------------------`)
  lines.push(`export const experience = [`)
  for (const exp of data.experience) {
    lines.push(`  {`)
    lines.push(`    id: ${exp.id},`)
    lines.push(`    company: '${exp.company.replace(/'/g, "\\'")}',`)
    lines.push(`    role: '${exp.role.replace(/'/g, "\\'")}',`)
    lines.push(`    period: '${exp.period.replace(/'/g, "\\'")}',`)
    lines.push(`    location: '${exp.location.replace(/'/g, "\\'")}',`)
    lines.push(`    highlights: [`)
    for (const h of exp.highlights) {
      lines.push(`      '${h.replace(/'/g, "\\'")}',`)
    }
    lines.push(`    ],`)
    lines.push(`    metrics: [`)
    for (const m of exp.metrics) {
      lines.push(`      { label: '${m.label.replace(/'/g, "\\'")}', value: '${m.value.replace(/'/g, "\\'")}' },`)
    }
    lines.push(`    ],`)
    lines.push(`  },`)
  }
  lines.push(`]`)
  lines.push(``)

  // Impact Metrics
  lines.push(`// ----------------------------------------------------------------------------`)
  lines.push(`// IMPACT METRICS (dashboard section)`)
  lines.push(`// ----------------------------------------------------------------------------`)
  lines.push(`export const metrics = [`)
  for (const metric of data.metrics) {
    lines.push(`  {`)
    lines.push(`    id: ${metric.id},`)
    lines.push(`    value: ${metric.value},`)
    lines.push(`    suffix: '${metric.suffix}',`)
    if (metric.prefix) {
      lines.push(`    prefix: '${metric.prefix}',`)
    }
    lines.push(`    label: '${metric.label.replace(/'/g, "\\'")}',`)
    lines.push(`    description: '${metric.description.replace(/'/g, "\\'")}',`)
    lines.push(`    category: '${metric.category.replace(/'/g, "\\'")}',`)
    lines.push(`  },`)
  }
  lines.push(`]`)
  lines.push(``)

  // Expertise
  lines.push(`// ----------------------------------------------------------------------------`)
  lines.push(`// EXPERTISE AREAS`)
  lines.push(`// ----------------------------------------------------------------------------`)
  lines.push(`export const expertise = {`)
  for (const [key, area] of Object.entries(data.expertise)) {
    lines.push(`  ${key}: {`)
    lines.push(`    title: '${area.title.replace(/'/g, "\\'")}',`)
    lines.push(`    icon: '${area.icon}',`)
    lines.push(`    skills: [`)
    for (const skill of area.skills) {
      lines.push(`      '${skill.replace(/'/g, "\\'")}',`)
    }
    lines.push(`    ],`)
    lines.push(`  },`)
  }
  lines.push(`}`)
  lines.push(``)

  // Education
  lines.push(`// ----------------------------------------------------------------------------`)
  lines.push(`// EDUCATION`)
  lines.push(`// ----------------------------------------------------------------------------`)
  lines.push(`export const education = [`)
  for (const edu of data.education) {
    lines.push(`  {`)
    lines.push(`    degree: '${edu.degree.replace(/'/g, "\\'")}',`)
    lines.push(`    major: '${edu.major.replace(/'/g, "\\'")}',`)
    lines.push(`    school: '${edu.school.replace(/'/g, "\\'")}',`)
    lines.push(`    location: '${edu.location.replace(/'/g, "\\'")}',`)
    lines.push(`    year: '${edu.year}',`)
    if (edu.gpa) {
      lines.push(`    gpa: '${edu.gpa}',`)
    }
    lines.push(`  },`)
  }
  lines.push(`]`)
  lines.push(``)

  // Add remaining static exports
  lines.push(`// ----------------------------------------------------------------------------`)
  lines.push(`// THOUGHT LEADERSHIP (Coming Soon placeholders)`)
  lines.push(`// ----------------------------------------------------------------------------`)
  lines.push(`export const thoughtLeadership = [`)
  lines.push(`  {`)
  lines.push(`    title: 'The Future of AI in Enterprise Security',`)
  lines.push(`    category: 'AI Strategy',`)
  lines.push(`    description: 'Exploring how generative AI is transforming threat detection and response',`)
  lines.push(`    status: 'coming-soon',`)
  lines.push(`  },`)
  lines.push(`  {`)
  lines.push(`    title: 'Building a Repeatable M&A Playbook',`)
  lines.push(`    category: 'M&A Integration',`)
  lines.push(`    description: 'Lessons learned from 6 successful technology integrations',`)
  lines.push(`    status: 'coming-soon',`)
  lines.push(`  },`)
  lines.push(`  {`)
  lines.push(`    title: 'Digital Transformation in Professional Services',`)
  lines.push(`    category: 'Digital Transformation',`)
  lines.push(`    description: 'Key insights from replacing 19 legacy systems with modern platforms',`)
  lines.push(`    status: 'coming-soon',`)
  lines.push(`  },`)
  lines.push(`]`)
  lines.push(``)

  lines.push(`// ----------------------------------------------------------------------------`)
  lines.push(`// PROJECTS (Coming Soon placeholders)`)
  lines.push(`// ----------------------------------------------------------------------------`)
  lines.push(`export const projects = [`)
  lines.push(`  {`)
  lines.push(`    title: 'AI Security Assistant',`)
  lines.push(`    description: 'An AI-powered tool for automated security analysis and recommendations',`)
  lines.push(`    tags: ['AI', 'Security', 'Automation'],`)
  lines.push(`    status: 'coming-soon',`)
  lines.push(`  },`)
  lines.push(`  {`)
  lines.push(`    title: 'M&A Tech Assessment Framework',`)
  lines.push(`    description: 'Repeatable framework for technology due diligence in acquisitions',`)
  lines.push(`    tags: ['M&A', 'Framework', 'Assessment'],`)
  lines.push(`    status: 'coming-soon',`)
  lines.push(`  },`)
  lines.push(`  {`)
  lines.push(`    title: 'Compliance Dashboard',`)
  lines.push(`    description: 'Real-time compliance monitoring across multiple frameworks',`)
  lines.push(`    tags: ['Compliance', 'Dashboard', 'Monitoring'],`)
  lines.push(`    status: 'coming-soon',`)
  lines.push(`  },`)
  lines.push(`]`)
  lines.push(``)

  lines.push(`// ----------------------------------------------------------------------------`)
  lines.push(`// NAVIGATION`)
  lines.push(`// ----------------------------------------------------------------------------`)
  lines.push(`export const navigationItems = [`)
  lines.push(`  { label: 'About', href: '#about' },`)
  lines.push(`  { label: 'Experience', href: '#experience' },`)
  lines.push(`  { label: 'Impact', href: '#impact' },`)
  lines.push(`  { label: 'Expertise', href: '#expertise' },`)
  lines.push(`  { label: 'Education', href: '#education' },`)
  lines.push(`  { label: 'Contact', href: '#contact' },`)
  lines.push(`]`)
  lines.push(``)

  lines.push(`// ----------------------------------------------------------------------------`)
  lines.push(`// TERMINAL COMMANDS (Easter egg)`)
  lines.push(`// ----------------------------------------------------------------------------`)
  lines.push(`export const terminalCommands = {`)
  lines.push(`  help: \`Available commands:`)
  lines.push(`  whoami    - Display profile summary`)
  lines.push(`  skills    - List technical skills`)
  lines.push(`  exp       - Show work experience`)
  lines.push(`  contact   - Get contact information`)
  lines.push(`  clear     - Clear terminal`)
  lines.push(`  exit      - Exit terminal mode\`,`)
  lines.push(`  whoami: \`Paul Falor`)
  lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  lines.push(`CIO & Security Executive | Digital Transformation Leader`)
  lines.push(`Location: Atlanta, GA`)
  lines.push(`Georgia CIO of the Year - InspireCIO`)
  lines.push(`20+ years leading global IT operations & security programs\`,`)
  lines.push(`  skills: \`Technical Expertise`)
  lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  lines.push(`Security:     ISO27001, HITRUST, PCI-DSS, SOC2`)
  lines.push(`Compliance:   HIPAA, GDPR, NIST 800-53`)
  lines.push(`Cloud:        Full-scale migration, 99.95% uptime`)
  lines.push(`AI/ML:        AI-assisted development, 90%+ efficiency gains`)
  lines.push(`Leadership:   Global teams across 5 countries\`,`)
  lines.push(`  exp: \`Career Timeline`)
  lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  lines.push(`2014-Present  CIO, North Highland`)
  lines.push(`2013-2014     Director TVM, Global Payments`)
  lines.push(`2012-2013     VP IT Audit, Truist`)
  lines.push(`2008-2012     Director InfoSec, TRX`)
  lines.push(`2005-2008     Sr Associate, KPMG\`,`)
  lines.push(`  contact: \`Contact Information`)
  lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  lines.push(`Email:    paulfalor@gmail.com`)
  lines.push(`Phone:    (404) 840-9450`)
  lines.push(`LinkedIn: linkedin.com/in/pfalor`)
  lines.push(`Location: Atlanta, GA\`,`)
  lines.push(`}`)
  lines.push(``)

  return lines.join('\n')
}

async function getFileSha(owner: string, repo: string, path: string, token: string): Promise<string | null> {
  const response = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
    },
  })

  if (!response.ok) {
    if (response.status === 404) return null
    throw new Error(`Failed to get file: ${response.statusText}`)
  }

  const data = await response.json()
  return data.sha
}

async function commitFile(
  owner: string,
  repo: string,
  path: string,
  content: string,
  sha: string | null,
  token: string
): Promise<void> {
  const body: Record<string, string> = {
    message: 'Update resume data via admin UI',
    content: Buffer.from(content).toString('base64'),
    branch: 'main',
  }

  if (sha) {
    body.sha = sha
  }

  const response = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to commit file')
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: ResumeData = await request.json()

    // Validate required fields
    if (!data.personalInfo || !data.experience || !data.education) {
      return NextResponse.json(
        { error: 'Missing required data sections' },
        { status: 400 }
      )
    }

    const token = process.env.GITHUB_TOKEN
    const owner = process.env.GITHUB_OWNER
    const repo = process.env.GITHUB_REPO

    if (!token || !owner || !repo) {
      return NextResponse.json(
        { error: 'GitHub configuration missing. Set GITHUB_TOKEN, GITHUB_OWNER, and GITHUB_REPO.' },
        { status: 500 }
      )
    }

    const filePath = 'lib/data.ts'
    const fileContent = generateDataFile(data)

    // Get current file SHA
    const sha = await getFileSha(owner, repo, filePath, token)

    // Commit the updated file
    await commitFile(owner, repo, filePath, fileContent, sha, token)

    return NextResponse.json({
      success: true,
      message: 'Changes committed to GitHub. Site will redeploy automatically.'
    })
  } catch (error) {
    console.error('Save error:', error)
    const message = error instanceof Error ? error.message : 'Failed to save data'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
