'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import { Turnstile } from '@marsidev/react-turnstile';
import logoImg from '../../../public/images/WhatsApp_Image_2026-01-24_at_03.13.32-removebg-preview.png';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!turnstileToken) {
      setError('Silakan selesaikan verifikasi keamanan.');
      return;
    }

    setIsLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setIsLoading(false);
    } else {
      router.push('/admin/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      {/* Card Wrapper - Tema Terang Bersih */}
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
        
        {/* Logo & Header Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-24 h-24 mb-4 drop-shadow-md">
            <Image 
              src={logoImg} 
              alt="Admin Logo" 
              placeholder="blur"
              className="object-contain"
              priority
            />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Welcome Back</h2>
          <p className="text-sm text-gray-500 mt-1">Sign in to manage your dashboard</p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl flex items-center justify-center text-center font-medium">
            {error}
          </div>
        )}
        
        {/* Form Section */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
              Email Address
            </label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full p-3 bg-gray-50 text-gray-900 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder-gray-400" 
              required 
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
              Password
            </label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 bg-gray-50 text-gray-900 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder-gray-400" 
              required 
            />
          </div>

          {/* Cloudflare Turnstile Widget - Diubah ke Tema Light */}
          <div className="pt-2 flex justify-center">
            <Turnstile 
              siteKey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY!} 
              onSuccess={(token) => setTurnstileToken(token)} 
              onExpire={() => setTurnstileToken(null)}
              onError={() => setTurnstileToken(null)}
              options={{ theme: 'light' }}
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full mt-2 bg-blue-600 p-3 rounded-xl font-semibold text-white hover:bg-blue-700 active:bg-blue-800 transition-all shadow-md shadow-blue-600/10 disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
      </div>
    </div>
  );
}