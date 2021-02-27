type Emit = (event: string) => void;

type StateAction = (emit: Emit) => void;

type StateActivity = (emit: Emit) => Promise<void>;

type TransitionAction = () => void;

type TransitionActivity = () => Promise<void>;

type Guard = () => boolean;

interface TransitionEffect {
  strategy?: 'forward' | 'reverse';
  action?: TransitionAction;
  activity?: TransitionActivity;
}

interface StateEffect {
  action?: StateAction;
  activity?: StateActivity;
}

interface FsmTransition {
  to: string;
  effect?: TransitionEffect;
  guard?: Guard;
}

export interface FsmState {
  transitions: Record<string, FsmTransition>;
  enter?: StateEffect;
  leave?: StateEffect;
  invoke?: StateEffect;
}

export type FsmNode = FsmState | FsmScheme | FsmScheme[];

export interface FsmScheme {
  init: string;
  namespace?: string;
  history?: boolean;
  output?: Record<string, FsmTransition>;
  states: Record<string, FsmNode>;
}

export const createScheme = (scheme: FsmScheme) => scheme;

export const isStateScheme = (value?: any): value is FsmState => {
  return !!value?.transitions;
};

export const isMachineScheme = (value?: any): value is FsmScheme => {
  return !!value?.states;
};

export const isParallelScheme = (value?: any): value is FsmScheme[] => {
  return Array.isArray(value);
};

const testScheme = createScheme({
  init: 'test1',
  states: {
    tetete: createScheme({
      init: 'tdsa',
      output: {
        on: {
          to: 'paralell',
        },
      },
      states: {
        tete1: {
          transitions: {
            off: {
              to: 'test1',
              effect: {
                action: () => {},
              },
            },
          },
        },
      },
    }),
    test1: {
      init: 'test1_1',
      states: {
        unparalel: {
          transitions: {
            sss: {
              to: 'rwrw',
            },
          },
        },
        paralell: [
          {
            init: 't1',
            states: {
              t1: {
                transitions: {
                  tt: {
                    to: 'unparalel',
                    effect: {
                      action: () => {},
                    },
                  },
                },
              },
            },
          },
          {
            init: 't2',
            states: {
              t2: {
                transitions: {
                  tt: {
                    to: 'paralel',
                    effect: {
                      action: () => {},
                    },
                  },
                },
              },
            },
          },
        ],
      },
    },
  },
});
