import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Bell, HelpCircle, User, BookOpen, Music, Dumbbell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

export default function NavbarTop() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'Dapa';

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const handleNavigate = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <div className="flex justify-between items-center p-6 bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-brand-900 border-2 border-brand-500 overflow-hidden shadow-sm">
          <img
            src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'Felix'}`}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium">Selamat Datang,</p>
          <p className="text-sm font-bold text-slate-100">{displayName}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3 relative">
        <button className="p-2 bg-white/10 rounded-full backdrop-blur-md text-slate-300 hover:bg-white/20 transition-all shadow-sm border border-white/20">
          <Bell className="w-5 h-5" />
        </button>
        
        {/* 3-dots Menu Container */}
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 bg-white/10 rounded-full backdrop-blur-md text-slate-300 hover:bg-white/20 transition-all shadow-sm border border-white/20 focus:outline-none"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-3 w-56 glass-card bg-[#0c1021]/90 border border-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden z-[60]"
              >
                <div className="flex flex-col p-2 gap-1">
                  <button onClick={() => handleNavigate('/home/account')} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/10 text-slate-200 transition-colors text-left text-sm font-medium">
                    <User className="w-4 h-4 text-brand-400" />
                    Akun
                  </button>
                  <button onClick={() => handleNavigate('/home/musclebook')} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/10 text-slate-200 transition-colors text-left text-sm font-medium">
                    <Dumbbell className="w-4 h-4 text-brand-400" />
                    Muscle Book
                  </button>
                  <button onClick={() => handleNavigate('/home/recipes')} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/10 text-slate-200 transition-colors text-left text-sm font-medium">
                    <BookOpen className="w-4 h-4 text-brand-400" />
                    Buku Menu Diet
                  </button>
                  <button onClick={() => handleNavigate('/home/playlist')} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/10 text-slate-200 transition-colors text-left text-sm font-medium">
                    <Music className="w-4 h-4 text-brand-400" />
                    Playlist Lagu
                  </button>
                  <div className="h-[1px] w-full bg-white/10 my-1"></div>
                  <button className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/10 text-slate-200 transition-colors text-left text-sm font-medium">
                    <HelpCircle className="w-4 h-4 text-brand-400" />
                    Bantuan
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
