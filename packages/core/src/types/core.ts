type MachineEvent = string;

type MachineNodeName = string;

interface MachineNode {
  name: MachineNodeName;
}

interface State extends MachineNode {
  type: 'state';
}

interface Machine extends MachineNode {
  type: 'machine';
}

type MachineOrState = State | Machine;

interface Transition {
  from: MachineNodeName;
  to: MachineNodeName;
  event: MachineEvent;
}

export type ValidationRule = (scheme: Scheme) => [boolean, string?];

export interface Scheme {
  name: MachineNodeName;
  init: MachineNodeName;
  events: MachineEvent[];
  nodes: MachineOrState[];
  transitions: Transition[];
  validationRules: ValidationRule[];
}
