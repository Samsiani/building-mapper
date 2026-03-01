import { memo } from 'react';
import { useEditorStore } from '../../../stores/editorStore';

const GridOverlay = memo(function GridOverlay() {
  const snapSize = useEditorStore((s) => s.snapSize);
  const lines = [];

  for (let i = 0; i <= 100; i += snapSize) {
    lines.push(
      <line key={`h-${i}`} x1="0" y1={i} x2="100" y2={i} stroke="rgba(129,140,248,0.08)" strokeWidth="0.1" />,
      <line key={`v-${i}`} x1={i} y1="0" x2={i} y2="100" stroke="rgba(129,140,248,0.08)" strokeWidth="0.1" />
    );
  }

  return <g className="grid-overlay" style={{ pointerEvents: 'none' }}>{lines}</g>;
});

export default GridOverlay;
