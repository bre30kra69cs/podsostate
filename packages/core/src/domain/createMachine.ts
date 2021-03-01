import {createMapper, createArrayMapper} from '../common/createMapper';

interface FsmElement {}

export interface FsmContext {
  registry: (children: FsmElement, parent: FsmElement) => void;
}

export type SchemeElement = (context: FsmContext, root: FsmElement) => void;

export const createMachine = (schemeRoot: SchemeElement) => {
  const childrenMapper = createMapper<FsmElement, FsmElement>();
  const parrentMapper = createArrayMapper<FsmElement, FsmElement>();
  const root = {};

  const registry = (children: FsmElement, parent: FsmElement) => {
    childrenMapper.set(children, parent, 'unsave');
    parrentMapper.set(parent, [children], 'save');
  };

  schemeRoot(
    {
      registry,
    },
    root,
  );
};
