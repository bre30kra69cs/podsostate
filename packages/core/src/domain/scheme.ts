import {Locker} from '../common/createLocker';
import {uniqArray} from '../utils/uniq';

export interface FsmEvent {}

export interface FsmState {
  leave?: () => void;
  enter?: (locker: Locker, send: (event: FsmEvent) => void) => void;
}

export type FsmSchemeOrState = FsmScheme | FsmState;

export type FsmTransition = [FsmSchemeOrState, FsmEvent, FsmSchemeOrState];

export interface FsmScheme {
  init: FsmSchemeOrState;
  events: FsmEvent[];
  states: FsmSchemeOrState[];
  transitions: FsmTransition[];
}

export const createEvent = (): FsmEvent => {
  return {};
};

interface FsmStateConfig {
  leave?: () => void;
  enter?: (locker: Locker, send: (event: FsmEvent) => void) => void;
}

export const createState = (config?: FsmStateConfig): FsmState => {
  return {
    leave: config?.leave,
    enter: config?.enter,
  };
};

interface FsmSchemeConfig {
  init: FsmSchemeOrState;
  transitions?: FsmTransition[];
}

export const createScheme = (config: FsmSchemeConfig): FsmScheme => {
  const acc = [config.init];
  const states =
    config.transitions?.reduce((acc, [from, , to]) => {
      return uniqArray(acc, [from, to]);
    }, acc) ?? acc;
  const events =
    config.transitions?.reduce((acc, [, event]) => {
      return uniqArray(acc, [event]);
    }, [] as FsmEvent[]) ?? [];
  return {
    init: config.init,
    events,
    states,
    transitions: config.transitions ?? [],
  };
};
