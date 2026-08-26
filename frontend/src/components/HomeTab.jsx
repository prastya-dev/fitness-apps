import { useState } from 'react';
import { Calendar, ChevronRight, CheckCircle2, Circle, Flame, Droplets, Utensils } from 'lucide-react';

export default function HomeTab() {
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Metrics Summary */}
      <div className="flex flex-col border border-white/20 overflow-hidden divide-y divide-white/20 mb-2 rounded-2xl backdrop-blur-lg bg-white/5">
        
        {/* Top Row */}
        <div className="flex ">
          
          {/* Kalori */}
          <div className="flex-1 p-4 flex flex-col justify-center">
            <p className="text-xs font-medium text-slate-300 mb-2">Kalori hari ini</p>
            <div className="flex items-baseline gap-1 mb-3">
              <span className="text-3xl font-bold text-white">500</span>
              <span className="text-sm font-medium text-slate-400">/800</span>
            </div>
            {/* Linear Progress */}
            <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-400 rounded-full" style={{ width: '50%' }}></div>
            </div>
          </div>

          {/* Progres */}
          <div className="flex-1 p-4 flex flex-col items-center justify-center">
            <p className="text-xs font-medium text-slate-300 mb-3">Progres hari ini</p>
            {/* Circular Progress (SVG) */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-700" strokeWidth="2" />
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-cyan-400" strokeWidth="2" strokeDasharray="100" strokeDashoffset="49" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-cyan-400">51%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-3 divide-x divide-white/20">
          <div className="p-3 flex flex-col items-center gap-1">
            <span className="text-xs text-slate-300">Tinggi</span>
            <span className="text-base font-semibold text-cyan-400">190cm</span>
          </div>
          <div className="p-3 flex flex-col items-center gap-1">
            <span className="text-xs text-slate-300">Berat</span>
            <span className="text-base font-semibold text-cyan-400">50kg</span>
          </div>
          <div className="p-3 flex flex-col items-center gap-1">
            <span className="text-xs text-slate-300">Target</span>
            <span className="text-base font-semibold text-cyan-400">190/80</span>
          </div>
        </div>

      </div>


      {/* Today's Workout Quest */}
      <div className="flex flex-col gap-3 mt-2">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-bold text-slate-100">Quest Latihan Hari Ini</h3>
          <span className="text-xs font-semibold text-brand-400 bg-brand-900/50 backdrop-blur-sm px-2 py-1 rounded-md border border-white/20">2 / 5 Selesai</span>
        </div>
        <div className="glass-card p-3 flex flex-col gap-2">
          <QuestItem title="Pemanasan Dinamis" reps="5 Menit" completed={true} />
          <QuestItem title="Push Up" reps="3 Set x 12 Reps" completed={true} />
          <QuestItem title="Dumbbell Row" reps="3 Set x 12 Reps" completed={false} active={true} />
          <QuestItem title="Plank" reps="60 Detik" completed={false} />
          <QuestItem title="Pendinginan" reps="5 Menit" completed={false} />
        </div>
      </div>

      {/* Nutrition Tracker */}
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-bold text-slate-100">Jurnal Nutrisi</h3>
          <span className="text-xs font-semibold text-slate-400">Target: 2100 kkal</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <NutritionCard icon={<Utensils />} title="Sarapan" calories="450" status="Terisi" />
          <NutritionCard icon={<Utensils />} title="Makan Siang" calories="650" status="Terisi" />
          <NutritionCard icon={<Utensils />} title="Makan Malam" calories="-" status="Kosong" />
          <NutritionCard icon={<Droplets />} title="Air Putih" calories="1.5 L" status="Tercatat" />
        </div>
      </div>
    </div>
  );
}

function QuestItem({ title, reps, completed, active }) {
  return (
    <div className={`flex items-center gap-4 p-3 rounded-xl transition-all backdrop-blur-sm border ${
      active ? 'bg-white/20 border-brand-400 shadow-sm' : 'bg-white/5 border-white/10 hover:bg-white/10'
    }`}>
      {completed ? (
        <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />
      ) : active ? (
        <Flame className="w-6 h-6 text-brand-400 flex-shrink-0 animate-pulse" />
      ) : (
        <Circle className="w-6 h-6 text-slate-600 flex-shrink-0" />
      )}
      <div className="flex-1">
        <p className={`font-semibold text-sm ${completed ? 'text-slate-500 line-through' : 'text-slate-100'}`}>{title}</p>
        <p className="text-xs text-slate-400 font-medium">{reps}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-600" />
    </div>
  );
}

function NutritionCard({ icon, title, calories, status }) {
  const isFilled = status !== 'Kosong';
  return (
    <div className={`glass-card p-4 transition-all flex flex-col gap-3 ${
      isFilled ? 'bg-white/10 border-white/30' : 'bg-transparent border-white/20 border-dashed'
    }`}>
      <div className="flex justify-between items-start">
        <div className={`p-2 rounded-xl backdrop-blur-sm border ${isFilled ? 'bg-brand-500/20 text-brand-400 border-brand-500/30' : 'bg-white/5 text-slate-500 border-white/10'}`}>
          {icon}
        </div>
      </div>
      <div>
        <p className={`text-sm font-semibold mb-0.5 ${isFilled ? 'text-slate-100' : 'text-slate-500'}`}>{title}</p>
        <p className="text-xs font-medium text-slate-400">
          {isFilled ? (
            <span className={title === 'Air Putih' ? 'text-blue-400' : 'text-brand-400'}>{calories} {title === 'Air Putih' ? '' : 'kkal'}</span>
          ) : (
            'Belum diisi'
          )}
        </p>
      </div>
    </div>
  );
}
