interface DateSelectorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  error?: string;
}

export function DateSelector({ label, value, onChange, min, error }: DateSelectorProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      <input
        type="date"
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-sand bg-white px-3 py-3 text-sm outline-none transition focus:border-forest"
      />
      {error ? <span className="mt-1 block text-xs text-rose-600">{error}</span> : null}
    </label>
  );
}
