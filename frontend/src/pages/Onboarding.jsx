import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Activity, Trophy, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: "Mulai Perjalananmu",
    desc: "Bangun kebiasaan sehat dan raih bentuk tubuh ideal dengan program yang dipersonalisasi.",
    icon: <Target className="w-16 h-16 text-brand-500" />
  },
  {
    id: 2,
    title: "Lacak Progresmu",
    desc: "Catat setiap latihan dan asupan nutrisimu dengan mudah setiap harinya.",
    icon: <Activity className="w-16 h-16 text-brand-500" />
  },
  {
    id: 3,
    title: "Raih Targetmu",
    desc: "Konsistensi adalah kunci. Kami akan memandumu menjadi versi terbaik dirimu.",
    icon: <Trophy className="w-16 h-16 text-brand-500" />
  }
];

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentSlide === slides.length - 1) {
      navigate('/register'); // Daftar dulu sebelum setup profil
    } else {
      setCurrentSlide(prev => prev + 1);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-8 z-10 relative">
      <div className="flex justify-end pt-4">
        <button
          onClick={() => navigate('/register')}
          className="text-sm font-medium text-slate-400 hover:text-slate-100 transition-colors"
        >
          Lewati
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center relative overflow-hidden h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center absolute"
          >
            <div className="w-48 h-48 bg-white/5 backdrop-blur-xl border border-brand-500/30 shadow-2xl rounded-full flex items-center justify-center mb-10">
              {slides[currentSlide].icon}
            </div>
            <h2 className="text-3xl font-bold text-slate-100 mb-4">
              {slides[currentSlide].title}
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed px-4">
              {slides[currentSlide].desc}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="pb-10">
        <div className="flex justify-center gap-2 mb-10">
          {slides.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === currentSlide ? 'w-8 bg-brand-500' : 'w-2.5 bg-brand-200'
              }`}
            />
          ))}
        </div>

        <button 
          onClick={handleNext}
          className="w-full bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white rounded-xl px-4 py-4 font-semibold flex items-center justify-center gap-2 shadow-xl shadow-brand-500/30 transition-all active:scale-95 text-lg"
        >
          {currentSlide === slides.length - 1 ? 'Mulai Sekarang' : 'Selanjutnya'}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
