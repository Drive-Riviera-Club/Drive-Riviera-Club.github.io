import { zodResolver } from '@hookform/resolvers/zod';
import { addDays, format } from 'date-fns';
import { useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { bookingConfig } from '../../config/booking';
import { businessConfig } from '../../config/business';
import { vehicles } from '../../data/vehicles';
import { filterTransferVehicles } from '../../lib/booking';
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
import { VehicleGrid } from '../ui/VehicleGrid';
import { WhatsAppButton } from '../ui/WhatsAppButton';

const steps = ['Ruta', 'Fecha', 'Pasajeros', 'Vehiculo', 'Cliente', 'Resumen', 'WhatsApp'];
const today = format(new Date(), 'yyyy-MM-dd');

const stepFields: Record<number, (keyof TransferFormValues)[]> = {
  0: ['origin', 'destination'],
  1: ['pickupDate', 'pickupTime'],
  2: ['adults', 'children', 'babies', 'luggage'],
  3: ['vehicleId'],
  4: ['firstName', 'lastName'],
  5: [],
  6: [],
};

export function TransferBookingWizard() {
  const [step, setStep] = useState(0);
  const [folio] = useState(() => generateReferenceFolio('TRF'));
  const geoapifyEnabled = useMemo(() => hasGeoapifyKey(), []);

  const form = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    mode: 'onChange',
    defaultValues: {
      origin: null,
      destination: null,
      pickupDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
      pickupTime: '',
      adults: 1,
      children: 0,
      babies: 0,
      luggage: 1,
      infantSeat: false,
      flightNumber: '',
      comments: '',
      vehicleId: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    },
  });

  const [origin, destination, pickupDate, pickupTime, adults, children, babies, luggage, infantSeat, flightNumber, comments, vehicleId, firstName, lastName] = useWatch({
    control: form.control,
    name: ['origin', 'destination', 'pickupDate', 'pickupTime', 'adults', 'children', 'babies', 'luggage', 'infantSeat', 'flightNumber', 'comments', 'vehicleId', 'firstName', 'lastName'],
  });

  const totalPassengers = (adults || 0) + (children || 0) + (babies || 0);

  const compatibleVehicles = useMemo(
    () => filterTransferVehicles({ vehicles, passengers: totalPassengers, luggage: luggage || 0 }),
    [luggage, totalPassengers]
  );

  const selectedVehicle = useMemo(() => vehicles.find((vehicle) => vehicle.id === vehicleId), [vehicleId]);

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
    if (!valid || !origin || !destination || !selectedVehicle) return;

    const message = buildTransferWhatsAppMessage({
      origin: origin.formattedAddress,
      destination: destination.formattedAddress,
      date: pickupDate,
      time: pickupTime,
      passengers: totalPassengers,
      luggage: luggage || 0,
      vehicle: selectedVehicle.name,
      flightNumber,
      infantSeat: Boolean(infantSeat),
      customerName: `${firstName || ''} ${lastName || ''}`.trim(),
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
          <div className="grid gap-3 sm:grid-cols-2">
            <DateSelector
              label="Fecha de recogida"
              value={pickupDate}
              onChange={(value) => form.setValue('pickupDate', value, { shouldValidate: true })}
              min={today}
              error={form.formState.errors.pickupDate?.message}
            />
            <TimeSelector
              label="Hora de recogida"
              value={pickupTime}
              onChange={(value) => form.setValue('pickupTime', value, { shouldValidate: true })}
              times={bookingConfig.availablePickupTimes}
              error={form.formState.errors.pickupTime?.message}
            />
          </div>
        ) : null}

        {step === 2 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <PassengerSelector label="Adultos" value={adults || 0} min={1} onChange={(value) => form.setValue('adults', value, { shouldValidate: true })} />
            <PassengerSelector label="Niños" value={children || 0} onChange={(value) => form.setValue('children', value, { shouldValidate: true })} />
            <PassengerSelector label="Bebés" value={babies || 0} onChange={(value) => form.setValue('babies', value, { shouldValidate: true })} />
            <PassengerSelector label="Equipaje aproximado" value={luggage || 0} onChange={(value) => form.setValue('luggage', value, { shouldValidate: true })} />
            <label className="flex items-center gap-2 rounded-xl border border-sand bg-white px-3 py-3 text-sm sm:col-span-2">
              <input type="checkbox" checked={Boolean(infantSeat)} onChange={(event) => form.setValue('infantSeat', event.target.checked)} />
              Requiero silla infantil
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-sm">Número de vuelo (opcional)</span>
              <input className="w-full rounded-xl border border-sand bg-white px-3 py-3 text-sm" {...form.register('flightNumber')} />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-sm">Comentarios (opcional)</span>
              <textarea className="w-full rounded-xl border border-sand bg-white px-3 py-3 text-sm" rows={3} {...form.register('comments')} />
            </label>
            <p className="text-xs text-slate-600 sm:col-span-2">Pasajeros totales: <strong>{totalPassengers}</strong></p>
          </div>
        ) : null}

        {step === 3 ? (
          <VehicleGrid
            vehicles={compatibleVehicles}
            selectedVehicleId={vehicleId}
            onSelect={(id) => form.setValue('vehicleId', id, { shouldValidate: true })}
            mode="transfer"
          />
        ) : null}

        {step === 4 ? (
          <div className="grid gap-3 sm:grid-cols-2">
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
          </div>
        ) : null}

        {step === 5 ? (
          <BookingSummary title="Resumen de traslado privado">
            <p>Origen: {origin?.formattedAddress}</p>
            <p>Destino: {destination?.formattedAddress}</p>
            <p>Fecha y hora: {pickupDate} {pickupTime}</p>
            <p>Pasajeros: {totalPassengers}</p>
            <p>Equipaje: {luggage}</p>
            <p>Vehículo: {selectedVehicle?.name}</p>
            <p>Silla infantil: {infantSeat ? 'Sí' : 'No'}</p>
            <p>Vuelo: {flightNumber || 'No aplica'}</p>
            <p>Observaciones: {comments || 'Sin observaciones'}</p>
          </BookingSummary>
        ) : null}

        {step === 6 ? (
          <div className="space-y-4 rounded-2xl border border-sand bg-white p-5">
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
