interface PassengerSelectorProps {
  label: string;
  value: number;
  min?: number;
  onChange: (value: number) => void;
  error?: string;
}

export function PassengerSelector({ label, value, min = 0, onChange, error }: PassengerSelectorProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      <input
        type="number"
        min={min}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-xl border border-sand bg-white px-3 py-3 text-sm outline-none transition focus:border-forest"
      />
      {error ? <span className="mt-1 block text-xs text-rose-600">{error}</span> : null}
    </label>
  );
}
