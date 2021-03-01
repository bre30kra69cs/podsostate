import {mergeConfig} from '../utils/merge';
import {createMapper} from '../common/createMapper';
import {createPushStack} from '../common/createStack';
import {createLocker} from '../common/createLocker';
import {createEmitter, Subscriber} from '../common/createEmitter';
import {runAction, runAsyncAction, AsyncAction, Action} from './effectRunners';

export interface FsmEvent {}

export const createFsmEvent = (): FsmEvent => {
  return {};
};

interface FsmStaeConfig {
  enter?: Action;
  leave?: Action;
  heart?: AsyncAction;
  resolve?: Action;
  reject?: Action;
  transitions?: [FsmEvent, FsmState][];
}

export interface FsmState {
  setTo: (event: FsmEvent, state: FsmState) => void;
  income: (callback?: Action) => void;
  outcome: () => void;
  next: (event: FsmEvent) => FsmState | undefined;
  isUnlocked: () => boolean;
}

export const createFsmState = (sourceConfig?: FsmStaeConfig): FsmState => {
  const config = mergeConfig(sourceConfig, {});
  const mapper = createMapper<FsmEvent, FsmState>();
  const locker = createLocker();

  const setTo = (event: FsmEvent, state: FsmState) => {
    mapper.set(event, state, 'unsave');
  };

  const income = (callback?: Action) => {
    if (config?.enter && config?.heart) {
      runAction({
        start: locker.lock,
        action: config.enter,
      });
      runAsyncAction({
        asyncAction: config.heart,
        resolve: () => {
          callback?.();
          locker.unlock();
          if (config?.resolve) {
            runAction({action: config.resolve});
          }
        },
        reject: () => {
          callback?.();
          locker.unlock();
          if (config?.reject) {
            runAction({action: config.reject});
          }
        },
      });
    } else if (config?.enter) {
      runAction({
        start: locker.lock,
        action: config.enter,
        resolve: () => {
          callback?.();
          locker.unlock();
          if (config?.resolve) {
            runAction({action: config.resolve});
          }
        },
        reject: () => {
          callback?.();
          locker.unlock();
          if (config?.reject) {
            runAction({action: config.reject});
          }
        },
      });
    } else if (config?.heart) {
      runAsyncAction({
        start: locker.lock,
        asyncAction: config.heart,
        resolve: () => {
          callback?.();
          locker.unlock();
          if (config?.resolve) {
            runAction({action: config.resolve});
          }
        },
        reject: () => {
          callback?.();
          locker.unlock();
          if (config?.reject) {
            runAction({action: config.reject});
          }
        },
      });
    } else {
      locker.lock();
      callback?.();
      locker.unlock();
    }
  };

  const outcome = () => {
    const unlocked = locker.isUnlocked();
    if (unlocked) {
      locker.lock();
      if (config?.leave) {
        runAction({action: config.leave});
      }
      locker.unlock();
    }
  };

  const next = (event: FsmEvent) => {
    return mapper.get(event);
  };

  const isUnlocked = () => {
    return locker.isUnlocked();
  };

  const init = () => {
    config.transitions?.forEach(([event, state]) => {
      setTo(event, state);
    });
  };

  init();

  return {
    setTo,
    income,
    outcome,
    next,
    isUnlocked,
  };
};

export const connectFsmStates = (from: FsmState, event: FsmEvent, to: FsmState) => {
  from.setTo(event, to);
};

export interface FsmContainer {
  send: (event: FsmEvent) => void;
  current: () => FsmState;
  subscribe: (subscriber: FsmSubscriber) => void;
  unsubscribe: (subscriber: FsmSubscriber) => void;
}

type FsmSubscriber = (state: FsmState) => void;

const EVENT = 'EVENT';

export const createFsmContainer = (root: FsmState): FsmContainer => {
  const stack = createPushStack<FsmState>({limit: 2});
  const emitter = createEmitter<FsmState>();
  const mapper = createMapper<FsmSubscriber, Subscriber<FsmState>>();

  const getCurrent = () => {
    return stack.head() as FsmState;
  };

  const send = (event: FsmEvent) => {
    const current = getCurrent();
    const next = current.next(event);
    if (next) {
      const unlocked = current.isUnlocked();
      if (unlocked) {
        current.outcome();
        stack.push(next);
        next.income(() => emitter.emit(EVENT, next));
      }
    }
  };

  const current = () => {
    return getCurrent();
  };

  const subscribe = (subscriber: FsmSubscriber) => {
    const wrappedSubscriber = (event: string, state: FsmState) => subscriber(state);

    const memorizedWrapper = mapper.set(subscriber, wrappedSubscriber, 'save');
    emitter.subscribe(EVENT, memorizedWrapper);
  };

  const unsubscribe = (subscriber: FsmSubscriber) => {
    const memorizedWrapper = mapper.get(subscriber);
    if (memorizedWrapper) {
      emitter.unsubscribe(EVENT, memorizedWrapper);
      mapper.del(subscriber);
    }
  };

  const init = () => {
    stack.push(root);
  };

  init();

  return {
    send,
    current,
    subscribe,
    unsubscribe,
  };
};
