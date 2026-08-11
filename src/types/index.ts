export type VehicleCategory = 'compact' | 'sedan' | 'suv' | 'van';

export interface Vehicle {
  id: string;
  slug: string;
  name: string;
  category: VehicleCategory;
  image: string;
  gallery: string[];
  dailyPrice: number;
  passengers: number;
  luggage: number;
  transmission: 'automatic' | 'manual';
  airConditioning: boolean;
  active: boolean;
  availableForRental: boolean;
  availableForTransfer: boolean;
  featured: boolean;
  description: string;
  features: string[];
  idealFor: string;
}

export interface PickupLocation {
  id: string;
  name: string;
  fullAddress?: string;
  latitude?: number;
  longitude?: number;
  active: boolean;
  additionalFee: number;
  openingHours: string;
}

export interface SelectedPlace {
  displayName: string;
  formattedAddress: string;
  placeId: string;
  latitude: number;
  longitude: number;
}

export interface TransferLocationValue {
  formattedAddress: string;
  name?: string;
  placeId?: string;
  latitude?: number;
  longitude?: number;
  selectedFromSuggestions?: boolean;
}

export type PlaceSelection = SelectedPlace;
