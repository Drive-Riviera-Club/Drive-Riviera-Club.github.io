import { zodResolver } from '@hookform/resolvers/zod';
import { addDays, format } from 'date-fns';
import { useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { bookingConfig } from '../../config/booking';
import { businessConfig } from '../../config/business';
import { pickupLocations } from '../../data/pickupLocations';
import { vehicles } from '../../data/vehicles';
import { calculateRentalDays } from '../../lib/booking';
import { validateBookingDateTime } from '../../lib/dates';
import { generateReferenceFolio } from '../../lib/folios';
import { calculateRentalEstimate, formatCurrencyMXN } from '../../lib/pricing';
import { buildRentalWhatsAppMessage, createWhatsAppUrl } from '../../lib/whatsapp';
import { rentalSchema, type RentalFormValues } from '../../lib/validationSchemas';
import { BookingStepper } from '../ui/BookingStepper';
import { BookingSummary } from '../ui/BookingSummary';
import { DateSelector } from '../ui/DateSelector';
import { LocationSelector } from '../ui/LocationSelector';
import { TimeSelector } from '../ui/TimeSelector';
import { VehicleGrid } from '../ui/VehicleGrid';
import { WhatsAppButton } from '../ui/WhatsAppButton';

const steps = ['Reserva', 'Vehiculo', 'Cliente', 'Resumen'];
const today = format(new Date(), 'yyyy-MM-dd');

const stepFields: Record<number, (keyof RentalFormValues)[]> = {
  0: ['pickupLocationId', 'pickupDate', 'pickupTime', 'dropoffDate', 'dropoffTime', 'dropoffLocationId'],
  1: ['vehicleId'],
  2: ['firstName', 'lastName', 'email', 'phone', 'comments'],
  3: [],
};

export function RentalBookingWizard() {
  const [step, setStep] = useState(0);
  const [folio] = useState(() => generateReferenceFolio('RNT'));

  const form = useForm<RentalFormValues>({
    resolver: zodResolver(rentalSchema),
    mode: 'onChange',
    defaultValues: {
      pickupLocationId: '',
      customPickupLocation: '',
      pickupDate: today,
      pickupTime: '',
      dropoffDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
      dropoffTime: '',
      dropoffLocationId: '',
      vehicleId: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      comments: '',
    },
  });

  const values = useWatch({ control: form.control, defaultValue: form.getValues() }) as RentalFormValues;

  const selectedVehicle = useMemo(() => vehicles.find((vehicle) => vehicle.id === values.vehicleId), [values.vehicleId]);
  const pickupLocation = useMemo(() => pickupLocations.find((location) => location.id === values.pickupLocationId), [values.pickupLocationId]);
  const dropoffLocation = useMemo(() => pickupLocations.find((location) => location.id === values.dropoffLocationId), [values.dropoffLocationId]);
  const pickupDisplayName = pickupLocation?.id === 'other' ? values.customPickupLocation || pickupLocation?.name : pickupLocation?.name || values.customPickupLocation || 'Sin definir';

  const rentalDays = calculateRentalDays(values.pickupDate, values.dropoffDate);
  const estimate = calculateRentalEstimate({
    dailyPrice: selectedVehicle?.dailyPrice || 0,
    days: rentalDays,
    pickupFee: pickupLocation?.additionalFee || 0,
    dropoffFee: dropoffLocation?.additionalFee || 0,
    differentDropoff: values.dropoffLocationId !== values.pickupLocationId,
  });

  const validateChronology = () => {
    const result = validateBookingDateTime(values.pickupDate, values.pickupTime, values.dropoffDate, values.dropoffTime);
    if (!result.valid) {
      form.setError('dropoffTime', { message: result.message });
      return false;
    }
    return true;
  };

  const goNext = async () => {
    const valid = await form.trigger(stepFields[step]);
    if (!valid) return;
    if (step === 0 && !validateChronology()) return;
    setStep((current) => Math.min(current + 1, steps.length - 1));
    sessionStorage.setItem('drc-rental-draft', JSON.stringify(values));
  };

  const goBack = () => setStep((current) => Math.max(current - 1, 0));

  const clearDraft = () => {
    form.reset();
    sessionStorage.removeItem('drc-rental-draft');
  };

  const sendWhatsApp = async () => {
    const valid = await form.trigger();
    if (!valid || !selectedVehicle || !pickupLocation || !dropoffLocation) return;

    const message = buildRentalWhatsAppMessage({
      vehicle: selectedVehicle.name,
      pickupLocation: pickupLocation.name,
      pickupDate: values.pickupDate,
      pickupTime: values.pickupTime,
      dropoffLocation: dropoffLocation.name,
      dropoffDate: values.dropoffDate,
      dropoffTime: values.dropoffTime,
      customerName: `${values.firstName} ${values.lastName}`,
      estimatedTotal: `${formatCurrencyMXN(estimate.total)} MXN`,
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

      <form className="mt-5 space-y-5" onSubmit={(e) => e.preventDefault()}>
        {step === 0 ? (
          <div className="space-y-4">
            <LocationSelector
              label="Lugar de recogida"
              value={values.pickupLocationId}
              onChange={(value) => form.setValue('pickupLocationId', value, { shouldValidate: true })}
              locations={pickupLocations}
              error={form.formState.errors.pickupLocationId?.message}
            />
            {values.pickupLocationId === 'other' ? (
              <label className="block">
                <span className="mb-1 block text-sm">Escribe tu ubicacion (opcional)</span>
                <input
                  type="text"
                  value={values.customPickupLocation || ''}
                  onChange={(e) => form.setValue('customPickupLocation', e.target.value)}
                  className="w-full rounded-xl border border-sand bg-white px-3 py-3 text-sm"
                />
              </label>
            ) : null}

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-3 rounded-2xl border border-sand bg-white p-4">
                <h4 className="font-heading text-2xl text-navy">Recogida</h4>
                <DateSelector
                  label="Fecha de recogida"
                  value={values.pickupDate}
                  onChange={(value) => form.setValue('pickupDate', value, { shouldValidate: true })}
                  min={today}
                  error={form.formState.errors.pickupDate?.message}
                />
                <TimeSelector
                  label="Hora de recogida"
                  value={values.pickupTime}
                  onChange={(value) => form.setValue('pickupTime', value, { shouldValidate: true })}
                  times={bookingConfig.availablePickupTimes}
                  error={form.formState.errors.pickupTime?.message}
                />
              </div>

              <div className="space-y-3 rounded-2xl border border-sand bg-white p-4">
                <h4 className="font-heading text-2xl text-navy">Entrega</h4>
                <LocationSelector
                  label="Lugar de entrega"
                  value={values.dropoffLocationId}
                  onChange={(value) => form.setValue('dropoffLocationId', value, { shouldValidate: true })}
                  locations={pickupLocations.filter((location) => location.id !== 'other')}
                  error={form.formState.errors.dropoffLocationId?.message}
                />
                <DateSelector
                  label="Fecha de entrega"
                  value={values.dropoffDate}
                  onChange={(value) => form.setValue('dropoffDate', value, { shouldValidate: true })}
                  min={values.pickupDate || today}
                  error={form.formState.errors.dropoffDate?.message}
                />
                <TimeSelector
                  label="Hora de entrega"
                  value={values.dropoffTime}
                  onChange={(value) => form.setValue('dropoffTime', value, { shouldValidate: true })}
                  times={bookingConfig.availablePickupTimes}
                  error={form.formState.errors.dropoffTime?.message}
                />
              </div>
            </div>

            <p className="text-xs text-slate-600">Duracion estimada: {rentalDays} dia(s). Puede cambiar segun hora exacta de entrega.</p>
          </div>
        ) : null}

        {step === 1 ? (
          <VehicleGrid
            vehicles={vehicles.filter((vehicle) => vehicle.active && vehicle.availableForRental)}
            selectedVehicleId={values.vehicleId}
            onSelect={(id) => form.setValue('vehicleId', id, { shouldValidate: true })}
            mode="rental"
          />
        ) : null}

        {step === 2 ? (
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
              <span className="mb-1 block text-sm">Telefono (opcional)</span>
              <input className="w-full rounded-xl border border-sand bg-white px-3 py-3 text-sm" {...form.register('phone')} />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-sm">Comentarios (opcional)</span>
              <textarea className="w-full rounded-xl border border-sand bg-white px-3 py-3 text-sm" rows={3} {...form.register('comments')} />
            </label>
            <p className="rounded-xl bg-sunset/20 p-3 text-xs text-navy sm:col-span-2">La solicitud no confirma automaticamente la reservacion. Nuestro equipo validara disponibilidad por WhatsApp.</p>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-4">
            <BookingSummary title="Resumen de renta">
              <p>Servicio: Renta de auto</p>
              <p>Recogida: {pickupDisplayName}</p>
              <p>Entrega: {dropoffLocation?.name || 'Sin definir'}</p>
              <p>Fecha y hora de recogida: {values.pickupDate} {values.pickupTime}</p>
              <p>Fecha y hora de entrega: {values.dropoffDate} {values.dropoffTime}</p>
              <p>Vehiculo: {selectedVehicle?.name}</p>
              <p>Dias estimados: {rentalDays}</p>
              <p>Tarifa por dia: {selectedVehicle ? formatCurrencyMXN(selectedVehicle.dailyPrice) : '-'}</p>
              <p>Cargos adicionales: {formatCurrencyMXN(estimate.locationFees)}</p>
              <p className="font-semibold">Total estimado: {formatCurrencyMXN(estimate.total)}</p>
              <p>Cliente: {values.firstName} {values.lastName}</p>
              <p className="text-xs">Precio estimado sujeto a confirmacion y disponibilidad.</p>
              <div className="rounded-xl bg-cream p-3 text-xs">
                <p className="font-semibold">Metodo de confirmacion</p>
                <p>Pago al confirmar • Transferencia • Enlace de pago enviado por el asesor.</p>
                <p className="mt-1">El pago se coordinara directamente con el equipo despues de confirmar disponibilidad.</p>
              </div>
            </BookingSummary>
            <WhatsAppButton onClick={sendWhatsApp} />
            <p className="text-xs text-slate-500">La solicitud se enviara a WhatsApp en una nueva pestaña.</p>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-sand pt-3">
          <button type="button" onClick={clearDraft} className="rounded-xl border border-sand px-3 py-2 text-xs text-slate-600">
            Limpiar solicitud
          </button>
          <div className="flex gap-2">
            <button type="button" onClick={goBack} disabled={step === 0} className="rounded-xl border border-sand px-4 py-2 text-sm disabled:opacity-40">
              Atras
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