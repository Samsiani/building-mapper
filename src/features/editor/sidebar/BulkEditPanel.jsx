import { memo, useCallback } from 'react';
import { Layers, X } from 'lucide-react';
import { useEditorStore } from '../../../stores/editorStore';
import { useProjectStore } from '../../../stores/projectStore';
import { useToastStore } from '../../../stores/toastStore';
import { STATUS } from '../../../utils/constants';
import Button from '../../../components/ui/Button';
import ConfirmButton from '../../../components/ui/ConfirmButton';

const BulkEditPanel = memo(function BulkEditPanel() {
  const selectedNodeIds = useEditorStore((s) => s.selectedNodeIds);
  const deselectNode = useEditorStore((s) => s.deselectNode);
  const bulkUpdateStatus = useProjectStore((s) => s.bulkUpdateStatus);
  const bulkRemove = useProjectStore((s) => s.bulkRemove);
  const toast = useToastStore((s) => s.show);

  const handleStatusChange = useCallback(
    (status) => {
      bulkUpdateStatus(selectedNodeIds, status);
      toast(`${selectedNodeIds.length} items updated to ${STATUS[status].label}`, 'success');
    },
    [selectedNodeIds, bulkUpdateStatus, toast]
  );

  const handleBulkDelete = useCallback(() => {
    const count = selectedNodeIds.length;
    bulkRemove(selectedNodeIds);
    deselectNode();
    toast(`${count} items deleted`, 'info');
  }, [selectedNodeIds, bulkRemove, deselectNode, toast]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
        <h3 className="text-sm font-bold tracking-tight flex items-center gap-2">
          <Layers size={16} />
          Bulk Edit
        </h3>
        <button
          onClick={deselectNode}
          className="w-7 h-7 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border-none flex items-center justify-center text-[var(--text-tertiary)] cursor-pointer hover:text-[var(--text-secondary)] transition-all"
        >
          <X size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
        <p className="text-[13px] text-[var(--text-secondary)]">
          <span className="font-semibold text-[var(--text-primary)]">{selectedNodeIds.length}</span> items selected
        </p>

        <div>
          <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-2 block">
            Set Status
          </label>
          <div className="flex flex-col gap-2">
            {Object.entries(STATUS).map(([key, s]) => (
              <button
                key={key}
                onClick={() => handleStatusChange(key)}
                className="flex items-center gap-2.5 px-3 py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-[var(--radius-sm)] text-[var(--text-secondary)] text-[13px] font-medium cursor-pointer hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-all"
              >
                <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                Mark as {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 py-4 border-t border-[var(--border)] flex flex-col gap-2">
        <ConfirmButton onConfirm={handleBulkDelete}>
          Delete {selectedNodeIds.length} Items
        </ConfirmButton>
      </div>
    </div>
  );
});

export default BulkEditPanel;
