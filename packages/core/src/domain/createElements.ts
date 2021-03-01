import {FsmContext, FsmElement, Send} from './createMachine';
import {FsmEvent} from './createEvent';
import {FsmCoord} from './createAlias';
import {createLocker} from '../common/createLocker';

type Guard = () => boolean;

type Action = () => void;

type HeartAction = (unlock: Action, send: Send) => void;

interface StateConfig {
  coord: FsmCoord;
  guard?: Guard;
  enter?: Action;
  leave?: Action;
  heart?: HeartAction;
  transitions?: [FsmEvent, FsmCoord][];
}

interface FsmState extends FsmElement {
  type: 'state';
  send: Send;
}

const createStateElement = (context: FsmContext, config: StateConfig) => {
  const locker = createLocker();

  const income = () => {
    if (locker.isUnlocked()) {
      locker.lock();
      config.enter?.();
      if (config.heart) {
        config.heart?.(locker.unlock, context.send);
      } else {
        locker.unlock();
      }
    }
  };

  const outcome = () => {
    locker.lock();
    config.leave?.();
    locker.unlock();
  };
};
