import {createCounter} from '../common/createCounter';

const counter = createCounter((current) => `key${current}`);

export interface FsmKey {
  serialize: () => string;
}

export const createKey = (): FsmKey => {
  const key = counter.fire();

  const serialize = () => {
    return key;
  };

  return {
    serialize,
  };
};
