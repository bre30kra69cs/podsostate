const compareState = (statesL: string[], statesR: string[]) => {
  return statesL.every((state) => statesR.includes(state));
};

export const compareStates = (statesL: string[], statesR: string[]) => {
  if (statesL.length !== statesR.length) {
    return false;
  }

  return compareState(statesL, statesR) && compareState(statesR, statesL);
};
