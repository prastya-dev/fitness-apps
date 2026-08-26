import { useState } from 'react';
import { ArrowLeft, Activity, Dumbbell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function MuscleBookTab() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('semua'); // 'semua' or 'utama'
  const [selectedMuscle, setSelectedMuscle] = useState(null);

  const muscles = [
    { id: 'chest', name: 'Chest', nameId: 'Dada', icon: true },
    { id: 'back', name: 'Back', nameId: 'Punggung', icon: false },
    { id: 'legs', name: 'Legs', nameId: 'Kaki', icon: false },
    { id: 'arms', name: 'Arms', nameId: 'Lengan', icon: false },
    { id: 'shoulders', name: 'Shoulders', nameId: 'Bahu', icon: false },
    { id: 'core', name: 'Core', nameId: 'Perut', icon: false },
  ];

  const chestExercises = [
    { id: 1, name: 'Barbell Bench Press', sets: '3 set 12 repete' },
    { id: 2, name: 'Incline Dumbbell Press', sets: '3 set 10 repete' },
    { id: 3, name: 'Cable Crossover', sets: '4 set 15 repete' },
    { id: 4, name: 'Push Up', sets: '3 set max repete' },
    { id: 5, name: 'Pec Deck Fly', sets: '3 set 12 repete' },
  ];

  // SVG component for the torso/chest icon
  const TorsoIcon = () => (
    <svg viewBox="0 0 100 100" className="w-16 h-16 mb-2">
      <path d="M50 20 C60 20, 70 25, 75 35 C80 40, 85 50, 80 60 C75 65, 70 70, 65 80 L35 80 C30 70, 25 65, 20 60 C15 50, 20 40, 25 35 C30 25, 40 20, 50 20 Z" fill="#06b6d4" stroke="#22d3ee" strokeWidth="2" />
      {/* Chest highlight */}
      <path d="M50 25 C58 25, 65 30, 68 38 C60 42, 55 40, 50 45 C45 40, 40 42, 32 38 C35 30, 42 25, 50 25 Z" fill="#f97316" />
      {/* Abs lines */}
      <line x1="50" y1="45" x2="50" y2="75" stroke="#164e63" strokeWidth="2" />
      <line x1="40" y1="55" x2="60" y2="55" stroke="#164e63" strokeWidth="2" />
      <line x1="42" y1="65" x2="58" y2="65" stroke="#164e63" strokeWidth="2" />
    </svg>
  );

  return (
    <div className="flex flex-col gap-6 p-6">
      <AnimatePresence mode="wait">
        {!selectedMuscle ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col"
          >
            {/* Header */}
            <div className="flex flex-col mb-6">
              <h2 className="text-2xl font-bold text-slate-100 mb-2">Muscle Book</h2>
              <p className="text-slate-400 text-sm">Pilih grup otot untuk melihat variasi latihannya.</p>
            </div>

            {/* Tabs */}
            <div className="flex w-full border border-white/20 rounded-xl overflow-hidden mb-6">
              <button 
                onClick={() => setActiveTab('semua')}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === 'semua' ? 'bg-cyan-400 text-[#0B1021]' : 'text-slate-300'}`}
              >
                Semua otot
              </button>
              <button 
                onClick={() => setActiveTab('utama')}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === 'utama' ? 'bg-cyan-400 text-[#0B1021]' : 'text-slate-300'}`}
              >
                otot utama
              </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 gap-4">
              {muscles.map((muscle) => (
                <button 
                  key={muscle.id}
                  onClick={() => setSelectedMuscle(muscle)}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border ${muscle.icon ? 'border-cyan-400/80 bg-cyan-900/20' : 'border-white/10 bg-white/5'} aspect-[4/5]`}
                >
                  {muscle.icon ? (
                    <TorsoIcon />
                  ) : (
                    <div className="w-16 h-16 mb-2 border border-white/10 rounded-lg flex items-center justify-center opacity-30">
                      <Activity className="w-8 h-8" />
                    </div>
                  )}
                  <span className="font-bold text-slate-100">{muscle.name}</span>
                  <span className="text-xs text-slate-400 italic">{muscle.nameId}</span>
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col"
          >
            {/* Header Detail */}
            <div className="flex items-center mb-6 relative">
              <button onClick={() => setSelectedMuscle(null)} className="p-2 absolute left-0 text-slate-300 hover:text-white bg-white/5 rounded-full border border-white/10">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold text-slate-100 w-full text-center">{selectedMuscle.name}</h2>
            </div>

            {/* Exercise List */}
            <div className="flex flex-col gap-3">
              {chestExercises.map((exercise) => (
                <div key={exercise.id} className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:border-cyan-400/50 transition-colors">
                  <div className="w-14 h-14 bg-white/10 rounded-lg flex-shrink-0 flex items-center justify-center border border-white/10">
                    <Dumbbell className="w-6 h-6 text-slate-300" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-100">{exercise.name}</span>
                    <span className="text-xs font-semibold text-cyan-400 mt-1">{exercise.sets}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
