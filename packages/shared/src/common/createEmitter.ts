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

interface SilenceEmitter<I, O> {
  subscribe: (subscriber: SilenceSubscriber<O>) => void;
  unsubscribe: (subscriber: SilenceSubscriber<O>) => void;
  emit: (payload: I) => void;
}

interface CreateSilenceEmitter {
  <T>(): SilenceEmitter<T, T>;
  <I, O>(convert: (data: I) => O): SilenceEmitter<I, O>;
}

export type SilenceSubscriber<T> = (payload: T) => void;

export const createSilenceEmitter: CreateSilenceEmitter = <I, O>(convert?: (data: I) => O) => {
  let subscribers: SilenceSubscriber<I | O>[] = [];

  const clean = (subscriber: SilenceSubscriber<O>) => {
    subscribers = subscribers.filter(($subscriber) => {
      return $subscriber !== subscriber;
    });
  };

  const subscribe = (subscriber: SilenceSubscriber<I | O>) => {
    clean(subscriber);
    subscribers.push(subscriber);
  };

  const unsubscribe = (subscriber: SilenceSubscriber<O>) => {
    clean(subscriber);
  };

  const emit = (payload: I) => {
    subscribers.forEach(($subscriber) => {
      const value = convert ? convert(payload) : payload;
      $subscriber(value);
    });
  };

  return {
    subscribe,
    unsubscribe,
    emit,
  };
};
