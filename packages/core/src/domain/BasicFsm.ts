import {Stack} from './Stack';

type Func = () => void;

interface Action {
  throwStrategy: 'forward' | 'reverse' | 'throw';
  action: Func;
}

interface Transition<TSN extends string> {
  to: TSN;
  invoke: Action;
}

type State<EN extends string, TSN extends string> = {
  [K in EN]: Transition<TSN>;
};

interface FsmScheme<EN extends string, SN extends string, ISN extends SN, TSN extends SN> {
  init: ISN;
  states: {
    [K in SN]: State<EN, TSN>;
  };
}

interface Fsm {}

export class BasicFsm<EN extends string, SN extends string, ISN extends SN, TSN extends SN>
  implements Fsm {
  private scheme: FsmScheme<EN, SN, ISN, TSN>;
  private stack = new Stack<State<EN, TSN>>({
    limit: 2,
  });

  constructor(scheme: FsmScheme<EN, SN, ISN, TSN>) {
    this.scheme = scheme;
    const initState = this.getState(this.scheme.init);
    this.stack.push(initState);
  }

  private getState = (name: SN) => {
    return this.scheme.states[name];
  };

  private getCurrent = () => {
    return this.stack.head() as State<EN, TSN>;
  };

  private getTransition = (event: EN): Transition<TSN> | undefined => {
    const current = this.getCurrent();
    return current[event];
  };

  private forwardAction = (state: State<EN, TSN>, action: Action) => {
    try {
      action.action();
    } finally {
      this.stack.push(state);
    }
  };

  private reverseAction = (action: Action) => {
    try {
      action.action();
    } finally {
    }
  };

  private throwAction = (action: Action) => {
    try {
      action.action();
    } catch (err) {
      throw new Error(err);
    }
  };

  private wrapAction = (action: Action) => {
    return (state: State<EN, TSN>) => {
      switch (action.throwStrategy) {
        case 'forward':
          this.forwardAction(state, action);
        case 'reverse':
          this.reverseAction(action);
        case 'throw':
          this.throwAction(action);
      }
    };
  };

  public send = (event: EN) => {
    const transition = this.getTransition(event);
    if (transition) {
      const wrappedAction = this.wrapAction(transition.invoke);
      const current = this.getCurrent();
      wrappedAction(current);
    }
  };
}

const fsm = new BasicFsm({
  init: 'on',
  states: {
    on: {
      switchOff: {
        to: 'off',
        invoke: {
          throwStrategy: 'forward',
          action: () => {},
        },
      },
    },
    off: {
      switchOn: {
        to: 'on',
        invoke: {
          throwStrategy: 'forward',
          action: () => {},
        },
      },
    },
  },
});

const test = fsm.send('switchOn');
