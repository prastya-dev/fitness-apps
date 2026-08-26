import { Link, useLocation } from 'react-router-dom';
import { Camera, Bot, LineChart, Dumbbell } from 'lucide-react';

export default function NavbarBottom() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="absolute fixed bottom-0 w-full p-4 bg-transparent z-50 pointer-events-none">
      <div className="glass-card p-2 flex justify-between items-center rounded-2xl shadow-[0_8px_32px_rgba(31,38,135,0.15)] pointer-events-auto">
        <NavItem to="/home" icon={<Dumbbell />} label="Workout" active={currentPath === '/home'} />
        <NavItem to="/home/photo" icon={<Camera />} label="Food Cam" active={currentPath === '/home/photo'} />
        <NavItem to="/home/ai" icon={<Bot />} label="AI Trainer" active={currentPath === '/home/ai'} />
        <NavItem to="/home/progress" icon={<LineChart />} label="Progress" active={currentPath === '/home/progress'} />
      </div>
    </div>
  );
}

function NavItem({ to, icon, label, active }) {
  return (
    <Link to={to} className={`flex flex-col items-center gap-1 p-2 rounded-xl min-w-[72px] transition-all ${active ? 'text-brand-300 bg-white/10 shadow-inner border border-white/20 backdrop-blur-md' : 'text-slate-400 hover:text-brand-400 hover:bg-white/5'}`}>
      <div className="w-6 h-6">{icon}</div>
      <span className="text-[10px] font-bold">{label}</span>
    </Link>
  );
}
