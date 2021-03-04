interface Counter<T> {
  count: () => void;
  get: () => T;
}

type CounterParser<T = number> = (current: number) => T;

interface CreateCounter {
  (): Counter<number>;
  <T>(parser?: CounterParser<T>): Counter<T>;
}

export const createCounter: CreateCounter = (parser?: CounterParser) => {
  let current = 0;

  const count = () => {
    current += 1;
  };

  const get = () => {
    return parser ? parser(current) : current;
  };

  return {
    count,
    get,
  };
};
