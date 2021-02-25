import {createEmitter, Subscriber} from './emitter';

export type PrimitiveFSMSubscriber = Subscriber<string[]>;

type TransitionGuard = () => boolean;

interface PrimitiveFSMScheme {
  init: string;
  events: string[];
  states: string[];
  transitions: [string, string, string, TransitionGuard?][];
}

export interface PrimitiveFSM {
  send: (event: string) => void;
  subscribe: (subscriber: PrimitiveFSMSubscriber) => void;
  unsubscribe: (subscriber: PrimitiveFSMSubscriber) => void;
  getCurrent: () => string[];
}

const EVENT = 'EVENT';

export const createPrimitiveFsm = (scheme: PrimitiveFSMScheme): PrimitiveFSM => {
  const {init, transitions} = scheme;
  const emitter = createEmitter<string[]>();
  let current = init;

  const setCurrent = (next: string) => {
    current = next;
    emitter.emit(EVENT, [current]);
  };

  const getCurrent = () => {
    return [current];
  };

  const getTransition = (event: string) => {
    return transitions.find(([from, $event]) => {
      return current === from && $event === event;
    });
  };

  const send = (event: string) => {
    const transition = getTransition(event);
    if (transition) {
      const [, , to, guard] = transition;
      if (guard) {
        if (guard()) {
          setCurrent(to);
        }
      } else {
        setCurrent(to);
      }
    }
  };

  const subscribe = (subscriber: PrimitiveFSMSubscriber) => {
    emitter.subscribe(EVENT, subscriber);
  };

  const unsubscribe = (subscriber: PrimitiveFSMSubscriber) => {
    emitter.unsubscribe(EVENT, subscriber);
  };

  return {
    send,
    subscribe,
    unsubscribe,
    getCurrent,
  };
};
