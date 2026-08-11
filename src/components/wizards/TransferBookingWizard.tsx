import { zodResolver } from '@hookform/resolvers/zod';
import { addDays, format } from 'date-fns';
import { useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { bookingConfig } from '../../config/booking';
import { businessConfig } from '../../config/business';
import { generateReferenceFolio } from '../../lib/folios';
import { hasGeoapifyKey } from '../../lib/maps';
import { buildTransferWhatsAppMessage, createWhatsAppUrl } from '../../lib/whatsapp';
import { transferSchema, type TransferFormValues } from '../../lib/validationSchemas';
import { PlaceAutocomplete } from '../maps/PlaceAutocomplete';
import { BookingStepper } from '../ui/BookingStepper';
import { BookingSummary } from '../ui/BookingSummary';
import { DateSelector } from '../ui/DateSelector';
import { PassengerSelector } from '../ui/PassengerSelector';
import { TimeSelector } from '../ui/TimeSelector';
import { WhatsAppButton } from '../ui/WhatsAppButton';

const steps = ['Ruta', 'Fecha', 'Cliente', 'Resumen'];
const today = format(new Date(), 'yyyy-MM-dd');

const stepFields: Record<number, (keyof TransferFormValues)[]> = {
  0: ['origin', 'destination'],
  1: ['pickupDate', 'pickupTime'],
  2: ['passengers', 'firstName', 'lastName', 'email', 'phone', 'comments'],
  3: [],
};

export function TransferBookingWizard() {
  const [step, setStep] = useState(0);
  const [folio] = useState(() => generateReferenceFolio('TRF'));
  const geoapifyEnabled = useMemo(() => hasGeoapifyKey(), []);

  const form = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema) as never,
    mode: 'onChange',
    defaultValues: {
      origin: null,
      destination: null,
      pickupDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
      pickupTime: '',
      comments: '',
      passengers: 1,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    },
  });

  const values = useWatch({ control: form.control, defaultValue: form.getValues() }) as TransferFormValues;
  const { origin, destination, pickupDate, pickupTime, comments, passengers, firstName, lastName, email, phone } = values;
  const passengerCount = passengers || 0;

  const validateLocationsForMode = () => {
    const currentOrigin = origin?.formattedAddress?.trim();
    const currentDestination = destination?.formattedAddress?.trim();

    if (!currentOrigin) {
      form.setError('origin', { message: 'Ingresa un origen valido.' });
      return false;
    }

    if (!currentDestination) {
      form.setError('destination', { message: 'Ingresa un destino valido.' });
      return false;
    }

    if (geoapifyEnabled) {
      if (!origin?.selectedFromSuggestions) {
        form.setError('origin', { message: 'Selecciona un origen desde las sugerencias.' });
        return false;
      }

      if (!destination?.selectedFromSuggestions) {
        form.setError('destination', { message: 'Selecciona un destino desde las sugerencias.' });
        return false;
      }
    }

    return true;
  };

  const goNext = async () => {
    const valid = await form.trigger(stepFields[step]);
    if (!valid) return;

    if (step === 0 && !validateLocationsForMode()) return;

    setStep((current) => Math.min(current + 1, steps.length - 1));
    sessionStorage.setItem('drc-transfer-draft', JSON.stringify(form.getValues()));
  };

  const goBack = () => setStep((current) => Math.max(current - 1, 0));

  const clearDraft = () => {
    form.reset();
    sessionStorage.removeItem('drc-transfer-draft');
  };

  const sendWhatsApp = async () => {
    const valid = await form.trigger();
    if (!valid || !origin || !destination) return;

    const message = buildTransferWhatsAppMessage({
      origin: origin.formattedAddress,
      destination: destination.formattedAddress,
      date: pickupDate,
      time: pickupTime,
      passengers: passengerCount,
      customerName: `${firstName || ''} ${lastName || ''}`.trim(),
      comments,
      folio,
    });

    const confirmed = window.confirm('Confirmar y abrir WhatsApp con tu solicitud precargada.');
    if (!confirmed) return;

    const url = createWhatsAppUrl(businessConfig.whatsappNumber, message);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="rounded-3xl border border-sand bg-warm/95 p-4 shadow-card sm:p-6">
      <BookingStepper steps={steps} currentStep={step} />

      <form className="mt-5 space-y-5" onSubmit={(event) => event.preventDefault()}>
        {step === 0 ? (
          <div className="space-y-3">
            <PlaceAutocomplete
              label="¿Dónde te recogemos?"
              placeholder="Hotel, aeropuerto, calle o punto de referencia"
              value={origin || null}
              onPlaceSelect={(place) => form.setValue('origin', place, { shouldValidate: true })}
              error={form.formState.errors.origin?.message}
              required
              locationBias={{ latitude: 21.1619, longitude: -86.8515, radius: 100000 }}
            />
            <PlaceAutocomplete
              label="¿A dónde deseas ir?"
              placeholder="Hotel, aeropuerto, calle o punto de referencia"
              value={destination || null}
              onPlaceSelect={(place) => form.setValue('destination', place, { shouldValidate: true })}
              error={form.formState.errors.destination?.message}
              required
              locationBias={{ latitude: 21.1619, longitude: -86.8515, radius: 100000 }}
            />
            {!geoapifyEnabled ? <p className="text-xs text-slate-600">La ubicación será validada y confirmada por WhatsApp.</p> : null}
          </div>
        ) : null}

        {step === 1 ? (
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <DateSelector
                label="Fecha de traslado"
                value={pickupDate}
                onChange={(value) => form.setValue('pickupDate', value, { shouldValidate: true })}
                min={today}
                error={form.formState.errors.pickupDate?.message}
              />
              <TimeSelector
                label="Hora de traslado"
                value={pickupTime}
                onChange={(value) => form.setValue('pickupTime', value, { shouldValidate: true })}
                times={bookingConfig.availablePickupTimes}
                error={form.formState.errors.pickupTime?.message}
              />
            </div>
            <p className="text-xs text-slate-600">Los datos del traslado se confirmarán por WhatsApp.</p>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <PassengerSelector
              label="No. de pasajeros"
              value={passengerCount}
              min={1}
              onChange={(value) => form.setValue('passengers', value, { shouldValidate: true })}
              error={form.formState.errors.passengers?.message}
            />
            <label className="block">
              <span className="mb-1 block text-sm">Nombre</span>
              <input className="w-full rounded-xl border border-sand bg-white px-3 py-3 text-sm" {...form.register('firstName')} />
              {form.formState.errors.firstName?.message ? <span className="text-xs text-rose-600">{form.formState.errors.firstName.message}</span> : null}
            </label>
            <label className="block">
              <span className="mb-1 block text-sm">Apellido</span>
              <input className="w-full rounded-xl border border-sand bg-white px-3 py-3 text-sm" {...form.register('lastName')} />
              {form.formState.errors.lastName?.message ? <span className="text-xs text-rose-600">{form.formState.errors.lastName.message}</span> : null}
            </label>
            <label className="block">
              <span className="mb-1 block text-sm">Correo (opcional)</span>
              <input className="w-full rounded-xl border border-sand bg-white px-3 py-3 text-sm" {...form.register('email')} />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm">Teléfono (opcional)</span>
              <input className="w-full rounded-xl border border-sand bg-white px-3 py-3 text-sm" {...form.register('phone')} />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-sm">Comentarios (opcional)</span>
              <textarea
                className="w-full rounded-xl border border-sand bg-white px-3 py-3 text-sm"
                rows={4}
                placeholder="Ej. cantidad o tamaño de equipaje, silla infantil, número de vuelo, necesidades especiales u otra información relevante."
                {...form.register('comments')}
              />
              <p className="mt-1 text-xs text-slate-500">Puedes incluir cualquier detalle adicional que quieras comunicar al confirmar el traslado.</p>
            </label>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-4">
            <BookingSummary title="Resumen de traslado privado">
              <p>Origen: {origin?.formattedAddress}</p>
              <p>Destino: {destination?.formattedAddress}</p>
              <p>Fecha y hora: {pickupDate} {pickupTime}</p>
              <p>No. de pasajeros: {passengerCount}</p>
              <p>Cliente: {firstName} {lastName}</p>
              <p>Correo: {email || 'No aplica'}</p>
              <p>Teléfono: {phone || 'No aplica'}</p>
              {comments?.trim() ? <p>Comentarios: {comments}</p> : null}
            </BookingSummary>
            <p className="text-sm text-slate-700">Folio de solicitud: <strong>{folio}</strong></p>
            <WhatsAppButton onClick={sendWhatsApp} />
            <p className="text-xs text-slate-500">Se abrirá WhatsApp con el mensaje estructurado para confirmación.</p>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-sand pt-3">
          <button type="button" onClick={clearDraft} className="rounded-xl border border-sand px-3 py-2 text-xs text-slate-600">
            Limpiar solicitud
          </button>
          <div className="flex gap-2">
            <button type="button" onClick={goBack} disabled={step === 0} className="rounded-xl border border-sand px-4 py-2 text-sm disabled:opacity-40">
              Atrás
            </button>
            {step < steps.length - 1 ? (
              <button type="button" onClick={goNext} className="rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white">
                Continuar
              </button>
            ) : null}
          </div>
        </div>
      </form>
    </section>
  );
}