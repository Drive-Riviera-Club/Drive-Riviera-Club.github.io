import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  selected: boolean;
  onClick: () => void;
}

export function ServiceCard({ title, description, icon, selected, onClick }: ServiceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full rounded-3xl border p-6 text-left transition ${
        selected ? 'border-forest bg-forest text-white shadow-card' : 'border-sand bg-white/90 hover:-translate-y-0.5 hover:shadow-card'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="rounded-xl bg-sunset/20 p-3 text-navy">{icon}</div>
        <ArrowRight className={`h-5 w-5 ${selected ? 'text-sunset' : 'text-slate-400 group-hover:text-forest'}`} />
      </div>
      <h3 className="mt-4 font-heading text-3xl leading-none">{title}</h3>
      <p className={`mt-3 text-sm ${selected ? 'text-slate-100' : 'text-slate-600'}`}>{description}</p>
    </button>
  );
}
