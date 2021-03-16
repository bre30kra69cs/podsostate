import {createEvent, createScheme, createState} from '../domain/scheme';
import {createMachine} from '../domain/machine';

test('unlocking status', () => {
  const ToLoading = createEvent();

  const action = jest.fn();

  const INIT = createState();
  const LOADING = createState({
    enter: (locker) => {
      action(locker.isUnlocked());
      locker.unlock();
      action(locker.isUnlocked());
    },
  });

  const scheme = createScheme({
    init: INIT,
    transitions: [[INIT, ToLoading, LOADING]],
  });

  const machine = createMachine(scheme);

  machine.send(ToLoading);

  expect(action.mock.calls?.[0]?.[0]).toEqual(false);
  expect(action.mock.calls?.[1]?.[0]).toEqual(true);
});

test('locked send', () => {
  const ToLoading = createEvent();
  const ToExtra = createEvent();

  const INIT = createState();
  const LOADING = createState({
    enter: (_, send) => {
      send(ToExtra);
    },
  });
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
});

test('unlocked send', () => {
  const ToLoading = createEvent();
  const ToExtra = createEvent();

  const INIT = createState();
  const LOADING = createState({
    enter: (lcker, send) => {
      lcker.unlock();
      send(ToExtra);
    },
  });
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
  expect(machine.current()).toBe(EXTRA);
});

test('double sending', () => {
  const ToLoading = createEvent();
  const ToExtra = createEvent();
  const ToEnd = createEvent();

  const INIT = createState();
  const LOADING = createState({
    enter: (lcker, send) => {
      lcker.unlock();
      send(ToExtra);
      send(ToEnd);
    },
  });
  const EXTRA = createState();
  const END = createState();

  const scheme = createScheme({
    init: INIT,
    transitions: [
      [INIT, ToLoading, LOADING],
      [LOADING, ToExtra, EXTRA],
      [EXTRA, ToEnd, END],
    ],
  });

  const machine = createMachine(scheme);

  expect(machine.current()).toBe(INIT);
  machine.send(ToLoading);
  expect(machine.current()).toBe(END);
});

test('leaving', () => {
  const ToLoading = createEvent();
  const ToExtra = createEvent();

  const action = jest.fn();

  const INIT = createState({
    leave: () => {
      action(true);
    },
  });
  const LOADING = createState({
    enter: (locker, send) => {
      locker.unlock();
      send(ToExtra);
    },
    leave: () => {
      action(true);
    },
  });
  const EXTRA = createState();

  const scheme = createScheme({
    init: INIT,
    transitions: [
      [INIT, ToLoading, LOADING],
      [LOADING, ToExtra, EXTRA],
    ],
  });

  const machine = createMachine(scheme);

  machine.send(ToLoading);

  expect(action.mock.calls?.[0]?.[0]).toEqual(true);
  expect(action.mock.calls?.[1]?.[0]).toEqual(true);
});
