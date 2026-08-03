import { format, isBefore, isSameDay, parse } from 'date-fns';
import { es } from 'date-fns/locale';

export const parseDateTime = (date: string, time: string) => parse(`${date} ${time}`, 'yyyy-MM-dd HH:mm', new Date());

export const formatDateSpanish = (date: Date | string) => {
  const value = typeof date === 'string' ? new Date(date) : date;
  return format(value, "dd 'de' MMMM 'de' yyyy", { locale: es });
};

export const validateBookingDateTime = (pickupDate: string, pickupTime: string, dropoffDate: string, dropoffTime: string) => {
  const pickup = parseDateTime(pickupDate, pickupTime);
  const dropoff = parseDateTime(dropoffDate, dropoffTime);

  if (isBefore(dropoff, pickup)) {
    return { valid: false, message: 'La entrega no puede ser anterior a la recogida.' };
  }

  if (isSameDay(dropoff, pickup) && dropoffTime <= pickupTime) {
    return { valid: false, message: 'La hora de entrega debe ser mayor en el mismo dia.' };
  }

  return { valid: true, message: '' };
};
