import { useState } from 'react';
import { motion } from 'motion/react';
import { User } from 'lucide-react';

interface NicknameModalProps {
  onConfirm: (nickname: string) => void;
}

export function NicknameModal({ onConfirm }: NicknameModalProps) {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (trimmed.length < 2) return;
    onConfirm(trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="p-8">
          {/* Icon */}
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
            <User className="w-7 h-7 text-indigo-600" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-1">Welkom bij EAATW!</h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            Kies een <strong>bijnaam</strong> om je voortgang op te slaan. Gebruik je voornaam of een zelf gekozen naam — geen e-mail of wachtwoord nodig.
          </p>

          <input
            type="text"
            maxLength={20}
            placeholder="Bijv. Lisa, Groep3B, MijnNaam..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            autoFocus
            className="w-full border-2 border-slate-200 focus:border-indigo-400 rounded-xl px-4 py-3 text-base font-semibold text-slate-900 placeholder:text-slate-300 outline-none transition-all mb-2"
          />
          <p className="text-xs text-slate-400 mb-6">
            Gebruik dezelfde naam op andere apparaten om je voortgang te bewaren.
          </p>

          <button
            onClick={handleSubmit}
            disabled={value.trim().length < 2}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-200"
          >
            Begin je reis →
          </button>
        </div>
      </motion.div>
    </div>
  );
}
