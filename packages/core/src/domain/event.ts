import {createCounter} from '../common/createCounter';

const counter = createCounter((current) => `${current}`);

export interface FsmEvent {
  serialize: () => string;
}

export const createEvent = (): FsmEvent => {
  const serialize = () => {
    counter.count();
    return counter.get();
  };

  return {
    serialize,
  };
};
