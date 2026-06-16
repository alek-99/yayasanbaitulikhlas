// src/lib/supabaseServer.ts
import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export function createClientForMiddleware(request: NextRequest) {
  // 1. Buat response kosong sebagai penampung awal untuk mutasi cookie
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 2. Inisialisasi server client
  const supabaseServer = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Sinkronkan ke request agar middleware di baris selanjutnya tahu cookie sudah berubah
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          
          // Perbarui response agar browser menerima cookie baru
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 3. Return client beserta response ter-update agar bisa dipakai di middleware.ts
  return { supabaseServer, response }
}