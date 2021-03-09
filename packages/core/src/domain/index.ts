import {log} from '../utils/log';
import {wait} from '../utils/wait';
import {createEvent, createScheme, createState} from './scheme';
import {parseRouteTable} from './parser';
import {createMachine} from './machine';
import {actionTap, asyncActionTap} from './taps';

const ToLoading = createEvent();
const ToDone = createEvent();
const ToError = createEvent();
const ToExtra = createEvent();

const INIT = createState();
const LOADING = createState({
  enter: actionTap({
    action: () => {
      console.log('WAIT LOADING');
      // await wait(2000);
      console.log('ENTER LOADING');
    },
    resolve: (send) => {
      send(ToDone);
      send(ToExtra);
    },
    reject: (send) => {
      send(ToError);
    },
  }),
  leave: () => {
    console.log('LEAVE LOADING');
  },
});
const DONE = createState({
  enter: actionTap({
    action: () => {
      console.log('WAIT DONE');
      // await wait(2000);
      console.log('ENTER DONE');
    },
    resolve: (send) => {
      send(ToExtra);
    },
  }),
  leave: () => {
    console.log('LEAVE DONE');
  },
});
const ERROR = createState({
  enter: () => {
    console.log(123);
  },
});
const EXTRA = createState({
  enter: actionTap({
    action: () => {
      console.log('ENTER EXTRA');
    },
  }),
  leave: () => {
    console.log('LEAVE EXTRA');
  },
});

const testScheme = createScheme({
  init: INIT,
  transitions: [
    [INIT, ToLoading, LOADING],
    [LOADING, ToDone, DONE],
    [LOADING, ToError, ERROR],
    [DONE, ToExtra, EXTRA],
    [ERROR, ToExtra, EXTRA],
  ],
});

// log(testScheme);

const {root, table} = parseRouteTable(testScheme);

// for (const i of mapper.entries()) {
//   console.log(i);
// }

const machine = createMachine(testScheme);

machine.subscribe(console.log);

machine.send(ToLoading);
machine.send(ToLoading);
machine.send(ToLoading);
// machine.send(ToDone);
