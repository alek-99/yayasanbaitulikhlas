// src/middleware.ts atau ./middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClientForMiddleware } from '@/lib/supabaseServer'

export async function middleware(request: NextRequest) {
  // Buat respon default
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Inisialisasi Supabase khusus middleware
  const supabase = createClientForMiddleware(request, response)

  // Ambil data user yang sedang login saat ini dari cookie
  const { data: { user } } = await supabase.auth.getUser()

  const isLoginPage = request.nextUrl.pathname === '/admin/login'
  const isAdminArea = request.nextUrl.pathname.startsWith('/admin')

  // KONDISI 1: Pengguna coba tembak URL /admin/... tapi BELUM login
  if (isAdminArea && !isLoginPage && !user) {
    const loginUrl = new URL('/admin/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // KONDISI 2: Pengguna SUDAH login tapi iseng buka halaman /admin/login lagi
  if (isLoginPage && user) {
    const dashboardUrl = new URL('/admin/dashboard', request.url)
    return NextResponse.redirect(dashboardUrl)
  }

  return response
}

// Tentukan rute apa saja yang dijaga oleh middleware ini
export const config = {
  matcher: ['/admin/:path*'], 
}