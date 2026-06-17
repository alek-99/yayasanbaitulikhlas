'use client';
import Image from "next/image";
import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Calendar, User, ArrowLeft, BookOpen, Share2, Check, Link2 } from "lucide-react";
import Link from "next/link";
import logo from "../../../public/images/WhatsApp_Image_2026-01-24_at_03.13.32-removebg-preview.png";
import Topbar from "@/app/components/Topbar";

interface Article {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
}

export default function DetailArtikelPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Unwrapping params sesuai standar Next.js
  const resolvedParams = use(params);

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchArticleDetail = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("articles")
          .select("id, title, content, image_url, created_at")
          .eq("slug", resolvedParams.slug)
          .eq("status", "published")
          .single(); // Mengambil data tunggal murni

        if (error) throw error;
        if (data) setArticle(data);
      } catch (error) {
        console.error("Error fetching article detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticleDetail();
  }, [resolvedParams.slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Fungsi untuk menyalin tautan ke clipboard
  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset status setelah 2 detik
    }
  };

  // URL Encode data untuk share link
  const currentUrl = typeof window !== "undefined" ? encodeURIComponent(window.location.href) : "";
  const shareText = article ? encodeURIComponent(`Baca artikel menarik ini: "${article.title}"\n\n`) : "";

  if (loading) {
    return (
      <div className="min-h-screen bg-white font-sans antialiased animate-pulse pb-20">
        {/* Mock Topbar Skeleton */}
        <div className="h-16 border-b border-gray-100 bg-gray-50/50 w-full mb-6 sm:mb-10" />

        <main className="container mx-auto px-4 max-w-3xl">
          <div className="space-y-6">
            {/* Metadata Skeleton */}
            <div className="space-y-3">
              <div className="flex items-center space-x-4">
                <div className="h-3.5 bg-gray-200 rounded w-32" />
                <div className="h-3.5 bg-gray-200 rounded w-4" />
                <div className="h-3.5 bg-gray-200 rounded w-24" />
              </div>

              {/* Title Skeleton */}
              <div className="space-y-2">
                <div className="h-7 sm:h-9 lg:h-10 bg-gray-200 rounded-lg w-full" />
                <div className="h-7 sm:h-9 lg:h-10 bg-gray-200 rounded-lg w-5/6" />
              </div>
            </div>

            {/* Banner Gambar Skeleton (16:9 Aspect Ratio) */}
            <div className="relative aspect-[16/9] w-full rounded-2xl bg-gray-200 border border-gray-100" />

            {/* Isi Konten Skeleton */}
            <div className="pt-4 border-t border-gray-100">
              <div className="border-l-4 border-gray-200 pl-4 space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-11/12" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-10/12" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
            </div>
          </div>

          {/* Footer Card Skeleton */}
          <footer className="mt-12 pt-8 border-t border-gray-100">
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Bagian Kiri: Logo & Text */}
              <div className="flex flex-col items-center sm:items-start space-y-3 w-full sm:w-auto">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200" />
                  <div className="h-4 bg-gray-200 rounded w-36" />
                </div>
                <div className="h-3 bg-gray-200 rounded w-52 sm:w-64" />
              </div>

              {/* Bagian Kanan: Tombol */}
              <div className="w-full sm:w-32 h-9 bg-gray-200 rounded-xl" />
            </div>
          </footer>
        </main>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
          <BookOpen className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          Artikel Tidak Ditemukan
        </h2>
        <p className="text-sm text-gray-500 mt-1 max-w-sm">
          Maaf, artikel yang Anda cari tidak tersedia atau telah diarsipkan oleh
          administrator.
        </p>
        <Link
          href="/artikel"
          className="mt-6 inline-flex items-center space-x-2 text-sm font-semibold bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl transition shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Artikel</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans antialiased text-gray-900 pb-20">
      <Topbar />

      {/* Konten Utama Artikel */}
      <main className="container mx-auto px-4 max-w-3xl mt-6 sm:mt-10">
        <article className="space-y-6">
          {/* Metadata & Judul */}
          <div className="space-y-3">
            <div className="flex items-center space-x-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              <div className="flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDate(article.created_at)}</span>
              </div>
              <span>•</span>
              <div className="flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5" />
                <span>Oleh: Admin</span>
              </div>
            </div>

            <h1 className="text-2xl font-extrabold text-gray-950 tracking-tight leading-tight sm:text-3xl lg:text-4xl">
              {article.title}
            </h1>
          </div>

          {/* Banner Gambar */}
          {article.image_url && (
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Isi Konten Utama (Mendukung baris baru otomatis / Break-Words) */}
          <div className="pt-4 border-t border-gray-100">
            <div className="border-l-4 border-slate-400 pl-4 text-left text-base text-gray-800 leading-relaxed space-y-5 whitespace-pre-line break-words font-normal">
              {article.content}
            </div>
          </div>
        </article>

        {/* FITUR BAGIKAN (SHARE) */}
        <div className="mt-10 pt-6 border-t border-gray-100">
          <div className="bg-amber-50/40 rounded-2xl p-5 border border-amber-100/60 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-slate-700">
              <Share2 className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-bold tracking-wide">Bagikan Artikel Ini:</span>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-3 w-full md:w-auto">
              {/* WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${shareText}${currentUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-bold bg-[#25D366] text-white px-4 py-2.5 rounded-xl hover:bg-[#20ba5a] transition shadow-sm"
              >
                <span>WhatsApp</span>
              </a>

              {/* Instagram (Mengarahkan ke Web Instagram karena batasan API direct feed share) */}
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-bold bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white px-4 py-2.5 rounded-xl hover:opacity-90 transition shadow-sm"
              >
                <span>Instagram</span>
              </a>

              {/* TikTok (Mengarahkan ke Web TikTok) */}
              <a
                href="https://www.tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-bold bg-black text-white px-4 py-2.5 rounded-xl hover:bg-neutral-900 transition shadow-sm"
              >
                <span>TikTok</span>
              </a>

              {/* Salin Tautan */}
              <button
                onClick={handleCopyLink}
                className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-sm border ${
                  copied 
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
                <span>{copied ? "Tautan Disalin!" : "Salin Link"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Artikel / Card Penutup */}
        <footer className="mt-8 pt-6 border-t border-gray-100">
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            {/* Bagian Kiri: Logo dan Teks */}
            <div className="flex flex-col items-center sm:items-start">
              <div className="flex items-center gap-3">
                <Image
                  src={logo}
                  alt="Logo"
                  className="w-8 h-8 object-contain"
                />
                <h4 className="text-sm font-bold text-gray-900">
                  Yayasan Baitul Ikhlas
                </h4>
              </div>
              <p className="text-xs text-gray-500 mt-2 sm:mt-1 max-w-sm">
                Menebar kebaikan, memurnikan keikhlasan demi Anak Yatim.
              </p>
            </div>

            {/* Bagian Kanan: Tombol */}
            <Link
              href="/artikel"
              className="w-full sm:w-auto justify-center inline-flex text-xs font-bold bg-white border border-gray-200 text-gray-700 hover:text-blue-600 hover:border-blue-200 px-4 py-2.5 rounded-xl transition shadow-sm"
            >
              Lihat Artikel Lainnya
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}