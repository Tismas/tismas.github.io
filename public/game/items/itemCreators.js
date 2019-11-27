import { createItem } from "./item.js";
import { tileSize } from "../constants.js";

export const createFeather = () => {
  return createItem("Feather", { x: 0, y: 0 });
};

export const createRock = () => {
  return createItem("Rock", { x: tileSize, y: 0 });
};
