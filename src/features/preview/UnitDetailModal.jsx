import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Maximize2, DollarSign, BedDouble, Compass,
  Sun, StickyNote, Mail, Phone, ArrowRight, CheckCircle2, Clock, XCircle
} from 'lucide-react';
import { STATUS } from '../../utils/constants';
import { formatPrice } from '../../utils/formatPrice';

const STATUS_ICONS = {
  available: CheckCircle2,
  reserved: Clock,
  sold: XCircle,
};

const STATUS_MESSAGES = {
  available: 'This unit is available for purchase',
  reserved: 'This unit is currently reserved',
  sold: 'This unit has been sold',
};

export default function UnitDetailModal({ unit, config, onClose }) {
  useEffect(() => {
    if (unit) {
      document.body.style.overflow = 'hidden';
      const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
      document.addEventListener('keydown', handleEsc);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleEsc);
      };
    }
  }, [unit, onClose]);

  return createPortal(
    <AnimatePresence>
      {unit && <ModalContent unit={unit} config={config} onClose={onClose} />}
    </AnimatePresence>,
    document.body
  );
}

function ModalContent({ unit, config, onClose }) {
  const status = STATUS[unit.status] || STATUS.available;
  const StatusIcon = STATUS_ICONS[unit.status] || CheckCircle2;
  const pricePerSqm = unit.area > 0 ? Math.round(unit.price / unit.area) : 0;

  const mailto = `mailto:${config.contactEmail || ''}?subject=${encodeURIComponent(`Inquiry: ${unit.name}`)}&body=${encodeURIComponent(`Hello,\n\nI am interested in ${unit.name} (${unit.area}m², ${formatPrice(unit.price, config.currency)}).\nPlease contact me with more details.\n\nThank you.`)}`;

  return (
    <motion.div
      className="fixed inset-0 z-[500] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/40 backdrop-blur-[6px]"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Modal */}
      <motion.div
        className="relative bg-white rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.15),0_4px_16px_rgba(0,0,0,0.06)] max-w-[480px] w-full overflow-hidden"
        initial={{ scale: 0.92, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 10, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
      >
        {/* Status color banner */}
        <div
          className="h-[5px]"
          style={{ background: `linear-gradient(90deg, ${status.color}, ${status.color}99, ${status.color}44)` }}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-10 w-8 h-8 border-none rounded-full bg-black/[0.04] text-[var(--pv-text-muted)] cursor-pointer flex items-center justify-center hover:bg-black/[0.08] hover:text-[var(--pv-text)] transition-all"
        >
          <X size={16} strokeWidth={2.5} />
        </button>

        {/* Content */}
        <div className="px-7 pt-6 pb-7">
          {/* Unit name + badge */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.3 }}
          >
            <h2 className="font-[var(--font-display)] text-[26px] font-bold text-[var(--pv-text)] leading-tight mb-2.5 pr-8">
              {unit.name}
            </h2>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-bold uppercase tracking-wider mb-5"
              style={{ background: `${status.color}10`, color: status.color }}
            >
              <StatusIcon size={14} strokeWidth={2.5} />
              {STATUS_MESSAGES[unit.status]}
            </div>
          </motion.div>

          {/* Price hero block */}
          <motion.div
            className="bg-gradient-to-r from-[var(--pv-accent)]/[0.04] to-transparent rounded-xl p-5 mb-5 border border-[var(--pv-accent)]/[0.08]"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <div className="flex items-baseline gap-3">
              <span className="font-[var(--font-display)] text-[32px] font-bold text-[var(--pv-accent)] tracking-tight leading-none">
                {formatPrice(unit.price, config.currency)}
              </span>
            </div>
            {pricePerSqm > 0 && (
              <div className="text-[13px] text-[var(--pv-text-muted)] mt-1.5 font-medium">
                {formatPrice(pricePerSqm, config.currency)} per m²
              </div>
            )}
          </motion.div>

          {/* Details grid — icon-paired rows */}
          <motion.div
            className="grid grid-cols-2 gap-x-5 gap-y-0 mb-5"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.3 }}
          >
            <DetailRow icon={Maximize2} label="Area" value={`${unit.area} m²`} />
            <DetailRow icon={BedDouble} label="Rooms" value={`${unit.rooms} ${unit.rooms === 1 ? 'room' : 'rooms'}`} />
            <DetailRow icon={Compass} label="Orientation" value={unit.orientation} />
            <DetailRow icon={Sun} label="Balcony" value={unit.balcony ? 'Yes' : 'No'} />
          </motion.div>

          {/* Notes */}
          {unit.notes && (
            <motion.div
              className="flex gap-3 p-4 bg-[#f8f8f5] rounded-xl mb-5"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <StickyNote size={16} className="text-[var(--pv-text-muted)] flex-shrink-0 mt-0.5" />
              <p className="text-[13px] text-[var(--pv-text-secondary)] leading-relaxed italic">
                "{unit.notes}"
              </p>
            </motion.div>
          )}

          {/* CTA section */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.3 }}
          >
            {unit.status === 'available' ? (
              <div className="flex flex-col gap-2.5">
                <a
                  href={mailto}
                  className="group flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl text-[15px] font-bold text-center no-underline transition-all active:scale-[0.98]"
                  style={{
                    background: `linear-gradient(135deg, var(--pv-accent), var(--pv-accent-light))`,
                    color: 'white',
                    boxShadow: '0 4px 14px rgba(26, 54, 93, 0.25)',
                  }}
                >
                  <Mail size={16} strokeWidth={2.5} />
                  Inquire About This Unit
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </a>
                {config.contactPhone && (
                  <a
                    href={`tel:${config.contactPhone.replace(/\s/g, '')}`}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-[var(--pv-border)] text-[14px] font-semibold text-[var(--pv-text-secondary)] no-underline hover:border-[var(--pv-accent)]/30 hover:text-[var(--pv-accent)] transition-all active:scale-[0.98]"
                  >
                    <Phone size={14} />
                    {config.contactPhone}
                  </a>
                )}
              </div>
            ) : (
              <div
                className="flex items-center gap-3 p-4 rounded-xl border text-[13px] font-medium"
                style={{
                  background: `${status.color}06`,
                  borderColor: `${status.color}18`,
                  color: status.color,
                }}
              >
                <StatusIcon size={18} />
                <div>
                  <div className="font-semibold">{status.label}</div>
                  <div className="text-[12px] opacity-70 mt-0.5">
                    {unit.status === 'reserved'
                      ? 'Contact us for availability updates'
                      : 'This unit is no longer available'}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-[rgba(0,0,0,0.04)]">
      <div className="w-8 h-8 rounded-lg bg-[var(--pv-accent)]/[0.06] flex items-center justify-center flex-shrink-0">
        <Icon size={15} className="text-[var(--pv-accent)]" strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-bold text-[var(--pv-text-muted)] uppercase tracking-wider leading-none mb-0.5">{label}</div>
        <div className="text-[15px] font-semibold text-[var(--pv-text)] leading-none">{value}</div>
      </div>
    </div>
  );
}
