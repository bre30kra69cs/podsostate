import {throwError} from './throwError';

export const check = (...predictions: [boolean, string?][]) => {
  predictions.forEach(([show, message]) => {
    if (show) {
      throwError(message);
    }
  });
};
