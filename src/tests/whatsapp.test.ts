import { describe, expect, it } from 'vitest';
import { buildRentalWhatsAppMessage, buildTransferWhatsAppMessage, createWhatsAppUrl } from '../lib/whatsapp';

describe('whatsapp helpers', () => {
  it('construye mensaje de renta', () => {
    const message = buildRentalWhatsAppMessage({
      vehicle: 'SUV 6 Pasajeros',
      pickupLocation: 'Playa del Carmen Centro',
      pickupDate: '2026-07-22',
      pickupTime: '10:00',
      dropoffLocation: 'Tulum Centro',
      dropoffDate: '2026-07-24',
      dropoffTime: '09:00',
      customerName: 'Ana Ruiz',
      estimatedTotal: '$3,000 MXN',
      folio: 'DRC-RNT-20260720-1234',
    });
    expect(message).toContain('Folio: DRC-RNT-20260720-1234');
    expect(message).toContain('Vehiculo: SUV 6 Pasajeros');
  });

  it('construye mensaje de traslado', () => {
    const message = buildTransferWhatsAppMessage({
      origin: 'Cancun',
      destination: 'Playa',
      date: '2026-07-22',
      time: '13:00',
      passengers: 4,
      luggage: 3,
      vehicle: 'Sedan',
      infantSeat: false,
      customerName: 'Luis Soto',
      folio: 'DRC-TRF-20260720-5678',
    });
    expect(message).toContain('Folio: DRC-TRF-20260720-5678');
    expect(message).toContain('Origen: Cancun');
  });

  it('codifica correctamente URL de WhatsApp', () => {
    const url = createWhatsAppUrl('521111111111', 'Hola\nLinea');
    expect(url).toContain('https://wa.me/521111111111?text=');
    expect(url).toContain('%0A');
  });
});
