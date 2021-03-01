import {createMapper} from '../common/createMapper';
import {FsmEvent} from './createEvent';
import {FsmCoord} from './createAlias';

interface FsmElement {}

interface FsmRootElement extends FsmElement {
  type: 'root';
}

interface FsmCommonElement extends FsmElement {
  coord: FsmCoord;
  send: (event: FsmEvent) => void;
  income: () => void;
}

export interface FsmStateElement extends FsmCommonElement {
  type: 'state';
}

interface FsmSchemeElement extends FsmCommonElement {
  type: 'scheme';
  getInit: () => FsmStateElement;
  getChildren: (coor: FsmCoord) => FsmUsedElement | undefined;
}

type FsmParentElement = FsmRootElement | FsmSchemeElement;

type FsmUsedElement = FsmStateElement | FsmSchemeElement;

type FsmTotalElement = FsmUsedElement | FsmRootElement;

export const createFsmElement = (): FsmRootElement => {
  return {
    type: 'root',
  };
};

export interface FsmContext {
  registry: (children: FsmUsedElement, parent: FsmTotalElement) => void;
  getParent: (children: FsmUsedElement) => FsmParentElement | undefined;
  getPeer: (children: FsmUsedElement, coord: FsmCoord) => FsmUsedElement | undefined;
  send: (event: FsmEvent) => void;
  setCurrent: (state: FsmStateElement) => void;
}

export type SchemeBuilder = (context: FsmContext, root: FsmTotalElement) => void;

export const isRoot = (element?: FsmTotalElement): element is FsmRootElement => {
  return element?.type === 'root';
};

export const isScheme = (element?: FsmTotalElement): element is FsmSchemeElement => {
  return element?.type === 'scheme';
};

export const isState = (element?: FsmTotalElement): element is FsmStateElement => {
  return element?.type === 'state';
};

export const createMachine = (rootBuilder: SchemeBuilder) => {
  const mapper = createMapper<FsmUsedElement, FsmTotalElement>();
  const root = createFsmElement();

  const registry = (children: FsmUsedElement, parent: FsmTotalElement) => {
    mapper.set(children, parent, 'unsave');
  };

  const getParent = (children: FsmUsedElement) => {
    return mapper.get(children) as FsmParentElement | undefined;
  };

  const getPeer = (children: FsmUsedElement, coord: FsmCoord) => {
    const parent = getParent(children);
    if (isScheme(parent)) {
      return parent.getChildren(coord);
    }
  };

  const send = (event: FsmEvent) => {};

  const setCurrent = (state: FsmStateElement) => {};

  rootBuilder(
    {
      registry,
      getParent,
      getPeer,
      send,
      setCurrent,
    },
    root,
  );
};
