import { memo } from 'react';
import { Building2, Sun, Moon, BarChart3 } from 'lucide-react';
import { useEditorStore } from '../../../stores/editorStore';

const SidebarBrand = memo(function SidebarBrand() {
  const editorTheme = useEditorStore((s) => s.editorTheme);
  const toggleTheme = useEditorStore((s) => s.toggleEditorTheme);
  const sidebarMode = useEditorStore((s) => s.sidebarMode);
  const setSidebarMode = useEditorStore((s) => s.setSidebarMode);

  return (
    <div className="px-5 py-4 border-b border-[var(--border)] flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-gradient-to-br from-[var(--accent)] to-[var(--gold)] flex items-center justify-center text-white">
        <Building2 size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="text-sm font-bold tracking-tight truncate" style={{ fontFamily: 'var(--font-display)' }}>Masterplan</h2>
        <span className="text-[11px] text-[var(--text-tertiary)] font-medium">Interactive Editor</span>
      </div>
      <button
        title="Analytics"
        onClick={() => setSidebarMode(sidebarMode === 'analytics' ? 'config' : 'analytics')}
        className={`w-7 h-7 rounded-[var(--radius-sm)] border-none flex items-center justify-center cursor-pointer transition-all
          ${sidebarMode === 'analytics' ? 'bg-[var(--accent-dim)] text-[var(--accent)]' : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'}`}
      >
        <BarChart3 size={14} />
      </button>
      <button
        title={`Switch to ${editorTheme === 'dark' ? 'light' : 'dark'} theme`}
        onClick={toggleTheme}
        className="w-7 h-7 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border-none flex items-center justify-center text-[var(--text-tertiary)] cursor-pointer hover:text-[var(--text-secondary)] transition-all"
      >
        {editorTheme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
      </button>
    </div>
  );
});

export default SidebarBrand;
