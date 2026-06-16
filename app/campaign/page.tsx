'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import CampaignCard from '../components/CampaignCard'
import Topbar from '../components/Topbar'
import { motion } from 'framer-motion'
import DonationFAQ from '../components/DonationFAQ'
import FooterSection from '../components/FooterSection'

function CampaignSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-pulse">
      <div className="w-full h-48 bg-gray-200 rounded-xl mb-4" />
      <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-3" />
      <div className="h-4 bg-gray-200 rounded-md w-full mb-2" />
      <div className="h-4 bg-gray-200 rounded-md w-2/3 mb-6" />
      <div className="h-4 bg-gray-200 rounded-full w-full mb-2" />
      <div className="flex justify-between items-center mt-4">
        <div className="h-5 bg-gray-200 rounded-md w-1/4" />
        <div className="h-8 bg-gray-200 rounded-lg w-1/3" />
      </div>
    </div>
  )
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants: any = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
}

export default function AllCampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (!error && data) setCampaigns(data)
      setLoading(false)
    }
    fetchAll()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Memanggil Topbar yang sudah dipisah */}
      <Topbar />

      <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <span className="text-emerald-600 font-semibold text-sm tracking-wider uppercase bg-emerald-50 px-4 py-1.5 rounded-full">
            Program Aktif
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mt-4 tracking-tight">
            Semua Program Campaign
          </h1>
          <p className="border-l-4 border-slate-400 pl-4 text-left text-slate-600 mt-6 text-lg leading-relaxed sm:border-0 sm:pl-0 sm:text-center">
            Temukan berbagai program donasi kemanusiaan dan sosial yang dapat Anda bantu hari ini. 
            Setiap kontribusi kecil Anda membawa perubahan besar.
          </p>
        </motion.div>

        {/* List Halaman / Content Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <CampaignSkeleton key={i} />
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 bg-white rounded-3xl shadow-sm border border-slate-100 max-w-xl mx-auto px-6"
          >
            <div className="text-5xl mb-4">🍂</div>
            <h3 className="text-xl font-bold text-slate-800">Belum Ada Campaign</h3>
            <p className="text-slate-500 mt-2">Saat ini belum ada campaign aktif yang tersedia. Silakan cek kembali nanti.</p>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {campaigns.map((item) => (
              <motion.div 
                key={item.id} 
                variants={itemVariants}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="h-full"
              >
                <CampaignCard {...item} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
             <DonationFAQ />
          
    </div>
    
  )
}