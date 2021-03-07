import {createSilenceEmitter} from '../common/createEmitter';
import {FsmNode, ToInit} from './parser';
import {FsmEvent} from './scheme';
import {FsmContariner} from './container';

export const createProcessor = (container: FsmContariner) => {
  const emitter = createSilenceEmitter<FsmNode>();

  const next = (event: FsmEvent) => {
    const current = container.next(event);
    if (container.isChanged()) {
      emitter.emit(current);
    }
  };

  const toInit = () => {
    if (container.isScheme()) {
      next(ToInit);
      if (container.isChanged()) {
        toInit();
      }
    }
  };

  const send = (event: FsmEvent) => {
    next(event);
    if (container.isLifted()) {
      next(event);
    }
    toInit();
  };

  const current = () => {
    return container.current();
  };

  const init = () => {
    toInit();
  };

  init();

  return {
    send,
    current,
    subscribe: emitter.subscribe,
    unsubscribe: emitter.unsubscribe,
  };
};
