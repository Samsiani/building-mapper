import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Modal({ isOpen, onClose, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
      document.addEventListener('keydown', handleEsc);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleEsc);
      };
    }
  }, [isOpen, onClose]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[500] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="absolute inset-0 bg-black/35 backdrop-blur-[4px]" onClick={onClose} />
          <motion.div
            className="relative bg-[var(--pv-surface)] rounded-2xl shadow-lg p-9 max-w-[440px] w-[calc(100%-48px)]"
            initial={{ scale: 0.95, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-4 w-9 h-9 border-none rounded-full bg-transparent text-[var(--pv-text-muted)] text-2xl cursor-pointer flex items-center justify-center hover:bg-black/5 hover:text-[var(--pv-text)] transition-all"
            >
              <X size={20} />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
