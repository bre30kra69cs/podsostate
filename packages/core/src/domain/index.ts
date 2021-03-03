import {createSchemeBuilder as scheme, createStateBuilder as state} from './createBuilders';
import {asyncActionRunner} from './actionRunners';
import {createMachine} from './createMachine';
import {createCoord} from './createCoord';
import {createEvent} from './createEvent';
import {wait} from '../utils/wait';

const INIT = createCoord(0, 0);
const LODAING = createCoord(1, 0);
const DONE = createCoord(1, 1);
const ERROR = createCoord(1, -1);

const ToLoading = createEvent();
const ToDone = createEvent();
const ToError = createEvent();

const testScheme = scheme({
  init: INIT,
  states: [
    state({
      coord: INIT,
      transitions: [[ToLoading, LODAING]],
    }),
    state({
      coord: LODAING,
      enter: () => console.log('ENTER'),
      leave: () => console.log('LEAVE'),
      heart: asyncActionRunner({
        heart: async () => {
          await wait(2000);
        },
        resolve: (send) => {
          send(ToDone);
        },
      }),
      transitions: [
        [ToDone, DONE],
        [ToError, ERROR],
      ],
    }),
    state({
      coord: DONE,
      enter: () => console.log('DONE - ENTER'),
      leave: () => console.log('DONE - LEAVE'),
      heart: asyncActionRunner({
        heart: async () => {
          await wait(2000);
        },
        resolve: (send) => {
          send(ToError);
        },
      }),
    }),
    state({
      coord: ERROR,
      enter: () => console.log('ERROR - ENTER'),
      leave: () => console.log('ERROR - LEAVE'),
      heart: asyncActionRunner({
        heart: async () => {
          await wait(2000);
        },
        resolve: (send) => {
          send(ToLoading);
        },
      }),
    }),
  ],
});

const testMachine = createMachine(testScheme);

testMachine.subscribe((coord) => console.log(coord.serialize()));

testMachine.send(ToLoading);
testMachine.send(ToLoading);
testMachine.send(ToError);
