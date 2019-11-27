import { tileSize, screenSize } from "../constants.js";

export const isInViewport = (x, y) => {
  return (
    x > -tileSize &&
    y > -tileSize &&
    x < screenSize + tileSize &&
    y < screenSize + tileSize
  );
};
