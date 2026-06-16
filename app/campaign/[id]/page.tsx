'use client'

import { useEffect, useState, use } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Calendar, Target, Heart, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import DonationModal from '../../components/DonationModal'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function CampaignDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const [campaign, setCampaign] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false)

  useEffect(() => {
    const fetchDetail = async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .single()

      if (!error && data) {
        setCampaign(data)
        const pct = data.target_amount > 0 ? Math.min(Math.round((data.collected_amount / data.target_amount) * 100), 100) : 0
        setTimeout(() => setProgress(pct), 300)
      }
      setLoading(false)
    }
    fetchDetail()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 bg-slate-950">
        <Loader2 className="animate-spin mr-2" size={20} /> Memuat detail campaign...
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-slate-400 bg-slate-950 p-4">
        <p className="mb-4 font-medium">Campaign tidak ditemukan atau sudah tidak aktif.</p>
        <Link href="/campaign" className="text-sm text-indigo-400 font-semibold flex items-center gap-1">
          <ArrowLeft size={16} /> Kembali ke semua campaign
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 border-t border-slate-900">
      <div className="max-w-4xl mx-auto">
        <Link href="/campaign" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition mb-8 font-medium group">
          <ArrowLeft size={16} className="transform group-hover:-translate-x-0.5 transition-transform" /> Kembali ke Jelajah
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Main Content Card */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-slate-900/40 rounded-2xl border border-slate-800/80 overflow-hidden backdrop-blur-sm">
              <div className="h-64 sm:h-84 w-full bg-slate-950 relative border-b border-slate-800">
                {campaign.image_url ? (
                  <img src={campaign.image_url} alt={campaign.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600">Gambar Tidak Tersedia</div>
                )}
              </div>
              <div className="p-6 sm:p-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 tracking-tight">{campaign.title}</h1>
                <div className="border-t border-slate-800 pt-6">
                  <h3 className="font-semibold text-slate-200 mb-3">Deskripsi Lengkap</h3>
                  <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line">{campaign.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Sidebar Action Box */}
          <div className="md:col-span-1 md:sticky md:top-6">
            <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-6 backdrop-blur-sm">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Dana Terkumpul</span>
                <div className="text-2xl font-black text-indigo-400">Rp {campaign.collected_amount.toLocaleString('id-ID')}</div>
                <div className="text-xs text-slate-400 mt-1.5">
                  dari target <span className="text-slate-200 font-medium">Rp {campaign.target_amount.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden p-[1px] border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-right text-xs font-bold text-indigo-400">{progress}% Tercapai</div>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <Calendar size={16} className="text-slate-500" />
                <div>
                  <span className="block text-slate-500">Batas Pengumpulan</span>
                  <span className="font-medium text-slate-300">{campaign.end_date}</span>
                </div>
              </div>

              <button
                onClick={() => setIsDonationModalOpen(true)}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-indigo-600/10 transition flex items-center justify-center gap-2 text-sm"
              >
                <Heart size={18} className="fill-current" />
                Donasi Sekarang
              </button>

              <div className="flex items-start gap-2 text-[11px] text-slate-500 border-t border-slate-800/80 pt-4">
                <ShieldCheck size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                <p>Donasi Anda diproses secara aman, dilindungi enkripsi, dan diverifikasi transparan oleh pengelola.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Trigger Component */}
      <DonationModal 
        isOpen={isDonationModalOpen} 
        onClose={() => setIsDonationModalOpen(false)} 
        campaignId={campaign.id}
        campaignTitle={campaign.title}
      />
    </div>
  )
}