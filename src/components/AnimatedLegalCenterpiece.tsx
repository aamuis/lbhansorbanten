import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Award, FileText, Sparkles } from 'lucide-react';

interface AnimatedLegalCenterpieceProps {
  logoUrl?: string;
}

export const AnimatedLegalCenterpiece: React.FC<AnimatedLegalCenterpieceProps> = ({ 
  logoUrl = '/images/lbh_ansor_logo.jpg' 
}) => {
  return (
    <div className="relative w-full max-w-md mx-auto flex items-center justify-center p-2 sm:p-4 select-none">
      {/* Ambient Pulsing Glow Aura */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.35, 0.65, 0.35],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-amber-500/25 via-emerald-500/30 to-yellow-400/25 blur-2xl pointer-events-none"
      />

      {/* Outer Rotating Celestial Ring with Golden Accents */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 50,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute w-80 h-80 rounded-full border border-dashed border-amber-400/30 pointer-events-none"
      />

      {/* Counter-Rotating Ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute w-72 h-72 rounded-full border border-emerald-400/20 pointer-events-none"
      />

      {/* Main Legal Emblem Card */}
      <div className="relative z-10 w-full bg-gradient-to-b from-emerald-900/85 via-emerald-950/92 to-emerald-950/98 border-2 border-amber-400/50 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-md overflow-hidden text-center">
        {/* Decorative corner accents */}
        <div className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t-2 border-l-2 border-amber-400/80 rounded-tl-xs" />
        <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t-2 border-r-2 border-amber-400/80 rounded-tr-xs" />
        <div className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b-2 border-l-2 border-amber-400/80 rounded-bl-xs" />
        <div className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b-2 border-r-2 border-amber-400/80 rounded-br-xs" />

        {/* Header Ribbon: FIAT JUSTITIA RUAT CAELUM */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1.5 shadow-xs"
        >
          <span>⚖️ FIAT JUSTITIA RUAT CAELUM</span>
        </motion.div>

        <p className="text-[11px] text-emerald-200/90 italic font-serif tracking-wide">
          "Tegakkan Keadilan Walau Langit Akan Runtuh"
        </p>

        {/* Animated LBH GP Ansor Banten Logo Container */}
        <div className="relative my-4 sm:my-5 flex flex-col items-center justify-center min-h-48 sm:min-h-52">
          {/* Animated floating and breathing wrapper */}
          <motion.div
            animate={{
              y: [-6, 6, -6],
              rotate: [-1, 1, -1],
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative flex items-center justify-center"
          >
            {/* Spinning decorative halo */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute -inset-2.5 rounded-full border-2 border-amber-400/40 border-t-amber-300 border-r-transparent pointer-events-none"
            />

            {/* Glowing Backdrop Circle */}
            <div className="w-40 h-40 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-emerald-800 via-emerald-700 to-amber-900/60 p-1.5 shadow-[0_0_25px_rgba(245,158,11,0.25)] border border-amber-400/60 flex items-center justify-center overflow-hidden">
              <img
                src={logoUrl || '/images/lbh_ansor_logo.jpg'}
                alt="Logo LBH GP Ansor Banten"
                className="w-full h-full object-cover rounded-full filter drop-shadow-md"
                onError={(e) => {
                  // Fallback if custom url fails
                  const target = e.target as HTMLImageElement;
                  if (target.src !== '/images/lbh_ansor_logo.jpg') {
                    target.src = '/images/lbh_ansor_logo.jpg';
                  }
                }}
              />
            </div>

            {/* Floating Sparkle Pin */}
            <motion.div
              animate={{ scale: [0.9, 1.2, 0.9], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-emerald-950 flex items-center justify-center shadow-md border border-white/50"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </motion.div>
          </motion.div>

          {/* Official Emblem Subtitle */}
          <div className="mt-3 text-center">
            <h4 className="text-xs sm:text-sm font-extrabold text-amber-300 tracking-wider uppercase font-['Playfair_Display',serif]">
              LBH GP ANSOR WILAYAH BANTEN
            </h4>
            <p className="text-[10px] text-emerald-300/80 tracking-widest uppercase mt-0.5 font-medium">
              Khidmah Penegakan Hukum & Advokasi Kerakyatan
            </p>
          </div>
        </div>

        {/* Emblem Footer Badges */}
        <div className="mt-2 pt-3 border-t border-emerald-800/80 flex items-center justify-between text-[11px] text-emerald-200">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-white">UU No. 16/2011</span>
          </div>
          <div className="flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-white">Advokat Tersumpah</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-amber-300">100% Pro Bono</span>
          </div>
        </div>
      </div>
    </div>
  );
};
