import {createEvent, createScheme, createState} from './scheme';
import {actionTap, asyncActionTap} from './taps';
import {createMachine} from './machine';
import {wait} from '../utils/wait';

test('unschemed transition', () => {
  const ToLoading = createEvent();
  const NotToLoading = createEvent();

  const INIT = createState();
  const LOADING = createState();

  const scheme = createScheme({
    init: INIT,
    transitions: [[INIT, ToLoading, LOADING]],
  });

  const machine = createMachine(scheme);

  expect(machine.current()).toBe(INIT);
  machine.send(NotToLoading);
  expect(machine.current()).toBe(INIT);
  expect(machine.current()).not.toBe(LOADING);
});

test('simple transition', () => {
  const ToLoading = createEvent();

  const INIT = createState();
  const LOADING = createState();

  const scheme = createScheme({
    init: INIT,
    transitions: [[INIT, ToLoading, LOADING]],
  });

  const machine = createMachine(scheme);

  expect(machine.current()).toBe(INIT);
  machine.send(ToLoading);
  expect(machine.current()).not.toBe(INIT);
  expect(machine.current()).toBe(LOADING);
});

test('double transition', () => {
  const ToLoading = createEvent();
  const ToExtra = createEvent();

  const INIT = createState();
  const LOADING = createState();
  const EXTRA = createState();

  const scheme = createScheme({
    init: INIT,
    transitions: [
      [INIT, ToLoading, LOADING],
      [LOADING, ToExtra, EXTRA],
    ],
  });

  const machine = createMachine(scheme);

  expect(machine.current()).toBe(INIT);
  machine.send(ToLoading);
  expect(machine.current()).toBe(LOADING);
  machine.send(ToExtra);
  expect(machine.current()).toBe(EXTRA);
  expect(machine.current()).not.toBe(INIT);
  expect(machine.current()).not.toBe(LOADING);
});

test('state persisting', async () => {
  const ToLoading = createEvent();
  const NotToLoading = createEvent();

  const INIT = createState();
  const LOADING = createState();

  const scheme = createScheme({
    init: INIT,
    transitions: [[INIT, ToLoading, LOADING]],
  });

  const machine = createMachine(scheme);

  expect(machine.current()).toBe(INIT);
  machine.send(NotToLoading);
  await wait(1000);
  expect(machine.current()).toBe(INIT);
  expect(machine.current()).not.toBe(LOADING);
});
