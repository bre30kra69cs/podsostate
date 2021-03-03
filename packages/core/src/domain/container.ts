import {createMapper} from '../common/createMapper';

type ContainerId = number;

interface Item {
  id: ContainerId;
  sync: Record<ContainerId, Item>;
  to: Record<ContainerId, Item>;
}

export const createContainer = () => {
  const mapper = createMapper<ContainerId, Item>();

  const set = () => {};
};
