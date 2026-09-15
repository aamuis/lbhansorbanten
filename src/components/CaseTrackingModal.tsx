import React, { useState, useEffect } from 'react';
import { X, Search, Clock, CheckCircle2, AlertCircle, PhoneCall, UserCheck, ShieldAlert, ArrowRight } from 'lucide-react';
import { CaseConsultation } from '../types';
import { getStatusLabelIndonesian } from '../lib/whatsapp';

interface CaseTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  cases: CaseConsultation[];
  initialTicketQuery?: string;
  onOpenConsultation: () => void;
}

export const CaseTrackingModal: React.FC<CaseTrackingModalProps> = ({
  isOpen,
  onClose,
  cases,
  initialTicketQuery = '',
  onOpenConsultation,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialTicketQuery);
  const [matchedCase, setMatchedCase] = useState<CaseConsultation | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialTicketQuery) {
      setSearchQuery(initialTicketQuery);
      performSearch(initialTicketQuery);
    }
  }, [initialTicketQuery, isOpen]);

  if (!isOpen) return null;

  const performSearch = (q: string) => {
    const clean = q.trim().toLowerCase();
    if (!clean) {
      setMatchedCase(null);
      setSearched(false);
      return;
    }

    const found = cases.find(c => 
      c.ticketNumber.toLowerCase() === clean ||
      c.clientPhone.replace(/[^0-9]/g, '').includes(clean.replace(/[^0-9]/g, ''))
    );

    setMatchedCase(found || null);
    setSearched(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  const getStepActive = (status: CaseConsultation['status'], stepIndex: number) => {
    const order = ['verifikasi', 'ditelaah', 'proses', 'selesai'];
    const currentIdx = order.indexOf(status);
    if (status === 'ditolak') return stepIndex === 0;
    return currentIdx >= stepIndex;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div 
        id="case-tracking-modal-card"
        className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-emerald-800/30 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="bg-emerald-950 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-800 flex items-center justify-center text-amber-400">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-['Playfair_Display',serif]">
                Pelacakan Status Berkas Perkara
              </h2>
              <p className="text-xs text-emerald-200">
                LBH GP Ansor Banten Tracking System
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Box */}
        <div className="p-5 sm:p-6">
          <form onSubmit={handleFormSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Masukkan No. Tiket (LBH-BTN-...) atau No. WA Anda"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm rounded-xl transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Lacak</span>
            </button>
          </form>

          {/* Result Card */}
          {searched && matchedCase && (
            <div className="mt-6 border border-emerald-200 rounded-xl p-4 sm:p-5 bg-emerald-50/50 space-y-4">
              
              {/* Top Meta */}
              <div className="flex flex-wrap items-start justify-between gap-2 border-b border-emerald-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Tiket: {matchedCase.ticketNumber}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1.5">
                    {matchedCase.caseTitle}
                  </h3>
                  <p className="text-xs text-slate-600">
                    Pemohon: <strong>{matchedCase.clientName}</strong> • {matchedCase.regency}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-900 block">
                    {getStatusLabelIndonesian(matchedCase.status)}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Diperbarui: {new Date(matchedCase.updatedAt).toLocaleDateString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Status Stepper */}
              <div className="py-2">
                <div className="text-xs font-bold text-slate-700 mb-3">Tahapan Progres Penanganan:</div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  {[
                    { label: 'Verifikasi', desc: 'Validasi Berkas' },
                    { label: 'Ditelaah', desc: 'Analisis Tim Hukum' },
                    { label: 'Proses', desc: 'Pendampingan / Mediasi' },
                    { label: 'Selesai', desc: 'Perkara Tuntas' },
                  ].map((step, idx) => {
                    const active = getStepActive(matchedCase.status, idx);
                    return (
                      <div key={idx} className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          active ? 'bg-emerald-700 text-white ring-2 ring-emerald-300' : 'bg-slate-200 text-slate-500'
                        }`}>
                          {idx + 1}
                        </div>
                        <span className={`text-[11px] font-bold mt-1 ${active ? 'text-emerald-950' : 'text-slate-400'}`}>
                          {step.label}
                        </span>
                        <span className="text-[9px] text-slate-500 hidden sm:block">
                          {step.desc}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status Notes from Lawyer */}
              <div className="bg-white border border-emerald-200 rounded-lg p-3 text-xs text-slate-800">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-1">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Advokat Pendamping: {matchedCase.assignedLawyerName || 'Divisi Pelayanan & Bantuan Hukum'}</span>
                </div>
                <p className="italic text-slate-700 bg-slate-50 p-2 rounded border border-slate-100">
                  "{matchedCase.statusNotes || 'Berkas Anda sedang dalam proses penanganan tim advokat LBH Ansor Banten.'}"
                </p>
              </div>

              {/* Action */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <a
                  href={`https://wa.me/6281288881934?text=${encodeURIComponent(
                    `Assalamu'alaikum LBH Ansor Banten, saya ingin menanyakan perkembangan berkas saya dengan No. Tiket: *${matchedCase.ticketNumber}* (${matchedCase.clientName}). Terima kasih.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Tanya Petugas via WhatsApp</span>
                </a>
              </div>

            </div>
          )}

          {searched && !matchedCase && (
            <div className="mt-6 text-center py-8 border border-dashed border-slate-300 rounded-xl p-4 bg-slate-50 space-y-3">
              <ShieldAlert className="w-10 h-10 text-slate-400 mx-auto" />
              <div>
                <h4 className="text-sm font-bold text-slate-800">Berkas Kasus Tidak Ditemukan</h4>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                  Pastikan nomor tiket Anda benar (contoh: <code>LBH-BTN-2025-0101</code>) atau nomor WhatsApp yang Anda masukkan sesuai saat pengajuan.
                </p>
              </div>
              <button
                onClick={() => { onClose(); onOpenConsultation(); }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-3.5 py-1.5 rounded-lg transition-colors"
              >
                <span>Ajukan Konsultasi Baru</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
