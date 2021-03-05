import {FsmKey} from './key';
import {FsmEvent} from './event';

interface FsmStateConfig {
  key: FsmKey;
  transitions: [FsmEvent, FsmKey][];
}

export interface FsmState {
  key: string;
  to: Record<string, string>;
}

export const createState = (config: FsmStateConfig): FsmState => {
  return {
    key: config.key.serialize(),
    to: config.transitions.reduce((acc, [event, state]) => {
      return {
        ...acc,
        [event.serialize()]: state.serialize(),
      };
    }, {}),
  };
};

interface FsmSchemeConfig {
  init: FsmKey;
  states: (FsmScheme | FsmState)[];
}

export type FsmSchemeOrState = FsmScheme | FsmState;

export interface FsmScheme {
  init: string;
  states: FsmSchemeOrState[];
}

export const isState = (value: any): value is FsmState => {
  return !!value?.key && !!value?.to;
};

export const isScheme = (value: any): value is FsmScheme => {
  return !!value?.init && !!value?.states;
};

export const createScheme = (config: FsmSchemeConfig): FsmScheme => {
  return {
    init: config.init.serialize(),
    states: config.states,
  };
};
