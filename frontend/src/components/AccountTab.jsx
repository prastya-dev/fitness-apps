import { User, Settings, LogOut, ChevronRight, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';

export default function AccountTab() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 mb-1">Akun Saya</h2>
          <p className="text-slate-400 text-sm">Kelola profil dan pengaturan.</p>
        </div>
        <button className="p-2 bg-white/5 border border-white/20 rounded-full text-slate-300 hover:bg-white/10 transition-colors">
          <Edit3 className="w-5 h-5" />
        </button>
      </div>

      <div className="glass-card p-6 flex items-center gap-5 border border-white/10">
        <div className="w-20 h-20 rounded-full bg-brand-900 border-2 border-brand-500 overflow-hidden shadow-lg shadow-brand-500/20">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col">
          <h3 className="text-xl font-bold text-slate-100">
            {user?.user_metadata?.full_name || 'User'}
          </h3>
          <p className="text-sm text-brand-400 font-medium mb-1">{user?.email}</p>
          <span className="text-xs bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded-full border border-brand-500/30 w-max mt-1">
            Member
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <button className="glass-card p-4 flex items-center justify-between border border-white/5 hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-500/20 rounded-xl">
              <User className="w-5 h-5 text-brand-400" />
            </div>
            <span className="font-semibold text-slate-200">Data Pribadi</span>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500" />
        </button>
        
        <button className="glass-card p-4 flex items-center justify-between border border-white/5 hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-500/20 rounded-xl">
              <Settings className="w-5 h-5 text-brand-400" />
            </div>
            <span className="font-semibold text-slate-200">Pengaturan</span>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500" />
        </button>
      </div>

      <button 
        onClick={handleLogout}
        className="mt-6 glass-card p-4 flex items-center justify-center gap-2 border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold transition-colors"
      >
        <LogOut className="w-5 h-5" />
        Keluar Akun
      </button>
    </div>
  );
}
