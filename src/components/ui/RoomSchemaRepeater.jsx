import { memo, useCallback } from 'react';
import { Plus, X } from 'lucide-react';

const RoomSchemaRepeater = memo(function RoomSchemaRepeater({ value = [], onChange }) {
  const handleAdd = useCallback(() => {
    onChange([...value, { name: '', area: '' }]);
  }, [value, onChange]);

  const handleRemove = useCallback((index) => {
    onChange(value.filter((_, i) => i !== index));
  }, [value, onChange]);

  const handleChange = useCallback((index, field, val) => {
    const updated = value.map((item, i) =>
      i === index ? { ...item, [field]: val } : item
    );
    onChange(updated);
  }, [value, onChange]);

  return (
    <div>
      <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-2 block">
        Room Layout
      </label>
      <div className="flex flex-col gap-1.5">
        {value.map((room, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <input
              type="text"
              placeholder="Room name"
              value={room.name}
              onChange={(e) => handleChange(i, 'name', e.target.value)}
              className="flex-1 min-w-0 px-2.5 py-2 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-[var(--radius-sm)] text-[var(--text-primary)] text-[12px] outline-none focus:border-[var(--border-focus)] transition-colors"
            />
            <input
              type="number"
              placeholder="m²"
              value={room.area}
              min="0"
              onChange={(e) => handleChange(i, 'area', e.target.value)}
              className="w-16 px-2.5 py-2 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-[var(--radius-sm)] text-[var(--text-primary)] text-[12px] outline-none focus:border-[var(--border-focus)] transition-colors"
            />
            <button
              type="button"
              onClick={() => handleRemove(i)}
              className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-sm)] bg-transparent border-none text-[var(--text-tertiary)] hover:text-[var(--red)] hover:bg-[rgba(239,68,68,0.1)] cursor-pointer transition-all flex-shrink-0"
            >
              <X size={13} />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={handleAdd}
        className="mt-2 flex items-center gap-1.5 px-3 py-1.5 bg-[var(--bg-tertiary)] border border-dashed border-[var(--border)] rounded-[var(--radius-sm)] text-[var(--text-tertiary)] text-[11px] font-semibold cursor-pointer hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
      >
        <Plus size={12} />
        Add Room
      </button>
    </div>
  );
});

export default RoomSchemaRepeater;
