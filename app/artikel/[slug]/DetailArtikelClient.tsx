'use client';

import { useState, useEffect } from "react";
import { Share2, Check, Link2 } from "lucide-react";

interface DetailArtikelClientProps {
  articleTitle: string;
}

export default function DetailArtikelClient({ articleTitle }: DetailArtikelClientProps) {
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareText = encodeURIComponent(`Baca artikel menarik ini: "${articleTitle}"\n\n`);
  const encodedUrl = encodeURIComponent(currentUrl);

  return (
    <div className="mt-10 pt-6 border-t border-gray-100">
      <div className="bg-amber-50/40 rounded-2xl p-5 border border-amber-100/60 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 text-slate-700">
          <Share2 className="w-4 h-4 text-amber-600" />
          <span className="text-sm font-bold tracking-wide">Bagikan Artikel Ini:</span>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-3 w-full md:w-auto">
          {/* WhatsApp */}
          <a
            href={`https://api.whatsapp.com/send?text=${shareText}${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-bold bg-[#25D366] text-white px-4 py-2.5 rounded-xl hover:bg-[#20ba5a] transition shadow-sm"
          >
            <span>WhatsApp</span>
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-bold bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white px-4 py-2.5 rounded-xl hover:opacity-90 transition shadow-sm"
          >
            <span>Instagram</span>
          </a>

          {/* TikTok */}
          <a
            href="https://www.tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-bold bg-black text-white px-4 py-2.5 rounded-xl hover:bg-neutral-900 transition shadow-sm"
          >
            <span>TikTok</span>
          </a>

          {/* Salin Tautan */}
          <button
            onClick={handleCopyLink}
            className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-sm border ${
              copied 
                ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
            <span>{copied ? "Tautan Disalin!" : "Salin Link"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}