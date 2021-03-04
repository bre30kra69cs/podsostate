export interface FsmId {
  serialize: () => string;
}

export const createId = (): FsmId => {
  const serialize = () => {
    return '';
  };

  return {
    serialize,
  };
};
