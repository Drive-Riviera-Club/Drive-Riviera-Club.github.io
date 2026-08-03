export function LoadingState({ label = 'Cargando...' }: { label?: string }) {
  return (
    <div className="animate-pulse rounded-2xl border border-sand/70 bg-white/80 p-5">
      <div className="h-3 w-24 rounded bg-slate-200" />
      <div className="mt-3 h-4 w-full rounded bg-slate-200" />
      <div className="mt-2 h-4 w-3/4 rounded bg-slate-200" />
      <p className="mt-4 text-xs text-slate-500">{label}</p>
    </div>
  );
}
