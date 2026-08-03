import type { Vehicle } from '../../types';

interface VehicleDetailModalProps {
  vehicle?: Vehicle;
  open: boolean;
  onClose: () => void;
}

export function VehicleDetailModal({ vehicle, open, onClose }: VehicleDetailModalProps) {
  if (!open || !vehicle) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black/40 p-4" onClick={onClose}>
      <div className="mx-auto mt-14 max-w-lg rounded-2xl bg-white p-5 shadow-card" onClick={(e) => e.stopPropagation()}>
        <h4 className="font-heading text-3xl text-navy">{vehicle.name}</h4>
        <p className="mt-2 text-sm text-slate-600">{vehicle.description}</p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
          {vehicle.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
        <button className="mt-4 rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
}
