import React from 'react';
import { motion } from 'motion/react';
import { Scale, Search, ShieldCheck, HeartHandshake, Award, PhoneCall, ArrowRight, FileCheck } from 'lucide-react';
import { SiteSettings } from '../types';
import { AnimatedLegalCenterpiece } from './AnimatedLegalCenterpiece';

interface HeroBannerProps {
  settings: SiteSettings;
  onOpenConsultation: () => void;
  onOpenCheckStatus: () => void;
  onOpenChatAi?: () => void;
  onNavigateToPosko?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  settings,
  onOpenConsultation,
  onOpenCheckStatus,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 text-white pt-8 pb-16 md:pt-14 md:pb-24 border-b border-emerald-800/60">
      {/* Background Graphic & Subtle Texture */}
      <div 
        className="absolute inset-0 opacity-15 bg-cover bg-center mix-blend-luminosity filter blur-xs"
        style={{ backgroundImage: `url(${settings.heroBannerUrl})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/85 to-transparent pointer-events-none" />

      {/* Decorative Legal Watermark in Background */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 w-96 h-96 opacity-5 pointer-events-none text-white">
        <Scale className="w-full h-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid: Left Content (7 cols) + Right Animated Legal Centerpiece (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headings & The Two Side-by-Side Boxes */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] font-['Playfair_Display',serif] text-white">
              {settings.heroHeading}
            </h1>

            <p className="mt-4 text-base sm:text-lg md:text-xl text-emerald-100/90 leading-relaxed font-normal">
              {settings.heroSubheading}
            </p>

            {/* Dua Kotak Berdampingan (Two Companion Action Boxes Only) */}
            <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Kotak 1: Ajukan Konsultasi Hukum Online */}
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenConsultation}
                className="group relative text-left p-5 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-emerald-950 shadow-xl shadow-amber-500/20 border-2 border-amber-200 transition-all cursor-pointer flex flex-col justify-between"
                role="button"
                tabIndex={0}
                aria-label="Ajukan Konsultasi Hukum Online"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-950 text-amber-400 flex items-center justify-center shadow-md">
                      <Scale className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-950/15 text-emerald-950 border border-emerald-950/20">
                      Gratis / Pro Bono
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-emerald-950 font-['Playfair_Display',serif] leading-snug">
                    Konsultasi Online
                  </h2>
                  <p className="text-xs text-emerald-900/85 mt-1 leading-relaxed line-clamp-2">
                    Ajukan bantuan hukum cuma-cuma untuk pidana, perdata, pertanahan, ketenagakerjaan, dan KDRT.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-emerald-950/15 flex items-center justify-between text-xs font-bold text-emerald-950 group-hover:translate-x-0.5 transition-transform">
                  <span>Isi Formulir Perkara</span>
                  <ArrowRight className="w-4 h-4 text-emerald-950" />
                </div>
              </motion.div>

              {/* Kotak 2: Cek Status Perkara / Tiket */}
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenCheckStatus}
                className="group relative text-left p-5 rounded-2xl bg-emerald-900/80 hover:bg-emerald-850/90 text-white shadow-xl shadow-emerald-950/40 border-2 border-emerald-700/80 hover:border-amber-400/60 transition-all cursor-pointer flex flex-col justify-between backdrop-blur-xs"
                role="button"
                tabIndex={0}
                aria-label="Lacak Status Berkas Kasus"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-800 text-amber-400 flex items-center justify-center border border-emerald-600 shadow-md">
                      <Search className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      Transparan
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-white font-['Playfair_Display',serif] leading-snug">
                    Lacak Status Tiket
                  </h2>
                  <p className="text-xs text-emerald-200/90 mt-1 leading-relaxed line-clamp-2">
                    Pantau tahapan verifikasi, disposisi advokat pendamping, serta catatan resmi LBH Ansor.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-emerald-700/80 flex items-center justify-between text-xs font-semibold text-amber-300 group-hover:translate-x-0.5 transition-transform">
                  <span>Cek Progres Kasus</span>
                  <FileCheck className="w-4 h-4 text-amber-300" />
                </div>
              </motion.div>

            </div>
          </motion.div>

          {/* Right Column: Animated Legal Centerpiece (Scales of Justice with Motion) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="lg:col-span-5 flex justify-center mt-6 lg:mt-0"
          >
            <AnimatedLegalCenterpiece />
          </motion.div>

        </div>

        {/* 4 Pillars Stats / Trust Badges */}
        <div className="mt-14 pt-8 border-t border-emerald-800/60 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          
          <div className="bg-emerald-900/40 backdrop-blur-xs border border-emerald-800/60 rounded-2xl p-4 transition-all hover:border-amber-400/40">
            <div className="w-10 h-10 rounded-xl bg-emerald-800/80 flex items-center justify-center text-amber-400 mb-3">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white">100% Pro Bono</h2>
            <p className="text-xs text-emerald-200 mt-1">
              Bantuan hukum gratis untuk masyarakat miskin & tertindas berlandaskan UU 16/2011.
            </p>
          </div>

          <div className="bg-emerald-900/40 backdrop-blur-xs border border-emerald-800/60 rounded-2xl p-4 transition-all hover:border-amber-400/40">
            <div className="w-10 h-10 rounded-xl bg-emerald-800/80 flex items-center justify-center text-amber-400 mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white">Advokat Tersumpah</h2>
            <p className="text-xs text-emerald-200 mt-1">
              Didukung barisan advokat berlisensi Peradi/KAI serta paralegal terlatih GP Ansor.
            </p>
          </div>

          <div className="bg-emerald-900/40 backdrop-blur-xs border border-emerald-800/60 rounded-2xl p-4 transition-all hover:border-amber-400/40">
            <div className="w-10 h-10 rounded-xl bg-emerald-800/80 flex items-center justify-center text-amber-400 mb-3">
              <Award className="w-5 h-5" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white">Litigasi & Non-Litigasi</h2>
            <p className="text-xs text-emerald-200 mt-1">
              Pendampingan perkara di persidangan, kepolisian, mediasi sengketa, dan konsultasi yuridis.
            </p>
          </div>

          <div className="bg-emerald-900/40 backdrop-blur-xs border border-emerald-800/60 rounded-2xl p-4 transition-all hover:border-amber-400/40">
            <div className="w-10 h-10 rounded-xl bg-emerald-800/80 flex items-center justify-center text-amber-400 mb-3">
              <PhoneCall className="w-5 h-5" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white">Update Real-time WA</h2>
            <p className="text-xs text-emerald-200 mt-1">
              Setiap pembaruan status perkara otomatis diteruskan ke WhatsApp klien.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
