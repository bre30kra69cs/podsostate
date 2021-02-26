import {createPrimitiveFsm, PrimitiveFSM, PrimitiveFSMSubscriber} from './primitiveFsm';
import {createOrthogonalPrimitiveFsm} from './primitiveOrthogonalFsm';
import {compareStates} from '../../utils/compare';

type Activity = () => Promise<void>;

export const createActivityFsm = (activity: Activity): PrimitiveFSM => {
  const loadingFsm = createPrimitiveFsm({
    init: 'inited',
    events: ['startLoading', 'finishLoading'],
    states: ['inited', 'started', 'finished'],
    transitions: [
      ['inited', 'startLoading', 'started'],
      ['started', 'finishLoading', 'finished'],
    ],
  });
  const fsm = createOrthogonalPrimitiveFsm([
    loadingFsm,
    createPrimitiveFsm({
      init: 'inited',
      events: ['start', 'active', 'finish', 'throw'],
      states: ['inited', 'started', 'activated', 'finished', 'throwed'],
      transitions: [
        ['inited', 'start', 'started'],
        ['started', 'active', 'activated'],
        [
          'activated',
          'finish',
          'finished',
          () => {
            return compareStates(loadingFsm.getCurrent(), ['finished']);
          },
        ],
        [
          'activated',
          'throw',
          'throwed',
          () => {
            return compareStates(loadingFsm.getCurrent(), ['finished']);
          },
        ],
      ],
    }),
  ]);

  const wrappedActivity = async () => {
    try {
      fsm.send('startLoading');
      await activity();
      fsm.send('finishLoading');
      fsm.send('finished');
    } catch {
      fsm.send('throwed');
    }
  };

  fsm.subscribe((event, [, state]) => {
    console.log(event, state);

    if (state === 'started') {
      fsm.send('active');
    }
    if (state === 'activated') {
      wrappedActivity();
    }
  });

  return fsm;
};
