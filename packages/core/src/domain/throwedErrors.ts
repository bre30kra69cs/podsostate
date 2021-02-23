import {throwError} from '../utils/throwError';

export const throwValidationError = (machineName: string, ruleMessage?: string) => {
  const extraMessage = ruleMessage ? ` ${ruleMessage}` : '';
  throwError(`Machine "${machineName}" don't pass validation rules.${extraMessage}`);
};
