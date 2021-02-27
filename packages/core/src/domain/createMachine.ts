import {FsmScheme, FsmNode, FsmState} from './createScheme';

interface Fsm {
  send: (event: string) => void;
  current: () => string;
}

const fsmFromState = (name: string, state: FsmState) => {};

export const createMachine = (scheme: FsmScheme) => {};
