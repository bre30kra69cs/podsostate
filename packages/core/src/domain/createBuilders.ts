import {FsmStateElement, isState} from './createMachine';
import {FsmEvent} from './createEvent';
import {FsmCoord} from './createAlias';
import {createLocker} from '../common/createLocker';
import {createMapper} from '../common/createMapper';
import {SchemeBuilder} from './createMachine';

interface StateConfig {
  coord: FsmCoord;
  guard?: () => boolean;
  enter?: () => void;
  leave?: () => void;
  heart?: (unlock: () => void, send: (event: FsmEvent) => void) => void;
  transitions?: [FsmEvent, FsmCoord][];
}

export const createStateBuilder = (config: StateConfig): SchemeBuilder => {
  return (context, root) => {
    const locker = createLocker();
    const transitionMapper = createMapper<FsmEvent, FsmCoord>();
    const state = {} as FsmStateElement;

    const income = () => {
      locker.lock();
      config.enter?.();
      if (config.heart) {
        config.heart?.(locker.unlock, context.send);
      } else {
        locker.unlock();
      }
    };

    const outcome = () => {
      locker.lock();
      config.leave?.();
      locker.unlock();
    };

    const send = (event: FsmEvent) => {
      const coord = transitionMapper.get(event);
      if (coord) {
        const source = context.getPeer(state, coord);
        if (source && locker.isUnlocked()) {
          outcome();
          if (isState(source)) {
            context.setCurrent(source);
            source.income();
          } else {
            const sourceInit = source.getInit();
            context.setCurrent(sourceInit);
            sourceInit.income();
          }
        }
      }
    };

    const init = () => {
      config.transitions?.forEach(([event, coord]) => {
        transitionMapper.set(event, coord);
      });
    };

    init();

    state.type = 'state';
    state.coord = config.coord;
    state.send = send;
    state.income = income;
    context.registry(state, root);
  };
};
