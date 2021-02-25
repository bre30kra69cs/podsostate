import {createEmitter} from './emitter';
import {PrimitiveFSM, PrimitiveFSMSubscriber} from './primitiveFsm';

const EVENT = 'EVENT_ORTHO';

export const createOrthogonalPrimitiveFsm = (fsms: PrimitiveFSM[]): PrimitiveFSM => {
  const emitter = createEmitter<string[]>();

  const innerSubscriber = () => {
    const value = fsms.map((fsm) => fsm.getCurrent()).flat();
    console.log('innerSubscriber', EVENT, value);
    emitter.emit(EVENT, value);
  };

  fsms.forEach((fsm) => {
    fsm.subscribe(innerSubscriber);
  });

  const getCurrent = () => {
    return fsms.map((fsm) => fsm.getCurrent()).flat();
  };

  const send = (event: string) => {
    fsms.forEach((fsm) => fsm.send(event));
  };

  const subscribe = (subscriber: PrimitiveFSMSubscriber) => {
    emitter.subscribe(EVENT, subscriber);
  };

  const unsubscribe = (subscriber: PrimitiveFSMSubscriber) => {
    emitter.unsubscribe(EVENT, subscriber);
  };

  return {
    send,
    subscribe,
    unsubscribe,
    getCurrent,
  };
};
