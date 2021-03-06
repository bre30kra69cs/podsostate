import {createStack} from '../common/createStack';
import {createMapper} from '../common/createMapper';
import {createCounter} from '../common/createCounter';
import {createStore} from '../common/createStore';
import {isState, FsmScheme, FsmState, FsmSchemeOrState, isScheme} from './scheme';
import {FsmEvent} from './event';
import {isTruly} from '../utils/typers';

interface RichTreeNode {
  id: string;
  states: Record<string, FsmState>;
  childrens: Record<string, RichTreeNode>;
  parent: RichTreeNode | undefined;
  init: string;
}

const counter = createCounter((current) => `id${current}`);

export const schemeToRichTree = (scheme: FsmScheme) => {
  const store = createStore<RichTreeNode>();

  const iter = (source: FsmScheme, parent?: RichTreeNode) => {
    const id = counter.fire();
    const states = source.states.reduce((acc, next) => {
      if (isState(next)) {
        return {
          ...acc,
          [next.key]: {
            ...next,
            to: {
              ...next.to,
              ...source.out.reduce((acc, next) => {
                if (parent) {
                  return {
                    ...acc,
                    [next]: parent.id,
                  };
                }
                return acc;
              }, {}),
            },
          },
        };
      }
      return acc;
    }, {});
    const current = {
      id,
      states,
      childrens: parent
        ? {
            [parent.id]: parent,
          }
        : {},
      parent,
      init: source.init,
    };

    if (parent) {
      parent.childrens = {
        ...parent.childrens,
        [source.init]: current,
      };
    } else {
      store.set(current);
    }

    source.states.forEach((item) => {
      if (isScheme(item)) {
        iter(item, current);
      }
    });
  };

  iter(scheme);

  return store.get() as RichTreeNode;
};

export interface StatfullTreeNode {
  getCurrent: () => FsmState | undefined;
  getNextNode: (event: FsmEvent) => StatfullTreeNode;
  getNextStop: (event: FsmEvent) => StatfullTreeNode | undefined;
  setChildren: (key: string, children: StatfullTreeNode) => void;
}

const createStatfullTreeNode = (source: RichTreeNode): StatfullTreeNode => {
  const store = createStore<FsmState>();
  const childrens = createMapper<string, StatfullTreeNode>();

  const getCurrent = () => {
    const current = store.get();

    if (!current) {
      const nextStateKey = source.init;
      return source.states[nextStateKey];
    }

    return current;
  };

  const getNextNode = (event: FsmEvent) => {
    const current = getCurrent();

    if (current) {
      const nextStateKey = current.to[event.serialize()];
      if (nextStateKey) {
        const nextState = source.states[nextStateKey];
        if (nextState) {
          store.set(nextState);
        } else {
          const nextNode = childrens.get(nextStateKey);
          if (nextNode) {
            return nextNode;
          }
        }
      }
    }

    return self();
  };

  const getNextStop = (event: FsmEvent): StatfullTreeNode | undefined => {
    const next = getNextNode(event);
    if (next) {
      const current = next.getCurrent();
      if (!current) {
        return next.getNextStop(event);
      }

      return next;
    }
  };

  const setChildren = (key: string, children: StatfullTreeNode) => {
    childrens.set(key, children);
  };

  const self = () => {
    return {
      getCurrent,
      getNextNode,
      setChildren,
      getNextStop,
    };
  };

  return self();
};

export const richTreeToStatfullTree = (root: RichTreeNode) => {
  const store = createStore<StatfullTreeNode>();

  const iter = (treeNode: RichTreeNode, parent?: StatfullTreeNode) => {
    const statfullTreeNode = createStatfullTreeNode(treeNode);
    Object.keys(treeNode.childrens).forEach((key) => {
      iter(treeNode.childrens[key], statfullTreeNode);
    });

    if (parent) {
      parent.setChildren(treeNode.init, statfullTreeNode);
    } else {
      store.set(statfullTreeNode);
    }
  };

  iter(root);

  return store.get() as StatfullTreeNode;
};

export const parse = (scheme: FsmScheme) => {
  const richTree = schemeToRichTree(scheme);
  return richTreeToStatfullTree(richTree);
};
