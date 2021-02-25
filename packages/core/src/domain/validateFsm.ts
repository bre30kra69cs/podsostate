import {check} from '../utils/check';
import {countStrings} from '../utils/count';
import {FSMScheme} from '../types/core';

const DETERMINATION_BORDER = 1;

export const validateFsm = (scheme: FSMScheme) => {
  const {init, events, states, transitions} = scheme;

  const initCheck = () => {
    check([states.includes(init), 'FSM Invalid "init" state.']);
  };

  const transitionsCheck = () => {
    transitions.forEach(({from, to, event}) => {
      check(
        [states.includes(from), 'FSM Invalid transition "from" state.'],
        [events.includes(event), 'FSM Invalid transition "event".'],
        [states.includes(to), 'FSM Invalid transition "to" state.'],
      );
    });
  };

  const determinationCheck = () => {
    states.forEach(($state) => {
      const counterMap = transitions
        .filter(({from}) => from === $state)
        .map(({event}) => event)
        .reduce(countStrings, {});

      Object.keys(counterMap).forEach((key) => {
        check([counterMap[key] > DETERMINATION_BORDER, 'FSM not deterministic.']);
      });
    });
  };

  initCheck();
  transitionsCheck();
  determinationCheck();
};
