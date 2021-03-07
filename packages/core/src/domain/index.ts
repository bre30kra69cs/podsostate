import {log} from '../utils/log';
import {wait} from '../utils/wait';
import {createEvent, createScheme, createState} from './scheme';
import {parseRouteTable} from './parser';
import {createMachine} from './machine';
import {actionTap, asyncActionTap} from './taps';

const ToLoading = createEvent();
const ToDone = createEvent();
const ToError = createEvent();

const INIT = createState();
const LOADING = createState({
  enter: asyncActionTap({
    action: async () => {
      await wait(4000);
      console.log(1);
      throw new Error('1 - error');
    },
    resolve: (send) => {
      // send(ToDone);
    },
    reject: (send) => {
      send(ToError);
    },
  }),
  leave: () => console.log(2),
});
const DONE = createState({
  enter: (unlock) => {
    unlock();
    console.log(3);
  },
});
const ERROR = createState({
  enter: () => {
    console.log(123);
  },
});

const testScheme = createScheme({
  init: INIT,
  transitions: [
    [INIT, ToLoading, LOADING],
    [LOADING, ToDone, DONE],
    [LOADING, ToError, ERROR],
  ],
});

// log(testScheme);

const [rootNode, mapper] = parseRouteTable(testScheme);

// for (const i of mapper.entries()) {
//   console.log(i);
// }

const machine = createMachine(testScheme);

machine.subscribe(console.log);

machine.send(ToLoading);
machine.send(ToLoading);
machine.send(ToLoading);
// machine.send(ToDone);
