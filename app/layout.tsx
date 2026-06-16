import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Inisialisasi Font dengan Best Practice Next.js
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Mempercepat render teks (SEO & Core Web Vitals friendly)
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// Konfigurasi Viewport terpisah (Standar Next.js Terbaru)
export const viewport: Viewport = {
  themeColor: "#0284c7", // Warna tema browser (misal: Sky Blue sesuai identitas yayasan)
  width: "device-width",
  initialScale: 1,
};

// SEO Metadata Lengkap (Sangat Bagus untuk Search Engine & Sosial Media)
export const metadata: Metadata = {
  title: {
    default: "Yayasan Baitul Ikhlas Peduli Yatim",
    template: "%s | Yayasan Baitul Ikhlas", // Mengizinkan halaman sub-menu mengubah title dinamis (cth: "Donasi | Yayasan Baitul Ikhlas")
  },
  description: "Lembaga sosial yang berkomitmen untuk membahagiakan, mengasuh, dan memberdayakan anak-anak yatim dan piatu",
 verification: {
    google: "WvItYbOQve4oCwAfIDp1r9eWBo1tW4KZY3r-SlfbXAc",
  },
  keywords: ["yayasan yatim", "baitul ikhlas", "peduli yatim", "donasi yatim", "lembaga sosial", "amal"],
  authors: [{ name: "Yayasan Baitul Ikhlas" }],
  metadataBase: new URL("https://yayasanbaitulikhlass.vercel.app"), // Ganti dengan domain asli Anda nanti
  alternates: {
    canonical: "/",
  },
  // Open Graph untuk WhatsApp, Facebook, LinkedIn
  openGraph: {
    title: "Yayasan Baitul Ikhlas Peduli Yatim",
    description: "Lembaga sosial yang berkomitmen untuk membahagiakan anak-anak yatim.",
    url: "https://yayasanbaitulikhlass.vercel.app",
    siteName: "Yayasan Baitul Ikhlas",
    locale: "id_ID",
    type: "website",
    // images: [{ url: '/images/og-image.jpg', width: 1200, height: 630, alt: 'Yayasan Baitul Ikhlas' }] // Opsional: Tambahkan jika ada banner
  },
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Yayasan Baitul Ikhlas Peduli Yatim",
    description: "Lembaga sosial yang berkomitmen untuk membahagiakan anak-anak yatim.",
  },
  // Mengatur Favicon secara Best Practice
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png", // Opsional jika ada
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth`} // Menggunakan scroll-smooth bawaan tailwind untuk UX yang lebih baik
    >
      <head>
       <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" 
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" 
          crossOrigin="anonymous" 
          referrerPolicy="no-referrer" 
        />
      </head>
      <body className="min-h-full bg-slate-50 text-slate-900 antialiased flex flex-col font-sans">
        {/* Main content wrapper */}
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}