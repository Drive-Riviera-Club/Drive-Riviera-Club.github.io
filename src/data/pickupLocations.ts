import type { PickupLocation } from '../types';

export const pickupLocations: PickupLocation[] = [
  {
    id: 'playa-centro',
    name: 'Playa del Carmen Centro',
    fullAddress: 'Av. 15 Norte, Centro, Playa del Carmen, Q.R., Mexico',
    latitude: 20.6296,
    longitude: -87.0739,
    active: true,
    additionalFee: 0,
    openingHours: '08:00 - 18:00',
  },
  {
    id: 'tulum-centro',
    name: 'Tulum Centro',
    fullAddress: 'Avenida Tulum, Centro, Tulum, Q.R., Mexico',
    latitude: 20.211,
    longitude: -87.4654,
    active: true,
    additionalFee: 300,
    openingHours: '08:00 - 18:00',
  },
  {
    id: 'cancun-hotel-zone',
    name: 'Zona Hotelera de Cancun',
    fullAddress: 'Boulevard Kukulkan, Zona Hotelera, Cancun, Q.R., Mexico',
    latitude: 21.1349,
    longitude: -86.747,
    active: true,
    additionalFee: 600,
    openingHours: '08:00 - 18:00',
  },
  {
    id: 'other',
    name: 'Consultar otra ubicacion',
    active: true,
    additionalFee: 0,
    openingHours: 'Por confirmar',
  },
];
