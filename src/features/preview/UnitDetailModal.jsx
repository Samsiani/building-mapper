import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Maximize2, BedDouble, Compass,
  Sun, StickyNote, Mail, Phone, ArrowRight, CheckCircle2, Clock, XCircle,
  Building2, Layers
} from 'lucide-react';
import { STATUS } from '../../utils/constants';
import { formatPrice } from '../../utils/formatPrice';

const STATUS_ICONS = {
  available: CheckCircle2,
  reserved: Clock,
  sold: XCircle,
};

const STATUS_LABELS = {
  available: 'Available',
  reserved: 'Reserved',
  sold: 'Sold',
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
      className="udm-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Backdrop */}
      <motion.div
        className="udm-backdrop"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Modal */}
      <motion.div
        className="udm-card"
        initial={{ scale: 0.94, y: 24, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.96, y: 12, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      >
        {/* Header — unit name + status + close */}
        <div className="udm-header">
          <div className="udm-header-content">
            <h2 className="udm-title">{unit.name}</h2>
            <div className="udm-badge" style={{ '--badge-color': status.color }}>
              <StatusIcon size={12} strokeWidth={2.5} />
              {STATUS_LABELS[unit.status]}
            </div>
          </div>
          <button onClick={onClose} className="udm-close" aria-label="Close">
            <X size={15} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <div className="udm-body">
          {/* Price */}
          {unit.price > 0 && (
            <motion.div
              className="udm-price-block"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 }}
            >
              <span className="udm-price">
                {formatPrice(unit.price, config.currency)}
              </span>
              {pricePerSqm > 0 && (
                <span className="udm-price-sqm">
                  {formatPrice(pricePerSqm, config.currency)}/m²
                </span>
              )}
            </motion.div>
          )}

          {/* Specs grid */}
          <motion.div
            className="udm-specs"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <SpecCard icon={Maximize2} label="Area" value={`${unit.area} m²`} />
            <SpecCard icon={BedDouble} label="Rooms" value={unit.rooms} />
            <SpecCard icon={Compass} label="Orient." value={unit.orientation || '—'} />
            <SpecCard icon={Sun} label="Balcony" value={unit.balcony ? 'Yes' : 'No'} />
          </motion.div>

          {/* Notes */}
          {unit.notes && (
            <motion.div
              className="udm-notes"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 }}
            >
              <StickyNote size={13} />
              <span>{unit.notes}</span>
            </motion.div>
          )}
        </div>

        {/* Footer CTA */}
        <motion.div
          className="udm-footer"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
        >
          {unit.status === 'available' ? (
            <>
              <a href={mailto} className="udm-cta-primary">
                <Mail size={15} strokeWidth={2} />
                <span>Inquire</span>
                <ArrowRight size={14} className="udm-cta-arrow" />
              </a>
              {config.contactPhone && (
                <a
                  href={`tel:${config.contactPhone.replace(/\s/g, '')}`}
                  className="udm-cta-secondary"
                >
                  <Phone size={13} />
                  {config.contactPhone}
                </a>
              )}
            </>
          ) : (
            <div className="udm-status-banner" style={{ '--badge-color': status.color }}>
              <StatusIcon size={16} />
              <div>
                <div className="udm-status-label">{status.label}</div>
                <div className="udm-status-sub">
                  {unit.status === 'reserved'
                    ? 'Contact us for availability updates'
                    : 'This unit is no longer available'}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function SpecCard({ icon: Icon, label, value }) {
  return (
    <div className="udm-spec">
      <Icon size={16} strokeWidth={1.8} className="udm-spec-icon" />
      <span className="udm-spec-value">{value}</span>
      <span className="udm-spec-label">{label}</span>
    </div>
  );
}
