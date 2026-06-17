import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { Calendar, User, ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import logo from "../../../public/images/WhatsApp_Image_2026-01-24_at_03.13.32-removebg-preview.png";
import Topbar from "@/app/components/Topbar";
import { Metadata } from "next";
import DetailArtikelClient from "./DetailArtikelClient"; // 👍 Diperbaiki ke folder yang sama

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const baseUrl = "https://yayasanbaitulikhlaspeduliyatim.vercel.app";
  
  const { data: article } = await supabase
    .from("articles")
    .select("title, content, image_url")
    .eq("slug", resolvedParams.slug)
    .eq("status", "published")
    .single();

  if (!article) {
    return {
      title: "Artikel Tidak Ditemukan - Yayasan Baitul Ikhlas",
    };
  }

  const shortDescription = article.content 
    ? article.content.substring(0, 140).replace(/[#*`_]/g, "") + "..."
    : "Menebar kebaikan, memurnikan keikhlasan demi Anak Yatim.";

  // Pastikan file ini ada di folder /public dan ukurannya di bawah 200KB
  const imageUrl = article.image_url || `${baseUrl}/default-share-image.png`;

  return {
    title: `${article.title} | Yayasan Baitul Ikhlas`,
    description: shortDescription,
    
    // Menyediakan tag metadata dasar yang sangat disukai WhatsApp
    alternates: {
      canonical: `${baseUrl}/artikel/${resolvedParams.slug}`,
    },

    openGraph: {
      title: article.title,
      description: shortDescription,
      type: "article",
      url: `${baseUrl}/artikel/${resolvedParams.slug}`,
      siteName: "Yayasan Baitul Ikhlas",
      images: [
        {
          url: imageUrl,
          width: 1200,      // Menegaskan ukuran ke WhatsApp agar layout langsung terbentuk
          height: 630,     // Menegaskan ukuran ke WhatsApp
          type: "image/png", // Sesuaikan jika gambar default Anda .jpg (ganti jadi image/jpeg)
          alt: article.title,
        },
      ],
    },
    
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: shortDescription,
      images: [imageUrl],
    },
  };
}

export default async function DetailArtikelPage({ params }: Props) {
  const resolvedParams = await params;

  const { data: article, error } = await supabase
    .from("articles")
    .select("id, title, content, image_url, created_at")
    .eq("slug", resolvedParams.slug)
    .eq("status", "published")
    .single();

  if (error || !article) {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-white font-sans antialiased text-gray-900 pb-20">
      <Topbar />

      <main className="container mx-auto px-4 max-w-3xl mt-6 sm:mt-10">
        <article className="space-y-6">
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

          {article.image_url && (
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="pt-4 border-t border-gray-100">
            <div className="border-l-4 border-slate-400 pl-4 text-left text-base text-gray-800 leading-relaxed space-y-5 whitespace-pre-line break-words font-normal">
              {article.content}
            </div>
          </div>
        </article>

        <DetailArtikelClient articleTitle={article.title} />

        <footer className="mt-8 pt-6 border-t border-gray-100">
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
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