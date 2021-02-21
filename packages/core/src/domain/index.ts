type NotNullableString<T extends string> = T extends '' ? never : T;

const createEvent = <T extends string>(name: NotNullableString<T>) => {
  const getName = (): T => {
    return name;
  };

  return {getName};
};

const createState = <T extends string>(name: NotNullableString<T>) => {
  const getName = (): T => {
    return name;
  };

  return {getName};
};
