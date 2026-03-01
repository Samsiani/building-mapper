import { memo } from 'react';
import { useEditorStore } from '../../../stores/editorStore';
import { useEditHandles } from '../../../hooks/useEditHandles';

const HandleLayer = memo(function HandleLayer({ svgRef }) {
  const activeTool = useEditorStore((s) => s.activeTool);
  const selectedUnitId = useEditorStore((s) => s.selectedUnitId);

  if (activeTool !== 'edit' || !selectedUnitId) return null;

  return <EditHandlesInner svgRef={svgRef} unitId={selectedUnitId} />;
});

function EditHandlesInner({ svgRef, unitId }) {
  const { handles, onHandleMouseDown } = useEditHandles(svgRef, unitId);

  return (
    <g className="handle-layer">
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
        />
      ))}
    </g>
  );
}

export default HandleLayer;
