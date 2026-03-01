import { Building2 } from 'lucide-react';

export default function NoDataFallback() {
  return (
    <div className="text-center py-32 px-8 text-[var(--pv-text-muted)]">
      <Building2 size={48} className="mx-auto mb-5 opacity-30" />
      <h2 className="font-[var(--font-display)] text-2xl text-[var(--pv-text-secondary)] mb-2">
        No Units Available
      </h2>
      <p className="text-[15px] max-w-[400px] mx-auto">
        Open the editor and draw unit polygons on the building to get started.
      </p>
    </div>
  );
}
