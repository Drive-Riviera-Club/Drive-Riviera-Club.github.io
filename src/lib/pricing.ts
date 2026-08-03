export const formatCurrencyMXN = (amount: number) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(amount);

export const calculateRentalEstimate = ({
  dailyPrice,
  days,
  pickupFee,
  dropoffFee,
  differentDropoff,
}: {
  dailyPrice: number;
  days: number;
  pickupFee: number;
  dropoffFee: number;
  differentDropoff: boolean;
}) => {
  const base = dailyPrice * days;
  const locationFees = pickupFee + (differentDropoff ? dropoffFee : 0);
  const total = base + locationFees;

  return {
    base,
    locationFees,
    total,
  };
};
