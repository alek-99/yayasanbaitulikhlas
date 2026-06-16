import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 1. Inisialisasi Supabase Client untuk Middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // 2. Ambil data user yang sedang login
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 3. LOGIK PROTEKSI RUTE
  const isLoginPage = request.nextUrl.pathname === '/admin/login'; // sesuaikan url login anda
  const isAdminArea = request.nextUrl.pathname.startsWith('/admin');

  // Jika mencoba mengakses halaman admin (selain login) tapi BELUM login, lempar ke halaman login
  if (isAdminArea && !isLoginPage && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login'; // Arahkan ke halaman login Anda
    return NextResponse.redirect(url);
  }

  // Jika SUDAH login dan mencoba mengakses halaman login lagi, lempar ke dashboard
  if (isLoginPage && user) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/dashboard';
    return NextResponse.redirect(url);
  }

  return response;
}

// 4. Tentukan rute mana saja yang akan memicu middleware ini
export const config = {
  matcher: ['/admin/:path*'],
};