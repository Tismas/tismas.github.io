import { createItem } from "./item.js";

export const createFeather = (x, y) => {
  createItem({ x, y }, "Feather", { x: 0, y: 0 });
};
