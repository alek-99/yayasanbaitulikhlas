"use client";
import { supabase } from '@/lib/supabaseClient';
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Heart, Users, Droplets, Home, X, Calendar, 
  ArrowRight, HelpCircle, ArrowUpRight
} from "lucide-react";

// --- TYPES ---
interface Program {
  id: string;
  title: string;
  category: string;
  description: string;
  image_url?: string;
  created_at?: string;
}

// --- CONSTANTS & MAPPING ---
const CATEGORY_CONFIG: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; bg: string; border: string }> = {
  Pendidikan: { icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50/50", border: "border-blue-100" },
  Sosial: { icon: Users, color: "text-orange-600", bg: "bg-orange-50/50", border: "border-orange-100" },
  Keagamaan: { icon: Home, color: "text-indigo-600", bg: "bg-indigo-50/50", border: "border-indigo-100" },
  Kesehatan: { icon: Heart, color: "text-rose-600", bg: "bg-rose-50/50", border: "border-rose-100" },
  Lingkungan: { icon: Droplets, color: "text-emerald-600", bg: "bg-emerald-50/50", border: "border-emerald-100" },
  Umum: { icon: HelpCircle, color: "text-slate-600", bg: "bg-slate-50/50", border: "border-slate-100" },
};

// --- REUSABLE MINI COMPONENTS ---
const SectionHeader = ({ subtitle, title, description }: { subtitle: string, title: string, description: string }) => (
  <div className="relative mb-10 md:mb-16 text-center px-4">
    <motion.span 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="inline-block px-3 py-1 mb-3 text-[10px] md:text-xs font-bold tracking-widest uppercase rounded-full bg-slate-100 text-slate-600 border border-slate-200"
    >
      {subtitle}
    </motion.span>
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
      className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-4 md:mb-6 tracking-tight leading-[1.15]"
    >
      {title}
    </motion.h2>
    <motion.p 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 }}
      className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-slate-500 font-medium leading-relaxed"
    >
      {description}
    </motion.p>
  </div>
);

// Improved Skeleton to match exact card structure
const ProgramSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-white rounded-4xl p-3 border border-slate-100 shadow-sm flex flex-col space-y-4 animate-pulse">
        <div className="relative aspect-4/3 w-full bg-slate-200 rounded-3xl" />
        <div className="flex flex-col grow p-4 space-y-3">
          <div className="h-6 bg-slate-200 rounded-md w-3/4" />
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 rounded-md w-full" />
            <div className="h-4 bg-slate-200 rounded-md w-5/6" />
          </div>
          <div className="pt-4 flex items-center justify-between">
            <div className="h-4 bg-slate-200 rounded-md w-1/3" />
            <div className="h-8 w-8 bg-slate-200 rounded-full" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// --- MAIN EXPORT COMPONENT ---
