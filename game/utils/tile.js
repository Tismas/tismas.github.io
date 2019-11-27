import { tileSize } from "../constants.js";

const round = v => Math.round(v / tileSize) * tileSize;

export const roundToTile = ({ x, y }) => {
  return { x: round(x), y: round(y) };
};

export const getTile = ({ x, y }) => {
  return { x: Math.round(x / tileSize), y: Math.round(y / tileSize) };
};
