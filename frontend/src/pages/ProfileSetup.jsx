import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowLeft } from 'lucide-react';

export default function ProfileSetup() {
  const [step, setStep] = useState(1);
  const [age, setAge] = useState(25);
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(65);
  const navigate = useNavigate();

  const handleNext = () => {
    if (step === 4) {
      navigate('/home'); // Ensure we navigate to /home as requested
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="flex-1 flex flex-col p-6 z-10 relative">
      <div className="flex items-center mb-8 pt-4">
        {step > 1 ? (
          <button onClick={handleBack} className="p-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
            <ArrowLeft className="w-5 h-5 text-slate-300" />
          </button>
        ) : (
          <div className="w-9 h-9" />
        )}
        <div className="flex-1 flex justify-center gap-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${i <= step ? 'w-8 bg-brand-400' : 'w-4 bg-brand-900/50'}`} />
          ))}
        </div>
        <div className="w-9 h-9" />
      </div>

      <div className="flex-1 flex flex-col relative overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6 absolute inset-0">
              <div>
                <h2 className="text-2xl font-bold text-slate-100 mb-2">Data Diri</h2>
                <p className="text-slate-400">Mari saling mengenal untuk menyesuaikan programmu.</p>
              </div>
              <div className="glass-card p-5 flex flex-col gap-5">
                <input type="text" placeholder="Nama Panggilan" className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-400/50" />
                <select className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-400/50">
                  <option value="" className="text-slate-800">Pilih Jenis Kelamin</option>
                  <option value="l" className="text-slate-800">Laki-laki</option>
                  <option value="p" className="text-slate-800">Perempuan</option>
                </select>
                
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-sm font-medium text-slate-300">
                      <span>Umur</span>
                      <span className="text-brand-400 font-bold">{age} Tahun</span>
                    </div>
                    <input type="range" min="10" max="100" value={age} onChange={(e) => setAge(e.target.value)} className="w-full accent-brand-500" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-sm font-medium text-slate-300">
                      <span>Tinggi Badan</span>
                      <span className="text-brand-400 font-bold">{height} cm</span>
                    </div>
                    <input type="range" min="100" max="250" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full accent-brand-500" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-sm font-medium text-slate-300">
                      <span>Berat Badan</span>
                      <span className="text-brand-400 font-bold">{weight} kg</span>
                    </div>
                    <input type="range" min="30" max="200" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full accent-brand-500" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6 absolute inset-0">
              <div>
                <h2 className="text-2xl font-bold text-slate-100 mb-2">Apa Tujuanmu?</h2>
                <p className="text-slate-400">Pilih fokus utama dari program latihanmu.</p>
              </div>
              <div className="flex flex-col gap-4">
                {['Program Diet (Menurunkan Berat Badan)', 'Menambah Massa Otot', 'Menjaga Kebugaran'].map((goal, idx) => (
                  <button key={idx} className="glass-card p-5 text-left border border-white/20 hover:border-brand-400 focus:border-brand-500 transition-all font-medium text-slate-300">
                    {goal}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6 absolute inset-0">
              <div>
                <h2 className="text-2xl font-bold text-slate-100 mb-2">Alat Latihan</h2>
                <p className="text-slate-400">Pilih alat yang kamu miliki di rumah.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {['Dumbbell', 'Matras', 'Resistance Band', 'Pull-up Bar', 'Treadmill', 'Tanpa Alat'].map((alat, idx) => (
                  <button key={idx} className="glass-card p-4 text-center border border-white/20 hover:border-brand-400 focus:bg-white/10 focus:border-brand-500 transition-all text-sm font-medium text-slate-300">
                    {alat}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6 absolute inset-0">
              <div>
                <h2 className="text-2xl font-bold text-slate-100 mb-2">Jadwal Latihan</h2>
                <p className="text-slate-400">Kapan kamu biasanya berlatih?</p>
              </div>
              <div className="glass-card p-5 flex flex-col gap-4">
                <p className="font-medium text-slate-300 text-sm">Hari Latihan (Dalam Seminggu)</p>
                <div className="flex justify-between">
                  {['S', 'S', 'R', 'K', 'J', 'S', 'M'].map((day, idx) => (
                    <button key={idx} className="w-10 h-10 rounded-full bg-white/5 border border-white/20 flex items-center justify-center font-medium text-slate-400 focus:bg-brand-500 focus:text-white transition-all">
                      {day}
                    </button>
                  ))}
                </div>
                
                <p className="font-medium text-slate-300 text-sm mt-4">Waktu Latihan</p>
                <div className="grid grid-cols-2 gap-3">
                  {['Pagi (06:00 - 09:00)', 'Siang (12:00 - 14:00)', 'Sore (16:00 - 18:00)', 'Malam (19:00 - 21:00)'].map((time, idx) => (
                    <button key={idx} className="bg-white/5 border border-white/20 rounded-xl p-3 text-xs font-medium text-slate-300 focus:border-brand-500 focus:bg-white/10 text-left transition-all">
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="pb-8 pt-4 bg-transparent z-20">
        <button 
          onClick={handleNext}
          className="w-full bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white rounded-xl px-4 py-4 font-semibold flex items-center justify-center gap-2 shadow-xl shadow-brand-500/30 transition-all active:scale-95"
        >
          {step === 4 ? 'Selesai & Mulai' : 'Lanjut'} <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
