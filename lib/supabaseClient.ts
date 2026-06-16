// src/lib/supabaseClient.ts
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Buat variabel penampung di luar fungsi
let clientInstance: ReturnType<typeof createBrowserClient> | null = null

export const getSupabaseBrowser = () => {
  // Jika sudah ada instance, pakai yang lama. Jika belum, baru buat baru.
  if (!clientInstance) {
    clientInstance = createBrowserClient(supabaseUrl, supabaseAnonKey)
  }
  return clientInstance
}

// Tetap export variabel 'supabase' agar tidak banyak mengubah kode di halaman login
export const supabase = getSupabaseBrowser()

export const isSupabaseConfigured = () => {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}