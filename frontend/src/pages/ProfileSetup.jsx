import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

export default function ProfileSetup() {
  const { profile, updateProfileApi } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [gender, setGender] = useState(profile?.gender || 'male');
  const [age, setAge] = useState(profile?.age || 25);
  const [height, setHeight] = useState(profile?.height_cm || 170);
  const [weight, setWeight] = useState(profile?.weight_kg || 65);
  const [goal, setGoal] = useState('muscle_gain');
  const [equipment, setEquipment] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const goalOptions = [
    { id: 'weight_loss', label: 'Program Diet (Menurunkan Berat Badan)' },
    { id: 'muscle_gain', label: 'Menambah Massa Otot' },
    { id: 'maintenance', label: 'Menjaga Kebugaran' }
  ];

  const equipmentOptions = ['Dumbbell', 'Matras', 'Resistance Band', 'Pull-up Bar', 'Treadmill', 'Tanpa Alat'];

  const toggleEquipment = (item) => {
    if (equipment.includes(item)) {
      setEquipment(equipment.filter(e => e !== item));
    } else {
      setEquipment([...equipment, item]);
    }
  };

  const handleNext = async () => {
    if (step === 4) {
      setSubmitting(true);
      try {
        await updateProfileApi({
          full_name: fullName || profile?.full_name || 'User',
          gender,
          age: Number(age),
          height_cm: Number(height),
          weight_kg: Number(weight),
          goal,
          target_weight: goal === 'weight_loss' ? Math.max(30, Number(weight) - 5) : Math.min(200, Number(weight) + 5),
          equipment,
        });
      } catch (e) {
        console.warn('Failed saving profile:', e);
      } finally {
        setSubmitting(false);
        navigate('/home');
      }
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
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6 absolute inset-0 overflow-y-auto">
              <div>
                <h2 className="text-2xl font-bold text-slate-100 mb-2">Data Diri</h2>
                <p className="text-slate-400 text-sm">Mari tentukan info fisik awalmu.</p>
              </div>
              <div className="glass-card p-5 flex flex-col gap-5">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">Nama Panggilan</label>
                  <input
                    type="text"
                    placeholder="Nama Panggilan"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-400/50 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">Jenis Kelamin</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-[#0d1424] border border-white/20 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-400/50 text-sm"
                  >
                    <option value="male">Laki-laki</option>
                    <option value="female">Perempuan</option>
                  </select>
                </div>

                <div className="flex flex-col gap-4 pt-2">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-sm font-medium text-slate-300">
                      <span>Usia</span>
                      <span className="text-brand-400 font-bold">{age} Tahun</span>
                    </div>
                    <input type="range" min="10" max="100" value={age} onChange={(e) => setAge(e.target.value)} className="w-full accent-brand-500" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-sm font-medium text-slate-300">
                      <span>Tinggi Badan (TB)</span>
                      <span className="text-brand-400 font-bold">{height} cm</span>
                    </div>
                    <input type="range" min="100" max="250" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full accent-brand-500" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-sm font-medium text-slate-300">
                      <span>Berat Badan (BB)</span>
                      <span className="text-brand-400 font-bold">{weight} kg</span>
                    </div>
                    <input type="range" min="30" max="200" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full accent-brand-500" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6 absolute inset-0 overflow-y-auto">
              <div>
                <h2 className="text-2xl font-bold text-slate-100 mb-2">Apa Tujuanmu?</h2>
                <p className="text-slate-400 text-sm">Pilih fokus utama dari program latihanmu.</p>
              </div>
              <div className="flex flex-col gap-4">
                {goalOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setGoal(opt.id)}
                    className={`glass-card p-5 text-left border transition-all font-medium rounded-2xl ${
                      goal === opt.id ? 'border-brand-400 bg-brand-500/10 text-white shadow-md' : 'border-white/20 text-slate-300 hover:border-brand-400/50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6 absolute inset-0 overflow-y-auto">
              <div>
                <h2 className="text-2xl font-bold text-slate-100 mb-2">Alat Latihan</h2>
                <p className="text-slate-400 text-sm">Pilih alat yang kamu miliki di rumah.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {equipmentOptions.map((alat, idx) => {
                  const selected = equipment.includes(alat);
                  return (
                    <button
                      key={idx}
                      onClick={() => toggleEquipment(alat)}
                      className={`glass-card p-4 text-center border transition-all text-sm font-medium rounded-xl ${
                        selected ? 'border-brand-400 bg-brand-500/20 text-white' : 'border-white/20 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {alat}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6 absolute inset-0 overflow-y-auto">
              <div>
                <h2 className="text-2xl font-bold text-slate-100 mb-2">Jadwal Latihan</h2>
                <p className="text-slate-400 text-sm">Kapan kamu biasanya berlatih?</p>
              </div>
              <div className="glass-card p-5 flex flex-col gap-4">
                <p className="font-medium text-slate-300 text-sm">Hari Latihan (Dalam Seminggu)</p>
                <div className="flex justify-between">
                  {['S', 'S', 'R', 'K', 'J', 'S', 'M'].map((day, idx) => (
                    <button key={idx} className="w-10 h-10 rounded-full bg-white/5 border border-white/20 flex items-center justify-center font-medium text-slate-300 focus:bg-brand-500 focus:text-white transition-all text-xs">
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
          disabled={submitting}
          className="w-full bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 disabled:opacity-60 text-white rounded-xl px-4 py-4 font-semibold flex items-center justify-center gap-2 shadow-xl shadow-brand-500/30 transition-all active:scale-95 text-base"
        >
          {submitting ? (
            'Menyimpan Profil...'
          ) : (
            <>{step === 4 ? 'Selesai & Mulai' : 'Lanjut'} <ChevronRight className="w-5 h-5" /></>
          )}
        </button>
      </div>
    </div>
  );
}
