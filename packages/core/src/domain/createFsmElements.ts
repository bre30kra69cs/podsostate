import {mergeConfig} from '../utils/merge';
import {createMapper} from '../common/createMapper';
import {createPushStack} from '../common/createStack';
import {createLocker} from './createLocker';

interface FsmEvent {}

export const createFsmEvent = (): FsmEvent => {
  return {};
};

type Action = () => void;

type AsyncAction = () => Promise<void>;

interface FsmStaeConfig {
  enter?: Action;
  leave?: Action;
  heart?: AsyncAction;
  transitions?: [FsmEvent, FsmState][];
}

interface FsmState {
  setTo: (event: FsmEvent, state: FsmState) => void;
  income: () => void;
  outcome: () => void;
  next: (event: FsmEvent) => FsmState | undefined;
  isUnlocked: () => boolean;
}

interface ActionRunnerConfig {
  action: Action;
  start?: Action;
  resolve?: Action;
  reject?: Action;
}

const runAction = (config: ActionRunnerConfig) => {
  config.start?.();
  try {
    config.action();
    config.resolve?.();
  } catch {
    config.reject?.();
  }
};

interface AsyncActionRunnerConfig {
  asyncAction: AsyncAction;
  start?: Action;
  resolve?: Action;
  reject?: Action;
}

const runAsyncAction = (config: AsyncActionRunnerConfig) => {
  config.start?.();
  const wrapped = async () => {
    try {
      await config.asyncAction();
      config.resolve?.();
    } catch {
      config.reject?.();
    }
  };
  wrapped();
};

export const createFsmState = (sourceConfig?: FsmStaeConfig): FsmState => {
  const config = mergeConfig(sourceConfig, {});
  const mapper = createMapper<FsmEvent, FsmState>();
  const locker = createLocker();

  const setTo = (event: FsmEvent, state: FsmState) => {
    mapper.set(event, state, 'unsave');
  };

  const enter = () => {
    if (config?.enter) {
      runAction({action: config.enter});
    }
  };

  const heart = () => {
    if (config?.heart) {
      runAsyncAction({
        start: locker.lock,
        asyncAction: config.heart,
        resolve: locker.unlock,
        reject: locker.unlock,
      });
    }
  };

  const leave = () => {
    if (config?.leave) {
      runAction({action: config.leave});
    }
  };

  const income = () => {
    enter();
    heart();
  };

  const outcome = () => {
    const unlocked = locker.current();
    if (unlocked) {
      leave();
    }
  };

  const next = (event: FsmEvent) => {
    return mapper.get(event);
  };

  const isUnlocked = () => {
    return locker.current();
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

interface FsmContainer {
  send: (event: FsmEvent) => void;
  current: () => FsmState;
}

export const createFsmContainer = (root: FsmState): FsmContainer => {
  const stack = createPushStack<FsmState>({limit: 2});

  const head = () => {
    return stack.head() as FsmState;
  };

  const send = (event: FsmEvent) => {
    const current = head();
    const next = current.next(event);
    if (next) {
      const unlocked = current.isUnlocked();
      if (unlocked) {
        current.outcome();
        stack.push(next);
        next.income();
      }
    }
  };

  const current = () => {
    return head();
  };

  const init = () => {
    stack.push(root);
  };

  init();

  return {
    send,
    current,
  };
};
