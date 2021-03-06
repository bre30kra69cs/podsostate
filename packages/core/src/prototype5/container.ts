import {createMapper, Mapper} from '../common/createMapper';
import {createCounter} from '../common/createCounter';
import {isScheme, isState, FsmScheme, FsmState, FsmSchemeOrState} from './scheme';

interface Item {
  key: string;
  source: any;
  to: Record<string, Item>;
}

const idCounter = createCounter((current) => `${current}`);

export const createContainer = () => {
  const setIter = (scheme: FsmScheme) => {
    const id2key = createMapper<string, string>();
    const key2id = createMapper<string, string>();
    scheme.states.forEach((item) => {
      if (isState(item)) {
        const id = idCounter.fire();
        key2id.set(item.key, id);
        id2key.set(id, item.key);
      }
    });
    scheme.states.forEach((item) => {});
  };

  const set = (scheme: FsmScheme) => {};
};
