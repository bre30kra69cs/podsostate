export const removeArrMutable = <T>(
  source: T[],
  target: T,
  strategy: 'all' | 'first' = 'first',
) => {
  const index = source.indexOf(target);

  if (index >= 0) {
    source.splice(index, 1);
    if (strategy === 'all') {
      removeArrMutable(source, target);
    }
  }

  return source;
};

export const removeArr = <T>(source: T[], target: T, strategy: 'all' | 'first' = 'first') => {
  const index = source.indexOf(target);

  if (strategy === 'first') {
    return source.filter((_, i) => i !== index);
  } else {
    return source.filter((item) => item !== target);
  }
};
