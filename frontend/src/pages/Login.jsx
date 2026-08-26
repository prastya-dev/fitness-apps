import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

export default function Login() {
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (authError) {
      // Pesan error dalam Bahasa Indonesia
      if (authError.message.includes('Invalid login')) {
        setError('Email atau password salah. Coba lagi.');
      } else if (authError.message.includes('Email not confirmed')) {
        setError('Email belum diverifikasi. Cek inbox kamu.');
      } else {
        setError(authError.message);
      }
      return;
    }

    navigate('/home');
  };

  return (
    <div className="flex-1 flex flex-col justify-center px-8 z-10 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center mb-12"
      >
        <div className="w-20 h-20 bg-brand-900/40 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-brand-500/30 shadow-xl mb-6">
          <Dumbbell className="w-10 h-10 text-brand-400" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-brand-300 to-brand-500 bg-clip-text text-transparent mb-2">
          dapawork
        </h1>
        <p className="text-slate-400 text-center">
          Kuatkan dirimu, capai body goals impian
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        onSubmit={handleLogin}
        className="glass-card p-6 flex flex-col gap-4"
      >
        {/* Error banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/15 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400"
          >
            {error}
          </motion.div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-300 ml-1">Email</label>
          <input
            type="email"
            placeholder="nama@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 backdrop-blur-sm transition-all"
            required
            disabled={loading}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 pr-12 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 backdrop-blur-sm transition-all"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPass(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="button" className="text-xs text-brand-400 font-medium hover:underline">
            Lupa Password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl px-4 py-3.5 font-semibold flex items-center justify-center gap-2 shadow-lg shadow-brand-500/30 transition-all active:scale-95"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Masuk...
            </span>
          ) : (
            <>Masuk <ArrowRight className="w-5 h-5" /></>
          )}
        </button>
      </motion.form>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-8 text-center"
      >
        <p className="text-sm text-slate-400">
          Belum punya akun?{' '}
          <button
            onClick={() => navigate('/onboarding')}
            className="text-brand-400 font-semibold hover:underline"
          >
            Daftar sekarang
          </button>
        </p>
      </motion.div>
    </div>
  );
}
