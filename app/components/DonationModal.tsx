'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { X, Copy, CheckCircle2, Loader2, ShieldCheck, Landmark, Upload, Image as ImageIcon } from 'lucide-react'
import { Turnstile } from '@marsidev/react-turnstile'

interface DonationModalProps {
  isOpen: boolean
  onClose: () => void
  campaignId: string
  campaignTitle: string
}

export default function DonationModal({ isOpen, onClose, campaignId, campaignTitle }: DonationModalProps) {
  const [submitting, setSubmitting] = useState(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [step, setStep] = useState<1 | 2 | 3>(1) // Upgrade ke 3 Step
  const [createdDonationId, setCreatedDonationId] = useState<string | null>(null)

  // Form States (Step 1)
  const [donorName, setDonorName] = useState('')
  const [donorEmail, setDonorEmail] = useState('')
  const [donorPhone, setDonorPhone] = useState('')
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)

  // Upload States (Step 3)
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const ACCOUNTS_INFO = [
    { key: 'bca', name: 'Bank BCA', accountNumber: '8720123456', holder: 'Yayasan Kebaikan Indonesia' },
    { key: 'bri', name: 'Bank BRI', accountNumber: '034101000123302', holder: 'Yayasan Kebaikan Indonesia' },
    { key: 'dana', name: 'DANA (E-Wallet)', accountNumber: '081234567890', holder: 'YYS KEBAIKAN INDO' },
  ]

  const copyToClipboard = (accountNumber: string, key: string) => {
    navigator.clipboard.writeText(accountNumber)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  // Handle Step 1: Simpan data awal donasi
  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!turnstileToken) {
      alert('Silakan selesaikan verifikasi keamanan Turnstile terlebih dahulu.')
      return
    }

    setSubmitting(true)
    const { data, error } = await supabase
      .from('donations')
      .insert([
        {
          donor_name: donorName,
          donor_email: donorEmail,
          donor_phone: donorPhone || null,
          amount: Number(amount),
          payment_method: 'transfer',
          status: 'pending',
          campaign_id: campaignId,
          message: message || null,
        },
      ])
      .select('id')
      .single()

    setSubmitting(false)

    if (error) {
      alert('Gagal memproses data: ' + error.message)
    } else if (data) {
      setCreatedDonationId(data.id)
      setStep(2)
    }
  }

  // Handle input berkas gambar bukti transfer
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setProofFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  // Handle Step 3: Upload bukti transfer ke Storage & Update Tabel
  const handleUploadProof = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!proofFile || !createdDonationId) {
      alert('Silakan pilih file bukti pembayaran terlebih dahulu.')
      return
    }

    setSubmitting(true)

    const fileExt = proofFile.name.split('.').pop()
    const fileName = `${createdDonationId}-${Date.now()}.${fileExt}`
    const filePath = `proofs/${fileName}`

    // 1. Upload ke bucket donation-proof
    const { error: uploadError } = await supabase.storage
      .from('donation-proof')
      .upload(filePath, proofFile)

    if (uploadError) {
      alert('Gagal mengunggah gambar: ' + uploadError.message)
      setSubmitting(false)
      return
    }

    // 2. Ambil URL Publik gambar
    const { data: urlData } = supabase.storage.from('donation-proof').getPublicUrl(filePath)

    // 3. Update field proof_url di record donations terkait
    const { error: updateError } = await supabase
      .from('donations')
      .update({ proof_url: urlData.publicUrl })
      .eq('id', createdDonationId)

    setSubmitting(false)

    if (updateError) {
      alert('Gagal memperbarui data donasi: ' + updateError.message)
    } else {
      alert('Bukti transfer berhasil dikirim! Admin akan segera memverifikasi.')
      resetForm()
      onClose()
    }
  }

  const resetForm = () => {
    setStep(1)
    setDonorName('')
    setDonorEmail('')
    setDonorPhone('')
    setAmount('')
    setMessage('')
    setTurnstileToken(null)
    setProofFile(null)
    setPreviewUrl(null)
    setCreatedDonationId(null)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto animate-fadeIn backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto flex flex-col text-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-900">Formulir Donasi ({step}/3)</h3>
            <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{campaignTitle}</p>
          </div>
          <button onClick={() => { resetForm(); onClose(); }} className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        {step === 1 && (
          /* STEP 1: FORM INPUT DATA DIRI */
          <form onSubmit={handleInitialSubmit} className="p-6 space-y-4 flex-1">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Nama Lengkap *</label>
              <input
                type="text"
                required
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Hamba Allah"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="nama@email.com"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">No. WhatsApp</label>
                <input
                  type="tel"
                  value={donorPhone}
                  onChange={(e) => setDonorPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="08123456xxx"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Nominal Donasi (Rp) *</label>
              <input
                type="number"
                required
                min={1000}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl font-semibold text-lg text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Minimal Rp 1.000"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Pesan / Doa Baik</label>
              <textarea
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tulis doa atau dukungan untuk campaign ini..."
              />
            </div>

            <div className="flex justify-center py-2 bg-gray-50 rounded-xl border border-gray-100">
              <Turnstile
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'}
                onSuccess={(token) => setTurnstileToken(token)}
                onExpire={() => setTurnstileToken(null)}
                onError={() => setTurnstileToken(null)}
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !turnstileToken}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition shadow-sm flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {submitting && <Loader2 className="animate-spin" size={16} />}
              Lanjut ke Instruksi Rekening
            </button>
          </form>
        )}

        {step === 2 && (
          /* STEP 2: RINCIAN DAN SALIN REKENING */
          <div className="p-6 space-y-5 flex-1">
            <div className="bg-blue-50 text-blue-800 p-3.5 rounded-xl text-xs font-medium leading-relaxed">
              Komitmen donasi Anda telah tersimpan dengan status <strong>Pending</strong>. Selesaikan transfer lalu tekan tombol lanjut di bawah untuk mengunggah berkas konfirmasi.
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex justify-between items-center text-left">
              <span className="text-xs text-gray-400 font-medium">Nominal yang harus ditransfer:</span>
              <span className="text-xl font-black text-blue-600">Rp {Number(amount).toLocaleString('id-ID')}</span>
            </div>

            <div className="space-y-2 text-left">
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block px-1">Pilihan Rekening Tujuan:</span>
              <div className="space-y-2 max-h-[25vh] overflow-y-auto pr-1">
                {ACCOUNTS_INFO.map((acc) => (
                  <div key={acc.key} className="p-3 bg-white rounded-xl border border-gray-200 flex justify-between items-center shadow-sm">
                    <div>
                      <span className="inline-block px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-slate-100 text-slate-700 border border-slate-200 mb-0.5">{acc.name}</span>
                      <span className="block font-mono text-base text-gray-800 font-bold tracking-wider">{acc.accountNumber}</span>
                      <span className="block text-[11px] text-gray-400">a.n. {acc.holder}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(acc.accountNumber, acc.key)}
                      className={`p-1.5 px-3 rounded-lg border transition text-xs font-medium min-w-[70px]
                        ${copiedKey === acc.key ? 'bg-green-50 text-green-600 border-green-200' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200'}
                      `}
                    >
                      {copiedKey === acc.key ? 'Tersalin' : 'Salin'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(3)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition text-sm shadow-md"
            >
              Saya Sudah Transfer (Upload Bukti)
            </button>
          </div>
        )}

        {step === 3 && (
          /* STEP 3: UPLOAD BUKTI PEMBAYARAN */
          <form onSubmit={handleUploadProof} className="p-6 space-y-5 flex-1">
            <div className="text-center space-y-1">
              <h4 className="text-sm font-bold text-gray-800">Unggah Bukti Transfer Anda</h4>
              <p className="text-xs text-gray-400">Gunakan format gambar (JPG, PNG, atau WEBP) dengan ukuran maksimal 2MB.</p>
            </div>

            {/* Input Gambar Area */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-full h-44 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50 overflow-hidden relative group">
                {previewUrl ? (
                  <img src={previewUrl} alt="Pratinjau Bukti" className="w-full h-full object-contain" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400 space-y-2">
                    <ImageIcon size={32} className="stroke-1" />
                    <span className="text-xs font-medium">Belum ada gambar terpilih</span>
                  </div>
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                required
                onChange={handleFileChange}
                id="proof-upload"
                className="hidden"
              />
              <label
                htmlFor="proof-upload"
                className="mt-3 inline-flex items-center gap-1.5 border border-gray-300 px-4 py-2 rounded-xl text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition shadow-sm"
              >
                <Upload size={14} />
                Pilih Foto Kuitansi / Bukti
              </label>
            </div>

            <div className="flex items-start gap-2 text-[11px] text-gray-400 bg-blue-50/50 p-3 rounded-xl border border-blue-100/40">
              <ShieldCheck size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
              <p>Mengirim bukti pembayaran palsu atau salah sasaran dapat memicu pembatalan sistem donasi otomatis.</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => { resetForm(); onClose(); }}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-xl transition text-sm"
              >
                Kirim Nanti
              </button>
              <button
                type="submit"
                disabled={submitting || !proofFile}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-xl transition text-sm shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {submitting && <Loader2 className="animate-spin" size={14} />}
                Konfirmasi Selesai
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}