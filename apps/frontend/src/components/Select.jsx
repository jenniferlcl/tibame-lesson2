export function Select({ options, value, onChange, placeholder, disabled }) {
  return (
    <select
      className="w-full border rounded-md px-3 py-2 text-sm bg-white"
      value={value}
      onChange={onChange}
      disabled={disabled}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}
