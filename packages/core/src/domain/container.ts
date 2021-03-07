import {createStore} from '../common/createStore';
import {isScheme as isSchemeGuard, RouteTable, FsmNode, FsmNodeTable} from './parser';
import {FsmEvent} from './scheme';

interface FsmContariner {
  current: () => FsmNode;
  next: (event: FsmEvent) => FsmNode;
  set: (key: FsmNode, event: FsmEvent, value: FsmNode) => void;
  isChanged: () => boolean;
  isScheme: () => boolean;
}

export const createContainer = (routeTable: RouteTable): FsmContariner => {
  const [root, table] = routeTable;
  const store = createStore<FsmNode>(root);
  const changeStore = createStore<boolean>(false);

  const getCurrentMap = () => {
    const current = store.get();
    return table.get(current) as FsmNodeTable;
  };

  const current = () => {
    return store.get();
  };

  const next = (event: FsmEvent) => {
    changeStore.set(false);
    const map = getCurrentMap();
    const next = map.get(event);
    if (next) {
      store.set(next);
      changeStore.set(true);
    }
    return current();
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
    return changeStore.get();
  };

  const isScheme = () => {
    const current = store.get();
    return isSchemeGuard(current.source);
  };

  return {
    current,
    next,
    set,
    isChanged,
    isScheme,
  };
};
