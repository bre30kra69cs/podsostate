import {check} from '../utils/check';
import {pipe} from '../utils/compose';
import {validateScheme, validationUpgrade} from './validateScheme';
import {MachineFabricConfig, Scheme} from '../types/core';
import {mergeArr} from '../utils/merge';

const createMachineFabric = <T extends MachineFabricConfig>(config: T) => {
  const upgrades = mergeArr(config?.upgrades, [validationUpgrade], {
    order: 'before',
  });
  const upgradeConfigPipe = pipe(upgrades);
  const upgradedConfig = upgradeConfigPipe(config);

  const createMachine = <T extends Scheme>(scheme: T) => {
    validateScheme(scheme, upgradedConfig.validationRules);
  };

  return {createMachine};
};
