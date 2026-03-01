export default function Checkbox({ label, checked, onChange, id }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer text-[13px] text-[var(--text-secondary)] select-none">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="hidden"
      />
      <span
        className={`w-[18px] h-[18px] rounded-[4px] border-[1.5px] relative transition-all duration-150 flex-shrink-0
          ${checked
            ? 'bg-[var(--accent)] border-[var(--accent)]'
            : 'bg-[var(--bg-tertiary)] border-[var(--border-hover)]'
          }`}
      >
        {checked && (
          <span className="absolute left-[5px] top-[2px] w-[5px] h-[9px] border-white border-r-2 border-b-2 rotate-45" />
        )}
      </span>
      {label}
    </label>
  );
}
