import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Calendar, 
  Clock, 
  Newspaper, 
  ArrowRight, 
  MessageCircle, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen,
  Layers,
  Scale,
  Landmark,
  Briefcase,
  ShieldAlert,
  Gavel,
  Users
} from 'lucide-react';
import { Article } from '../types';
import { WhatsAppIcon } from './SocialIcons';

interface ArticleSectionProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
}

// Category metadata mapping for neat boxed presentation
const CATEGORY_META: Record<string, { icon: React.ReactNode; shortTitle: string; subtitle: string }> = {
  'Semua': {
    icon: <Layers className="w-5 h-5" />,
    shortTitle: 'Semua Kategori',
    subtitle: 'Seluruh Publikasi'
  },
  'Bantuan Hukum': {
    icon: <Scale className="w-5 h-5" />,
    shortTitle: 'Bantuan Hukum',
    subtitle: 'Layanan Pro Bono'
  },
  'Agraria & Pertanahan': {
    icon: <Landmark className="w-5 h-5" />,
    shortTitle: 'Agraria & Tanah',
    subtitle: 'Sengketa & Girik'
  },
  'Ketenagakerjaan': {
    icon: <Briefcase className="w-5 h-5" />,
    shortTitle: 'Ketenagakerjaan',
    subtitle: 'Hak Buruh & PHK'
  },
  'Cyber Law & Pidana': {
    icon: <ShieldAlert className="w-5 h-5" />,
    shortTitle: 'Cyber & ITE',
    subtitle: 'Pinjol & Data'
  },
  'Hukum Pidana': {
    icon: <Gavel className="w-5 h-5" />,
    shortTitle: 'Hukum Pidana',
    subtitle: 'Laporan & Advokasi'
  },
  'Perdata & Keluarga': {
    icon: <Users className="w-5 h-5" />,
    shortTitle: 'Perdata & Waris',
    subtitle: 'Keluarga & KHI'
  }
};

