import {createEmitter, Subscriber} from './emitter';
import {check} from '../utils/check';
import {countStrings} from '../utils/count';

interface FSMScheme {
  init: string;
  events: string[];
  states: string[];
  transitions: [string, string, string][];
}

const DETERMINATION_BORDER = 1;

const validateFsm = (scheme: FSMScheme) => {
  const {init, events, states, transitions} = scheme;

  const initCheck = () => {
    check([states.includes(init), 'FSM Invalid "init" state.']);
  };

  const transitionsCheck = () => {
    transitions.forEach(([$from, $event, $to]) => {
      check(
        [states.includes($from), 'FSM Invalid transition "from" state.'],
        [events.includes($event), 'FSM Invalid transition "event".'],
        [states.includes($to), 'FSM Invalid transition "to" state.'],
      );
    });
  };

  const determinationCheck = () => {
    states.forEach(($state) => {
      const counterMap = transitions
        .filter(([$from]) => $from === $state)
        .map(([, $event]) => $event)
        .reduce(countStrings, {});

      Object.keys(counterMap).forEach((key) => {
        check([counterMap[key] > DETERMINATION_BORDER, 'FSM not deterministic.']);
      });
    });
  };

  initCheck();
  transitionsCheck();
  determinationCheck();
};

interface FSM {
  send: (event: string) => void;
  subscribe: (subscriber: Subscriber) => void;
  unsubscribe: (subscriber: Subscriber) => void;
}

const EVENT = 'FSM_BUS';

export const createFsm = (scheme: FSMScheme): FSM => {
  const {init, transitions} = scheme;
  validateFsm(scheme);
  let $current = init;
  const emitter = createEmitter();

  const getTransition = (event: string) => {
    return transitions.find(([$from, $event]) => {
      return $current === $from && $event === event;
    });
  };

  const send = (event: string) => {
    const transition = getTransition(event);

    if (transition) {
      const [, , to] = transition;
      $current = to;
    }
  };

  const subscribe = (subscriber: Subscriber) => {
    emitter.subscribe(EVENT, subscriber);
  };

  const unsubscribe = (subscriber: Subscriber) => {
    emitter.unsubscribe(EVENT, subscriber);
  };

  return {
    send,
    subscribe,
    unsubscribe,
  };
};
