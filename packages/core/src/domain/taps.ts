import {FsmEvent} from './scheme';

interface ActionTapConfig {
  start?: () => void;
  action: () => void;
  reject?: (send: (event: FsmEvent) => void) => void;
  resolve?: (send: (event: FsmEvent) => void) => void;
}

export const actionTap = (config: ActionTapConfig) => (
  unlock: () => void,
  send: (event: FsmEvent) => void,
) => {
  config.start?.();
  try {
    config.action();
    unlock();
    config.resolve?.(send);
  } catch {
    unlock();
    config.reject?.(send);
  }
};

interface AsyncActionTapConfig {
  start?: () => void;
  action: () => Promise<void>;
  reject?: (send: (event: FsmEvent) => void) => void;
  resolve?: (send: (event: FsmEvent) => void) => void;
}

export const asyncActionTap = (config: AsyncActionTapConfig) => (
  unlock: () => void,
  send: (event: FsmEvent) => void,
) => {
  config.start?.();
  const target = async () => {
    try {
      await config.action();
      unlock();
      config.resolve?.(send);
    } catch {
      unlock();
      config.reject?.(send);
    }
  };
  target();
};
