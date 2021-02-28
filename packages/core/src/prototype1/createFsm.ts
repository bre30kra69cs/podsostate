import {createPushStack} from './createStack';
import {createEmitter, Subscriber} from './createEmitter';
import {createMapper} from './createMapper';
import {isTruly} from '../utils/typers';
import {pipe} from '../utils/compose';

interface Transition {
  from: string;
  event: string;
  to: string;
  actionOrder?: 'before' | 'after';
  guard?: (from: string, event: string) => boolean;
  action?: (from: string, event: string) => void;
}

interface FsmScheme {
  init: string;
  events: string[];
  states: string[];
  transitions: Transition[];
}

type FsmSubscriber = (from: string, event: string, to: string) => void;

export interface Fsm {
  send: (event: string) => void;
  current: () => string;
  subscribe: (subscriber: FsmSubscriber) => void;
  unsubscribe: (subscriber: FsmSubscriber) => void;
}

const EVENT = 'FSM_BUS_EVENT';

export const createFsm = ({init, transitions}: FsmScheme): Fsm => {
  const stack = createPushStack<string>({limit: 2});
  const emitter = createEmitter<[string, string, string]>();
  const mapper = createMapper<FsmSubscriber, Subscriber<[string, string, string]>>();
  stack.push(init);

  const push = (from: string, event: string, to: string) => {
    stack.push(to);
    emitter.emit(EVENT, [from, event, to]);
  };

  const getCurrent = () => {
    return stack.head() as string;
  };

  const getTransition = (event: string) => {
    const current = getCurrent();
    return transitions.filter(isTruly).find((transition) => {
      const $transition = transition as Transition;
      return $transition.event === event && $transition.from === current;
    });
  };

  const guradCheck = (transition: Transition, payload: () => void) => {
    const {from, event, guard} = transition;
    if (guard) {
      if (guard(from, event)) {
        payload();
      }
    } else {
      payload();
    }
  };

  const send = (event: string) => {
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

  const subscribe = (subscriber: FsmSubscriber) => {
    const wrapped = (event: string, [from, $event, to]: [string, string, string]) => {
      subscriber(from, $event, to);
    };

    const memorizedWrapper = mapper.set(subscriber, wrapped, 'save');
    emitter.subscribe(EVENT, memorizedWrapper);
  };

  const unsubscribe = (subscriber: FsmSubscriber) => {
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

type FsmFabricPlugin = (scheme: FsmScheme) => FsmScheme;

interface FsmFabricConfig {
  plugins: FsmFabricPlugin[];
}

export const createFsmFabric = (config: FsmFabricConfig) => {
  const prepareScheme = pipe(config.plugins);

  const fsmFabric = (sourceScheme: FsmScheme) => {
    const scheme = prepareScheme(sourceScheme);
    return createFsm(scheme);
  };

  return {
    fsmFabric,
  };
};
