import {createCounter} from '../common/createCounter';

const counter = createCounter((current) => `${current}`);

export interface FsmKey {
  serialize: () => string;
}

export const createKey = (): FsmKey => {
  const serialize = () => {
    return counter.fire();
  };

  return {
    serialize,
  };
};
