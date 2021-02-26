type Func = () => void;

interface Action {
  throwStrategy: 'forward' | 'reverse' | 'throw';
  action: Func;
}

interface Transition<S extends string> {
  to: S;
  invoke: Action;
}

type State<S extends string> = {
  [K in string]: Transition<S>;
};

interface FsmScheme<S extends string, P extends string> {
  init: P;
  states: {
    [K in S]: State<P>;
  };
}

const validateScheme = <S extends string, P extends S>(scheme: FsmScheme<S, P>) => {
  return scheme;
};

const test = validateScheme({
  init: 'off',
  states: {
    off: {
      switchOff: {
        to: 'on',
        invoke: {
          throwStrategy: 'forward',
          action: () => {},
        },
      },
    },
    on: {
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
