import {isNumber} from '../utils/check';
import {mergeConfig} from '../utils/merge';

interface StackConfig {
  limit?: number;
}

export class Stack<T> {
  private stack: T[] = [];
  private config: StackConfig;

  constructor(config?: StackConfig) {
    this.config = mergeConfig(config, {});
  }

  private shift = () => {
    this.stack.shift();
  };

  private isLimitOver = () => {
    return isNumber(this.config?.limit) && this.stack.length > this.config.limit;
  };

  public push = (item: T) => {
    this.stack.push(item);
    if (this.isLimitOver()) {
      this.shift();
    }
  };

  public pop = () => {
    this.stack.pop();
  };

  public head = (): T | undefined => {
    return this.stack[this.stack.length - 1];
  };
}
