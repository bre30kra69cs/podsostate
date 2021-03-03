export interface FsmCoord {
  getX: () => number;
  getY: () => number;
  serialize: () => string;
  equal: (ccord: FsmCoord) => boolean;
}

export const createCoord = (x: number, y: number): FsmCoord => {
  const getX = () => {
    return x;
  };

  const getY = () => {
    return y;
  };

  const serialize = () => {
    return `${x}x${y}`;
  };

  const equal = (coord: FsmCoord) => {
    return x === coord.getX() && y === coord.getY();
  };

  return {
    getX,
    getY,
    serialize,
    equal,
  };
};