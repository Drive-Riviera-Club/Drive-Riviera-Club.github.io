import { Car, Luggage, Users } from 'lucide-react';
import type { Vehicle } from '../../types';
import { formatCurrencyMXN } from '../../lib/pricing';

interface VehicleCardProps {
  vehicle: Vehicle;
  selected: boolean;
  mode: 'rental' | 'transfer';
  onSelect: (id: string) => void;
}

export function VehicleCard({ vehicle, selected, onSelect, mode }: VehicleCardProps) {
  const available = mode === 'rental' ? vehicle.availableForRental : vehicle.availableForTransfer;

  return (
    <article
      className={`rounded-2xl border p-3 transition ${selected ? 'border-forest bg-forest/5 shadow-card' : 'border-sand bg-white hover:-translate-y-0.5'}`}
    >
      <div className="relative h-40 overflow-hidden rounded-xl bg-slate-200">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement?.classList.add('bg-gradient-to-br', 'from-turquoise', 'to-navy');
          }}
        />
      </div>
      <h4 className="mt-3 font-heading text-2xl text-navy">{vehicle.name}</h4>
      <p className="text-xs uppercase tracking-wide text-slate-500">{vehicle.category}</p>
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-600">
        <span className="flex items-center gap-1"><Users size={14} /> {vehicle.passengers}</span>
        <span className="flex items-center gap-1"><Luggage size={14} /> {vehicle.luggage}</span>
        <span className="flex items-center gap-1"><Car size={14} /> {vehicle.transmission}</span>
      </div>
      <p className="mt-3 text-sm font-semibold text-forest">Desde {formatCurrencyMXN(vehicle.dailyPrice)} / dia</p>
      <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-slate-600">
        {vehicle.features.slice(0, 2).map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
      <button
        type="button"
        disabled={!available}
        onClick={() => onSelect(vehicle.id)}
        className={`mt-3 w-full rounded-xl px-3 py-2 text-sm font-semibold transition ${
          !available ? 'cursor-not-allowed bg-slate-200 text-slate-500' : selected ? 'bg-forest text-white' : 'bg-navy text-white hover:bg-forest'
        }`}
      >
        {!available ? 'Consultar disponibilidad' : selected ? 'Seleccionado' : 'Seleccionar'}
      </button>
    </article>
  );
}
