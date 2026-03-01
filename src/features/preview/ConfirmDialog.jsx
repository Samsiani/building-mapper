import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [open, onCancel]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="pv-confirm-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <motion.div
            className="pv-confirm-backdrop"
            onClick={onCancel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="pv-confirm-dialog"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            <div className="pv-confirm-icon">
              <AlertTriangle size={22} />
            </div>
            <h3 className="pv-confirm-title">{title}</h3>
            <p className="pv-confirm-message">{message}</p>
            <div className="pv-confirm-actions">
              <button className="pv-confirm-btn pv-confirm-btn--cancel" onClick={onCancel}>
                Cancel
              </button>
              <button className="pv-confirm-btn pv-confirm-btn--delete" onClick={onConfirm}>
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
