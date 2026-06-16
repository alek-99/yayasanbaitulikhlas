'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { X, Upload, Loader2 } from 'lucide-react'
import { Campaign } from '../dashboard/campaign/page'

interface CampaignModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  campaign?: Campaign
}

export default function CampaignModal({ isOpen, onClose, onSuccess, campaign }: CampaignModalProps) {
  const [submitting, setSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Form states
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [targetAmount, setTargetAmount] = useState(0)
  const [collectedAmount, setCollectedAmount] = useState(0)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [status, setStatus] = useState<'active' | 'completed' | 'inactive'>('active')

  useEffect(() => {
    if (campaign) {
      setTitle(campaign.title)
      setDescription(campaign.description)
      setTargetAmount(campaign.target_amount)
      setCollectedAmount(campaign.collected_amount)
      setStartDate(campaign.start_date)
      setEndDate(campaign.end_date)
      setStatus(campaign.status)
      setPreviewUrl(campaign.image_url)
    } else {
      setTitle('')
      setDescription('')
      setTargetAmount(0)
      setCollectedAmount(0)
      setStartDate('')
      setEndDate('')
      setStatus('active')
      setPreviewUrl(null)
    }
    setImageFile(null)
  }, [campaign, isOpen])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
    const filePath = `campaigns/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('campaign-image')
      .upload(filePath, file)

    if (uploadError) {
      alert('Gagal mengunggah gambar: ' + uploadError.message)
      return null
    }

    // Mendapatkan Public URL
    const { data } = supabase.storage.from('campaign-image').getPublicUrl(filePath)
    return data.publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    let finalImageUrl = campaign?.image_url || null

    // Upload jika ada file baru yang dipilih
    if (imageFile) {
      // Hapus gambar lama jika sedang proses edit data
      if (campaign?.image_url) {
        const oldFileRoute = campaign.image_url.split('/storage/v1/object/public/campaign-image/')[1]
        if (oldFileRoute) {
          await supabase.storage.from('campaign-image').remove([oldFileRoute])
        }
      }
      
      const uploadedUrl = await uploadImage(imageFile)
      if (uploadedUrl) finalImageUrl = uploadedUrl
    }

    const payload = {
      title,
      description,
      target_amount: Number(targetAmount),
      collected_amount: Number(collectedAmount),
      start_date: startDate,
      end_date: endDate,
      status,
      image_url: finalImageUrl,
      updated_at: new Date().toISOString(),
    }

    if (campaign?.id) {
      // Aksi Update
      const { error } = await supabase
        .from('campaigns')
        .update(payload)
        .eq('id', campaign.id)

      if (error) alert('Gagal memperbarui: ' + error.message)
      else onSuccess()
    } else {
      // Aksi Create
      const { error } = await supabase
        .from('campaigns')
        .insert([payload])

      if (error) alert('Gagal menambahkan: ' + error.message)
      else onSuccess()
    }

    setSubmitting(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">
            {campaign ? 'Edit Campaign' : 'Tambah Campaign Baru'}
          </h2>
          <button onClick={onClose} className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 flex-1">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Judul Campaign *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan judul campaign"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Deskripsi *</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tuliskan deskripsi lengkap di sini..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Target Dana (Rp) *</label>
              <input
                type="number"
                required
                min={0}
                value={targetAmount}
                onChange={(e) => setTargetAmount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Dana Terkumpul (Rp)</label>
              <input
                type="number"
                min={0}
                value={collectedAmount}
                onChange={(e) => setCollectedAmount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Tanggal Mulai *</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Tanggal Selesai *</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Status Campaign</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Upload Image Section */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Gambar Campaign</label>
            <div className="mt-1 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="w-28 h-28 rounded-lg border border-dashed border-gray-300 flex items-center justify-center bg-gray-50 flex-shrink-0 overflow-hidden">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Upload className="text-gray-400" size={24} />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  id="file-upload"
                  className="hidden"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center gap-2 border border-gray-300 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition shadow-sm"
                >
                  <Upload size={14} />
                  Pilih Berkas Gambar
                </label>
                <p className="text-xs text-gray-400 mt-2">Format yang didukung: JPG, PNG, WEBP. Maks 2MB.</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-sm disabled:opacity-50"
            >
              {submitting && <Loader2 className="animate-spin" size={16} />}
              {campaign ? 'Simpan Perubahan' : 'Buat Campaign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}