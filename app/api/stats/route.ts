import { NextRequest, NextResponse } from 'next/server';
import { createClientForMiddleware } from '@/lib/supabaseServer'; 
import { isSupabaseConfigured } from '@/lib/supabaseClient'; 

export const dynamic = 'force-dynamic';

// 1. Definisikan struktur data donasi untuk TypeScript agar aman saat proses looping (filter/reduce)
interface DonationRow {
  amount: number | string;
  status: string;
}

export async function GET(request: NextRequest) {
  // 🚀 BYPASS AMAN: Jika env belum siap (seperti saat build time di Vercel), langsung return data kosong
  if (!isSupabaseConfigured()) {
    console.warn("Bypass query: Supabase environment variables belum siap.");
    return NextResponse.json({
      stats: { totalCollected: 0, totalPending: 0, activePrograms: 0, publishedArticles: 0, activeCampaigns: 0, totalDonors: 0 },
      recentDonations: []
    });
  }

  // Gunakan server client dari helper supabaseServer Anda
  const { supabaseServer } = createClientForMiddleware(request);

  try {
    // 1. Ambil data donasi untuk menghitung akumulasi nominal keuangan
    const { data: donations, error: donationError } = await supabaseServer
      .from('donations')
      .select('amount, status');

    if (donationError) throw donationError;

    // 🌟 TYPE CASTING: Tegaskan tipe data ke TypeScript agar tidak dianggap 'any'
    const donationsData = donations as DonationRow[] | null;

    const totalCollected = donationsData?.filter((d: DonationRow) => d.status === 'confirmed')
      .reduce((sum: number, d: DonationRow) => sum + Number(d.amount), 0) || 0;

    const totalPending = donationsData?.filter((d: DonationRow) => d.status === 'pending')
      .reduce((sum: number, d: DonationRow) => sum + Number(d.amount), 0) || 0;

    // 2. Hitung jumlah baris data aktif dari tabel lain secara paralel
    const [programsCount, articlesCount, campaignsCount, messagesCount] = await Promise.all([
      supabaseServer.from('programs').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabaseServer.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'published'),
      supabaseServer.from('campaigns').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabaseServer.from('donations').select('*', { count: 'exact', head: true }) 
    ]);

    // 3. Ambil 5 riwayat transaksi donasi paling baru masuk
    const { data: recentDonations, error: recentError } = await supabaseServer
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