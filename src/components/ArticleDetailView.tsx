import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Share2, 
  Copy, 
  Check, 
  Bookmark, 
  ExternalLink
} from 'lucide-react';
import { Article } from '../types';
import { WhatsAppIcon, FacebookIcon, XTwitterIcon, TelegramIcon } from './SocialIcons';

interface ArticleDetailViewProps {
  article: Article;
  onBack: () => void;
  onSelectRelatedArticle: (slug: string) => void;
  relatedArticles: Article[];
}

export const ArticleDetailView: React.FC<ArticleDetailViewProps> = ({
  article,
  onBack,
  onSelectRelatedArticle,
  relatedArticles,
}) => {
  const [copied, setCopied] = useState(false);

  const currentUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}#artikel?slug=${article.slug}`
    : `https://lbhansorbanten.id/artikel/${article.slug}`;

  const shareTitle = `${article.title} - LBH Ansor Banten`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareToWhatsapp = () => {
    const text = `*${article.title}*\n\n${article.summary}\n\nBaca selengkapnya di LBH Ansor Banten:\n${currentUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const shareToTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareTitle)}`, '_blank');
  };

  return (
    <article className="min-h-screen bg-slate-50 py-10 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Back Navigation */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-emerald-800 hover:border-emerald-700 text-xs sm:text-sm font-semibold shadow-2xs transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Artikel & Berita</span>
        </button>

        {/* Main Article Container */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-10">
          
          {/* Category & Date */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 mb-4">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider text-[11px] font-bold">
              {article.category}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{new Date(article.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{article.readTimeMinutes} menit baca</span>
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight font-['Playfair_Display',serif]">
            {article.title}
          </h1>

          {/* Author Block */}
          <div className="mt-6 flex items-center justify-between border-y border-slate-100 py-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-emerald-900 text-amber-300 font-bold flex items-center justify-center text-sm shadow-xs">
                {article.author.charAt(0)}
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">{article.author}</h2>
                <p className="text-xs text-emerald-700">{article.authorRole}</p>
              </div>
            </div>

            {/* Social Share Group Desktop */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
                <Share2 className="w-3.5 h-3.5" /> Bagikan:
              </span>
              <button
                onClick={shareToWhatsapp}
                className="p-2 rounded-lg bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all shadow-2xs hover:scale-105 cursor-pointer"
                title="Bagikan ke WhatsApp"
                aria-label="Bagikan ke WhatsApp"
              >
                <WhatsAppIcon className="w-4 h-4" />
              </button>
              <button
                onClick={shareToFacebook}
                className="p-2 rounded-lg bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all shadow-2xs hover:scale-105 cursor-pointer"
                title="Bagikan ke Facebook"
                aria-label="Bagikan ke Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </button>
              <button
                onClick={shareToTwitter}
                className="p-2 rounded-lg bg-slate-900/10 text-slate-900 hover:bg-black hover:text-white transition-all shadow-2xs hover:scale-105 cursor-pointer"
                title="Bagikan ke X"
                aria-label="Bagikan ke X"
              >
                <XTwitterIcon className="w-4 h-4" />
              </button>
              <button
                onClick={shareToTelegram}
                className="p-2 rounded-lg bg-[#229ED9]/10 text-[#229ED9] hover:bg-[#229ED9] hover:text-white transition-all shadow-2xs hover:scale-105 cursor-pointer"
                title="Bagikan ke Telegram"
                aria-label="Bagikan ke Telegram"
              >
                <TelegramIcon className="w-4 h-4" />
              </button>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin' : 'Salin Link'}</span>
              </button>
            </div>
          </div>

          {/* Featured Image */}
          {article.imageUrl && (
            <div className="mt-6 rounded-2xl overflow-hidden shadow-sm bg-slate-100">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full max-h-[460px] object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Lead Summary */}
          <div className="mt-6 bg-emerald-50/60 border-l-4 border-emerald-700 p-4 rounded-r-xl text-slate-700 text-sm md:text-base font-medium leading-relaxed italic">
            "{article.summary}"
          </div>

          {/* Main Content Body */}
          <div className="mt-8 text-slate-800 leading-relaxed space-y-4 text-sm sm:text-base font-normal">
            {article.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={idx} className="text-lg sm:text-xl font-bold text-slate-900 pt-4 font-['Playfair_Display',serif]">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('- ') || paragraph.match(/^\d+\./)) {
                return (
                  <div key={idx} className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-100 space-y-1.5 my-2">
                    {paragraph.split('\n').map((line, lIdx) => (
                      <p key={lIdx} className="text-slate-700 text-sm">
                        {line}
                      </p>
                    ))}
                  </div>
                );
              }
              return (
                <p key={idx} className="text-slate-700 leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Tags */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap gap-2">
            {article.tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Mobile Share Bar */}
          <div className="mt-6 pt-6 border-t border-slate-100 sm:hidden">
            <span className="text-xs font-bold text-slate-700 block mb-2.5">Bagikan Artikel Ini:</span>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={shareToWhatsapp}
                className="flex items-center justify-center gap-1.5 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                title="WhatsApp"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>WA</span>
              </button>
              <button
                onClick={shareToFacebook}
                className="flex items-center justify-center gap-1.5 py-2.5 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                title="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
                <span>FB</span>
              </button>
              <button
                onClick={shareToTelegram}
                className="flex items-center justify-center gap-1.5 py-2.5 bg-[#229ED9] hover:bg-[#1f8ec4] text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                title="Telegram"
              >
                <TelegramIcon className="w-4 h-4" />
                <span>TG</span>
              </button>
              <button
                onClick={handleCopyLink}
                className="flex items-center justify-center gap-1.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
                title="Salin Tautan"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Tersalin' : 'Link'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-slate-900 mb-6 font-['Playfair_Display',serif]">
              Artikel & Ulasan Hukum Terkait
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.slice(0, 3).map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectRelatedArticle(rel.slug)}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 uppercase">
                      {rel.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 mt-1 line-clamp-2">
                      {rel.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                      {rel.summary}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 mt-3 flex items-center gap-1">
                    <span>Baca Ulasan</span>
                    <span>→</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </article>
  );
};
