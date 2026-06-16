'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { ArrowRight, Camera, HeartHandshake } from 'lucide-react'
import Link from 'next/link'

// --- SKELETON COMPONENT (Clean & Light Matcher) ---
const TransparansiSkeleton = () => (
  <div className="max-w-5xl mx-auto space-y-6 px-4">
    {/* Header Skeleton */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-4 border-stone-100">
      <div className="space-y-2">
        <div className="h-5 bg-stone-100 rounded-md w-48 animate-pulse" />
        <div className="h-3.5 bg-stone-100 rounded-md w-64 animate-pulse" />
      </div>
      <div className="h-8 bg-stone-100 rounded-xl w-36 animate-pulse shrink-0" />
    </div>

    {/* Cards Grid Skeleton */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white border border-stone-100 rounded-2xl overflow-hidden shadow-sm flex flex-col p-3 space-y-4">
          <div className="relative aspect-[16/10] sm:aspect-[4/3] bg-stone-100 rounded-xl animate-pulse" />
          <div className="p-1 space-y-3 flex-grow">
            <div className="h-4 bg-stone-100 rounded-md w-3/4 animate-pulse" />
            <div className="space-y-1.5">
              <div className="h-3 bg-stone-100 rounded-md w-full animate-pulse" />
              <div className="h-3 bg-stone-100 rounded-md w-5/6 animate-pulse" />
            </div>
            <div className="pt-4 border-t border-stone-50 flex items-center justify-between">
              <div className="h-3 bg-stone-100 rounded-md w-20 animate-pulse" />
              <div className="h-6 bg-stone-100 rounded-lg w-24 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

// --- MAIN COMPONENT ---
export default function TransparansiPreview() {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPreviewData = async () => {
      try {
        const { data, error } = await supabase
          .from('budget_reports')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3)

        if (!error && data) setReports(data)
      } catch (err) {
        console.error('Error fetching transparency data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPreviewData()
  }, [])

  if (loading) return <TransparansiSkeleton />
  if (reports.length === 0) return null

  return (
    <div className="max-w-5xl mx-auto space-y-6 px-4 selection:bg-emerald-600 selection:text-white">
      
      {/* Header Preview Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-4 border-stone-200/60">
        <div>
          <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
            <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <HeartHandshake size={16} />
            </span>
            Amanah Penyaluran Terbaru
          </h3>
          <p className="text-xs text-stone-500 mt-1 font-medium">
            Dokumentasi realisasi dan pertanggungjawaban dana umat secara terbuka dan amanah.
          </p>
        </div>
        
        <Link 
          href="/transparansi-donasi" 
          className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition self-stretch sm:self-center bg-emerald-50/80 hover:bg-emerald-100/80 px-3.5 py-2 rounded-xl border border-emerald-100 active:scale-95 sm:active:scale-100 group"
        >
          Lihat Semua Laporan <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Grid Layout Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {reports.map((item) => (
          <div 
            key={item.id} 
            className="bg-white border border-stone-200/70 rounded-2xl p-3 shadow-sm hover:shadow-md hover:border-emerald-100/80 transition-all duration-300 flex flex-col group active:scale-[0.99] sm:active:scale-100 cursor-pointer"
          >
            {/* Foto Dokumentasi Penyaluran */}
            <div className="relative aspect-[16/10] sm:aspect-[4/3] bg-stone-50 overflow-hidden shrink-0 rounded-xl">
              {item.proof_url ? (
                <img 
                  src={item.proof_url} 
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-300">
                  <Camera size={24} />
                </div>
              )}
            </div>

            {/* Konten Detail Card */}
            <div className="p-2 pt-4 flex flex-col flex-grow justify-between space-y-4">
              <div className="space-y-1.5">
                <h4 className="text-sm font-bold text-stone-900 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed font-medium">
                  {item.description || 'Tidak ada deskripsi tambahan untuk penyaluran ini.'}
                </p>
              </div>

              {/* Status & Dana Disalurkan */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded">
                  Dana Umat
                </span>
                <span className="text-xs font-black text-emerald-600 bg-emerald-50/60 px-2.5 py-1 rounded-lg border border-emerald-100">
                  Rp {item.amount_spent.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}