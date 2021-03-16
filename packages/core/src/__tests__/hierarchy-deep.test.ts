import {createEvent, createScheme, createState} from '../domain/scheme';
import {createMachine} from '../domain/machine';
import {FsmInstance} from '../domain/instance';

const DEEP_INIT = createState();
const DEEP_MIDDLE = createState();
const DEEP_END = createState();

const ToDeepMiddle = createEvent();
const ToDeepEnd = createEvent();

const deepScheme = createScheme({
  init: DEEP_INIT,
  transitions: [
    [DEEP_INIT, ToDeepMiddle, DEEP_MIDDLE],
    [DEEP_MIDDLE, ToDeepEnd, DEEP_END],
  ],
});

const LOCAL_INIT = createState();
const LOCAL_END = createState();

const ToLocalMiddle = createEvent();
const ToLocalEnd = createEvent();

const localScheme = createScheme({
  init: LOCAL_INIT,
  transitions: [
    [LOCAL_INIT, ToLocalMiddle, deepScheme],
    [deepScheme, ToLocalEnd, LOCAL_END],
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

test('to deep init transitions', () => {
  expect(machine.current()).toEqual(GLOBAL_INIT);
  machine.send(ToGlobalMiddle);
  expect(machine.current()).toEqual(LOCAL_INIT);
  machine.send(ToLocalMiddle);
  expect(machine.current()).toEqual(DEEP_INIT);
});

test('top-bottom-top transitions', () => {
  expect(machine.current()).toEqual(GLOBAL_INIT);
  machine.send(ToGlobalMiddle);
  expect(machine.current()).toEqual(LOCAL_INIT);
  machine.send(ToLocalMiddle);
  expect(machine.current()).toEqual(DEEP_INIT);
  machine.send(ToDeepMiddle);
  expect(machine.current()).toEqual(DEEP_MIDDLE);
  machine.send(ToDeepEnd);
  expect(machine.current()).toEqual(DEEP_END);
  machine.send(ToLocalEnd);
  expect(machine.current()).toEqual(LOCAL_END);
  machine.send(ToGlobalEnd);
  expect(machine.current()).toEqual(GLOBAL_END);
});

test('top-bottom-top cutted transitions', () => {
  expect(machine.current()).toEqual(GLOBAL_INIT);
  machine.send(ToGlobalMiddle);
  expect(machine.current()).toEqual(LOCAL_INIT);
  machine.send(ToLocalMiddle);
  expect(machine.current()).toEqual(DEEP_INIT);
  machine.send(ToDeepMiddle);
  expect(machine.current()).toEqual(DEEP_MIDDLE);
  machine.send(ToLocalEnd);
  expect(machine.current()).toEqual(LOCAL_END);
  machine.send(ToGlobalEnd);
  expect(machine.current()).toEqual(GLOBAL_END);
});
