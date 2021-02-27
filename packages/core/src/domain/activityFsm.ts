import {createFsm} from './createFsm';

export type Activity = () => Promise<void>;

export const createActivityFsm = (activity: Activity) => {
  const waitFsm = createFsm({
    init: 'start',
    events: ['WAIT', 'END'],
    states: ['start', 'wait', 'end'],
    transitions: [
      {
        from: 'start',
        event: 'WAIT',
        to: 'wait',
      },
      {
        from: 'wait',
        event: 'END',
        to: 'end',
      },
    ],
  });
  const wrappedActivity = () => {
    waitFsm.send('WAIT');
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
    events: ['WAIT', 'ERROR', 'END'],
    states: ['start', 'wait', 'error', 'end'],
    transitions: [
      {
        from: 'start',
        event: 'WAIT',
        to: 'wait',
        actionOrder: 'after',
        action: () => wrappedActivity(),
      },
      {
        from: 'wait',
        event: 'ERROR',
        to: 'error',
        guard: () => waitFsm.current() === 'end',
      },
      {
        from: 'wait',
        event: 'END',
        to: 'end',
        guard: () => waitFsm.current() === 'end',
      },
    ],
  });
  return flowFsm;
};
