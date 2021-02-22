let id = 0;

interface MachineEvent<T extends string> {
  name: T;
}

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

interface Machine<ST extends Store, MN extends string, SN extends string, EN extends string>
  extends MachineNode<ST, MN> {
  type: 'machine';
  getCurrent: () => SN;
  send: (event: MachineEvent<EN>) => void;
}

interface Transition<ST extends Store, SN extends string, EN extends string> {
  from: MachineNode<ST, SN>;
  to: MachineNode<ST, SN>;
  event: MachineEvent<EN>;
}

interface Scheme<
  ST extends Store,
  MN extends string,
  SN extends string,
  EN extends string,
  IN extends SN,
  TN extends SN,
  TEN extends EN
> {
  name: MN;
  init: State<ST, IN>;
  events: MachineEvent<EN>[];
  states: State<ST, SN>[];
  transitions: Transition<ST, TN, TEN>[];
}

type CreateAction<ST extends Store> = (action: Action<ST>) => Action<ST>;

type CreateState<ST extends Store> = <MN extends string>(
  stateScheme: MachineNode<ST, MN>,
) => State<ST, MN>;

type CreateTransition<ST extends Store> = <SN extends string, EN extends string>(
  transitionScheme: Transition<ST, SN, EN>,
) => Transition<ST, SN, EN>;

type CreateMachine<ST extends Store> = <
  MN extends string,
  SN extends string,
  EN extends string,
  IN extends SN,
  TN extends SN,
  TEN extends EN
>(
  machineScheme: Scheme<ST, MN, SN, EN, IN, TN, TEN>,
) => Machine<ST, MN, SN, TEN>;

type CreateEvent = <EN extends string>(event: MachineEvent<EN>) => MachineEvent<EN>;

interface StoreContainer<ST extends Store> {
  getStore: () => ST;
  createEvent: CreateEvent;
  createAction: CreateAction<ST>;
  createState: CreateState<ST>;
  createTransition: CreateTransition<ST>;
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

  const createEvent: CreateEvent = (eventScheme) => {
    return eventScheme;
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

  const createTransition: CreateTransition<ST> = (transitionScheme) => {
    return {
      from: transitionScheme.from,
      to: transitionScheme.to,
      event: transitionScheme.event,
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
    createEvent,
    createAction,
    createState,
    createTransition,
    createMachine,
  };
};

/**
 * TEXTURE TEXTURE TEXTURE TEXTURE TEXTURE
 */

const store = createStore({count: 0});

const event1 = store.createEvent({
  name: 'event1',
});

const event2 = store.createEvent({
  name: 'event2',
});

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

const transition1 = store.createTransition({
  from: state1,
  to: state3,
  event: event1,
});

const transition2 = store.createTransition({
  from: state3,
  to: state1,
  event: event2,
});

const etm0 = store.createMachine({
  name: 'testMachine',
  init: state3,
  events: [event2],
  states: [state1, state3],
  transitions: [transition1], // event1 is not in machine scheme and we have error
});

const etm1 = store.createMachine({
  name: 'testMachine',
  init: state2,
  events: [],
  states: [state1, state2],
  transitions: [transition1], // state3 is not in machine scheme and we have error
});

const etm2 = store.createMachine({
  name: 'testMachine',
  init: state3, // state3 is not in machine scheme and we have error
  events: [],
  states: [state1, state2],
  transitions: [],
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
