interface HeroProps {
  onSelectRental: () => void;
  onSelectTransfer: () => void;
}

export function Hero({ onSelectRental, onSelectTransfer }: HeroProps) {
  return (
    <section id="inicio" className="mx-auto mt-8 grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr]">
      <div className="animate-rise">
        <p className="font-accent text-3xl text-forest">Your Riviera starts here.</p>
        <h1 className="mt-3 font-heading text-5xl leading-[0.95] text-navy sm:text-7xl">
          No rentamos autos.
          <br />
          Creamos libertad.
        </h1>
        <p className="mt-5 max-w-xl text-base text-slate-700 sm:text-lg">
          Explora la Riviera Maya a tu ritmo. Elige como comienza tu experiencia.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={onSelectRental} className="rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white hover:bg-turquoise">
            Rentar un auto
          </button>
          <button onClick={onSelectTransfer} className="rounded-full border border-forest px-5 py-3 text-sm font-semibold text-forest hover:bg-forest hover:text-white">
            Solicitar traslado
          </button>
        </div>
      </div>
      <div className="relative min-h-[330px] overflow-hidden rounded-3xl border border-sand bg-gradient-to-br from-turquoise via-forest to-navy shadow-card">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(233,185,73,.5),transparent_40%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-[linear-gradient(180deg,transparent,rgba(11,37,56,.75))]" />
        <div className="absolute left-5 top-5 rounded-full bg-warm/85 px-3 py-1 text-xs font-semibold text-navy">Riviera Maya Club Experience</div>
        <div className="absolute bottom-5 left-5 text-warm">
          <p className="font-heading text-4xl">DRIVE RIVIERA CLUB</p>
          <p className="text-sm">Costa. Carretera. Aventura. Libertad.</p>
        </div>
      </div>
    </section>
  );
}
