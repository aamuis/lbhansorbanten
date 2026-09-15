import React, { useState } from 'react';
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
  Eye
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
import { testSupabaseConnection, getSupabaseSqlSchema, isSupabaseConfigured } from '../lib/supabase';

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
  onDeleteLawyer,
  branches,
  onSaveBranch,
  onDeleteBranch,
  settings,
  onSaveSettings,
  menuItems,
  onSaveMenuItems,
}) => {
  const [activeTab, setActiveTab] = useState<'cases' | 'articles' | 'lawyers' | 'branches' | 'settings' | 'menu' | 'supabase'>('cases');

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

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<SiteSettings>({ ...settings });
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Menu items state
  const [menuList, setMenuList] = useState<MenuItem[]>([...menuItems]);
  const [newMenuLabel, setNewMenuLabel] = useState('');
  const [newMenuHref, setNewMenuHref] = useState('');

  // Supabase test state
  const [supabaseUrlInput, setSupabaseUrlInput] = useState(localStorage.getItem('lbh_supabase_url') || settings.supabaseUrl || '');
  const [supabaseKeyInput, setSupabaseKeyInput] = useState(localStorage.getItem('lbh_supabase_anon_key') || settings.supabaseAnonKey || '');
  const [supabaseStatus, setSupabaseStatus] = useState<{ testing: boolean; message: string; success?: boolean } | null>(null);
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

  // Test Supabase connection
  const handleTestSupabase = async () => {
    setSupabaseStatus({ testing: true, message: 'Menghubungkan ke Supabase...' });
    localStorage.setItem('lbh_supabase_url', supabaseUrlInput.trim());
    localStorage.setItem('lbh_supabase_anon_key', supabaseKeyInput.trim());
    
    const res = await testSupabaseConnection(supabaseUrlInput.trim(), supabaseKeyInput.trim());
    setSupabaseStatus({ testing: false, message: res.message, success: res.success });
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(getSupabaseSqlSchema());
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
                Panel Manajemen Perkara, Artikel, Advokat & Sinkronisasi Supabase
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
            { id: 'articles', label: `Artikel & Berita (${articles.length})`, icon: Newspaper },
            { id: 'lawyers', label: `Advokat (${lawyers.length})`, icon: Users },
            { id: 'branches', label: `Posko Cabang (${branches.length})`, icon: MapPin },
            { id: 'settings', label: 'Identitas & Banner', icon: Settings },
            { id: 'menu', label: 'Atur Menu & Footer', icon: MenuIcon },
            { id: 'supabase', label: 'Database Supabase & Vercel', icon: Database },
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Kategori</label>
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
                        <label className="block font-bold text-slate-700 mb-1">URL Gambar Thumbnail</label>
                        <input
                          type="text"
                          placeholder="https://images.unsplash.com/..."
                          value={articleForm.imageUrl || ''}
                          onChange={(e) => setArticleForm({ ...articleForm, imageUrl: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-emerald-700"
                        />
                      </div>
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

        {/* ================= TAB 3: LAWYERS MANAGEMENT ================= */}
        {activeTab === 'lawyers' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h2 className="text-base font-bold text-slate-900">Direktori Advokat & Paralegal</h2>
                <p className="text-xs text-slate-500">Kelola daftar profil advokat yang siap melayani konsultasi warga Banten.</p>
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
                      <label className="block font-bold text-slate-700 mb-1">URL Foto Profil</label>
                      <input
                        type="text"
                        value={lawyerForm.photoUrl || ''}
                        onChange={(e) => setLawyerForm({ ...lawyerForm, photoUrl: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none"
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

        {/* ================= TAB 5: SITE SETTINGS, LOGO & BANNER ================= */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-4xl mx-auto space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-['Playfair_Display',serif]">
                Pengaturan Identitas Situs, Logo & Hero Banner
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Ubah nama lembaga, logo, tagline, gambar banner utama, hotline WhatsApp, dan PIN keamanan admin.
              </p>
            </div>

            <form onSubmit={handleSaveSettingsSubmit} className="space-y-4 text-xs">
              
              {/* Logo & Judul */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-800" />
                  <span>Logo & Judul Website</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Judul Website (Title)</label>
                    <input
                      type="text"
                      required
                      value={settingsForm.siteTitle}
                      onChange={(e) => setSettingsForm({ ...settingsForm, siteTitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tagline Slogan</label>
                    <input
                      type="text"
                      value={settingsForm.siteTagline}
                      onChange={(e) => setSettingsForm({ ...settingsForm, siteTagline: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">URL Logo Lembaga (Gambar PNG/JPG)</label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="text"
                      value={settingsForm.siteLogoUrl}
                      onChange={(e) => setSettingsForm({ ...settingsForm, siteLogoUrl: e.target.value })}
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                    <div className="w-10 h-10 rounded-lg bg-emerald-950 p-1 shrink-0 flex items-center justify-center border border-amber-400">
                      <img src={settingsForm.siteLogoUrl} alt="Preview Logo" className="w-full h-full object-cover rounded" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Banner & Hero Section */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <Newspaper className="w-4 h-4 text-emerald-800" />
                  <span>Gambar & Teks Banner Utama (Hero Header)</span>
                </h3>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">URL Gambar Banner</label>
                  <input
                    type="text"
                    value={settingsForm.heroBannerUrl}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroBannerUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Heading Banner Utama</label>
                  <input
                    type="text"
                    value={settingsForm.heroHeading}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroHeading: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subheading / Deskripsi Banner</label>
                  <textarea
                    rows={2}
                    value={settingsForm.heroSubheading}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroSubheading: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              {/* Kontak & Hotline */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 text-emerald-800" />
                  <span>Kontak Resmi & Hotline WhatsApp</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nomor WhatsApp Hotline (Format: 628...)</label>
                    <input
                      type="text"
                      value={settingsForm.hotlineWhatsapp}
                      onChange={(e) => setSettingsForm({ ...settingsForm, hotlineWhatsapp: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email Resmi</label>
                    <input
                      type="email"
                      value={settingsForm.officialEmail}
                      onChange={(e) => setSettingsForm({ ...settingsForm, officialEmail: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Alamat Gedung Kantor Pusat</label>
                  <input
                    type="text"
                    value={settingsForm.headquartersAddress}
                    onChange={(e) => setSettingsForm({ ...settingsForm, headquartersAddress: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              {/* PIN Keamanan Admin */}
              <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-2">
                <label className="block font-bold text-amber-950 flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-amber-700" />
                  <span>Ganti PIN Rahasia Login Admin</span>
                </label>
                <input
                  type="text"
                  value={settingsForm.adminPin}
                  onChange={(e) => setSettingsForm({ ...settingsForm, adminPin: e.target.value })}
                  className="w-full sm:w-64 px-3 py-2 rounded-xl border border-amber-300 text-xs bg-white font-mono font-bold outline-none"
                />
                <p className="text-[10px] text-amber-800">
                  Simpan PIN ini baik-baik. Jangan berikan kepada pihak luar tanpa persetujuan pimpinan LBH.
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all"
                >
                  <Save className="w-4 h-4 text-amber-300" />
                  <span>Simpan Semua Pengaturan</span>
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

        {/* ================= TAB 7: SUPABASE & VERCEL INTEGRATION ================= */}
        {activeTab === 'supabase' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-4xl mx-auto space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
                <Database className="w-3.5 h-3.5" />
                <span>Hosting Gratis Vercel & Supabase Cloud</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 font-['Playfair_Display',serif]">
                Integrasi Database Supabase & Panduan Deploy Vercel
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Supabase menyediakan database PostgreSQL gratis untuk menyimpan seluruh kasus, artikel, dan pengaturan secara permanen ketika website LBH Ansor Banten di-hosting secara publik di Vercel.
              </p>
            </div>

            {/* Supabase Connection Form */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Kredensial Supabase Proyek Anda</h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Supabase Project URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://xyzabcdefghijklm.supabase.co"
                    value={supabaseUrlInput}
                    onChange={(e) => setSupabaseUrlInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                  <span className="text-[10px] text-slate-400">Dapatkan di Dashboard Supabase &gt; Project Settings &gt; API &gt; Project URL</span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Supabase Anon Public API Key
                  </label>
                  <input
                    type="text"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={supabaseKeyInput}
                    onChange={(e) => setSupabaseKeyInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                  <span className="text-[10px] text-slate-400">Dapatkan di Dashboard Supabase &gt; Project Settings &gt; API &gt; Project API keys (anon public)</span>
                </div>

                <div className="pt-2 flex flex-wrap gap-2 items-center">
                  <button
                    onClick={handleTestSupabase}
                    disabled={supabaseStatus?.testing}
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-xs shadow-md transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {supabaseStatus?.testing ? 'Menguji Koneksi...' : 'Test Koneksi Supabase'}
                  </button>
                </div>

                {supabaseStatus && (
                  <div className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2 ${
                    supabaseStatus.success
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-amber-50 border-amber-300 text-amber-900'
                  }`}>
                    {supabaseStatus.success ? <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" /> : <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />}
                    <span>{supabaseStatus.message}</span>
                  </div>
                )}
              </div>
            </div>

            {/* SQL Schema Generator */}
            <div className="p-5 bg-slate-900 text-slate-100 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-amber-300">Skema SQL Siap Pakai untuk Supabase</h4>
                  <p className="text-[11px] text-slate-400">Salin dan jalankan sekali di Supabase SQL Editor untuk membuat semua tabel otomatis.</p>
                </div>
                <button
                  onClick={handleCopySql}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5 text-amber-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'Tersalin' : 'Salin Skema SQL'}</span>
                </button>
              </div>

              <pre className="p-3 bg-slate-950 rounded-xl text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-48 border border-slate-800">
                {getSupabaseSqlSchema()}
              </pre>
            </div>

            {/* Vercel Guide */}
            <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-3 text-xs text-slate-700">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <ExternalLink className="w-4 h-4 text-emerald-700" />
                <span>Langkah Hosting Gratis di Vercel:</span>
              </h4>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-600">
                <li>Buka akun gratis di <strong>supabase.com</strong> dan buat Proyek baru (New Project).</li>
                <li>Buka menu <strong>SQL Editor</strong> di Supabase, tempel skema SQL di atas, lalu klik <strong>Run</strong>.</li>
                <li>Push repository ini ke GitHub Anda, lalu import ke <strong>Vercel (vercel.com)</strong>.</li>
                <li>Di pengaturan proyek Vercel &gt; <strong>Environment Variables</strong>, tambahkan 2 variabel:
                  <div className="my-1.5 p-2 bg-slate-100 rounded-md font-mono text-[11px] text-slate-800">
                    <div>VITE_SUPABASE_URL = https://your-project.supabase.co</div>
                    <div>VITE_SUPABASE_ANON_KEY = your-anon-key-here</div>
                    <div>GEMINI_API_KEY = your-gemini-api-key</div>
                  </div>
                </li>
                <li>Klik <strong>Deploy</strong>. Website LBH Ansor Banten Anda siap live online 24 jam!</li>
              </ol>
            </div>

          </div>
        )}

      </main>
    </div>
  );
};
