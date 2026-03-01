export default function FloatingInput({ label, id, type = 'text', value, onChange, ...props }) {
  return (
    <div className="floating-input">
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder=" "
        autoComplete="off"
        {...props}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}
