import { memo } from 'react';
import { useProjectStore } from '../../../stores/projectStore';

const AnnotationLayer = memo(function AnnotationLayer() {
  const annotations = useProjectStore((s) => s.annotations);

  if (annotations.length === 0) return null;

  return (
    <g className="annotation-layer">
      {annotations.map((ann) => (
        <text
          key={ann.id}
          x={ann.x}
          y={ann.y}
          fill={ann.color || '#818cf8'}
          fontSize="2"
          fontFamily="Inter, sans-serif"
          fontWeight="600"
          textAnchor="middle"
          dominantBaseline="central"
          style={{ pointerEvents: 'none' }}
        >
          {ann.text}
        </text>
      ))}
    </g>
  );
});

export default AnnotationLayer;
