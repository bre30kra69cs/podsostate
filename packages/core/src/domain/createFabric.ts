import {check} from '../utils/check';
import {compose} from '../utils/compose';
import {validateScheme} from './validateScheme';

import {Scheme} from '../types/core';

const createFabric = <T extends Scheme>(scheme: T) => {
  validateScheme(scheme);
};
