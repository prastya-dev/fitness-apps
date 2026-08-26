import { useState } from 'react';
import { Bot, Send, User } from 'lucide-react';

export default function AITrainerTab() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Halo Dapa! Ada yang ingin ditanyakan tentang latihan atau dietmu hari ini?", sender: 'bot' }
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Add user message
    setMessages([...messages, { id: Date.now(), text: input, sender: 'user' }]);
    setInput("");
    
    // Mock bot reply
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        text: "Baik, aku catat. Jangan lupa untuk jaga asupan protein setelah latihan ini ya!", 
        sender: 'bot' 
      }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full absolute inset-0 pb-28">
      {/* Header */}
      <div className="p-6 border-b border-white/10 glass-card mx-4 mt-4 rounded-t-2xl z-10 flex items-center gap-3">
        <div className="p-2 bg-brand-500/20 rounded-full border border-brand-500/30">
          <Bot className="w-6 h-6 text-brand-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-100 leading-tight">AI Trainer</h2>
          <p className="text-brand-400 text-xs font-medium">Online</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-4 flex gap-3 ${
              msg.sender === 'user' 
                ? 'bg-brand-600 text-white rounded-tr-sm shadow-[0_4px_20px_rgba(34,211,238,0.2)]' 
                : 'glass-card border border-white/10 rounded-tl-sm text-slate-200'
            }`}>
              {msg.sender === 'bot' && (
                <Bot className="w-5 h-5 flex-shrink-0 text-brand-400" />
              )}
              <p className="text-sm leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-transparent mt-auto relative z-20">
        <form onSubmit={handleSend} className="glass-card rounded-full p-2 pl-6 pr-2 flex items-center gap-3 border border-white/20 shadow-2xl bg-[#0B1021]/80">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanya tentang program diet..."
            className="flex-1 bg-transparent border-none text-slate-100 text-sm focus:outline-none placeholder-slate-500"
          />
          <button 
            type="submit"
            className="p-3 bg-brand-500 hover:bg-brand-400 text-white rounded-full transition-colors flex-shrink-0 shadow-[0_0_15px_rgba(34,211,238,0.4)]"
          >
            <Send className="w-4 h-4 ml-1" />
          </button>
        </form>
      </div>
    </div>
  );
}
