import type { SelectedPlace, TransferLocationValue } from '../types';

export const geoapifyAttribution = 'Geocoding powered by Geoapify / OpenStreetMap contributors';

export const geoapifyBias = {
  latitude: 21.1619,
  longitude: -86.8515,
};

export const hasGeoapifyKey = () => Boolean(import.meta.env.VITE_GEOAPIFY_API_KEY);

export interface GeoapifyFeature {
  geometry?: {
    coordinates?: [number, number];
  };
  properties?: {
    place_id?: string;
    formatted?: string;
    name?: string;
    city?: string;
    county?: string;
    state?: string;
    country?: string;
    address_line1?: string;
    address_line2?: string;
  };
}

export interface GeoapifySearchResult {
  suggestions: SelectedPlace[];
  error?: string;
}

const buildFormattedAddress = (feature: GeoapifyFeature) => {
  const properties = feature.properties;
  if (properties?.formatted) return properties.formatted;

  const parts = [properties?.address_line1, properties?.address_line2, properties?.city, properties?.county, properties?.state, properties?.country].filter(Boolean);
  return parts.join(', ');
};

export const normalizeGeoapifyFeature = (feature: GeoapifyFeature): SelectedPlace => {
  const coordinates = feature.geometry?.coordinates || [0, 0];
  const properties = feature.properties;
  const formattedAddress = buildFormattedAddress(feature);

  return {
    displayName: properties?.name || formattedAddress,
    formattedAddress,
    placeId: properties?.place_id || formattedAddress || 'geoapify-place',
    latitude: coordinates[1],
    longitude: coordinates[0],
  };
};

export const createFreeTextPlace = (input: string): TransferLocationValue | null => {
  const formattedAddress = input.trim();
  if (!formattedAddress) return null;

  return {
    formattedAddress,
    name: formattedAddress,
    selectedFromSuggestions: false,
  };
};

export const createSelectedTransferPlace = (place: SelectedPlace): TransferLocationValue => ({
  ...place,
  selectedFromSuggestions: true,
  name: place.displayName,
});

export const searchGeoapifyAutocomplete = async (
  query: string,
  signal: AbortSignal,
  locationBias = geoapifyBias
): Promise<GeoapifySearchResult> => {
  const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
  if (!apiKey) {
    return { suggestions: [] };
  }

  const trimmedQuery = query.trim();
  if (trimmedQuery.length < 3) {
    return { suggestions: [] };
  }

  try {
    const url = new URL('https://api.geoapify.com/v1/geocode/autocomplete');
    url.searchParams.set('text', trimmedQuery);
    url.searchParams.set('apiKey', apiKey);
    url.searchParams.set('lang', 'es');
    url.searchParams.set('limit', '6');
    url.searchParams.set('filter', 'countrycode:mx');
    url.searchParams.set('bias', `proximity:${locationBias.longitude},${locationBias.latitude}`);

    const response = await fetch(url.toString(), { signal });
    if (!response.ok) {
      return {
        suggestions: [],
        error: 'No pudimos cargar sugerencias en este momento. Intenta de nuevo.',
      };
    }

    const data = (await response.json()) as { features?: GeoapifyFeature[] };
    const suggestions = (data.features || []).slice(0, 6).map(normalizeGeoapifyFeature);

    if (!suggestions.length) {
      return {
        suggestions: [],
        error: 'No encontramos resultados.',
      };
    }

    return { suggestions };
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return { suggestions: [] };
    }

    return {
      suggestions: [],
      error: 'No pudimos cargar sugerencias. Revisa tu conexion e intenta nuevamente.',
    };
  }
};
