import React, { useState } from 'react';
import { X, Scale, Send, CheckCircle2, Copy, Check, Upload, AlertCircle, FileText, PhoneCall } from 'lucide-react';
import { LegalCategory, CaseConsultation, Lawyer } from '../types';
import { generateTicketNumber } from '../lib/storage';

interface ConsultationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitCase: (newCase: CaseConsultation) => Promise<void>;
  lawyers: Lawyer[];
  preselectedLawyerId?: string;
}

const REGENCY_OPTIONS = [
  'Kota Serang',
  'Kabupaten Serang',
  'Kota Cilegon',
  'Kabupaten Pandeglang',
  'Kabupaten Lebak',
  'Kota Tangerang',
  'Kota Tangerang Selatan',
  'Kabupaten Tangerang',
  'Di Luar Provinsi Banten'
];

const CATEGORY_OPTIONS: { value: LegalCategory; label: string }[] = [
  { value: 'pidana', label: 'Hukum Pidana (Pelaporan, Tersangka, Korban Tindak Pidana)' },
  { value: 'perdata', label: 'Hukum Perdata & Perjanjian / Utang Piutang' },
  { value: 'agraria', label: 'Sengketa Tanah & Agraria (Girik, AJB, SHM, Warisan Tanah)' },
  { value: 'ketenagakerjaan', label: 'Ketenagakerjaan & Perselisihan PHK Buruh Pabrik' },
  { value: 'keluarga', label: 'Hukum Keluarga & Faraidh / Pembagian Waris Islam' },
  { value: 'kdrt_anak', label: 'Kekerasan Dalam Rumah Tangga (KDRT) & Perlindungan Anak' },
  { value: 'ite_siber', label: 'Kejahatan Siber, Teror Pinjol Ilegal, & Pencemaran UU ITE' },
  { value: 'publik_lingkungan', label: 'Advokasi Kebijakan Publik & Kerusakan Lingkungan Hidup' },
  { value: 'lainnya', label: 'Masalah Hukum Lainnya' },
];

