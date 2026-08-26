import { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, RefreshCw, Scale, Ruler, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../lib/AuthContext';
import { apiFetch, formatGoalLabel } from '../lib/api';

export default function AITrainerTab() {
  const { user, profile } = useAuth();
  const chatEndRef = useRef(null);

  const name = profile?.full_name?.split(' ')[0] || user?.user_metadata?.full_name?.split(' ')[0] || 'Teman';
  const weight = profile?.weight_kg || 65;
  const height = profile?.height_cm || 170;
  const age = profile?.age || 25;
  const targetW = profile?.target_weight || 70;
  const goalLabel = formatGoalLabel(profile?.goal);

  const initialGreeting = {
    id: 1,
    text: `Halo ${name}! 🏋️‍♂️ Sebagai AI Trainer personalmu (BB: ${weight}kg, TB: ${height}cm, Target: ${targetW}kg), ada yang ingin kamu konsultasikan tentang alur latihan atau program nutrisi harimu?`,
    sender: 'bot'
  };

  const [messages, setMessages] = useState([initialGreeting]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (customText = null) => {
    const textToSend = typeof customText === 'string' ? customText : input;
    if (!textToSend.trim() || loading) return;

    const userMessage = { id: Date.now(), text: textToSend, sender: 'user' };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    if (!customText) setInput("");
    setLoading(true);

    try {
      const payloadMessages = updatedMessages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }));

      const res = await apiFetch('/ai/chat', {
        method: 'POST',
        body: {
          messages: payloadMessages,
          user_context: {
            full_name: profile?.full_name || name,
            weight_kg: weight,
            height_cm: height,
            age: age,
            target_weight: targetW,
            goal: profile?.goal || 'muscle_gain',
          }
        }
      });

      const replyText = res?.message || `Baik ${name}, aku mencatat pertanyaanmu. Pastikan kamu memenuhi kebutuhan hidrasi & protein harianmu ya! 💪`;

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: replyText,
        sender: 'bot'
      }]);
    } catch (err) {
      console.warn('AI Chat fetch error:', err.message);
      // Fallback bot answer
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: `Halo ${name}! Berdasarkan profilmu (BB ${weight}kg & target ${targetW}kg), konsistensi latihan 3-4x seminggu dan asupan protein ~${Math.round(weight * 1.8)}g/hari sangat disarankan. Ada pertanyaan lain? 💪`,
        sender: 'bot'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([initialGreeting]);
  };

  const quickPrompts = [
    `Rekomendasi protein & kalori untuk BB ${weight}kg`,
    `Jadwal latihan terbaik untuk ${goalLabel}`,
    `Tips raih target berat ${targetW}kg`,
    `Cara pemanasan yang benar`
  ];

  return (
    <div className="flex flex-col h-full absolute inset-0 pb-28">
      {/* Header */}
      <div className="p-4 border-b border-white/10 glass-card mx-4 mt-4 rounded-2xl z-10 flex flex-col gap-2 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-500/20 rounded-full border border-brand-500/30 text-brand-400">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 leading-tight">AI Trainer</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <p className="text-brand-400 text-xs font-semibold">Online & Konteks Fisik Aktif</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleReset}
            title="Reset Percakapan"
            className="p-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 rounded-xl transition-colors text-xs flex items-center gap-1 border border-white/10"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* User Context Bar */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-brand-400" />
            <span className="font-semibold text-slate-100">{name}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-cyan-300 font-medium">
              <Scale className="w-3 h-3 text-cyan-400" /> {weight}kg
            </span>
            <span className="flex items-center gap-1 text-purple-300 font-medium">
              <Ruler className="w-3 h-3 text-purple-400" /> {height}cm
            </span>
            <span className="flex items-center gap-1 text-emerald-300 font-medium">
              <Target className="w-3 h-3 text-emerald-400" /> {targetW}kg
            </span>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.map(msg => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] rounded-2xl p-4 flex gap-3 ${
              msg.sender === 'user'
                ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-tr-sm shadow-md'
                : 'glass-card border border-white/15 rounded-tl-sm text-slate-200 shadow-sm bg-[#0d1424]/90'
            }`}>
              {msg.sender === 'bot' && (
                <div className="p-1.5 bg-brand-500/20 rounded-lg text-brand-400 h-max flex-shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                {msg.text}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Typing Indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="glass-card border border-white/15 rounded-2xl rounded-tl-sm p-4 text-slate-400 flex items-center gap-2 text-xs">
              <Bot className="w-4 h-4 text-brand-400 animate-spin" />
              <span>AI Trainer sedang berpikir...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Suggestion Chips */}
      <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            disabled={loading}
            className="flex-shrink-0 text-[11px] bg-white/5 hover:bg-brand-500/20 text-slate-300 hover:text-brand-300 border border-white/15 hover:border-brand-500/40 rounded-full px-3 py-1.5 transition-all flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-brand-400" />
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-transparent mt-auto relative z-20">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="glass-card rounded-full p-2 pl-5 pr-2 flex items-center gap-3 border border-white/20 shadow-2xl bg-[#0B1021]/90">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Tanya AI Trainer (contoh: "Menu makan siang untuk BB ${weight}kg")...`}
            className="flex-1 bg-transparent border-none text-slate-100 text-sm focus:outline-none placeholder-slate-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-3 bg-brand-500 hover:bg-brand-400 disabled:opacity-50 text-white rounded-full transition-colors flex-shrink-0 shadow-[0_0_15px_rgba(34,211,238,0.4)]"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
