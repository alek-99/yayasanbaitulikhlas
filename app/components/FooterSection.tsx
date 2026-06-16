"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Calendar, X } from "lucide-react";
import logo from "../../public/images/WhatsApp_Image_2026-01-24_at_03.13.32-removebg-preview.png";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Ditambahkan untuk animasi modal

// Buat interface tipe data agar aman dari error TypeScript
interface Program {
  id: string;
  title: string;
  category: string;
  description: string;
  image_url?: string;
}

export default function FooterSection() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null); // State mendeteksi program aktif di modal

  useEffect(() => {
    const fetchPrograms = async () => {
      const { data, error } = await supabase
        .from("programs")
        .select("id, title, category, description, image_url") // Mengambil kolom lengkap untuk kebutuhan konten modal
        .eq("status", "active")
        .limit(6);

      if (!error && data) {
        setPrograms(data as Program[]);
      }
    };

    fetchPrograms();
  }, []);

  return (
    <>
      <footer className="bg-slate-950 text-slate-400">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* BRAND */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-white text-xl font-black leading-snug">
                <Image
                  src={logo}
                  className="w-10 h-10 rounded-xl bg-white object-contain p-1"
                  alt="Logo Yayasan Baitul Ikhlas"
                />
                <span>Yayasan Baitul Ikhlas</span>
              </div>
              <p className="text-sm leading-relaxed">
                Lembaga sosial yang berkomitmen untuk membahagiakan anak-anak
                yatim.
              </p>
            </div>

            {/* PROGRAM */}
            <div>
              <h4 className="text-white font-bold mb-5">Program Kami</h4>
              <ul className="space-y-3 text-sm">
                {programs?.map((program) => (
                  <li key={program.id}>
                    {/* Mengubah tautan Link menjadi button klik pemicu modal */}
                    <button
                      onClick={() => setSelectedProgram(program)}
                      className="hover:text-green-400 transition-colors text-left font-medium block w-full focus:outline-none"
                    >
                      {program.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* TENTANG */}
            <div>
              <h4 className="text-white font-bold mb-5">Tentang Kami</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="#tentang"
                    className="hover:text-green-400 transition-colors"
                  >
                    Profil Yayasan
                  </Link>
                </li>
                <li>
                  <Link
                    href="#program"
                    className="hover:text-green-400 transition-colors"
                  >
                    Program
                  </Link>
                </li>
                <li>
                  <Link
                    href="#artikel"
                    className="hover:text-green-400 transition-colors"
                  >
                    Artikel
                  </Link>
                </li>
              </ul>
            </div>

            {/* DONASI & SOSIAL MEDIA */}
            <div className="flex flex-col gap-6">
              <div>
                <h4 className="text-white font-bold mb-4">Dukung Kami</h4>
                <Link
                  href="../campaign"
                  className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3.5 px-4 rounded-2xl font-bold transition-all transform hover:-translate-y-0.5"
                >
                  <i className="fas fa-heart"></i>
                  <span>Donasi Sekarang</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-900 pt-4">
                <div className="flex items-center gap-2 text-white text-sm font-semibold">
                  <span>Ikuti Kami</span>
                </div>

                <div className="flex items-center gap-4 text-2xl">
                  <a
                    href="https://www.facebook.com/profile.php?id=100076234412073"
                    aria-label="Facebook"
                  >
                    <i className="fab fa-facebook-f hover:text-blue-500 transition-colors"></i>
                  </a>

                  <a
                    href="https://www.instagram.com/yayasanbaitulikhlas?igsh=MTRjNm10eml0eXUzaw=="
                    aria-label="Instagram"
                  >
                    <i className="fab fa-instagram hover:text-pink-500 transition-colors"></i>
                  </a>

                  <a
                    href="https://www.youtube.com/@yayasanbaitulikhlaspeduliy4989"
                    aria-label="YouTube"
                  >
                    <i className="fab fa-youtube hover:text-red-500 transition-colors"></i>
                  </a>

                  <a
                    href="https://www.tiktok.com/@yayasan.baitul.ik?is_from_webapp=1&sender_device=pc"
                    aria-label="TikTok"
                  >
                    <i className="fab fa-tiktok hover:text-white transition-colors"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* COPYRIGHT */}
          <div className="border-t border-slate-900 mt-16 pt-8 text-center text-sm">
            © {new Date().getFullYear()} Yayasan Baitul Ikhlas. All Rights
            Reserved.
          </div>
        </div>
      </footer>

      {/* RENDER MODAL DETAIL PROGRAM */}
      <AnimatePresence>
        {selectedProgram && (
          <ProgramModal 
            program={selectedProgram} 
            onClose={() => setSelectedProgram(null)} 
          />
        )}
      </AnimatePresence>
    </>
  );
}

// --- SUB-KOMPONEN MODAL DETAIL PROGRAM ---
function ProgramModal({ program, onClose }: { program: Program, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop Hitam Transparan */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 sm:bg-slate-900/80 backdrop-blur-md sm:backdrop-blur-xl"
      />
      
      {/* Wadah Utama Modal */}
      <motion.div 
        initial={{ opacity: 0, y: "100%" }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative bg-white w-full sm:max-w-4xl h-[85vh] sm:h-auto max-h-[90vh] sm:max-h-[85vh] rounded-t-4xl sm:rounded-[2.5rem] overflow-y-auto sm:overflow-hidden shadow-2xl flex flex-col md:flex-row z-10 text-slate-800"
      >
        {/* Tombol Tutup Silang */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-900/40 sm:bg-slate-100 text-white sm:text-slate-700 hover:bg-slate-200 sm:hover:text-slate-900 transition-all flex items-center justify-center active:scale-90 shadow-md"
        >
          <X className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* Media / Alur Tampilan Gambar Kiri */}
        <div className="w-full md:w-1/2 aspect-16/10 md:aspect-auto md:h-full min-h-[250px] md:min-h-[450px] bg-slate-100 relative shrink-0">
          {program.image_url ? (
            <img src={program.image_url} className="w-full h-full object-cover" alt={program.title} />
          ) : (
            <div className="w-full h-full flex items-center justify-center py-12 md:py-0">
              <span className="text-slate-300 font-medium text-xs">Gambar tidak tersedia</span>
            </div>
          )}
          <div className="absolute bottom-4 left-4 px-4 py-1.5 rounded-xl bg-white shadow-md text-emerald-600 font-black text-xs z-10 border border-slate-100">
            {program.category || "Umum"}
          </div>
        </div>

        {/* Detail Tulisan Teks Deskripsi Kanan */}
        <div className="w-full md:w-1/2 p-6 md:p-10 lg:p-12 md:overflow-y-auto flex flex-col justify-between bg-white text-left">
          <div>
            <div className="flex items-center gap-2 text-slate-400 font-bold text-[9px] uppercase tracking-[0.15em] mb-2">
              <Calendar className="w-3 h-3" />
              Info Program
            </div>
            
            <h2 className="text-xl md:text-3xl font-black text-slate-900 mb-3 leading-snug break-words">
              {program.title}
            </h2>
            
            <div className="w-12 md:w-16 h-1 bg-emerald-500 rounded-full mb-5 shrink-0" />
            
            <div className="prose prose-slate max-w-none mb-6">
              <p className="text-slate-600 text-sm md:text-base font-medium leading-relaxed whitespace-pre-line break-words">
                {program.description}
              </p>
            </div>
          </div>
          
          <div className="mt-4 pt-2 shrink-0">
            <button 
              onClick={onClose} 
              className="w-full py-3 md:py-3.5 px-6 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl font-bold text-sm transition-all active:scale-95 text-center"
            >
              Tutup Detail
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}