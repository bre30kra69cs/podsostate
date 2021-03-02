import {createSchemeBuilder, createStateBuilder} from './createBuilders';
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

const testScheme = createSchemeBuilder({
  init: INIT,
  states: [
    createStateBuilder({
      coord: INIT,
      transitions: [[ToLoading, LODAING]],
    }),
    createStateBuilder({
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
    createStateBuilder({
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
    createStateBuilder({
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
