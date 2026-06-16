// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClientForMiddleware } from '@/lib/supabaseServer'

export async function middleware(request: NextRequest) {
  // Ambil client dan response pembawa cookie dari helper kita
  const { supabaseServer, response } = createClientForMiddleware(request)

  // Periksa user yang sedang aktif langsung ke API Supabase (Sangat Aman)
  const { data: { user } } = await supabaseServer.auth.getUser()

  const { pathname } = request.nextUrl
  const isAdminArea = pathname.startsWith('/admin')
  const isLoginPage = pathname === '/admin/login'

  // Jika belum login dan coba masuk area admin -> Lempar ke login
  if (isAdminArea && !isLoginPage && !user) {
    const loginUrl = new URL('/admin/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Jika sudah login tapi iseng buka halaman login lagi -> Lempar ke dashboard
  if (isLoginPage && user) {
    const dashboardUrl = new URL('/admin/dashboard', request.url)
    return NextResponse.redirect(dashboardUrl)
  }

  return response
}

export const config = {
  matcher: '/admin/:path*',
}