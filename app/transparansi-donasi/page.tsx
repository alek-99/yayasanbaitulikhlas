'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Search, Loader2, Camera, X, ArrowUpRight, Maximize2, HeartHandshake } from 'lucide-react'
import Topbar from '../components/Topbar'
// --- SKELETON LOADER COMPONENT ---
const PageGridSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="bg-white border border-stone-100 rounded-2xl overflow-hidden shadow-sm flex flex-col p-3 space-y-4">
        {/* Image Skeleton */}
        <div className="relative aspect-[4/3] bg-stone-100 rounded-xl animate-pulse" />
        {/* Content Skeleton */}
        <div className="p-1 space-y-3 flex-grow flex flex-col justify-between">
          <div className="space-y-2">
            <div className="h-4 bg-stone-100 rounded-md w-3/4 animate-pulse" />
            <div className="space-y-1.5">
              <div className="h-3 bg-stone-100 rounded-md w-full animate-pulse" />
              <div className="h-3 bg-stone-100 rounded-md w-5/6 animate-pulse" />
            </div>
          </div>
          {/* Footer Card Skeleton */}
          <div className="pt-4 border-t border-stone-50 flex items-center justify-between">
            <div className="h-3 bg-stone-100 rounded-md w-16 animate-pulse" />
            <div className="h-6 bg-stone-100 rounded-lg w-24 animate-pulse" />
          </div>
        </div>
      </div>
    ))}
  </div>
)

// --- MAIN COMPONENT ---
export default function TransparansiDonasiPage() {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  useEffect(() => {
    const fetchBudgetReports = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('budget_reports')
          .select('*')
          .order('created_at', { ascending: false })

        if (!error && data) setReports(data)
      } catch (err) {
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchBudgetReports()
  }, [])

  const filteredReports = reports.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalSpent = reports.reduce((acc, curr) => acc + Number(curr.amount_spent), 0)

  return (
    <div className="bg-stone-50 min-h-screen text-stone-700 py-12 px-4 sm:px-6 selection:bg-emerald-600 selection:text-white">
      <Topbar />
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header Title Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100/60 shadow-sm mx-auto">
            <HeartHandshake size={24} />
          </div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight">
            Transparansi & Amanah Penyaluran
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Laporan keterbukaan publik penyerahan dana kebajikan umat yang dilengkapi dengan bukti dokumentasi otentik dari lapangan.
          </p>
        </div>

        {/* Info Ringkasan Dana & Pencarian */}
        <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded-md">
              Total Dana Umat Disalurkan
            </span>
            <div className="text-2xl font-black text-emerald-600 mt-1.5">
              Rp {totalSpent.toLocaleString('id-ID')}
            </div>
          </div>
          <div className="relative w-full sm:max-w-xs">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-stone-400">
              <Search size={14} />
            </span>
            <input
              type="text"
              placeholder="Cari laporan penyaluran..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* Grid Card List Lengkap / Skeleton */}
        {loading ? (
          <PageGridSkeleton />
        ) : filteredReports.length === 0 ? (
          <div className="text-center py-16 bg-white border border-stone-200 rounded-2xl text-stone-400 text-xs shadow-sm">
            Tidak ditemukan bukti penyaluran yang cocok dengan kata kunci Anda.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((item) => (
              <div 
                key={item.id} 
                className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-100/60 transition-all duration-300 flex flex-col group"
              >
                {/* Bagian Image Pembungkus & Tombol Zoom */}
                <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden shrink-0 border-b border-stone-100">
                  {item.proof_url ? (
                    <img 
                      src={item.proof_url} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300">
                      <Camera size={24} />
                    </div>
                  )}
                  {/* Overlay Tombol Zoom saat foto dihover */}
                  {item.proof_url && (
                    <button
                      onClick={() => setPreviewImage(item.proof_url)}
                      className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center text-white gap-1.5 text-xs font-bold backdrop-blur-[2px]"
                    >
                      <Maximize2 size={14} /> Lihat Bukti Nyata
                    </button>
                  )}
                </div>

                {/* Bagian Konten Teks */}
                <div className="p-4 flex flex-col flex-grow justify-between space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-bold text-stone-900 leading-tight group-hover:text-emerald-600 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-stone-500 whitespace-pre-line leading-relaxed line-clamp-3 font-medium">
                      {item.description || 'Tidak ada catatan deskripsi detail.'}
                    </p>
                  </div>

                  {/* Keterangan Nominal Dana */}
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                      Dana Tasarruf
                    </span>
                    <span className="text-xs font-black text-emerald-600 bg-emerald-50/60 px-2.5 py-1 rounded-lg border border-emerald-100">
                      Rp {item.amount_spent.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* POPUP LIGHTBOX BUKTI DOKUMENTASI LENGKAP */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4 backdrop-blur-sm transition-opacity">
          <div className="bg-white border border-stone-200 rounded-2xl w-full max-w-md overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* PopUp Header */}
            <div className="flex items-center justify-between p-3.5 border-b border-stone-100 bg-stone-50">
              <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <Camera size={14} className="text-emerald-600" /> Dokumen Penyaluran Lapangan
              </span>
              <button 
                onClick={() => setPreviewImage(null)} 
                className="p-1 rounded-lg text-stone-400 hover:bg-stone-200 hover:text-stone-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            
            {/* PopUp Image Content */}
            <div className="p-4 bg-stone-100 flex items-center justify-center min-h-[300px] max-h-[60vh]">
              <img 
                src={previewImage} 
                alt="Amanah Penyaluran Aksi Sosial" 
                className="max-h-full max-w-full object-contain rounded-xl shadow-sm bg-white" 
              />
            </div>
            
            {/* PopUp Footer */}
            <div className="p-3 bg-stone-50 border-t border-stone-100 text-center">
              <a 
                href={previewImage} 
                target="_blank" 
                rel="noreferrer" 
                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                Buka Dokumen Resolusi Penuh <ArrowUpRight size={12}/>
              </a>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}