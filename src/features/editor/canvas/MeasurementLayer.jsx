import { memo } from 'react';

const MeasurementLayer = memo(function MeasurementLayer({ measurement }) {
  if (!measurement || !measurement.startPoint) return null;

  const { startPoint, endPoint, distance } = measurement;

  return (
    <g className="measurement-layer" style={{ pointerEvents: 'none' }}>
      {/* Start point */}
      <circle cx={startPoint.x} cy={startPoint.y} r="0.8" fill="#f59e0b" stroke="#fff" strokeWidth="0.2" />

      {endPoint && (
        <>
          {/* Line */}
          <line
            x1={startPoint.x} y1={startPoint.y}
            x2={endPoint.x} y2={endPoint.y}
            stroke="#f59e0b"
            strokeWidth="0.3"
            strokeDasharray="1,0.5"
          />
          {/* End point */}
          <circle cx={endPoint.x} cy={endPoint.y} r="0.8" fill="#f59e0b" stroke="#fff" strokeWidth="0.2" />
          {/* Distance label */}
          <text
            x={(startPoint.x + endPoint.x) / 2}
            y={(startPoint.y + endPoint.y) / 2 - 1.5}
            textAnchor="middle"
            fill="#f59e0b"
            fontSize="2"
            fontFamily="Inter, sans-serif"
            fontWeight="600"
          >
            {distance.toFixed(1)} units
          </text>
        </>
      )}
    </g>
  );
});

export default MeasurementLayer;
