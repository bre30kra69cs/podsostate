export const swapArrMutable = <T>(
  source: T[],
  from: T,
  to: T,
  strategy: 'all' | 'first' = 'first',
) => {
  if (strategy === 'first') {
    const index = source.indexOf(from);
    if (index >= 0) {
      source[index] = to;
    }
  } else {
    source.forEach((item, i) => {
      if (item === from) {
        source[i] = to;
      }
    });
  }

  return source;
};

export const swapArr = <T>(source: T[], from: T, to: T, strategy: 'all' | 'first' = 'first') => {
  const index = source.indexOf(from);

  if (strategy === 'first') {
    return source.map((item, i) => {
      return i === index ? to : item;
    });
  } else {
    return source.map((item) => {
      return item === from ? to : item;
    });
  }
};
