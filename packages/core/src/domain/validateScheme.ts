import {Scheme, ValidationRule} from '../types/core';
import {throwValidationError} from './throwedErrors';

const wrapValidationRule = (validationRule: ValidationRule): ValidationRule => {
  return (scheme) => {
    const [isPassed, message] = validationRule(scheme);
    if (!isPassed) {
      throwValidationError(scheme.name, message);
    }
    return [isPassed, message];
  };
};

export const initStateValidationRule: ValidationRule = (scheme) => {
  return [
    scheme.nodes.some((node) => node.name === scheme.init),
    `Init node "${scheme.init}" not in nodes.`,
  ];
};

export const transitionFromValidationRule: ValidationRule = (scheme) => {
  const nodesNames = scheme.nodes.map((node) => node.name);
  const transition = scheme.transitions
    .map((transition): [boolean, string] => [nodesNames.includes(transition.from), transition.from])
    .find(([isIncluded]) => !isIncluded);
  const [isIncluded, nodeName] = transition ?? [true, ''];
  const message = !isIncluded
    ? `Transitions (property "from") have node "${nodeName}" that's not included in machine nodes.`
    : '';
  return [isIncluded, message];
};

export const transitionToValidationRule: ValidationRule = (scheme) => {
  const nodesNames = scheme.nodes.map((node) => node.name);
  const transition = scheme.transitions
    .map((transition): [boolean, string] => [nodesNames.includes(transition.to), transition.to])
    .find(([isIncluded]) => !isIncluded);
  const [isIncluded, nodeName] = transition ?? [true, ''];
  const message = !isIncluded
    ? `Transitions (property "to") have node "${nodeName}" that's not included in machine nodes.`
    : '';
  return [isIncluded, message];
};

export const transitionEventValidationRule: ValidationRule = (scheme) => {
  const transition = scheme.transitions
    .map((transition): [boolean, string] => [
      scheme.events.includes(transition.event),
      transition.event,
    ])
    .find(([isIncluded]) => !isIncluded);
  const [isIncluded, eventName] = transition ?? [true, ''];
  const message = !isIncluded
    ? `Transitions (property "event") have event "${eventName}" that's not included in machine events.`
    : '';
  return [isIncluded, message];
};

export const validateScheme = (scheme: Scheme) => {
  const wrappedRules = scheme.validationRules.map(wrapValidationRule);
  wrappedRules.forEach((rule) => rule(scheme));
};
