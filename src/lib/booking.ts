import { differenceInCalendarDays, isBefore, startOfDay } from 'date-fns';
import type { Vehicle } from '../types';

export const calculateRentalDays = (pickupDate: string, dropoffDate: string) => {
  const pickup = startOfDay(new Date(pickupDate));
  const dropoff = startOfDay(new Date(dropoffDate));
  if (isBefore(dropoff, pickup)) return 0;
  return Math.max(1, differenceInCalendarDays(dropoff, pickup));
};

export const filterTransferVehicles = ({
  vehicles,
  passengers,
  luggage,
}: {
  vehicles: Vehicle[];
  passengers: number;
  luggage: number;
}) =>
  vehicles.filter(
    (vehicle) =>
      vehicle.active &&
      vehicle.availableForTransfer &&
      vehicle.passengers >= passengers &&
      vehicle.luggage >= luggage
  );
