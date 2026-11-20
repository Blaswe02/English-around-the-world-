import { useDialogFocus } from './useDialogFocus';
import { X, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ModalProps {
  title: string;
  message: string;
  onClose: () => void;
}

export function Modal({ title, message, onClose }: ModalProps) {
  const dialogRef=useDialogFocus(onClose);
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="notice-title" className="p-6 sm:p-8">
            <button
              onClick={onClose}
              aria-label="Melding sluiten"
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
              <Lock className="w-6 h-6" />
            </div>
            <h3 id="notice-title" className="text-2xl font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-500 leading-relaxed">{message}</p>
            <button
              onClick={onClose}
              className="mt-8 w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
            >
              Begrepen
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

