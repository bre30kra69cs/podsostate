export const createStore = <T>(init?: T) => {
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
