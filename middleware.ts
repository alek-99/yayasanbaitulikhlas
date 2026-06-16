// src/middleware.ts atau ./middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // console.log("🔴 MIDDLEWARE BERJALAN DI URL:", request.nextUrl.pathname);
  const { pathname } = request.nextUrl
  
  // 1. Tentukan halaman yang mau dijaga
  const isAdminArea = pathname.startsWith('/admin')
  const isLoginPage = pathname === '/admin/login'

  // 2. Ambil token Supabase langsung dari cookies browser
  // Supabase biasanya menyimpan session dengan nama format: sb-[project-id]-auth-token
  // Kita cek apakah ada cookie yang mengandung kata 'auth-token'
  const allCookies = request.cookies.getAll()
  const hasSupabaseToken = allCookies.some(cookie => cookie.name.includes('auth-token'))

  // 3. JIKA mencoba masuk ke area admin (bukan halaman login) dan TIDAK punya token
  if (isAdminArea && !isLoginPage && !hasSupabaseToken) {
    // Tendang paksa ke halaman login
    const loginUrl = new URL('/admin/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // JIKA sudah punya token tapi mau akses halaman login lagi, lempar ke dashboard
  if (isLoginPage && hasSupabaseToken) {
    const dashboardUrl = new URL('/admin/dashboard', request.url)
    return NextResponse.redirect(dashboardUrl)
  }

  return NextResponse.next()
}

// Jalankan middleware HANYA untuk rute admin agar menghemat performa
export const config = {
  matcher: '/admin/:path*',
}