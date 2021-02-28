type Emit = (event: string) => void;

type Action = (emit: Emit) => void;

type AsyncAction = (emit: Emit) => Promise<void>;

type Guard = () => boolean;

interface Effect {
  action?: Action;
  asyncAction?: AsyncAction;
}

interface TransitionEffect extends Effect {
  strategy?: 'forward' | 'reverse';
}

interface FsmTransition {
  to: string;
  effect?: TransitionEffect;
  guard?: Guard;
}

export interface Fsm {
  send: (event: string) => void;
  current: () => string;
}

export interface FsmState {
  transitions: Record<string, FsmTransition>;
  enter?: Effect;
  leave?: Effect;
  invoke?: Effect;
}

export type FsmNode = FsmState | FsmScheme | FsmScheme[];

export interface FsmScheme {
  init: string;
  namespace?: string;
  history?: boolean;
  output?: Record<string, FsmTransition>;
  states: Record<string, FsmNode>;
}

export const createScheme = (scheme: FsmScheme) => {
  return scheme;
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
