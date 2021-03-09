import {createLocker, Locker} from '../common/createLocker';
import {FsmEvent} from './scheme';

export const sendOnceWrapper = (locker: Locker, send: (event: FsmEvent) => void) => {
  const onceLocker = createLocker();
  onceLocker.unlock();

  return (event: FsmEvent) => {
    if (onceLocker.isUnlocked()) {
      locker.unlock();
      send(event);
    }
    onceLocker.lock();
  };
};

interface ActionTapConfig {
  start?: () => void;
  action: () => void;
  reject?: (send: (event: FsmEvent) => void) => void;
  resolve?: (send: (event: FsmEvent) => void) => void;
}

export const actionTap = (config: ActionTapConfig) => (
  locker: Locker,
  send: (event: FsmEvent) => void,
) => {
  const sendOnce = sendOnceWrapper(locker, send);
  config.start?.();
  try {
    config.action();
    locker.unlock();
    config.resolve?.(sendOnce);
  } catch {
    locker.unlock();
    config.reject?.(sendOnce);
  }
};

interface AsyncActionTapConfig {
  start?: () => void;
  action: () => Promise<void>;
  reject?: (send: (event: FsmEvent) => void) => void;
  resolve?: (send: (event: FsmEvent) => void) => void;
}

export const asyncActionTap = (config: AsyncActionTapConfig) => (
  locker: Locker,
  send: (event: FsmEvent) => void,
) => {
  const sendOnce = sendOnceWrapper(locker, send);
  config.start?.();
  const target = async () => {
    try {
      await config.action();
      locker.unlock();
      config.resolve?.(sendOnce);
    } catch {
      locker.unlock();
      config.reject?.(sendOnce);
    }
  };
  target();
};
