"use client"; // Tambahkan ini di paling atas jika belum ada

import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import logo from "../../public/images/WhatsApp_Image_2026-01-24_at_03.13.32-removebg-preview.png";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react"; // 1. Tambahkan import ini

export default function FooterSection() {
  // 2. HAPUS kata 'async' di sini
  // 3. Buat state untuk menampung data program
  const [programs, setPrograms] = useState<any[]>([]);

  // 4. Ambil data menggunakan useEffect
  useEffect(() => {
    const fetchPrograms = async () => {
      const { data, error } = await supabase
        .from("programs")
        .select("id, title")
        .eq("status", "active")
        .limit(6);

      if (!error && data) {
        setPrograms(data);
      }
    };

    fetchPrograms();
  }, []);

  return (
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
                  <Link
                    href={`/program/${program.id}`}
                    className="hover:text-green-400 transition-colors"
                  >
                    {program.title}
                  </Link>
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
  );
}
