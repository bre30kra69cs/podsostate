interface Store<T, P> {
  set: (item: T) => void;
  get: () => P;
}

interface CreateStore {
  <T>(): Store<T, T | undefined>;
  <T>(init: T): Store<T, T>;
}

export const createStore: CreateStore = <T>(init?: T) => {
  let current = init;

  const set = (item: T) => {
    current = item;
  };

  const get = () => {
    return current;
  };

  return {
    set,
    get,
  };
};
