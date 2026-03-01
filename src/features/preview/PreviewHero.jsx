export default function PreviewHero({ config }) {
  return (
    <section className="text-center py-20 px-8 max-w-[800px] mx-auto">
      <h1 className="font-[var(--font-display)] text-[clamp(28px,5vw,48px)] font-semibold leading-[1.2] text-[var(--pv-text)] mb-4">
        Welcome to{' '}
        <span className="text-[var(--pv-gold)] italic">{config.buildingName}</span>
      </h1>
      <p className="text-lg text-[var(--pv-text-secondary)]">
        {config.companyTagline}
      </p>
    </section>
  );
}
