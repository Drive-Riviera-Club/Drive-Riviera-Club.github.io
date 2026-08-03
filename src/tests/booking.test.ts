import { describe, expect, it } from 'vitest';
import { filterTransferVehicles, calculateRentalDays } from '../lib/booking';
import { validateBookingDateTime } from '../lib/dates';
import { vehicles } from '../data/vehicles';

describe('booking utilities', () => {
  it('calcula dias de renta', () => {
    expect(calculateRentalDays('2026-07-20', '2026-07-22')).toBe(2);
    expect(calculateRentalDays('2026-07-20', '2026-07-20')).toBe(1);
  });

  it('valida entrega no anterior a recogida', () => {
    const invalid = validateBookingDateTime('2026-07-20', '12:00', '2026-07-20', '11:00');
    expect(invalid.valid).toBe(false);
  });

  it('filtra vehiculos para traslado por capacidad', () => {
    const filtered = filterTransferVehicles({ vehicles, passengers: 6, luggage: 4 });
    expect(filtered.every((vehicle) => vehicle.passengers >= 6 && vehicle.luggage >= 4 && vehicle.availableForTransfer)).toBe(true);
  });
});
