import {throwError} from './throwError';

export const check = (...predictions: [boolean, string?][]) => {
  predictions.forEach(([show, message]) => {
    if (show) {
      throwError(message);
    }
  });
};

export const isNumber = (value?: any): value is number => {
  return typeof value === 'number' && isFinite(value);
};
