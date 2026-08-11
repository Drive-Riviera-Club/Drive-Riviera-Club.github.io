import { useEffect } from 'react';
import type { Vehicle } from '../../types';

interface VehicleDetailModalProps {
  vehicle?: Vehicle;
  open: boolean;
  onClose: () => void;
}

export function VehicleDetailModal({ vehicle, open, onClose }: VehicleDetailModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, open]);

  if (!open || !vehicle) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4" onClick={onClose} role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`vehicle-detail-title-${vehicle.id}`}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-card"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative h-52 overflow-hidden rounded-t-2xl bg-slate-200 sm:h-64">
          <img src={vehicle.image} alt={vehicle.name} className="h-full w-full object-cover" />
        </div>
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Detalle del vehiculo</p>
              <h4 id={`vehicle-detail-title-${vehicle.id}`} className="mt-1 font-heading text-3xl text-navy">
                {vehicle.name}
              </h4>
            </div>
            <button type="button" className="rounded-xl border border-sand px-3 py-2 text-sm text-slate-600 transition hover:bg-cream" onClick={onClose}>
              Cerrar
            </button>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">{vehicle.description}</p>
          <div className="mt-4 rounded-2xl bg-cream p-4">
            <p className="text-sm font-semibold text-navy">Ideal para</p>
            <p className="mt-1 text-sm text-slate-700">{vehicle.idealFor}</p>
          </div>
          <div className="mt-4">
            <p className="text-sm font-semibold text-navy">Caracteristicas</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
              {vehicle.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
