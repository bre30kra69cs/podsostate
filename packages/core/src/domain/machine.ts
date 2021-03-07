import {createSilenceEmitter} from '../common/createEmitter';
import {createStack} from '../common/createStack';
import {parseRouteTable, FsmNode, ToInit} from './parser';
import {FsmEvent, FsmScheme, FsmState} from './scheme';
import {createContainer, FsmContariner} from './container';
import {createRunner, Runner} from './runner';

export const createInstance = (container: FsmContariner) => {
  const emitter = createSilenceEmitter<FsmNode>();
  const stack = createStack<Runner>({limit: 2});

  const getCurrent = () => {
    return container.current() as FsmNode<FsmState>;
  };

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

  const sendGuard = (event: FsmEvent, payload: () => void) => {
    if (container.isExist(event)) {
      const runner = stack.head() as Runner;
      if (runner.isRunable()) {
        payload();
      }
    }
  };

  const toState = (event: FsmEvent) => {
    next(event);
    if (container.isLifted()) {
      next(event);
    }
    toInit();
  };

  const send = (event: FsmEvent) => {
    sendGuard(event, () => {
      const runner = stack.head() as Runner;
      runner.outcome();
      toState(event);
      const current = getCurrent();
      const currentRunner = createRunner(current);
      stack.push(currentRunner);
      currentRunner.income(send);
    });
  };

  const current = () => {
    return container.current();
  };

  const init = () => {
    toInit();
    const current = getCurrent();
    const runner = createRunner(current);
    stack.push(runner);
  };

  init();

  return {
    send,
    current,
    subscribe: emitter.subscribe,
    unsubscribe: emitter.unsubscribe,
  };
};

export const createMachine = (scheme: FsmScheme) => {
  const routeTable = parseRouteTable(scheme);
  const container = createContainer(routeTable);
  const instance = createInstance(container);
  return instance;
};
