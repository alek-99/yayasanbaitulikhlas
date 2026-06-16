'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NavbarAdmin from '../components/NavbarAdmin'; 
import logo from '../../../public/images/WhatsApp_Image_2026-01-24_at_03.13.32-removebg-preview.png'
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  HeartHandshake, 
  ClipboardList, 
  Phone, 
  Mail,
  Menu,
  X
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Program', path: '/admin/dashboard/program', icon: Calendar },
    { name: 'Artikel', path: '/admin/dashboard/artikel', icon: FileText },
    { name: 'Campaign Donasi', path: '/admin/dashboard/campaign', icon: HeartHandshake },
    { name: 'Data Donasi', path: '/admin/dashboard/donasi', icon: ClipboardList },
    { name: 'Transparansi Donasi', path: '/admin/dashboard/transparansi-donasi', icon: ClipboardList },
    // { name: 'Testimoni', path: '/admin/dashboard/testimoni', icon: Phone },
    // { name: 'Pesan', path: '/admin/dashboard/pesan', icon: Mail },
  ];

  return (
    <div className="flex h-screen w-screen bg-gray-50/50 font-sans overflow-hidden antialiased text-gray-900 relative">
      
      {/* OVERLAY: Menutup sidebar jika area luar diklik (Hanya Mobile) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-950/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR: Slide-out di mobile, menetap di desktop */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-gray-950 text-white flex flex-col justify-between border-r border-gray-900 shadow-2xl lg:shadow-none z-50
        transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out lg:static shrink-0
      `}>
        <div>
          {/* Header Sidebar (Logo Baru & Nama) */}
          <div className="p-5 border-b border-gray-900/60 flex items-center justify-between px-6 h-16">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 bg-white rounded-lg flex items-center justify-center w-8 h-8 shrink-0">
                {/* 
                  Menggunakan path absolut dari public folder (/images/favicon.png)
                  agar selaras dengan ikon utama website yang Anda perbarui sebelumnya.
                */}
                <Image 
                  src={logo} 
                  alt="Logo Baitul Ikhlas" 
                  width={24} 
                  height={24} 
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-sm font-bold tracking-wider text-gray-100 leading-tight">
                  BAITUL IKHLAS
                </h1>
                <span className="text-[10px] font-medium text-blue-400/80 uppercase tracking-widest mt-0.5">
                  Admin Panel
                </span>
              </div>
            </div>

            {/* Tombol Close Sidebar (Hanya Mobile) */}
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 rounded-lg bg-gray-900 text-gray-400 hover:text-white lg:hidden transition-colors"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Menu Navigasi */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-130px)]">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = pathname === item.path;
              
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={() => setIsSidebarOpen(false)} // Otomatis tutup di mobile setelah klik
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium shadow-md shadow-blue-600/10' 
                      : 'text-gray-400 hover:bg-gray-900 hover:text-gray-100'
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-3 bottom-3 w-1 bg-white rounded-r-full" />
                  )}
                  <IconComponent 
                    className={`w-5 h-5 transition-transform duration-200 group-hover:scale-105 ${
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
                    }`} 
                  />
                  <span className="text-sm tracking-wide">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-gray-900/60 text-center">
          <p className="text-[11px] text-gray-500 font-medium">v1.2.0 © 2026</p>
        </div>
      </aside>

      {/* AREA UTAMA (Kanan) */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        
        {/* TOP BAR / HEADER */}
        <header className="bg-white border-b border-gray-200 flex items-center px-4 sm:px-6 h-16 z-30 w-full shrink-0 gap-2">
          {/* Tombol Hamburger (Hanya muncul di Mobile/Tablet) */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 lg:hidden transition-colors shrink-0"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Navbar Admin Utama */}
          <div className="flex-1">
            <NavbarAdmin />
          </div>
        </header>

        {/* AREA KONTEN UTAMA */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#fafafa] p-4 sm:p-6 lg:p-8">
          <div className="container mx-auto max-w-7xl animate-in fade-in-50 duration-300">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}