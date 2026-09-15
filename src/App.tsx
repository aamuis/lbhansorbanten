import React, { useState, useEffect } from 'react';
import { 
  loadInitialData, 
  saveCasesToStorage, 
  saveArticlesToStorage, 
  saveLawyersToStorage, 
  saveBranchesToStorage, 
  saveSettingsToStorage, 
  saveMenuItemsToStorage 
} from './lib/storage';
import { 
  CaseConsultation, 
  Article, 
  Lawyer, 
  BranchOffice, 
  SiteSettings, 
  MenuItem 
} from './types';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { NearbyOffices } from './components/NearbyOffices';
import { OrganizationStructure } from './components/OrganizationStructure';
import { ArticleSection } from './components/ArticleSection';
import { ArticleDetailView } from './components/ArticleDetailView';
import { ConsultationFormModal } from './components/ConsultationFormModal';
import { CaseTrackingModal } from './components/CaseTrackingModal';
import { LegalChatbot } from './components/LegalChatbot';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { 
  ShieldCheck, 
  Scale, 
  HeartHandshake, 
  CheckCircle2, 
  MessageCircle, 
  MapPin, 
  ArrowRight, 
  Bot, 
  Search,
  Sparkles
} from 'lucide-react';

export default function App() {
  // App Core State
  const [cases, setCases] = useState<CaseConsultation[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [branches, setBranches] = useState<BranchOffice[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // View & Navigation State
  const [activeSection, setActiveSection] = useState('beranda');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Modals
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [preselectedLawyerId, setPreselectedLawyerId] = useState<string | undefined>(undefined);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackingInitialTicket, setTrackingInitialTicket] = useState('');
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  // Load initial data on mount
  useEffect(() => {
    async function init() {
      const data = await loadInitialData();
      setCases(data.cases);
      setArticles(data.articles);
      setLawyers(data.lawyers);
      setBranches(data.branches);
      setSettings(data.settings);
      setMenuItems(data.menuItems.filter(m => m.href !== '#posko'));
      setIsLoading(false);

      // Check hash routing for direct modal access
      const hash = window.location.hash;
      if (hash === '#admin') {
        setIsAdminLoginOpen(true);
      } else if (hash === '#konsultasi') {
        setIsConsultationOpen(true);
      } else if (hash === '#cek-status' || hash === '#lacak') {
        setIsTrackingOpen(true);
      } else if (hash === '#chat') {
        setIsChatbotOpen(true);
      } else if (hash.startsWith('#artikel?slug=')) {
        const slug = hash.replace('#artikel?slug=', '');
        const found = data.articles.find(a => a.slug === slug);
        if (found) setSelectedArticle(found);
      }
    }
    init();
  }, []);

  // Listen to hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#admin') {
        setIsAdminLoginOpen(true);
      } else if (hash.startsWith('#artikel?slug=')) {
        const slug = hash.replace('#artikel?slug=', '');
        const found = articles.find(a => a.slug === slug);
        if (found) setSelectedArticle(found);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [articles]);

  // Handler for navigation
  const handleNavigate = (sectionId: string) => {
    setSelectedArticle(null);
    setActiveSection(sectionId);

    if (sectionId === 'beranda') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Case submission handler
  const handleCaseSubmit = async (newCase: CaseConsultation) => {
    setCases(prev => {
      const updated = [newCase, ...prev];
      saveCasesToStorage(updated);
      return updated;
    });
  };

  // Case update handler (from Admin)
  const handleCaseUpdate = async (updatedCase: CaseConsultation) => {
    setCases(prev => {
      const updated = prev.map(c => c.id === updatedCase.id ? updatedCase : c);
      saveCasesToStorage(updated);
      return updated;
    });
  };

  const handleCaseDelete = async (id: string) => {
    setCases(prev => {
      const updated = prev.filter(c => c.id !== id);
      saveCasesToStorage(updated);
      return updated;
    });
  };

  // Article handlers
  const handleSaveArticle = async (article: Article) => {
    setArticles(prev => {
      const exists = prev.some(a => a.id === article.id);
      const updated = exists
        ? prev.map(a => a.id === article.id ? article : a)
        : [article, ...prev];
      saveArticlesToStorage(updated);
      return updated;
    });
  };

  const handleDeleteArticle = async (id: string) => {
    setArticles(prev => {
      const updated = prev.filter(a => a.id !== id);
      saveArticlesToStorage(updated);
      return updated;
    });
  };

  // Lawyer handlers
  const handleSaveLawyer = async (lawyer: Lawyer) => {
    setLawyers(prev => {
      const exists = prev.some(l => l.id === lawyer.id);
      const updated = exists
        ? prev.map(l => l.id === lawyer.id ? lawyer : l)
        : [...prev, lawyer];
      saveLawyersToStorage(updated);
      return updated;
    });
  };

  const handleSaveMultipleLawyers = async (updatedLawyers: Lawyer[]) => {
    setLawyers(prev => {
      let current = [...prev];
      for (const item of updatedLawyers) {
        const idx = current.findIndex(l => l.id === item.id);
        if (idx >= 0) {
          current[idx] = item;
        } else {
          current.push(item);
        }
      }
      saveLawyersToStorage(current);
      return current;
    });
  };

  const handleDeleteLawyer = async (id: string) => {
    setLawyers(prev => {
      const updated = prev.filter(l => l.id !== id);
      saveLawyersToStorage(updated);
      return updated;
    });
  };

  // Branch handlers
  const handleSaveBranch = async (branch: BranchOffice) => {
    setBranches(prev => {
      const exists = prev.some(b => b.id === branch.id);
      const updated = exists
        ? prev.map(b => b.id === branch.id ? branch : b)
        : [...prev, branch];
      saveBranchesToStorage(updated);
      return updated;
    });
  };

  const handleDeleteBranch = async (id: string) => {
    setBranches(prev => {
      const updated = prev.filter(b => b.id !== id);
      saveBranchesToStorage(updated);
      return updated;
    });
  };

  // Settings handler
  const handleSaveSettings = async (newSettings: SiteSettings) => {
    setSettings(newSettings);
    await saveSettingsToStorage(newSettings);
  };

  // Menu items handler
  const handleSaveMenuItems = async (items: MenuItem[]) => {
    setMenuItems(items);
    await saveMenuItemsToStorage(items);
  };

  if (isLoading || !settings) {
    return (
      <div className="min-h-screen bg-emerald-950 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 rounded-xl bg-emerald-800 border border-amber-400 flex items-center justify-center text-amber-300 animate-pulse mb-4">
          <Scale className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-bold font-['Playfair_Display',serif]">LBH GP ANSOR BANTEN</h2>
        <p className="text-xs text-emerald-300 mt-1">Memuat sistem bantuan hukum...</p>
      </div>
    );
  }

  // If Admin is logged in, show the comprehensive Admin Dashboard
  if (isAdminLoggedIn) {
    return (
      <AdminDashboard
        onLogout={() => setIsAdminLoggedIn(false)}
        cases={cases}
        onUpdateCase={handleCaseUpdate}
        onDeleteCase={handleCaseDelete}
        articles={articles}
        onSaveArticle={handleSaveArticle}
        onDeleteArticle={handleDeleteArticle}
        lawyers={lawyers}
        onSaveLawyer={handleSaveLawyer}
        onSaveMultipleLawyers={handleSaveMultipleLawyers}
        onDeleteLawyer={handleDeleteLawyer}
        branches={branches}
        onSaveBranch={handleSaveBranch}
        onDeleteBranch={handleDeleteBranch}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        menuItems={menuItems}
        onSaveMenuItems={handleSaveMenuItems}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] flex flex-col selection:bg-emerald-800 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        settings={settings}
        menuItems={menuItems}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenConsultation={() => {
          setPreselectedLawyerId(undefined);
          setIsConsultationOpen(true);
        }}
        onOpenCheckStatus={() => setIsTrackingOpen(true)}
        onOpenChatAi={() => setIsChatbotOpen(true)}
      />

      {/* Main View: Either Article Detail or Landing Page */}
      {selectedArticle ? (
        <ArticleDetailView
          article={selectedArticle}
          onBack={() => {
            setSelectedArticle(null);
            window.location.hash = '#artikel';
          }}
          onSelectRelatedArticle={(slug) => {
            const art = articles.find(a => a.slug === slug);
            if (art) setSelectedArticle(art);
          }}
          relatedArticles={articles.filter(a => a.id !== selectedArticle.id)}
        />
      ) : (
        <main className="flex-1">
          {/* Hero Banner Section */}
          <HeroBanner
            settings={settings}
            onOpenConsultation={() => {
              setPreselectedLawyerId(undefined);
              setIsConsultationOpen(true);
            }}
            onOpenCheckStatus={() => setIsTrackingOpen(true)}
            onOpenChatAi={() => setIsChatbotOpen(true)}
          />

          {/* Highlights / 4 Pilar Layanan LBH Ansor Banten - 2x2 Compact Grid */}
          <section className="py-8 sm:py-10 bg-white border-b border-slate-200">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Kotak 1: Bebas Biaya (Pro Bono) */}
                <div className="p-4 rounded-xl bg-emerald-50/70 hover:bg-emerald-50 border border-emerald-200/80 transition-all flex items-start gap-3.5 group">
                  <div className="w-10 h-10 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-emerald-800 transition-colors">
                      {settings?.pillar1Title || 'Bebas Biaya (Pro Bono)'}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {settings?.pillar1Desc || "Khidmah perbantuan hukum tanpa pungutan biaya bagi kaum mustadh'afin, buruh, petani, dan warga tidak mampu."}
                    </p>
                  </div>
                </div>

                {/* Kotak 2: Advokat Tersumpah */}
                <div className="p-4 rounded-xl bg-emerald-50/70 hover:bg-emerald-50 border border-emerald-200/80 transition-all flex items-start gap-3.5 group">
                  <div className="w-10 h-10 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-emerald-800 transition-colors">
                      {settings?.pillar2Title || 'Advokat Tersumpah'}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {settings?.pillar2Desc || 'Didukung puluhan advokat berpengalaman dan paralegal militan Ansor di 8 Kabupaten & Kota se-Provinsi Banten.'}
                    </p>
                  </div>
                </div>

                {/* Kotak 3: Notifikasi WhatsApp */}
                <div className="p-4 rounded-xl bg-emerald-50/70 hover:bg-emerald-50 border border-emerald-200/80 transition-all flex items-start gap-3.5 group">
                  <div className="w-10 h-10 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-emerald-800 transition-colors">
                      {settings?.pillar3Title || 'Notifikasi WhatsApp'}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {settings?.pillar3Desc || 'Sistem pembaruan status perkara otomatis langsung ke WhatsApp pemohon secara transparan dan akuntabel.'}
                    </p>
                  </div>
                </div>

                {/* Kotak 4: Tanya ABI (Asisten Pintar) */}
                <div 
                  onClick={() => setIsChatbotOpen(true)}
                  className="p-4 rounded-xl bg-emerald-50/70 hover:bg-emerald-50 border border-emerald-200/80 transition-all flex items-start gap-3.5 group cursor-pointer"
                  title="Klik untuk membuka Tanya ABI"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-emerald-800 transition-colors">
                        {settings?.pillar4Title || 'Tanya ABI (Asisten Pintar)'}
                      </h3>
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-800 text-amber-300">
                        24 Jam
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {settings?.pillar4Desc || 'Tanya jawab instan 24 jam dengan asisten cerdas LBH Ansor Banten berbasis hukum positif dan wawasan umum.'}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* Struktur Organisasi Pimpinan Wilayah LBH Ansor Banten */}
          <OrganizationStructure 
            lawyers={lawyers} 
            title={settings?.orgSectionTitle}
            subtitle={settings?.orgSectionSubtitle}
          />

          {/* Article & Educational Insights Section */}
          <ArticleSection
            articles={articles}
            onSelectArticle={(art) => {
              setSelectedArticle(art);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />

          {/* Banner Ajakan Konsultasi */}
          <section className="py-16 bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white relative overflow-hidden">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 mx-auto">
                <Scale className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-['Playfair_Display',serif]">
                {settings?.ctaHeading || 'Jangan Hadapi Masalah Hukum Anda Sendirian'}
              </h2>
              <p className="text-sm sm:text-base text-emerald-200 max-w-2xl mx-auto">
                {settings?.ctaSubheading || 'LBH GP Ansor Banten hadir untuk memastikan keadilan tegak bagi seluruh lapisan masyarakat. Konsultasikan perkara Anda sekarang tanpa rasa cemas.'}
              </p>
              <div className="pt-2 flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => {
                    setPreselectedLawyerId(undefined);
                    setIsConsultationOpen(true);
                  }}
                  className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-sm shadow-lg transition-all cursor-pointer"
                >
                  {settings?.ctaButtonText || 'Ajukan Konsultasi Online Sekarang'}
                </button>
                <button
                  onClick={() => setIsChatbotOpen(true)}
                  className="px-6 py-3 rounded-xl bg-emerald-800/80 hover:bg-emerald-800 text-white font-bold text-sm border border-emerald-600 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Bot className="w-4 h-4 text-amber-300" />
                  <span>Tanya ABI Sekarang</span>
                </button>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* Footer */}
      <Footer
        settings={settings}
        menuItems={menuItems}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onOpenConsultation={() => {
          setPreselectedLawyerId(undefined);
          setIsConsultationOpen(true);
        }}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenChatbot={() => setIsChatbotOpen(true)}
      />

      {/* Mobile Fixed Bottom Bar */}
      <MobileBottomNav
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenConsultation={() => {
          setPreselectedLawyerId(undefined);
          setIsConsultationOpen(true);
        }}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenChatAi={() => setIsChatbotOpen(true)}
      />

      {/* Floating Action Button for Tanya ABI on Desktop */}
      <div className="fixed bottom-6 right-6 z-40 hidden md:block">
        <button
          onClick={() => setIsChatbotOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-emerald-800 to-emerald-900 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-full shadow-2xl border-2 border-amber-400/60 transition-all hover:scale-105 cursor-pointer group"
          title="Tanya ABI - Asisten Bantuan Hukum Ansor Banten"
        >
          <div className="w-7 h-7 rounded-full bg-emerald-700 flex items-center justify-center text-amber-300">
            <Bot className="w-4 h-4" />
          </div>
          <div className="text-left pr-1">
            <span className="block text-xs font-bold leading-tight">Tanya ABI</span>
            <span className="block text-[10px] text-amber-300 font-medium">Asisten Cerdas 24 Jam</span>
          </div>
        </button>
      </div>

      {/* ================= MODALS ================= */}

      {/* 1. Case Consultation Form Modal */}
      <ConsultationFormModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        onSubmitCase={handleCaseSubmit}
        lawyers={lawyers}
        preselectedLawyerId={preselectedLawyerId}
      />

      {/* 2. Case Tracking Modal */}
      <CaseTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        cases={cases}
        initialTicketQuery={trackingInitialTicket}
        onOpenConsultation={() => {
          setIsTrackingOpen(false);
          setPreselectedLawyerId(undefined);
          setIsConsultationOpen(true);
        }}
      />

      {/* 3. AI Legal Chatbot Dialog */}
      <LegalChatbot
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        onOpenConsultation={() => {
          setIsChatbotOpen(false);
          setPreselectedLawyerId(undefined);
          setIsConsultationOpen(true);
        }}
      />

      {/* 4. Discreet Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => setIsAdminLoggedIn(true)}
        correctPin={settings.adminPin || 'ansor1934'}
      />

    </div>
  );
}
