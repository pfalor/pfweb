import { NextRequest, NextResponse } from 'next/server'

type AIAction = 'rewrite' | 'generate' | 'suggest'
type AIProvider = 'openai' | 'anthropic'

interface AIRequest {
  action: AIAction
  content: string
  provider: AIProvider
  context?: string
}

const SYSTEM_PROMPTS: Record<AIAction, string> = {
  rewrite: `You are an expert resume writer. Rewrite the given text to be more impactful, professional, and achievement-focused.
Use strong action verbs and quantify results where possible. Keep the same general meaning but make it more compelling.
Return only the improved text without any explanation or quotes.`,

  generate: `You are an expert resume writer helping create content for a technology executive's resume.
Generate professional, impactful content based on the prompt provided. Focus on achievements, metrics, and leadership impact.
Return only the generated content without any explanation or quotes.`,

  suggest: `You are an expert resume consultant. Analyze the given resume content and provide specific, actionable suggestions for improvement.
Focus on:
- Stronger action verbs
- Adding metrics and quantifiable results
- Improving clarity and impact
- Professional tone and formatting

Provide 3-5 specific suggestions in a numbered list format.`,
}

async function callOpenAI(systemPrompt: string, userContent: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured')
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'OpenAI API error')
  }

  const data = await response.json()
  return data.choices[0]?.message?.content || ''
}

async function callAnthropic(systemPrompt: string, userContent: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY not configured')
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userContent },
      ],
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Anthropic API error')
  }

  const data = await response.json()
  return data.content[0]?.text || ''
}

export async function POST(request: NextRequest) {
  try {
    const body: AIRequest = await request.json()
    const { action, content, provider, context } = body

    if (!action || !content || !provider) {
      return NextResponse.json(
        { error: 'Missing required fields: action, content, provider' },
        { status: 400 }
      )
    }

    if (!['rewrite', 'generate', 'suggest'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be: rewrite, generate, or suggest' },
        { status: 400 }
      )
    }

    if (!['openai', 'anthropic'].includes(provider)) {
      return NextResponse.json(
        { error: 'Invalid provider. Must be: openai or anthropic' },
        { status: 400 }
      )
    }

    const systemPrompt = SYSTEM_PROMPTS[action]
    const userContent = context ? `Context: ${context}\n\nContent: ${content}` : content

    let result: string
    if (provider === 'openai') {
      result = await callOpenAI(systemPrompt, userContent)
    } else {
      result = await callAnthropic(systemPrompt, userContent)
    }

    return NextResponse.json({ result })
  } catch (error) {
    console.error('AI API error:', error)
    const message = error instanceof Error ? error.message : 'AI processing failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
