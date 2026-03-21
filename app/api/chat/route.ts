import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { supabase, Supporter } from '@/lib/supabaseClient'

async function getSupporterContext(): Promise<Supporter[]> {
  try {
    const { data, error } = await supabase
      .from('supporters')
      .select('*')
      .limit(100)
    
    if (error) {
      return []
    }
    
    return data as Supporter[]
  } catch (err) {
    return []
  }
}

function formatSupportersForContext(supporters: Supporter[]): string {
  if (supporters.length === 0) {
    return 'No supporter data available.'
  }

  const summary = {
    total: supporters.length,
    byStatus: {} as Record<string, number>,
    byDistrict: {} as Record<string, number>,
  }

  supporters.forEach((supporter) => {
    const status = supporter.status || 'Unknown'
    const district = supporter.district || 'Unknown'

    summary.byStatus[status] = (summary.byStatus[status] || 0) + 1
    summary.byDistrict[district] = (summary.byDistrict[district] || 0) + 1
  })

  let context = `Current Supporter Database Summary:\n`
  context += `- Total Supporters: ${summary.total}\n`
  context += `\nBy Status:\n`
  Object.entries(summary.byStatus).forEach(([status, count]) => {
    context += `  - ${status}: ${count}\n`
  })
  context += `\nBy District:\n`
  Object.entries(summary.byDistrict).forEach(([district, count]) => {
    context += `  - ${district}: ${count}\n`
  })

  return context
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array required' },
        { status: 400 }
      )
    }

    // Initialize OpenAI client only when route is called
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // Get current supporter data for context
    const supporters = await getSupporterContext()
    const supporterContext = formatSupportersForContext(supporters)

    // Create system message with context
    const systemMessage = `You are a helpful dashboard assistant for a Supporter Management System. You help users understand and manage supporter data.

${supporterContext}

Guidelines:
- Be concise and helpful
- Focus on supporter data and insights
- If asked about specific supporters, acknowledge that you can see aggregate data but not details for privacy reasons
- Help users understand patterns in the data
- Suggest useful actions they can take in the dashboard`

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemMessage },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const assistantMessage =
      response.choices[0]?.message?.content || 'No response generated'

    return NextResponse.json({ message: assistantMessage })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    )
  }
}

