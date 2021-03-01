import {createMapper, createArrayMapper} from '../common/createMapper';
import {FsmEvent} from './createEvent';

export type Send = (event: FsmEvent) => void;

export interface FsmElement {}

export const createFsmElement = (): FsmElement => {
  return {};
};

export interface FsmContext {
  registry: (children: FsmElement, parent: FsmElement) => void;
  getParent: (children: FsmElement) => FsmElement;
  getPeers: (children: FsmElement) => FsmElement[];
  send: Send;
}

export type SchemeBuilder = (context: FsmContext, root: FsmElement) => void;

export const createMachine = (rootBuilder: SchemeBuilder) => {
  const childrenMapper = createMapper<FsmElement, FsmElement>();
  const parrentMapper = createArrayMapper<FsmElement, FsmElement>();
  const root = createFsmElement();

  const registry = (children: FsmElement, parent: FsmElement) => {
    childrenMapper.set(children, parent, 'unsave');
    parrentMapper.set(parent, [children], 'save');
  };

  const getParent = (children: FsmElement) => {
    return childrenMapper.get(children) as FsmElement;
  };

  const getPeers = (children: FsmElement) => {
    const parent = getParent(children);
    return parrentMapper.get(parent) as FsmElement[];
  };

  const send = (event: FsmEvent) => {};

  rootBuilder(
    {
      registry,
      getParent,
      getPeers,
      send,
    },
    root,
  );
};
