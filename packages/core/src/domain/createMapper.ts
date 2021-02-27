export const createMapper = <K, V>() => {
  const map = new Map<K, V>();

  const unsaveSet = (key: K, value: V) => {
    map.set(key, value);
  };

  const saveSet = (key: K, value: V) => {
    if (!map.has(key)) {
      unsaveSet(key, value);
    }
  };

  const get = (key: K) => {
    return map.get(key);
  };

  const set = (key: K, value: V, strategy: 'unsave' | 'save' = 'unsave') => {
    if (strategy === 'unsave') {
      unsaveSet(key, value);
    } else if (strategy === 'save') {
      saveSet(key, value);
    }
    return get(key) as V;
  };

  const del = (key: K) => {
    map.delete(key);
  };

  return {
    get,
    set,
    del,
  };
};
