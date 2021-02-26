type Func = () => void;

interface FsmScheme<E, TE, S, IS, TS> {
  init: IS;
  events: E[];
  states: S[];
  transitions: {
    from: TS;
    event: TE;
    to: TS;
    guard: (current: TS, event: TE) => boolean;
    action: (current: TS, event: TE) => void;
  }[];
}

const createFsm = <E extends string, TE extends E, S extends string, IS extends S, TS extends S>(
  scheme: FsmScheme<E, TE, S, IS, TS>,
) => {
  return scheme;
};

const test = createFsm({
  init: 'on',
  events: ['switchOff', 'switchOn'],
  states: ['on', 'off'],
  transitions: [
    {
      from: 'on',
      event: 'switchOff',
      to: 'off',
      guard: () => true,
      action: () => {},
    },
    {
      from: 'off',
      event: 'switchOn',
      to: 'on',
      guard: () => true,
      action: () => {},
    },
  ],
});
