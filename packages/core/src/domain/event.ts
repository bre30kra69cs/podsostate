export interface FsmEvent {
  serialize: () => string;
}

export const createEvent = (): FsmEvent => {
  const serialize = () => {
    return '';
  };

  return {
    serialize,
  };
};
