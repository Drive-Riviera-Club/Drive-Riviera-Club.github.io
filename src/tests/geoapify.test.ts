import { describe, expect, it, vi } from 'vitest';
import { searchGeoapifyAutocomplete, normalizeGeoapifyFeature, createFreeTextPlace } from '../lib/maps';
import { transferSchema } from '../lib/validationSchemas';

describe('geoapify helpers', () => {
  it('normaliza una seleccion Geoapify', () => {
    const place = normalizeGeoapifyFeature({
      geometry: { coordinates: [-86.8515, 21.1619] },
      properties: {
        place_id: 'geo-1',
        name: 'Cancun Centro',
        formatted: 'Cancun Centro, Quintana Roo, Mexico',
      },
    });

    expect(place).toEqual({
      displayName: 'Cancun Centro',
      formattedAddress: 'Cancun Centro, Quintana Roo, Mexico',
      placeId: 'geo-1',
      latitude: 21.1619,
      longitude: -86.8515,
    });
  });

  it('permite modo sin API key con texto libre', () => {
    const freeText = createFreeTextPlace('Hotel Xcaret');

    expect(freeText).toEqual({
      formattedAddress: 'Hotel Xcaret',
      name: 'Hotel Xcaret',
      selectedFromSuggestions: false,
    });
  });

  it('valida origen y destino vacios', () => {
    const result = transferSchema.safeParse({
      origin: { formattedAddress: '', selectedFromSuggestions: false },
      destination: { formattedAddress: '', selectedFromSuggestions: false },
      pickupDate: '2099-08-02',
      pickupTime: '10:00',
      comments: '',
      passengers: 1,
      firstName: 'Ana',
      lastName: 'Ruiz',
      email: '',
      phone: '',
    });

    expect(result.success).toBe(false);
  });

  it('no falla si la API devuelve error', async () => {
    vi.stubEnv('VITE_GEOAPIFY_API_KEY', 'demo-key');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network error')));

    const result = await searchGeoapifyAutocomplete('Cancun', new AbortController().signal);

    expect(result.suggestions).toEqual([]);
    expect(result.error).toBeTruthy();
  });

  it('no falla si no existe VITE_GEOAPIFY_API_KEY', async () => {
    vi.stubEnv('VITE_GEOAPIFY_API_KEY', '');

    const result = await searchGeoapifyAutocomplete('Cancun', new AbortController().signal);

    expect(result.suggestions).toEqual([]);
    expect(result.error).toBeUndefined();
  });
});
