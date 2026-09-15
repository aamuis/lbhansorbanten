import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Award, FileText, Sparkles } from 'lucide-react';
import { OfficialLbhAnsorLogo } from './OfficialLbhAnsorLogo';

interface AnimatedLegalCenterpieceProps {
  logoUrl?: string;
  badgeText?: string;
  mottoText?: string;
}

export const AnimatedLegalCenterpiece: React.FC<AnimatedLegalCenterpieceProps> = ({ 
  logoUrl = '/images/logo_lbh_ansor_official.svg',
  badgeText = '⚖️ FIAT JUSTITIA RUAT CAELUM',
  mottoText = '"Tegakkan Keadilan Walau Langit Akan Runtuh"'
}) => {
  const isDefaultOrOfficial = !logoUrl || logoUrl.includes('logo_lbh_ansor_official') || logoUrl === '/images/lbh_ansor_logo.jpg';

  return (
    <div className="relative w-full max-w-lg mx-auto flex items-center justify-center p-2 sm:p-4 select-none">
      {/* Ambient Pulsing Glow Aura */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.35, 0.6, 0.35],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute w-80 h-80 rounded-full bg-gradient-to-tr from-amber-500/20 via-emerald-500/25 to-yellow-400/20 blur-3xl pointer-events-none"
      />

      {/* Outer Rotating Celestial Ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute w-88 h-88 rounded-full border border-dashed border-amber-400/25 pointer-events-none"
      />

      {/* Main Legal Emblem Section - Borderless (hilangkan kotak border sesuai permintaan) */}
      <div className="relative z-10 w-full rounded-3xl p-6 sm:p-8 overflow-hidden text-center">

        {/* Header Ribbon: FIAT JUSTITIA RUAT CAELUM */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 text-[11px] sm:text-xs font-bold uppercase tracking-widest mb-2 shadow-sm backdrop-blur-xs"
        >
          <span>{badgeText}</span>
        </motion.div>

        <p className="text-xs sm:text-sm text-emerald-200/90 italic font-serif tracking-wide">
          {mottoText}
        </p>

        {/* Official LBH GP Ansor Banten Logo Container - Floating & Borderless */}
        <div className="relative my-6 flex flex-col items-center justify-center min-h-60 sm:min-h-64">
          {/* Animated floating and breathing wrapper */}
          <motion.div
            animate={{
              y: [-6, 6, -6],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative flex items-center justify-center"
          >
            {/* Soft Ambient Circle Behind Logo */}
            <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-emerald-900/30 backdrop-blur-xs flex items-center justify-center p-3 relative">
              {isDefaultOrOfficial ? (
                <OfficialLbhAnsorLogo className="w-48 h-52 sm:w-56 sm:h-60 drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]" />
              ) : (
                <img
                  src={logoUrl}
                  alt="Logo LBH GP Ansor Banten"
                  className="w-full h-full object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              )}

              {/* Floating Sparkle Pin */}
              <motion.div
                animate={{ scale: [0.9, 1.25, 0.9], opacity: [0.75, 1, 0.75] }}
                transition={{ duration: 2.2, repeat: Infinity }}
                className="absolute top-2 right-4 w-7 h-7 rounded-full bg-amber-400 text-emerald-950 flex items-center justify-center shadow-lg border border-white/60"
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
            </div>
          </motion.div>

          {/* Official Emblem Subtitle */}
          <div className="mt-4 text-center">
            <h3 className="text-sm sm:text-base font-extrabold text-amber-300 tracking-wider uppercase font-['Playfair_Display',serif]">
              LBH GP ANSOR WILAYAH BANTEN
            </h3>
            <p className="text-[11px] sm:text-xs text-emerald-300/90 tracking-widest uppercase mt-1 font-medium">
              Khidmah Penegakan Hukum & Advokasi Kerakyatan
            </p>
          </div>
        </div>

        {/* Emblem Footer Badges */}
        <div className="mt-3 pt-4 border-t border-emerald-800/40 flex items-center justify-between text-xs text-emerald-200">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-white">UU No. 16/2011</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-white">Advokat Tersumpah</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-amber-300">100% Pro Bono</span>
          </div>
        </div>
      </div>
    </div>
  );
};
