'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Calendar, ArrowRight, BookOpen, Feather } from 'lucide-react';
import Link from 'next/link';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  image_url: string | null;
  created_at: string;
}

function IslamicDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-2">
      <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400" />
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 1 L12.5 7.5 L19 10 L12.5 12.5 L10 19 L7.5 12.5 L1 10 L7.5 7.5 Z" fill="#C9922A" opacity="0.8" />
      </svg>
      <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400" />
    </div>
  );
}

export default function ArticleSection() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestArticles = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('articles')
          .select('id, title, slug, excerpt, image_url, created_at')
          .eq('status', 'published')
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;
        if (data) setArticles(data);
      } catch (error) {
        console.error('Error fetching articles for home:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestArticles();
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  if (loading) {
    return (
      <section className="py-24 bg-[#FBF7F0]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="w-10 h-10 border-3 border-[#0D4A3E] border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderWidth: '3px' }} />
          <p className="text-[#6B8C7D] text-sm font-medium">Memuat artikel terbaru...</p>
        </div>
      </section>
    );
  }

  if (articles.length === 0) return null;

  return (
    <section id="artikel" className="relative py-24 lg:py-32 bg-[#FBF7F0] overflow-hidden">
      {/* Subtle background texture */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="islamic-articles" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <g fill="none" stroke="#0D4A3E" strokeWidth="0.6">
              <polygon points="30,2 58,16 58,44 30,58 2,44 2,16" />
              <circle cx="30" cy="30" r="6" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#islamic-articles)" />
      </svg>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-amber-400" />
            <span className="text-amber-600 font-bold text-xs uppercase tracking-[0.25em]">Wawasan & Berita</span>
            <div className="h-px w-10 bg-amber-400" />
          </div>
          <h2 className="font-serif text-3xl lg:text-4xl xl:text-5xl font-bold text-[#0D4A3E] mb-4 leading-tight">
            Artikel & Kegiatan Terbaru
          </h2>
          <IslamicDivider />
          <p className="text-[#6B8C7D] max-w-2xl mx-auto mt-4 text-base leading-relaxed">
            Ikuti perkembangan program, cerita inspiratif, dan laporan transparansi penyaluran donasi Yayasan Baitul Ikhlas.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, idx) => (
            <article
              key={article.id}
              className="group relative bg-white rounded-[2rem] overflow-hidden border border-amber-100/60 shadow-sm hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-500 flex flex-col"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Gold top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#E8F0EB] shrink-0">
                {article.image_url ? (
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#A0C4B0]">
                    <BookOpen className="w-12 h-12 opacity-30" />
                  </div>
                )}
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D4A3E]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  {/* Date */}
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-amber-600 uppercase tracking-widest">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(article.created_at)}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-[#0D4A3E] leading-snug line-clamp-2 group-hover:text-[#2A6B57] transition-colors duration-300 font-serif sm:text-lg">
                    <Link href={`/artikel/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h3>

                  {/* Excerpt */}
                  <p className="text-xs text-[#6B8C7D] line-clamp-3 leading-relaxed sm:text-sm">
                    {article.excerpt || 'Klik untuk membaca detail artikel dan informasi selengkapnya terkait kegiatan ini.'}
                  </p>
                </div>

                {/* CTA */}
                <div className="pt-5 mt-5 border-t border-amber-100">
                  <Link
                    href={`/artikel/${article.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#0D4A3E] group-hover:text-amber-700 transition-colors duration-300"
                  >
                    <Feather className="w-3.5 h-3.5 opacity-60" />
                    <span>Baca Selengkapnya</span>
                    <ArrowRight className="w-3.5 h-3.5 translate-x-0 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-14">
          <Link
            href="/artikel"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#0D4A3E] to-[#2A6B57] text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-emerald-900/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-sm"
          >
            Lihat Semua Artikel
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}