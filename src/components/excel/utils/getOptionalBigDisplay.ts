import Big from 'big.js';

export const getOptionalBigDisplay = (value: Big.Big | '-') => {
  if (value === '-') {
    return value;
  }
  return value.toString();
};
