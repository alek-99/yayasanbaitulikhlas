'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { 
  Trash2, 
  Eye, 
  MessageSquare, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ExternalLink,
  Search,
  RefreshCw,
  X
} from 'lucide-react'

export default function AdminDonasiPage() {
  const [donations, setDonations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  
  // State untuk Modal Detail
  const [selectedDonation, setSelectedDonation] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  // Fetch data donasi beserta judul campaign terkait
  const fetchDonations = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('donations')
      .select(`
        *,
        campaigns ( title )
      `)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setDonations(data)
    } else {
      alert('Gagal mengambil data donasi: ' + error?.message)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchDonations()
  }, [])

  // Fungsi utilitas untuk memformat & mengarahkan nomor ke WhatsApp API
  const sendWhatsAppMessage = (phone: string, message: string) => {
    if (!phone) return false

    // Bersihkan nomor dari spasi atau karakter non-angka
    let formattedPhone = phone.replace(/[^0-9]/g, '')
    
    // Konversi awalan 0 ke 62 (Kode Negara Indonesia)
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '62' + formattedPhone.slice(1)
    }

    const waUrl = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(message)}`
    window.open(waUrl, '_blank')
    return true
  }

  // Fungsi mengubah status donasi & memicu pengiriman pesan WhatsApp template konfirmasi
  const handleUpdateStatus = async (item: any, newStatus: 'confirmed' | 'rejected') => {
    setUpdatingStatus(true)
    const { error } = await supabase
      .from('donations')
      .update({ status: newStatus })
      .eq('id', item.id)

    setUpdatingStatus(false)
    if (error) {
      alert('Gagal memperbarui status: ' + error.message)
      return
    }

    // Update state lokal
    setDonations(prev => prev.map(d => d.id === item.id ? { ...d, status: newStatus } : d))
    setSelectedDonation((prev: any) => ({ ...prev, status: newStatus }))

    // Buat template pesan otomatis berdasarkan status baru
    const campaignTitle = item.campaigns?.title || 'Campaign Pilihan'
    const formattedAmount = item.amount.toLocaleString('id-ID')
    
    let waMessage = ''
    if (newStatus === 'confirmed') {
      waMessage = `Halo Kak ${item.donor_name},\n\nAlhamdulillah, pembayaran donasi Anda sebesar *Rp ${formattedAmount}* untuk campaign *"${campaignTitle}"* telah kami terima dan *BERHASIL DIVERIFIKASI*.\n\nTerima kasih banyak atas kebaikan Anda. Semoga menjadi berkah dan amal jariyah yang berlipat ganda. Amin. 🙏✨`
    } else if (newStatus === 'rejected') {
      waMessage = `Halo Kak ${item.donor_name},\n\nMohon maaf, setelah dilakukan pengecekan oleh tim admin, bukti pembayaran donasi Anda sebesar *Rp ${formattedAmount}* untuk campaign *"${campaignTitle}"* dinyatakan *TIDAK VALID / DITOLAK*.\n\nSilakan periksa kembali bukti transfer Anda atau hubungi admin jika terjadi kekeliruan.`
    }

    // Kirim pesan jika nomor tersedia
    if (item.donor_phone) {
      const isSent = sendWhatsAppMessage(item.donor_phone, waMessage)
      if (isSent) {
        alert(`Status berhasil diubah menjadi [${newStatus.toUpperCase()}] dan membuka WhatsApp untuk mengirim notifikasi.`);
      }
    } else {
      alert(`Status berhasil diubah menjadi [${newStatus.toUpperCase()}], namun donatur tidak mencantumkan nomor WhatsApp.`);
    }
  }

  // Fungsi menghapus data donasi
  const handleDeleteDonation = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data donasi ini secara permanen?')) return

    const { error } = await supabase
      .from('donations')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Gagal menghapus data: ' + error.message)
    } else {
      setDonations(prev => prev.filter(item => item.id !== id))
      if (isModalOpen && selectedDonation?.id === id) {
        setIsModalOpen(false)
      }
    }
  }

  // Fungsi Hubungi Manual lewat tabel (Pesan umum)
  const handleContactManual = (phone: string, name: string, amount: number) => {
    if (!phone) {
      alert('Nomor WhatsApp tidak dicantumkan oleh donatur.')
      return
    }
    const message = `Halo Kak ${name}, terima kasih telah melakukan komitmen donasi sebesar Rp ${amount.toLocaleString('id-ID')}. Kami dari tim admin ingin mengonfirmasi status pembayaran Anda...`
    sendWhatsAppMessage(phone, message)
  }

  // Filter pencarian berdasarkan nama donatur atau email
  const filteredDonations = donations.filter(item => 
    item.donor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.donor_email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 size={12}/> Confirmed</span>
      case 'rejected':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200"><XCircle size={12}/> Rejected</span>
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200"><Clock size={12}/> Pending</span>
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto min-h-screen text-slate-700 bg-slate-50">
      
      {/* Header Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">Kelola Data Donasi</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Verifikasi bukti transfer keuangan dan kirim notifikasi WhatsApp otomatis.</p>
        </div>
        <button 
          onClick={fetchDonations}
          className="inline-flex items-center gap-2 text-xs bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl px-4 py-2 transition shadow-sm font-medium"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh Data
        </button>
      </div>

      {/* Filter & Kontrol Pencarian */}
      <div className="relative max-w-md">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
          <Search size={16} />
        </span>
        <input
          type="text"
          placeholder="Cari nama donatur atau email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
        />
      </div>

      {/* Main Table */}
      {loading ? (
        <div className="flex justify-center items-center py-20 text-slate-500 gap-2 text-sm">
          <Loader2 className="animate-spin text-indigo-600" size={20} /> Memuat catatan transaksi...
        </div>
      ) : filteredDonations.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 text-slate-400 text-sm shadow-sm">
          Tidak ada data donasi yang ditemukan.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-xs tracking-wider uppercase">
                  <th className="p-4">Donatur</th>
                  <th className="p-4">Campaign Tujuan</th>
                  <th className="p-4">Nominal</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Metode</th>
                  <th className="p-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDonations.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4">
                      <div className="font-semibold text-slate-900">{item.donor_name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{item.donor_email}</div>
                    </td>
                    <td className="p-4 max-w-xs truncate text-slate-700 font-medium">
                      {item.campaigns?.title || <span className="text-slate-400 italic">Campaign dihapus</span>}
                    </td>
                    <td className="p-4 font-bold text-indigo-600">
                      Rp {item.amount.toLocaleString('id-ID')}
                    </td>
                    <td className="p-4">{getStatusBadge(item.status)}</td>
                    <td className="p-4 uppercase text-xs font-semibold text-slate-500">{item.payment_method}</td>
                    <td className="p-4">
                      <div className="flex justify-center items-center gap-2">
                        {/* Tombol Detail */}
                        <button
                          onClick={() => { setSelectedDonation(item); setIsModalOpen(true); }}
                          className="p-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl transition border border-slate-300 shadow-sm"
                          title="Lihat Detail / Bukti Transfer"
                        >
                          <Eye size={15} />
                        </button>
                        
                        {/* Tombol Hubungi WhatsApp */}
                        <button
                          onClick={() => handleContactManual(item.donor_phone, item.donor_name, item.amount)}
                          disabled={!item.donor_phone}
                          className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl transition border border-emerald-200 shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Hubungi via WhatsApp"
                        >
                          <MessageSquare size={15} />
                        </button>

                        {/* Tombol Hapus */}
                        <button
                          onClick={() => handleDeleteDonation(item.id)}
                          className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition border border-rose-200 shadow-sm"
                          title="Hapus Data"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL DETAIL DATA & VERIFIKASI BUKTI BAYAR */}
      {isModalOpen && selectedDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col text-slate-700 shadow-xl">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Detail Riwayat Donasi</h3>
                <p className="text-xs text-slate-500 mt-0.5">ID: {selectedDonation.id}</p>
              </div>
              <button 
                onClick={() => { setIsModalOpen(false); setSelectedDonation(null); }}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              
              {/* Rincian Teks */}
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Nama Donatur</span>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5">{selectedDonation.donor_name}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Email</span>
                    <p className="text-xs text-slate-700 truncate mt-0.5">{selectedDonation.donor_email}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">No. WhatsApp</span>
                    <p className="text-xs text-slate-700 mt-0.5">{selectedDonation.donor_phone || '-'}</p>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Nominal Donasi</span>
                  <p className="text-lg font-bold text-indigo-600 mt-0.5">Rp {selectedDonation.amount.toLocaleString('id-ID')}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Campaign Tujuan</span>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed mt-0.5">{selectedDonation.campaigns?.title || 'Data campaign induk tidak ditemukan.'}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Pesan / Doa</span>
                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 italic whitespace-pre-line mt-1">
                    "{selectedDonation.message || 'Tidak ada pesan khusus.'}"
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Status Saat Ini</span>
                  {getStatusBadge(selectedDonation.status)}
                </div>
              </div>

              {/* Rincian Bukti Gambar */}
              <div className="space-y-2 flex flex-col h-full justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Bukti Pembayaran (Kuitansi)</span>
                  {selectedDonation.proof_url ? (
                    <div className="relative rounded-xl border border-slate-200 bg-slate-50 overflow-hidden group h-52 flex items-center justify-center">
                      <img 
                        src={selectedDonation.proof_url} 
                        alt="Kuitansi Transfer" 
                        className="max-h-full max-w-full object-contain"
                      />
                      <a 
                        href={selectedDonation.proof_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="absolute bottom-2 right-2 bg-white/90 hover:bg-white border border-slate-300 p-1.5 rounded-lg text-slate-600 hover:text-slate-900 transition inline-flex items-center gap-1 text-[10px] shadow-sm"
                      >
                        <ExternalLink size={12} /> Buka Tab Baru
                      </a>
                    </div>
                  ) : (
                    <div className="h-52 border border-dashed border-slate-300 bg-slate-50 rounded-xl flex flex-col items-center justify-center text-slate-400 text-xs">
                      Donatur belum mengunggah foto kuitansi.
                    </div>
                  )}
                </div>

                {/* Kontrol Manajemen Status oleh Admin */}
                <div className="border-t border-slate-200 pt-4 space-y-2 mt-4 md:mt-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Ubah Status & Kirim Notifikasi WA</span>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      disabled={updatingStatus || selectedDonation.status === 'rejected'}
                      onClick={() => handleUpdateStatus(selectedDonation, 'rejected')}
                      className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold rounded-xl transition disabled:opacity-40"
                    >
                      Tolak & Kirim WA
                    </button>
                    <button
                      type="button"
                      disabled={updatingStatus || selectedDonation.status === 'confirmed'}
                      onClick={() => handleUpdateStatus(selectedDonation, 'confirmed')}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition shadow-sm disabled:opacity-40"
                    >
                      Konfirmasi & Kirim WA
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  )
}