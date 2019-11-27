import { tileSize } from "../constants.js";
import { offsetX, offsetY } from "../camera.js";
import { assets } from "../utils/assets.js";
import { g } from "../globals.js";
import { isInViewport } from "../utils/isInViewport.js";

export let items = [];

export const pickUpItem = entity => {
  const pickedUpItem = items.find(item => {
    const dx = Math.abs(item.position.x - entity.x) / 32;
    const dy = Math.abs(item.position.y - entity.y) / 32;
    return dx <= 1 && dy <= 1;
  });

  if (pickedUpItem) {
    items = items.filter(item => item !== pickedUpItem);
  }

  return pickedUpItem;
};

export const createItem = (position, name, assetPosition) => {
  items.push({ position, name, assetPosition, type: "item" });
};

const drawItem = (x, y, item) => {
  g.drawImage(
    assets["items"],
    item.assetPosition.x,
    item.assetPosition.y,
    tileSize,
    tileSize,
    x,
    y,
    tileSize,
    tileSize
  );
};

export const drawItems = () => {
  items.forEach(item => {
    const x = item.position.x - offsetX;
    const y = item.position.y - offsetY;
    if (isInViewport(x, y)) {
      drawItem(x, y, item);
    }
  });
};
