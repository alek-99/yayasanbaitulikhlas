'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Plus, Edit2, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react'
import CampaignModal from '../../components/CampaignModal' // Kita akan buat komponen ini di bawah

export interface Campaign {
  id: string
  title: string
  description: string
  image_url: string | null
  target_amount: number
  collected_amount: number
  start_date: string
  end_date: string
  status: 'active' | 'completed' | 'inactive'
  program_id?: string | null
}

export default function CampaignPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | undefined>(undefined)

  // Fetch data campaigns
  const fetchCampaigns = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      alert('Gagal mengambil data: ' + error.message)
    } else {
      setCampaigns(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCampaigns()
  }, [])

  // Delete campaign
  const handleDelete = async (id: string, imageUrl: string | null) => {
    if (confirm('Apakah Anda yakin ingin menghapus campaign ini?')) {
      // 1. Hapus gambar dari Storage jika ada
      if (imageUrl) {
        const fileRoute = imageUrl.split('/storage/v1/object/public/campaign-image/')[1]
        if (fileRoute) {
          await supabase.storage.from('campaign-image').remove([fileRoute])
        }
      }

      // 2. Hapus data dari tabel
      const { error } = await supabase.from('campaigns').delete().eq('id', id)

      if (error) {
        alert('Gagal menghapus data: ' + error.message)
      } else {
        fetchCampaigns()
      }
    }
  }

  const openAddModal = () => {
    setSelectedCampaign(undefined)
    setIsModalOpen(true)
  }

  const openEditModal = (campaign: Campaign) => {
    setSelectedCampaign(campaign)
    setIsModalOpen(true)
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Campaign</h1>
          <p className="text-sm text-gray-500">Kelola data program donasi dan pendanaan</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition text-sm font-medium shadow-sm"
        >
          <Plus size={18} />
          Tambah Campaign
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-gray-500">
            <Loader2 className="animate-spin mb-2" size={32} />
            <p>Memuat data campaign...</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="p-12 text-center text-gray-500">Belum ada data campaign.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-xs uppercase font-semibold tracking-wider">
                  <th className="p-4">Info Campaign</th>
                  <th className="p-4">Target / Terkumpul</th>
                  <th className="p-4">Durasi</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {campaigns.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 flex gap-3 items-center">
                      <div className="w-14 h-14 rounded-lg bg-gray-100 border border-gray-200 flex-shrink-0 overflow-hidden flex items-center justify-center">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="text-gray-400" size={20} />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 line-clamp-1">{item.title}</div>
                        <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">{item.description}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900">Rp {item.target_amount.toLocaleString('id-ID')}</div>
                      <div className="text-xs text-green-600 font-medium">Rp {item.collected_amount.toLocaleString('id-ID')}</div>
                    </td>
                    <td className="p-4 text-xs text-gray-600">
                      <div>{item.start_date}</div>
                      <div className="text-gray-400 mt-0.5">s/d {item.end_date}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-block
                        ${item.status === 'active' ? 'bg-green-100 text-green-700' : ''}
                        ${item.status === 'completed' ? 'bg-blue-100 text-blue-700' : ''}
                        ${item.status === 'inactive' ? 'bg-gray-100 text-gray-700' : ''}
                      `}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 text-gray-500 hover:text-blue-600 rounded-md hover:bg-gray-100 transition"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.image_url)}
                          className="p-1.5 text-gray-500 hover:text-red-600 rounded-md hover:bg-gray-100 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form Tambah/Edit */}
      {isModalOpen && (
        <CampaignModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false)
            fetchCampaigns()
          }}
          campaign={selectedCampaign}
        />
      )}
    </div>
  )
}