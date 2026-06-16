import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Jika env tidak ada (misal saat build time), berikan string kosong sebagai fallback agar createClient tidak crash
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

// Buat fungsi helper pembantu untuk mengecek apakah env benar-benar siap digunakan
export const isSupabaseConfigured = () => {
  return !!supabaseUrl && !!supabaseAnonKey
}