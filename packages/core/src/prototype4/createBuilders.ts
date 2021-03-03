import {SchemeBuilder} from './createMachine';
import {createStateElement, createSchemeElement, StateConfig, SchemeConfig} from './createElements';

export const createStateBuilder = (config: StateConfig): SchemeBuilder => {
  return (context, root) => {
    const state = createStateElement(context, config);
    context.registry(state, root);
    return state;
  };
};

export const createSchemeBuilder = (config: SchemeConfig): SchemeBuilder => {
  return (context, root) => {
    const scheme = createSchemeElement(context, config);
    context.registry(scheme, root);
    return scheme;
  };
};
