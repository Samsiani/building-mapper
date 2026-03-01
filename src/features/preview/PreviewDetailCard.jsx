import { memo } from 'react';
import {
  Maximize2, BedDouble, Compass, Sun, DoorOpen,
  StickyNote, Building2, Mail, Phone, ArrowRight
} from 'lucide-react';
import { NODE_TYPES } from '../../utils/nodeTypes';
import { STATUS } from '../../utils/constants';
import { formatPrice } from '../../utils/formatPrice';

const PreviewDetailCard = memo(function PreviewDetailCard({ node, currency, config }) {
  if (!node) return null;

  const typeDef = NODE_TYPES[node.type];
  if (!typeDef?.hasStatus) return null;

  const status = STATUS[node.status] || STATUS.for_sale;
  const pricePerSqm = node.area > 0 && node.price > 0 ? Math.round(node.price / node.area) : 0;

  const mailto = config?.contactEmail
    ? `mailto:${config.contactEmail}?subject=${encodeURIComponent(`Inquiry: ${node.name}`)}&body=${encodeURIComponent(`Hello,\n\nI am interested in ${node.name} (${node.area}m², ${formatPrice(node.price, currency)}).\nPlease contact me with more details.\n\nThank you.`)}`
    : null;

  return (
    <aside className="pvs">
      {/* Header */}
      <div className="pvs-header">
        <h2 className="pvs-name">{node.name}</h2>
        <div className="pvs-badge" style={{ '--c': status.color }}>
          <span className="pvs-badge-dot" style={{ background: status.color }} />
          {status.label}
        </div>
      </div>

      {/* Price */}
      {node.price > 0 && (
        <div className="pvs-price-block">
          <span className="pvs-price">{formatPrice(node.price, currency)}</span>
          {pricePerSqm > 0 && (
            <span className="pvs-price-sqm">{formatPrice(pricePerSqm, currency)}/m²</span>
          )}
        </div>
      )}

      {/* Specs grid */}
      <div className="pvs-specs">
        {node.area > 0 && (
          <div className="pvs-spec">
            <Maximize2 size={16} strokeWidth={1.8} className="pvs-spec-icon" />
            <span className="pvs-spec-value">{node.area} m²</span>
            <span className="pvs-spec-label">Area</span>
          </div>
        )}
        {node.rooms > 0 && (
          <div className="pvs-spec">
            <BedDouble size={16} strokeWidth={1.8} className="pvs-spec-icon" />
            <span className="pvs-spec-value">{node.rooms}</span>
            <span className="pvs-spec-label">Rooms</span>
          </div>
        )}
        {node.orientation && (
          <div className="pvs-spec">
            <Compass size={16} strokeWidth={1.8} className="pvs-spec-icon" />
            <span className="pvs-spec-value">{node.orientation}</span>
            <span className="pvs-spec-label">Orientation</span>
          </div>
        )}
        <div className="pvs-spec">
          <Sun size={16} strokeWidth={1.8} className="pvs-spec-icon" />
          <span className="pvs-spec-value">{node.balcony ? 'Yes' : 'No'}</span>
          <span className="pvs-spec-label">Balcony</span>
        </div>
        {node.entrance && (
          <div className="pvs-spec">
            <DoorOpen size={16} strokeWidth={1.8} className="pvs-spec-icon" />
            <span className="pvs-spec-value">{node.entrance}</span>
            <span className="pvs-spec-label">Entrance</span>
          </div>
        )}
      </div>

      {/* Room layout */}
      {node.roomSchema?.length > 0 && (
        <div className="pvs-section">
          <h3 className="pvs-section-title">
            <Building2 size={13} strokeWidth={2} />
            Room Layout
          </h3>
          <div className="pvs-room-list">
            {node.roomSchema.map((room, i) => (
              <div key={i} className="pvs-room-row">
                <span className="pvs-room-name">{room.name || 'Room'}</span>
                <span className="pvs-room-area">{room.area ? `${room.area} m²` : '—'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {node.notes && (
        <div className="pvs-section">
          <h3 className="pvs-section-title">
            <StickyNote size={13} strokeWidth={2} />
            Notes
          </h3>
          <p className="pvs-notes-text">{node.notes}</p>
        </div>
      )}

      {/* Spacer */}
      <div className="pvs-spacer" />

      {/* CTA */}
      {(node.status === 'for_sale' || node.status === 'for_rent') && mailto && (
        <div className="pvs-cta">
          <a href={mailto} className="pvs-cta-btn">
            <Mail size={15} strokeWidth={2} />
            <span>Inquire Now</span>
            <ArrowRight size={14} className="pvs-cta-arrow" />
          </a>
          {config?.contactPhone && (
            <a href={`tel:${config.contactPhone.replace(/\s/g, '')}`} className="pvs-cta-phone">
              <Phone size={13} />
              {config.contactPhone}
            </a>
          )}
        </div>
      )}
    </aside>
  );
});

export default PreviewDetailCard;
