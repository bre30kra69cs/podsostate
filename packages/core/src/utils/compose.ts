import {tap, Tap} from './tap';

type Func = (...args: any[]) => any;

export type Compose = {
  (): Tap;
  <T extends Func>(...fns: T[]): T;
};

export const compose: Compose = (...fns: any[]) => {
  if (!fns.length) {
    return tap;
  }

  return fns.reduceRight((acc, next) => {
    return (...args: any[]) => next(acc(...args));
  }, tap);
};
