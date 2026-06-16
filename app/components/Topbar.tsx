"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import logo from "../../public/images/WhatsApp_Image_2026-01-24_at_03.13.32-removebg-preview.png";
export default function Topbar() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Sisi Kiri: Tombol Kembali & Logo/Brand */}
        <div className="flex items-center gap-4">
          {/* Tombol Kembali */}
          <button
            onClick={() => router.push("/")} // Mengarahkan langsung ke halaman utama
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            aria-label="Kembali ke Beranda"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
          </button>

          {/* Garis Pembatas Vertikal Kecil */}
          <div className="h-5 w-px bg-slate-200 hidden sm:block" />

          {/* Logo & Nama Brand */}
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => router.push("/")}
          >
            {/* Simbol Logo / Icon */}
            <Image
              src={logo}
              alt="Logo"
              className="w-9 h-9  rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm shadow-emerald-600/20"
            />
            {/* Nama Brand */}
            <span className="font-bold text-slate-950 text-lg tracking-tight">
              Yayasan<span className="text-emerald-600">Baitul Ikhlas</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
