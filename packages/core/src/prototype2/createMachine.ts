import {FsmScheme, FsmNode, FsmState} from './createScheme';
import {SchemeGuard} from './schemeGuard';

const fsmFromState = (state: FsmState) => {};

const fsmFromScheme = (scheme: FsmScheme) => {};

const fsmFromParallel = (parallel: FsmScheme[]) => {};

const createSchemeParser = (schemeGuard: SchemeGuard) => (fsmNode: FsmNode) => {
  if (schemeGuard.isState(fsmNode)) {
  }
  if (schemeGuard.isScheme(fsmNode)) {
  }
  if (schemeGuard.isParallel(fsmNode)) {
  }
};

export const createMachine = (scheme: FsmScheme) => {};
