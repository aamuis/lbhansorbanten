import React, { useState } from 'react';
import { Shield, PhoneCall, Menu, X, Scale, FileText, MapPin, Users, Bot, Search } from 'lucide-react';
import { SiteSettings, MenuItem } from '../types';

interface NavbarProps {
  settings: SiteSettings;
  menuItems: MenuItem[];
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenConsultation: () => void;
  onOpenCheckStatus: () => void;
  onOpenChatAi: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  menuItems,
  activeSection,
  onNavigate,
  onOpenConsultation,
  onOpenCheckStatus,
  onOpenChatAi,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const visibleMenuItems = menuItems.filter(item => item.isVisible).sort((a, b) => a.order - b.order);

  const handleMenuClick = (href: string) => {
    setMobileMenuOpen(false);
    if (href === '#konsultasi') {
      onOpenConsultation();
    } else if (href === '#cek-status') {
      onOpenCheckStatus();
    } else {
      const cleanId = href.replace('#', '');
      onNavigate(cleanId);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-emerald-950/95 backdrop-blur-md border-b border-emerald-800/60 shadow-lg text-white">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Title */}
          <div 
            onClick={() => onNavigate('beranda')} 
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center shrink-0">
              {settings.siteLogoUrl ? (
                <img 
                  src={settings.siteLogoUrl} 
                  alt="Logo LBH Ansor Banten" 
                  className="w-full h-full object-contain drop-shadow-sm transition-transform group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <Scale className="w-8 h-8 text-amber-400" />
              )}
            </div>

            <div className="flex flex-col justify-center select-none" aria-label="LBH GP ANSOR WILAYAH BANTEN">
              <svg 
                viewBox="0 0 160 32" 
                className="w-32 sm:w-40 h-7 sm:h-8" 
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

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {visibleMenuItems.map((item) => {
              const cleanId = item.href.replace('#', '');
              const isActive = activeSection === cleanId;
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.href)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-emerald-800 text-amber-300 shadow-sm border border-emerald-700/80' 
                      : 'text-emerald-100 hover:text-white hover:bg-emerald-800/50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              onClick={onOpenCheckStatus}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-900/90 hover:bg-emerald-800 text-emerald-100 border border-emerald-700/60 hover:text-white transition-all shadow-sm cursor-pointer"
              title="Cek progres dan status berkas permohonan"
            >
              <Search className="w-3.5 h-3.5 text-amber-400" />
              <span>Lacak Kasus</span>
            </button>

            <button
              onClick={onOpenConsultation}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-xs md:text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 shadow-md shadow-amber-500/20 border border-amber-300 transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <Scale className="w-4 h-4" />
              <span>Konsultasi Online</span>
            </button>
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenConsultation}
              className="px-2.5 py-1.5 rounded-md text-xs font-bold bg-amber-500 text-emerald-950"
            >
              Konsultasi
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-emerald-900 text-emerald-200 hover:text-white border border-emerald-800"
              aria-label="Buka Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-emerald-950 border-t border-emerald-800/80 px-4 pt-3 pb-6 space-y-2 shadow-2xl">
          {visibleMenuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.href)}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-emerald-100 hover:bg-emerald-900 hover:text-amber-300 transition-colors"
            >
              {item.label}
            </button>
          ))}
          <div className="pt-3 border-t border-emerald-800/80 flex flex-col gap-2">
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenCheckStatus(); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-900/80 text-emerald-100 border border-emerald-800 text-sm font-medium"
            >
              <Search className="w-4 h-4 text-amber-400" />
              <span>Lacak Status Tiket Kasus</span>
            </button>
            <a
              href={`https://wa.me/${settings.hotlineWhatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Hubungi Hotline WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
