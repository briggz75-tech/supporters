import { supabase, validateSupabaseConfig } from '@/lib/supabaseClient'
import { NextRequest, NextResponse } from 'next/server'

interface SurveyPayload {
  name: string
  email?: string
  phone?: string
  foundation_rating?: number
  feedback_text: string
  how_to_help?: string
}

export async function POST(request: NextRequest) {
  try {
    validateSupabaseConfig()
    
    const body: SurveyPayload = await request.json()

    // Validate required fields
    if (!body.name || !body.feedback_text) {
      return NextResponse.json(
        { error: 'Name and feedback are required' },
        { status: 400 }
      )
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('whatsapp_survey_responses')
      .insert({
        name: body.name,
        email: body.email || null,
        phone: body.phone || null,
        foundation_rating: body.foundation_rating || null,
        feedback_text: body.feedback_text,
        how_to_help: body.how_to_help || null,
      })
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to save survey response' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Survey response saved successfully',
        data 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Optional: GET endpoint to retrieve survey responses (for admin)
export async function GET(_request: NextRequest) {
  try {
    validateSupabaseConfig()

    // Get all survey responses, ordered by most recent first
    const { data, error, count } = await supabase
      .from('whatsapp_survey_responses')
      .select('*', { count: 'exact' })
      .order('submitted_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to retrieve survey responses' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      count,
      data,
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
