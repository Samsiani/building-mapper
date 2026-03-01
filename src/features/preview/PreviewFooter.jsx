import { Building2, Phone, Mail, MapPin } from 'lucide-react';

export default function PreviewFooter({ config }) {
  return (
    <footer className="pv-footer">
      <div className="pv-footer-inner">
        <div className="pv-footer-brand">
          <div className="pv-footer-logo">
            <Building2 size={20} strokeWidth={2} />
          </div>
          <div>
            <div className="pv-footer-company">{config.companyName}</div>
            <div className="pv-footer-tagline">{config.companyTagline}</div>
          </div>
        </div>
        <div className="pv-footer-links">
          {config.contactPhone && (
            <a href={`tel:${config.contactPhone.replace(/\s/g, '')}`} className="pv-footer-link">
              <Phone size={14} />
              {config.contactPhone}
            </a>
          )}
          {config.contactEmail && (
            <a href={`mailto:${config.contactEmail}`} className="pv-footer-link">
              <Mail size={14} />
              {config.contactEmail}
            </a>
          )}
        </div>
      </div>
      <div className="pv-footer-bottom">
        <p>&copy; {new Date().getFullYear()} {config.companyName}. All rights reserved.</p>
      </div>
    </footer>
  );
}
