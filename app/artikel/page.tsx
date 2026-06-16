'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Calendar, User, ArrowLeft, BookOpen, Search } from 'lucide-react';
import Link from 'next/link';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  image_url: string | null;
  created_at: string;
}

export default function SemuaArtikelPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllArticles = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('articles')
          .select('id, title, slug, excerpt, image_url, created_at')
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) {
          setArticles(data);
          setFilteredArticles(data);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllArticles();
  }, []);

  // Fungsi Pencarian Real-time
  useEffect(() => {
    const filtered = articles.filter((article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.excerpt && article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredArticles(filtered);
  }, [searchQuery, articles]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans antialiased text-gray-900 pb-16">
      {/* Top Banner / Header */}
      <header className="bg-white border-b border-gray-200/80 sticky top-0 z-10">
        <div className="container mx-auto px-4 max-w-7xl h-16 flex items-center justify-between gap-4">
          <Link 
            href="/" 
            className="inline-flex items-center space-x-2 text-xs font-bold text-gray-600 hover:text-blue-600 transition shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Kembali ke Beranda</span>
          </Link>
          <h1 className="text-sm font-bold tracking-wide uppercase text-gray-800 truncate">
            Arsip Artikel & Berita
          </h1>
          <div className="w-20 sm:w-28"></div> {/* Spacer balance */}
        </div>
      </header>

      <main className="container mx-auto px-4 max-w-7xl mt-8">
        {/* Judul & Search Bar */}
        <div className="flex flex-col space-y-4 mb-8 md:flex-row md:justify-between md:items-center md:space-y-0">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Semua Artikel</h2>
            <p className="text-xs text-gray-500 mt-1 sm:text-sm">Menampilkan berita, laporan, dan edukasi dari Baitul Ikhlas.</p>
          </div>
          
          {/* Search Input */}
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari artikel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>
        </div>

        {/* Status Loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-9 h-9 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-xs text-gray-500">Menyelaraskan data...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center bg-white border border-gray-100 rounded-2xl py-20 text-gray-400 shadow-sm">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">Artikel tidak ditemukan</p>
            <p className="text-xs text-gray-400 mt-1">Coba gunakan kata kunci pencarian yang lain.</p>
          </div>
        ) : (
          /* Grid Articles (Mobile-First) */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article) => (
              <Link 
                href={`/artikel/${article.slug}`} 
                key={article.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition duration-200 flex flex-col group"
              >
                <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
                  {article.image_url ? (
                    <img 
                      src={article.image_url} 
                      alt={article.title} 
                      className="w-full h-full object-cover transition duration-300 group-hover:scale-102"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <BookOpen className="w-8 h-8 opacity-30" />
                    </div>
                  )}
                </div>
                
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(article.created_at)}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <User className="w-3.5 h-3.5" />
                        <span>Admin</span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-gray-950 tracking-tight line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>
                    
                    <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                      {article.excerpt || 'Klik untuk membaca kelanjutan informasi dan laporan berita lengkap ini.'}
                    </p>
                  </div>

                  <div className="text-xs font-bold text-blue-600 pt-2 border-t border-gray-50 flex items-center space-x-1">
                    <span>Baca Selengkapnya</span>
                    <span>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}