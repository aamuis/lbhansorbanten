import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Scale, Award } from 'lucide-react';
import { Lawyer } from '../types';

interface OrganizationStructureProps {
  lawyers?: Lawyer[];
  title?: string;
  subtitle?: string;
}

export const OrganizationStructure: React.FC<OrganizationStructureProps> = ({ 
  lawyers = [],
  title = "Struktur Organisasi",
  subtitle = "Pimpinan Wilayah Lembaga Bantuan Hukum Gerakan Pemuda Ansor Provinsi Banten masa khidmah yang berdedikasi mengawal keadilan bagi seluruh rakyat Banten."
}) => {
  // Find specific executive leaders from lawyers state or use default verified data
  const ketua = lawyers.find(l => l.id === 'law-rojak') || lawyers.find(l => l.role.toLowerCase().includes('ketua')) || {
    id: 'law-rojak',
    name: 'Rojak, S.H.',
    role: 'Ketua LBH Ansor Banten',
    photoUrl: '/images/rojak_ketua.jpg',
  };

  const sekretaris = lawyers.find(l => l.id === 'law-mulhat') || lawyers.find(l => l.role.toLowerCase().includes('sekretaris')) || {
    id: 'law-mulhat',
    name: 'Mulhat, S.H., M.H.',
    role: 'Sekretaris LBH Ansor Banten',
    photoUrl: '/images/mulhat_sekretaris.jpg',
  };

  const bendahara = lawyers.find(l => l.id === 'law-dede') || lawyers.find(l => l.role.toLowerCase().includes('bendahara')) || {
    id: 'law-dede',
    name: 'Dede Maulana Pasial, S.H., MH',
    role: 'Bendahara LBH Ansor Banten',
    photoUrl: '/images/dede_bendahara.jpg',
  };

  const executives = [
    {
      id: ketua.id,
      name: ketua.name,
      role: ketua.role || 'Ketua LBH Ansor Banten',
      photoUrl: ketua.photoUrl || '/images/rojak_ketua.jpg',
      badge: 'Pimpinan Wilayah',
    },
    {
      id: sekretaris.id,
      name: sekretaris.name,
      role: sekretaris.role || 'Sekretaris LBH Ansor Banten',
      photoUrl: sekretaris.photoUrl || '/images/mulhat_sekretaris.jpg',
      badge: 'Pimpinan Wilayah',
    },
    {
      id: bendahara.id,
      name: bendahara.name,
      role: bendahara.role || 'Bendahara LBH Ansor Banten',
      photoUrl: bendahara.photoUrl || '/images/dede_bendahara.jpg',
      badge: 'Pimpinan Wilayah',
    },
  ];

  return (
    <section id="struktur-organisasi" className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-200 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-emerald-950 font-['Playfair_Display',serif] tracking-tight">
              {title}
            </h2>
            <div className="w-16 h-1 bg-amber-400 mx-auto mt-4 rounded-full" />
            <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
              {subtitle}
            </p>
          </motion.div>
        </div>

        {/* 3 Executive Leaders Grid Matching Screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 max-w-5xl mx-auto items-stretch">
          {executives.map((exec, index) => (
            <motion.div
              key={exec.id || index}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -6 }}
              className="group bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center"
            >
              {/* Leader Photo Frame */}
              <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 shadow-inner">
                <img
                  src={exec.photoUrl}
                  alt={exec.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top group-hover:scale-103 transition-transform duration-500"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    const defaultFallbacks = ['/images/rojak_ketua.jpg', '/images/mulhat_sekretaris.jpg', '/images/dede_bendahara.jpg'];
                    const defaultImg = defaultFallbacks[index] || '/images/rojak_ketua.jpg';
                    if (target.src !== defaultImg && !target.src.endsWith(defaultImg)) {
                      target.src = defaultImg;
                    }
                  }}
                />

                {/* Subtle Gradient & Badge */}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-900/80 backdrop-blur-md text-[10px] font-bold text-amber-300 border border-amber-400/30 shadow-xs">
                    <ShieldCheck className="w-3 h-3 text-amber-400" />
                    <span>LBH Ansor</span>
                  </span>
                </div>
              </div>

              {/* Leader Name & Position */}
              <div className="mt-5 text-center flex-1 flex flex-col justify-between w-full">
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug">
                    {exec.name}
                  </h3>
                  <p className="mt-1.5 text-sm sm:text-base text-slate-600 font-medium">
                    {exec.role}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-emerald-700 font-semibold">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>Advokat Pengawal Konstitusi</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
