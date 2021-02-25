import {Subscriber, FSMScheme, FSM} from '../types/core';
import {createEmitter} from './emitter';
import {validateFsm} from './validateFsm';

export const createFsm = (scheme: FSMScheme): FSM => {
  const {init, events, transitions} = scheme;
  let $current = init;
  validateFsm(scheme);
  const emitter = createEmitter();

  const getTransition = (event: string) => {
    return transitions.find(({from: $from, event: $event}) => {
      return $current === $from && $event === event;
    });
  };

  const send = (event: string) => {
    const transition = getTransition(event);

    if (transition) {
      const {to} = transition;
      $current = to;
      emitter.emit($current);
    }
  };

  const subscribe = (subscriber: Subscriber) => {
    events.forEach(($event) => {
      emitter.subscribe($event, subscriber);
    });
  };

  const unsubscribe = (subscriber: Subscriber) => {
    events.forEach(($event) => {
      emitter.unsubscribe($event, subscriber);
    });
  };

  return {
    send,
    subscribe,
    unsubscribe,
  };
};
