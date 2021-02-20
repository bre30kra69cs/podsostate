export type Tap = <T>(arg: T) => T;

export const tap: Tap = (arg) => {
  return arg;
};
