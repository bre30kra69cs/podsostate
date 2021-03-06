import {noop} from '../utils/noop';
import {uniqArray} from '../utils/uniq';

export interface FsmEvent {}

export interface FsmState {
  leave: () => void;
  enter: (unlock: () => void, send: (event: FsmEvent) => void) => void;
}

export type FsmSchemeOrState = FsmScheme | FsmState;

export type FsmTransition = [FsmSchemeOrState, FsmEvent, FsmSchemeOrState];

export interface FsmScheme {
  init: FsmSchemeOrState;
  outEvents: FsmEvent[];
  events: FsmEvent[];
  states: FsmSchemeOrState[];
  transitions: FsmTransition[];
}

export const createEvent = (): FsmEvent => {
  return {};
};

interface FsmStateConfig {
  leave?: () => void;
  enter?: (unlock: () => void, send: (event: FsmEvent) => void) => void;
}

export const createState = (config?: FsmStateConfig): FsmState => {
  return {
    leave: config?.leave ?? noop,
    enter: config?.enter ?? noop,
  };
};

interface FsmSchemeConfig {
  init: FsmSchemeOrState;
  outEvents?: FsmEvent[];
  transitions?: FsmTransition[];
}

export const createScheme = (config: FsmSchemeConfig): FsmScheme => {
  const states =
    config.transitions?.reduce(
      (acc, [from, , to]) => uniqArray(acc, [from, to]),
      [] as FsmSchemeOrState[],
    ) ?? [];
  const events =
    config.transitions?.reduce((acc, [, event]) => {
      return uniqArray(acc, [event]);
    }, [] as FsmEvent[]) ?? [];
  return {
    init: config.init,
    outEvents: config.outEvents ?? [],
    events,
    states,
    transitions: config.transitions ?? [],
  };
};
