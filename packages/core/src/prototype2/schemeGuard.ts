import {FsmState, FsmScheme} from './createScheme';

export interface SchemeGuard {
  isState: (value?: any) => value is FsmState;
  isScheme: (value?: any) => value is FsmScheme;
  isParallel: (value?: any) => value is FsmScheme[];
}

export const propertySchemeGuard: SchemeGuard = {
  isState: (value?: any): value is FsmState => {
    return !!value?.transitions;
  },
  isScheme: (value?: any): value is FsmScheme => {
    return !!value?.states;
  },
  isParallel: (value?: any): value is FsmScheme[] => {
    return Array.isArray(value);
  },
};

export const typeSchemeGuard: SchemeGuard = {
  isState: (value?: any): value is FsmState => {
    return value.type === 'state';
  },
  isScheme: (value?: any): value is FsmScheme => {
    return value.type === 'scheme';
  },
  isParallel: (value?: any): value is FsmScheme[] => {
    return value.type === 'parallel';
  },
};
