'use client'

import { useState } from 'react'
import { Landmark, ShieldCheck, Upload, HelpCircle, ChevronDown } from 'lucide-react'

interface FAQItem {
  question: string
  answer: React.ReactNode
  icon?: React.ReactNode
}

export default function DonationFAQ() {
  // Default membuka pertanyaan pertama (index 0)
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const faqs: FAQItem[] = [
    {
      question: 'Bagaimana alur dan tahapan berdonasi secara transfer manual?',
      icon: <HelpCircle className="text-blue-600 w-5 h-5 flex-shrink-0" />,
      answer: (
        <div className="space-y-3">
          <p>Proses donasi di platform kami dirancang transparan dan aman melalui 4 langkah mudah:</p>
          <ol className="list-decimal list-inside space-y-2 text-slate-600 pl-1">
            <li>
              <strong className="text-slate-800">Pilih Campaign:</strong> Cari dan pilih program kebaikan yang sedang aktif, lalu klik tombol donasi.
            </li>
            <li>
              <strong className="text-slate-800">Isi Data Diri:</strong> Masukkan nama, email, nomor WhatsApp, serta nominal donasi Anda pada formulir Langkah 1.
            </li>
            <li>
              <strong className="text-slate-800">Transfer Dana:</strong> Sistem akan memberikan nomor rekening tujuan (BCA, BRI, atau DANA). Silakan transfer tepat hingga digit terakhir nominal yang tertera.
            </li>
            <li>
              <strong className="text-slate-800">Unggah Bukti:</strong> Unggah foto atau tangkapan layar bukti transfer Anda pada Langkah 3 agar tim admin dapat segera melakukan verifikasi.
            </li>
          </ol>
        </div>
      )
    },
    {
      question: 'Apa saja metode pembayaran atau pilihan rekening yang tersedia?',
      icon: <Landmark className="text-blue-600 w-5 h-5 flex-shrink-0" />,
      answer: (
        <div className="space-y-2">
          <p>
            Kami menyediakan beberapa pilihan rekening resmi atas nama <strong className="text-slate-800">Yayasan Kebaikan Indonesia</strong> untuk menjamin keamanan transaksi Anda:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
            <li><strong className="text-slate-800">Bank BCA</strong></li>
            <li><strong className="text-slate-800">Bank BRI</strong></li>
            <li><strong className="text-slate-800">DANA (E-Wallet)</strong></li>
          </ul>
          <p className="pt-1 text-xs text-slate-500">
            *Anda dapat menyalin nomor rekening tersebut secara instan langsung pada panel Langkah 2 saat proses donasi.
          </p>
        </div>
      )
    },
    {
      question: 'Bagaimana jika saya tidak sengaja menutup modal sebelum mengunggah bukti transfer?',
      icon: <Upload className="text-blue-600 w-5 h-5 flex-shrink-0" />,
      answer: (
        // PERBAIKAN 1: Mengubah pembungkus <p> menjadi <div> karena ada elemen inline-block di dalamnya
        <div className="text-slate-600">
          Jangan khawatir, komitmen donasi Anda telah tersimpan dengan aman di sistem kami dengan status <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">Pending</span>. Anda tetap dapat melanjutkan transfer. Jika halaman formulir terlanjur tertutup, Anda dapat melakukan konfirmasi susulan secara manual dengan menghubungi tim admin kami melalui halaman kontak bantuan.
        </div>
      )
    },
    {
      question: 'Mengapa ada verifikasi keamanan (Turnstile) sebelum memproses donasi?',
      icon: <ShieldCheck className="text-blue-600 w-5 h-5 flex-shrink-0" />,
      answer: (
        // PERBAIKAN 2: Mengubah pembungkus <p> menjadi <div> agar konsisten menjaga struktur DOM yang valid
        <div className="text-slate-600">
          Verifikasi Cloudflare Turnstile pada Langkah 1 berfungsi untuk melindungi platform dari serangan bot otomatis, spam, dan aktivitas siber yang mencurigakan. Fitur ini memastikan bahwa setiap transaksi dilakukan oleh donatur asli demi menjaga integritas, performa, dan keamanan data platform.
        </div>
      )
    },
    {
      question: 'Berapa ukuran dan format gambar bukti transfer yang didukung?',
      icon: <Upload className="text-blue-600 w-5 h-5 flex-shrink-0" />,
      answer: (
        // PERBAIKAN 3: Mengubah pembungkus <p> menjadi <div> demi keamanan validasi HTML
        <div className="text-slate-600">
          Sistem kami mendukung berkas gambar dengan format <strong className="text-slate-800">JPG, PNG, atau WEBP</strong> dengan ukuran maksimal <strong className="text-slate-800">2 Megabytes (MB)</strong>. Pastikan foto kuitansi atau tangkapan layar m-banking Anda terlihat jelas, tidak terpotong, dan tidak buram untuk mempercepat proses verifikasi manual oleh tim admin.
        </div>
      )
    }
  ]

  return (
    <div className="w-full max-w-2xl mx-auto my-8 p-6 bg-white rounded-2xl border border-slate-100 shadow-md shadow-slate-100/40 text-slate-800">
      {/* Header Bagian Atas */}
      <div className="text-center md:text-left mb-6 pb-5 border-b border-slate-100">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center justify-center md:justify-start gap-2.5">
          Pertanyaan Populer seputar Donasi
        </h2>
        <p className="text-sm text-slate-500 mt-1.5">
          Pahami alur donasi, metode transfer, hingga tahap verifikasi berkas kuitansi Anda.
        </p>
      </div>

      {/* Daftar FAQ Accordion */}
      <div className="space-y-3.5">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index
          return (
            <div 
              key={index} 
              className={`border rounded-xl overflow-hidden transition-all duration-300 ${
                isOpen ? 'border-blue-200 bg-blue-50/10 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleFAQ(index)}
                className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left font-semibold text-sm md:text-base text-slate-800 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  {faq.icon}
                  <span className={isOpen ? 'text-blue-900' : 'text-slate-800'}>{faq.question}</span>
                </div>
                <ChevronDown 
                  size={18} 
                  className={`text-slate-400 transition-transform duration-300 flex-shrink-0 ${
                    isOpen ? 'rotate-180 text-blue-600' : ''
                  }`} 
                />
              </button>

              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                {/* PERBAIKAN 4 & 5: Komponen penampung ini asalnya adalah <div>. Karena isi didalamnya ({faq.answer}) sekarang juga sudah aman menggunakan pembungkus <div> atau gabungan <p>, struktur bersarang <div> di dalam <div> seperti ini 100% valid secara spesifikasi HTML standard dan menghilangkan error 412 secara permanen. */}
                <div className="px-5 pb-5 pt-1 text-xs md:text-sm text-slate-600 leading-relaxed border-t border-dashed border-slate-100 mt-[-4px]">
                  {faq.answer}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}