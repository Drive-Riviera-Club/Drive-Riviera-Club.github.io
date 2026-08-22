export function Hero() {
  return (
    <section id="inicio" className="mx-auto mt-8 grid max-w-6xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.3fr]">
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
      </div>
      <div className="min-h-[280px] overflow-hidden rounded-3xl border border-sand bg-navy shadow-card sm:min-h-[360px] lg:min-h-[500px]">
        <img
          src="/images/Drive%20Riviera%20Club%20Media.jpeg"
          alt="Drive Riviera Club frente a la costa de la Riviera Maya"
          width="1430"
          height="1100"
          fetchPriority="high"
          className="h-full w-full object-cover object-[center_58%]"
        />
      </div>
    </section>
  );
}
