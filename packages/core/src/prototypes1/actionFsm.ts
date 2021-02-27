import {createFsm} from './createFsm';

export type Action = () => void;

export const createActionFsm = (action: Action) => {
  const wrappedAction = () => {
    try {
      action();
      flowFsm.send('END');
    } catch {
      flowFsm.send('ERROR');
    }
  };
  const flowFsm = createFsm({
    init: 'start',
    events: ['ACTIVE', 'ERROR', 'END'],
    states: ['start', 'active', 'error', 'end'],
    transitions: [
      {
        from: 'start',
        event: 'ACTIVE',
        to: 'active',
        actionOrder: 'after',
        action: () => wrappedAction(),
      },
      {
        from: 'active',
        event: 'ERROR',
        to: 'error',
      },
      {
        from: 'active',
        event: 'END',
        to: 'end',
      },
    ],
  });
  return flowFsm;
};
