'use client';

import React, { useEffect, useState } from 'react';
import { 
  DollarSign, 
  Clock, 
  HeartHandshake, 
  Calendar, 
  FileText, 
  Users,
  CheckCircle2, 
  XCircle,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

interface StatsData {
  totalCollected: number;
  totalPending: number;
  activePrograms: number;
  publishedArticles: number;
  activeCampaigns: number;
  totalDonors: number;
}

interface RecentDonation {
  id: string;
  donor_name: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'rejected';
  created_at: string;
  campaigns: { title: string } | null;
}

export default function DashboardStatsPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [recentDonations, setRecentDonations] = useState<RecentDonation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getDashboardData() {
      try {
        const response = await fetch('/api/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data.stats);
          setRecentDonations(data.recentDonations);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    }
    getDashboardData();
  }, []);

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-gray-500">Sinkronisasi data panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Welcome Heading */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Ringkasan Data Yayasan</h1>
        <p className="text-sm text-gray-500 mt-1">
          Berikut adalah performa real-time operasional dari Baitul Ikhlas.
        </p>
      </div>

      {/* Grid Utama Grid 1 - Finansial & Donatur */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card: Total Terkumpul */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm flex items-center space-x-4">
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Donasi Terkumpul</span>
            <span className="text-xl font-bold text-gray-900 block mt-0.5">
              {formatIDR(stats?.totalCollected || 0)}
            </span>
          </div>
        </div>

        {/* Card: Donasi Pending */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm flex items-center space-x-4">
          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Donasi Tertunda</span>
            <span className="text-xl font-bold text-gray-900 block mt-0.5">
              {formatIDR(stats?.totalPending || 0)}
            </span>
          </div>
        </div>

        {/* Card: Total Donatur */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm flex items-center space-x-4 sm:col-span-2 lg:col-span-1">
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Total Transaksi</span>
            <span className="text-xl font-bold text-gray-900 block mt-0.5">
              {stats?.totalDonors} Transaksi Masuk
            </span>
          </div>
        </div>
      </div>

      {/* Grid Kedua - Konten & Program */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Sub-Card: Campaigns */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-lg"><HeartHandshake className="w-5 h-5" /></div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">{stats?.activeCampaigns}</h4>
              <p className="text-xs text-gray-400 font-medium">Campaign Aktif</p>
            </div>
          </div>
          <Link href="/admin/dashboard/campaign" className="text-gray-400 hover:text-blue-600 transition-colors">
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Sub-Card: Program */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg"><Calendar className="w-5 h-5" /></div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">{stats?.activePrograms}</h4>
              <p className="text-xs text-gray-400 font-medium">Program Kerja</p>
            </div>
          </div>
          <Link href="/admin/dashboard/program" className="text-gray-400 hover:text-blue-600 transition-colors">
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Sub-Card: Artikel */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-sky-50 text-sky-600 rounded-lg"><FileText className="w-5 h-5" /></div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">{stats?.publishedArticles}</h4>
              <p className="text-xs text-gray-400 font-medium">Artikel Terbit</p>
            </div>
          </div>
          <Link href="/admin/dashboard/artikel" className="text-gray-400 hover:text-blue-600 transition-colors">
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Section: Tabel Aktivitas Donasi Terbaru */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900">Donasi Masuk Terbaru</h2>
            <p className="text-xs text-gray-400 mt-0.5">Daftar 5 transaksi terakhir dari para donatur.</p>
          </div>
          <Link 
            href="/admin/dashboard/data-donasi" 
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/80 px-3 py-1.5 rounded-lg transition-all"
          >
            Lihat Semua
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70 text-[11px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100">
                <th className="p-4 pl-6">Nama Donatur</th>
                <th className="p-4">Ditujukan Untuk</th>
                <th className="p-4">Nominal</th>
                <th className="p-4">Waktu</th>
                <th className="p-4 pr-6 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-600">
              {recentDonations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400 font-medium">
                    Belum ada riwayat donasi tercatat.
                  </td>
                </tr>
              ) : (
                recentDonations.map((donation) => (
                  <tr key={donation.id} className="hover:bg-gray-50/40 transition-colors">
                    <td className="p-4 pl-6 font-semibold text-gray-900">{donation.donor_name}</td>
                    <td className="p-4 text-gray-500 max-w-[200px] truncate">
                      {donation.campaigns?.title || <span className="text-gray-400 italic text-xs">Donasi Umum</span>}
                    </td>
                    <td className="p-4 font-bold text-gray-900">{formatIDR(donation.amount)}</td>
                    <td className="p-4 text-xs text-gray-400">
                      {new Date(donation.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="p-4 pr-6">
                      <div className="flex justify-center">
                        {donation.status === 'confirmed' && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5" /> <span>Berhasil</span>
                          </span>
                        )}
                        {donation.status === 'pending' && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full">
                            <Clock className="w-3.5 h-3.5" /> <span>Pending</span>
                          </span>
                        )}
                        {donation.status === 'rejected' && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-red-50 text-red-700 text-xs font-semibold rounded-full">
                            <XCircle className="w-3.5 h-3.5" /> <span>Ditolak</span>
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}