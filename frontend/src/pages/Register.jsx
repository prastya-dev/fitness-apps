// frontend/src/pages/Register.jsx
// Halaman registrasi akun baru dengan Backend API (/api/auth/register)

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Eye, EyeOff, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../lib/AuthContext';

export default function Register() {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  
  const navigate = useNavigate();
  const { registerApi } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }
    if (password !== confirm) {
      setError('Password dan konfirmasi password tidak cocok.');
      return;
    }

    setLoading(true);

    try {
      await registerApi(email.trim(), password, name.trim());
      setLoading(false);
      // Lanjut langsung ke alur pengisian fisik awal di /setup
      navigate('/setup');
    } catch (err) {
      setLoading(false);
      const msg = err.message || '';
      if (msg.includes('already registered')) {
        setError('Email ini sudah terdaftar. Silakan login.');
      } else {
        setError(msg || 'Gagal mendaftar. Periksa koneksi atau data kamu.');
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center px-8 z-10 relative overflow-y-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center mb-6"
      >
        <div className="w-16 h-16 bg-brand-900/40 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-brand-500/30 shadow-xl mb-3">
          <Dumbbell className="w-8 h-8 text-brand-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-100">Buat Akun Baru</h1>
        <p className="text-slate-400 text-sm mt-1">Mulai perjalanan fitness-mu 💪</p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        onSubmit={handleRegister}
        className="glass-card p-6 flex flex-col gap-4"
      >
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/15 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400 font-medium"
          >
            {error}
          </motion.div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-300 ml-1">Nama Panggilan</label>
          <input
            type="text"
            placeholder="Nama kamu"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all text-sm"
            required
            disabled={loading}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-300 ml-1">Email</label>
          <input
            type="email"
            placeholder="nama@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all text-sm"
            required
            disabled={loading}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Min. 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 pr-12 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all text-sm"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPass(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-300 ml-1">Konfirmasi Password</label>
          <input
            type={showPass ? 'text' : 'password'}
            placeholder="Ulangi password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all text-sm"
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl px-4 py-3.5 font-semibold flex items-center justify-center gap-2 shadow-lg shadow-brand-500/30 transition-all active:scale-95 text-base"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Mendaftar...
            </span>
          ) : (
            <>Daftar <UserPlus className="w-5 h-5" /></>
          )}
        </button>
      </motion.form>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 text-center text-sm text-slate-400"
      >
        Sudah punya akun?{' '}
        <button
          onClick={() => navigate('/login')}
          className="text-brand-400 font-semibold hover:underline"
        >
          Masuk
        </button>
      </motion.p>
    </div>
  );
}
