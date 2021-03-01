import {createFsmElement, SchemeBuilder} from './createMachine';
import {FsmEvent} from './createEvent';
import {FsmCoord} from './createAlias';
import {mergeConfig} from '../utils/merge';

type Gurard = () => boolean;

type Action = () => void;

type HeartAction = (unlock: Action) => void;

interface StateConfig {
  coord: FsmCoord;
  guard?: Gurard;
  enter?: Action;
  leave?: Action;
  heart?: HeartAction;
  transitions?: [FsmEvent, FsmCoord][];
}

export const createStateBuilder = (config: StateConfig): SchemeBuilder => {
  return (context, root) => {
    const state = createFsmElement();
    context.registry(state, root);
  };
};

interface SchemeConfig {
  init: SchemeBuilder;
  states?: SchemeBuilder[];
}

export const createSchemeBuilder = (config: SchemeConfig): SchemeBuilder => {
  return (context, root) => {
    const scheme = createFsmElement();
    context.registry(scheme, root);
    config.states?.forEach((builder) => builder(context, scheme));
  };
};
