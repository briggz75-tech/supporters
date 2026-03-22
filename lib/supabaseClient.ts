import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

export type Supporter = {
  id: string
  name: string
  phone: string | null
  image_url: string | null
  status: string
  is_approved: boolean
  approval_status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
  rejected_at?: string | null
  coordinator_id: string | null
  coordinator_notes: string | null
  title: string | null
  district: string | null
  llg: string | null
  ward: string | null
}

// Validate at runtime when actually making requests
export function validateSupabaseConfig() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }
}
