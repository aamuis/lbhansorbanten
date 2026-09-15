import React, { useState, useRef, useEffect } from 'react';
import { 
  FolderKanban, 
  Newspaper, 
  Settings, 
  Menu as MenuIcon, 
  Users, 
  MapPin, 
  Database, 
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  MessageCircle, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Save, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck, 
  FileText,
  Clock,
  KeyRound,
  Eye,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Layers,
  Award,
  Scale
} from 'lucide-react';
import { 
  CaseConsultation, 
  Article, 
  Lawyer, 
  BranchOffice, 
  SiteSettings, 
  MenuItem, 
  CaseStatus 
} from '../types';
import { getWhatsAppSendUrl, getStatusLabelIndonesian } from '../lib/whatsapp';
import { testVercelConnection, getVercelPostgresSqlSchema, isVercelDbConfigured } from '../lib/vercelDb';
import { compressImage, getApproximateDataUrlSize } from '../lib/imageCompressor';
import { saveStoredExecutiveLeaders } from '../lib/storage';

// Reusable Image Uploader with Computer Upload (Base64) and Preset Logo Support
interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  presetOfficialLogo?: boolean;
  helpText?: string;
  previewHeight?: string;
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({ 
  label, 
  value, 
  onChange, 
  presetOfficialLogo, 
  helpText, 
  previewHeight = "h-14 w-14" 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      // Auto compress and optimize image to ensure it fits safely in storage and Vercel KV
      const compressed = await compressImage(file, {
        maxWidth: 960,
        maxHeight: 960,
        quality: 0.82
      });
      onChange(compressed);
    } catch (err) {
      console.error('Compression error, falling back:', err);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onChange(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const imageSize = getApproximateDataUrlSize(value);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block font-bold text-slate-700 text-xs">{label}</label>
        {isProcessing && (
          <span className="text-[10px] text-amber-600 font-semibold animate-pulse flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            Mengompres & memproses gambar...
          </span>
        )}
        {!isProcessing && imageSize && (
          <span className="text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-medium">
            Tersimpan: {imageSize} (Optimal)
          </span>
        )}
      </div>
      <div className="flex flex-col sm:flex-row gap-2.5 items-start sm:items-center">
        {/* Preview Thumbnail */}
        <div className={`${previewHeight} rounded-xl bg-emerald-950/90 border-2 border-amber-400/80 p-0.5 flex items-center justify-center shrink-0 overflow-hidden shadow-xs relative group`}>
          {value ? (
            <img 
              key={value}
              src={value} 
              alt="Preview" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/rojak_ketua.jpg';
              }} 
            />
          ) : (
            <ImageIcon className="w-6 h-6 text-emerald-400" />
          )}
        </div>

        {/* Controls */}
        <div className="flex-1 w-full space-y-1.5">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="https://... atau pilih upload file dari komputer"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
            />
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              title="Upload file gambar dari perangkat Anda"
            >
              <Upload className="w-3.5 h-3.5 text-amber-300" />
              <span>{isProcessing ? 'Memproses...' : 'Upload Gambar'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {presetOfficialLogo && (
              <button
                type="button"
                onClick={() => onChange('/images/logo_lbh_ansor_official.svg')}
                className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-[11px] border border-amber-300 flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>Pasang Logo Resmi LBH GP Ansor Banten</span>
              </button>
            )}
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="text-[11px] text-red-600 hover:text-red-700 hover:underline cursor-pointer"
              >
                Hapus Gambar
              </button>
            )}
          </div>
          {helpText && <p className="text-[10px] text-slate-500">{helpText}</p>}
        </div>
      </div>
    </div>
  );
};

