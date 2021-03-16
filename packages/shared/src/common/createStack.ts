import {isNumber} from '../utils/typers';
import {mergeConfig} from '../utils/merge';

interface StackConfig {
  limit?: number;
}

export const createStack = <T>(sourceConfig?: StackConfig) => {
  const config = mergeConfig(sourceConfig, {});
  let stack: T[] = [];

  const isLimitOver = () => {
    return isNumber(config?.limit) && stack.length > config.limit;
  };

  const shift = () => {
    stack.shift();
  };

  const push = (item: T) => {
    stack.push(item);
    if (isLimitOver()) {
      shift();
    }
  };

  const pop = () => {
    stack.pop();
  };

  const head = (): T | undefined => {
    return stack[stack.length - 1];
  };

  const reset = () => {
    stack = [];
  };

  const get = (deep: number): T | undefined => {
    const index = stack.length - 1 - deep;
    if (index >= 0) {
      return stack[index];
    }
  };

  return {
    push,
    pop,
    head,
    reset,
    get,
  };
};

export const createPushStack = <T>(sourceConfig?: StackConfig) => {
  const stack = createStack<T>(sourceConfig);

  return {
    push: stack.push,
    head: stack.head,
    get: stack.get,
  };
};
