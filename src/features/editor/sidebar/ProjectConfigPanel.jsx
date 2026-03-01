import { memo, useCallback } from 'react';
import { Settings } from 'lucide-react';
import { useProjectStore } from '../../../stores/projectStore';
import FloatingInput from '../../../components/ui/FloatingInput';

const ProjectConfigPanel = memo(function ProjectConfigPanel() {
  const config = useProjectStore((s) => s.projectConfig);
  const updateConfig = useProjectStore((s) => s.updateProjectConfig);

  const handleChange = useCallback(
    (key) => (e) => {
      updateConfig({ [key]: e.target.value });
    },
    [updateConfig]
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
        <h3 className="text-sm font-bold tracking-tight">Project Settings</h3>
        <span className="flex items-center justify-center w-7 h-7 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]">
          <Settings size={14} />
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3.5">
        <SectionTitle>Project</SectionTitle>
        <FloatingInput
          label="Project Name" id="cfg-project-name"
          value={config.projectName} onChange={handleChange('projectName')}
        />

        <SectionTitle>Company</SectionTitle>
        <FloatingInput
          label="Company Name" id="cfg-company"
          value={config.companyName} onChange={handleChange('companyName')}
        />
        <FloatingInput
          label="Tagline" id="cfg-tagline"
          value={config.companyTagline} onChange={handleChange('companyTagline')}
        />

        <SectionTitle>Contact</SectionTitle>
        <FloatingInput
          label="Phone" id="cfg-phone" type="tel"
          value={config.contactPhone} onChange={handleChange('contactPhone')}
        />
        <FloatingInput
          label="Email" id="cfg-email" type="email"
          value={config.contactEmail} onChange={handleChange('contactEmail')}
        />

        <SectionTitle>Currency</SectionTitle>
        <FloatingInput
          label="Currency" id="cfg-currency"
          value={config.currency} onChange={handleChange('currency')}
        />
      </div>
    </div>
  );
});

function SectionTitle({ children }) {
  return (
    <h4 className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wide pb-1.5 border-b border-[var(--border)] mb-0.5">
      {children}
    </h4>
  );
}

export default ProjectConfigPanel;
