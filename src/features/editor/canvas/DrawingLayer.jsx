import { memo, useState, useCallback } from 'react';
import { useEditorStore } from '../../../stores/editorStore';
import { useSVGCoordinates } from '../../../hooks/useSVGCoordinates';

const DrawingLayer = memo(function DrawingLayer({ svgRef }) {
  const drawingPoints = useEditorStore((s) => s.drawingPoints);
  const activeTool = useEditorStore((s) => s.activeTool);
  const [guidePt, setGuidePt] = useState(null);

  // Track mouse for guide line via the parent SVG's mousemove
  // We use a transparent rect to capture moves
  const { screenToSVG } = useSVGCoordinates(svgRef);

  const handleMouseMove = useCallback(
    (e) => {
      if (drawingPoints.length > 0 && activeTool === 'pen') {
        setGuidePt(screenToSVG(e.clientX, e.clientY));
      }
    },
    [drawingPoints.length, activeTool, screenToSVG]
  );

  if (activeTool !== 'pen' && drawingPoints.length === 0) return null;

  const pointsStr = drawingPoints.map((p) => `${p.x},${p.y}`).join(' ');
  const last = drawingPoints[drawingPoints.length - 1];

  return (
    <g className="drawing-layer">
      {/* Transparent overlay to capture mouse moves */}
      <rect
        x="0" y="0" width="100" height="100"
        fill="transparent"
        style={{ pointerEvents: activeTool === 'pen' ? 'all' : 'none' }}
        onMouseMove={handleMouseMove}
      />

      {drawingPoints.length > 0 && (
        <>
          {/* Preview polyline */}
          <polyline
            points={pointsStr}
            fill="rgba(99, 102, 241, 0.15)"
            stroke="#818cf8"
            strokeWidth="0.3"
            strokeDasharray="1,0.5"
            className="drawing-preview"
          />

          {/* Guide line to cursor */}
          {guidePt && last && (
            <line
              x1={last.x} y1={last.y}
              x2={guidePt.x} y2={guidePt.y}
              stroke="#818cf8"
              strokeWidth="0.2"
              strokeDasharray="0.8,0.4"
              opacity="0.6"
              style={{ pointerEvents: 'none' }}
            />
          )}

          {/* Point dots */}
          {drawingPoints.map((p, i) => (
            <circle
              key={i}
              cx={p.x} cy={p.y}
              r={i === 0 && drawingPoints.length >= 3 ? 1.2 : 0.8}
              fill={i === 0 ? '#22c55e' : '#818cf8'}
              stroke="#fff"
              strokeWidth="0.2"
              className="draw-dot"
              style={{
                cursor: i === 0 && drawingPoints.length >= 3 ? 'pointer' : 'default',
                pointerEvents: i === 0 && drawingPoints.length >= 3 ? 'all' : 'none',
              }}
            />
          ))}
        </>
      )}
    </g>
  );
});

export default DrawingLayer;
