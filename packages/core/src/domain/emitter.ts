type Subscriber = () => void;

export const createEmitter = () => {
  const subscribers: Record<string, Subscriber[]> = {};

  const subscribe = (eventName: string, subscriber: () => void) => {
    if (!subscribers[eventName]) {
      subscribers[eventName] = [];
    }

    subscribers[eventName].push(subscriber);
  };

  const emit = (eventName: string) => {
    if (subscribers[eventName]) {
      subscribers[eventName].forEach((subscriber) => subscriber());
    }
  };

  return {
    subscribe,
    emit,
  };
};
