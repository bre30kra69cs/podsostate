type ExternalEvent = string;

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
  event: ExternalEvent;
}

interface InnerEvent {}

interface InnerNodeEvent extends InnerEvent {
  type: 'node';
  stage: 'leave' | 'enter';
  name: MachineNodeName;
}

interface InnerTransitioEvent {
  type: 'transition';
  stage: 'start' | 'active' | 'end';
  from: MachineNodeName;
  to: MachineNodeName;
}

type InnerNodeOrTransitioEvent = InnerNodeEvent | InnerTransitioEvent;

export type ValidationRule = (scheme: Scheme) => [boolean, string?];

export interface Scheme {
  name: MachineNodeName;
  init: MachineNodeName;
  events: ExternalEvent[];
  nodes: MachineOrState[];
  transitions: Transition[];
}

export type Upgrade = (config: MachineFabricConfig) => MachineFabricConfig;

export interface MachineFabricConfig {
  upgrades?: Upgrade[];
  validationRules?: ValidationRule[];
}
