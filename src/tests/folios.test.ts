import { describe, expect, it } from 'vitest';
import { generateReferenceFolio } from '../lib/folios';

describe('folios', () => {
  it('genera folio de renta con formato esperado', () => {
    const folio = generateReferenceFolio('RNT');
    expect(folio).toMatch(/^DRC-RNT-\d{8}-\d{4}$/);
  });

  it('genera folio de traslado con formato esperado', () => {
    const folio = generateReferenceFolio('TRF');
    expect(folio).toMatch(/^DRC-TRF-\d{8}-\d{4}$/);
  });
});
