import type { ReactNode } from 'react';

interface RouteMapProps {
  title?: string;
  children?: ReactNode;
}

export function RouteMap({ title, children }: RouteMapProps) {
  if (!children) return null;

  return (
    <section className="rounded-2xl border border-sand bg-white p-4 shadow-sm">
      {title ? <h4 className="font-heading text-2xl text-navy">{title}</h4> : null}
      <div className="mt-3">{children}</div>
    </section>
  );
}
