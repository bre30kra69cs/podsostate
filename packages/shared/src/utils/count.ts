export const countStrings = (acc: Record<string, number>, value: string) => {
  if (acc[value]) {
    acc[value] += 1;
  }

  acc[value] = 1;
  return acc;
};
