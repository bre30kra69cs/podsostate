export const isNumber = (value?: any): value is number => {
  return typeof value === 'number' && isFinite(value);
};

export const isTruly = (value?: any): boolean => {
  return !!value;
};

export const isString = (value?: any): value is string => {
  return typeof value === 'string';
};
