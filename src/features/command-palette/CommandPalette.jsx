import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command } from 'lucide-react';
import { useCommandStore } from '../../stores/commandStore';
import { useEditorStore } from '../../stores/editorStore';
import { useProjectStore } from '../../stores/projectStore';
import { useToastStore } from '../../stores/toastStore';
import { NODE_TYPES, canDrillInto } from '../../utils/nodeTypes';
import { fuzzyMatch, fuzzyScore } from '../../utils/fuzzySearch';
import CommandItem from './CommandItem';

export default function CommandPalette() {
  const isOpen = useCommandStore((s) => s.isOpen);
  const close = useCommandStore((s) => s.close);
  const registeredCommands = useCommandStore((s) => s.commands);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);

  // Register default commands on mount
  useEffect(() => {
    const cmds = [
      { id: 'tool-select', label: 'Select Tool', shortcut: 'V', category: 'Tools', action: () => useEditorStore.getState().setActiveTool('select') },
      { id: 'tool-pen', label: 'Pen Tool', shortcut: 'P', category: 'Tools', action: () => useEditorStore.getState().setActiveTool('pen') },
      { id: 'tool-edit', label: 'Edit Tool', shortcut: 'E', category: 'Tools', action: () => useEditorStore.getState().setActiveTool('edit') },
      { id: 'tool-hand', label: 'Hand Tool', shortcut: 'H', category: 'Tools', action: () => useEditorStore.getState().setActiveTool('hand') },
      { id: 'tool-measure', label: 'Measure Tool', shortcut: 'M', category: 'Tools', action: () => useEditorStore.getState().setActiveTool('measure') },
      { id: 'toggle-snap', label: 'Toggle Grid Snap', shortcut: 'Cmd+G', category: 'View', action: () => useEditorStore.getState().toggleSnap() },
      { id: 'toggle-layers', label: 'Toggle Layers Panel', shortcut: 'L', category: 'View', action: () => useEditorStore.getState().toggleLayersPanel() },
      { id: 'toggle-building', label: 'Toggle Building Layer', category: 'View', action: () => useEditorStore.getState().toggleBuildingLayer() },
      { id: 'toggle-theme', label: 'Toggle Editor Theme', category: 'View', action: () => useEditorStore.getState().toggleEditorTheme() },
      { id: 'analytics', label: 'Show Analytics', category: 'View', action: () => useEditorStore.getState().setSidebarMode('analytics') },
      { id: 'undo', label: 'Undo', shortcut: 'Cmd+Z', category: 'Edit', action: () => { useProjectStore.getState().undo(); useToastStore.getState().show('Undone', 'info', 2000); } },
      { id: 'redo', label: 'Redo', shortcut: 'Cmd+Shift+Z', category: 'Edit', action: () => { useProjectStore.getState().redo(); useToastStore.getState().show('Redone', 'info', 2000); } },
      { id: 'preview', label: 'Open Preview', category: 'Navigation', action: () => window.open('/preview', '_blank') },
      { id: 'nav-root', label: 'Go to Root View', shortcut: 'Esc', category: 'Navigation', action: () => useEditorStore.getState().navigateToRoot() },
      { id: 'nav-up', label: 'Navigate Up', shortcut: 'Esc', category: 'Navigation', action: () => useEditorStore.getState().navigateUp() },
    ];
    useCommandStore.getState().registerCommands(cmds);
  }, []);

  // Add dynamic entity search commands from flat nodes
  const nodes = useProjectStore((s) => s.nodes);

  const entityCommands = useMemo(() => {
    const cmds = [];

    // Build ancestor path label for a node
    const getPathLabel = (node) => {
      const parts = [];
      let current = node;
      while (current.parentId !== null) {
        const parent = nodes.find((n) => n.id === current.parentId);
        if (!parent) break;
        parts.unshift(parent.name);
        current = parent;
      }
      return parts.length > 0 ? `${parts.join(' > ')} > ${node.name}` : node.name;
    };

    nodes.forEach((node) => {
      const typeDef = NODE_TYPES[node.type];
      if (!typeDef) return;

      const pathLabel = getPathLabel(node);
      const keywords = `${node.name} ${typeDef.label} ${node.status || ''} ${node.orientation || ''}`.trim();

      cmds.push({
        id: `node-${node.id}`,
        label: pathLabel,
        category: typeDef.labelPlural,
        keywords,
        action: () => {
          if (canDrillInto(node.type)) {
            // Navigate into drillable nodes
            useEditorStore.getState().navigateInto(node.id);
          } else {
            // Navigate to parent, then select node
            if (node.parentId !== null) {
              useEditorStore.getState().navigateInto(node.parentId);
              setTimeout(() => useEditorStore.getState().selectNode(node.id), 50);
            } else {
              useEditorStore.getState().selectNode(node.id);
            }
          }
        },
      });
    });

    return cmds;
  }, [nodes]);

  const allCommands = useMemo(() => [...registeredCommands, ...entityCommands], [registeredCommands, entityCommands]);

  const filtered = useMemo(() => {
    if (!query) return allCommands;
    return allCommands
      .filter((c) => fuzzyMatch(query, c.label) || fuzzyMatch(query, c.keywords || '') || fuzzyMatch(query, c.category || ''))
      .sort((a, b) => fuzzyScore(query, b.label) - fuzzyScore(query, a.label));
  }, [query, allCommands]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const cmd = filtered[activeIndex];
        if (cmd) {
          cmd.action();
          close();
        }
      } else if (e.key === 'Escape') {
        close();
      }
    },
    [filtered, activeIndex, close]
  );

  const handleSelect = useCallback(
    (cmd) => {
      cmd.action();
      close();
    },
    [close]
  );

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[1000] flex items-start justify-center pt-[20vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={close} />
          <motion.div
            className="relative w-[520px] max-h-[400px] bg-[var(--bg-elevated)] border border-[var(--border-hover)] rounded-[var(--radius-lg)] shadow-2xl overflow-hidden"
            initial={{ scale: 0.95, y: -10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: -10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
              <Search size={18} className="text-[var(--text-tertiary)] flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search commands and entities..."
                value={query}
                onChange={(e) => { setQuery(e.target.value); setActiveIndex(0); }}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent border-none outline-none text-[var(--text-primary)] text-[14px] font-medium placeholder:text-[var(--text-tertiary)]"
              />
              <kbd className="px-1.5 py-0.5 bg-[var(--bg-tertiary)] rounded text-[10px] font-semibold text-[var(--text-tertiary)] font-[var(--font-mono)]">
                ESC
              </kbd>
            </div>

            <div className="max-h-[320px] overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <div className="px-4 py-6 text-center text-[13px] text-[var(--text-tertiary)]">
                  No results found
                </div>
              ) : (
                filtered.map((cmd, i) => (
                  <CommandItem
                    key={cmd.id}
                    command={cmd}
                    isActive={i === activeIndex}
                    onSelect={handleSelect}
                    onHover={() => setActiveIndex(i)}
                  />
                ))
              )}
            </div>

            <div className="px-4 py-2 border-t border-[var(--border)] flex items-center gap-4 text-[11px] text-[var(--text-tertiary)]">
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-[var(--bg-tertiary)] rounded text-[9px] font-[var(--font-mono)]">↑↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-[var(--bg-tertiary)] rounded text-[9px] font-[var(--font-mono)]">↵</kbd>
                Select
              </span>
              <span className="flex items-center gap-1 ml-auto">
                <Command size={10} />
                <kbd className="px-1 py-0.5 bg-[var(--bg-tertiary)] rounded text-[9px] font-[var(--font-mono)]">K</kbd>
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
