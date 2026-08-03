import { experiences } from '../../data/experiences';

export function BrandExperienceSection() {
  return (
    <section id="experiencia" className="mx-auto mt-16 max-w-6xl px-4 sm:px-6">
      <div className="rounded-3xl bg-white/90 p-6 shadow-card sm:p-8">
        <h3 className="font-heading text-4xl text-navy">{experiences.tagline}</h3>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {experiences.highlights.map((item) => (
            <div key={item} className="rounded-xl border border-sand bg-cream/70 p-4 text-sm text-slate-700">
              {item}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 rounded-3xl bg-forest p-6 text-white sm:p-8">
        <h4 className="font-heading text-3xl">Tus vacaciones empiezan desde el momento en que te recogemos.</h4>
        <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          {['Conductores anfitriones', 'Recomendaciones locales', 'Servicio personalizado', 'Comodidad', 'Seguridad', 'Atencion directa por WhatsApp'].map((benefit) => (
            <li key={benefit}>• {benefit}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
