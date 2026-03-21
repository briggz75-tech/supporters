// API route: /api/ping
// Purpose: Keep Supabase project active by pinging daily via Vercel cron
// Compatible with Next.js App Router and Vercel serverless

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Ensure service role key is NOT exposed to client-side code
const supabase = createClient(supabaseUrl!, supabaseKey!)

export async function GET() {
  try {
    // Lightweight query: select 1 row from 'supporters' table
    const { error } = await supabase
      .from('supporters')
      .select('*')
      .limit(1)

    if (error) {
      return NextResponse.json({ status: 'error', message: 'Supabase ping failed' }, { status: 500 })
    }

    // Success response
    return NextResponse.json({ status: 'ok' })
  } catch (err) {
    return NextResponse.json({ status: 'error', message: 'Unexpected error' }, { status: 500 })
  }
}
