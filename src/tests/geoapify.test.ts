import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { PlaceAutocomplete } from '../components/maps/PlaceAutocomplete';
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

  it('conserva espacios internos en texto libre', () => {
    const freeText = createFreeTextPlace('aeropuerto ciudad de mexico');

    expect(freeText).toEqual({
      formattedAddress: 'aeropuerto ciudad de mexico',
      name: 'aeropuerto ciudad de mexico',
      selectedFromSuggestions: false,
    });
  });

  it('elimina solo espacios al inicio y final en texto libre', () => {
    const freeText = createFreeTextPlace('  aeropuerto ciudad de mexico  ');

    expect(freeText).toEqual({
      formattedAddress: 'aeropuerto ciudad de mexico',
      name: 'aeropuerto ciudad de mexico',
      selectedFromSuggestions: false,
    });
  });

  it('mantiene espacios internos al escribir en modo fallback sin Geoapify', () => {
    vi.stubEnv('VITE_GEOAPIFY_API_KEY', '');
    const handleSelect = vi.fn();

    render(
      createElement(PlaceAutocomplete, {
        label: 'Origen',
        placeholder: 'Hotel, aeropuerto, calle o punto de referencia',
        value: null,
        onPlaceSelect: handleSelect,
      })
    );

    const input = screen.getByPlaceholderText('Hotel, aeropuerto, calle o punto de referencia');
    fireEvent.change(input, { target: { value: 'aeropuerto ciudad de mexico' } });

    expect((input as HTMLInputElement).value).toBe('aeropuerto ciudad de mexico');
    expect(handleSelect).toHaveBeenLastCalledWith({
      formattedAddress: 'aeropuerto ciudad de mexico',
      name: 'aeropuerto ciudad de mexico',
      selectedFromSuggestions: false,
    });
  });

  it('mantiene espacios internos al escribir con Geoapify activo', async () => {
    vi.stubEnv('VITE_GEOAPIFY_API_KEY', 'demo-key');
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        features: [{
          geometry: { coordinates: [-86.85, 21.16] },
          properties: {
            place_id: 'geo-2',
            formatted: 'Aeropuerto Internacional de Cancún',
            name: 'Aeropuerto Internacional de Cancún',
          },
        }],
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const handleSelect = vi.fn();
    render(
      createElement(PlaceAutocomplete, {
        label: 'Origen',
        placeholder: 'Hotel, aeropuerto, calle o punto de referencia',
        value: null,
        onPlaceSelect: handleSelect,
      })
    );

    const input = screen.getByPlaceholderText('Hotel, aeropuerto, calle o punto de referencia');
    fireEvent.change(input, { target: { value: 'aeropuerto ciudad de mexico' } });

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
    });

    expect((input as HTMLInputElement).value).toBe('aeropuerto ciudad de mexico');
    expect(fetchMock.mock.calls[0][0].toString()).toContain('text=aeropuerto+ciudad+de+mexico');
  });

  it('selecciona la sugerencia activa con Tab cuando hay lista abierta', async () => {
    vi.stubEnv('VITE_GEOAPIFY_API_KEY', 'demo-key');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        features: [
          { geometry: { coordinates: [-86.85, 21.16] }, properties: { place_id: 'geo-a', formatted: 'Hotel Xcaret', name: 'Hotel Xcaret' } },
          { geometry: { coordinates: [-86.86, 21.17] }, properties: { place_id: 'geo-b', formatted: 'Hotel Plaza', name: 'Hotel Plaza' } },
        ],
      }),
    }));

    const handleSelect = vi.fn();
    render(
      createElement(PlaceAutocomplete, {
        label: 'Origen',
        placeholder: 'Hotel, aeropuerto, calle o punto de referencia',
        value: null,
        onPlaceSelect: handleSelect,
      })
    );

    const input = screen.getByPlaceholderText('Hotel, aeropuerto, calle o punto de referencia');
    fireEvent.change(input, { target: { value: 'hotel' } });

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    fireEvent.keyDown(input, { key: 'Tab' });

    await waitFor(() => {
      expect(handleSelect).toHaveBeenCalledWith(
        expect.objectContaining({
          formattedAddress: 'Hotel Xcaret',
          name: 'Hotel Xcaret',
          latitude: 21.16,
          longitude: -86.85,
          placeId: 'geo-a',
          selectedFromSuggestions: true,
        })
      );
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
