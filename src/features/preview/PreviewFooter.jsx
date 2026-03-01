export default function PreviewFooter({ config }) {
  return (
    <footer className="py-12 px-8 text-center">
      <div className="max-w-[600px] mx-auto">
        <div className="font-[var(--font-display)] text-xl font-bold text-[var(--pv-text)] mb-3">
          {config.companyName}
        </div>
        <div className="flex justify-center gap-6 text-sm text-[var(--pv-text-secondary)] mb-5">
          <span>{config.contactPhone}</span>
          <span>{config.contactEmail}</span>
        </div>
        <p className="text-[13px] text-[var(--pv-text-muted)]">
          &copy; {new Date().getFullYear()} {config.companyName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
