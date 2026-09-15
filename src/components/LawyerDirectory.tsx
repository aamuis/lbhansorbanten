import React, { useState } from 'react';
import { ShieldCheck, PhoneCall, Scale, UserCheck, Briefcase, Award, CheckCircle2, Clock } from 'lucide-react';
import { Lawyer } from '../types';

interface LawyerDirectoryProps {
  lawyers: Lawyer[];
  onSelectLawyerForConsultation: (lawyerId: string) => void;
}

export const LawyerDirectory: React.FC<LawyerDirectoryProps> = ({
  lawyers,
  onSelectLawyerForConsultation,
}) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('Semua');

  // Collect unique specialties
  const allSpecialties = ['Semua', 'Hukum Pidana', 'Sengketa Tanah / Agraria', 'Hukum Ketenagakerjaan', 'Penghapusan KDRT', 'UU ITE & Kejahatan Siber', 'Hukum Waris Islam (Faraidh)'];

  const filteredLawyers = lawyers.filter(l => {
    if (selectedSpecialty === 'Semua') return true;
    return l.specialization.some(s => s.toLowerCase().includes(selectedSpecialty.toLowerCase()));
  });

  return (
    <section id="advokat" className="py-16 md:py-24 bg-slate-50 text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Direktori Korps Advokat & Paralegal</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 font-['Playfair_Display',serif]">
              Daftar Advokat & Konsultan Hukum LBH Ansor Banten
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl">
              Didukung oleh barisan advokat profesional, berintegritas tinggi, dan tersumpah yang siap membela hak-hak hukum masyarakat Banten tanpa diskriminasi.
            </p>
          </div>
          
          <div className="shrink-0 text-xs text-slate-500 bg-white border border-slate-200 rounded-lg p-2.5 shadow-xs">
            <span className="font-bold text-emerald-800">{lawyers.length} Advokat & Paralegal</span> aktif bertugas di 8 Kab/Kota se-Banten
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
          {allSpecialties.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedSpecialty === spec
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>

        {/* Lawyers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLawyers.map((lawyer) => (
            <div
              key={lawyer.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group"
            >
              {/* Photo & Availability badge */}
              <div className="relative h-64 bg-emerald-950 overflow-hidden">
                <img
                  src={lawyer.photoUrl}
                  alt={lawyer.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback avatar
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=600&auto=format&fit=crop&q=80";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  {lawyer.isAvailable ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500 text-white shadow-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                      <span>Tersedia</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500 text-slate-900 shadow-md">
                      <Clock className="w-3 h-3" />
                      <span>Sedang Sidang</span>
                    </span>
                  )}
                </div>

                {/* Regency & License tag */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[11px] font-medium text-amber-300 bg-emerald-900/80 backdrop-blur-xs px-2 py-0.5 rounded border border-amber-400/30">
                    Wilayah: {lawyer.regency}
                  </span>
                  <div className="text-[10px] text-slate-300 mt-1">
                    KTA / Lisensi: {lawyer.barNumber || 'PERADI BANTEN'}
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                    {lawyer.name}
                  </h3>
                  <p className="text-xs font-semibold text-emerald-700 mt-0.5">
                    {lawyer.role}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    <span>Pengalaman: <strong>{lawyer.experienceYears} Tahun</strong> Advokasi</span>
                  </div>

                  {/* Specializations */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {lawyer.specialization.map((spec, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => onSelectLawyerForConsultation(lawyer.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm"
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>Pilih Advokat</span>
                  </button>

                  {lawyer.phone && (
                    <a
                      href={`https://wa.me/${lawyer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Assalamu'alaikum Wr. Wb. Bapak/Ibu ${lawyer.name}, saya mendapatkan kontak dari Website LBH Ansor Banten dan ingin berkonsultasi mengenai perkara hukum.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-slate-100 hover:bg-emerald-100 text-emerald-800 rounded-xl transition-colors border border-slate-200"
                      title="Konsultasi WhatsApp"
                    >
                      <PhoneCall className="w-4 h-4" />
                    </a>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