export const ConsultationFormModal: React.FC<ConsultationFormModalProps> = ({
  isOpen,
  onClose,
  onSubmitCase,
  lawyers,
  preselectedLawyerId,
}) => {
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    idCardNumber: '',
    regency: 'Kota Serang',
    category: 'pidana' as LegalCategory,
    caseTitle: '',
    chronology: '',
    evidenceFileName: '',
    evidenceUrl: '',
    assignedLawyerId: preselectedLawyerId || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCase, setSubmittedCase] = useState<CaseConsultation | null>(null);
  const [copiedTicket, setCopiedTicket] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.clientName.trim()) {
      setErrorMsg('Nama lengkap wajib diisi');
      return;
    }
    if (!formData.clientPhone.trim()) {
      setErrorMsg('Nomor WhatsApp aktif wajib diisi');
      return;
    }
    if (!formData.caseTitle.trim()) {
      setErrorMsg('Judul ringkas perkara wajib diisi');
      return;
    }
    if (!formData.chronology.trim() || formData.chronology.length < 20) {
      setErrorMsg('Mohon jelaskan kronologi perkara minimal 20 karakter');
      return;
    }

    setIsSubmitting(true);
    try {
      const ticketNumber = generateTicketNumber();
      const assignedLawyer = lawyers.find(l => l.id === formData.assignedLawyerId);

      const newCase: CaseConsultation = {
        id: `case-${Date.now()}`,
        ticketNumber,
        clientName: formData.clientName.trim(),
        clientPhone: formData.clientPhone.trim(),
        clientEmail: formData.clientEmail.trim() || undefined,
        idCardNumber: formData.idCardNumber.trim() || undefined,
        regency: formData.regency,
        category: formData.category,
        caseTitle: formData.caseTitle.trim(),
        chronology: formData.chronology.trim(),
        evidenceFileName: formData.evidenceFileName || undefined,
        evidenceUrl: formData.evidenceUrl || undefined,
        status: 'verifikasi',
        statusNotes: 'Berkas permohonan berhasil terdaftar dalam antrean verifikasi tim LBH Ansor Banten.',
        assignedLawyerId: formData.assignedLawyerId || undefined,
        assignedLawyerName: assignedLawyer?.name || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await onSubmitCase(newCase);
      setSubmittedCase(newCase);
    } catch (err: any) {
      setErrorMsg('Gagal mengirimkan permohonan: ' + (err.message || 'Kesalahan sistem'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyTicket = (ticket: string) => {
    navigator.clipboard.writeText(ticket);
    setCopiedTicket(true);
    setTimeout(() => setCopiedTicket(false), 2500);
  };

  const resetAndClose = () => {
    setSubmittedCase(null);
    setFormData({
      clientName: '',
      clientPhone: '',
      clientEmail: '',
      idCardNumber: '',
      regency: 'Kota Serang',
      category: 'pidana',
      caseTitle: '',
      chronology: '',
      evidenceFileName: '',
      evidenceUrl: '',
      assignedLawyerId: '',
    });
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        evidenceFileName: file.name,
        evidenceUrl: URL.createObjectURL(file)
      }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div 
        id="consultation-form-modal-card"
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-emerald-800/30 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white p-5 sm:p-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-['Playfair_Display',serif]">
                Pengajuan Bantuan Hukum Online
              </h2>
              <p className="text-xs text-emerald-200 mt-0.5">
                LBH GP Ansor Wilayah Banten • Pelayanan Bebas Biaya (Pro Bono)
              </p>
            </div>
          </div>

          <button
            onClick={resetAndClose}
            className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto">
          
          {submittedCase ? (
            /* Success View with Ticket and WhatsApp Confirmation */
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-800">
                  Permohonan Berhasil Diajukan!
                </h3>
                <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
                  Data konsultasi hukum Anda telah masuk ke sistem registrasi LBH GP Ansor Banten. Tim advokat kami akan segera menelaah berkas perkara Anda.
                </p>
              </div>

              {/* Ticket Card */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 max-w-md mx-auto text-left">
                <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold mb-1">
                  <span>NOMOR TIKET REGISTRASI RESMI</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 text-[10px] uppercase">
                    Status: Verifikasi
                  </span>
                </div>
                <div className="flex items-center justify-between bg-white border border-emerald-300 rounded-lg p-2.5">
                  <span className="font-mono text-base font-bold text-emerald-950">
                    {submittedCase.ticketNumber}
                  </span>
                  <button
                    onClick={() => handleCopyTicket(submittedCase.ticketNumber)}
                    className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md transition-colors"
                  >
                    {copiedTicket ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-amber-300" />
                        <span>Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Tiket</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-emerald-700 mt-2">
                  *Simpan nomor tiket ini untuk memantau pembaruan status perkara melalui fitur <strong>Cek Status Kasus</strong>.
                </p>
              </div>

              {/* Direct WhatsApp Confirmation Button */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                <a
                  href={`https://wa.me/6281288881934?text=${encodeURIComponent(
                    `Assalamu'alaikum Wr. Wb. LBH Ansor Banten, saya telah mengajukan konsultasi online dengan Tiket: *${submittedCase.ticketNumber}* atas nama *${submittedCase.clientName}* terkait kasus: *${submittedCase.caseTitle}*. Mohon konfirmasi tindak lanjut. Terima kasih.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold rounded-xl shadow-md transition-all"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Konfirmasi ke WhatsApp LBH</span>
                </a>

                <button
                  onClick={resetAndClose}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors"
                >
                  Selesai & Tutup
                </button>
              </div>
            </div>
          ) : (
            /* Form View */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Notice Box */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p>
                  Kerahasiaan identitas dan kronologi perkara dijamin sepenuhnya berdasarkan <strong>Kode Etik Advokat Indonesia</strong> dan UU Perlindungan Data Pribadi. Layanan ini bebas biaya untuk warga berpenghasilan rendah.
                </p>
              </div>

              {errorMsg && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700 font-medium">
                  {errorMsg}
                </div>
              )}

              {/* Personal Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Lengkap Pemohon <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Samsul Bahri"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor WhatsApp Aktif <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Contoh: 08123456789"
                    value={formData.clientPhone}
                    onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none"
                  />
                  <span className="text-[10px] text-slate-500">Notifikasi status kasus otomatis dikirim ke nomor ini</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Pemohon (Opsional)
                  </label>
                  <input
                    type="email"
                    placeholder="nama@email.com"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    NIK / No. KTP (Opsional)
                  </label>
                  <input
                    type="text"
                    maxLength={16}
                    placeholder="16 Digit NIK KTP"
                    value={formData.idCardNumber}
                    onChange={(e) => setFormData({ ...formData, idCardNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none"
                  />
                </div>
              </div>

              {/* Location & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Wilayah Domisili Kasus (Banten) <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.regency}
                    onChange={(e) => setFormData({ ...formData, regency: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none"
                  >
                    {REGENCY_OPTIONS.map(reg => (
                      <option key={reg} value={reg}>{reg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kategori Masalah Hukum <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as LegalCategory })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none"
                  >
                    {CATEGORY_OPTIONS.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Lawyer Preference if any */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pilihan Advokat Pendamping (Opsional)
                </label>
                <select
                  value={formData.assignedLawyerId}
                  onChange={(e) => setFormData({ ...formData, assignedLawyerId: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none"
                >
                  <option value="">-- Rekomendasi Sistem / Tim Piket LBH Ansor Banten --</option>
                  {lawyers.map(l => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.role} - {l.regency})
                    </option>
                  ))}
                </select>
              </div>

              {/* Case Details */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Judul Pokok Perkara <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Penyerobotan Tanah Girik Tanpa Izin di Serang"
                  value={formData.caseTitle}
                  onChange={(e) => setFormData({ ...formData, caseTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kronologi Peristiwa & Masalah Hukum <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Jelaskan kronologi waktu kejadian, pihak-pihak terkait, kerugian yang dialami, dan upaya hukum yang telah dilakukan sebelumnya..."
                  value={formData.chronology}
                  onChange={(e) => setFormData({ ...formData, chronology: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none resize-y"
                />
              </div>

              {/* Document / Evidence Upload */}
              <div className="border border-dashed border-slate-300 rounded-xl p-3 bg-slate-50">
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Lampiran Berkas / Bukti Dokumen (Foto KTP/Surat/Bukti Transfer/Chat)</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-normal">Maks. 10MB</span>
                </label>

                <div className="flex flex-col sm:flex-row gap-2 items-center">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-700 file:text-white hover:file:bg-emerald-800 cursor-pointer w-full"
                  />
                  {formData.evidenceFileName && (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md font-medium shrink-0">
                      <FileText className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[150px]">{formData.evidenceFileName}</span>
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Atau tautan Google Drive / Cloud berkas bukti (opsional)"
                    value={formData.evidenceUrl}
                    onChange={(e) => setFormData({ ...formData, evidenceUrl: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-emerald-800 hover:bg-emerald-900 text-white shadow-lg shadow-emerald-900/20 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Sedang Mendaftarkan...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Kirim Berkas Konsultasi</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
};
