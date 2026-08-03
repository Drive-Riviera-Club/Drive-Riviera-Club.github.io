import { CarFront, PlaneTakeoff } from 'lucide-react';
import { ServiceCard } from '../ui/ServiceCard';

interface ServiceSelectorProps {
  selected: 'rental' | 'transfer' | null;
  onSelect: (value: 'rental' | 'transfer') => void;
}

export function ServiceSelector({ selected, onSelect }: ServiceSelectorProps) {
  return (
    <section id="servicios" className="mx-auto mt-14 max-w-6xl px-4 sm:px-6">
      <h2 className="font-heading text-4xl text-navy sm:text-5xl">¿Que necesitas para tu viaje?</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <ServiceCard
          title="RENTA TU AUTO"
          description="Explora a tu ritmo, cuando quieras."
          icon={<CarFront className="h-6 w-6" />}
          selected={selected === 'rental'}
          onClick={() => onSelect('rental')}
        />
        <ServiceCard
          title="TRASLADO PRIVADO"
          description="Tu viaje empieza desde que te recogemos."
          icon={<PlaneTakeoff className="h-6 w-6" />}
          selected={selected === 'transfer'}
          onClick={() => onSelect('transfer')}
        />
      </div>
    </section>
  );
}
