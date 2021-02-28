import {
  connectFsmStates,
  createFsmContainer,
  createFsmEvent,
  createFsmState,
  FsmEvent,
  FsmContainer,
} from './createFsmElements';
import {AsyncAction} from './effectRunners';

export interface Transition {
  startEvent: FsmEvent;
  container: FsmContainer;
}

export const createTransition = (asyncAction: AsyncAction): Transition => {
  const startEvent = createFsmEvent();
  const doneEvent = createFsmEvent();
  const failEvent = createFsmEvent();
  const initState = createFsmState();
  const loadingState = createFsmState({
    heart: asyncAction,
    resolve: () => container.send(doneEvent),
    reject: () => container.send(failEvent),
  });
  const doneState = createFsmState();
  const failState = createFsmState();
  connectFsmStates(initState, startEvent, loadingState);
  connectFsmStates(loadingState, doneEvent, doneState);
  connectFsmStates(loadingState, failEvent, failState);
  const container = createFsmContainer(initState);
  return {
    startEvent,
    container,
  };
};
