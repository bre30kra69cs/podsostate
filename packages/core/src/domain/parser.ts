import {createMapper, Mapper} from '../common/createMapper';
import {
  createEvent,
  createState,
  FsmScheme,
  FsmEvent,
  FsmTransition,
  FsmSchemeOrState,
} from './scheme';

export interface FsmNode {
  source: FsmSchemeOrState;
  compare: (target: FsmSchemeOrState) => boolean;
}

const createNode = (source: FsmSchemeOrState): FsmNode => {
  const compare = (target: FsmSchemeOrState) => {
    return source === target;
  };

  return {
    source,
    compare,
  };
};

const getTransitions = (source: FsmSchemeOrState, transitions: FsmTransition[]) => {
  return transitions.filter(([from]) => from === source);
};

export const isScheme = (value?: any): value is FsmScheme => {
  return !!value.init;
};

export const ToInit = createEvent();

const PARSE = createState();

const parseNode = createNode(PARSE);

export type FsmNodeTable = Mapper<FsmEvent, FsmNode>;

export const parse = (root: FsmScheme): [FsmNode, Mapper<FsmNode, FsmNodeTable>] => {
  const mapper = createMapper<FsmNode, FsmNodeTable>();

  const iter = (current: FsmScheme, currentNode: FsmNode, parentNode: FsmNode) => {
    const currentMapper = mapper.get(currentNode) as FsmNodeTable;
    const stateMapper = createMapper<FsmSchemeOrState, FsmNode>();
    current.states.forEach((state) => {
      const stateNode = createNode(state);
      const nodeMapper = createMapper<FsmEvent, FsmNode>();
      mapper.set(stateNode, nodeMapper);
      stateMapper.set(state, stateNode);
    });
    current.states.forEach((state) => {
      const stateNode = stateMapper.get(state) as FsmNode;
      const transitions = getTransitions(state, current.transitions);
      const nodeMapper = mapper.get(stateNode) as FsmNodeTable;
      transitions.forEach(([, event, to]) => {
        const toNode = stateMapper.get(to) as FsmNode;
        nodeMapper.set(event, toNode);
      });
    });
    current.outEvents.forEach((event) => {
      currentMapper.set(event, parentNode);
    });
    const initNode = stateMapper.get(current.init) as FsmNode;
    currentMapper.set(ToInit, initNode);
    current.states.forEach((state) => {
      if (isScheme(state)) {
        const stateNode = stateMapper.get(state) as FsmNode;
        iter(state, stateNode, currentNode);
      }
    });
  };

  const rootNode = createNode(root);
  iter(root, rootNode, parseNode);
  return [rootNode, mapper];
};
