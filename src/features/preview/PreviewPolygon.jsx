import { useState, useCallback, memo } from 'react';
import { STATUS } from '../../utils/constants';

const PreviewPolygon = memo(function PreviewPolygon({ unit, onHover, onLeave, onClick }) {
  const [isHovered, setIsHovered] = useState(false);
  const status = STATUS[unit.status] || STATUS.available;
  const pointsStr = unit.points.map((p) => `${p.x},${p.y}`).join(' ');

  const handleEnter = useCallback(
    (e) => {
      setIsHovered(true);
      onHover({ x: e.clientX + 16, y: e.clientY - 10 });
    },
    [onHover]
  );

  const handleMove = useCallback(
    (e) => {
      onHover({ x: e.clientX + 16, y: e.clientY - 10 });
    },
    [onHover]
  );

  const handleLeave = useCallback(() => {
    setIsHovered(false);
    onLeave();
  }, [onLeave]);

  return (
    <polygon
      points={pointsStr}
      fill={isHovered ? status.fillHover : status.fill}
      stroke={status.stroke}
      strokeWidth={isHovered ? 0.7 : 0.4}
      className="pv-polygon"
      style={{
        filter: isHovered ? `drop-shadow(0 0 4px ${status.color}66)` : 'none',
        transition: 'fill 150ms, stroke-width 150ms, filter 200ms',
      }}
      onMouseEnter={handleEnter}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    />
  );
});

export default PreviewPolygon;
