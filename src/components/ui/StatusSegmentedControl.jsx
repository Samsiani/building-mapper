import { useRef, useEffect, useState } from 'react';
import { STATUS } from '../../utils/constants';

export default function StatusSegmentedControl({ value, onChange }) {
  const controlRef = useRef(null);
  const [pillStyle, setPillStyle] = useState({});
  const entries = Object.entries(STATUS);

  useEffect(() => {
    positionPill();
  }, [value]);

  const positionPill = () => {
    if (!controlRef.current) return;
    const ctrl = controlRef.current;
    const active = ctrl.querySelector('.status-btn.active');
    if (!active) return;
    const ctrlRect = ctrl.getBoundingClientRect();
    const btnRect = active.getBoundingClientRect();
    setPillStyle({
      left: btnRect.left - ctrlRect.left + 'px',
      width: btnRect.width + 'px',
    });
  };

  return (
    <div className="status-control" ref={controlRef}>
      {entries.map(([key, s]) => (
        <button
          key={key}
          type="button"
          className={`status-btn ${value === key ? 'active' : ''}`}
          onClick={() => onChange(key)}
        >
          <span
            className="w-[6px] h-[6px] rounded-full flex-shrink-0"
            style={{ background: s.color }}
          />
          {s.label}
        </button>
      ))}
      <div className="status-pill" style={pillStyle} />
    </div>
  );
}
