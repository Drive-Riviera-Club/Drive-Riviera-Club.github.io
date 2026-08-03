import { format } from 'date-fns';

export const generateReferenceFolio = (prefix: 'RNT' | 'TRF') => {
  const datePart = format(new Date(), 'yyyyMMdd');
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `DRC-${prefix}-${datePart}-${randomPart}`;
};
