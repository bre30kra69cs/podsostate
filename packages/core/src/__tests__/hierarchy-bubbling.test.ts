import {createEvent, createScheme, createState} from '../domain/scheme';
import {createMachine} from '../domain/machine';
import {FsmInstance} from '../domain/instance';

const DEEP_INIT = createState({
  name: 'DEEP_INIT',
});
const DEEP_MIDDLE = createState({
  name: 'DEEP_MIDDLE',
});
const DEEP_END = createState({
  name: 'DEEP_END',
});

const ToDeepMiddle = createEvent();
const ToDeepEnd = createEvent();

const deepScheme = createScheme({
  init: DEEP_INIT,
  transitions: [
    [DEEP_INIT, ToDeepMiddle, DEEP_MIDDLE],
    [DEEP_MIDDLE, ToDeepEnd, DEEP_END],
  ],
});

const LOCAL_INIT = createState({
  name: 'LOCAL_INIT',
});

const ToLocalEnd = createEvent();

const localScheme = createScheme({
  init: LOCAL_INIT,
  transitions: [[LOCAL_INIT, ToLocalEnd, deepScheme]],
});

const GLOBAL_INIT = createState({
  name: 'GLOBAL_INIT',
});
const GLOBAL_END = createState({
  name: 'GLOBAL_END',
});

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

test('top-bottom-top bubbling transitions', () => {
  expect(machine.current()).toEqual(GLOBAL_INIT);
  machine.send(ToGlobalMiddle);
  expect(machine.current()).toEqual(LOCAL_INIT);
  machine.send(ToLocalEnd);
  expect(machine.current()).toEqual(DEEP_INIT);
  machine.send(ToDeepMiddle);
  expect(machine.current()).toEqual(DEEP_MIDDLE);
  machine.send(ToDeepEnd);
  expect(machine.current()).toEqual(DEEP_END);
});
