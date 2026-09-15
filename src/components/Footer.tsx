import React from 'react';
import { 
  Scale, 
  MapPin, 
  Phone, 
  Mail, 
  Lock, 
  HeartHandshake, 
  ShieldCheck, 
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { SiteSettings, MenuItem } from '../types';

interface FooterProps {
  settings: SiteSettings;
  menuItems: MenuItem[];
  onOpenAdminLogin: () => void;
  onOpenConsultation: () => void;
  onOpenTracking: () => void;
  onOpenChatbot: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  menuItems,
  onOpenAdminLogin,
  onOpenConsultation,
  onOpenTracking,
  onOpenChatbot,
}) => {
  return (
    <footer className="bg-emerald-950 text-slate-300 border-t border-emerald-900/80 pt-16 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-emerald-900/60">
          
          {/* Col 1: About LBH Ansor Banten */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center shrink-0">
                {settings.siteLogoUrl ? (
                  <img 
                    src={settings.siteLogoUrl} 
                    alt="Logo LBH Ansor Banten" 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <Scale className="w-7 h-7 text-amber-300" />
                )}
              </div>
              <div className="flex flex-col justify-center select-none" aria-label="LBH GP ANSOR WILAYAH BANTEN">
                <svg 
                  viewBox="0 0 160 32" 
                  className="w-36 sm:w-44 h-7 sm:h-8" 
                  fill="none" 
                  role="img"
                  aria-label="LBH GP ANSOR WILAYAH BANTEN"
                >
                  <text
                    x="0"
                    y="13"
                    textLength="160"
                    lengthAdjust="spacing"
                    fill="#ffffff"
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontWeight: 800,
                      fontSize: '14.5px',
                      letterSpacing: '0.04em'
                    }}
                  >
                    LBH GP ANSOR
                  </text>
                  <text
                    x="0"
                    y="28"
                    textLength="160"
                    lengthAdjust="spacing"
                    fill="#fcd34d"
                    style={{
                      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                      fontWeight: 700,
                      fontSize: '10.5px',
                      letterSpacing: '0.14em'
                    }}
                  >
                    WILAYAH BANTEN
                  </text>
                </svg>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {settings.footerAbout}
            </p>

            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/80 text-emerald-300 text-[11px] font-semibold border border-emerald-700/50">
                <HeartHandshake className="w-3.5 h-3.5 text-amber-300" />
                <span>Pelayanan Bebas Biaya (Pro Bono)</span>
              </span>
            </div>
          </div>

          {/* Col 2: Navigation & Services */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-l-2 border-amber-400 pl-2">
              Layanan Utama
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={onOpenConsultation}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5 text-left"
                >
                  <span>› Pengajuan Konsultasi Online</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTracking}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5 text-left"
                >
                  <span>› Lacak Status Berkas Kasus</span>
                </button>
              </li>
              <li>
                <a href="#advokat" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <span>› Direktori Advokat & Paralegal</span>
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenChatbot}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5 text-left text-amber-300/90 font-medium cursor-pointer"
                >
                  <span>› Tanya ABI (Asisten Pintar 24 Jam)</span>
                </button>
              </li>
              <li>
                <a href="#artikel" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <span>› Edukasi & Artikel Hukum</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Regional Coverage */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-l-2 border-amber-400 pl-2">
              Wilayah Layanan Banten
            </h4>
            <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-400">
              <span>• Kota Serang</span>
              <span>• Kab. Serang</span>
              <span>• Kota Cilegon</span>
              <span>• Kab. Pandeglang</span>
              <span>• Kab. Lebak</span>
              <span>• Kota Tangerang</span>
              <span>• Tangerang Selatan</span>
              <span>• Kab. Tangerang</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-3 italic">
              Jangkauan advokasi dan pendampingan hukum meliputi 8 Kabupaten/Kota di Provinsi Banten.
            </p>
          </div>

          {/* Col 4: Contact & Hotline */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-l-2 border-amber-400 pl-2">
              Sekretariat & Hotline
            </h4>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{settings.headquartersAddress}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Hotline: {settings.hotlineWhatsapp}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{settings.officialEmail}</span>
              </div>
              
              <div className="pt-2">
                <a
                  href={`https://wa.me/${settings.hotlineWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    "Assalamu'alaikum Wr. Wb. LBH GP Ansor Banten, saya ingin berkonsultasi mengenai bantuan hukum."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat WhatsApp Call Center</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar with Discreet Hidden Admin Entrance */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div>
            © {new Date().getFullYear()} LBH GP Ansor Wilayah Banten. Khidmah Penegakan Keadilan & Kebenaran.
          </div>

          {/* Discreet Admin Entrance for the user */}
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-slate-600">Aswaja An-Nahdliyah</span>
            
            {/* Secret discreet button only known to admin */}
            <button
              onClick={onOpenAdminLogin}
              className="group flex items-center gap-1 text-[11px] text-slate-600 hover:text-amber-300 transition-colors opacity-70 hover:opacity-100 cursor-pointer"
              title="Akses Tersembunyi Khusus Pengurus"
            >
              <Lock className="w-3 h-3 group-hover:text-amber-400" />
              <span className="text-[10px]">Akses Pengurus</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
