import {createEvent, createScheme, createState} from '../domain/scheme';
import {createMachine} from '../domain/machine';
import {FsmInstance} from '../domain/instance';

const LOCAL_INIT = createState();
const LOCAL_MIDDLE = createState();
const LOCAL_END = createState();

const ToLocalMiddle = createEvent();
const ToLocalEnd = createEvent();

const localScheme = createScheme({
  init: LOCAL_INIT,
  transitions: [
    [LOCAL_INIT, ToLocalMiddle, LOCAL_MIDDLE],
    [LOCAL_MIDDLE, ToLocalEnd, LOCAL_END],
  ],
});

const GLOBAL_INIT = createState();
const GLOBAL_END = createState();

const ToGlobalMiddle = createEvent();
const ToGlobalEnd = createEvent();

const globalScheme = createScheme({
  init: GLOBAL_INIT,
  transitions: [
    [GLOBAL_INIT, ToGlobalMiddle, localScheme],
    [localScheme, ToGlobalEnd, GLOBAL_END],
  ],
});

let machine: FsmInstance;

beforeEach(() => {
  machine = createMachine(globalScheme);
});

test('hierarchy scheme init', () => {
  expect(machine.current()).toEqual(GLOBAL_INIT);
});

test('hierarchy children-in transition', () => {
  machine.send(ToGlobalMiddle);
  expect(machine.current()).toEqual(LOCAL_INIT);
  machine.send(ToGlobalMiddle);
  expect(machine.current()).toEqual(LOCAL_INIT);
  machine.send(ToLocalMiddle);
  expect(machine.current()).toEqual(LOCAL_MIDDLE);
  machine.send(ToLocalEnd);
  expect(machine.current()).toEqual(LOCAL_END);
});

test('hierarchy children-out transition on init', () => {
  machine.send(ToGlobalMiddle);
  expect(machine.current()).toEqual(LOCAL_INIT);
  machine.send(ToGlobalEnd);
  expect(machine.current()).toEqual(GLOBAL_END);
});

test('hierarchy children-out transition on end', () => {
  machine.send(ToGlobalMiddle);
  expect(machine.current()).toEqual(LOCAL_INIT);
  machine.send(ToLocalMiddle);
  expect(machine.current()).toEqual(LOCAL_MIDDLE);
  machine.send(ToLocalEnd);
  expect(machine.current()).toEqual(LOCAL_END);
  machine.send(ToGlobalMiddle);
  expect(machine.current()).toEqual(LOCAL_END);
  machine.send(ToGlobalEnd);
  expect(machine.current()).toEqual(GLOBAL_END);
});
