import {createLocker, Locker} from '../common/createLocker';
import {sendOnceWrapper} from '../domain/taps';
import {createEvent} from '../domain/scheme';

let locker: Locker;

beforeEach(() => {
  locker = createLocker();
});

test('send once', () => {
  const send = jest.fn();
  const sendOnce = sendOnceWrapper(locker, send);
  const ToTest = createEvent();
  sendOnce(ToTest);
  expect(send.mock.calls?.[0]?.[0]).toEqual({});
  sendOnce(ToTest);
  expect(send.mock.calls?.[1]?.[0]).toBeUndefined();
});
