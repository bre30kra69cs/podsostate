export interface Locker {
  lock: () => boolean;
  unlock: () => boolean;
  reverse: () => boolean;
  isUnlocked: () => boolean;
}

export const createLocker = (init: boolean = true): Locker => {
  let unlocked = init;

  const lock = () => {
    unlocked = false;
    return unlocked;
  };

  const unlock = () => {
    unlocked = true;
    return unlocked;
  };

  const reverse = () => {
    unlocked = !unlocked;
    return unlocked;
  };

  const isUnlocked = () => {
    return unlocked;
  };

  return {
    lock,
    unlock,
    reverse,
    isUnlocked,
  };
};
