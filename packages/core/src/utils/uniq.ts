export const uniqArray = <T>(...args: T[][]): T[] => {
  const values = args.flat();
  const filtred = new Set<T>(values);
  return Array.from(filtred);
};
