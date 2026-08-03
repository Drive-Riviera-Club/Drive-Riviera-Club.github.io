interface TimeSelectorProps {
  label: string;
  value: string;
  times: string[];
  onChange: (value: string) => void;
  error?: string;
}

export function TimeSelector({ label, value, times, onChange, error }: TimeSelectorProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-sand bg-white px-3 py-3 text-sm outline-none transition focus:border-forest"
      >
        <option value="">Selecciona una hora</option>
        {times.map((time) => (
          <option key={time} value={time}>
            {time}
          </option>
        ))}
      </select>
      {error ? <span className="mt-1 block text-xs text-rose-600">{error}</span> : null}
    </label>
  );
}
