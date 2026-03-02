import { memo } from 'react';
import { useEditorStore } from '../../../stores/editorStore';
import { useEditHandles } from '../../../hooks/useEditHandles';

const HandleLayer = memo(function HandleLayer({ svgRef }) {
  const activeTool = useEditorStore((s) => s.activeTool);
  const selectedNodeId = useEditorStore((s) => s.selectedNodeId);

  if (activeTool !== 'edit' || !selectedNodeId) return null;

  return <EditHandlesInner svgRef={svgRef} nodeId={selectedNodeId} />;
});

function EditHandlesInner({ svgRef, nodeId }) {
  const { handles, midpoints, onHandleMouseDown, onMidpointClick, onHandleDoubleClick } = useEditHandles(svgRef, nodeId);

  return (
    <g className="handle-layer">
      {/* Midpoint handles — fat hitbox pattern */}
      {midpoints.map((mp, i) => (
        <g
          key={`mid-${i}`}
          className="midpoint-handle"
          onClick={(e) => onMidpointClick(e, mp.afterIndex)}
          style={{ cursor: 'copy' }}
        >
          {/* Fat invisible hitbox */}
          <circle cx={mp.x} cy={mp.y} r={2.5} fill="transparent" stroke="transparent" />
          {/* Visual circle */}
          <circle
            cx={mp.x} cy={mp.y} r={0.7}
            fill="none"
            stroke="#818cf8"
            strokeWidth="0.2"
            strokeDasharray="0.4,0.3"
            style={{ pointerEvents: 'none' }}
          />
        </g>
      ))}

      {/* Vertex handles */}
      {handles.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={1}
          fill="#818cf8"
          stroke="#fff"
          strokeWidth="0.25"
          className="edit-handle"
          onMouseDown={(e) => onHandleMouseDown(e, i)}
          onDoubleClick={(e) => onHandleDoubleClick(e, i)}
        />
      ))}
    </g>
  );
}

export default HandleLayer;
