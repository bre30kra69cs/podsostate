import {createPushStack} from '../common/createStack';
import {isScheme as isSchemeGuard, RouteTable, FsmNode, FsmNodeTable} from './parser';
import {FsmEvent} from './scheme';

export interface FsmContariner {
  current: () => FsmNode;
  next: (event: FsmEvent) => FsmNode;
  set: (key: FsmNode, event: FsmEvent, value: FsmNode) => void;
  isChanged: () => boolean;
  isScheme: () => boolean;
  isLifted: () => boolean;
}

export const createContainer = (routeTable: RouteTable): FsmContariner => {
  const [root, table] = routeTable;
  const stack = createPushStack<FsmNode>({limit: 2});

  const getCurrnet = () => {
    return stack.head() as FsmNode;
  };

  const getPrev = () => {
    return stack.get(1);
  };

  const getCurrentMap = () => {
    const current = getCurrnet();
    return table.get(current) as FsmNodeTable;
  };

  const next = (event: FsmEvent) => {
    const map = getCurrentMap();
    const next = map.get(event);
    const current = getCurrnet();
    stack.push(next ?? current);
    return getCurrnet();
  };

  const set = (key: FsmNode, event: FsmEvent, value: FsmNode) => {
    const map = table.get(key);
    if (map) {
      const target = map.get(event);
      if (target) {
        map.set(event, value, 'unsave');
      }
    }
  };

  const isChanged = () => {
    const current = getCurrnet();
    const prev = getPrev();
    return current !== prev;
  };

  const isScheme = () => {
    const current = getCurrnet();
    return isSchemeGuard(current.source);
  };

  const isLifted = () => {
    const current = getCurrnet();
    const prev = getPrev();
    return prev?.parent === current;
  };

  const init = () => {
    stack.push(root);
  };

  init();

  return {
    current: getCurrnet,
    next,
    set,
    isChanged,
    isScheme,
    isLifted,
  };
};
