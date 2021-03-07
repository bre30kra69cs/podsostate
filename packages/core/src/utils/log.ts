export const log = <T>(value: T) => {
  if (typeof value === 'object') {
    const displayValue = JSON.stringify(value, undefined, 2);
    console.log(displayValue);
  } else {
    console.log(value);
  }
};