interface AdminDashboardProps {
  onLogout: () => void;
  cases: CaseConsultation[];
  onUpdateCase: (updatedCase: CaseConsultation) => Promise<void>;
  onDeleteCase: (id: string) => void;
  articles: Article[];
  onSaveArticle: (article: Article) => Promise<void>;
  onDeleteArticle: (id: string) => void;
  lawyers: Lawyer[];
  onSaveLawyer: (lawyer: Lawyer) => void;
  onSaveMultipleLawyers?: (lawyers: Lawyer[]) => Promise<void>;
  onDeleteLawyer: (id: string) => void;
  branches: BranchOffice[];
  onSaveBranch: (branch: BranchOffice) => void;
  onDeleteBranch: (id: string) => void;
  settings: SiteSettings;
  onSaveSettings: (settings: SiteSettings) => Promise<void>;
  menuItems: MenuItem[];
  onSaveMenuItems: (items: MenuItem[]) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onLogout,
  cases,
  onUpdateCase,
  onDeleteCase,
  articles,
  onSaveArticle,
  onDeleteArticle,
  lawyers,
  onSaveLawyer,
  onSaveMultipleLawyers,
  onDeleteLawyer,
  branches,
  onSaveBranch,
  onDeleteBranch,
  settings,
  onSaveSettings,
  menuItems,
  onSaveMenuItems,
}) => {
  const [activeTab, setActiveTab] = useState<'cases' | 'articles' | 'lawyers' | 'branches' | 'settings' | 'menu' | 'vercel'>('cases');

  // Case management state
  const [caseFilterStatus, setCaseFilterStatus] = useState<string>('all');
  const [caseSearch, setCaseSearch] = useState('');
  const [editingCase, setEditingCase] = useState<CaseConsultation | null>(null);

  // Article management state
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [articleForm, setArticleForm] = useState<Partial<Article>>({
    title: '',
    category: 'Edukasi Hukum',
    summary: '',
    content: '',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&auto=format&fit=crop&q=80',
    author: 'Tim Advokasi LBH Ansor Banten',
    authorRole: 'Advokat Publik LBH Ansor',
    tags: ['Hukum', 'Banten'],
    readTimeMinutes: 5,
  });

  // Lawyer management state
  const [isLawyerModalOpen, setIsLawyerModalOpen] = useState(false);
  const [lawyerForm, setLawyerForm] = useState<Partial<Lawyer>>({
    name: '',
    title: 'S.H.',
    role: 'Advokat Wilayah Banten',
    regency: 'Kota Serang',
    specialization: ['Hukum Pidana', 'Hukum Perdata'],
    photoUrl: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=600&auto=format&fit=crop&q=80',
    experienceYears: 5,
    barNumber: 'PERADI BANTEN',
    isAvailable: true,
    phone: '6281288881934',
  });

  // Executive Leadership State (Pimpinan Wilayah: Ketua, Sekretaris, Bendahara)
  const getExecLeader = (roleKeyword: string, fallbackId: string, fallbackName: string, fallbackRole: string, fallbackPhoto: string) => {
    return lawyers.find(l => l.id === fallbackId) || 
           lawyers.find(l => l.role.toLowerCase().includes(roleKeyword)) || {
      id: fallbackId,
      name: fallbackName,
      title: 'S.H.',
      role: fallbackRole,
      regency: 'Kota Serang',
      specialization: ['Hukum Pidana', 'Advokasi Kebijakan Publik'],
      photoUrl: fallbackPhoto,
      experienceYears: 15,
      barNumber: 'PERADI/0821-BANTEN',
      isAvailable: true,
      phone: '6281519555391'
    };
  };

  const [execKetua, setExecKetua] = useState<Lawyer>(() => getExecLeader('ketua', 'law-rojak', 'Rojak, S.H.', 'Ketua LBH Ansor Banten', '/images/rojak_ketua.jpg'));
  const [execSekretaris, setExecSekretaris] = useState<Lawyer>(() => getExecLeader('sekretaris', 'law-mulhat', 'Mulhat, S.H., M.H.', 'Sekretaris LBH Ansor Banten', '/images/mulhat_sekretaris.jpg'));
  const [execBendahara, setExecBendahara] = useState<Lawyer>(() => getExecLeader('bendahara', 'law-dede', 'Dede Maulana Pasial, S.H., MH', 'Bendahara LBH Ansor Banten', '/images/dede_bendahara.jpg'));
  const [execLeadersSaveMsg, setExecLeadersSaveMsg] = useState('');
  const [isSavingLeaders, setIsSavingLeaders] = useState(false);
  const [hasUnsavedLeaderChanges, setHasUnsavedLeaderChanges] = useState(false);
  const [savingLeaderId, setSavingLeaderId] = useState<string | null>(null);

  useEffect(() => {
    // Never overwrite state if user is currently editing or has unsaved changes
    if (isSavingLeaders || hasUnsavedLeaderChanges) return;
    setExecKetua(getExecLeader('ketua', 'law-rojak', 'Rojak, S.H.', 'Ketua LBH Ansor Banten', '/images/rojak_ketua.jpg'));
    setExecSekretaris(getExecLeader('sekretaris', 'law-mulhat', 'Mulhat, S.H., M.H.', 'Sekretaris LBH Ansor Banten', '/images/mulhat_sekretaris.jpg'));
    setExecBendahara(getExecLeader('bendahara', 'law-dede', 'Dede Maulana Pasial, S.H., MH', 'Bendahara LBH Ansor Banten', '/images/dede_bendahara.jpg'));
  }, [lawyers]);

  const handleSaveExecutiveLeaders = async (e?: React.FormEvent, singleLeader?: Lawyer) => {
    if (e) e.preventDefault();
    setIsSavingLeaders(true);
    if (singleLeader) {
      setSavingLeaderId(singleLeader.id);
    }
    try {
      // 1. Direct synchronous atomic storage save for guaranteed persistence
      saveStoredExecutiveLeaders({
        ketua: execKetua,
        sekretaris: execSekretaris,
        bendahara: execBendahara,
      });

      // 2. React state sync in parent
      const leadersList = singleLeader ? [singleLeader] : [execKetua, execSekretaris, execBendahara];
      if (onSaveMultipleLawyers) {
        await onSaveMultipleLawyers(leadersList);
      } else {
        for (const item of leadersList) {
          await onSaveLawyer(item);
        }
      }
      setHasUnsavedLeaderChanges(false);
      setExecLeadersSaveMsg(singleLeader 
        ? `Data ${singleLeader.name} berhasil disimpan secara permanen!` 
        : 'Seluruh data nama, jabatan, dan foto Pimpinan Struktur Organisasi berhasil disimpan!');
    } catch (err) {
      console.error('Error saving executive leaders:', err);
      setExecLeadersSaveMsg('Terjadi kesalahan saat menyimpan pimpinan.');
    } finally {
      setIsSavingLeaders(false);
      setSavingLeaderId(null);
      setTimeout(() => setExecLeadersSaveMsg(''), 4500);
    }
  };

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<SiteSettings>({ ...settings });
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Menu items state
  const [menuList, setMenuList] = useState<MenuItem[]>([...menuItems]);
  const [newMenuLabel, setNewMenuLabel] = useState('');
  const [newMenuHref, setNewMenuHref] = useState('');

  // Vercel Database state
  const [vercelPostgresInput, setVercelPostgresInput] = useState(localStorage.getItem('lbh_vercel_postgres_url') || settings.vercelPostgresUrl || '');
  const [vercelKvUrlInput, setVercelKvUrlInput] = useState(localStorage.getItem('lbh_vercel_kv_url') || settings.vercelKvUrl || '');
  const [vercelKvTokenInput, setVercelKvTokenInput] = useState(localStorage.getItem('lbh_vercel_kv_token') || settings.vercelKvToken || '');
  const [vercelStatus, setVercelStatus] = useState<{ testing: boolean; message: string; success?: boolean; type?: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  // Filter cases
  const filteredCases = cases.filter(c => {
    const matchesStatus = caseFilterStatus === 'all' || c.status === caseFilterStatus;
    const matchesQuery = 
      c.ticketNumber.toLowerCase().includes(caseSearch.toLowerCase()) ||
      c.clientName.toLowerCase().includes(caseSearch.toLowerCase()) ||
      c.caseTitle.toLowerCase().includes(caseSearch.toLowerCase()) ||
      c.regency.toLowerCase().includes(caseSearch.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  const handleStatusChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCase) return;
    await onUpdateCase({
      ...editingCase,
      updatedAt: new Date().toISOString(),
    });
    setSaveSuccessMsg('Status kasus berhasil diperbarui!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleSaveSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveSettings(settingsForm);
    setSaveSuccessMsg('Pengaturan situs & identitas LBH berhasil disimpan!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  // Article submit
  const handleArticleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleForm.title || !articleForm.content) return;

    const slug = editingArticle?.slug || articleForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newArt: Article = {
      id: editingArticle?.id || `art-${Date.now()}`,
      slug,
      title: articleForm.title || '',
      category: articleForm.category || 'Edukasi Hukum',
      summary: articleForm.summary || '',
      content: articleForm.content || '',
      imageUrl: articleForm.imageUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&auto=format&fit=crop&q=80',
      author: articleForm.author || 'LBH Ansor Banten',
      authorRole: articleForm.authorRole || 'Advokat Publik',
      publishedAt: editingArticle?.publishedAt || new Date().toISOString().split('T')[0],
      readTimeMinutes: Number(articleForm.readTimeMinutes) || 5,
      tags: typeof articleForm.tags === 'string' ? (articleForm.tags as string).split(',').map(t => t.trim()) : (articleForm.tags || ['Hukum', 'Banten']),
    };

    await onSaveArticle(newArt);
    setIsArticleModalOpen(false);
    setEditingArticle(null);
    setSaveSuccessMsg('Artikel berhasil dipublikasikan!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  // Lawyer submit
  const handleLawyerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lawyerForm.name) return;

    const newLawyer: Lawyer = {
      id: lawyerForm.id || `law-${Date.now()}`,
      name: lawyerForm.name || '',
      title: lawyerForm.title || 'S.H.',
      role: lawyerForm.role || 'Advokat LBH Ansor Banten',
      regency: lawyerForm.regency || 'Kota Serang',
      specialization: Array.isArray(lawyerForm.specialization) ? lawyerForm.specialization : (lawyerForm.specialization as string || '').split(',').map(s => s.trim()),
      photoUrl: lawyerForm.photoUrl || 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=600&auto=format&fit=crop&q=80',
      experienceYears: Number(lawyerForm.experienceYears) || 5,
      barNumber: lawyerForm.barNumber || 'PERADI BANTEN',
      isAvailable: lawyerForm.isAvailable ?? true,
      phone: lawyerForm.phone || '6281288881934',
    };

    onSaveLawyer(newLawyer);
    setIsLawyerModalOpen(false);
    setSaveSuccessMsg('Data advokat berhasil diperbarui!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  // Menu item actions
  const handleAddMenu = () => {
    if (!newMenuLabel.trim() || !newMenuHref.trim()) return;
    const newItem: MenuItem = {
      id: `menu-${Date.now()}`,
      label: newMenuLabel.trim(),
      href: newMenuHref.trim(),
      isExternal: newMenuHref.startsWith('http'),
      isVisible: true,
      order: menuList.length + 1,
    };
    const updated = [...menuList, newItem];
    setMenuList(updated);
    onSaveMenuItems(updated);
    setNewMenuLabel('');
    setNewMenuHref('');
  };

  const handleToggleMenuVisible = (id: string) => {
    const updated = menuList.map(m => m.id === id ? { ...m, isVisible: !m.isVisible } : m);
    setMenuList(updated);
    onSaveMenuItems(updated);
  };

  const handleDeleteMenu = (id: string) => {
    const updated = menuList.filter(m => m.id !== id);
    setMenuList(updated);
    onSaveMenuItems(updated);
  };

  // Test Vercel Database connection
  const handleTestVercel = async () => {
    setVercelStatus({ testing: true, message: 'Menguji koneksi ke Database Vercel...' });
    localStorage.setItem('lbh_vercel_postgres_url', vercelPostgresInput.trim());
    localStorage.setItem('lbh_vercel_kv_url', vercelKvUrlInput.trim());
    localStorage.setItem('lbh_vercel_kv_token', vercelKvTokenInput.trim());
    
    const res = await testVercelConnection(
      vercelPostgresInput.trim(),
      vercelKvUrlInput.trim(),
      vercelKvTokenInput.trim()
    );
    setVercelStatus({ testing: false, message: res.message, success: res.success, type: res.type });
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(getVercelPostgresSqlSchema());
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Top Admin Header */}
      <header className="bg-emerald-950 text-white border-b border-emerald-800 shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-800 border border-amber-400/50 flex items-center justify-center text-amber-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-sm sm:text-base tracking-tight font-['Playfair_Display',serif]">
                Dashboard Pengurus • {settings.siteTitle}
              </h1>
              <p className="text-[10px] text-emerald-200">
                Panel Manajemen Perkara, Artikel, Advokat & Database Vercel
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {saveSuccessMsg && (
              <span className="hidden sm:inline-flex items-center gap-1 text-xs text-amber-300 bg-emerald-900 px-3 py-1 rounded-full border border-amber-400/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{saveSuccessMsg}</span>
              </span>
            )}
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-900 hover:bg-red-900/80 text-emerald-200 hover:text-white rounded-lg text-xs font-semibold border border-emerald-800 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar Admin</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto gap-1 py-1 no-scrollbar border-t border-emerald-900">
          {[
            { id: 'cases', label: `Manajemen Kasus (${cases.length})`, icon: FolderKanban },
            { id: 'settings', label: 'Kelola Semua Section Web & Slogan', icon: Layers },
            { id: 'lawyers', label: `Struktur Organisasi & Advokat (${lawyers.length})`, icon: Users },
            { id: 'articles', label: `Artikel & Berita (${articles.length})`, icon: Newspaper },
            { id: 'branches', label: `Posko Cabang (${branches.length})`, icon: MapPin },
            { id: 'menu', label: 'Atur Menu & Footer', icon: MenuIcon },
            { id: 'vercel', label: 'Database Vercel (Postgres & KV)', icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-t-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  active
                    ? 'bg-slate-100 text-emerald-950 border-t-2 border-amber-400'
                    : 'text-emerald-200 hover:text-white hover:bg-emerald-900/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-emerald-800' : 'text-amber-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* ================= TAB 1: CASES & WHATSAPP NOTIFICATIONS ================= */}
        {activeTab === 'cases' && (
          <div className="space-y-6">
            
            {/* Header & Filter */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between gap-3 items-center">
              <div className="w-full sm:w-auto flex-1 flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Cari no. tiket, nama pemohon, atau kasus..."
                    value={caseSearch}
                    onChange={(e) => setCaseSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>

                <select
                  value={caseFilterStatus}
                  onChange={(e) => setCaseFilterStatus(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white font-medium text-slate-700 focus:ring-2 focus:ring-emerald-700 outline-none"
                >
                  <option value="all">Semua Status</option>
                  <option value="verifikasi">Verifikasi</option>
                  <option value="ditelaah">Ditelaah</option>
                  <option value="proses">Dalam Proses</option>
                  <option value="selesai">Selesai</option>
                  <option value="ditolak">Ditolak</option>
                </select>
              </div>

              <div className="text-xs text-slate-500 font-medium">
                Menampilkan <strong>{filteredCases.length}</strong> dari {cases.length} berkas perkara
              </div>
            </div>

            {/* Cases Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200 uppercase text-[10px] text-slate-500 font-bold tracking-wider">
                    <tr>
                      <th className="p-3.5">Tiket & Tgl</th>
                      <th className="p-3.5">Pemohon & WA</th>
                      <th className="p-3.5">Wilayah & Kategori</th>
                      <th className="p-3.5">Judul Perkara</th>
                      <th className="p-3.5">Status & Advokat</th>
                      <th className="p-3.5 text-right">Aksi & Notifikasi WA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCases.map((c) => {
                      const waUrl = getWhatsAppSendUrl(c, settings.siteTitle);

                      return (
                        <tr key={c.id} className="hover:bg-emerald-50/40 transition-colors">
                          <td className="p-3.5 whitespace-nowrap">
                            <span className="font-mono font-bold text-emerald-950 block">
                              {c.ticketNumber}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(c.createdAt).toLocaleDateString('id-ID')}
                            </span>
                          </td>

                          <td className="p-3.5">
                            <span className="font-bold text-slate-900 block">
                              {c.clientName}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {c.clientPhone}
                            </span>
                          </td>

                          <td className="p-3.5 whitespace-nowrap">
                            <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-semibold mb-1">
                              {c.regency}
                            </span>
                            <span className="block text-[10px] text-slate-500 uppercase">
                              {c.category}
                            </span>
                          </td>

                          <td className="p-3.5 max-w-xs">
                            <p className="font-semibold text-slate-900 line-clamp-1">
                              {c.caseTitle}
                            </p>
                            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                              {c.chronology}
                            </p>
                            {c.evidenceFileName && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded mt-1 font-medium">
                                <FileText className="w-3 h-3" />
                                <span>{c.evidenceFileName}</span>
                              </span>
                            )}
                          </td>

                          <td className="p-3.5 whitespace-nowrap">
                            <span className="font-bold block text-[11px]">
                              {getStatusLabelIndonesian(c.status)}
                            </span>
                            <span className="text-[10px] text-slate-500 block mt-0.5">
                              {c.assignedLawyerName || 'Belum Ditunjuk'}
                            </span>
                          </td>

                          <td className="p-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* 1-Click WhatsApp Status Notification */}
                              <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                                title="Kirim Notifikasi WhatsApp Resmi ke Klien"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>Kirim WA</span>
                              </a>

                              <button
                                onClick={() => setEditingCase(c)}
                                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                                title="Edit Status & Catatan"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => {
                                  if (confirm(`Hapus berkas kasus ${c.ticketNumber}?`)) {
                                    onDeleteCase(c.id);
                                  }
                                }}
                                className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                                title="Hapus Berkas"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Edit Status Kasus */}
            {editingCase && (
              <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        {editingCase.ticketNumber}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-1">
                        Pembaruan Kasus: {editingCase.clientName}
                      </h3>
                    </div>
                    <button
                      onClick={() => setEditingCase(null)}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-600"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleStatusChangeSubmit} className="space-y-4 mt-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Status Perkara</label>
                      <select
                        value={editingCase.status}
                        onChange={(e) => setEditingCase({ ...editingCase, status: e.target.value as CaseStatus })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white outline-none focus:ring-2 focus:ring-emerald-700"
                      >
                        <option value="verifikasi">Menunggu Verifikasi Berkas</option>
                        <option value="ditelaah">Sedang Ditelaah Advokat</option>
                        <option value="proses">Dalam Proses Pendampingan / Mediasi / Sidang</option>
                        <option value="selesai">Kasus Selesai (Tuntas)</option>
                        <option value="ditolak">Ditolak / Di luar Kewenangan</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Advokat Pendamping</label>
                      <select
                        value={editingCase.assignedLawyerId || ''}
                        onChange={(e) => {
                          const law = lawyers.find(l => l.id === e.target.value);
                          setEditingCase({
                            ...editingCase,
                            assignedLawyerId: e.target.value,
                            assignedLawyerName: law?.name,
                          });
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white outline-none focus:ring-2 focus:ring-emerald-700"
                      >
                        <option value="">-- Pilih Advokat dari Daftar --</option>
                        {lawyers.map(l => (
                          <option key={l.id} value={l.id}>{l.name} ({l.role})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Catatan Tindak Lanjut untuk Klien</label>
                      <textarea
                        rows={3}
                        value={editingCase.statusNotes || ''}
                        onChange={(e) => setEditingCase({ ...editingCase, statusNotes: e.target.value })}
                        placeholder="Contoh: Berkas somasi telah dikirim ke pihak tergugat, jadwal mediasi..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-emerald-700"
                      />
                      <span className="text-[10px] text-slate-500">Catatan ini akan otomatis masuk ke template pesan WhatsApp</span>
                    </div>

                    {/* Quick WhatsApp Preview */}
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-[11px] text-emerald-900">
                      <span className="font-bold block mb-1 flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Kirim Pembaruan Ini via WhatsApp:</span>
                      </span>
                      <p className="line-clamp-2 italic text-slate-600">
                        "{editingCase.statusNotes || 'Berkas Anda sedang diproses oleh tim advokat LBH Ansor Banten.'}"
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <a
                        href={getWhatsAppSendUrl(editingCase, settings.siteTitle, editingCase.statusNotes)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Kirim WA Sekarang</span>
                      </a>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingCase(null)}
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold shadow-md"
                        >
                          Simpan Status
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ================= TAB 2: ARTICLES MANAGEMENT ================= */}
        {activeTab === 'articles' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h2 className="text-base font-bold text-slate-900">Manajemen Artikel & Konten Publikasi</h2>
                <p className="text-xs text-slate-500">Buat tulisan baru, kelola artikel edukasi hukum, dan bagikan ke media sosial.</p>
              </div>

              <button
                onClick={() => {
                  setEditingArticle(null);
                  setArticleForm({
                    title: '',
                    category: 'Edukasi Hukum',
                    summary: '',
                    content: '',
                    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&auto=format&fit=crop&q=80',
                    author: 'Tubagus M. Fahrurrozi, S.H., M.H.',
                    authorRole: 'Direktur LBH Ansor Banten',
                    tags: ['Hukum', 'Banten'],
                    readTimeMinutes: 5,
                  });
                  setIsArticleModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-amber-300" />
                <span>Unggah Postingan Baru</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((art) => (
                <div key={art.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="h-40 bg-slate-100 overflow-hidden relative">
                      <img src={art.imageUrl} alt={art.title} className="w-full h-full object-cover" />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-emerald-900/90 text-white text-[10px] font-bold uppercase">
                        {art.category}
                      </span>
                    </div>
                    <div className="p-4">
                      <div className="text-[10px] text-slate-400 mb-1">
                        {new Date(art.publishedAt).toLocaleDateString('id-ID')} • {art.readTimeMinutes} mnt baca
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-2">
                        {art.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                        {art.summary}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 text-[11px] truncate max-w-[120px]">
                      {art.author}
                    </span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => {
                          setEditingArticle(art);
                          setArticleForm({ ...art });
                          setIsArticleModalOpen(true);
                        }}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                        title="Edit Artikel"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus artikel "${art.title}"?`)) {
                            onDeleteArticle(art.id);
                          }
                        }}
                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                        title="Hapus Artikel"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Tambah/Edit Artikel */}
            {isArticleModalOpen && (
              <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 border border-slate-200 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-base font-bold text-slate-900">
                      {editingArticle ? 'Edit Konten Artikel' : 'Panel Unggah Postingan Baru'}
                    </h3>
                    <button onClick={() => setIsArticleModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleArticleSubmit} className="space-y-4 mt-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Judul Artikel / Postingan</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Tata Cara Mengajukan Gugatan Sengketa Tanah di Banten"
                        value={articleForm.title || ''}
                        onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Kategori Artikel</label>
                      <select
                        value={articleForm.category || 'Edukasi Hukum'}
                        onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white outline-none focus:ring-2 focus:ring-emerald-700"
                      >
                        <option value="Edukasi Hukum">Edukasi Hukum</option>
                        <option value="Agraria & Pertanahan">Agraria & Pertanahan</option>
                        <option value="Ketenagakerjaan">Ketenagakerjaan</option>
                        <option value="Cyber Law & Pidana">Cyber Law & Pidana</option>
                        <option value="Advokasi & Berita Ansor">Advokasi & Berita Ansor</option>
                      </select>
                    </div>

                    <div>
                      <ImageUploadField
                        label="Gambar Sampul / Thumbnail Artikel"
                        value={articleForm.imageUrl || ''}
                        onChange={(val) => setArticleForm({ ...articleForm, imageUrl: val })}
                        helpText="Pilih foto dari komputer atau masukkan link URL gambar."
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Ringkasan / Sinopsis Singkat</label>
                      <textarea
                        rows={2}
                        required
                        placeholder="Ringkasan 1-2 kalimat untuk preview di beranda dan media sosial..."
                        value={articleForm.summary || ''}
                        onChange={(e) => setArticleForm({ ...articleForm, summary: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Isi Konten Lengkap</label>
                      <textarea
                        rows={8}
                        required
                        placeholder="Tuliskan naskah lengkap artikel hukum di sini. Anda dapat menggunakan ### Sub Judul dan - Poin-poin..."
                        value={articleForm.content || ''}
                        onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono outline-none focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Nama Penulis</label>
                        <input
                          type="text"
                          value={articleForm.author || ''}
                          onChange={(e) => setArticleForm({ ...articleForm, author: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Jabatan Penulis</label>
                        <input
                          type="text"
                          value={articleForm.authorRole || ''}
                          onChange={(e) => setArticleForm({ ...articleForm, authorRole: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsArticleModalOpen(false)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold shadow-md"
                      >
                        Simpan & Publikasikan
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: LAWYERS & STRUKTUR ORGANISASI ================= */}
        {activeTab === 'lawyers' && (
          <div className="space-y-6">
            
            {/* Pimpinan Wilayah (Struktur Organisasi Eksekutif) */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border-2 border-emerald-900/20 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-wider mb-1">
                    <Award className="w-3 h-3 text-amber-700" />
                    <span>Pimpinan Wilayah Eksekutif</span>
                  </div>
                  <h2 className="text-base font-bold text-slate-900 font-['Playfair_Display',serif]">
                    Struktur Organisasi Utama (Ketua, Sekretaris, Bendahara)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Ubah data nama, gelar, jabatan, dan upload foto resmi pimpinan yang tampil di section Struktur Organisasi beranda.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={isSavingLeaders}
                  onClick={() => handleSaveExecutiveLeaders()}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer shrink-0 transition-all self-start sm:self-center"
                >
                  <Save className={`w-4 h-4 text-amber-300 ${isSavingLeaders && !savingLeaderId ? 'animate-spin' : ''}`} />
                  <span>{isSavingLeaders && !savingLeaderId ? 'Menyimpan Pimpinan...' : 'Simpan Pimpinan Organisasi'}</span>
                </button>
              </div>

              {hasUnsavedLeaderChanges && (
                <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold rounded-xl flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    Ada perubahan foto atau data pimpinan. Klik "Simpan Pimpinan Organisasi" atau tombol simpan pada masing-masing kartu untuk menyimpan secara permanen.
                  </span>
                  <button
                    type="button"
                    disabled={isSavingLeaders}
                    onClick={() => handleSaveExecutiveLeaders()}
                    className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold shrink-0 cursor-pointer shadow-xs"
                  >
                    Simpan Sekarang
                  </button>
                </div>
              )}

              {execLeadersSaveMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{execLeadersSaveMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pt-1">
                {/* Ketua */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                        1. Ketua Lembaga
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">law-rojak</span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Nama Lengkap & Gelar</label>
                      <input
                        type="text"
                        value={execKetua.name}
                        onChange={(e) => {
                          setExecKetua({ ...execKetua, name: e.target.value });
                          setHasUnsavedLeaderChanges(true);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs outline-none bg-white focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Jabatan Resmi</label>
                      <input
                        type="text"
                        value={execKetua.role}
                        onChange={(e) => {
                          setExecKetua({ ...execKetua, role: e.target.value });
                          setHasUnsavedLeaderChanges(true);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs outline-none bg-white focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>

                    <ImageUploadField
                      label="Foto Ketua (File / URL)"
                      value={execKetua.photoUrl}
                      onChange={(val) => {
                        setExecKetua({ ...execKetua, photoUrl: val });
                        setHasUnsavedLeaderChanges(true);
                      }}
                      helpText="Gunakan foto portrait resmi jas/atribut LBH Ansor."
                      previewHeight="h-16 w-14"
                    />
                  </div>

                  <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between mt-2">
                    <span className="text-[10px] text-slate-400 font-mono">Status: Pimpinan 1</span>
                    <button
                      type="button"
                      disabled={isSavingLeaders}
                      onClick={() => handleSaveExecutiveLeaders(undefined, execKetua)}
                      className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-[11px] font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Save className={`w-3.5 h-3.5 text-amber-300 ${savingLeaderId === execKetua.id ? 'animate-spin' : ''}`} />
                      <span>{savingLeaderId === execKetua.id ? 'Menyimpan...' : 'Simpan Data Ketua'}</span>
                    </button>
                  </div>
                </div>

                {/* Sekretaris */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                        2. Sekretaris Lembaga
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">law-mulhat</span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Nama Lengkap & Gelar</label>
                      <input
                        type="text"
                        value={execSekretaris.name}
                        onChange={(e) => {
                          setExecSekretaris({ ...execSekretaris, name: e.target.value });
                          setHasUnsavedLeaderChanges(true);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs outline-none bg-white focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Jabatan Resmi</label>
                      <input
                        type="text"
                        value={execSekretaris.role}
                        onChange={(e) => {
                          setExecSekretaris({ ...execSekretaris, role: e.target.value });
                          setHasUnsavedLeaderChanges(true);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs outline-none bg-white focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>

                    <ImageUploadField
                      label="Foto Sekretaris (File / URL)"
                      value={execSekretaris.photoUrl}
                      onChange={(val) => {
                        setExecSekretaris({ ...execSekretaris, photoUrl: val });
                        setHasUnsavedLeaderChanges(true);
                      }}
                      helpText="Gunakan foto portrait resmi jas/atribut LBH Ansor."
                      previewHeight="h-16 w-14"
                    />
                  </div>

                  <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between mt-2">
                    <span className="text-[10px] text-slate-400 font-mono">Status: Pimpinan 2</span>
                    <button
                      type="button"
                      disabled={isSavingLeaders}
                      onClick={() => handleSaveExecutiveLeaders(undefined, execSekretaris)}
                      className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-[11px] font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Save className={`w-3.5 h-3.5 text-amber-300 ${savingLeaderId === execSekretaris.id ? 'animate-spin' : ''}`} />
                      <span>{savingLeaderId === execSekretaris.id ? 'Menyimpan...' : 'Simpan Data Sekretaris'}</span>
                    </button>
                  </div>
                </div>

                {/* Bendahara */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                        3. Bendahara Lembaga
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">law-dede</span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Nama Lengkap & Gelar</label>
                      <input
                        type="text"
                        value={execBendahara.name}
                        onChange={(e) => {
                          setExecBendahara({ ...execBendahara, name: e.target.value });
                          setHasUnsavedLeaderChanges(true);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs outline-none bg-white focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Jabatan Resmi</label>
                      <input
                        type="text"
                        value={execBendahara.role}
                        onChange={(e) => {
                          setExecBendahara({ ...execBendahara, role: e.target.value });
                          setHasUnsavedLeaderChanges(true);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs outline-none bg-white focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>

                    <ImageUploadField
                      label="Foto Bendahara (File / URL)"
                      value={execBendahara.photoUrl}
                      onChange={(val) => {
                        setExecBendahara({ ...execBendahara, photoUrl: val });
                        setHasUnsavedLeaderChanges(true);
                      }}
                      helpText="Gunakan foto portrait resmi jas/atribut LBH Ansor."
                      previewHeight="h-16 w-14"
                    />
                  </div>

                  <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between mt-2">
                    <span className="text-[10px] text-slate-400 font-mono">Status: Pimpinan 3</span>
                    <button
                      type="button"
                      disabled={isSavingLeaders}
                      onClick={() => handleSaveExecutiveLeaders(undefined, execBendahara)}
                      className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-[11px] font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Save className={`w-3.5 h-3.5 text-amber-300 ${savingLeaderId === execBendahara.id ? 'animate-spin' : ''}`} />
                      <span>{savingLeaderId === execBendahara.id ? 'Menyimpan...' : 'Simpan Data Bendahara'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h2 className="text-base font-bold text-slate-900">Direktori Advokat & Paralegal Wilayah</h2>
                <p className="text-xs text-slate-500">Kelola daftar seluruh profil advokat dan paralegal yang siap melayani konsultasi warga Banten.</p>
              </div>

              <button
                onClick={() => {
                  setLawyerForm({
                    name: '',
                    title: 'S.H.',
                    role: 'Advokat LBH Ansor',
                    regency: 'Kota Serang',
                    specialization: ['Hukum Pidana', 'Perdata'],
                    photoUrl: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=600&auto=format&fit=crop&q=80',
                    experienceYears: 6,
                    barNumber: 'PERADI BANTEN',
                    isAvailable: true,
                    phone: '6281288881934',
                  });
                  setIsLawyerModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4 text-amber-300" />
                <span>Tambah Advokat</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {lawyers.map((l) => (
                <div key={l.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center gap-4">
                  <img src={l.photoUrl} alt={l.name} className="w-16 h-16 rounded-xl object-cover border border-slate-200" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 truncate">{l.name}</h4>
                    <p className="text-xs text-emerald-700 font-medium truncate">{l.role}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{l.regency} • {l.experienceYears} Thn Pengalaman</p>
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1.5 ${
                      l.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {l.isAvailable ? 'Tersedia' : 'Sedang Sidang'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => {
                        setLawyerForm({ ...l });
                        setIsLawyerModalOpen(true);
                      }}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
                      title="Edit Advokat"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Hapus advokat ${l.name}?`)) onDeleteLawyer(l.id);
                      }}
                      className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Tambah/Edit Advokat */}
            {isLawyerModalOpen && (
              <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-base font-bold text-slate-900">
                      {lawyerForm.id ? 'Edit Data Advokat' : 'Tambah Advokat Baru'}
                    </h3>
                    <button onClick={() => setIsLawyerModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleLawyerSubmit} className="space-y-3.5 mt-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Nama Lengkap & Gelar</label>
                      <input
                        type="text"
                        required
                        value={lawyerForm.name || ''}
                        onChange={(e) => setLawyerForm({ ...lawyerForm, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Jabatan / Peran</label>
                        <input
                          type="text"
                          value={lawyerForm.role || ''}
                          onChange={(e) => setLawyerForm({ ...lawyerForm, role: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Wilayah Tugas</label>
                        <input
                          type="text"
                          value={lawyerForm.regency || ''}
                          onChange={(e) => setLawyerForm({ ...lawyerForm, regency: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Spesialisasi (Pisahkan Koma)</label>
                      <input
                        type="text"
                        value={Array.isArray(lawyerForm.specialization) ? lawyerForm.specialization.join(', ') : (lawyerForm.specialization || '')}
                        onChange={(e) => setLawyerForm({ ...lawyerForm, specialization: e.target.value.split(',').map(s => s.trim()) })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none"
                      />
                    </div>

                    <div>
                      <ImageUploadField
                        label="Foto Profil Advokat"
                        value={lawyerForm.photoUrl || ''}
                        onChange={(val) => setLawyerForm({ ...lawyerForm, photoUrl: val })}
                        helpText="Pilih foto dari komputer atau masukkan link URL."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">No. WhatsApp</label>
                        <input
                          type="text"
                          value={lawyerForm.phone || ''}
                          onChange={(e) => setLawyerForm({ ...lawyerForm, phone: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Status Ketersediaan</label>
                        <select
                          value={lawyerForm.isAvailable ? 'true' : 'false'}
                          onChange={(e) => setLawyerForm({ ...lawyerForm, isAvailable: e.target.value === 'true' })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white outline-none"
                        >
                          <option value="true">Tersedia untuk Konsultasi</option>
                          <option value="false">Sedang Sidang / Penuh</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsLawyerModalOpen(false)}
                        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-emerald-800 text-white rounded-xl font-bold"
                      >
                        Simpan Advokat
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 4: BRANCHES MANAGEMENT ================= */}
        {activeTab === 'branches' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h2 className="text-base font-bold text-slate-900">Daftar Kantor Posko Bantuan Hukum Banten</h2>
              <p className="text-xs text-slate-500 mt-0.5">8 Kantor Wilayah dan Cabang LBH GP Ansor di Provinsi Banten.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {branches.map((b) => (
                <div key={b.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      {b.regency}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{b.name}</h4>
                    <p className="text-xs text-slate-600 mt-1">{b.address}</p>
                    <p className="text-[11px] text-slate-500 mt-1">Telp: {b.phone} • {b.operationalHours}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <a
                      href={b.googleMapsUrl || `https://maps.google.com/?q=${b.latitude},${b.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 font-semibold flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Buka Maps</span>
                    </a>
                    <span className="text-[10px] text-slate-400">Lat: {b.latitude}, Lng: {b.longitude}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 5: KELOLA SEMUA SECTION WEB & SLOGAN ================= */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-4xl mx-auto space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold uppercase tracking-wider mb-1">
                <Layers className="w-3 h-3 text-emerald-700" />
                <span>Pusat Kendali Konten Website</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 font-['Playfair_Display',serif]">
                Kelola Semua Section Website & Slogan
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Atur logo resmi, slogan "Suara Kebenaran, Jalan Keadilan", emblem Fiat Justitia (tanpa border kotak), 4 pilar hukum, teks struktur organisasi, kontak, dan keamanan.
              </p>
            </div>

            <form onSubmit={handleSaveSettingsSubmit} className="space-y-6 text-xs">
              
              {/* SECTION 1: SLOGAN & HERO BANNER */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span>1. Slogan Utama & Banner Hero (Suara Kebenaran, Jalan Keadilan)</span>
                  </h3>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-200 text-slate-700">Tampil Paling Atas</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Heading Utama Banner</label>
                    <input
                      type="text"
                      required
                      placeholder="Suara Kebenaran, Jalan Keadilan"
                      value={settingsForm.heroHeading || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, heroHeading: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tagline Slogan Web</label>
                    <input
                      type="text"
                      placeholder="Suara Kebenaran, Jalan Keadilan"
                      value={settingsForm.siteTagline || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, siteTagline: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subheading / Deskripsi Penjelasan Hero</label>
                  <textarea
                    rows={2}
                    value={settingsForm.heroSubheading || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroSubheading: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                  />
                </div>

                <ImageUploadField
                  label="Gambar Latar Belakang Hero Banner"
                  value={settingsForm.heroBannerUrl || ''}
                  onChange={(val) => setSettingsForm({ ...settingsForm, heroBannerUrl: val })}
                  helpText="Unggah gambar latar belakang megah gedung pengadilan atau kegiatan advokasi."
                  previewHeight="h-16 w-24"
                />
              </div>

              {/* SECTION 2: CENTERPIECE FIAT JUSTITIA RUAT CAELUM & OFFICIAL LOGO */}
              <div className="p-5 bg-emerald-950 text-white rounded-2xl border-2 border-amber-400/40 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-800 pb-3">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded bg-amber-400 text-emerald-950 text-[10px] font-extrabold uppercase tracking-wider mb-1">
                      Centerpiece Resmi Tanpa Border Kotak
                    </span>
                    <h3 className="font-bold text-amber-300 text-sm flex items-center gap-2 font-['Playfair_Display',serif]">
                      <Scale className="w-4 h-4 text-amber-400" />
                      <span>2. Emblem Logo Resmi & Fiat Justitia Ruat Caelum</span>
                    </h3>
                  </div>
                  <span className="text-[11px] text-emerald-300 bg-emerald-900/80 px-2.5 py-1 rounded-lg border border-emerald-700 self-start">
                    ✨ Border kotak lama telah dihilangkan
                  </span>
                </div>

                <div className="bg-emerald-900/60 p-3 rounded-xl border border-emerald-800 text-[11px] text-emerald-200">
                  Logo resmi LBH Gerakan Pemuda Ansor Banten kini tampil mengambang resmi, bulat alami dengan efek halo keemasan halus, tanpa ada kotak border yang mengganggu.
                </div>

                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-emerald-800">
                  <ImageUploadField
                    label="Gambar / Logo Centerpiece (Official Logo LBH Ansor Banten)"
                    value={settingsForm.centerpieceLogoUrl || ''}
                    onChange={(val) => setSettingsForm({ ...settingsForm, centerpieceLogoUrl: val })}
                    presetOfficialLogo={true}
                    helpText="Klik tombol 'Pasang Logo Resmi LBH GP Ansor Banten' untuk menggunakan logo vektor resmi, atau upload gambar/foto pilihan Anda."
                    previewHeight="h-16 w-16"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div>
                    <label className="block font-bold text-emerald-200 mb-1">Badge Teks Atas</label>
                    <input
                      type="text"
                      placeholder="⚖️ FIAT JUSTITIA RUAT CAELUM"
                      value={settingsForm.centerpieceBadge || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, centerpieceBadge: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-emerald-700 bg-emerald-900/80 text-white text-xs outline-none focus:ring-2 focus:ring-amber-400 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-emerald-200 mb-1">Motto Terjemahan</label>
                    <input
                      type="text"
                      placeholder='"Tegakkan Keadilan Walau Langit Akan Runtuh"'
                      value={settingsForm.centerpieceMotto || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, centerpieceMotto: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-emerald-700 bg-emerald-900/80 text-white text-xs outline-none focus:ring-2 focus:ring-amber-400 italic"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-emerald-200 mb-1">Subjudul Centerpiece</label>
                    <input
                      type="text"
                      placeholder="Khidmah Penegakan Hukum & Advokasi Kerakyatan"
                      value={settingsForm.centerpieceSubheading || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, centerpieceSubheading: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-emerald-700 bg-emerald-900/80 text-white text-xs outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: STRUKTUR ORGANISASI TEKS BERANDA */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-700"></span>
                    <span>3. Teks Header Section Struktur Organisasi</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('lawyers')}
                    className="text-emerald-800 hover:text-emerald-950 font-bold text-[11px] underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Ubah Foto & Data Pimpinan (Ketua, Sekr, Bend) di Tab Advokat →</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Judul Section Struktur</label>
                    <input
                      type="text"
                      value={settingsForm.orgSectionTitle || 'Struktur Organisasi'}
                      onChange={(e) => setSettingsForm({ ...settingsForm, orgSectionTitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none bg-white focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Deskripsi Subjudul Section Struktur</label>
                    <textarea
                      rows={2}
                      value={settingsForm.orgSectionSubtitle || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, orgSectionSubtitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none bg-white focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: 4 PILAR LAYANAN LBH ANSOR BANTEN */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                    <span>4. Empat Pilar Khidmah & Layanan Hukum LBH Ansor</span>
                  </h3>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-200 text-slate-700">Kartu di Beranda</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Pilar 1 */}
                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Pilar 1</span>
                    <input
                      type="text"
                      placeholder="Judul Pilar 1"
                      value={settingsForm.pillar1Title || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, pillar1Title: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                    <textarea
                      rows={2}
                      placeholder="Deskripsi Pilar 1"
                      value={settingsForm.pillar1Desc || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, pillar1Desc: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-[11px] outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  {/* Pilar 2 */}
                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Pilar 2</span>
                    <input
                      type="text"
                      placeholder="Judul Pilar 2"
                      value={settingsForm.pillar2Title || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, pillar2Title: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                    <textarea
                      rows={2}
                      placeholder="Deskripsi Pilar 2"
                      value={settingsForm.pillar2Desc || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, pillar2Desc: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-[11px] outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  {/* Pilar 3 */}
                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Pilar 3</span>
                    <input
                      type="text"
                      placeholder="Judul Pilar 3"
                      value={settingsForm.pillar3Title || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, pillar3Title: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                    <textarea
                      rows={2}
                      placeholder="Deskripsi Pilar 3"
                      value={settingsForm.pillar3Desc || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, pillar3Desc: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-[11px] outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  {/* Pilar 4 */}
                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Pilar 4</span>
                    <input
                      type="text"
                      placeholder="Judul Pilar 4"
                      value={settingsForm.pillar4Title || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, pillar4Title: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                    <textarea
                      rows={2}
                      placeholder="Deskripsi Pilar 4"
                      value={settingsForm.pillar4Desc || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, pillar4Desc: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-[11px] outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 5: AJAKAN KONSULTASI / CTA BANNER */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3.5">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  <span>5. Banner Ajakan Konsultasi Hukum (Call-to-Action)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Judul Ajakan (Heading)</label>
                    <input
                      type="text"
                      value={settingsForm.ctaHeading || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, ctaHeading: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none bg-white focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Subjudul Ajakan</label>
                    <input
                      type="text"
                      value={settingsForm.ctaSubheading || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, ctaSubheading: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none bg-white focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Teks Tombol CTA</label>
                    <input
                      type="text"
                      value={settingsForm.ctaButtonText || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, ctaButtonText: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none bg-white focus:ring-2 focus:ring-emerald-700 font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 6: IDENTITAS SITUS, LOGO & KONTAK */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
                  <span>6. Identitas Lembaga, Logo Header & Kontak Resmi</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nama Resmi Lembaga (Site Title)</label>
                    <input
                      type="text"
                      required
                      value={settingsForm.siteTitle}
                      onChange={(e) => setSettingsForm({ ...settingsForm, siteTitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none bg-white focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Hotline WhatsApp (Format: 628...)</label>
                    <input
                      type="text"
                      value={settingsForm.hotlineWhatsapp}
                      onChange={(e) => setSettingsForm({ ...settingsForm, hotlineWhatsapp: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none bg-white focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                </div>

                <ImageUploadField
                  label="Logo Header Navigasi Website"
                  value={settingsForm.siteLogoUrl}
                  onChange={(val) => setSettingsForm({ ...settingsForm, siteLogoUrl: val })}
                  presetOfficialLogo={true}
                  helpText="Logo resmi yang tampil di bilah atas / navbar website."
                  previewHeight="h-14 w-14"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email Resmi</label>
                    <input
                      type="email"
                      value={settingsForm.officialEmail}
                      onChange={(e) => setSettingsForm({ ...settingsForm, officialEmail: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none bg-white focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Alamat Gedung Kantor Pusat</label>
                    <input
                      type="text"
                      value={settingsForm.headquartersAddress}
                      onChange={(e) => setSettingsForm({ ...settingsForm, headquartersAddress: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none bg-white focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Deskripsi Footer Lembaga</label>
                  <textarea
                    rows={2}
                    value={settingsForm.footerAbout || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, footerAbout: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none bg-white focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              {/* SECTION 7: KEAMANAN PIN ADMIN */}
              <div className="p-5 bg-amber-50/70 rounded-2xl border border-amber-300 space-y-2">
                <label className="block font-bold text-amber-950 flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-amber-700" />
                  <span>7. Keamanan Admin: Ganti PIN Rahasia Login</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={settingsForm.adminPin}
                    onChange={(e) => setSettingsForm({ ...settingsForm, adminPin: e.target.value })}
                    className="w-full sm:w-64 px-3 py-2 rounded-xl border border-amber-400 text-xs bg-white font-mono font-bold outline-none"
                  />
                  <span className="text-[11px] text-amber-900 font-medium">PIN aktif saat ini</span>
                </div>
                <p className="text-[10px] text-amber-800">
                  Simpan PIN ini baik-baik. Jangan berikan kepada pihak luar tanpa persetujuan pimpinan LBH.
                </p>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="pt-3 flex items-center justify-between border-t border-slate-200">
                <span className="text-xs text-slate-500">
                  Perubahan akan langsung tersimpan dan tampil di website beranda.
                </span>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-7 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-lg cursor-pointer transition-all hover:scale-[1.01]"
                >
                  <Save className="w-4 h-4 text-amber-300" />
                  <span>Simpan Semua Perubahan Section</span>
                </button>
              </div>

            </form>
          </div>
        )}

        {/* ================= TAB 6: MENU & FOOTER MANAGEMENT ================= */}
        {activeTab === 'menu' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-4xl mx-auto space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-['Playfair_Display',serif]">
                Pengaturan Menu Navigasi & Konten Footer
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Kelola tautan menu navigasi website (tambah, hapus, tampilkan/sembunyikan) serta teks deskripsi footer.
              </p>
            </div>

            {/* Menu List */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <MenuIcon className="w-4 h-4 text-emerald-800" />
                <span>Daftar Menu Navigasi Website</span>
              </h3>

              <div className="space-y-2">
                {menuList.map((m) => (
                  <div key={m.id} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl text-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-[10px]">
                        {m.order}
                      </span>
                      <div>
                        <span className="font-bold text-slate-900">{m.label}</span>
                        <span className="text-slate-400 ml-2 font-mono text-[10px]">{m.href}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleMenuVisible(m.id)}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                          m.isVisible ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {m.isVisible ? 'Aktif' : 'Disembunyikan'}
                      </button>

                      <button
                        onClick={() => handleDeleteMenu(m.id)}
                        className="p-1 text-red-500 hover:text-red-700"
                        title="Hapus Menu"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Menu Form */}
              <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Label Menu (Contoh: Berita Ansor)"
                  value={newMenuLabel}
                  onChange={(e) => setNewMenuLabel(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none"
                />
                <input
                  type="text"
                  placeholder="Link Tujuan (Contoh: #artikel atau https://...)"
                  value={newMenuHref}
                  onChange={(e) => setNewMenuHref(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none"
                />
                <button
                  onClick={handleAddMenu}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shrink-0 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Menu</span>
                </button>
              </div>
            </div>

            {/* Footer Settings */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <h3 className="font-bold text-slate-800 text-sm">Teks Tentang LBH di Footer</h3>
              <textarea
                rows={3}
                value={settingsForm.footerAbout}
                onChange={(e) => setSettingsForm({ ...settingsForm, footerAbout: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-emerald-700"
              />

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleSaveSettingsSubmit}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  Simpan Perubahan Footer
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 7: VERCEL DATABASE & STORAGE ================= */}
        {activeTab === 'vercel' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-4xl mx-auto space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black text-white text-xs font-bold uppercase tracking-wider mb-2">
                <Database className="w-3.5 h-3.5 text-amber-400" />
                <span>Teknologi Database Vercel (Postgres & KV)</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 font-['Playfair_Display',serif]">
                Integrasi Database Vercel & Sinkronisasi Cloud
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Gunakan ekosistem database resmi dari Vercel (<strong>Vercel Postgres</strong> untuk relational database SQL atau <strong>Vercel KV</strong> untuk key-value sync) agar data perkara, konsultasi masyarakat, artikel, dan pengaturan LBH GP Ansor Banten tersimpan live dan permanen di Vercel.
              </p>
            </div>

            {/* Vercel Connection Form */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  <span>1. Kredensial Database Vercel Proyek Anda</span>
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {isVercelDbConfigured() ? '✓ Terkonfigurasi' : 'Mode Offline / Local Storage'}
                </span>
              </div>

              <div className="space-y-4 text-xs">
                {/* Option A: Vercel Postgres */}
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-white text-[10px]">Opsi A</span>
                      <span>Vercel Postgres URL (POSTGRES_URL)</span>
                    </label>
                    <span className="text-[10px] text-slate-500">Direkomendasikan untuk SQL</span>
                  </div>
                  <input
                    type="text"
                    placeholder="postgres://default:xyz...@ep-cool-fog-123.us-east-1.postgres.vercel-storage.com/verceldb?sslmode=require"
                    value={vercelPostgresInput}
                    onChange={(e) => setVercelPostgresInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs outline-none focus:ring-2 focus:ring-emerald-700 bg-slate-50/50"
                  />
                  <span className="text-[10px] text-slate-500 block">
                    Dapatkan otomatis di Vercel Dashboard &gt; Storage &gt; Postgres &gt; .env.local &gt; POSTGRES_URL.
                  </span>
                </div>

                {/* Option B: Vercel KV */}
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-bold">Opsi B</span>
                      <span>Vercel KV REST API (KV_REST_API_URL &amp; TOKEN)</span>
                    </label>
                    <span className="text-[10px] text-slate-500">Sinkronisasi Realtime HTTP</span>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1 text-[11px]">KV_REST_API_URL</label>
                    <input
                      type="text"
                      placeholder="https://pleasing-possum-12345.upstash.io"
                      value={vercelKvUrlInput}
                      onChange={(e) => setVercelKvUrlInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs outline-none focus:ring-2 focus:ring-emerald-700 bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1 text-[11px]">KV_REST_API_TOKEN</label>
                    <input
                      type="text"
                      placeholder="AXYZab12345..."
                      value={vercelKvTokenInput}
                      onChange={(e) => setVercelKvTokenInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs outline-none focus:ring-2 focus:ring-emerald-700 bg-slate-50/50"
                    />
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-2 items-center">
                  <button
                    type="button"
                    onClick={handleTestVercel}
                    disabled={vercelStatus?.testing}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl font-bold text-xs shadow-md transition-all hover:scale-[1.01] disabled:opacity-50 cursor-pointer flex items-center gap-2"
                  >
                    <Database className="w-3.5 h-3.5 text-amber-400" />
                    <span>{vercelStatus?.testing ? 'Menguji Koneksi Vercel...' : 'Test & Simpan Koneksi Database Vercel'}</span>
                  </button>
                </div>

                {vercelStatus && (
                  <div className={`p-3.5 rounded-xl border text-xs font-medium flex items-center gap-2.5 ${
                    vercelStatus.success
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-amber-50 border-amber-300 text-amber-900'
                  }`}>
                    {vercelStatus.success ? <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" /> : <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />}
                    <span>{vercelStatus.message}</span>
                  </div>
                )}
              </div>
            </div>

            {/* SQL Schema Generator for Vercel Postgres */}
            <div className="p-5 bg-slate-900 text-slate-100 rounded-2xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-amber-400" />
                    <span>Skema SQL Resmi untuk Vercel Postgres</span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Salin script ini dan jalankan pada tab <strong>Query</strong> di menu Vercel Postgres Dashboard untuk membuat seluruh tabel otomatis.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5 text-amber-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'Tersalin!' : 'Salin Skema SQL'}</span>
                </button>
              </div>

              <pre className="p-3.5 bg-slate-950 rounded-xl text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-52 border border-slate-800 leading-relaxed">
                {getVercelPostgresSqlSchema()}
              </pre>
            </div>

            {/* Vercel Deployment Guide */}
            <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-3.5 text-xs text-slate-700">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <ExternalLink className="w-4 h-4 text-emerald-700" />
                <span>Panduan Praktis Setup Database di Vercel (vercel.com):</span>
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-slate-600 leading-relaxed">
                <li>Buka akun Anda di <strong>vercel.com</strong> dan import repository GitHub LBH Ansor Banten ini.</li>
                <li>Di dashboard proyek Vercel Anda, buka tab <strong>Storage</strong> di bilah atas.</li>
                <li>Klik tombol <strong>Create Database</strong>, lalu pilih <strong>Postgres</strong> (atau <strong>KV</strong>).</li>
                <li>Beri nama database (misalnya: <code>lbh-ansor-db</code>) dan klik <strong>Create</strong>.</li>
                <li>Klik <strong>Connect to Project</strong> dan pilih proyek Anda. Vercel secara otomatis menambahkan variabel <code>POSTGRES_URL</code> ke Environment Variables proyek Anda!</li>
                <li>Di halaman Vercel Postgres, klik tab <strong>Query</strong>, tempelkan <strong>Skema SQL</strong> di atas, lalu klik tombol <strong>Run</strong>.</li>
                <li>Selesai! Website LBH GP Ansor Banten Anda siap live dengan database Vercel yang cepat, andal, dan aman.</li>
              </ol>
            </div>

          </div>
        )}

      </main>
    </div>
  );
};
