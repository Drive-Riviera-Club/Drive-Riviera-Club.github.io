import { formatDateSpanish } from './dates';

export const createWhatsAppUrl = (phone: string, message: string) => `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

export const buildRentalWhatsAppMessage = (input: {
  vehicle: string;
  pickupLocation: string;
  pickupDate: string;
  pickupTime: string;
  dropoffLocation: string;
  dropoffDate: string;
  dropoffTime: string;
  customerName: string;
  estimatedTotal: string;
  folio: string;
}) => `Hola, Drive Riviera Club.\n\nMe gustaria solicitar disponibilidad para una renta de auto.\n\n━━━━━━━━━━━━━━━━━━\n🚗 Vehiculo: ${input.vehicle}\n📍 Recogida: ${input.pickupLocation}\n📅 Fecha de recogida: ${formatDateSpanish(input.pickupDate)}\n🕒 Hora de recogida: ${input.pickupTime}\n\n📍 Entrega: ${input.dropoffLocation}\n📅 Fecha de entrega: ${formatDateSpanish(input.dropoffDate)}\n🕒 Hora de entrega: ${input.dropoffTime}\n\n👤 Cliente: ${input.customerName}\n💰 Total estimado: ${input.estimatedTotal}\n━━━━━━━━━━━━━━━━━━\n\nEntiendo que la solicitud esta sujeta a confirmacion.\n\nFolio: ${input.folio}`;

export const buildTransferWhatsAppMessage = (input: {
  origin: string;
  destination: string;
  date: string;
  time: string;
  passengers: number;
  luggage: number;
  vehicle: string;
  flightNumber?: string;
  infantSeat: boolean;
  customerName: string;
  folio: string;
}) => `Hola, Drive Riviera Club.\n\nMe gustaria solicitar un traslado privado.\n\n━━━━━━━━━━━━━━━━━━\n📍 Origen: ${input.origin}\n📍 Destino: ${input.destination}\n\n📅 Fecha: ${formatDateSpanish(input.date)}\n🕒 Hora: ${input.time}\n\n👥 Pasajeros: ${input.passengers}\n🧳 Equipaje: ${input.luggage}\n🚙 Vehiculo solicitado: ${input.vehicle}\n✈️ Vuelo: ${input.flightNumber?.trim() ? input.flightNumber : 'No aplica'}\n👶 Silla infantil: ${input.infantSeat ? 'Si' : 'No'}\n👤 Cliente: ${input.customerName}\n━━━━━━━━━━━━━━━━━━\n\nEntiendo que el servicio esta sujeto a disponibilidad y confirmacion.\n\nFolio: ${input.folio}`;
