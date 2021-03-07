import {log} from '../utils/log';
import {createEvent, createScheme, createState} from './scheme';
import {parseRouteTable} from './parser';
import {createMachine} from './machine';

const INIT = createState();
const LOADING = createState();
const DONE = createState();
const ERROR = createState();

const ToLoading = createEvent();
const ToDone = createEvent();
const ToError = createEvent();

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
machine.send(ToDone);
