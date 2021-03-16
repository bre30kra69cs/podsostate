import {createEvent, createScheme, createState, parseRouteTable} from '@podsostate/core';

const DEEP_INIT = createState({
  name: 'DEEP_INIT',
});
const DEEP_MIDDLE = createState({
  name: 'DEEP_MIDDLE',
});
const DEEP_END = createState({
  name: 'DEEP_END',
});

const ToDeepMiddle = createEvent({
  name: 'ToDeepMiddle',
});
const ToDeepEnd = createEvent({
  name: 'ToDeepEnd',
});

const deepScheme = createScheme({
  name: 'deepScheme',
  init: DEEP_INIT,
  transitions: [
    [DEEP_INIT, ToDeepMiddle, DEEP_MIDDLE],
    [DEEP_MIDDLE, ToDeepEnd, DEEP_END],
  ],
});

const LOCAL_INIT = createState({
  name: 'LOCAL_INIT',
});

const ToLocalEnd = createEvent({
  name: 'ToLocalEnd',
});

const localScheme = createScheme({
  name: 'localScheme',
  init: LOCAL_INIT,
  transitions: [[LOCAL_INIT, ToLocalEnd, deepScheme]],
});

const GLOBAL_INIT = createState({
  name: 'GLOBAL_INIT',
});
const GLOBAL_END = createState({
  name: 'GLOBAL_END',
});

const ToGlobalMiddle = createEvent({
  name: 'ToGlobalMiddle',
});
const ToGlobalEnd = createEvent({
  name: 'ToGlobalEnd',
});

const globalScheme = createScheme({
  name: 'globalScheme',
  init: GLOBAL_INIT,
  transitions: [
    [GLOBAL_INIT, ToGlobalMiddle, localScheme],
    [localScheme, ToGlobalEnd, GLOBAL_END],
  ],
});

export const table = parseRouteTable(globalScheme);
