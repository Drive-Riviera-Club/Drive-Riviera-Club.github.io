export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-sage/70 bg-white/70 p-6 text-center">
      <h4 className="font-heading text-2xl text-navy">{title}</h4>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </div>
  );
}
