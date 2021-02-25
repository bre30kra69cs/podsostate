export type Subscriber = (event: string) => void;

type Action = () => void;

interface Transition {
  from: string;
  to: string;
  event: string;
}

type ActionStrategy = 'forward' | 'reverse' | 'throwing';

interface StateAction {
  strategy: ActionStrategy;
  action: Action;
}

interface State {
  name: string;
  leave: StateAction;
  enter: StateAction;
  core: StateAction;
}

export interface FSMScheme {
  init: string;
  events: string[];
  states: State[];
  transitions: Transition[];
}

export interface FSM {
  send: (event: string) => void;
  subscribe: (subscriber: Subscriber) => void;
  unsubscribe: (subscriber: Subscriber) => void;
}
