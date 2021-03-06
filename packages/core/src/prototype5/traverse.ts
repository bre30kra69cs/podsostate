import {isState, isScheme, FsmScheme, FsmState} from './scheme';

interface TraverseConfig<T> {
  onState?: (target: FsmState, parent: FsmScheme) => void;
  onSchemeLift: (target: FsmScheme, parent: FsmScheme | undefined, childrens: T[]) => T;
  onSchemeDown: (
    target: FsmScheme,
    parent: FsmScheme | undefined,
    childrens: FsmScheme[],
  ) => FsmScheme;
}

export const traverse = <T>(root: FsmScheme, config: TraverseConfig<T>): T => {
  const iter = (target: FsmScheme, parent?: FsmScheme): T => {
    const childrens = target.states.reduce((acc, next) => {
      if (isScheme(next)) {
        acc.push(next);
      }
      return acc;
    }, [] as FsmScheme[]);
    const nextTarget = config.onSchemeDown?.(target, parent, childrens);
    const nextChildrens = nextTarget.states.reduce((acc, item) => {
      if (isState(item)) {
        config.onState?.(item, nextTarget);
      } else if (isScheme(item)) {
        const children = iter(item, nextTarget);
        acc.push(children);
      }
      return acc;
    }, [] as T[]);
    return config.onSchemeLift?.(nextTarget, parent, nextChildrens);
  };

  return iter(root);
};
