import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Hubungkan ke URL tiruan jika env kosong agar Supabase tidak crash saat build time
const fallbackUrl = supabaseUrl || 'https://placeholder-url-for-build.supabase.co'
const fallbackKey = supabaseAnonKey || 'dummy-key-for-build'

export const supabase = createClient(fallbackUrl, fallbackKey)

// Fungsi helper Anda tetap bekerja dengan akurat mendeteksi env asli
export const isSupabaseConfigured = () => {
  return !!supabaseUrl && !!supabaseAnonKey
}