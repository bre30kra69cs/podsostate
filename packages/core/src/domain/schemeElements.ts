import {SchemeElement} from './createMachine';
import {FsmEvent} from './createEvent';
import {FsmCoord} from './createAlias';
import {mergeConfig} from '../utils/merge';

type Action = () => void;

interface StateConfig {
  guard?: Action;
  enter?: Action;
  leave?: Action;
  transitions?: [FsmEvent, FsmCoord][];
}

const createState = (sourceConfig?: StateConfig): SchemeElement => {
  const config = mergeConfig(sourceConfig, {});

  return (context, root) => {
    const state = {};
    context.registry(state, root);
  };
};

const createScheme = (): SchemeElement => {
  return (context, root) => {
    const scheme = {};
    context.registry(scheme, root);
  };
};
