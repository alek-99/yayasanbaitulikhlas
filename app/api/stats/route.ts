import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

export async function GET() {
  // 🚀 PERBAIKAN CRITICAL: Bypass jika supabase client belum siap saat proses build time Vercel
  if (!supabase) {
    console.warn("Bypass query: Supabase client belum terinisialisasi.");
    return NextResponse.json({
      stats: { totalCollected: 0, totalPending: 0, activePrograms: 0, publishedArticles: 0, activeCampaigns: 0, totalDonors: 0 },
      recentDonations: []
    });
  }

  try {
    // 1. Ambil data donasi untuk menghitung akumulasi nominal keuangan
    const { data: donations, error: donationError } = await supabase
      .from('donations')
      .select('amount, status');

    if (donationError) throw donationError;

    const totalCollected = donations?.filter(d => d.status === 'confirmed').reduce((sum, d) => sum + Number(d.amount), 0) || 0;
    const totalPending = donations?.filter(d => d.status === 'pending').reduce((sum, d) => sum + Number(d.amount), 0) || 0;

    // 2. Hitung jumlah baris data aktif dari tabel lain secara paralel
    const [programsCount, articlesCount, campaignsCount, messagesCount] = await Promise.all([
      supabase.from('programs').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'published'),
      supabase.from('campaigns').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('donations').select('*', { count: 'exact', head: true }) // Total donatur terdaftar
    ]);

    // 3. Ambil 5 riwayat transaksi donasi paling baru masuk beserta nama campaign-nya
    const { data: recentDonations, error: recentError } = await supabase
      .from('donations')
      .select('id, donor_name, amount, status, created_at, campaigns(title)')
      .order('created_at', { ascending: false })
      .limit(5);

    if (recentError) throw recentError;

    return NextResponse.json({
      stats: {
        totalCollected,
        totalPending,
        activePrograms: programsCount.count || 0,
        publishedArticles: articlesCount.count || 0,
        activeCampaigns: campaignsCount.count || 0,
        totalDonors: messagesCount.count || 0,
      },
      recentDonations: recentDonations || [],
    });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}