export default function ProgramSection({ initialPrograms = [] }: { initialPrograms?: Program[] }) {
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [programs, setPrograms] = useState<Program[]>(initialPrograms);
  const [isLoading, setIsLoading] = useState(initialPrograms.length === 0);

  useEffect(() => {
    if (initialPrograms.length > 0) return;
    
    const fetchPrograms = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("programs")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setPrograms(data);
      }
      setIsLoading(false);
    };

    fetchPrograms();
  }, [initialPrograms]);

  return (
    <main className="bg-white selection:bg-slate-900 selection:text-white">
      <section id="program" className="relative py-16 md:py-24 lg:py-32 overflow-hidden bg-slate-50/50">
        {/* Background Blobs - Fixed custom positioning format */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-30 md:opacity-40">
           <div className="absolute top-[-5%] left-[-10%] w-[60%] md:w-[40%] h-[40%] bg-blue-100 blur-[80px] md:blur-[120px] rounded-full" />
           <div className="absolute top-[40%] right-[-10%] w-[50%] md:w-[30%] h-[30%] bg-emerald-100 blur-[80px] md:blur-[100px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeader 
            subtitle="Dampak Nyata"
            title="Program Utama Kami"
            description="Inisiatif strategis yang dirancang untuk menciptakan transformasi sosial berkelanjutan di berbagai lini kehidupan masyarakat."
          />

          {isLoading ? (
            <ProgramSkeleton />
          ) : programs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
              {programs.map((program, idx) => (
                <ProgramCard 
                  key={program.id} 
                  program={program} 
                  index={idx}
                  onClick={() => setSelectedProgram(program)}
                />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </section>

      {/* MODAL SYSTEM */}
      <AnimatePresence>
        {selectedProgram && (
          <ProgramModal program={selectedProgram} onClose={() => setSelectedProgram(null)} />
        )}
      </AnimatePresence>
    </main>
  );
}

// --- INNER COMPONENTS ---
function ProgramCard({ program, index, onClick }: { program: Program, index: number, onClick: () => void }) {
  const normalizedCategory = program.category ? program.category.charAt(0).toUpperCase() + program.category.slice(1).toLowerCase() : "Umum";
  const config = CATEGORY_CONFIG[normalizedCategory] || CATEGORY_CONFIG.Umum;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className="group relative h-full bg-white rounded-4xl p-3 md:p-4 border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-300 cursor-pointer flex flex-col active:scale-[0.99] md:active:scale-100"
    >
      {/* Fixed aspect ratio classes & rounded definitions */}
      <div className="relative aspect-16/10 sm:aspect-4/3 w-full overflow-hidden rounded-3xl bg-slate-100">
        {program.image_url ? (
          <img 
            src={program.image_url} 
            alt={program.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-50">
            <Icon className="w-12 h-12 text-slate-300" />
          </div>
        )}
        
        <div className={`absolute top-3 left-3 px-3 py-1.5 rounded-xl backdrop-blur-md ${config.bg} ${config.color} ${config.border} border text-[11px] font-bold flex items-center gap-1.5`}>
          <Icon className="w-3.5 h-3.5" />
          {program.category}
        </div>
      </div>

      <div className="flex flex-col grow p-4 md:p-5">
        <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 leading-snug group-hover:text-emerald-600 transition-colors line-clamp-2">
          {program.title}
        </h3>
        <p className="text-slate-500 font-medium text-xs md:text-sm line-clamp-3 mb-6 grow">
          {program.description}
        </p>
        
        <div className="flex items-center justify-between pt-2 border-t border-slate-50">
          <span className="flex items-center gap-2 text-xs md:text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
            Detail Program
            <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
          </span>
          <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center bg-slate-50 md:opacity-0 group-hover:opacity-100 transition-all">
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-12 md:py-20 px-4 md:px-6 rounded-4xl md:rounded-[3rem] border-2 border-dashed border-slate-200 bg-white">
      <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
        <HelpCircle className="w-8 h-8 md:w-10 md:h-10 text-slate-200" />
      </div>
      <h3 className="text-xl md:text-2xl font-bold text-slate-900">Belum Ada Program Aktif</h3>
      <p className="text-sm md:text-slate-500 mt-2 max-w-sm mx-auto font-medium text-slate-400">Kami sedang meramu inisiatif kebaikan baru. Silakan mampir kembali dalam waktu dekat.</p>
    </div>
  );
}

function ProgramModal({ program, onClose }: { program: Program, onClose: () => void }) {
  const normalizedCategory = program.category ? program.category.charAt(0).toUpperCase() + program.category.slice(1).toLowerCase() : "Umum";
  const config = CATEGORY_CONFIG[normalizedCategory] || CATEGORY_CONFIG.Umum;
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-100 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 sm:bg-slate-900/80 backdrop-blur-md sm:backdrop-blur-xl"
      />
      
      {/* Modal Container */}
      <motion.div 
        initial={{ opacity: 0, y: "100%" }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative bg-white w-full sm:max-w-4xl h-[85vh] sm:h-auto sm:max-h-[90vh] rounded-t-4xl sm:rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row z-10"
      >
        {/* Tombol Tutup/Close Floating - Fixed CSS Conflict h-5 vs h-6 */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-900/40 sm:bg-slate-100 text-white sm:text-slate-700 hover:bg-slate-200 sm:hover:text-slate-900 transition-all flex items-center justify-center active:scale-90 shadow-md"
        >
          <X className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* Bagian Media/Gambar */}
        <div className="w-full md:w-1/2 aspect-16/10 md:aspect-auto md:h-full bg-slate-100 relative shrink-0">
          {program.image_url ? (
            <img src={program.image_url} className="w-full h-full object-cover" alt={program.title} />
          ) : (
            <div className="w-full h-full flex items-center justify-center py-8 md:py-0">
              <Icon className="w-16 h-16 md:w-28 md:h-28 opacity-10" />
            </div>
          )}
          <div className={`absolute bottom-4 left-4 px-4 py-1.5 rounded-xl bg-white shadow-md ${config.color} font-black text-xs flex items-center gap-2`}>
            <Icon className="w-4 h-4" />
            {program.category}
          </div>
        </div>

        {/* Bagian Konten */}
        <div className="w-full md:w-1/2 p-6 md:p-10 lg:p-12 overflow-y-auto flex flex-col min-h-0 bg-white">
          <div className="flex items-center gap-2 text-slate-400 font-bold text-[9px] uppercase tracking-[0.15em] mb-2">
            <Calendar className="w-3 h-3" />
            Publikasi Terbaru
          </div>
          
          <h2 className="text-xl md:text-3xl font-black text-slate-900 mb-3 leading-snug break-all">
            {program.title}
          </h2>
          
          <div className="w-12 md:w-16 h-1 bg-emerald-500 rounded-full mb-5 shrink-0" />
          
          <div className="prose prose-slate max-w-none grow mb-6">
            <p className="text-slate-600 text-sm md:text-base font-medium leading-relaxed whitespace-pre-line break-all">
              {program.description}
            </p>
          </div>
          
          {/* Tombol Aksi */}
          <div className="mt-auto pt-2 shrink-0">
            <button 
              onClick={onClose} 
              className="w-full py-3 md:py-3.5 px-6 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl font-bold text-sm transition-all active:scale-95 text-center"
            >
              Kembali Ke Program
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}