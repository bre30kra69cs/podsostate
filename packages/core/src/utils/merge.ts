export const mergeArr = <T>(
  source: T[] = [],
  target: T[] = [],
  options?: {
    order: 'before' | 'after';
    strategy?: (source: T[], target: T[]) => T[];
  },
) => {
  if (options?.order === 'before') {
    return [...target, ...source];
  }

  if (options?.order === 'after') {
    return [...source, ...target];
  }

  if (options?.strategy) {
    return options.strategy(source, target);
  }

  return [...source, ...target];
};
