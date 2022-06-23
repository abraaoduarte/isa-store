import { dinero, down, toUnit } from 'dinero.js';
import { USD } from '@dinero.js/currencies';

export const formatNumberToMoney = (number: number) => {
  const price = dinero({ amount: number, currency: USD });
  const priceDecimal: number = toUnit(price, { digits: 2, round: down });

  return priceDecimal.toLocaleString('pt-br', { minimumFractionDigits: 2 });
};
