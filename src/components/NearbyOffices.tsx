import React, { useState } from 'react';
import { MapPin, Navigation, Phone, Clock, ExternalLink, Compass, Check } from 'lucide-react';
import { BranchOffice } from '../types';

interface NearbyOfficesProps {
  branches: BranchOffice[];
}

// Banten regency coordinates for manual dropdown
const BANTEN_REGENCY_COORDS: Record<string, { lat: number; lng: number }> = {
  'Kota Serang': { lat: -6.1200, lng: 106.1500 },
  'Kabupaten Serang': { lat: -6.1156, lng: 106.2167 },
  'Kota Cilegon': { lat: -6.0175, lng: 106.0538 },
  'Kabupaten Pandeglang': { lat: -6.3086, lng: 106.1064 },
  'Kabupaten Lebak': { lat: -6.3639, lng: 106.2503 },
  'Kota Tangerang': { lat: -6.1783, lng: 106.6319 },
  'Kota Tangerang Selatan': { lat: -6.3429, lng: 106.7383 },
  'Kabupaten Tangerang': { lat: -6.2625, lng: 106.4839 },
};

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export const NearbyOffices: React.FC<NearbyOfficesProps> = ({ branches }) => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; label: string } | null>(null);
  const [selectedRegency, setSelectedRegency] = useState<string>('');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [geoError, setGeoError] = useState<string>('');

  const handleUseGps = () => {
    setIsLocating(true);
    setGeoError('');
    setSelectedRegency('');

    if (!navigator.geolocation) {
      setGeoError('Browser Anda tidak mendukung deteksi lokasi otomatis.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          label: 'Lokasi GPS Anda Saat Ini',
        });
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        setGeoError('Izin lokasi ditolak atau sinyal GPS lemah. Silakan pilih kabupaten/kota secara manual di bawah.');
      },
      { timeout: 8000 }
    );
  };

  const handleRegencySelect = (regency: string) => {
    setSelectedRegency(regency);
    setGeoError('');
    if (regency && BANTEN_REGENCY_COORDS[regency]) {
      setUserLocation({
        lat: BANTEN_REGENCY_COORDS[regency].lat,
        lng: BANTEN_REGENCY_COORDS[regency].lng,
        label: `Wilayah ${regency}`,
      });
    } else {
      setUserLocation(null);
    }
  };

  // Sort branches by distance if user location is available
  const sortedBranches = branches.map((b) => {
    const distance = userLocation
      ? calculateDistanceKm(userLocation.lat, userLocation.lng, b.latitude, b.longitude)
      : null;
    return { ...b, distance };
  }).sort((a, b) => {
    if (a.distance === null || b.distance === null) return 0;
    return a.distance - b.distance;
  });

  return (
    <section id="posko" className="py-16 md:py-24 bg-white text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Pencarian Berbasis Lokasi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 font-['Playfair_Display',serif]">
            Posko & Layanan Bantuan Hukum Terdekat di Banten
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Temukan kantor cabang LBH GP Ansor terdekat dari tempat tinggal Anda di Provinsi Banten untuk konsultasi tatap muka langsung.
          </p>
        </div>

        {/* Location Search Control Box */}
        <div className="max-w-2xl mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6 mb-10 shadow-xs">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center justify-between">
            <span>Tentukan Posisi Anda:</span>
            {userLocation && (
              <span className="text-emerald-700 flex items-center gap-1 font-semibold">
                <Check className="w-3.5 h-3.5" />
                <span>{userLocation.label}</span>
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-center">
            
            {/* GPS Auto Button */}
            <button
              onClick={handleUseGps}
              disabled={isLocating}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <Navigation className={`w-4 h-4 text-amber-300 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Mendeteksi Lokasi...' : 'Deteksi GPS Otomatis'}</span>
            </button>

            <span className="text-xs text-slate-400 font-semibold hidden sm:inline">atau</span>

            {/* Manual Dropdown */}
            <div className="w-full sm:w-auto flex-1">
              <select
                value={selectedRegency}
                onChange={(e) => handleRegencySelect(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white font-medium text-slate-800 focus:ring-2 focus:ring-emerald-700 outline-none"
              >
                <option value="">-- Pilih Wilayah Banten --</option>
                {Object.keys(BANTEN_REGENCY_COORDS).map((reg) => (
                  <option key={reg} value={reg}>{reg}</option>
                ))}
              </select>
            </div>

          </div>

          {geoError && (
            <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-2.5 mt-3">
              {geoError}
            </p>
          )}
        </div>

        {/* Featured Headquarters Google Map Showcase (from lbhansorbanten.org) */}
        <div className="mb-12 bg-white rounded-3xl border border-emerald-900/20 shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Map Frame */}
          <div className="lg:col-span-7 h-72 sm:h-84 lg:h-full min-h-[320px] relative bg-slate-100">
            <iframe
              title="Peta Lokasi Kantor LBH Ansor Banten"
              src="https://maps.google.com/maps?q=-6.1352257,106.1439055&hl=id&z=16&output=embed"
              className="w-full h-full border-0 absolute inset-0"
              loading="lazy"
              allowFullScreen
            />
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-xl shadow-md border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <span>Peta Resmi LBH Ansor Banten</span>
            </div>
          </div>

          {/* Headquarters Info Panel */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-4 border border-amber-400/30">
                <Compass className="w-3 h-3" />
                <span>Kantor Pusat Wilayah Banten</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold font-['Playfair_Display',serif] text-white">
                Sekretariat LBH GP Ansor Banten
              </h3>

              <p className="text-xs text-amber-200/90 font-medium italic mt-1 mb-4">
                "Suara Kebenaran, Jalan Keadilan"
              </p>

              <div className="space-y-3 text-xs sm:text-sm text-emerald-100/90">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Jl. Jagarayu, Dalung, Kec. Cipocok Jaya, Kota Serang, Banten 42127</span>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Senin - Jumat: 09.00 - 16.00 WIB (Hotline Siaga 24 Jam)</span>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-semibold text-white">Hotline WA: 0815-1955-5391</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-emerald-800/80 flex flex-col sm:flex-row gap-3">
              <a
                href="https://www.google.com/maps/place/Jl.+Jagarayu,+Kota+Serang,+Banten/@-6.1352257,106.1439055,17z"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 text-xs sm:text-sm font-bold shadow-md transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Rute Google Maps</span>
              </a>

              <a
                href="https://wa.me/6281519555391?text=Assalamu%27alaikum%20LBH%20Ansor%20Banten%2C%20saya%20ingin%20konsultasi%20langsung%20di%20kantor%20Jl.%20Jagarayu%20Serang."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold border border-emerald-700 transition-all"
              >
                <Phone className="w-4 h-4 text-amber-300" />
                <span>Chat Hotline WA</span>
              </a>
            </div>
          </div>
        </div>

        {/* Branches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedBranches.map((branch, index) => {
            const isNearest = userLocation && index === 0;

            return (
              <div
                key={branch.id}
                className={`rounded-2xl border transition-all p-5 flex flex-col justify-between relative ${
                  isNearest
                    ? 'bg-emerald-50/70 border-emerald-500 shadow-md ring-2 ring-emerald-400/30'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                {/* Nearest Tag */}
                {isNearest && (
                  <div className="absolute -top-3 left-6 bg-gradient-to-r from-emerald-700 to-emerald-800 text-white text-[11px] font-bold px-3 py-0.5 rounded-full shadow-md flex items-center gap-1 border border-emerald-400/40">
                    <Navigation className="w-3 h-3 text-amber-300" />
                    <span>POSKO TERDEKAT DARI ANDA</span>
                  </div>
                )}

                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      {branch.regency}
                    </span>

                    {branch.distance !== null && (
                      <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                        {branch.distance} km
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900">
                    {branch.name}
                  </h3>

                  <div className="mt-3 space-y-2 text-xs text-slate-600">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <span>{branch.address}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{branch.operationalHours}</span>
                    </div>

                    <div className="flex items-center gap-2 font-medium text-slate-800">
                      <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>Call Center: {branch.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                  <a
                    href={branch.googleMapsUrl || `https://maps.google.com/?q=${branch.latitude},${branch.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Buka Rute Google Maps</span>
                  </a>

                  <a
                    href={`https://wa.me/${branch.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Assalamu'alaikum, saya ingin datang konsultasi langsung ke Posko LBH Ansor ${branch.name}. Apakah buka hari ini?`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-xl transition-colors"
                    title="Chat Posko WA"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
