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
  const flowFms = createFsm({
    init: 'start',
    events: ['LOAD', 'ERROR', 'END'],
    states: ['start', 'load', 'error', 'end'],
    transitions: [
      {
        from: 'start',
        event: 'LOAD',
        to: 'load',
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

  const wrappedActivity = async () => {
    try {
      waitFsm.send('LOAD');
      await activity();
    } finally {
      waitFsm.send('END');
    }
  };

  const send = (event: string) => {
    if (event === 'start') {
      flowFms.send('LOAD');
    }
  };
};
