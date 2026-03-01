import { memo } from 'react';

const CommandItem = memo(function CommandItem({ command, isActive, onSelect, onHover }) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors
        ${isActive ? 'bg-[var(--accent-dim)]' : 'hover:bg-[rgba(255,255,255,0.03)]'}`}
      onClick={() => onSelect(command)}
      onMouseEnter={onHover}
    >
      <span className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wide w-16 flex-shrink-0 truncate">
        {command.category}
      </span>
      <span className={`text-[13px] font-medium flex-1 ${isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
        {command.label}
      </span>
      {command.shortcut && (
        <kbd className="px-1.5 py-0.5 bg-[var(--bg-tertiary)] rounded text-[10px] font-semibold text-[var(--text-tertiary)] font-[var(--font-mono)]">
          {command.shortcut}
        </kbd>
      )}
    </div>
  );
});

export default CommandItem;
