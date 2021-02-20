import {createEmitter} from './emitter';

import {compose} from '../utils/compose';
import {check} from '../utils/check';

enum StepType {
  All = 'All',
}

interface Scheme {
  name: string;
  init: string;
  states: Record<string, any>;
}

interface Step {
  type: string;
  payload: any;
}

type Subscriber = (step: Step) => void;

type Machine = {
  subscribe: (stepType: StepType, subscriber: Subscriber) => void;
};

type Eventz = any;

type Middleware = (eventer: Eventz) => Eventz;

interface MachineFactoryConfig {
  middlewares: Middleware[];
}

const prapereMachineFactory = (middleware: Middleware) => {
  return <T extends Scheme>(scheme: T): Machine => {
    const {name, init, states} = scheme;

    const initState = states[init];

    check(
      [!init, `Not defined "init" value in "${name}" machine.`],
      [!initState, `No state with "init" name in "${name}" machine.`],
    );

    const listnerEmitter = createEmitter();

    const subscribe = (stepType: StepType, subscriber: Subscriber) => {
      listnerEmitter.subscribe(stepType, () => subscriber({} as any));
    };

    return {
      subscribe,
    };
  };
};

const initMachineCreator = (userConfig: Partial<MachineFactoryConfig> = {}) => {
  const CONFIG: MachineFactoryConfig = {
    middlewares: [],
  };

  const {middlewares} = {
    ...CONFIG,
    ...userConfig,
  };

  const middleware = compose(...middlewares);

  const createMachine = prapereMachineFactory(middleware);

  return {
    createMachine,
  };
};

const {createMachine} = initMachineCreator();

const testMchine = createMachine({
  name: 'test',
  init: 'test',
  states: {
    test: 1,
  },
});
