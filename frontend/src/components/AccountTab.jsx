import { useState } from 'react';
import { User, Settings, LogOut, ChevronRight, Edit3, Scale, Ruler, Calendar, Activity, Target, X, Check, HeartPulse } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../lib/AuthContext';
import { calculateBMI, formatGoalLabel } from '../lib/api';

export default function AccountTab() {
  const navigate = useNavigate();
  const { user, profile, updateProfileApi, logoutApi } = useAuth();
  
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Form edit state
  const [editName, setEditName] = useState('');
  const [editGender, setEditGender] = useState('male');
  const [editAge, setEditAge] = useState(25);
  const [editHeight, setEditHeight] = useState(170);
  const [editWeight, setEditWeight] = useState(65);
  const [editTargetWeight, setEditTargetWeight] = useState(70);
  const [editGoal, setEditGoal] = useState('muscle_gain');

  const weightKg = profile?.weight_kg || 65;
  const heightCm = profile?.height_cm || 170;
  const ageYr    = profile?.age || 25;
  const gender   = profile?.gender || 'male';
  const targetW  = profile?.target_weight || 70;
  const goalKey  = profile?.goal || 'muscle_gain';
  const fullName = profile?.full_name || user?.user_metadata?.full_name || 'Pengguna Dapawork';

  const bmiInfo = calculateBMI(weightKg, heightCm);

  const openModal = () => {
    setEditName(fullName);
    setEditGender(gender);
    setEditAge(ageYr);
    setEditHeight(heightCm);
    setEditWeight(weightKg);
    setEditTargetWeight(targetW);
    setEditGoal(goalKey);
    setIsEditOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateProfileApi({
        full_name: editName.trim() || fullName,
        gender: editGender,
        age: Number(editAge),
        height_cm: Number(editHeight),
        weight_kg: Number(editWeight),
        target_weight: Number(editTargetWeight),
        goal: editGoal,
      });

      setIsEditOpen(false);
      setToastMsg('Profil berhasil diperbarui! 🎉');
      setTimeout(() => setToastMsg(''), 3500);
    } catch (err) {
      alert('Gagal menyimpan profil: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logoutApi();
    navigate('/login');
  };

  return (
    <div className="flex flex-col gap-6 p-6 pb-28">
      {/* Toast alert */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-white font-semibold text-sm px-4 py-2.5 rounded-full shadow-lg border border-emerald-400 flex items-center gap-2"
          >
            <Check className="w-4 h-4" /> {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 mb-0.5">Akun Saya</h2>
          <p className="text-slate-400 text-xs">Kelola profil fisik dan data diri.</p>
        </div>
        <button
          onClick={openModal}
          className="p-2.5 bg-brand-500/20 border border-brand-500/40 rounded-xl text-brand-300 hover:bg-brand-500/30 transition-all flex items-center gap-1.5 text-xs font-semibold shadow-sm"
        >
          <Edit3 className="w-4 h-4 text-brand-400" /> Edit Profil
        </button>
      </div>

      {/* Profile Card */}
      <div className="glass-card p-6 flex items-center gap-5 border border-white/10 relative overflow-hidden">
        <div className="w-20 h-20 rounded-full bg-brand-900 border-2 border-brand-500 overflow-hidden shadow-lg shadow-brand-500/20 flex-shrink-0">
          <img
            src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'Felix'}`}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col min-w-0">
          <h3 className="text-xl font-bold text-slate-100 truncate">{fullName}</h3>
          <p className="text-xs text-brand-400 font-medium truncate">{user?.email}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[11px] bg-brand-500/20 text-brand-300 px-2.5 py-0.5 rounded-full border border-brand-500/30 font-medium">
              {gender === 'female' ? 'Perempuan' : 'Laki-laki'}
            </span>
            <span className="text-[11px] bg-cyan-500/20 text-cyan-300 px-2.5 py-0.5 rounded-full border border-cyan-500/30 font-medium">
              Member
            </span>
          </div>
        </div>
      </div>

      {/* Fitness & Body Stats Overview */}
      <div className="flex flex-col gap-3">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Statistik Fisik & Fitness</h4>

        {/* BMI Card Highlight */}
        <div className="glass-card p-4 border border-white/15 bg-gradient-to-r from-brand-900/30 to-purple-900/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-brand-500/20 rounded-2xl border border-brand-500/30 text-brand-400">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Indeks Massa Tubuh (BMI / IMT)</p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-bold text-white">{bmiInfo.bmi}</span>
                <span className="text-xs text-slate-400 font-medium">kg/m²</span>
              </div>
            </div>
          </div>
          <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border backdrop-blur-md ${bmiInfo.badgeBg} ${bmiInfo.color}`}>
            {bmiInfo.category}
          </span>
        </div>

        {/* 4-Grid Physical Metrics (BB, TB, Usia, Target BB) */}
        <div className="grid grid-cols-2 gap-3">
          {/* BB */}
          <div className="glass-card p-4 flex flex-col gap-2 border border-white/10">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Berat Badan (BB)</span>
              <Scale className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-100">{weightKg}</span>
              <span className="text-xs text-slate-400 font-medium">kg</span>
            </div>
          </div>

          {/* TB */}
          <div className="glass-card p-4 flex flex-col gap-2 border border-white/10">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Tinggi Badan (TB)</span>
              <Ruler className="w-4 h-4 text-brand-400" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-100">{heightCm}</span>
              <span className="text-xs text-slate-400 font-medium">cm</span>
            </div>
          </div>

          {/* Usia */}
          <div className="glass-card p-4 flex flex-col gap-2 border border-white/10">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Usia / Umur</span>
              <Calendar className="w-4 h-4 text-purple-400" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-100">{ageYr}</span>
              <span className="text-xs text-slate-400 font-medium">Tahun</span>
            </div>
          </div>

          {/* Target BB */}
          <div className="glass-card p-4 flex flex-col gap-2 border border-white/10">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Target Berat</span>
              <Target className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-100">{targetW}</span>
              <span className="text-xs text-slate-400 font-medium">kg</span>
            </div>
          </div>
        </div>

        {/* Goal Badge Card */}
        <div className="glass-card p-4 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-brand-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Tujuan Fitness Utama</p>
              <p className="text-sm font-semibold text-slate-100">{formatGoalLabel(goalKey)}</p>
            </div>
          </div>
          <button onClick={openModal} className="text-xs text-brand-400 font-medium hover:underline">
            Ubah
          </button>
        </div>
      </div>

      {/* Menu Actions */}
      <div className="flex flex-col gap-2.5">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Pengaturan</h4>

        <button onClick={openModal} className="glass-card p-4 flex items-center justify-between border border-white/5 hover:bg-white/10 transition-colors rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-500/20 rounded-xl text-brand-400">
              <User className="w-5 h-5" />
            </div>
            <span className="font-semibold text-slate-200 text-sm">Edit Data Pribadi</span>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500" />
        </button>

        <button className="glass-card p-4 flex items-center justify-between border border-white/5 hover:bg-white/10 transition-colors rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-500/20 rounded-xl text-brand-400">
              <Settings className="w-5 h-5" />
            </div>
            <span className="font-semibold text-slate-200 text-sm">Pengaturan Aplikasi</span>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500" />
        </button>
      </div>

      {/* Logout */}
      <button 
        onClick={handleLogout}
        className="mt-2 glass-card p-4 flex items-center justify-center gap-2 border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold transition-colors rounded-2xl text-sm"
      >
        <LogOut className="w-5 h-5" />
        Keluar Akun
      </button>

      {/* ======================================================== */}
      {/* EDIT PROFILE MODAL */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isEditOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card bg-[#0d1424] border border-white/20 p-6 rounded-3xl w-full max-w-md my-auto shadow-2xl flex flex-col gap-5 relative max-h-[90vh] overflow-y-auto"
            >
              {/* Header Modal */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-100">Edit Info Profil</h3>
                  <p className="text-xs text-slate-400">Perbarui statistik fisik & fitness kamu</p>
                </div>
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="p-2 bg-white/10 hover:bg-white/20 text-slate-300 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Modal */}
              <form onSubmit={handleSave} className="flex flex-col gap-4">
                {/* Nama Panggilan */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-300 ml-1">Nama Panggilan</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400/50"
                    required
                  />
                </div>

                {/* Jenis Kelamin */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-300 ml-1">Jenis Kelamin</label>
                  <select
                    value={editGender}
                    onChange={(e) => setEditGender(e.target.value)}
                    className="w-full bg-[#131b2e] border border-white/20 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400/50"
                  >
                    <option value="male">Laki-laki</option>
                    <option value="female">Perempuan</option>
                  </select>
                </div>

                {/* Grid Usia, TB, BB */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-300 ml-1">Usia (Thn)</label>
                    <input
                      type="number"
                      min="10"
                      max="120"
                      value={editAge}
                      onChange={(e) => setEditAge(e.target.value)}
                      className="w-full bg-white/5 border border-white/20 rounded-xl px-3 py-2 text-slate-100 text-sm text-center focus:outline-none focus:ring-2 focus:ring-brand-400/50"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-300 ml-1">TB (cm)</label>
                    <input
                      type="number"
                      min="50"
                      max="250"
                      value={editHeight}
                      onChange={(e) => setEditHeight(e.target.value)}
                      className="w-full bg-white/5 border border-white/20 rounded-xl px-3 py-2 text-slate-100 text-sm text-center focus:outline-none focus:ring-2 focus:ring-brand-400/50"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-300 ml-1">BB (kg)</label>
                    <input
                      type="number"
                      min="20"
                      max="300"
                      value={editWeight}
                      onChange={(e) => setEditWeight(e.target.value)}
                      className="w-full bg-white/5 border border-white/20 rounded-xl px-3 py-2 text-slate-100 text-sm text-center focus:outline-none focus:ring-2 focus:ring-brand-400/50"
                      required
                    />
                  </div>
                </div>

                {/* Target BB */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-300 ml-1">Target Berat Badan (kg)</label>
                  <input
                    type="number"
                    min="20"
                    max="300"
                    value={editTargetWeight}
                    onChange={(e) => setEditTargetWeight(e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400/50"
                  />
                </div>

                {/* Goal Fitness */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-300 ml-1">Tujuan Fitness</label>
                  <select
                    value={editGoal}
                    onChange={(e) => setEditGoal(e.target.value)}
                    className="w-full bg-[#131b2e] border border-white/20 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400/50"
                  >
                    <option value="weight_loss">Program Diet (Menurunkan Berat Badan)</option>
                    <option value="muscle_gain">Menambah Massa Otot</option>
                    <option value="maintenance">Menjaga Kebugaran</option>
                  </select>
                </div>

                {/* Modal Actions */}
                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-slate-300 py-3 rounded-xl font-semibold text-sm transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white py-3 rounded-xl font-semibold text-sm transition-all shadow-md shadow-brand-500/30 flex items-center justify-center gap-1.5"
                  >
                    {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
