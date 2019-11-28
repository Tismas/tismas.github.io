const angles = {
  1: Math.PI * 0.75,
  2: Math.PI / 2,
  3: Math.PI / 4,
  4: Math.PI,
  6: 0,
  7: -Math.PI * 0.75,
  8: -Math.PI / 2,
  9: -Math.PI / 4
};

export const getAngleFromDirection = direction => {
  return angles[direction];
};
