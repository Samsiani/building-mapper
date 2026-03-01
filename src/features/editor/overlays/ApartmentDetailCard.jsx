import { memo } from 'react';
import { motion } from 'framer-motion';
import { useEditorStore } from '../../../stores/editorStore';
import { useProjectStore } from '../../../stores/projectStore';
import { NODE_TYPES } from '../../../utils/nodeTypes';
import { STATUS } from '../../../utils/constants';
import { formatPrice } from '../../../utils/formatPrice';

const ApartmentDetailCard = memo(function ApartmentDetailCard() {
  const parentId = useEditorStore((s) => s.currentView.parentId);
  const node = useProjectStore((s) => s.nodes.find((n) => n.id === parentId));
  const currency = useProjectStore((s) => s.projectConfig.currency);

  if (!node) return null;

  const typeDef = NODE_TYPES[node.type];
  if (!typeDef?.hasStatus) return null;

  const status = STATUS[node.status] || STATUS.for_sale;

  const rows = [
    { label: 'Status', value: status.label, color: status.color },
    node.price > 0 && { label: 'Price', value: formatPrice(node.price, currency) },
    node.area > 0 && { label: 'Area', value: `${node.area} m²` },
    node.rooms > 0 && { label: 'Rooms', value: node.rooms },
    node.orientation && { label: 'Orientation', value: node.orientation },
    node.entrance && { label: 'Entrance', value: node.entrance },
    { label: 'Balcony', value: node.balcony ? 'Yes' : 'No' },
  ].filter(Boolean);

  return (
    <motion.div
      className="adc"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Header */}
      <div className="adc-header">
        <span className="adc-dot" style={{ background: status.color }} />
        <span className="adc-name">{node.name}</span>
      </div>

      {/* Specs table */}
      <table className="adc-table">
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <td className="adc-td-label">{row.label}</td>
              <td className="adc-td-value">
                {row.color ? (
                  <span className="adc-status-val" style={{ '--c': row.color }}>
                    <span className="adc-status-dot" style={{ background: row.color }} />
                    {row.value}
                  </span>
                ) : row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Room schema */}
      {node.roomSchema?.length > 0 && (
        <div className="adc-rooms">
          <div className="adc-rooms-title">Room Layout</div>
          <table className="adc-table">
            <tbody>
              {node.roomSchema.map((room, i) => (
                <tr key={i}>
                  <td className="adc-td-label">{room.name || 'Room'}</td>
                  <td className="adc-td-value">{room.area ? `${room.area} m²` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Notes */}
      {node.notes && (
        <div className="adc-notes">{node.notes}</div>
      )}
    </motion.div>
  );
});

export default ApartmentDetailCard;
