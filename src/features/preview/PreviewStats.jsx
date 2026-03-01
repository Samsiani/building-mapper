import { formatPrice } from '../../utils/formatPrice';

export default function PreviewStats({ stats, currency }) {
  return (
    <section className="py-10 px-8 bg-[var(--pv-surface)] border-t border-b border-[var(--pv-border)]">
      <div className="max-w-[900px] mx-auto flex justify-center items-center gap-10">
        <Stat label="Total Units" value={stats.total} />
        <Divider />
        <Stat label="Available" value={stats.available} />
        <Divider />
        <Stat label="Reserved" value={stats.reserved} />
        <Divider />
        <Stat label="Prices From" value={stats.minPrice ? formatPrice(stats.minPrice, currency) : '-'} />
      </div>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div className="text-center">
      <span className="block font-[var(--font-display)] text-4xl font-bold text-[var(--pv-accent)] leading-none mb-1">
        {value}
      </span>
      <span className="text-[13px] font-semibold text-[var(--pv-text-muted)] uppercase tracking-wide">
        {label}
      </span>
    </div>
  );
}

function Divider() {
  return <div className="w-px h-12 bg-[var(--pv-border)]" />;
}
