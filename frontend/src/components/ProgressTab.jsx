import { Flame, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const sugarData = [
  { name: 'Sen', value: 45 }, { name: 'Sel', value: 38 }, { name: 'Rab', value: 50 },
  { name: 'Kam', value: 30 }, { name: 'Jum', value: 25 }, { name: 'Sab', value: 40 }, { name: 'Min', value: 35 }
];

const exerciseData = [
  { name: 'Sen', value: 45 }, { name: 'Sel', value: 60 }, { name: 'Rab', value: 0 },
  { name: 'Kam', value: 90 }, { name: 'Jum', value: 45 }, { name: 'Sab', value: 120 }, { name: 'Min', value: 30 }
];

const proteinData = [
  { name: 'Sen', value: 120 }, { name: 'Sel', value: 130 }, { name: 'Rab', value: 110 },
  { name: 'Kam', value: 140 }, { name: 'Jum', value: 150 }, { name: 'Sab', value: 135 }, { name: 'Min', value: 145 }
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0c1021] border border-brand-500/30 p-2 rounded-lg shadow-xl">
        <p className="text-slate-100 text-xs font-semibold">{`${label} : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export default function ProgressTab() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Streak Section */}
      <div className="flex items-center justify-between glass-card p-5 border border-brand-500/30 bg-gradient-to-r from-brand-900/40 to-transparent relative overflow-hidden">
        <div className="relative z-10 flex flex-col">
          <p className="text-slate-300 text-sm font-medium mb-1">Streak Latihan</p>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">14</span>
            <span className="text-slate-200 font-bold mb-1">Hari</span>
          </div>
        </div>
        <div className="relative z-10 p-3 bg-orange-500/20 rounded-full border border-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.3)]">
          <Flame className="w-8 h-8 text-orange-500" />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        
        {/* Konsumsi Gula */}
        <div className="glass-card p-5 flex flex-col gap-4 border border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-100 font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-400" /> Konsumsi Gula Harian (g)
            </h3>
          </div>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sugarData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} width={30} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="value" stroke="#22d3ee" strokeWidth={3} dot={{ r: 4, fill: '#22d3ee', strokeWidth: 2, stroke: '#0c1021' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Olahraga Per Menit */}
        <div className="glass-card p-5 flex flex-col gap-4 border border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-100 font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" /> Olahraga (Menit/Hari)
            </h3>
          </div>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={exerciseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} width={30} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="value" stroke="#4ade80" strokeWidth={3} dot={{ r: 4, fill: '#4ade80', strokeWidth: 2, stroke: '#0c1021' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Protein Harian */}
        <div className="glass-card p-5 flex flex-col gap-4 border border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-100 font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-400" /> Protein Harian (g)
            </h3>
          </div>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={proteinData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} width={30} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="value" stroke="#fb923c" strokeWidth={3} dot={{ r: 4, fill: '#fb923c', strokeWidth: 2, stroke: '#0c1021' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
