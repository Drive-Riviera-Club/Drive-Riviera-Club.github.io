import type { PickupLocation } from '../../types';

interface LocationSelectorProps {
  label: string;
  value: string;
  locations: PickupLocation[];
  onChange: (value: string) => void;
  error?: string;
}

export function LocationSelector({ label, value, locations, onChange, error }: LocationSelectorProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-sand bg-white px-3 py-3 text-sm outline-none transition focus:border-forest"
      >
        <option value="">Selecciona una ubicacion</option>
        {locations.filter((l) => l.active).map((location) => (
          <option key={location.id} value={location.id}>
            {location.name}
          </option>
        ))}
      </select>
      {error ? <span className="mt-1 block text-xs text-rose-600">{error}</span> : null}
    </label>
  );
}
