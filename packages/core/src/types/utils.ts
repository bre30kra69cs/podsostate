type Func = (...args: any[]) => any;

export type MixFunc<TargetFunc extends Func, ParametersMixin extends any[], ReturnMixin> = (
  ...args: [...Parameters<TargetFunc>, ...ParametersMixin]
) => ReturnType<TargetFunc> | ReturnMixin;

export type MixFuncParameters<TargetFunc extends Func, ParametersMixin extends any[]> = MixFunc<
  TargetFunc,
  ParametersMixin,
  never
>;

export type MixFuncReturn<TargetFunc extends Func, ReturnMixin> = MixFunc<
  TargetFunc,
  never,
  ReturnMixin
>;
