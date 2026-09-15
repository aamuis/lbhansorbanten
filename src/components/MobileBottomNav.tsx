import React from 'react';
import { Home, Scale, Search, Bot, Newspaper } from 'lucide-react';

interface MobileBottomNavProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenConsultation: () => void;
  onOpenTracking: () => void;
  onOpenChatAi: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeSection,
  onNavigate,
  onOpenConsultation,
  onOpenTracking,
  onOpenChatAi,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-emerald-950/95 backdrop-blur-lg border-t border-emerald-800/80 shadow-[0_-8px_25px_rgba(0,0,0,0.35)] px-2 py-1.5 safe-area-bottom">
      <div className="grid grid-cols-5 items-center justify-around max-w-md mx-auto">
        
        {/* Beranda */}
        <button
          onClick={() => onNavigate('beranda')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer ${
            activeSection === 'beranda' ? 'text-amber-400 font-bold' : 'text-emerald-300 hover:text-white'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeSection === 'beranda' ? 'bg-emerald-800/80' : ''}`}>
            <Home className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Beranda</span>
        </button>

        {/* Lacak Kasus */}
        <button
          onClick={onOpenTracking}
          className="flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer text-emerald-300 hover:text-white"
        >
          <div className="p-1 rounded-lg">
            <Search className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Lacak Kasus</span>
        </button>

        {/* Konsultasi (Center Action Button) */}
        <button
          onClick={onOpenConsultation}
          className="flex flex-col items-center justify-center -mt-5 group cursor-pointer"
        >
          <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-emerald-950 p-0.5 shadow-lg shadow-amber-500/40 border-2 border-white flex items-center justify-center transform group-active:scale-95 transition-transform">
            <Scale className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold text-amber-300 mt-1">Konsultasi</span>
        </button>

        {/* Artikel Edukasi Hukum */}
        <button
          onClick={() => onNavigate('artikel')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer ${
            activeSection === 'artikel' ? 'text-amber-400 font-bold' : 'text-emerald-300 hover:text-white'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeSection === 'artikel' ? 'bg-emerald-800/80' : ''}`}>
            <Newspaper className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Artikel</span>
        </button>

        {/* Tanya ABI */}
        <button
          onClick={onOpenChatAi}
          className="relative flex flex-col items-center justify-center py-1 px-1 rounded-xl text-emerald-300 hover:text-white transition-all cursor-pointer"
        >
          <span className="absolute top-0.5 right-2 w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
          <div className="p-1 rounded-lg">
            <Bot className="w-5 h-5 text-amber-400" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-semibold text-amber-300">Tanya ABI</span>
        </button>

      </div>
    </div>
  );
};
