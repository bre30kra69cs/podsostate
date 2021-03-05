import {createCounter} from '../common/createCounter';

const counter = createCounter((current) => `${current}`);

export interface FsmEvent {
  serialize: () => string;
}

export const createEvent = (): FsmEvent => {
  const serialize = () => {
    return counter.fire();
  };

  return {
    serialize,
  };
};
