import {uniqArray} from '../utils/uniq';

export interface Mapper<K, V> {
  get: (key: K) => V | undefined;
  set: (key: K, value: V, strategy?: 'unsave' | 'save') => V;
  del: (key: K) => void;
  clear: () => void;
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

  const clear = () => {
    map.clear();
  };

  return {
    get,
    set,
    del,
    clear,
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

  const clear = () => {
    mapper.clear();
  };

  return {
    get,
    set,
    del,
    clear,
  };
};

interface ReveerseMapper<K, V> extends Mapper<K, V> {
  getKey: (value: V) => K | undefined;
}

export const createReverseMapper = <K, V>(): ReveerseMapper<K, V> => {
  const keyMapper = createMapper<K, V>();
  const valueMapper = createMapper<V, K>();

  const getKey = (value: V) => {
    return valueMapper.get(value);
  };

  const get = (key: K) => {
    return keyMapper.get(key);
  };

  const set = (key: K, value: V, strategy: 'unsave' | 'save' = 'unsave') => {
    keyMapper.set(key, value, strategy);
    valueMapper.set(value, key, strategy);
    return get(key) as V;
  };

  const del = (key: K) => {
    const value = get(key);
    keyMapper.del(key);
    if (value) {
      valueMapper.del(value);
    }
  };

  const clear = () => {
    keyMapper.clear();
    valueMapper.clear();
  };

  return {
    getKey,
    get,
    set,
    del,
    clear,
  };
};
