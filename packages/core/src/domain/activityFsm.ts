import {createFsm, Fsm} from './createFsm';

type Activity = () => Promise<void>;

export const activityFsm = (activity: Activity) => {
  const waitFsm = createFsm({
    init: 'start',
    events: ['LOAD', 'END'],
    states: ['start', 'load', 'end'],
    transitions: [
      {
        from: 'start',
        event: 'LOAD',
        to: 'load',
      },
      {
        from: 'load',
        event: 'END',
        to: 'end',
      },
    ],
  });
  const wrappedActivity = () => {
    waitFsm.send('LOAD');
    const wrapped = async () => {
      try {
        await activity();
        waitFsm.send('END');
        flowFsm.send('END');
      } catch {
        waitFsm.send('END');
        flowFsm.send('ERROR');
      }
    };
    wrapped();
  };
  const flowFsm = createFsm({
    init: 'start',
    events: ['LOAD', 'ERROR', 'END'],
    states: ['start', 'load', 'error', 'end'],
    transitions: [
      {
        from: 'start',
        event: 'LOAD',
        to: 'load',
        action: () => wrappedActivity(),
      },
      {
        from: 'load',
        event: 'ERROR',
        to: 'error',
        guard: () => waitFsm.current() === 'end',
      },
      {
        from: 'load',
        event: 'END',
        to: 'end',
        guard: () => waitFsm.current() === 'end',
      },
    ],
  });
  return flowFsm;
};
