import {Locker} from '@podsostate/shared';
import {uniqArray} from '@podsostate/shared';

export interface FsmEventConfig {
  name?: string;
}

export interface FsmEvent {
  name?: string;
  isLib: boolean;
}

export interface FsmState {
  name?: string;
  leave?: () => void;
  enter?: (locker: Locker, send: (event: FsmEvent) => void) => void;
}

export type FsmSchemeOrState = FsmScheme | FsmState;

export type FsmTransition = [FsmSchemeOrState, FsmEvent, FsmSchemeOrState];

export interface FsmScheme {
  name?: string;
  init: FsmSchemeOrState;
  events: FsmEvent[];
  states: FsmSchemeOrState[];
  transitions: FsmTransition[];
}

export const createEvent = (config?: FsmEventConfig): FsmEvent => {
  return {
    name: config?.name,
    isLib: false,
  };
};

export const createLibEvent = (config?: FsmEventConfig): FsmEvent => {
  return {
    name: config?.name,
    isLib: true,
  };
};

export const createState = (config?: FsmState): FsmState => {
  return {
    name: config?.name,
    leave: config?.leave,
    enter: config?.enter,
  };
};

export interface FsmSchemeConfig {
  name?: string;
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
    name: config.name,
    init: config.init,
    events,
    states,
    transitions: config.transitions ?? [],
  };
};
