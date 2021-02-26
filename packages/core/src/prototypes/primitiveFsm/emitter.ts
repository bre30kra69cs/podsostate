export type Subscriber<T> = (event: string, payload: T) => void;

export const createEmitter = <T>() => {
  let $subscribers: [string, Subscriber<T>][] = [];

  const clean = (event: string, subscriber: Subscriber<T>) => {
    $subscribers = $subscribers.filter(([$event, $subscriber]) => {
      return $event !== event && $subscriber !== subscriber;
    });
  };

  const subscribe = (event: string, subscriber: Subscriber<T>) => {
    clean(event, subscriber);
    $subscribers.push([event, subscriber]);
  };

  const unsubscribe = (event: string, subscriber: Subscriber<T>) => {
    clean(event, subscriber);
  };

  const emit = (event: string, payload: T) => {
    $subscribers.forEach(([$event, $subscriber]) => {
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
