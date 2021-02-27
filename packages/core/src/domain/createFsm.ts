import {createPushStack} from './createStack';
import {createEmitter, Subscriber} from './createEmitter';
import {createMapper} from './createMapper';
import {isTruly} from '../utils/typers';

interface Transition<TE, TS> {
  from: TS;
  event: TE;
  to: TS;
  actionOrder?: 'before' | 'after';
  guard?: (from: TS, event: TE) => boolean;
  action?: (from: TS, event: TE) => void;
}

interface FsmScheme<E, TE, S, IS, TS> {
  init: IS;
  events: E[];
  states: S[];
  transitions: (Transition<TE, TS> | false)[];
}

type FsmSubscriber<E, S> = (from: S, event: E, to: S) => void;

export interface Fsm<E, S> {
  send: (event: E) => void;
  current: () => S;
  subscribe: (subscriber: FsmSubscriber<E, S>) => void;
  unsubscribe: (subscriber: FsmSubscriber<E, S>) => void;
}

const EVENT = 'FSM_BUS_EVENT';

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
  const emitter = createEmitter<[S, E, S]>();
  const mapper = createMapper<FsmSubscriber<E, S>, Subscriber<[S, E, S]>>();
  stack.push(init);

  const push = (from: TS, event: TE, to: TS) => {
    stack.push(to);
    emitter.emit(EVENT, [from, event, to]);
  };

  const getCurrent = () => {
    return stack.head() as S;
  };

  const getTransition = (event: E) => {
    const current = getCurrent();
    return transitions.filter(isTruly).find((transition) => {
      const $transition = transition as Transition<TE, TS>;
      return $transition.event === event && $transition.from === current;
    });
  };

  const guradCheck = (transition: Transition<TE, TS>, payload: () => void) => {
    const {from, event, guard} = transition;
    if (guard) {
      if (guard(from, event)) {
        payload();
      }
    } else {
      payload();
    }
  };

  const send = (event: E) => {
    const transition = getTransition(event);
    if (transition) {
      const {from, to, event: $event, action, actionOrder} = transition;
      guradCheck(transition, () => {
        if (actionOrder === 'before') {
          action?.(from, $event);
          push(from, $event, to);
        } else if (actionOrder === 'after') {
          push(from, $event, to);
          action?.(from, $event);
        } else {
          action?.(from, $event);
          push(from, $event, to);
        }
      });
    }
  };

  const current = () => {
    return getCurrent();
  };

  const subscribe = (subscriber: FsmSubscriber<E, S>) => {
    const wrapped = (event: string, [from, $event, to]: [S, E, S]) => {
      subscriber(from, $event, to);
    };

    const memorizedWrapper = mapper.set(subscriber, wrapped, 'save');
    emitter.subscribe(EVENT, memorizedWrapper);
  };

  const unsubscribe = (subscriber: FsmSubscriber<E, S>) => {
    const memorizedWrapper = mapper.get(subscriber);
    if (memorizedWrapper) {
      emitter.unsubscribe(EVENT, memorizedWrapper);
      mapper.del(subscriber);
    }
  };

  return {
    send,
    current,
    subscribe,
    unsubscribe,
  };
};
