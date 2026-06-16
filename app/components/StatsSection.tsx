'use client'

import { Users, Heart, Target, BookOpen, HandHelping, Award, Building2, ShieldCheck } from 'lucide-react'

const stats = [
  { icon: Users, value: '500+', label: 'Donatur Aktif', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { icon: Heart, value: 'Rp 2M+', label: 'Dana Tersalurkan', color: 'text-rose-600', bg: 'bg-rose-50' },
  { icon: Target, value: '48', label: 'Campaign Selesai', color: 'text-teal-600', bg: 'bg-teal-50' },
  { icon: BookOpen, value: '1.200+', label: 'Penerima Manfaat', color: 'text-violet-600', bg: 'bg-violet-50' },
  { icon: HandHelping, value: '100+', label: 'Relawan Aktif', color: 'text-amber-600', bg: 'bg-amber-50' },
  { icon: Award, value: '10+', label: 'Penghargaan', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  // { icon: Building2, value: '1', label: 'Mitra Lembaga', color: 'text-sky-600', bg: 'bg-sky-50' },
  { icon: ShieldCheck, value: '100%', label: 'Amanah & Aman', color: 'text-green-600', bg: 'bg-green-50' },
]

export default function StatsSection() {
  // Menggabungkan array agar animasi berjalan terus tanpa putus (seamless loop)
  const duplicatedStats = [...stats, ...stats];

  return (
    // REVISI: Mengubah bg-gradient menjadi hijau gelap yang elegan (emerald) agar teks putih/card putih kontras dengan cantik
    <section className="py-16 bg-emerald-800 mt-1 relative z-10 overflow-hidden">
      
      {/* Container utama dengan efek gradien fade di kiri dan kanan */}
      <div className="relative w-full flex overflow-x-hidden">
        
        {/* REVISI: Mengubah 'from-white' menjadi warna yang sesuai dengan background gradien sekitarnya agar tidak patah */}
        {/* <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-emerald-800 to-transparent z-20 pointer-events-none" /> */}
        {/* <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-green-900 to-transparent z-20 pointer-events-none" /> */}

        {/* Jalur Animasi (group ditaruh di sini) */}
        {/* REVISI: Menambahkan hover:[animation-play-state:paused] langsung di container pembungkus animasi */}
        <div className="flex gap-6 animate-marquee whitespace-nowrap py-4 group hover:[animation-play-state:paused]">
          {duplicatedStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div 
                key={`${stat.label}-${index}`} 
                className="inline-flex flex-col items-center justify-center w-[240px] flex-shrink-0 bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              >
                {/* Icon Container */}
                <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mb-3 transition-colors`}>
                  <IconComponent className={`w-6 h-6 ${stat.color}`} />
                </div>
                
                {/* Value / Angka */}
                <div className={`text-2xl lg:text-3xl font-extrabold tracking-tight ${stat.color}`}>
                  {stat.value}
                </div>
                
                {/* Label */}
                <div className="text-slate-600 text-sm mt-1 font-medium whitespace-normal">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Style CSS (Bisa dihapus jika Anda sudah mendaftarkannya di tailwind.config.js) */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite; /* REVISI: Diperlambat sedikit ke 40s agar lebih nyaman dibaca saat bergerak */
        }
      `}</style>
    </section>
  )
}