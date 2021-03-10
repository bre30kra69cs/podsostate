import {createSilenceEmitter, SilenceSubscriber} from '../common/createEmitter';
import {createStack} from '../common/createStack';
import {FsmNode, ToInit} from './parser';
import {FsmEvent, FsmState, FsmSchemeOrState} from './scheme';
import {FsmContariner} from './container';
import {createRunner, Runner} from './runner';

export interface FsmInstance {
  send: (event: FsmEvent) => void;
  current: () => FsmState;
  subscribe: (subscriber: SilenceSubscriber<FsmSchemeOrState>) => void;
  unsubscribe: (subscriber: SilenceSubscriber<FsmSchemeOrState>) => void;
}

export const createInstance = (container: FsmContariner): FsmInstance => {
  const emitter = createSilenceEmitter((node: FsmNode<FsmSchemeOrState>) => node.source);
  const stack = createStack<Runner>({limit: 2});

  const getCurrent = () => {
    return <FsmNode<FsmState>>container.current();
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
      const runner = <Runner>stack.head();
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
      const runner = <Runner>stack.head();
      runner.outcome();
      toState(event);
      const current = getCurrent();
      const currentRunner = createRunner(current);
      stack.push(currentRunner);
      currentRunner.income(send);
    });
  };

  const current = () => {
    return <FsmState>container.current().source;
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
