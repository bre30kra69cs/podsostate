import {createSilenceEmitter} from '../common/createEmitter';
import {isScheme as isSchemeGuard, RouteTable, FsmNode, FsmNodeTable, ToInit} from './parser';
import {FsmEvent} from './scheme';
import {createContainer} from './container';

const createProcessor = (routeTable: RouteTable) => {
  const container = createContainer(routeTable);
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
