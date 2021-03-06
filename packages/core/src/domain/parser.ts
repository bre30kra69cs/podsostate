import {createMapper, Mapper} from '../common/createMapper';
import {FsmScheme, FsmEvent, FsmState, FsmTransition, FsmSchemeOrState} from './scheme';

interface FsmNode {
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

type FsmNodeTable = Mapper<FsmEvent, FsmNode>;

const parse = (root: FsmScheme) => {
  const iter = (current: FsmScheme) => {
    const stateMapper = createMapper<FsmSchemeOrState, FsmNode>();
    const iterMapper = createMapper<FsmNode, FsmNodeTable>();
    const currentNode = createNode(current);
    current.states.forEach((state) => {
      const stateNode = createNode(state);
      const nodeMapper = createMapper<FsmEvent, FsmNode>();
      iterMapper.set(stateNode, nodeMapper);
      stateMapper.set(state, stateNode);
    });
    current.states.forEach((state) => {
      const stateNode = stateMapper.get(state) as FsmNode;
      const transitions = getTransitions(state, current.transitions);
      const nodeMapper = iterMapper.get(stateNode) as FsmNodeTable;
      transitions.forEach(([, event, to]) => {
        const toNode = stateMapper.get(to) as FsmNode;
        nodeMapper.set(event, toNode);
      });
    });
  };
};
