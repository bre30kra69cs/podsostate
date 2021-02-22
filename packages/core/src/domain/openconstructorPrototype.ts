/**
 * DECLARATIVE PROTOTYPE
 *
 * [+]
 * 1. Open constructor pattern
 * 2. Identities as vars
 * 3. Less code lines
 * 4. Easy to inject scheme rules
 *
 * [-]
 * 1. Event gets as common "string" type
 * 2. Implicit tools impure functions
 */

import {check} from '../utils/check';

type Undefinable<T> = T | undefined;

interface MachineEvent {
  getName: () => string;
}

interface State {
  getName: () => string;
}

interface Transition {
  stateFrom: State;
  stateTo: State;
  event: MachineEvent;
}

interface MachineNode {
  getName: () => string;
  getEvent: (eventName: string) => Undefinable<MachineEvent>;
  getCurrent: () => State;
  send: (event?: MachineEvent) => void;
}

interface MachineTools {
  event: (eventName: string) => MachineEvent;
  state: (stateName: string) => State;
  transition: (stateFrom: State, stateTo: State, event: MachineEvent) => void;
  machine: (intiState: State) => MachineNode;
}

const createEvent = (eventName: string) => {
  const getName = () => {
    return eventName;
  };

  return {getName};
};

const createState = (stateName: string) => {
  const getName = () => {
    return stateName;
  };

  return {getName};
};

const createTransition = (stateFrom: State, stateTo: State, event: MachineEvent): Transition => {
  return {
    stateFrom,
    stateTo,
    event,
  };
};

const createMachine = (
  machineName: string,
  stateConstructor: (tools: MachineTools) => MachineNode,
): MachineNode => {
  check([!machineName, `Machine name is required.`]);

  const events: MachineEvent[] = [];
  const states: State[] = [];
  const transitions: Transition[] = [];

  const event = (eventName: string): MachineEvent => {
    check([
      !!events.find((event) => event.getName() === eventName),
      `Machine "${machineName}" must have only uniq events. Event "${eventName}" is duplicated.`,
    ]);

    const newEvent = createEvent(eventName);
    events.push(newEvent);
    return newEvent;
  };

  const state = (stateName: string): State => {
    check([
      !!states.find((state) => state.getName() === stateName),
      `Machine "${machineName}" must have only uniq states. State "${stateName}" is duplicated.`,
    ]);

    const newState = createState(stateName);
    states.push(newState);
    return newState;
  };

  const transition = (stateFrom: State, stateTo: State, transitionEvent: MachineEvent) => {
    check(
      [
        !states.find((state) => state === stateFrom),
        `State "stateFrom" of transition "${machineName} not created with machine "state" function.`,
      ],
      [
        !states.find((state) => state === stateTo),
        `State "stateTo" of transition "${machineName} not created with machine "state" function.`,
      ],
      [
        !events.find((event) => event === transitionEvent),
        `Event transition of machine "${machineName}" not created with machine "event" function.`,
      ],
      [
        !!transitions
          .filter((transition) => transition.stateFrom === stateFrom)
          .filter((transition) => transition.event === transitionEvent).length,
        `Machine "${machineName}" state "${stateFrom.getName()}" must have
        single transition with event "${transitionEvent.getName()}".`,
      ],
    );

    const newTransition = createTransition(stateFrom, stateTo, transitionEvent);
    transitions.push(newTransition);
  };

  const machine = (intiState: State): MachineNode => {
    check([
      !states.find((state) => state === intiState),
      `Initial state for machine "${machineName}" not created with machine "state" function.`,
    ]);

    let currentState = intiState;

    const send = (targetEvent: Undefinable<MachineEvent>) => {
      if (!targetEvent) {
        return;
      }

      if (!events.find((event) => event === targetEvent)) {
        return;
      }

      const targetTransitions = transitions
        .filter((transition) => transition.event === targetEvent)
        .filter((transition) => transition.stateFrom === currentState);

      if (targetTransitions.length === 0) {
        return;
      }

      check([
        targetTransitions.length > 1,
        `Unexpected transition in machine "${machineName}". By some reason state "${currentState.getName()}"
        has more then one attached transition with event "${targetEvent.getName()}".`,
      ]);

      const targetTransition = targetTransitions[0];
      currentState = targetTransition.stateTo;
    };

    const getName = () => {
      return machineName;
    };

    const getEvent = (eventName: string) => {
      return events.find((event) => event.getName() === eventName);
    };

    const getCurrent = () => {
      return currentState;
    };

    return {
      getName,
      getEvent,
      getCurrent,
      send,
    };
  };

  return stateConstructor({
    event,
    state,
    transition,
    machine,
  });
};

const lightSwitcher = createMachine('lightSwitcher', ({event, state, transition, machine}) => {
  const pressOff = event('pressOff');
  const pressOn = event('pressOn');
  const on = state('on');
  const off = state('off');
  transition(on, off, pressOff);
  transition(off, on, pressOn);
  return machine(off);
});

console.log(lightSwitcher.getCurrent().getName());

lightSwitcher.send(lightSwitcher.getEvent('on'));
console.log(lightSwitcher.getCurrent().getName());

lightSwitcher.send(lightSwitcher.getEvent('what?'));
console.log(lightSwitcher.getCurrent().getName());

lightSwitcher.send(lightSwitcher.getEvent('off'));
console.log(lightSwitcher.getCurrent().getName());
