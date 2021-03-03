import {createMapper} from '../common/createMapper';
import {createStore} from '../common/createStore';
import {createSilenceEmitter, SilenceSubscriber} from '../common/createEmitter';
import {FsmEvent} from './createEvent';
import {FsmCoord} from './createCoord';

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

export interface FsmSchemeElement extends FsmCommonElement {
  type: 'scheme';
  getInit: () => FsmUsedElement;
  getChildren: (coor: FsmCoord) => FsmUsedElement | undefined;
}

type FsmParentElement = FsmRootElement | FsmSchemeElement;

export type FsmUsedElement = FsmStateElement | FsmSchemeElement;

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

export type SchemeBuilder = (context: FsmContext, root: FsmTotalElement) => FsmUsedElement;

export const isRoot = (element?: FsmTotalElement): element is FsmRootElement => {
  return element?.type === 'root';
};

export const isScheme = (element?: FsmTotalElement): element is FsmSchemeElement => {
  return element?.type === 'scheme';
};

export const isState = (element?: FsmTotalElement): element is FsmStateElement => {
  return element?.type === 'state';
};

export const getInit = (source: FsmSchemeElement): FsmStateElement => {
  const target = source.getInit();
  if (isState(target)) {
    return target;
  }
  return getInit(target);
};

interface Fsm {
  send: (event: FsmEvent) => void;
  subscribe: (subscriber: SilenceSubscriber<FsmCoord>) => void;
  unsubscribe: (subscriber: SilenceSubscriber<FsmCoord>) => void;
}

export const createMachine = (rootBuilder: SchemeBuilder): Fsm => {
  const mapper = createMapper<FsmUsedElement, FsmTotalElement>();
  const store = createStore<FsmStateElement>();
  const emitter = createSilenceEmitter<FsmCoord>();
  const root = createFsmElement();

  const getCurrent = () => {
    return store.get() as FsmStateElement;
  };

  const registry = (children: FsmUsedElement, parent: FsmTotalElement) => {
    mapper.set(children, parent, 'unsave');
    if (parent === root) {
      setCurrent(children);
    }
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

  const send = (event: FsmEvent) => {
    const current = getCurrent();
    current.send(event);
  };

  const setCurrent = (element: FsmUsedElement) => {
    const next = isState(element) ? element : getInit(element);
    store.set(next);
    emitter.emit(next.coord);
  };

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

  return {
    send,
    subscribe: emitter.subscribe,
    unsubscribe: emitter.unsubscribe,
  };
};
