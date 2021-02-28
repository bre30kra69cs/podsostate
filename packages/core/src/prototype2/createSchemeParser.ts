import {FsmScheme, FsmNode} from './createScheme';
import {SchemeGuard} from './schemeGuard';

const createSchemeParser = (schemeGuard: SchemeGuard) => (scheme: FsmScheme) => {
  const parseIter = (fsmNode: FsmNode) => {
    if (schemeGuard.isState(fsmNode)) {
    }
    if (schemeGuard.isScheme(fsmNode)) {
    }
    if (schemeGuard.isParallel(fsmNode)) {
    }
  };

  parseIter(scheme);
};
