interface Scheme<T> {
  names: T[];
  events: T[];
}

const test = <T extends string>(scheme: Scheme<T>) => {
  return scheme.names;
};

const t = test({
  names: ['1', '2'],
  events: ['3', '4'],
});
