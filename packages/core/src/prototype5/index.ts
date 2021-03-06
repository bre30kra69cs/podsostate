import {createScheme, createState} from './scheme';
import {createEvent} from './event';
import {createKey} from './key';
import {parse} from './parser';

const INIT = createKey();
const INIT1 = createKey();
const LOADING = createKey();
const ERROR = createKey();
const DONE = createKey();

const ToLoading = createEvent();
const ToError = createEvent();
const ToDone = createEvent();

const testScheme = createScheme({
  init: INIT,
  states: [
    createState({
      key: INIT,
      transitions: [[ToLoading, LOADING]],
    }),
    createState({
      key: LOADING,
      transitions: [
        [ToError, ERROR],
        [ToDone, DONE],
      ],
    }),
    createState({
      key: ERROR,
      transitions: [],
    }),
    createState({
      key: DONE,
      transitions: [],
    }),
    createScheme({
      init: INIT1,
      states: [
        createState({
          key: INIT1,
          transitions: [[ToLoading, LOADING]],
        }),
        createState({
          key: LOADING,
          transitions: [
            [ToError, ERROR],
            [ToDone, DONE],
          ],
        }),
        createState({
          key: ERROR,
          transitions: [],
        }),
        createState({
          key: DONE,
          transitions: [],
        }),
      ],
    }),
  ],
});

const log = (data?: object) => {
  const json = JSON.stringify(data, undefined, 2);
  console.log(json);
};

// log(testScheme);

const t = parse(testScheme);

log(t);
