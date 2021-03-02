export const createStore = <T>(init: T) => {
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

export const createSetStore = <T>(init: T) => {
  const store = createStore(init);

  return {
    get: store.get,
  };
};
