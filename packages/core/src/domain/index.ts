let id = 0;

interface MachineEvent {}

const createEvent = (): MachineEvent => {
  return {};
};

interface Store {}

type Action<ST extends Store> = (store: ST) => ST;

interface MachineNode<ST extends Store, MN extends string> {
  name: MN;
  leave: Action<ST>[];
  entry: Action<ST>[];
}

interface State<ST extends Store, SN extends string> extends MachineNode<ST, SN> {
  type: 'state';
}

interface Machine<ST extends Store, MN extends string, SN extends string>
  extends MachineNode<ST, MN> {
  type: 'machine';
  getCurrent: () => SN;
  send: (event: MachineEvent) => void;
}

interface Scheme<
  ST extends Store,
  MN extends string,
  SN extends string,
  IN extends SN,
  TN extends SN
> {
  name: MN;
  init: State<ST, IN>;
  events: MachineEvent[];
  states: State<ST, SN>[];
  transitions: Transition<ST, TN>[];
}

type CreateAction<ST extends Store> = (action: Action<ST>) => Action<ST>;

type CreateState<ST extends Store> = <MN extends string>(
  stateScheme: MachineNode<ST, MN>,
) => State<ST, MN>;

type CreateMachine<ST extends Store> = <
  MN extends string,
  SN extends string,
  IN extends SN,
  TN extends SN
>(
  machineScheme: Scheme<ST, MN, SN, IN, TN>,
) => Machine<ST, MN, SN>;

interface StoreContainer<ST extends Store> {
  getStore: () => ST;
  createAction: CreateAction<ST>;
  createState: CreateState<ST>;
  createMachine: CreateMachine<ST>;
}

const createStore = <ST extends Store>(store: ST): StoreContainer<ST> => {
  let currentStore = store;

  const getStore = () => {
    return currentStore;
  };

  const setStore = (nextStore: ST) => {
    currentStore = nextStore;
  };

  const wrapAction = (action: Action<ST>): Action<ST> => {
    return (prevStore: ST) => {
      const nextStore = action(prevStore);
      setStore(nextStore);
      return nextStore;
    };
  };

  const createAction: CreateAction<ST> = (action) => {
    return action;
  };

  const createState: CreateState<ST> = (stateScheme) => {
    return {
      type: 'state',
      name: stateScheme.name,
      leave: stateScheme.leave.map(wrapAction),
      entry: stateScheme.entry.map(wrapAction),
    };
  };

  const createMachine: CreateMachine<ST> = (machineScheme) => {
    let currentState = machineScheme.init;

    const getCurrent = () => {
      return currentState.name;
    };

    return {
      type: 'machine',
      name: machineScheme.name,
      getCurrent,
      send: (event) => {},
      leave: [],
      entry: [],
    };
  };

  return {
    getStore,
    createAction,
    createState,
    createMachine,
  };
};

interface Transition<ST extends Store, SN extends string> {
  from: MachineNode<ST, SN>;
  to: MachineNode<ST, SN>;
}

const createTransition = <ST extends Store, SN extends string>(
  transitionScheme: Transition<ST, SN>,
): Transition<ST, SN> => {
  return {
    from: transitionScheme.from,
    to: transitionScheme.to,
  };
};

/**
 * TEXTURE TEXTURE TEXTURE TEXTURE TEXTURE
 */

const store = createStore({count: 0});

const increment = store.createAction((state) => ({
  count: state.count + 1,
}));

const decrement = store.createAction((state) => ({
  count: state.count - 1,
}));

const state1 = store.createState({
  name: 'state1',
  entry: [],
  leave: [increment],
});

const state2 = store.createState({
  name: 'state2',
  entry: [],
  leave: [decrement],
});

const state3 = store.createState({
  name: 'state3',
  entry: [],
  leave: [],
});

const transition1 = createTransition({
  from: state1,
  to: state3,
});

const tm1 = store.createMachine({
  name: 'testMachine',
  init: state3,
  events: [],
  states: [state1, state3],
  transitions: [transition1],
});

const etm1 = store.createMachine({
  name: 'testMachine',
  init: state3,
  events: [],
  states: [state1, state2],
  transitions: [transition1],
});

const state4 = store.createState({
  name: 'state3',
  entry: [],
  leave: [],
});

const tm2 = store.createMachine({
  name: 'testMachine',
  init: state3,
  events: [],
  states: [state1, state4],
  transitions: [transition1],
});

const test1 = tm2.getCurrent();

const storeData = store.getStore();
