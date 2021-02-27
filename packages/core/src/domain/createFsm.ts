import {createPushStack} from './createStack';

interface FsmScheme<E, TE, S, IS, TS> {
  init: IS;
  events: E[];
  states: S[];
  transitions: {
    from: TS;
    event: TE;
    to: IS;
    guard?: (from: TS, event: TE) => boolean;
  }[];
}

export interface Fsm<E extends string, S extends string> {
  send: (event: E) => void;
  current: () => S;
}

export const createFsm = <
  E extends string,
  TE extends E,
  S extends string,
  IS extends S,
  TS extends S
>({
  init,
  transitions,
}: FsmScheme<E, TE, S, IS, TS>): Fsm<E, S> => {
  const stack = createPushStack<S>({limit: 2});
  stack.push(init);

  const getCurrent = () => {
    return stack.head() as S;
  };

  const getTransition = (event: E) => {
    const current = getCurrent();
    return transitions.find((transition) => {
      return transition.event === event && transition.from === current;
    });
  };

  const send = (event: E) => {
    const transition = getTransition(event);
    if (transition) {
      const {from, to, event: $event} = transition;
      if (transition?.guard) {
        if (transition.guard(from, $event)) {
          stack.push(to);
        }
      } else {
        stack.push(to);
      }
    }
  };

  return {
    send,
    current: getCurrent,
  };
};
