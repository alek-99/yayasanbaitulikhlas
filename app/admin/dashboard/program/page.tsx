'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Image as ImageIcon,
  Upload
} from 'lucide-react';

interface Program {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  category: string;
  status: 'active' | 'inactive';
  created_at: string;
}

export default function ProgramPage() {
  // State Utama Data
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // State Modal (Tambah / Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // State Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Umum');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  
  // State Khusus Upload Gambar
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Notifikasi
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // ============================================
  // 1. READ (Ambil Data dari Supabase)
  // ============================================
  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPrograms(data || []);
    } catch (error: any) {
      console.error('Fetch Error:', error);
      showToast(error.message || 'Gagal mengambil data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // LOGIKA UPLOAD GAMBAR KE SUPABASE STORAGE
  // ============================================
  const uploadImageProcess = async (file: File): Promise<string | null> => {
    try {
      // Membuat nama file unik (Mencegah duplikasi nama file di storage)
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `program-covers/${fileName}`;

      // Upload ke bucket bernama 'program-images'
      const { error: uploadError } = await supabase.storage
        .from('program-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Ambil Public URL dari file yang diupload
      const { data } = supabase.storage
        .from('program-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error: any) {
      console.error('Storage Upload Error:', error);
      throw new Error(`Gagal upload gambar: ${error.message}`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      // Membuat preview gambar sementara di client side
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ============================================
  // 2. CREATE & UPDATE (Simpan / Edit Data)
  // ============================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showToast('Judul dan Deskripsi wajib diisi!', 'error');
      return;
    }

    try {
      setSubmitLoading(true);
      const nowISO = new Date().toISOString();
      let finalImageUrl = existingImageUrl;

      // Jika ada file baru yang dipilih, lakukan proses upload terlebih dahulu
      if (imageFile) {
        finalImageUrl = await uploadImageProcess(imageFile);
      }

      if (isEditing && currentId) {
        // PROSES UPDATE
        const payloadUpdate = {
          title: title.trim(),
          description: description.trim(),
          image_url: finalImageUrl,
          category,
          status,
          updated_at: nowISO
        };

        const { error } = await supabase
          .from('programs')
          .update(payloadUpdate)
          .eq('id', currentId);
        
        if (error) throw error;
        showToast('Program berhasil diperbarui!', 'success');
      } else {
        // PROSES CREATE / INSERT
        const payloadInsert = {
          title: title.trim(),
          description: description.trim(),
          image_url: finalImageUrl,
          category,
          status,
          created_at: nowISO,
          updated_at: nowISO
        };

        const { error } = await supabase
          .from('programs')
          .insert([payloadInsert]);

        if (error) throw error;
        showToast('Program baru berhasil ditambahkan!', 'success');
      }

      closeModal();
      fetchPrograms();
    } catch (error: any) {
      console.error('Submit Error:', error);
      showToast(error.message || 'Terjadi kesalahan sistem', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  // ============================================
  // 3. DELETE (Hapus Data)
  // ============================================
  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus program ini secara permanen?')) {
      try {
        const { error } = await supabase
          .from('programs')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        showToast('Program berhasil dihapus', 'success');
        fetchPrograms();
      } catch (error: any) {
        showToast(error.message || 'Gagal menghapus data', 'error');
      }
    }
  };

  const openEditModal = (program: Program) => {
    setIsEditing(true);
    setCurrentId(program.id);
    setTitle(program.title);
    setDescription(program.description);
    setExistingImageUrl(program.image_url);
    setImagePreview(program.image_url); // Tampilkan gambar yang sudah ada sebagai preview
    setCategory(program.category);
    setStatus(program.status);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setCurrentId(null);
    setTitle('');
    setDescription('');
    setImageFile(null);
    setImagePreview(null);
    setExistingImageUrl(null);
    setCategory('Umum');
    setStatus('active');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const filteredPrograms = programs.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 relative p-6 max-w-7xl mx-auto">
              
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-20 right-6 z-50 flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm max-w-md transition-all animate-in fade-in slide-in-from-top-4 ${
          toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <p className="font-semibold">{toast.type === 'success' ? 'Berhasil' : 'Terjadi Kesalahan'}</p>
            <p className="text-xs opacity-90 mt-0.5 break-words">{toast.message}</p>
          </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Manajemen Program</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola program yayasan, kegiatan sosial, dan penyaluran bantuan.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-xl text-sm transition-all shadow-sm hover:shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Program</span>
        </button>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama program atau kategori..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50/50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* MAIN DATA TABLE */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-gray-400 gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <p className="text-sm font-medium">Memuat data dari database...</p>
          </div>
        ) : filteredPrograms.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <p className="text-sm font-medium">Tidak ada program ditemukan.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  <th className="px-6 py-4">Program</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Tanggal Dibuat</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
                {filteredPrograms.map((program) => (
                  <tr key={program.id} className="hover:bg-gray-50/40 transition-colors">
                    <td className="px-6 py-4 max-w-sm">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center text-gray-400">
                          {program.image_url ? (
                            <img src={program.image_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-5 h-5 stroke-[1.5]" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{program.title}</p>
                          <p className="text-xs text-gray-400 truncate mt-0.5">{program.description}</p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-md">
                        {program.category}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                        program.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${program.status === 'active' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                        {program.status === 'active' ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs text-gray-400">
                      {program.created_at ? new Date(program.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      }) : '-'}
                    </td>

                    <td className="px-6 py-4 text-right space-x-1">
                      <button 
                        onClick={() => openEditModal(program)}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Ubah Program"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(program.id)}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus Program"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL COMPONENT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={closeModal}></div>
          
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-lg z-10 overflow-hidden transform animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">
                {isEditing ? 'Ubah Informasi Program' : 'Buat Program Baru'}
              </h3>
              <button onClick={closeModal} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Nama Program *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Santunan Anak Yatim Berprestasi"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Kategori</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-blue-500 transition-all"
                  >
                    <option value="Umum">Umum</option>
                    <option value="Pendidikan">Pendidikan</option>
                    <option value="Kesehatan">Kesehatan</option>
                    <option value="Kemanusiaan">Kemanusiaan</option>
                    <option value="Keagamaan">Keagamaan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Status Sistem</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
                    className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-blue-500 transition-all"
                  >
                    <option value="active">Aktif (Tampil)</option>
                    <option value="inactive">Nonaktif (Sembunyi)</option>
                  </select>
                </div>
              </div>

              {/* INPUT UPLOAD GAMBAR BARU */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Gambar Sampul Program</label>
                
                <div className="mt-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors relative group">
                  {imagePreview ? (
                    <div className="w-full relative flex flex-col items-center">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="h-40 w-full object-cover rounded-lg border border-gray-200 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-gray-900/70 text-white rounded-full hover:bg-gray-900 transition-colors"
                        title="Hapus gambar"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center justify-center space-y-2 py-4 w-full">
                      <div className="p-3 bg-white rounded-full shadow-sm border border-gray-100 group-hover:scale-105 transition-transform">
                        <Upload className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-700">Klik untuk upload gambar</p>
                        <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, JPEG up to 5MB</p>
                      </div>
                    </label>
                  )}
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="program-image-upload"
                  />
                  {!imagePreview && (
                    <label htmlFor="program-image-upload" className="absolute inset-0 cursor-pointer" />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Deskripsi Lengkap *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tuliskan latar belakang, tujuan, dan target dari pelaksanaan program ini..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-all resize-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2 border-t border-gray-100 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium px-4 py-2 rounded-lg text-sm transition-all shadow-sm"
                >
                  {submitLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isEditing ? 'Simpan Perubahan' : 'Publish Program'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}