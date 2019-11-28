export const getVectorFromDirection = direction => {
  let x = 0;
  let y = 0;

  if ([1, 4, 7].includes(direction)) {
    x = -1;
  }
  if ([3, 6, 9].includes(direction)) {
    x = 1;
  }
  if ([7, 8, 9].includes(direction)) {
    y = -1;
  }
  if ([1, 2, 3].includes(direction)) {
    y = 1;
  }

  return { x, y };
};
