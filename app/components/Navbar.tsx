'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Menu, 
  X, 
  Heart, 
  Info, 
  Briefcase, 
  Megaphone, 
  FileText, 
  MessageSquare,
  LayoutDashboard
} from 'lucide-react'

// Import Logo Statis
import logo from '../../public/images/WhatsApp_Image_2026-01-24_at_03.13.32-removebg-preview.png'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '#tentang', label: 'Tentang Kami', icon: Info },
    { href: '#program', label: 'Program', icon: Briefcase },
    { href: '#kampanye', label: 'Campaign', icon: Megaphone },
    { href: '#artikel', label: 'Artikel', icon: FileText },
    { href: '#kontak', label: 'Hubungi Kami', icon: MessageSquare },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/90 backdrop-blur-md shadow-md border-b border-gray-200/50 py-2' 
        : 'bg-white/70 backdrop-blur-sm border-b border-gray-100 py-3'
    }`}>
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          
          {/* LOGO AREA */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center border border-green-100 transition-transform group-hover:scale-105">
              <Image 
                src={logo} 
                alt="Logo Baitul Ikhlas" 
                width={40} 
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <div className="font-serif font-bold text-base sm:text-lg leading-tight text-green-900 tracking-wide">
                Peduli Yatim
              </div>
              <div className="text-[11px] font-semibold text-green-600 tracking-wider uppercase">
                Yayasan Baitul Ikhlas
              </div>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className="group flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-green-600 transition-colors py-2"
                >
                  <IconComponent className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors" />
                  <span>{link.label}</span>
                </a>
              );
            })}
          </div>

          {/* BUTTON CTA DESKTOP */}
          <div className="hidden lg:flex items-center gap-3">
            <Link 
              href="../campaign" 
              className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all duration-300 shadow-sm hover:shadow shadow-green-600/20 transform hover:-translate-y-0.5"
            >
              <Heart className="w-4 h-4 fill-white" />
              Donasi Sekarang
            </Link>
            
            {/* <Link 
              href="/admin" 
              className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
            > */}
              {/* <LayoutDashboard className="w-4 h-4 text-gray-500" />
              Admin
            </Link> */}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 transition-all"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {isOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 mt-2 p-4 absolute left-4 right-4 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="flex flex-col gap-1.5">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="group flex items-center gap-3 text-gray-600 hover:text-green-600 font-medium py-3 px-3 rounded-xl hover:bg-green-50 transition-all"
                  >
                    <IconComponent className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                    <span>{link.label}</span>
                  </a>
                );
              })}
              
              {/* Pembatas internal mobile */}
              <div className="border-t border-gray-100 pt-3 mt-2 flex flex-col gap-2.5">
                <Link 
                  href="app/campaign" 
                  onClick={() => setIsOpen(false)} 
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-sm py-3 rounded-xl shadow-md"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  Donasi Sekarang
                </Link>
                
                <Link 
                  href="/admin" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 text-center text-sm font-semibold text-gray-600 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
                >
                  <LayoutDashboard className="w-4 h-4 text-gray-400" />
                  Admin Dashboard
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}