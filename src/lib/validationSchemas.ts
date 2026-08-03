import { addHours, isBefore, startOfDay } from 'date-fns';
import { z } from 'zod';
import { bookingConfig } from '../config/booking';

const baseCustomer = {
  firstName: z.string().min(2, 'Nombre requerido'),
  lastName: z.string().min(2, 'Apellido requerido'),
  email: z.string().email('Correo invalido').optional().or(z.literal('')),
  phone: z.string().optional(),
  comments: z.string().optional(),
};

export const rentalSchema = z
  .object({
    pickupLocationId: z.string().min(1, 'Selecciona lugar de recogida'),
    customPickupLocation: z.string().optional(),
    pickupDate: z.string().min(1, 'Selecciona fecha de recogida'),
    pickupTime: z.string().min(1, 'Selecciona hora de recogida'),
    dropoffDate: z.string().min(1, 'Selecciona fecha de entrega'),
    dropoffTime: z.string().min(1, 'Selecciona hora de entrega'),
    dropoffLocationId: z.string().min(1, 'Selecciona lugar de entrega'),
    vehicleId: z.string().min(1, 'Selecciona un vehiculo'),
    ...baseCustomer,
  })
  .superRefine((data, ctx) => {
    const today = startOfDay(new Date());
    if (isBefore(startOfDay(new Date(data.pickupDate)), today)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'No se permiten fechas anteriores a hoy.', path: ['pickupDate'] });
    }
    if (!bookingConfig.availablePickupTimes.includes(data.pickupTime)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Hora de recogida no permitida.', path: ['pickupTime'] });
    }
    if (!bookingConfig.availablePickupTimes.includes(data.dropoffTime)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Hora de entrega no permitida.', path: ['dropoffTime'] });
    }
  });

export const transferSchema = z
  .object({
    origin: z
      .object({
        formattedAddress: z.string(),
        name: z.string().optional(),
        placeId: z.string().optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        selectedFromSuggestions: z.boolean().optional(),
      })
      .nullable(),
    destination: z
      .object({
        formattedAddress: z.string(),
        name: z.string().optional(),
        placeId: z.string().optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        selectedFromSuggestions: z.boolean().optional(),
      })
      .nullable(),
    pickupDate: z.string().min(1, 'Selecciona fecha'),
    pickupTime: z.string().min(1, 'Selecciona hora'),
    adults: z.number().min(1),
    children: z.number().min(0),
    babies: z.number().min(0),
    luggage: z.number().min(0),
    infantSeat: z.boolean(),
    flightNumber: z.string().optional(),
    comments: z.string().optional(),
    vehicleId: z.string().min(1, 'Selecciona un vehiculo'),
    firstName: z.string().min(2, 'Nombre requerido'),
    lastName: z.string().min(2, 'Apellido requerido'),
    email: z.string().email('Correo invalido').optional().or(z.literal('')),
    phone: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.origin || !data.origin.formattedAddress.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Ingresa un origen valido.', path: ['origin'] });
    }
    if (!data.destination || !data.destination.formattedAddress.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Ingresa un destino valido.', path: ['destination'] });
    }
    const minimumDate = addHours(new Date(), bookingConfig.minimumAdvanceHours);
    const selected = new Date(`${data.pickupDate}T${data.pickupTime}:00`);
    if (selected < minimumDate) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: `El traslado requiere minimo ${bookingConfig.minimumAdvanceHours} horas de anticipacion.`, path: ['pickupTime'] });
    }
  });

export type RentalFormValues = z.infer<typeof rentalSchema>;
export type TransferFormValues = z.infer<typeof transferSchema>;
