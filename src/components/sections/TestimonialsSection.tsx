const testimonials = [
  {
    name: 'Paula y Diego',
    quote: 'Nos guiaron a cenotes increibles y la ruta fue perfecta para viajar con calma.',
  },
  {
    name: 'Sofía M.',
    quote: 'El traslado desde aeropuerto fue puntual y con tips locales que usamos toda la semana.',
  },
  {
    name: 'Grupo Nido',
    quote: 'La van fue ideal para nuestro equipo. Todo coordinado por WhatsApp de forma super clara.',
  },
];

export function TestimonialsSection() {
  return (
    <section className="mx-auto mt-16 max-w-6xl px-4 sm:px-6">
      <h3 className="font-heading text-4xl text-navy">Comunidad de viajeros del club</h3>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <blockquote key={testimonial.name} className="rounded-2xl border border-sand bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-700">“{testimonial.quote}”</p>
            <cite className="mt-4 block text-xs font-semibold uppercase tracking-wide text-forest">{testimonial.name}</cite>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
