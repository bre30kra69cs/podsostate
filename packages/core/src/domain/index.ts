import {check} from '../utils/check';

interface MachineEvent {
  name: string;
}

interface Transition {
  from: string;
  to: string;
  event: MachineEvent;
}

interface MachineNode {
  name: string;
}

interface MachineTools {
  event: (newEvent: MachineEvent) => MachineEvent;
  transition: (newTransition: Transition) => Transition;
}

const createMachine = (
  machineName: string,
  stateConstructor: (tools: MachineTools) => MachineNode,
): MachineNode => {
  check([!machineName, `Machine name is required.`]);

  const events: MachineEvent[] = [];
  const transitions: Transition[] = [];

  const event = (newEvent: MachineEvent): MachineEvent => {
    check([
      !events.find((event) => event.name === newEvent.name),
      `Machine "${machineName}" must have only uniq events. Event "${newEvent.name}" is duplicated.`,
    ]);

    events.push(newEvent);
    return newEvent;
  };

  const transition = (newTransition: Transition): Transition => {
    check([
      !transitions
        .filter((transition) => transition.from === newTransition.from)
        .filter((transition) => transition.event.name === newTransition.event.name).length,
      `Machine "${machineName}" state "${newTransition.from}" must have single transition with event "${newTransition.event.name}".`,
    ]);

    transitions.push(newTransition);
    return newTransition;
  };

  return stateConstructor({
    event,
    transition,
  });
};
