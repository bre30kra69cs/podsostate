export interface FsmCoord {
  x: number;
  y: number;
}

export const createAlias = (x: number, y: number): FsmCoord => {
  return {x, y};
};
