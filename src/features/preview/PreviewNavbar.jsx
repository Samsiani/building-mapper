import { Building2, Phone } from 'lucide-react';

export default function PreviewNavbar({ config }) {
  return (
    <nav className="sticky top-0 z-[100] bg-[rgba(255,255,255,0.92)] backdrop-blur-[16px] border-b border-[var(--pv-border)]">
      <div className="max-w-[1200px] mx-auto px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[10px] bg-gradient-to-br from-[var(--pv-accent)] to-[var(--pv-accent-light)] flex items-center justify-center text-white">
            <Building2 size={20} />
          </div>
          <span className="text-base font-bold text-[var(--pv-text)] tracking-tight">
            {config.companyName}
          </span>
        </div>
        {config.contactPhone && (
          <a
            href={`tel:${config.contactPhone.replace(/\s/g, '')}`}
            className="flex items-center gap-2 py-2.5 px-6 bg-[var(--pv-accent)] text-white rounded-full text-sm font-semibold no-underline hover:bg-[var(--pv-accent-light)] transition-colors active:scale-[0.97]"
          >
            <Phone size={14} />
            Contact Us
          </a>
        )}
      </div>
    </nav>
  );
}
