import {createMapper, Mapper} from '@podsostate/shared';
import {createCounter} from '@podsostate/shared';
import {
  createLibEvent,
  createState,
  FsmScheme,
  FsmEvent,
  FsmTransition,
  FsmSchemeOrState,
} from './scheme';

export interface FsmNode<T = FsmSchemeOrState> {
  id: string;
  source: T;
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

export const ToInit = createLibEvent({
  name: 'ToInit',
});

export type FsmNodeTable = Mapper<FsmEvent, FsmNode>;

export type FsmParsedTable = Mapper<FsmNode, FsmNodeTable>;

export interface RouteTable {
  root: FsmNode;
  table: FsmParsedTable;
}

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
      const stateNode = <FsmNode>stateMapper.get(state);
      const transitions = getTransitions(state, current.transitions);
      const nodeMapper = <FsmNodeTable>mapper.get(stateNode);
      transitions.forEach(([, event, to]) => {
        const toNode = <FsmNode>stateMapper.get(to);
        nodeMapper.set(event, toNode);
      });
    });

    const outEvents = isScheme(parentNode.source)
      ? getTransitions(current, parentNode.source.transitions).map(([, event]) => event)
      : [];

    current.states.forEach((state) => {
      const stateNode = <FsmNode>stateMapper.get(state);
      const nodeMapper = <FsmNodeTable>mapper.get(stateNode);
      outEvents.forEach((event) => {
        nodeMapper.set(event, currentNode);
      });
    });

    const initNode = <FsmNode>stateMapper.get(current.init);
    currentMapper.set(ToInit, initNode);
    current.states.forEach((state) => {
      if (isScheme(state)) {
        const stateNode = <FsmNode>stateMapper.get(state);
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
  return {
    root: rootNode,
    table: mapper,
  };
};
