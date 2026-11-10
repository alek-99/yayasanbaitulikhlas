# Website Yayasan Baitul Ikhlas

> "Teknologi bukan sekadar tentang membangun sistem, tetapi tentang menciptakan perubahan dan menghadirkan manfaat bagi sesama."

<p align="center">
  <strong>Digital Platform for Information, Programs, and Social Contributions</strong>
  <br />
  <br />
  <a href="https://github.com/alek-99/yayasanbaitulikhlas">
    <img src="https://img.shields.io/github/stars/alek-99/yayasanbaitulikhlas?style=for-the-badge&color=2563eb" alt="GitHub Stars" />
  </a>
  <a href="https://github.com/alek-99/yayasanbaitulikhlas">
    <img src="https://img.shields.io/github/forks/alek-99/yayasanbaitulikhlas?style=for-the-badge&color=2563eb" alt="GitHub Forks" />
  </a>
  <a href="https://github.com/alek-99/yayasanbaitulikhlas">
    <img src="https://img.shields.io/github/license/alek-99/yayasanbaitulikhlas?style=for-the-badge" alt="License" />
  </a>
</p>

---

## About The Project

Website Yayasan Baitul Ikhlas merupakan platform informasi dan manajemen yayasan berbasis web yang dikembangkan untuk mendukung pengelolaan informasi, program sosial, campaign penggalangan dana, serta dokumentasi kegiatan donasi secara digital.

Sistem ini dilengkapi dengan dashboard administrator yang memungkinkan pengelolaan konten website secara terintegrasi, sehingga informasi yayasan dapat diperbarui dengan lebih mudah, efektif, dan terstruktur.

Proyek ini menggunakan Next.js, TypeScript, Tailwind CSS, dan Supabase sebagai teknologi utama dengan pendekatan desain minimalis, modern, dan responsif.

## Project Information

| Detail | Keterangan |
|---|---|
| Project | Website Yayasan Baitul Ikhlas |
| Repository | GitHub |
| Framework | Next.js App Router |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Backend | Supabase |
| Database | PostgreSQL |
| Authentication | Supabase Auth |
| Security | Cloudflare Turnstile |
| Deployment | Previously Deployed |
| User Role | Administrator |

## Main Features

### Administrator Dashboard
- Dashboard responsif dan informatif.
- Ringkasan statistik pengelolaan yayasan.
- Navigasi pengelolaan sistem yang terintegrasi.
- Manajemen konten melalui satu dashboard.

### Content Management System

| Modul | Fitur |
|---|---|
| Berita | Create, Read, Update, Delete berita |
| Campaign | Pengelolaan campaign penggalangan dana |
| Donasi | Pengelolaan data donasi |
| Dokumentasi | Dokumentasi penyaluran dan kegiatan donasi |
| Program | Pengelolaan program kerja yayasan |
| Landing Page | Pengelolaan konten halaman utama |
| Pesan Masuk | Pengelolaan pesan dari pengunjung |

### Authentication & Security
- Login khusus administrator.
- Autentikasi menggunakan Supabase Auth.
- Integrasi Cloudflare Turnstile.
- Proteksi form login dari bot.
- Proteksi form pesan pengunjung.
- Validasi akses administrator.

### SEO Optimization
- Basic SEO configuration.
- Dynamic metadata.
- SEO-friendly URL.
- Open Graph metadata.
- Sitemap dan robots.txt.
- Optimasi struktur halaman.

## Technology Stack

| Technology | Usage |
|---|---|
| Next.js | Full-stack React framework |
| TypeScript | Type-safe development |
| Tailwind CSS | Responsive UI styling |
| Supabase | Backend services |
| PostgreSQL | Relational database |
| Supabase Auth | User authentication |
| Cloudflare | Website security |
| Cloudflare Turnstile | Bot protection |
| Vercel | Deployment platform |

## Project Structure

```text
project/
├── app/
│   ├── (auth)/
│   │   └── login/
│   ├── (dashboard)/
│   │   └── admin/
│   ├── (website)/
│   │   └── ...
│   ├── api/
│   ├── layout.tsx
│   └── page.tsx
├── components/
├── lib/
│   └── supabase/
├── public/
├── types/
├── .env.local
├── next.config.ts
└── package.json
```

*Struktur tersebut merupakan gambaran arsitektur yang disarankan dan perlu disesuaikan dengan implementasi repository.*

## Getting Started

### 1. Clone Repository

```bash
git clone https://github.com/alek-99/yayasanbaitulikhlas.git
```

### 2. Navigate to Project

```bash
cd yayasanbaitulikhlas
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Environment Configuration

Buat file `.env.local` pada direktori utama.

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
```

Sesuaikan nilai environment dengan konfigurasi Supabase dan Cloudflare yang digunakan.

### 5. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) melalui browser.

## Project Background

Website ini sebelumnya telah dikembangkan dan berhasil dideploy. Namun, karena belum adanya pengelolaan serta pemeliharaan sistem secara berkala, database Supabase yang digunakan mengalami suspend.

Kondisi tersebut menjadi dasar evaluasi untuk melakukan pengembangan kembali, terutama pada aspek desain, performa, keamanan, optimasi SEO, serta keberlanjutan pengelolaan sistem.

## Future Development

### UI/UX Redesign
- Pembaruan desain menjadi lebih modern dan minimalis.
- Penyempurnaan dashboard administrator.
- Peningkatan responsivitas seluruh halaman.
- Optimalisasi pengalaman pengguna.

### SEO Enhancement
- Optimasi SEO On-Page.
- Implementasi Schema.org Structured Data.
- Integrasi Google Search Console.
- Optimasi Core Web Vitals.
- Pengembangan sitemap dan robots.txt.

### Feature Enhancement
- Statistik donasi dan campaign.
- Grafik perkembangan donasi.
- Riwayat transaksi donasi.
- Kategori berita dan program.
- Pencarian dan filter data.
- Notifikasi pesan masuk.
- Pengelolaan profil yayasan.

### System Improvement
- Pemulihan dan optimalisasi database Supabase.
- Evaluasi struktur database.
- Implementasi backup berkala.
- Audit keamanan Row Level Security (RLS).
- Optimasi database query.
- Monitoring sistem secara berkala.

## Project Goals

Mewujudkan platform digital yayasan yang profesional, aman, mudah dikelola, serta mampu meningkatkan transparansi informasi dan kegiatan sosial kepada masyarakat.

---

## Support This Project

Jika proyek ini bermanfaat atau menarik bagi Anda, dukung pengembangannya dengan memberikan **Star** pada repository GitHub.

Setiap dukungan sangat berarti untuk membantu proyek ini terus berkembang dan menjadi lebih baik.

<p align="center">
  <a href="https://github.com/alek-99/yayasanbaitulikhlas">
    <img src="https://img.shields.io/badge/Star%20This%20Repository-GitHub-181717?style=for-the-badge&logo=github" alt="Star on GitHub" />
  </a>
</p>

<p align="center">
  <i>"Great things are built by people who believe that small contributions can create meaningful impact."</i>
</p>

---

<p align="center">
  <strong>Yayasan Baitul Ikhlas</strong>
  <br />
  Building Digital Solutions, Creating Meaningful Impact.
</p>
