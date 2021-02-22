interface MachineEvent {}

const createEvent = (): MachineEvent => {
  return {};
};

interface Store {}

type Action<T extends Store> = (store: T) => T;

interface StoreContainer<T extends Store> {
  store: T;
  createAction: (action: Action<T>) => Action<T>;
}

const createStore = <T extends Store>(store: T): StoreContainer<T> => {
  return {
    store,
    createAction: (action) => action,
  };
};

interface Transition<T extends Store> {
  nodeFrom: MachineNode<T>;
  nodeTo: MachineNode<T>;
  effects: Action<T>[];
}

interface MachineNode<T extends Store> {
  leave: Action<T>[];
  entry: Action<T>[];
}

interface Machine<T extends Store> extends MachineNode<T> {
  type: 'machine';
  getStore: () => T;
  send: (event: MachineEvent) => void;
}

interface State<T extends Store> extends MachineNode<T> {
  type: 'state';
}

const createState = <T extends Store>(node: MachineNode<T>): MachineNode<T> => {
  return node;
};

interface Scheme<T extends Store> {
  init: State<T>;
  scheme: T;
  events: MachineEvent[];
  states: State<T>[];
  transitions: Transition<T>[];
}

const createMachine = <T extends Store>(scheme: Scheme<T>) => {};

// Textures

const {store, createAction} = createStore({
  count: 0,
});

const increment = createAction((state) => ({
  count: state.count + 1,
}));

const decrement = createAction((state) => ({
  count: state.count - 1,
}));

const state1 = createState({
  entry: [increment],
  leave: [decrement],
});

// createMachine({})
