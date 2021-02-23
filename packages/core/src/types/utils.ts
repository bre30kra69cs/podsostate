import {Func} from './common';

export type MixFunc<F extends Func, P extends any[], R> = (
  ...args: [...Parameters<F>, ...P]
) => ReturnType<F> | R;

export type MixFuncParameters<F extends Func, P extends any[]> = MixFunc<F, P, never>;

export type MixFuncReturn<F extends Func, R> = MixFunc<F, never, R>;
