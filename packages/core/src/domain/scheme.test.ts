import {createEvent} from './scheme';

test('create event', () => {
  const event = createEvent();
  expect(event).toEqual({});
});
