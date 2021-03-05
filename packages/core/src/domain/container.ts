import {createMapper} from '../common/createMapper';
import {createCounter} from '../common/createCounter';
import {FsmScheme} from './scheme';

type ContainerId = number;

interface Item {
  id: ContainerId;
  sync: Record<ContainerId, Item>;
  to: Record<ContainerId, Item>;
}

const namespaceCounter = createCounter((current) => `ns${current}`);

export const createContainer = () => {
  const mapper = createMapper<ContainerId, Item>();

  const set = (scheme: FsmScheme) => {};
};
