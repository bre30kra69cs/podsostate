import {
  SchemeBuilder,
  FsmSchemeElement,
  FsmUsedElement,
  FsmStateElement,
  isState,
  getInit,
  FsmContext,
} from './createMachine';
import {FsmEvent} from './createEvent';
import {FsmCoord} from './createCoord';
import {createLocker} from '../common/createLocker';
import {createMapper} from '../common/createMapper';

export interface StateConfig {
  coord: FsmCoord;
  guard?: () => boolean;
  enter?: () => void;
  leave?: () => void;
  heart?: (unlock: () => void, send: (event: FsmEvent) => void) => void;
  transitions?: [FsmEvent, FsmCoord][];
}

export const createStateElement = (context: FsmContext, config: StateConfig) => {
  const locker = createLocker();
  const mapper = createMapper<FsmEvent, FsmCoord>();
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

  const isPassGuard = () => {
    return config.guard ? config.guard() : true;
  };

  const send = (event: FsmEvent) => {
    const coord = mapper.get(event);
    if (coord) {
      const source = context.getPeer(state, coord);
      if (source && locker.isUnlocked() && isPassGuard()) {
        outcome();
        if (isState(source)) {
          context.setCurrent(source);
          source.income();
        } else {
          const sourceInit = getInit(source);
          context.setCurrent(sourceInit);
          sourceInit.income();
        }
      }
    }
  };

  const init = () => {
    config.transitions?.forEach(([event, coord]) => {
      mapper.set(event, coord);
    });
  };

  init();

  state.type = 'state';
  state.coord = config.coord;
  state.send = send;
  state.income = income;
  return state;
};

export interface SchemeConfig {
  init: FsmCoord;
  states?: SchemeBuilder[];
}

export const createSchemeElement = (context: FsmContext, config: SchemeConfig) => {
  const mapper = createMapper<string, FsmUsedElement>();
  const scheme = {} as FsmSchemeElement;

  const getInit = () => {
    const init = config.init;
    return mapper.get(init.serialize()) as FsmUsedElement;
  };

  const init = () => {
    config.states?.forEach((builder) => {
      const element = builder(context, scheme);
      mapper.set(element.coord.serialize(), element);
    });
  };

  const getChildren = (coor: FsmCoord) => {
    return mapper.get(coor.serialize());
  };

  init();

  scheme.type = 'scheme';
  scheme.getInit = getInit;
  scheme.getChildren = getChildren;
  return scheme;
};
