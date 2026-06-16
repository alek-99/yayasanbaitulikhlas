// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js' // atau '@supabase/ssr' tergantung package yang kamu pakai

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validasi sederhana agar aplikasi langsung memberi tahu jika env belum diisi
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase Environment Variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)