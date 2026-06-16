"use client";

import Image from "next/image";
import {
  Heart,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  HandHeart,
} from "lucide-react";
import { motion, Variants } from "framer-motion";
import heroImage from "../../public/images/erasebg-transformed.png";
import Link from "next/link";

// 1. SOLUSI ERROR: Menambahkan tipe data 'Variants' secara eksplisit agar TypeScript mengenali properti 'ease'
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Jeda waktu antar elemen muncul
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.7, 
      ease: "easeOut" // Sekarang tidak akan error lagi
    },
  },
};

export default function HeroSection() {
  return (
    // SEO & Aksesibilitas: Menambahkan ID unik dan aria-label pada section utama
    <section 
      id="hero"
      aria-label="Sambutan Utama Yayasan Baitul Ikhlas"
      className="relative min-h-screen flex flex-col-reverse items-center overflow-hidden bg-emerald-950 pt-20 md:pt-0"
    >
      
      {/* 1. BACKGROUND HERO */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1.05, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
          style={{
            backgroundImage: `url('/images/herobg.jpg')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-950/90 to-emerald-950/40 md:block hidden" />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/60 via-emerald-950/90 to-emerald-950 md:hidden block" />
      </div>

      {/* Ornamen Glow Estetik */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none z-0" 
      />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.3 }}
        className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none z-0" 
      />

      {/* Pola Garis Halus Islami */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] z-0" />

      {/* CONTAINER UTAMA GRID */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* KOLOM KIRI: TEKS & CTA */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-3xl lg:col-span-7 text-left mt-5"
          >
            {/* Badge Atas */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 text-emerald-200 text-xs sm:text-sm font-medium px-4 py-2 rounded-full mb-6 shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="tracking-wide uppercase text-[11px] font-bold text-amber-300">
                Amanah & Transparan
              </span>
              <span className="text-white/30" aria-hidden="true">|</span>
              <span className="text-emerald-100/90">Bersama, Kita Mengalirkan Berkah</span>
            </motion.div>

            {/* Heading utama (H1) - Sangat krusial untuk SEO */}
            <motion.h1 variants={itemVariants} className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.2] mb-6 tracking-tight drop-shadow-md">
              Setiap Donasi Anda <br className="hidden sm:inline" />
              Jadi{" "}
              <strong className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500 font-extrabold">
                Amal Jariyah
              </strong>{" "}
              yang Mengubah Kehidupan
            </motion.h1>

            {/* Deskripsi dengan penekanan kata kunci */}
            <motion.p variants={itemVariants} className="text-base sm:text-lg text-emerald-50/90 leading-relaxed mb-8 max-w-2xl font-light drop-shadow-sm">
              <strong>Yayasan Baitul Ikhlas Peduli Yatim</strong> berkomitmen menjadi jembatan
              kebaikan yang amanah. Menyalurkan kepedulian Anda secara tepat
              sasaran untuk anak-anak yatim yang membutuhkan, demi meraih
              ridho-Nya.
            </motion.p>

            {/* Tombol Aksi (CTA) - Ditambahkan title & aria-label untuk SEO/Aksesibilitas */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="../campaign"
                title="Tunaikan Donasi Sekarang"
                aria-label="Tunaikan Donasi ke Yayasan Baitul Ikhlas"
                className="group flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-emerald-950 font-bold text-base px-8 py-4 rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transform hover:-translate-y-0.5"
              >
                <HandHeart className="w-5 h-5 transition-transform group-hover:scale-110" />
                Tunaikan Donasi
              </Link>

              <a
                href="#kampanye"
                title="Lihat Daftar Program Kebaikan"
                aria-label="Lihat Program Kebaikan Yayasan"
                className="group flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-semibold text-base px-8 py-4 rounded-xl transition-all duration-300 backdrop-blur-sm shadow-sm"
              >
                Lihat Program Kebaikan
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </motion.div>

            {/* Garis Pembatas */}
            <motion.div 
              variants={itemVariants}
              className="w-full h-[1px] bg-gradient-to-r from-white/20 via-white/10 to-transparent my-10" 
            />

            {/* Statistik Quick Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 sm:gap-6 max-w-xl">
              {[
                { value: "5.000+", label: "Muzakki / Donatur" },
                { value: "Rp 2M+", label: "Dana Tersalurkan" },
                { value: "50+", label: "Program Berkelanjutan" },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="relative pl-3 border-l-2 border-amber-400"
                >
                  <div className="text-xl sm:text-2xl font-bold text-amber-400 tracking-tight drop-shadow-sm">
                    {stat.value}
                  </div>
                  <div className="text-emerald-100/70 text-xs sm:text-sm font-medium mt-1 leading-tight">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* KOLOM KANAN: FOTO */}
          <motion.div 
            className="hidden lg:block lg:col-span-5 relative group"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: -20, scale: 1.1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            {/* Wadah Foto Utama - Pastikan nanti ditambahkan komponen <Image /> bawaan Next.js dengan properti alt yang deskriptif untuk SEO */}
          </motion.div>

        </div>
      </div>
    </section>
  );
}