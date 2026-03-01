import { forwardRef } from 'react';
import { useEditorStore } from '../../../stores/editorStore';
import BackgroundLayer from './BackgroundLayer';
import PolygonLayer from './PolygonLayer';
import DrawingLayer from './DrawingLayer';
import HandleLayer from './HandleLayer';
import MeasurementLayer from './MeasurementLayer';
import AnnotationLayer from './AnnotationLayer';
import GridOverlay from './GridOverlay';

const MasterplanSVG = forwardRef(function MasterplanSVG({ onClick, onDoubleClick, measurement }, ref) {
  const editorTheme = useEditorStore((s) => s.editorTheme);
  const snapEnabled = useEditorStore((s) => s.snapEnabled);

  return (
    <svg
      ref={ref}
      viewBox="0 0 100 100"
      className="w-full h-full block"
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      <defs id="svg-defs" />
      <BackgroundLayer theme={editorTheme} />
      {snapEnabled && <GridOverlay />}
      <PolygonLayer svgRef={ref} />
      <AnnotationLayer />
      <DrawingLayer svgRef={ref} />
      <HandleLayer svgRef={ref} />
      <MeasurementLayer measurement={measurement} />
    </svg>
  );
});

export default MasterplanSVG;
