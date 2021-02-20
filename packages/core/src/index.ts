type Undefinable<T> = T | undefined;

interface Transitor {
  from: string;
  to: string;
}

type Transition = () => void;

interface StateEvent {
  id: number;
}

interface Action {
  state: State;
  transition: Transition;
}

interface MachineNode {
  inputs: StateEvent[];
  outputs: Action[];
}

type State = string;

interface Scheme {
  initState: State;
  nodes: Record<State, MachineNode>;
}

interface Machine {
  getState: () => State;
  send: (nextState: State) => void;
}

interface MachineNodeContainer {
  tryOutputTransition: (currentState: State, nextState: State) => State;
}

const tryTransit = (transition: () => void): Undefinable<Error> => {
  try {
    transition();
  } catch (err) {
    return err;
  }
};

const createMachine = (scheme: Scheme): Machine => {
  let currentState = scheme.initState;

  const createNodeContainer = (node: MachineNode): MachineNodeContainer => {
    const tryOutputTransition = (currentState: State, nextState: State): State => {
      const output = node.outputs.find((output) => output.state === nextState);
      const err = tryTransit(() => output?.transition());
      return err ? currentState : nextState;
    };

    return {
      tryOutputTransition,
    };
  };

  const getCurrentNode = () => {
    return scheme.nodes[currentState];
  };

  const getState = () => {
    return currentState;
  };

  const send = (nextState: State) => {
    const node = getCurrentNode();
    const nodeContainer = createNodeContainer(node);
    const resultState = nodeContainer.tryOutputTransition(currentState, nextState);
    currentState = resultState;
  };

  return {
    getState,
    send,
  };
};

const createEvent = () => {
  const id = Math.round(Math.random() * 1000);

  return {
    id,
  };
};

const event1 = createEvent();

const event2 = createEvent();

const testScheme: Scheme = {
  initState: 'test1',
  nodes: {
    test1: {
      inputs: [event1],
      outputs: [
        {
          state: 'test2',
          transition: () => {
            console.log('test1->test2');
          },
        },
      ],
    },
    test2: {
      inputs: [event2],
      outputs: [
        {
          state: 'test1',
          transition: () => {
            console.log('test2->test1');
          },
        },
      ],
    },
  },
};

const testMachine = createMachine(testScheme);

testMachine.send('test1');
