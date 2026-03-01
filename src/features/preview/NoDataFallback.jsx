import { Building2 } from 'lucide-react';

export default function NoDataFallback() {
  return (
    <div className="pv-no-data">
      <div className="pv-no-data-icon">
        <Building2 size={40} strokeWidth={1.5} />
      </div>
      <h2 className="pv-no-data-title">No Units Available</h2>
      <p className="pv-no-data-text">
        Open the editor and draw unit polygons on the building to get started.
      </p>
    </div>
  );
}
