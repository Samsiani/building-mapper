import { memo, useState, useCallback, useRef, useEffect } from 'react';
import { useEditorStore } from '../../../stores/editorStore';
import { useProjectStore } from '../../../stores/projectStore';
import { useSVGCoordinates } from '../../../hooks/useSVGCoordinates';
import { applySnap } from '../../../utils/snapPoint';
import { constrainAngle } from '../../../utils/angleConstraint';

const DrawingLayer = memo(function DrawingLayer({ svgRef }) {
  const drawingPoints = useEditorStore((s) => s.drawingPoints);
  const activeTool = useEditorStore((s) => s.activeTool);
  const rectStart = useEditorStore((s) => s.rectStart);
  const cloneDrag = useEditorStore((s) => s.cloneDrag);
  const pendingPoints = useEditorStore((s) => s.pendingPoints);
  const [guidePt, setGuidePt] = useState(null);
  const [snapInfo, setSnapInfo] = useState(null);

  const { screenToSVG } = useSVGCoordinates(svgRef);

  // Track Shift key for angle constraints
  const shiftHeld = useRef(false);
  useEffect(() => {
    const down = (e) => { if (e.key === 'Shift') shiftHeld.current = true; };
    const up = (e) => { if (e.key === 'Shift') shiftHeld.current = false; };
    document.addEventListener('keydown', down);
    document.addEventListener('keyup', up);
    return () => {
      document.removeEventListener('keydown', down);
      document.removeEventListener('keyup', up);
    };
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      const { snapEnabled, snapSize, currentView } = useEditorStore.getState();
      const siblingNodes = useProjectStore.getState().nodes.filter(
        (n) => n.parentId === currentView.parentId && n.points?.length >= 2
      );

      if (drawingPoints.length > 0 && activeTool === 'pen') {
        let pt = screenToSVG(e.clientX, e.clientY);
        // Angle constraint (Shift)
        if (shiftHeld.current && drawingPoints.length > 0) {
          pt = constrainAngle(pt, drawingPoints[drawingPoints.length - 1]);
        }
        const result = applySnap(pt, { snapEnabled, snapSize, siblingNodes });
        setGuidePt(result.point);
        setSnapInfo(result.snapInfo);
        return;
      }

      if (activeTool === 'rect' && rectStart) {
        let pt = screenToSVG(e.clientX, e.clientY);
        const result = applySnap(pt, { snapEnabled, snapSize, siblingNodes });
        setGuidePt(result.point);
        setSnapInfo(result.snapInfo);
        return;
      }

      // Clone drag ghost tracking
      if (cloneDrag) {
        const pt = screenToSVG(e.clientX, e.clientY);
        setGuidePt(pt);
        setSnapInfo(null);
        return;
      }
    },
    [drawingPoints.length, drawingPoints, activeTool, screenToSVG, rectStart, cloneDrag]
  );

  const showPen = activeTool === 'pen' && drawingPoints.length > 0;
  const showRect = activeTool === 'rect' && rectStart;
  const showClone = !!cloneDrag;
  const showPending = pendingPoints && pendingPoints.length >= 3;

  if (!showPen && !showRect && !showClone && !showPending && drawingPoints.length === 0) return null;

  const pointsStr = drawingPoints.map((p) => `${p.x},${p.y}`).join(' ');
  const last = drawingPoints[drawingPoints.length - 1];

  // Rect preview geometry
  let rectX, rectY, rectW, rectH;
  if (showRect && guidePt) {
    rectX = Math.min(rectStart.x, guidePt.x);
    rectY = Math.min(rectStart.y, guidePt.y);
    rectW = Math.abs(guidePt.x - rectStart.x);
    rectH = Math.abs(guidePt.y - rectStart.y);
  }

  // Clone ghost
  let clonePointsStr = null;
  if (showClone && guidePt && cloneDrag) {
    const nodes = useProjectStore.getState().nodes;
    const source = nodes.find((n) => n.id === cloneDrag.sourceNodeId);
    if (source?.points) {
      const dx = guidePt.x - cloneDrag.startPt.x;
      const dy = guidePt.y - cloneDrag.startPt.y;
      clonePointsStr = source.points
        .map((p) => `${(p.x + dx).toFixed(2)},${(p.y + dy).toFixed(2)}`)
        .join(' ');
    }
  }

  return (
    <g className="drawing-layer">
      {/* Transparent overlay to capture mouse moves */}
      <rect
        x="0" y="0" width="100" height="100"
        fill="transparent"
        style={{ pointerEvents: activeTool === 'pen' || activeTool === 'rect' || showClone ? 'all' : 'none' }}
        onMouseMove={handleMouseMove}
      />

      {/* Pen drawing preview */}
      {showPen && (
        <>
          <polyline
            points={pointsStr}
            fill="rgba(99, 102, 241, 0.15)"
            stroke="#818cf8"
            strokeWidth="0.3"
            strokeDasharray="1,0.5"
            className="drawing-preview"
          />

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

      {/* Rectangle preview */}
      {showRect && guidePt && (
        <>
          <rect
            x={rectX} y={rectY}
            width={rectW} height={rectH}
            fill="rgba(99, 102, 241, 0.12)"
            stroke="#818cf8"
            strokeWidth="0.3"
            strokeDasharray="1,0.5"
            style={{ pointerEvents: 'none' }}
          />
          <circle
            cx={rectStart.x} cy={rectStart.y}
            r={0.8}
            fill="#22c55e"
            stroke="#fff"
            strokeWidth="0.2"
            style={{ pointerEvents: 'none' }}
          />
        </>
      )}

      {/* Clone ghost */}
      {showClone && clonePointsStr && (
        <polygon
          points={clonePointsStr}
          fill="rgba(99, 102, 241, 0.1)"
          stroke="#818cf8"
          strokeWidth="0.3"
          strokeDasharray="1,0.5"
          opacity="0.7"
          style={{ pointerEvents: 'none' }}
        />
      )}

      {/* Pending creation polygon — visible while filling sidebar form */}
      {showPending && (
        <polygon
          points={pendingPoints.map((p) => `${p.x},${p.y}`).join(' ')}
          fill="rgba(99, 102, 241, 0.2)"
          stroke="#818cf8"
          strokeWidth="0.3"
          strokeDasharray="0.8,0.4"
          style={{ pointerEvents: 'none' }}
        />
      )}

      {/* Snap indicator */}
      {guidePt && snapInfo && (showPen || showRect) && (
        <>
          {snapInfo.type === 'vertex' && (
            <rect
              x={guidePt.x - 0.8} y={guidePt.y - 0.8}
              width={1.6} height={1.6}
              fill="#22c55e"
              stroke="#fff"
              strokeWidth="0.2"
              transform={`rotate(45,${guidePt.x},${guidePt.y})`}
              style={{ pointerEvents: 'none' }}
            />
          )}
          {snapInfo.type === 'edge' && (
            <circle
              cx={guidePt.x} cy={guidePt.y}
              r={0.9}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="0.3"
              style={{ pointerEvents: 'none' }}
            />
          )}
        </>
      )}
    </g>
  );
});

export default DrawingLayer;
