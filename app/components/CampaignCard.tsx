'use client'

import { useEffect, useState, useRef } from 'react'
import { Calendar, Target, TrendingUp, Heart, Share2, Check, Link2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface CampaignCardProps {
  id: string
  title: string
  description: string
  image_url: string | null
  target_amount: number
  collected_amount: number
  end_date: string
}

export default function CampaignCard({
  id,
  title,
  description,
  image_url,
  target_amount,
  collected_amount,
  end_date,
}: CampaignCardProps) {
  const [progress, setProgress] = useState(0)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copied, setCopied] = useState(false)
  const shareMenuRef = useRef<HTMLDivElement>(null)

  const percentage = target_amount > 0 ? Math.min(Math.round((collected_amount / target_amount) * 100), 100) : 0

  const formatDate = (dateString: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }
      return new Date(dateString).toLocaleDateString('id-ID', options)
    } catch {
      return dateString
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => setProgress(percentage), 300)
    return () => clearTimeout(timer)
  }, [percentage])

  // Menutup menu share jika pengguna mengklik di luar area menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Membuat URL absolut ke halaman detail campaign
  const getCampaignUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/campaign/${id}`
    }
    return `/campaign/${id}`
  }

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    navigator.clipboard.writeText(getCampaignUrl())
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
      setShowShareMenu(false)
    }, 1800)
  }

  const currentUrl = encodeURIComponent(getCampaignUrl())
  const shareText = encodeURIComponent(`Mari ikut berkontribusi dalam program kebaikan: "${title}". Salurkan donasi Anda melalui tautan resmi ini:\n\n`)

  const progressColor =
    percentage >= 80
      ? 'from-amber-500 to-yellow-400'
      : percentage >= 50
      ? 'from-[#0D4A3E] to-[#2A6B57]'
      : 'from-[#2A6B57] to-teal-500'

  return (
    <div className="group relative bg-white rounded-[2rem] border border-amber-100/60 shadow-sm hover:shadow-2xl hover:shadow-emerald-900/12 transition-all duration-500 flex flex-col h-full overflow-hidden">
      
      {/* Gold top shimmer on hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Image */}
      <div className="relative h-52 w-full overflow-hidden bg-[#E8F0EB] shrink-0">
        {image_url ? (
          <Image
            src={image_url}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-[#A0C4B0] bg-[#E8F0EB] gap-2">
            <Heart className="w-10 h-10 opacity-25" />
            <span className="text-xs font-medium opacity-50">Gambar tidak tersedia</span>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D4A3E]/50 via-transparent to-transparent" />
        
        {/* Progress badge on image */}
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-lg border border-amber-100">
          <span className="text-xs font-black text-[#0D4A3E]">{percentage}%</span>
          <span className="text-[10px] text-[#6B8C7D] ml-1">terkumpul</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        {/* Title */}
        <h3 className="font-serif font-bold text-[#0D4A3E] text-lg line-clamp-2 mb-3 group-hover:text-[#2A6B57] transition-colors duration-300 leading-snug">
          <Link href={`/campaign/${id}`}>{title}</Link>
        </h3>

        {/* Description */}
        <p className="text-[#6B8C7D] text-sm line-clamp-2 mb-5 flex-1 leading-relaxed">
          {description}
        </p>

        {/* Progress bar */}
        <div className="mb-5 space-y-2">
          <div className="w-full bg-[#E8F0EB] h-2.5 rounded-full overflow-hidden">
            <div
              className={`bg-gradient-to-r ${progressColor} h-full rounded-full transition-all duration-1000 ease-out relative`}
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]" style={{ backgroundSize: '200% 100%' }} />
            </div>
          </div>
        </div>

        {/* Amounts */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-[#F0F7F3] rounded-2xl p-3.5 border border-emerald-100">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp size={11} className="text-[#2A6B57]" />
              <span className="text-[10px] font-bold text-[#6B8C7D] uppercase tracking-wider">Terkumpul</span>
            </div>
            <span className="font-black text-[#0D4A3E] text-sm leading-tight block">
              Rp {collected_amount.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="bg-amber-50 rounded-2xl p-3.5 border border-amber-100">
            <div className="flex items-center gap-1.5 mb-1">
              <Target size={11} className="text-amber-600" />
              <span className="text-[10px] font-bold text-[#6B8C7D] uppercase tracking-wider">Target</span>
            </div>
            <span className="font-bold text-[#0D4A3E] text-sm leading-tight block">
              Rp {target_amount.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-amber-100/60 pt-4 mt-auto relative">
          <div className="flex items-center gap-1.5 text-xs text-[#6B8C7D]">
            <Calendar size={13} className="text-amber-500" />
            <span>Selesai: <strong className="text-[#0D4A3E] font-semibold">{formatDate(end_date)}</strong></span>
          </div>

          <div className="flex items-center gap-2" ref={shareMenuRef}>
            {/* Tombol Share Popover */}
            <button
              onClick={(e) => {
                e.preventDefault()
                setShowShareMenu(!showShareMenu)
              }}
              className="flex items-center justify-center w-9 h-9 text-[#0D4A3E] bg-[#F0F7F3] border border-emerald-100 rounded-xl hover:bg-emerald-50 transition-colors"
              title="Bagikan campaign"
            >
              <Share2 size={14} />
            </button>

            {/* Dropdown Menu Share Melayang */}
            {showShareMenu && (
              <div className="absolute bottom-14 right-0 bg-white border border-amber-100 rounded-2xl shadow-xl p-2 z-30 min-w-[140px] flex flex-col gap-1 animate-in fade-in slide-in-from-bottom-2 duration-200">
                {/* WA */}
                <a
                  href={`https://api.whatsapp.com/send?text=${shareText}${currentUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowShareMenu(false)}
                  className="w-full text-left text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-[#25D366] px-3 py-2 rounded-xl transition-colors"
                >
                  WhatsApp
                </a>
                {/* IG */}
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowShareMenu(false)}
                  className="w-full text-left text-xs font-semibold text-slate-700 hover:bg-rose-50 hover:text-pink-600 px-3 py-2 rounded-xl transition-colors"
                >
                  Instagram
                </a>
                {/* TikTok */}
                <a
                  href="https://www.tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowShareMenu(false)}
                  className="w-full text-left text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-black px-3 py-2 rounded-xl transition-colors"
                >
                  TikTok
                </a>
                <hr className="border-amber-100/60 my-0.5" />
                {/* Copy Link */}
                <button
                  onClick={handleCopyLink}
                  className={`w-full text-left text-xs font-bold px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                    copied 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : 'text-[#0D4A3E] hover:bg-amber-50'
                  }`}
                >
                  {copied ? <Check size={12} /> : <Link2 size={12} />}
                  <span>{copied ? 'Disalin!' : 'Salin Tautan'}</span>
                </button>
              </div>
            )}

            {/* Tombol Donasi Utama */}
            <Link
              href={`/campaign/${id}`}
              className="flex items-center gap-2 text-xs font-bold bg-gradient-to-r from-[#0D4A3E] to-[#2A6B57] text-white px-4 py-2.5 rounded-xl shadow-md shadow-emerald-900/20 hover:shadow-lg hover:shadow-emerald-900/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              <Heart size={12} className="fill-current" />
              Donasi
            </Link>
          </div>
          
        </div>
      </div>
    </div>
  )
}