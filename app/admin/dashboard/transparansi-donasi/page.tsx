'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Trash2, Plus, Loader2, Camera, UploadCloud, AlertCircle } from 'lucide-react'

export default function AdminTransparansiPage() {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // State Form Input
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [amountSpent, setAmountSpent] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const fetchReports = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('budget_reports')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) setReports(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchReports()
  }, [])

  // Validasi File Foto (Maksimal 1 MB)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormError(null)
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const maxInBytes = 1 * 1024 * 1024

      if (file.size > maxInBytes) {
        setFormError('Ukuran file terlalu besar! Batas maksimal foto dokumentasi adalah 1 MB.')
        setSelectedFile(null)
        e.target.value = ''
        return
      }
      setSelectedFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !amountSpent || !selectedFile) {
      setFormError('Harap isi semua kolom data dan unggah foto bukti penyaluran.')
      return
    }

    setSubmitting(true)
    setFormError(null)

    try {
      const fileExt = selectedFile.name.split('.').pop()
      const fileName = `distribution-${Date.now()}.${fileExt}`
      const filePath = `budgets/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('donation-proof')
        .upload(filePath, selectedFile)

      if (uploadError) throw new Error('Gagal upload gambar: ' + uploadError.message)

      const { data: urlData } = supabase.storage.from('donation-proof').getPublicUrl(filePath)

      // Menyimpan ke kolom proof_url (Backend tidak berubah)
      const { error: insertError } = await supabase
        .from('budget_reports')
        .insert([{
          title,
          description,
          amount_spent: parseFloat(amountSpent),
          proof_url: urlData.publicUrl 
        }])

      if (insertError) throw new Error(insertError.message)

      setTitle('')
      setDescription('')
      setAmountSpent('')
      setSelectedFile(null)
      fetchReports()
      alert('Laporan bukti penyaluran anggaran berhasil diterbitkan!')
    } catch (err: any) {
      setFormError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Hapus laporan penyaluran ini?')) return
    const { error } = await supabase.from('budget_reports').delete().eq('id', id)
    if (!error) {
      setReports(prev => prev.filter(item => item.id !== id))
    } else {
      alert('Gagal menghapus: ' + error.message)
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto min-h-screen text-slate-700 bg-slate-50">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Input Bukti Penyaluran Anggaran</h1>
          <p className="text-xs text-slate-500">Kelola dan unggah dokumentasi realisasi dana untuk transparansi publik.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* FORM INPUT */}
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5"><Plus size={16}/> Tambah Bukti Penyaluran</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-[11px] font-bold text-slate-500 block mb-1">NAMA PROGRAM / AGENDA PENYALURAN</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Contoh: Penyaluran Paket Sembako di Desa B" className="w-full px-3 py-2 border rounded-xl text-xs bg-white text-slate-800" required />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 block mb-1">TOTAL DANA TERSEDIA / KELUAR (RP)</label>
              <input type="number" value={amountSpent} onChange={(e) => setAmountSpent(e.target.value)} placeholder="Contoh: 1500000" className="w-full px-3 py-2 border rounded-xl text-xs bg-white text-slate-800" required />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 block mb-1">DESKRIPSI / DOKUMENTASI KEGIATAN</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Rincian singkat jalannya implementasi di lapangan..." rows={3} className="w-full px-3 py-2 border rounded-xl text-xs bg-white text-slate-800" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 block mb-1">FOTO DOKUMENTASI / BUKTI PENYALURAN (MAX 1MB)</label>
              <div className="relative border border-dashed rounded-xl p-4 bg-slate-50 text-center flex flex-col items-center justify-center hover:bg-slate-100 transition">
                <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" required />
                <UploadCloud size={20} className="text-slate-400 mb-1" />
                <span className="text-xs font-semibold max-w-[180px] truncate">{selectedFile ? selectedFile.name : 'Pilih Foto Kegiatan'}</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Format Gambar (Maksimal 1 MB)</span>
              </div>
            </div>

            {formError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-1">
                <AlertCircle size={14} className="shrink-0 mt-0.5" /> <span>{formError}</span>
              </div>
            )}

            <button type="submit" disabled={submitting} className="w-full py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 transition disabled:opacity-50">
              {submitting ? 'Mengunggah...' : 'Terbitkan Bukti Penyaluran'}
            </button>
          </form>
        </div>

        {/* TABEL PREVIEW ADMIN */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-sm font-bold text-slate-900">Daftar Dokumentasi Terbit ({reports.length})</h2>
          {loading ? (
            <div className="text-center py-10 text-xs text-slate-400"><Loader2 className="animate-spin inline mr-1" size={14}/>Loading...</div>
          ) : (
            <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b font-bold text-slate-600 uppercase">
                  <tr>
                    <th className="p-3">Nama Kegiatan</th>
                    <th className="p-3">Dana Disalurkan</th>
                    <th className="p-3">Dokumentasi</th>
                    <th className="p-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700">
                  {reports.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold">{item.title}</td>
                      <td className="p-3 text-rose-600 font-bold">Rp {item.amount_spent.toLocaleString('id-ID')}</td>
                      <td className="p-3">
                        <a href={item.proof_url} target="_blank" rel="noreferrer" className="text-indigo-600 font-medium inline-flex items-center gap-0.5 hover:underline">
                          <Camera size={12}/> Lihat Foto
                        </a>
                      </td>
                      <td className="p-3 text-center">
                        <button onClick={() => handleDelete(item.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-200 transition">
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}