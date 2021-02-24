import {createFsm, FSM} from './fsm';
import {Subscriber} from './emitter';

type Action = () => void;

const EVENT_TO_START = 'start';
const EVENT_TO_ACTIVE = 'activate';
const EVENT_TO_END = 'end';
const EVENT_TO_THROW = 'throw';
const STATE_IDLE = 'idle';
const STATE_START = 'started';
const STATE_ACTIVE = 'activated';
const STATE_END = 'ended';
const STATE_THROW = 'throwed';

export const createAction = (action: Action): FSM => {
  let current = STATE_IDLE;
  const fsm = createFsm({
    init: current,
    events: [EVENT_TO_START, EVENT_TO_ACTIVE, EVENT_TO_END, EVENT_TO_THROW],
    states: [STATE_START, STATE_ACTIVE, STATE_END, STATE_THROW],
    transitions: [
      [STATE_IDLE, EVENT_TO_START, STATE_START],
      [STATE_START, EVENT_TO_ACTIVE, STATE_ACTIVE],
      [STATE_ACTIVE, EVENT_TO_END, STATE_END],
      [STATE_ACTIVE, EVENT_TO_THROW, STATE_THROW],
    ],
  });
  fsm.subscribe((state) => {
    current = state;
  });

  const executeAction = () => {
    if (action) {
      try {
        action();
        fsm.send(EVENT_TO_END);
      } catch {
        fsm.send(EVENT_TO_THROW);
      }
    }
  };

  const send = (event: string) => {
    if (current === STATE_ACTIVE) {
      return;
    }

    if (event === EVENT_TO_START) {
      fsm.send(EVENT_TO_START);
      fsm.send(EVENT_TO_ACTIVE);
      executeAction();
    }

    fsm.send(event);
  };

  const subscribe = (subscriber: Subscriber) => {
    fsm.subscribe(subscriber);
  };

  const unsubscribe = (subscriber: Subscriber) => {
    fsm.unsubscribe(subscriber);
  };

  return {
    send,
    subscribe,
    unsubscribe,
  };
};
