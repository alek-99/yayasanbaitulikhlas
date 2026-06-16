"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  CheckCircle2,
  LucideIcon,
  Heart,
  Map,
} from "lucide-react";

interface ContactSectionProps {
  whatsappNumber?: string;
  foundationName?: string;
  address?: string;
  email?: string;
  operationalHours?: string;
  displayPhone?: string;
}

interface InfoItemProps {
  icon: LucideIcon;
  title: string;
  value: string;
}

export default function ContactSection({
  whatsappNumber = "6281389090873",
  foundationName = "Yayasan Baitul Ikhlas Peduli Yatim",
  address = "Jl. Raya Sampay-Gn.Kencana Kp. CangketeukRebah, Desa Cipdang, Kec.Cileles, Kab. Lebak",
  email = "yayasanbaitulikhlaspeduliyatim@gmail.com",
  operationalHours = "Setiap Hari, 08.00 - 16.00 WIB",
  displayPhone = "+62 813-8909-0873",
}: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const googleMapsUrl = "https://maps.app.goo.gl/DnH7jpWfzqXx3nZ7A";
  const googleMapsEmbedUrl = "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15858.919028886985!2d106.0629646!3d-6.4815222!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e42390e01da2b6f%3A0xb066909c54755ad3!2sYayasan%20Baitul%20ikhlas%20peduli%20yatim!5e0!3m2!1sid!2sid!4v1718495800000!5m2!1sid!2sid";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");

    // SOLUSI: Menggunakan variabel terpisah atau membungkus karakter bintang agar parser SWC tidak membacanya sebagai JSX
    const bold = "*";
    const text = `Halo Admin ${foundationName},\n\n${bold}Nama:${bold} ${formData.name}\n${bold}Email:${bold} ${formData.email}\n\n${bold}Pesan:${bold}\n${formData.message}`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;

    setTimeout(() => {
      window.open(url, "_blank");
      setStatus("success");

      setTimeout(() => {
        setStatus("idle");
        setFormData({ name: "", email: "", message: "" });
      }, 3000);
    }, 800);
  };

  return (
    <section id="kontak" className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-24 px-6 sm:px-8">
      <div className="absolute top-0 left-1/4 -z-10 h-96 w-96 rounded-full bg-emerald-50/60 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 -z-10 h-96 w-96 rounded-full bg-teal-50/50 blur-3xl" />

      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="text-center mb-16 md:mb-20 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 font-semibold text-xs tracking-wide uppercase shadow-sm shadow-emerald-100/50"
          >
            <Heart className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600 animate-pulse" />
            <span>Hubungi Kami</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
            className="text-4xl sm:text-5xl font-black tracking-tight text-slate-950 max-w-3xl mx-auto leading-[1.15]"
          >
            Mari Berbagi Kebahagiaan & <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Tetap Terhubung</span>
          </motion.h2>

          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "80px" }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="h-1 bg-gradient-to-r from-emerald-500 to-teal-400 mx-auto rounded-full"
          />

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed pt-2"
          >
            Punya pertanyaan seputar program atau berniat menyalurkan donasi? Tim relawan kami siap menyambut niat baik Anda dengan sepenuh hati.
          </motion.p>
        </div>

        {/* Grid Container */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* KARTU INFORMASI & MAPS */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="bg-white/80 backdrop-blur-md border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-100/40">
              <h3 className="font-bold text-xl text-slate-900 mb-8 flex flex-col gap-1">
                <span className="text-xs text-emerald-600 font-bold tracking-wider uppercase">Informasi Kontak</span>
                <span className="text-lg font-extrabold text-slate-800">{foundationName}</span>
              </h3>

              <div className="space-y-6">
                <InfoItem icon={MapPin} title="Alamat" value={address} />
                <InfoItem icon={Phone} title="WhatsApp" value={displayPhone} />
                <InfoItem icon={Mail} title="Email" value={email} />
                <InfoItem icon={Clock} title="Jam Operasional" value={operationalHours} />
              </div>

              <hr className="my-8 border-slate-100" />

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex-1 flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold rounded-2xl py-4 px-6 shadow-lg shadow-emerald-600/20 transition-all duration-300 text-sm md:text-base"
                >
                  <MessageCircle className="w-5 h-5 transition-transform group-hover:scale-110" />
                  Chat WhatsApp
                </a>
                
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex-1 flex items-center justify-center gap-3 bg-white border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50/30 active:scale-[0.98] text-slate-700 hover:text-emerald-700 font-bold rounded-2xl py-4 px-6 shadow-sm transition-all duration-300 text-sm md:text-base"
                >
                  <Map className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-transform group-hover:scale-110" />
                  Buka di Maps
                </a>
              </div>
            </div>

            {/* LIVE GOOGLE MAPS EMBED */}
            <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-xl shadow-slate-100/40 overflow-hidden">
              <div className="w-full h-64 rounded-2xl overflow-hidden border border-slate-100 relative group">
                <iframe
                  src={googleMapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Lokasi ${foundationName}`}
                  className="absolute inset-0"
                />
              </div>
            </div>
          </motion.div>

          {/* FORMULIR KIRIM PESAN */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl shadow-slate-100/40">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Kirim Pesan Cepat</h3>
              <p className="text-slate-500 text-sm mt-1 mb-8">
                Isi formulir di bawah ini, dan sistem akan langsung memformat pesan Anda secara rapi menuju WhatsApp resmi kami.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 px-1">Nama Lengkap</label>
                    <input
                      required
                      type="text"
                      placeholder="Purna Irawan"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-4 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm bg-slate-50/50 focus:bg-white text-slate-800 font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 px-1">Alamat Email</label>
                    <input
                      required
                      type="email"
                      placeholder="Purna@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-4 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm bg-slate-50/50 focus:bg-white text-slate-800 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 px-1">Isi Pesan</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tuliskan pertanyaan detail atau niat mulia donasi Anda di sini..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-4 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm bg-slate-50/50 focus:bg-white text-slate-800 font-medium resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status !== "idle"}
                  className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-300 shadow-lg ${
                    status === "success"
                      ? "bg-emerald-500 text-white shadow-emerald-500/20"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 active:scale-[0.99] disabled:opacity-70"
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {status === "loading" && (
                      <motion.div
                        key="loading"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    )}
                    {status === "success" && (
                      <motion.div
                        key="success"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Membuka WhatsApp...</span>
                      </motion.div>
                    )}
                    {status === "idle" && (
                      <motion.div key="idle" className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        <span>Kirim via WhatsApp</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

function InfoItem({ icon: Icon, title, value }: InfoItemProps) {
  return (
    <div className="flex gap-4 group">
      <div className="w-12 h-12 shrink-0 rounded-2xl bg-emerald-50 border border-emerald-100/60 text-emerald-600 flex items-center justify-center transition-all group-hover:bg-emerald-600 group-hover:text-white duration-300 shadow-sm shadow-emerald-100/50">
        <Icon className="w-5 h-5" />
      </div>

      <div className="flex flex-col justify-center">
        <h4 className="font-bold text-slate-800 text-sm md:text-base transition-colors group-hover:text-emerald-700 duration-200">
          {title}
        </h4>
        <p className="text-slate-500 text-xs md:text-sm mt-0.5 leading-relaxed">{value}</p>
      </div>
    </div>
  );
}