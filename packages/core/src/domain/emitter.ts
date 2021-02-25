import {Subscriber} from '../types/core';

export const createEmitter = () => {
  let $subscribers: [string, Subscriber][] = [];

  const clean = (event: string, subscriber: Subscriber) => {
    $subscribers = $subscribers.filter(([$event, $subscriber]) => {
      return $event !== event && $subscriber !== subscriber;
    });
  };

  const subscribe = (event: string, subscriber: Subscriber) => {
    clean(event, subscriber);
    $subscribers.push([event, subscriber]);
  };

  const unsubscribe = (event: string, subscriber: Subscriber) => {
    clean(event, subscriber);
  };

  const emit = (event: string) => {
    $subscribers.forEach(([$event, $subscriber]) => {
      if ($event === event) {
        $subscriber(event);
      }
    });
  };

  return {
    subscribe,
    unsubscribe,
    emit,
  };
};
