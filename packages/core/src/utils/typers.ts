export const isNumber = (value?: any): value is number => {
  return typeof value === 'number' && isFinite(value);
};

export const isTruly = (value?: any): value is true => {
  return !!value;
};
