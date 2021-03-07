import {createLocker} from '../common/createLocker';
import {FsmState, FsmEvent} from './scheme';
import {FsmNode} from './parser';

export interface Runner {
  income: (send: (event: FsmEvent) => void) => void;
  outcome: () => void;
  isRunable: () => boolean;
}

export const createRunner = (node: FsmNode<FsmState>): Runner => {
  const locker = createLocker();

  const income = (send: (event: FsmEvent) => void) => {
    if (!node.source.enter) {
      return;
    }
    if (locker.isUnlocked()) {
      locker.lock();
      node.source.enter(locker.unlock, send);
    }
  };

  const outcome = () => {
    if (locker.isUnlocked()) {
      locker.lock();
      node.source.leave?.();
      locker.unlock();
    }
  };

  const isRunable = () => {
    return locker.isUnlocked();
  };

  return {
    income,
    outcome,
    isRunable,
  };
};
