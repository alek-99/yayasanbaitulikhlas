'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient'; 
import { 
  PlusCircle, 
  Edit3, 
  Trash2, 
  Heading, 
  Link2, 
  FileText, 
  Image as ImageIcon, 
  Layers, 
  CheckCircle, 
  XCircle,
  Loader2,
  FileSpreadsheet
} from 'lucide-react';

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  image_url: string | null;
  author: string;
  status: 'draft' | 'published';
  created_at: string;
}

export default function ArtikelPage() {
  // State List & Loading
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // State Form Input
  const [id, setId] = useState<string | null>(null); 
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
  };

  // 1. READ (Ambil Data Artikel dari Database)
  const fetchArticles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      alert('Gagal mengambil data: ' + error.message);
    } else if (data) {
      setArticles(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // 2. UPLOAD IMAGE (Menggunakan Bucket 'artikel-image')
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) {
        throw new Error('Pilih file gambar terlebih dahulu.');
      }

      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `banners/${fileName}`; // Menyimpan di dalam folder 'banners' di dalam bucket

      // PENTING: Menggunakan nama bucket 'artikel-image'
      const { error: uploadError } = await supabase.storage
        .from('artikel-image') 
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Ambil Public URL dari bucket 'artikel-image'
      const { data } = supabase.storage.from('artikel-image').getPublicUrl(filePath);
      
      if (!data?.publicUrl) {
        throw new Error('Gagal mendapatkan URL Publik Gambar.');
      }

      setImageUrl(data.publicUrl);
    } catch (error: any) {
      console.error(error);
      alert('Error uploading image: ' + (error.message || 'Pastikan kebijakan RLS Storage Anda sudah disetel ke publik.'));
    } finally {
      setUploading(false);
    }
  };

  // 3. CREATE & UPDATE
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title,
      slug,
      content,
      excerpt: excerpt || null,
      image_url: imageUrl || null,
      status,
      updated_at: new Date().toISOString(),
    };

    if (id) {
      const { error } = await supabase
        .from('articles')
        .update(payload)
        .eq('id', id);

      if (error) alert('Gagal mengupdate artikel: ' + error.message);
      else alert('Artikel berhasil diperbarui!');
    } else {
      const { error } = await supabase
        .from('articles')
        .insert([payload]);

      if (error) alert('Gagal menambah artikel: ' + error.message);
      else alert('Artikel berhasil ditambahkan!');
    }

    resetForm();
    fetchArticles();
  };

  const handleEdit = (article: Article) => {
    setId(article.id);
    setTitle(article.title);
    setSlug(article.slug);
    setContent(article.content);
    setExcerpt(article.excerpt || '');
    setImageUrl(article.image_url || '');
    setStatus(article.status);
  };

  // 4. DELETE
  const handleDelete = async (articleId: string) => {
    if (confirm('Apakah kamu yakin ingin menghapus artikel ini?')) {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', articleId);

      if (error) alert('Gagal menghapus: ' + error.message);
      else {
        alert('Artikel berhasil dihapus!');
        fetchArticles();
      }
    }
  };

  const resetForm = () => {
    setId(null);
    setTitle('');
    setSlug('');
    setContent('');
    setExcerpt('');
    setImageUrl('');
    setStatus('draft');
  };

  return (
    <div className="space-y-8 font-sans antialiased bg-gray-50 text-gray-900 min-h-screen">
      <div className="flex items-center space-x-3 mb-6">
        <FileSpreadsheet className="h-8 w-8 text-indigo-600" />
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Admin - Manajemen Artikel</h2>
      </div>
      <hr className="mb-8 border-gray-200" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* ================= FORM SECTION ================= */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 mb-6 border-b pb-3">
            {id ? (
              <>
                <Edit3 className="h-5 w-5 text-amber-500" />
                <h3 className="text-lg font-semibold text-gray-800">Edit Artikel</h3>
              </>
            ) : (
              <>
                <PlusCircle className="h-5 w-5 text-indigo-500" />
                <h3 className="text-lg font-semibold text-gray-800">Tambah Artikel Baru</h3>
              </>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Judul */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
                <Heading className="h-4 w-4 mr-2 text-gray-400" /> Judul
              </label>
              <input 
                type="text" 
                value={title} 
                onChange={handleTitleChange} 
                required 
                placeholder="Masukkan judul artikel..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
                <Link2 className="h-4 w-4 mr-2 text-gray-400" /> Slug (Otomatis)
              </label>
              <input 
                type="text" 
                value={slug} 
                onChange={(e) => setSlug(e.target.value)} 
                required 
                placeholder="slug-otomatis-terisi"
                className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-lg focus:outline-none text-sm cursor-not-allowed"
                readOnly
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
                <FileText className="h-4 w-4 mr-2 text-gray-400" /> Kutipan (Excerpt)
              </label>
              <input 
                type="text" 
                value={excerpt} 
                onChange={(e) => setExcerpt(e.target.value)} 
                placeholder="Ringkasan singkat artikel..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition"
              />
            </div>

            {/* Upload Image */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
                <ImageIcon className="h-4 w-4 mr-2 text-gray-400" /> Banner Artikel
              </label>
              <div className="mt-1 flex flex-col items-center justify-center px-4 py-4 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 hover:bg-gray-100 transition relative">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  disabled={uploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                {uploading ? (
                  <div className="flex flex-col items-center space-y-2">
                    <Loader2 className="h-6 w-6 text-indigo-500 animate-spin" />
                    <p className="text-xs text-gray-500">Mengunggah gambar...</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-xs text-gray-600 font-semibold">Klik untuk upload gambar</p>
                    <p className="text-[10px] text-gray-400 mt-1">PNG, JPG, WebP up to 5MB</p>
                  </div>
                )}
              </div>

              {imageUrl && (
                <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-xs text-green-700 font-medium mb-1.5 flex items-center">
                    <CheckCircle className="h-3.5 w-3.5 mr-1" /> Gambar berhasil terpilih:
                  </p>
                  <img src={imageUrl} alt="Preview" className="w-full h-32 object-cover rounded-md shadow-sm" />
                </div>
              )}
            </div>

            {/* Konten */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
                <FileText className="h-4 w-4 mr-2 text-gray-400" /> Konten Utama
              </label>
              <textarea 
                rows={5} 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                required 
                placeholder="Tulis isi konten artikel di sini..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition resize-y"
              ></textarea>
            </div>

            {/* Status */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
                <Layers className="h-4 w-4 mr-2 text-gray-400" /> Status Penerbitan
              </label>
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition"
              >
                <option value="draft">📁 Draft (Simpan Internal)</option>
                <option value="published">🚀 Published (Publikasikan)</option>
              </select>
            </div>

            {/* Tombol Aksi Form */}
            <div className="flex gap-3 pt-2">
              <button 
                type="submit" 
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg text-sm shadow-sm transition flex items-center justify-center space-x-2"
              >
                {id ? <Edit3 className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
                <span>{id ? 'Perbarui' : 'Simpan Artikel'}</span>
              </button>
              {id && (
                <button 
                  type="button" 
                  onClick={resetForm} 
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg text-sm transition flex items-center justify-center space-x-2"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Batal</span>
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ================= TABLE LIST SECTION ================= */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <FileSpreadsheet className="h-5 w-5 mr-2 text-indigo-500" /> Daftar Artikel ({articles.length})
            </h3>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
              <p className="text-sm text-gray-500">Memuat data dari database...</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p className="text-sm">Belum ada artikel yang tersedia.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-4">Gambar</th>
                    <th className="px-6 py-4">Judul / Slug</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {articles.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-50/70 transition">
                      {/* Image cell */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {article.image_url ? (
                          <img 
                            src={article.image_url} 
                            alt={article.title} 
                            className="w-16 h-10 object-cover rounded-md shadow-sm border border-gray-200" 
                          />
                        ) : (
                          <div className="w-16 h-10 bg-gray-100 rounded-md flex items-center justify-center border border-gray-200">
                            <ImageIcon className="h-4 w-4 text-gray-400" />
                          </div>
                        )}
                      </td>
                      {/* Title & Slug Cell */}
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-800 line-clamp-1">{article.title}</div>
                        <div className="text-xs text-gray-400 font-mono mt-0.5 max-w-xs truncate">{article.slug}</div>
                      </td>
                      {/* Status Cell */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          article.status === 'published' 
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                            : 'bg-gray-100 border-gray-200 text-gray-600'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
                            article.status === 'published' ? 'bg-emerald-500' : 'bg-gray-400'
                          }`}></span>
                          {article.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      {/* Action Cell */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => handleEdit(article)} 
                            className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-md transition shadow-sm"
                            title="Edit Artikel"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(article.id)} 
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-md transition shadow-sm"
                            title="Hapus Artikel"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}