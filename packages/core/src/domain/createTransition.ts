import {
  connectFsmStates,
  createFsmContainer,
  createFsmEvent,
  createFsmState,
} from './createFsmElements';
import {createHeartRunner, AsyncAction} from './effectRunners';

export const createTransition = (asyncAction: AsyncAction) => {
  const startEvent = createFsmEvent();
  const doneEvent = createFsmEvent();
  const failEvent = createFsmEvent();
  const initState = createFsmState();
  const loadingState = createFsmState({
    heart: createHeartRunner({
      core: asyncAction,
      resolve: () => container.send(doneEvent),
      reject: () => container.send(failEvent),
    }),
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