export const ArticleSection: React.FC<ArticleSectionProps> = ({
  articles,
  onSelectArticle,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2; // Dua kotak artikel berdampingan

  // Collect unique categories starting with 'Semua'
  const uniqueCategories: string[] = Array.from(new Set<string>(articles.map(a => a.category)));
  const categories: string[] = ['Semua', ...uniqueCategories];

  const filteredArticles = articles.filter(art => {
    const matchesCat = selectedCategory === 'Semua' || art.category === selectedCategory;
    const matchesSearch = 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      art.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Reset to page 1 whenever filter or search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + itemsPerPage);

  const handleShareWa = (e: React.MouseEvent, art: Article) => {
    e.stopPropagation();
    const url = `${window.location.origin}#artikel?slug=${art.slug}`;
    const text = `*${art.title}*\n\n${art.summary}\n\nBaca artikel selengkapnya di LBH GP Ansor Banten: ${url}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <section id="artikel" className="py-14 md:py-20 bg-slate-50/70 text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Newspaper className="w-3.5 h-3.5 text-emerald-700" />
              <span>Pusat Edukasi & Berita Hukum</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 font-['Playfair_Display',serif]">
              Artikel, Riset & Kajian Hukum
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-2xl">
              Ulasan yuridis, panduan hak-hak konstitusional, dan kabar advokasi terkini di Banten disajikan dalam format ringkas, rapi, dan terpercaya.
            </p>
          </div>

          {/* Search Input Bar */}
          <div className="w-full sm:w-72 md:w-80 relative">
            <input
              type="text"
              placeholder="Cari artikel, topik, atau pasal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none shadow-xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* KOTAK-KOTAK KATEGORI ARTIKEL (Rapi, Terstruktur, Berdesain Kotak Modern) */}
        {/* ========================================================================= */}
        <div className="mb-9">
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-700 inline-block"></span>
              <span>Pilih Kategori Pembahasan</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">
              {categories.length} Bidang Hukum
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              const count = cat === 'Semua' 
                ? articles.length 
                : articles.filter(a => a.category === cat).length;
              const meta = CATEGORY_META[cat] || {
                icon: <BookOpen className="w-5 h-5" />,
                shortTitle: cat,
                subtitle: 'Kajian Hukum'
              };

              return (
                <motion.button
                  key={cat}
                  type="button"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCategory(cat)}
                  className={`group relative p-3.5 sm:p-4 rounded-xl text-left transition-all duration-200 cursor-pointer flex flex-col justify-between border ${
                    isSelected
                      ? 'bg-emerald-900 text-white border-amber-400 shadow-md shadow-emerald-950/25 ring-2 ring-amber-400/40'
                      : 'bg-white text-slate-700 hover:bg-emerald-50/60 border-slate-200/90 shadow-2xs hover:border-emerald-300'
                  }`}
                >
                  {/* Top: Icon and Counter Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors shadow-xs ${
                      isSelected
                        ? 'bg-amber-400 text-emerald-950'
                        : 'bg-emerald-100/80 text-emerald-800 group-hover:bg-emerald-800 group-hover:text-amber-300'
                    }`}>
                      {meta.icon}
                    </div>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                      isSelected
                        ? 'bg-emerald-800 text-amber-300 border border-amber-400/30'
                        : 'bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-800'
                    }`}>
                      {count}
                    </span>
                  </div>

                  {/* Bottom: Title & Subtitle */}
                  <div>
                    <div className={`text-xs sm:text-sm font-bold leading-snug line-clamp-1 ${
                      isSelected ? 'text-white' : 'text-slate-900 group-hover:text-emerald-800'
                    }`}>
                      {meta.shortTitle}
                    </div>
                    <div className={`text-[10px] mt-0.5 line-clamp-1 font-medium ${
                      isSelected ? 'text-emerald-200' : 'text-slate-400 group-hover:text-slate-600'
                    }`}>
                      {meta.subtitle}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DUA KOTAK ARTIKEL (Card Box Berdampingan, Rapi & Elegan) */}
        {/* ========================================================================= */}
        {filteredArticles.length > 0 ? (
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentPage}-${selectedCategory}-${searchQuery}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {paginatedArticles.map((art) => (
                  <motion.article
                    key={art.id}
                    whileHover={{ y: -4 }}
                    onClick={() => onSelectArticle(art)}
                    className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-emerald-600/40 transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer"
                  >
                    {/* Kotak Bagian Atas: Cover Image & Header Meta */}
                    <div className="relative h-48 sm:h-56 md:h-60 w-full bg-slate-100 overflow-hidden shrink-0">
                      <img
                        src={art.imageUrl}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/15 to-black/20" />
                      
                      {/* Category Badge Top-Left */}
                      <div className="absolute top-3.5 left-3.5 bg-emerald-900/95 text-amber-300 border border-amber-400/40 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-lg shadow-md backdrop-blur-md flex items-center gap-1.5">
                        <Scale className="w-3 h-3" />
                        <span>{art.category}</span>
                      </div>

                      {/* Read Time Top-Right */}
                      <div className="absolute top-3.5 right-3.5 bg-black/60 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg backdrop-blur-md flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-300" />
                        <span>{art.readTimeMinutes} mnt</span>
                      </div>

                      {/* Date at Bottom Left of Cover */}
                      <div className="absolute bottom-3 left-3.5 text-xs text-white/95 font-medium flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-md backdrop-blur-xs">
                        <Calendar className="w-3.5 h-3.5 text-amber-300" />
                        <span>{new Date(art.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                    </div>

                    {/* Kotak Bagian Bawah: Isi Konten, Kutipan, Tags & Penulis */}
                    <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 space-y-4">
                      <div className="space-y-2.5">
                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-2 leading-snug font-['Playfair_Display',serif]">
                          {art.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                          {art.summary}
                        </p>
                      </div>

                      {/* Tag Pills */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {art.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-800 transition-colors"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Card Footer: Author Info & Action Buttons */}
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-xs shadow-2xs">
                            {art.author.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-xs leading-tight">
                              {art.author.split(',')[0]}
                            </p>
                            <p className="text-[10px] text-slate-500">
                              {art.authorRole || 'LBH GP Ansor Banten'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => handleShareWa(e, art)}
                            title="Bagikan artikel via WhatsApp"
                            className="p-2 rounded-lg bg-slate-100 hover:bg-[#25D366]/15 text-slate-600 hover:text-[#25D366] transition-colors cursor-pointer"
                          >
                            <WhatsAppIcon className="w-4 h-4" />
                          </button>

                          <span className="flex items-center gap-1 font-bold text-xs text-emerald-800 group-hover:text-emerald-700">
                            <span>Baca</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Pagination Controls */}
            <div className="mt-8 pt-5 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-500 font-medium">
                Menampilkan <span className="font-bold text-slate-800">{paginatedArticles.length}</span> dari <span className="font-bold text-slate-800">{filteredArticles.length}</span> artikel ({totalPages} halaman)
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    currentPage === 1
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200/60'
                      : 'bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-300 shadow-2xs cursor-pointer'
                  }`}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Sebelumnya</span>
                </button>

                {/* Page Number Buttons */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        currentPage === page
                          ? 'bg-emerald-800 text-white shadow-xs'
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    currentPage === totalPages
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200/60'
                      : 'bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-300 shadow-2xs cursor-pointer'
                  }`}
                >
                  <span>Selanjutnya</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-slate-300 rounded-2xl p-8 bg-white">
            <Newspaper className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">Tidak ada artikel yang cocok</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Coba gunakan kata kunci pencarian yang lain atau pilih kategori "Semua Kategori".
            </p>
          </div>
        )}

      </div>
    </section>
  );
};
