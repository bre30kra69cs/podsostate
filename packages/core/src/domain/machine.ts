import {parseRouteTable} from './parser';
import {FsmScheme} from './scheme';
import {createContainer} from './container';
import {createInstance} from './instance';

export const createMachine = (scheme: FsmScheme) => {
  const routeTable = parseRouteTable(scheme);
  const container = createContainer(routeTable);
  const instance = createInstance(container);
  return instance;
};
