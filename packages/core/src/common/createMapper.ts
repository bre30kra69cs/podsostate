import {uniqArray} from '../utils/uniq';

export interface Mapper<K, V> {
  get: (key: K) => V | undefined;
  set: (key: K, value: V, strategy?: 'unsave' | 'save') => V;
  del: (key: K) => void;
}

export const createMapper = <K, V>(): Mapper<K, V> => {
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
    }
    if (strategy === 'save') {
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

export const createArrayMapper = <K, V>(): Mapper<K, V[]> => {
  const mapper = createMapper<K, V[]>();

  const unsaveSet = (key: K, value: V[]) => {
    const valueArray = get(key);
    if (valueArray) {
      const nextValue = valueArray.concat(value);
      mapper.set(key, nextValue, 'unsave');
    } else {
      mapper.set(key, value);
    }
  };

  const saveSet = (key: K, value: V[]) => {
    const valueArray = get(key);
    if (valueArray) {
      const nextValue = uniqArray(valueArray, value);
      mapper.set(key, nextValue, 'unsave');
    } else {
      mapper.set(key, value);
    }
  };

  const get = (key: K) => {
    return mapper.get(key);
  };

  const set = (key: K, value: V[], strategy: 'unsave' | 'save' = 'unsave') => {
    if (strategy === 'unsave') {
      unsaveSet(key, value);
    }
    if (strategy === 'save') {
      saveSet(key, value);
    }
    return get(key) as V[];
  };

  const del = (key: K) => {
    mapper.del(key);
  };

  return {
    get,
    set,
    del,
  };
};
