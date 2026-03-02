import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { useConfirmStore } from '../../stores/confirmStore';

export default function ConfirmDialog() {
  const { isOpen, title, message, confirmLabel, cancelLabel, variant, accept, dismiss } =
    useConfirmStore();
  const confirmRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const handleEsc = (e) => {
        if (e.key === 'Escape') {
          e.stopPropagation();
          dismiss();
        }
      };
      // Use capture to intercept before keyboard shortcuts
      document.addEventListener('keydown', handleEsc, true);
      // Focus the confirm button for keyboard accessibility
      setTimeout(() => confirmRef.current?.focus(), 100);
      return () => document.removeEventListener('keydown', handleEsc, true);
    }
  }, [isOpen, dismiss]);

  const Icon = variant === 'danger' ? Trash2 : AlertTriangle;
  const accentColor = variant === 'danger' ? '#ef4444' : '#f59e0b';

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[600] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-[6px]"
            onClick={dismiss}
          />

          {/* Dialog */}
          <motion.div
            className="confirm-dialog"
            initial={{ scale: 0.92, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 4 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          >
            {/* Icon */}
            <div
              className="confirm-dialog-icon"
              style={{
                background: `color-mix(in srgb, ${accentColor} 12%, transparent)`,
                color: accentColor,
              }}
            >
              <Icon size={22} strokeWidth={2} />
            </div>

            {/* Text */}
            <h3 className="confirm-dialog-title">{title}</h3>
            {message && <p className="confirm-dialog-message">{message}</p>}

            {/* Actions */}
            <div className="confirm-dialog-actions">
              <button
                className="confirm-dialog-btn confirm-dialog-btn--cancel"
                onClick={dismiss}
              >
                {cancelLabel}
              </button>
              <button
                ref={confirmRef}
                className="confirm-dialog-btn confirm-dialog-btn--confirm"
                style={{
                  background: accentColor,
                  boxShadow: `0 2px 10px color-mix(in srgb, ${accentColor} 35%, transparent)`,
                }}
                onClick={accept}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
