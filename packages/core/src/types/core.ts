export type Subscriber = (event: string) => void;

export interface FSM {
  send: (event: string) => void;
  subscribe: (subscriber: Subscriber) => void;
  unsubscribe: (subscriber: Subscriber) => void;
}

export interface Transition {
  from: string;
  to: string;
  event: string;
}

export interface FSMScheme {
  init: string;
  events: string[];
  states: string[];
  transitions: Transition[];
}

type Action = () => void;

export interface ActionTransition extends Transition {
  action: Action;
}

export interface ActionFSMScheme extends FSMScheme {
  transitions: ActionTransition[];
}
