import {createMapper, Mapper} from '../common/createMapper';
import {createCounter} from '../common/createCounter';
import {
  createEvent,
  createState,
  FsmScheme,
  FsmEvent,
  FsmTransition,
  FsmSchemeOrState,
} from './scheme';

export interface FsmNode {
  id: string;
  source: FsmSchemeOrState;
  parent?: FsmNode;
}

const counter = createCounter((current) => `node${current}`);

const createNode = (source: FsmSchemeOrState, parent?: FsmNode): FsmNode => {
  return {
    id: counter.fire(),
    source,
    parent,
  };
};

const getTransitions = (source: FsmSchemeOrState, transitions: FsmTransition[]) => {
  return transitions.filter(([from]) => from === source);
};

export const isScheme = (value?: any): value is FsmScheme => {
  return !!value.init;
};

export const ToInit = createEvent();

export type FsmNodeTable = Mapper<FsmEvent, FsmNode>;

export type RouteTable = [FsmNode, Mapper<FsmNode, FsmNodeTable>];

export const parseRouteTable = (root: FsmScheme): RouteTable => {
  const mapper = createMapper<FsmNode, FsmNodeTable>();

  const iter = (current: FsmScheme, currentNode: FsmNode, parentNode: FsmNode) => {
    const currentMapper = mapper.get(currentNode) as FsmNodeTable;
    const stateMapper = createMapper<FsmSchemeOrState, FsmNode>();
    current.states.forEach((state) => {
      const stateNode = createNode(state, currentNode);
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
    const outEvents = isScheme(parentNode.source)
      ? getTransitions(current, parentNode.source.transitions).map(([, event]) => event)
      : [];
    current.states.forEach((state) => {
      const stateNode = stateMapper.get(state) as FsmNode;
      const nodeMapper = mapper.get(stateNode) as FsmNodeTable;
      outEvents.forEach((event) => {
        nodeMapper.set(event, currentNode);
      });
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

  const PARSE = createState();
  const parseNode = createNode(PARSE);
  const rootNode = createNode(root, parseNode);
  const nodeMapper = createMapper<FsmEvent, FsmNode>();
  mapper.set(rootNode, nodeMapper);
  iter(root, rootNode, parseNode);
  return [rootNode, mapper];
};
