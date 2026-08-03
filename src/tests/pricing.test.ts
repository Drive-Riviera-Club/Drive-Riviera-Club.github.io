import { describe, expect, it } from 'vitest';
import { calculateRentalEstimate, formatCurrencyMXN } from '../lib/pricing';

describe('pricing helpers', () => {
  it('formatea moneda MXN', () => {
    expect(formatCurrencyMXN(1200)).toContain('$');
  });

  it('calcula total estimado', () => {
    const result = calculateRentalEstimate({
      dailyPrice: 1000,
      days: 3,
      pickupFee: 200,
      dropoffFee: 300,
      differentDropoff: true,
    });
    expect(result.total).toBe(3500);
  });
});
