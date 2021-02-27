import {createActionFsm, Action} from './actionFsm';
import {createActivityFsm, Activity} from './activityFsm';
import {createFsm} from './createFsm';

const createFullReverseTransition = (action: Action, activity: Activity, setTo: () => void) => {
  const actionFsm = createActionFsm(action);
  actionFsm.subscribe((from, event, to) => {
    if (to === 'end') {
      flowFsm.send('ACTIVITY');
    } else if (to === 'error') {
      flowFsm.send('REVERSE');
    }
  });
  const activityFsm = createActivityFsm(activity);
  activityFsm.subscribe((from, event, to) => {
    if (to === 'end') {
      flowFsm.send('END');
    } else if (to === 'error') {
      flowFsm.send('REVERSE');
    }
  });
  const flowFsm = createFsm({
    init: 'init',
    events: ['START', 'ACTION', 'ACTIVITY', 'REVERSE', 'END'],
    states: ['init', 'start', 'action', 'activity', 'reverse', 'end'],
    transitions: [
      {
        from: 'init',
        event: 'START',
        to: 'start',
        actionOrder: 'after',
        action: () => {
          flowFsm.send('ACTION');
        },
      },
      {
        from: 'start',
        event: 'ACTION',
        to: 'action',
        actionOrder: 'after',
        action: () => actionFsm.send('ACTIVE'),
      },
      {
        from: 'action',
        event: 'ACTIVITY',
        to: 'activity',
        actionOrder: 'after',
        guard: () => actionFsm.current() === 'end' || actionFsm.current() === 'error',
        action: () => activityFsm.send('WAIT'),
      },
      {
        from: 'action',
        event: 'REVERSE',
        to: 'reverse',
        guard: () => actionFsm.current() === 'error',
      },
      {
        from: 'activity',
        event: 'END',
        to: 'end',
        actionOrder: 'after',
        action: () => setTo(),
        guard: () => activityFsm.current() === 'end' || activityFsm.current() === 'error',
      },
      {
        from: 'activity',
        event: 'REVERSE',
        to: 'reverse',
        guard: () => activityFsm.current() === 'error',
      },
    ],
  });
  return flowFsm;
};

const createFullForwardTransition = (action: Action, activity: Activity, setTo: () => void) => {
  const actionFsm = createActionFsm(action);
  actionFsm.subscribe((from, event, to) => {
    if (to === 'end') {
      flowFsm.send('ACTIVITY');
    } else if (to === 'error') {
      flowFsm.send('ACTIVITY');
    }
  });
  const activityFsm = createActivityFsm(activity);
  activityFsm.subscribe((from, event, to) => {
    if (to === 'end') {
      flowFsm.send('END');
    } else if (to === 'error') {
      flowFsm.send('END');
    }
  });
  const flowFsm = createFsm({
    init: 'init',
    events: ['START', 'ACTION', 'ACTIVITY', 'REVERSE', 'END'],
    states: ['init', 'start', 'action', 'activity', 'reverse', 'end'],
    transitions: [
      {
        from: 'init',
        event: 'START',
        to: 'start',
        actionOrder: 'after',
        action: () => {
          flowFsm.send('ACTION');
        },
      },
      {
        from: 'start',
        event: 'ACTION',
        to: 'action',
        actionOrder: 'after',
        action: () => actionFsm.send('ACTIVE'),
      },
      {
        from: 'action',
        event: 'ACTIVITY',
        to: 'activity',
        actionOrder: 'after',
        guard: () => actionFsm.current() === 'end' || actionFsm.current() === 'error',
        action: () => activityFsm.send('WAIT'),
      },
      {
        from: 'activity',
        event: 'END',
        to: 'end',
        actionOrder: 'after',
        action: () => setTo(),
        guard: () => activityFsm.current() === 'end' || activityFsm.current() === 'error',
      },
    ],
  });
  return flowFsm;
};

const createActionRevernseTransition = (action: Action, setTo: () => void) => {
  const actionFsm = createActionFsm(action);
  actionFsm.subscribe((from, event, to) => {
    if (to === 'end') {
      flowFsm.send('END');
    } else if (to === 'error') {
      flowFsm.send('REVERSE');
    }
  });
  const flowFsm = createFsm({
    init: 'init',
    events: ['START', 'ACTION', 'ACTIVITY', 'REVERSE', 'END'],
    states: ['init', 'start', 'action', 'activity', 'reverse', 'end'],
    transitions: [
      {
        from: 'init',
        event: 'START',
        to: 'start',
        actionOrder: 'after',
        action: () => {
          flowFsm.send('ACTION');
        },
      },
      {
        from: 'start',
        event: 'ACTION',
        to: 'action',
        actionOrder: 'after',
        action: () => actionFsm.send('ACTIVE'),
      },
      {
        from: 'action',
        event: 'REVERSE',
        to: 'reverse',
        guard: () => actionFsm.current() === 'error',
      },
      {
        from: 'action',
        event: 'END',
        to: 'end',
        actionOrder: 'after',
        action: () => setTo(),
        guard: () => actionFsm.current() === 'end',
      },
    ],
  });
  return flowFsm;
};

