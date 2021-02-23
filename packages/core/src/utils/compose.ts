import {tap, Tap} from './tap';
import {Func} from '../types/common';

type Compose = {
  (): Tap;
  <T extends Func>(fns: T[]): T;
  <T extends Func>(...fns: T[]): T;
};

const innerCompose = (fns: Func[]) => {
  if (fns.length === 1) {
    return fns[0];
  }

  return fns.reduceRight((acc, next) => {
    return (...args: any[]) => next(acc(...args));
  });
};

export const compose: Compose = (...fns: any[]) => {
  if (!fns.length) {
    return tap;
  }

  if (Array.isArray(fns[0])) {
    return innerCompose(fns[0]);
  }

  return innerCompose(fns);
};

export const pipe: Compose = (...fns: any[]) => {
  const reversedFns = Array.isArray(fns[0]) ? fns[0] : fns;
  return compose(reversedFns);
};
