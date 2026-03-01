import { Check, X, Info, AlertTriangle, XCircle } from 'lucide-react';

const ICONS = {
  success: Check,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const COLORS = {
  success: '#22c55e',
  error: '#ef4444',
  info: '#3b82f6',
  warning: '#f59e0b',
};

export default function Toast({ toast, onDismiss }) {
  const Icon = ICONS[toast.type] || ICONS.info;
  const color = COLORS[toast.type] || COLORS.info;

  return (
    <div
      className="flex items-center gap-2.5 py-2.5 px-4 bg-[var(--bg-elevated)] border border-[var(--border-hover)] rounded-[var(--radius-md)] shadow-lg min-w-[260px] max-w-[400px] relative overflow-hidden"
      style={{ animation: 'toastIn 300ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards' }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-[3px]"
        style={{ background: color }}
      />
      <div className="flex-shrink-0 flex ml-1" style={{ color }}>
        <Icon size={18} strokeWidth={2.5} />
      </div>
      <span className="flex-1 text-[13px] text-[var(--text-primary)] font-medium">
        {toast.message}
      </span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 flex items-center justify-center w-6 h-6 border-none rounded bg-transparent text-[var(--text-tertiary)] cursor-pointer hover:bg-[rgba(255,255,255,0.08)] hover:text-[var(--text-primary)] transition-all"
      >
        <X size={14} />
      </button>
    </div>
  );
}
