import {createEvent, createScheme, createState} from '../domain/scheme';
import {actionTap, asyncActionTap} from '../domain/taps';
import {createMachine} from '../domain/machine';
import {FsmInstance} from '../domain/instance';
import {wait} from '../utils/wait';

test('enter unlocking', () => {
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

test('send in enter before unlocking', () => {
  const ToLoading = createEvent();
  const ToExtra = createEvent();

  const INIT = createState();
  const LOADING = createState({
    enter: (locker, send) => {
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
});
