interface MachineEvent {}

const createEvent = (): MachineEvent => {
  return {};
};

interface Store {}

type Action<T extends Store> = (store: T) => T;

interface StoreContainer<T extends Store> {
  store: T;
  createAction: (action: Action<T>) => Action<T>;
  createState: <N extends string>(stateScheme: MachineNode<T, N>) => State<T, N>;
}

const createStore = <T extends Store>(store: T): StoreContainer<T> => {
  const createAction = (action: Action<T>) => {
    return action;
  };

  const createState = <N extends string>(stateScheme: MachineNode<T, N>): State<T, N> => {
    return {
      type: 'state',
      name: stateScheme.name,
      leave: stateScheme.leave,
      entry: stateScheme.entry,
    };
  };

  return {
    store,
    createAction,
    createState,
  };
};

interface Transition<T extends Store, N extends string> {
  from: MachineNode<T, N>;
  to: MachineNode<T, N>;
  // effects: Action<T>[];
}

const createTransition = <T extends Store, N extends string>(
  transitionScheme: Transition<T, N>,
): Transition<T, N> => {
  return {
    from: transitionScheme.from,
    to: transitionScheme.to,
  };
};

interface MachineNode<T extends Store, N extends string> {
  name: N;
  leave: Action<T>[];
  entry: Action<T>[];
}

interface State<T extends Store, N extends string> extends MachineNode<T, N> {
  type: 'state';
}

// const createState = <T extends Store, N extends string>(
//   stateScheme: MachineNode<T, N>,
// ): State<T, N> => {
//   return {
//     type: 'state',
//     name: stateScheme.name,
//     leave: stateScheme.leave,
//     entry: stateScheme.entry,
//   };
// };

interface Machine<T extends Store, N extends string, S extends string> extends MachineNode<T, N> {
  type: 'machine';
  getStore: () => T;
  getCurrent: () => S;
  send: (event: MachineEvent) => void;
}

interface Scheme<T extends Store, N extends string, S extends string, IN extends S, TN extends S> {
  name: N;
  init: State<T, IN>;
  store: T;
  events: MachineEvent[];
  states: State<T, S>[];
  transitions: Transition<T, TN>[];
}

const createMachine = <
  T extends Store,
  N extends string,
  S extends string,
  IN extends S,
  TN extends S
>(
  machineScheme: Scheme<T, N, S, IN, TN>,
): Machine<T, N, S> => {
  const store = machineScheme.store;
  let currentState = machineScheme.init;

  const getStore = () => {
    return store;
  };

  const getCurrent = () => {
    return currentState.name;
  };

  // const

  return {
    type: 'machine',
    name: machineScheme.name,
    getStore,
    getCurrent,
    send: (event) => {},
    leave: [],
    entry: [],
  };
};

// Textures

const {store, createAction, createState} = createStore({
  count: 0,
});

const increment = createAction((state) => ({
  count: state.count + 1,
}));

const decrement = createAction((state) => ({
  count: state.count - 1,
}));

const state1 = createState({
  name: 'state1',
  entry: [],
  leave: [increment],
});

const state2 = createState({
  name: 'state2',
  entry: [],
  leave: [decrement],
});

const state3 = createState({
  name: 'state3',
  entry: [],
  leave: [],
});

const transition1 = createTransition({
  from: state1,
  to: state3,
});

const testMachine = createMachine({
  name: 'testMachine',
  init: state3,
  store,
  events: [],
  states: [state1, state3],
  transitions: [transition1],
});

const test = testMachine.getCurrent();

// createMachine({})
