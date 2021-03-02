export type Subscriber<T> = (event: string, payload: T) => void;

export const createEmitter = <T>() => {
  let subscribers: [string, Subscriber<T>][] = [];

  const clean = (event: string, subscriber: Subscriber<T>) => {
    subscribers = subscribers.filter(([$event, $subscriber]) => {
      return $event !== event && $subscriber !== subscriber;
    });
  };

  const subscribe = (event: string, subscriber: Subscriber<T>) => {
    clean(event, subscriber);
    subscribers.push([event, subscriber]);
  };

  const unsubscribe = (event: string, subscriber: Subscriber<T>) => {
    clean(event, subscriber);
  };

  const emit = (event: string, payload: T) => {
    subscribers.forEach(([$event, $subscriber]) => {
      if ($event === event) {
        $subscriber(event, payload);
      }
    });
  };

  return {
    subscribe,
    unsubscribe,
    emit,
  };
};

export type SilenceSubscriber<T> = (payload: T) => void;

export const createSilenceEmitter = <T>() => {
  let subscribers: SilenceSubscriber<T>[] = [];

  const clean = (subscriber: SilenceSubscriber<T>) => {
    subscribers = subscribers.filter(($subscriber) => {
      return $subscriber !== subscriber;
    });
  };

  const subscribe = (subscriber: SilenceSubscriber<T>) => {
    clean(subscriber);
    subscribers.push(subscriber);
  };

  const unsubscribe = (subscriber: SilenceSubscriber<T>) => {
    clean(subscriber);
  };

  const emit = (payload: T) => {
    subscribers.forEach(($subscriber) => {
      $subscriber(payload);
    });
  };

  return {
    subscribe,
    unsubscribe,
    emit,
  };
};
