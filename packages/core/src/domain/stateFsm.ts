import {createTransitionFsm} from './transitionFsm';
import {createFsm} from './createFsm';
import {Activity} from './activityFsm';
import {Action} from './actionFsm';
import {mergeConfig} from '../utils/merge';

interface Effect {
  action?: Action;
  activity?: Activity;
}

interface StateScheme {
  leave?: Effect;
  enter?: Effect;
  invoke?: Effect;
}

export const createStateFsm = (sourceScheme?: StateScheme) => {
  const scheme = mergeConfig(sourceScheme, {});
};
