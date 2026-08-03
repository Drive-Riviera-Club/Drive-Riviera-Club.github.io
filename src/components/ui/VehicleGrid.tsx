import type { Vehicle } from '../../types';
import { EmptyState } from './EmptyState';
import { VehicleCard } from './VehicleCard';

interface VehicleGridProps {
  vehicles: Vehicle[];
  selectedVehicleId?: string;
  mode: 'rental' | 'transfer';
  onSelect: (id: string) => void;
}

export function VehicleGrid({ vehicles, selectedVehicleId, mode, onSelect }: VehicleGridProps) {
  if (!vehicles.length) {
    return <EmptyState title="Sin vehiculos compatibles" description="Ajusta pasajeros, equipaje o contactanos por WhatsApp para una opcion personalizada." />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-live="polite">
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} mode={mode} selected={selectedVehicleId === vehicle.id} onSelect={onSelect} />
      ))}
    </div>
  );
}
