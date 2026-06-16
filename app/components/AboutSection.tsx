import { CheckCircle, Shield, Award } from "lucide-react";
import Image from "next/image";
import aboutImage from "../../public/images/waqap.jpg";
import Link from 'next/link';

const values = [
  {
    icon: CheckCircle,
    title: "Transparan",
    desc: "Laporan keuangan yang terbuka dan dapat diakses oleh semua donatur setiap saat.",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: Shield,
    title: "Amanah",
    desc: "Dana donasi dikelola dengan penuh tanggung jawab sesuai dengan niat dan tujuan donatur.",
    color: "from-amber-500 to-yellow-600",
  },
  {
    icon: Award,
    title: "Profesional",
    desc: "Dikelola oleh tim berpengalaman dengan standar tata kelola yayasan yang baik.",
    color: "from-teal-600 to-emerald-700",
  },
];

// Islamic geometric motif SVG - Ditambahkan aria-hidden agar ramah SEO & Aksesibilitas
function IslamicPattern() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern id="islamic-about" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="#0D4A3E" strokeWidth="0.8">
            <polygon points="40,2 78,22 78,58 40,78 2,58 2,22" />
            <polygon points="40,14 66,28 66,52 40,66 14,52 14,28" />
            <line x1="40" y1="2" x2="40" y2="14" />
            <line x1="78" y1="22" x2="66" y2="28" />
            <line x1="78" y1="58" x2="66" y2="52" />
            <line x1="40" y1="78" x2="40" y2="66" />
            <line x1="2" y1="58" x2="14" y2="52" />
            <line x1="2" y1="22" x2="14" y2="28" />
            <circle cx="40" cy="40" r="8" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#islamic-about)" />
    </svg>
  );
}

export default function AboutSection() {
  return (
    <section 
      id="tentang" 
      aria-label="Tentang Yayasan Baitul Ikhlas"
      className="relative py-24 lg:py-32 overflow-hidden bg-[#FBF7F0]"
    >
      <IslamicPattern />

      {/* Warm glow accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-amber-100/40 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-emerald-100/30 blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">

          {/* LEFT: Image with decorative frame */}
          <div className="relative">
            {/* Gold ornamental border */}
            <div className="absolute -top-4 -left-4 w-full h-full rounded-3xl border-2 border-amber-400/30 z-0" />
            <div className="absolute -top-8 -left-8 w-2/3 h-2/3 rounded-3xl border border-amber-300/20 z-0" />

            {/* Standardized Aspect Ratio using utility classes */}
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-900/20 aspect-[4/3]">
              <Image
                src={aboutImage}
                alt="Foto Kegiatan Pemberdayaan dan Donasi Anak Yatim di Yayasan Baitul Ikhlas Lebak"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D4A3E]/40 via-transparent to-transparent" />
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-4 z-20 bg-white rounded-2xl shadow-xl shadow-emerald-900/15 p-5 border border-amber-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0D4A3E] to-[#2A6B57] flex items-center justify-center shadow-lg shadow-emerald-900/30 shrink-0">
                  <span className="text-white font-bold text-2xl leading-none">7</span>
                </div>
                <div>
                  <div className="font-bold text-[#0D4A3E] text-sm leading-tight">Tahun Melayani</div>
                  <div className="text-amber-600 text-xs font-semibold mt-0.5">Sejak 2019 · Cileles, Lebak</div>
                </div>
              </div>
            </div>

            {/* Arabic calligraphy accent */}
            <div className="absolute -top-5 -right-3 z-20 bg-gradient-to-br from-[#0D4A3E] to-[#2A6B57] text-white rounded-2xl px-4 py-2 shadow-lg text-sm font-bold tracking-wider">
              بِسْمِ اللَّهِ
            </div>
          </div>

          {/* RIGHT: Content */}
          <article className="relative">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-amber-500" aria-hidden="true" />
              <span className="text-amber-600 font-bold text-xs uppercase tracking-[0.2em]">
                Tentang Kami
              </span>
              <div className="h-px w-8 bg-amber-500" aria-hidden="true" />
            </div>

            {/* SEO Heading */}
            <h2 className="font-serif text-3xl lg:text-4xl xl:text-5xl font-bold text-[#0D4A3E] mb-6 leading-[1.15]">
              Memberikan Kehidupan{" "}
              <span className="relative inline-block">
                <strong className="relative z-10 font-bold">yang Lebih Baik</strong>
                <span className="absolute bottom-1 left-0 w-full h-3 bg-amber-300/40 -z-0 rounded" />
              </span>{" "}
              untuk Anak Yatim
            </h2>

            <p className="text-[#4A6B5D] leading-relaxed mb-5 text-base">
              <strong>Yayasan Baitul Ikhlas Peduli Yatim</strong> didirikan pada tahun 2019 dengan misi mulia untuk
              membantu anak-anak yatim yang membutuhkan di daerah Lebak, khususnya Kecamatan Cileles.
              Kami bergerak aktif di bidang pendidikan, kesehatan, sosial, keagamaan, dan lingkungan hidup.
            </p>

            <p className="text-[#4A6B5D] leading-relaxed mb-10 text-base">
              Dengan dukungan ribuan donatur setia dan jaringan relawan yang tersebar di berbagai daerah,
              kami terus berupaya memberikan dampak nyata bagi kehidupan masyarakat yang membutuhkan.
            </p>

            {/* Values */}
            <div className="grid gap-5">
              {values.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.title}
                    className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-white hover:shadow-md hover:shadow-emerald-900/8 transition-all duration-300 cursor-default border border-transparent hover:border-amber-100"
                  >
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0 shadow-md transition-transform group-hover:scale-110 duration-300`}>
                      <IconComponent className="w-5 h-5 text-white" aria-hidden="true" />
                    </div>
                    <div className="grow">
                      {/* PERBAIKAN: Baris <item.title /> yang memicu error sudah dihapus dari sini */}
                      <h3 className="font-bold text-[#0D4A3E] mb-1 text-sm">{item.title}</h3>
                      <p className="text-[#6B8C7D] text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA Buttons dengan optimasi Title Link */}
            <div className="mt-10 flex items-center gap-4">
              <a
                href="#program"
                title="Lihat program kerja Yayasan Baitul Ikhlas"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0D4A3E] to-[#2A6B57] text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-emerald-900/25 hover:shadow-xl hover:shadow-emerald-900/30 hover:-translate-y-0.5 transition-all duration-300 text-sm"
              >
                Lihat Program Kami
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <Link
                href="../campaign"
                title="Salurkan donasi Anda untuk anak yatim"
                className="inline-flex items-center gap-2 text-amber-700 font-bold text-sm hover:text-amber-800 transition-colors"
              >
                Donasi Sekarang &rarr;
              </Link>
            </div>
          </article>

        </div>
      </div>
    </section>
  );
}