import {createEvent} from '../domain/scheme';

test('create event', () => {
  const event = createEvent();
  expect(event).toEqual({});
});
