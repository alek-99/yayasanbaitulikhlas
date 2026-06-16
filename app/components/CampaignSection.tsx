'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { ArrowRight, Heart } from 'lucide-react'
import Link from 'next/link'
import CampaignCard from './CampaignCard'

function CampaignCardSkeleton() {
  return (
    <div className="bg-white rounded-[2rem] border border-amber-100/60 overflow-hidden animate-pulse">
      <div className="w-full h-52 bg-[#E8F0EB]" />
      <div className="p-6 space-y-4">
        <div className="h-5 bg-[#E8F0EB] rounded-xl w-3/4" />
        <div className="space-y-2">
          <div className="h-3.5 bg-[#E8F0EB] rounded-xl w-full" />
          <div className="h-3.5 bg-[#E8F0EB] rounded-xl w-5/6" />
        </div>
        <div className="h-2.5 bg-[#E8F0EB] rounded-full w-full mt-4" />
        <div className="grid grid-cols-2 gap-3 mt-2">
          <div className="h-16 bg-[#E8F0EB] rounded-2xl" />
          <div className="h-16 bg-amber-50 rounded-2xl" />
        </div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-4 bg-[#E8F0EB] rounded-xl w-1/3" />
          <div className="h-9 bg-[#E8F0EB] rounded-xl w-1/4" />
        </div>
      </div>
    </div>
  )
}

// Islamic star ornament
function StarOrnament() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="inline-block">
      <path d="M14 1L16.8 9.8L25.8 9.8L18.5 15.4L21.3 24.2L14 18.6L6.7 24.2L9.5 15.4L2.2 9.8L11.2 9.8Z" fill="#C9922A" opacity="0.85" />
    </svg>
  )
}

export default function CampaignSection() {
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLatest = async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(3)

      if (!error && data) setCampaigns(data)
      setLoading(false)
    }
    fetchLatest()
  }, [])

  if (loading) {
    return (
      <section  className="relative py-24 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="h-10 w-1/2 bg-[#E8F0EB] rounded-2xl animate-pulse mb-4 mx-auto" />
          <div className="h-4 w-1/3 bg-[#E8F0EB] rounded-xl animate-pulse mb-14 mx-auto" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => <CampaignCardSkeleton key={i} />)}
          </div>
        </div>
      </section>
    )
  }

  if (campaigns.length === 0) return null

  return (
    <section id="kampanye" className="relative py-24 lg:py-32 bg-white overflow-hidden">
      {/* Background Islamic pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.025] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="islamic-campaign" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <g fill="none" stroke="#0D4A3E" strokeWidth="0.7">
              <polygon points="40,2 78,22 78,58 40,78 2,58 2,22" />
              <polygon points="40,14 66,28 66,52 40,66 14,52 14,28" />
              <circle cx="40" cy="40" r="8" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#islamic-campaign)" />
      </svg>

      {/* Warm glow */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full bg-amber-50/60 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[350px] h-[350px] rounded-full bg-emerald-50/50 blur-[100px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-amber-400" />
            <span className="text-amber-600 font-bold text-xs uppercase tracking-[0.25em]">Program Kebaikan</span>
            <div className="h-px w-10 bg-amber-400" />
          </div>

          <h2 className="font-serif text-3xl lg:text-4xl xl:text-5xl font-bold text-[#0D4A3E] mb-4 leading-tight">
            Program Kebaikan <StarOrnament /> Pilihan
          </h2>

          <div className="flex items-center justify-center gap-3 my-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-300" />
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-300" />
          </div>

          <p className="text-[#6B8C7D] max-w-xl mx-auto text-base leading-relaxed mt-4">
            Salurkan bantuan Anda melalui program-program yang dirancang untuk membahagiakan anak-anak yatim dan keluarga yang membutuhkan.
          </p>
        </div>

        {/* Campaign Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {campaigns.map((item) => (
            <CampaignCard key={item.id} {...item} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-14 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/campaign"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#0D4A3E] to-[#2A6B57] text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-emerald-900/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-sm"
          >
            Lihat Semua Campaign
            <ArrowRight size={16} />
          </Link>

          <Link
            href="../campaign"
            className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 border border-amber-200 font-bold px-8 py-4 rounded-2xl hover:bg-amber-100 transition-all duration-300 text-sm"
          >
            <Heart size={15} className="fill-amber-500 text-amber-500" />
            Donasi Sekarang
          </Link>
        </div>

      </div>
    </section>
  )
}