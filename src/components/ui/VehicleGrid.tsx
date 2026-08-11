import { useState } from 'react';
import type { Vehicle } from '../../types';
import { EmptyState } from './EmptyState';
import { VehicleDetailModal } from './VehicleDetailModal';
import { VehicleCard } from './VehicleCard';

interface VehicleGridProps {
  vehicles: Vehicle[];
  selectedVehicleId?: string;
  mode: 'rental' | 'transfer';
  onSelect: (id: string) => void;
}

export function VehicleGrid({ vehicles, selectedVehicleId, mode, onSelect }: VehicleGridProps) {
  const [detailVehicleId, setDetailVehicleId] = useState<string | null>(null);

  const detailVehicle = detailVehicleId ? vehicles.find((vehicle) => vehicle.id === detailVehicleId) : undefined;

  if (!vehicles.length) {
    return <EmptyState title="Sin vehiculos compatibles" description="Ajusta pasajeros, equipaje o contactanos por WhatsApp para una opcion personalizada." />;
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-live="polite">
        {vehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            mode={mode}
            selected={selectedVehicleId === vehicle.id}
            onSelect={onSelect}
            onViewDetails={mode === 'rental' ? () => setDetailVehicleId(vehicle.id) : undefined}
          />
        ))}
      </div>
      <VehicleDetailModal open={Boolean(detailVehicle)} vehicle={detailVehicle} onClose={() => setDetailVehicleId(null)} />
    </>
  );
}