const createActionForwardTransition = (action: Action, setTo: () => void) => {
  const actionFsm = createActionFsm(action);
  actionFsm.subscribe((from, event, to) => {
    if (to === 'end') {
      flowFsm.send('END');
    } else if (to === 'error') {
      flowFsm.send('END');
    }
  });
  const flowFsm = createFsm({
    init: 'init',
    events: ['START', 'ACTION', 'ACTIVITY', 'REVERSE', 'END'],
    states: ['init', 'start', 'action', 'activity', 'reverse', 'end'],
    transitions: [
      {
        from: 'init',
        event: 'START',
        to: 'start',
        actionOrder: 'after',
        action: () => {
          flowFsm.send('ACTION');
        },
      },
      {
        from: 'start',
        event: 'ACTION',
        to: 'action',
        actionOrder: 'after',
        action: () => actionFsm.send('ACTIVE'),
      },
      {
        from: 'action',
        event: 'END',
        to: 'end',
        actionOrder: 'after',
        action: () => setTo(),
        guard: () => actionFsm.current() === 'end' || actionFsm.current() === 'error',
      },
    ],
  });
  return flowFsm;
};

const createActivityReverseTransition = (activity: Activity, setTo: () => void) => {
  const activityFsm = createActivityFsm(activity);
  activityFsm.subscribe((from, event, to) => {
    if (to === 'end') {
      flowFsm.send('END');
    } else if (to === 'error') {
      flowFsm.send('REVERSE');
    }
  });
  const flowFsm = createFsm({
    init: 'init',
    events: ['START', 'ACTION', 'ACTIVITY', 'REVERSE', 'END'],
    states: ['init', 'start', 'action', 'activity', 'reverse', 'end'],
    transitions: [
      {
        from: 'init',
        event: 'START',
        to: 'start',
        actionOrder: 'after',
        action: () => {
          flowFsm.send('ACTIVITY');
        },
      },
      {
        from: 'start',
        event: 'ACTIVITY',
        to: 'activity',
        actionOrder: 'after',
        action: () => activityFsm.send('WAIT'),
      },
      {
        from: 'activity',
        event: 'REVERSE',
        to: 'reverse',
        guard: () => activityFsm.current() === 'error',
      },
      {
        from: 'activity',
        event: 'END',
        to: 'end',
        actionOrder: 'after',
        action: () => setTo(),
        guard: () => activityFsm.current() === 'end',
      },
    ],
  });
  return flowFsm;
};

const createActivityForwardTransition = (activity: Activity, setTo: () => void) => {
  const activityFsm = createActivityFsm(activity);
  activityFsm.subscribe((from, event, to) => {
    if (to === 'end') {
      flowFsm.send('END');
    } else if (to === 'error') {
      flowFsm.send('END');
    }
  });
  const flowFsm = createFsm({
    init: 'init',
    events: ['START', 'ACTION', 'ACTIVITY', 'REVERSE', 'END'],
    states: ['init', 'start', 'action', 'activity', 'reverse', 'end'],
    transitions: [
      {
        from: 'init',
        event: 'START',
        to: 'start',
        actionOrder: 'after',
        action: () => {
          flowFsm.send('ACTIVITY');
        },
      },
      {
        from: 'start',
        event: 'ACTIVITY',
        to: 'activity',
        actionOrder: 'after',
        action: () => activityFsm.send('WAIT'),
      },
      {
        from: 'activity',
        event: 'END',
        to: 'end',
        actionOrder: 'after',
        action: () => setTo(),
        guard: () => activityFsm.current() === 'end' || activityFsm.current() === 'error',
      },
    ],
  });
  return flowFsm;
};

const createDefaultTransition = (setTo: () => void) => {
  const flowFsm = createFsm({
    init: 'init',
    events: ['START', 'ACTION', 'ACTIVITY', 'REVERSE', 'END'],
    states: ['init', 'start', 'action', 'activity', 'reverse', 'end'],
    transitions: [
      {
        from: 'init',
        event: 'START',
        to: 'start',
        actionOrder: 'after',
        action: () => {
          flowFsm.send('END');
        },
      },
      {
        from: 'start',
        event: 'END',
        to: 'end',
        actionOrder: 'after',
        action: () => setTo(),
      },
    ],
  });
  return flowFsm;
};

interface TransitScheme {
  strategy?: 'forward' | 'reverse';
  action?: Action;
  activity?: Activity;
  setTo: () => void;
}

export const createTransitionFsm = (scheme: TransitScheme) => {
  if (scheme?.action && scheme?.activity && scheme?.strategy === 'reverse') {
    return createFullReverseTransition(scheme.action, scheme.activity, scheme.setTo);
  } else if (scheme?.action && scheme?.activity) {
    return createFullForwardTransition(scheme.action, scheme.activity, scheme.setTo);
  } else if (scheme?.action && scheme?.strategy === 'reverse') {
    return createActionRevernseTransition(scheme.action, scheme.setTo);
  } else if (scheme?.action) {
    return createActionForwardTransition(scheme.action, scheme.setTo);
  } else if (scheme?.activity && scheme?.strategy === 'reverse') {
    return createActivityReverseTransition(scheme.activity, scheme.setTo);
  } else if (scheme?.activity) {
    return createActivityForwardTransition(scheme.activity, scheme.setTo);
  } else {
    return createDefaultTransition(scheme.setTo);
  }
};
