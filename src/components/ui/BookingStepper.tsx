interface BookingStepperProps {
  steps: string[];
  currentStep: number;
}

export function BookingStepper({ steps, currentStep }: BookingStepperProps) {
  return (
    <ol className="grid gap-2" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }} aria-label="Progreso del formulario">
      {steps.map((step, index) => {
        const state = index <= currentStep ? 'active' : 'pending';
        return (
          <li key={step} className="min-h-14 rounded-xl border bg-white/80 p-2 text-xs">
            <div
              className={`mb-1 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold ${
                state === 'active' ? 'bg-forest text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {index + 1}
            </div>
            <p className="leading-tight text-slate-700">{step}</p>
          </li>
        );
      })}
    </ol>
  );
}
