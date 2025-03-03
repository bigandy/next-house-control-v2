interface CustomSelect {
  options: { id: string; name: string }[];
  selected: string;
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}

export default function CustomSelect({
  options,
  selected,
  handleChange,
  className,
}: CustomSelect) {
  return (
    <select
      value={selected}
      onChange={handleChange}
      className={`border rounded border-gray-500 ${className}`}
    >
      <button>
        {/* @ts-expect-error selectedoption is a valid HTML element, coming soon to Chrome 134 */}
        <selectedcontent></selectedcontent>
        <span className="arrow"></span>
      </button>

      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
  );
}
