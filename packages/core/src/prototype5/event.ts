import {createCounter} from '../common/createCounter';

const counter = createCounter((current) => `event${current}`);

export interface FsmEvent {
  serialize: () => string;
}

export const createEvent = (): FsmEvent => {
  const key = counter.fire();

  const serialize = () => {
    return key;
  };

  return {
    serialize,
  };
};
