import { memo } from 'react';

const ZoomIndicator = memo(function ZoomIndicator({ zoom }) {
  return (
    <div className="absolute bottom-4 right-4 z-50 py-1.5 px-3.5 bg-[var(--bg-glass)] backdrop-blur-[12px] border border-[var(--border)] rounded-full text-[12px] font-semibold font-[var(--font-mono)] tabular-nums text-[var(--text-secondary)] shadow-[var(--shadow-sm)] select-none">
      {Math.round(zoom * 100)}%
    </div>
  );
});

export default ZoomIndicator;
