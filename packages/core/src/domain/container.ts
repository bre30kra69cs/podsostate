import {createMapper, Mapper} from '../common/createMapper';
import {createCounter} from '../common/createCounter';
import {isScheme, isState, FsmScheme, FsmState, FsmSchemeOrState} from './scheme';

interface Item {
  key: string;
  source: any;
  to: Record<string, Item>;
}

const keyCounter = createCounter((current) => `${current}`);

export const createContainer = () => {
  const setIter = (
    scheme: FsmScheme,
    keyMapper: Mapper<string, Item>,
    reverseKeyMapper: Mapper<string, string>,
  ) => {
    scheme.states.forEach((elem) => {
      if (isState(elem)) {
        const key = keyCounter.fire();
        reverseKeyMapper.set(elem.key, key);
        keyMapper.set(key, {
          key,
          source: elem,
          to: {},
        });
      }
    });
  };

  const set = (scheme: FsmScheme) => {};
};
