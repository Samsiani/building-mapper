import { cn } from '../../utils/cn';

const variants = {
  primary: 'bg-[var(--accent)] text-white hover:bg-[#6366f1]',
  danger: 'bg-[rgba(239,68,68,0.12)] text-[var(--red)] hover:bg-[rgba(239,68,68,0.2)]',
  ghost: 'bg-transparent text-[var(--text-secondary)] border border-[var(--border)] hover:bg-[rgba(255,255,255,0.04)] hover:text-[var(--text-primary)]',
};

export default function Button({ variant = 'primary', className, children, ...props }) {
  return (
    <button
      className={cn(
        'flex items-center justify-center gap-2 px-4 py-2.5 border-none rounded-[var(--radius-sm)] font-[var(--font-sans)] text-[13px] font-semibold cursor-pointer transition-all duration-150 active:scale-[0.97]',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
