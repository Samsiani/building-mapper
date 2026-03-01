export default function FloatingSelect({ label, id, value, onChange, options }) {
  return (
    <div className="floating-input floating-select">
      <select id={id} value={value} onChange={onChange}>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <label htmlFor={id}>{label}</label>
    </div>
  );
}
