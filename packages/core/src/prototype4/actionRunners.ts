import {FsmEvent} from './createEvent';

interface ActionRunnerConfig {
  start?: () => void;
  heart?: () => void;
  resolve?: (send: (event: FsmEvent) => void) => void;
  reject?: (send: (event: FsmEvent) => void) => void;
}

export const actionRunner = (config: ActionRunnerConfig) => (
  unlock: () => void,
  send: (event: FsmEvent) => void,
) => {
  config.start?.();
  try {
    config.heart?.();
    unlock();
    config.resolve?.(send);
  } catch {
    unlock();
    config.reject?.(send);
  }
};

interface AsyncActionRunnerConfig {
  start?: () => void;
  heart?: () => Promise<void>;
  resolve?: (send: (event: FsmEvent) => void) => void;
  reject?: (send: (event: FsmEvent) => void) => void;
}

export const asyncActionRunner = (config: AsyncActionRunnerConfig) => (
  unlock: () => void,
  send: (event: FsmEvent) => void,
) => {
  config.start?.();
  const wrapped = async () => {
    try {
      await config.heart?.();
      unlock();
      config.resolve?.(send);
    } catch {
      unlock();
      config.reject?.(send);
    }
  };
  wrapped();
};
