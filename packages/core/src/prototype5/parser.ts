import {createReverseMapper} from '../common/createMapper';
import {createCounter} from '../common/createCounter';
import {isState, isScheme, FsmScheme, FsmState} from './scheme';
import {traverse} from './traverse';

interface ParserNode {
  id: string;
  parentId: string | undefined;
  source: FsmScheme;
  childrens: Record<string, ParserNode>;
}

const counter = createCounter((current) => `id${current}`);

export const parse = (scheme: FsmScheme) => {
  const mapper = createReverseMapper<string, FsmScheme>();

  const root = traverse(scheme, {
    onSchemeDown: (target) => {
      const id = counter.fire();
      const nextTarget = {...target};
      mapper.set(id, nextTarget);
      return nextTarget;
    },
    onSchemeLift: (target, parent, childrens: ParserNode[]): ParserNode => {
      const id = mapper.getKey(target) as string;
      const parentId = parent ? mapper.getKey(parent) : undefined;
      return {
        id,
        parentId,
        source: target,
        childrens: childrens.reduce((acc, next) => {
          return {
            ...acc,
            [next.id]: next,
          };
        }, {}),
      };
    },
  });

  return root;
};
