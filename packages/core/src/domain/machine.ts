import {FsmScheme} from './scheme';
import {parseRouteTable} from './parser';
import {createContainer} from './container';
import {createProcessor} from './processor';

export const createMachine = (scheme: FsmScheme) => {
  const routeTable = parseRouteTable(scheme);
  const container = createContainer(routeTable);
  const processor = createProcessor(container);
  return processor;
};
