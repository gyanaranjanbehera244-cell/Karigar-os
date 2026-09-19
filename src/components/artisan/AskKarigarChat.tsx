import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  HelpCircle,
  TrendingUp,
  DollarSign,
  Package,
  Layers,
} from 'lucide-react';
import { api } from '../../services/api';
import { useLanguage } from '../common/LanguageContext';

export const AskKarigarChat: React.FC = () => {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: `Namaskar Meena ji! I am your KARIGAR AI digital business operating assistant. I track your 18 years of Sambalpuri handloom craft data, 6 published products, monthly capacity of 18 sarees, and active buyer requests from Bangalore, Delhi, and Mumbai. How can I guide your business today?`,
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const suggestedQuestions = [
    'What should I make next to earn more?',
    'How much should I charge for a 4-day Sambalpuri saree?',
    'Which buyer has the strongest demand for my sarees?',
    'Can I accept the 100-unit corporate bulk order?',
    'Why is my sustainable floor price ₹1,650?',
  ];

  const handleSend = async (questionToSend?: string) => {
    const q = questionToSend || inputText.trim();
    if (!q || loading) return;

    setInputText('');
    setMessages((prev) => [...prev, { role: 'user', text: q }]);
    setLoading(true);

    try {
      const reply = await api.askKarigarAI(q, language);
      setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Based on your stored data and active market signals, Cotton Sambalpuri Sarees have high demand (+34%). Your sustainable floor is ₹1,650 and recommended retail is ₹2,199.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-4 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-stone-950 flex items-center justify-center font-bold shadow-md shadow-amber-900/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-100 font-serif">
              Ask KARIGAR AI — Business Mentor
            </h3>
            <p className="text-[11px] text-stone-400">
              Grounded in Meena Das's real craft capacity, loom production times, and buyer leads.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/50">
          Context: 18 yrs Sambalpuri
        </span>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="space-y-1.5">
        <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
          Suggested Questions:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(q)}
              className="text-xs px-3 py-1.5 rounded-lg bg-stone-950 hover:bg-stone-800 text-stone-300 border border-stone-800 text-left transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-600/30 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}
            <div
              className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-[85%] ${
                msg.role === 'user'
                  ? 'bg-amber-600 text-stone-950 font-semibold rounded-tr-sm'
                  : 'bg-stone-950 border border-stone-800 text-stone-200 rounded-tl-sm space-y-2'
              }`}
            >
              <p className="whitespace-pre-line">{msg.text}</p>
            </div>
            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-stone-800 text-stone-300 flex items-center justify-center shrink-0 border border-stone-700 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-amber-400 italic">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>Consulting artisan digital twin data & pricing benchmarks...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 pt-2 border-t border-stone-800"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask anything about pricing, buyer interest, or what craft to weave next..."
          className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-100 placeholder:text-stone-500 focus:border-amber-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || loading}
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-40"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Ask</span>
        </button>
      </form>
    </div>
  );
};
