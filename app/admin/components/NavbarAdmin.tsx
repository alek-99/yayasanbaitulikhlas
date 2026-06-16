'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { usePathname } from 'next/navigation';
// Menambahkan ikon Menu (Hamburger) dari Lucide
import { Bell, LogOut, Home, Globe, ChevronDown, User, Menu } from 'lucide-react';

interface NavbarAdminProps {
  onMenuClick?: () => void; // Menyediakan props opsional untuk trigger sidebar mobile
}

export default function NavbarAdmin({ onMenuClick }: NavbarAdminProps) {
  const [userEmail, setUserEmail] = useState<string | null>('Admin');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
      }
    };
    getUserData();
  }, []);

  const getPageTitle = () => {
    const segments = pathname.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1];
    
    if (!lastSegment || lastSegment === 'dashboard') return 'Overview';
    
    return lastSegment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleLogout = async () => {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
      await supabase.auth.signOut();
      window.location.href = '/admin/login';
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-md h-16 border-b border-gray-100 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30 w-full">
      
      {/* KIRI: Hamburger Menu (Mobile Only) & Breadcrumb */}
      <div className="flex items-center space-x-3 text-sm tracking-wide min-w-0">
        
        {/* Tombol Hamburger: Hanya muncul di layar di bawah lg (< 1024px) */}
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="p-2 -ml-1 rounded-xl text-gray-600 hover:bg-gray-100 lg:hidden transition-colors shrink-0"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 stroke-[2]" />
          </button>
        )}

        <div className="flex items-center space-x-2 text-sm tracking-wide truncate">
           <Home /> 
          <span className="text-gray-400 font-medium hidden sm:inline">Admin</span>
          <span className="text-gray-300 hidden sm:inline">/</span>
          <h1 className="text-gray-900 font-semibold text-sm md:text-base transition-all truncate">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* KANAN: Fitur Tambahan & Menu Profil */}
      <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
        {/* Garis Pembatas Vertikal */}
        <div className="h-5 w-[1px] bg-gray-200"></div>
        {/* Dropdown Profil User */}
        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 sm:space-x-3 p-1 rounded-xl hover:bg-gray-50 lg:p-1.5 transition-all focus:outline-none group"
          >
            {/* Avatar Bulat */}
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center text-white text-xs sm:text-sm font-semibold shadow-sm group-hover:shadow-md transition-all">
              {userEmail ? userEmail[0].toUpperCase() : <User className="w-4 h-4" />}
            </div>
            {/* Info Teks (Akan disembunyikan di layar mobile kecil agar tidak memakan ruang) */}
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-800 group-hover:text-gray-900 transition-colors flex items-center gap-1">
                Administrator
                <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </p>
              <p className="text-xs text-gray-400 font-normal truncate max-w-[140px]">
                {userEmail}
              </p>
            </div>
          </button>

          {/* Isi Menu Dropdown */}
          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)}></div>
              
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-20 overflow-hidden transform origin-top-right transition-all">
                <div className="px-4 py-2.5 bg-gray-50/50 border-b border-gray-100">
                  <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Masuk sebagai</p>
                  <p className="text-sm font-medium text-gray-700 truncate mt-0.5">{userEmail}</p>
                </div>
                
                <a 
                  href="/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2.5 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span>Lihat Website</span>
                </a>
                
                <div className="border-t border-gray-100 my-1"></div>
                
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50/70 font-medium transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar Sistem</span>
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </header>
  );
}