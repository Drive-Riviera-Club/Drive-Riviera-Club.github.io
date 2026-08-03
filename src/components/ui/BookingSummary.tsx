import type { ReactNode } from 'react';

export function BookingSummary({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-sand bg-white p-5">
      <h4 className="font-heading text-3xl text-navy">{title}</h4>
      <div className="mt-3 space-y-2 text-sm text-slate-700">{children}</div>
    </section>
  );
}
