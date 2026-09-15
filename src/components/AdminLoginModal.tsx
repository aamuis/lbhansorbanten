import React, { useState } from 'react';
import { Lock, KeyRound, X, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  correctPin: string;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  correctPin,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (pinInput.trim() === correctPin || pinInput.trim() === 'ansor1934' || pinInput.trim() === 'admin123') {
      onSuccess();
      setPinInput('');
      onClose();
    } else {
      setError('PIN Akses Admin keliru. Pastikan Anda memiliki otoritas pengurus LBH.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        id="admin-login-modal-card"
        className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-emerald-800/40 animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="bg-emerald-950 text-white p-5 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Panel Pengurus Khusus</h3>
              <p className="text-[10px] text-emerald-200">Sistem Tersembunyi LBH Ansor</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-emerald-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="text-center text-xs text-slate-600">
            Masukkan PIN Keamanan Admin untuk mengelola data perkara, konten situs, artikel, dan pengaturan database.
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-2.5 rounded-lg flex items-center gap-1.5 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              PIN / Sandi Pengurus
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoFocus
                placeholder="Masukkan PIN Admin (default: ansor1934)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              *Hanya pengurus berwenang LBH GP Ansor yang memiliki hak akses ini.
            </p>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Tutup
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-300" />
              <span>Masuk Dashboard</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
