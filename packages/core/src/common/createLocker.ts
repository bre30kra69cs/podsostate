export const createLocker = (init: boolean = true) => {
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