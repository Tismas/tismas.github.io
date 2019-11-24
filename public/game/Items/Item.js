import { tileSize, screenSize } from "../constants.js";
import { offsetX, offsetY } from "../camera.js";
import { assets } from "../utils/assets.js";
import { g } from "../globals.js";

export const featherID = 0;

export class Item {
  constructor(x, y, id) {
    this.x = x * tileSize;
    this.y = y * tileSize;
    this.id = id;
    if (this.id == featherID) {
      this.name = "Feather";
      this.type = "item";
    }
  }

  draw() {
    let x = this.x - offsetX,
      y = this.y - offsetY;
    if (
      x > -tileSize &&
      y > -tileSize &&
      x < screenSize + tileSize &&
      y < screenSize + tileSize
    )
      g.drawImage(
        assets["items"],
        this.id * tileSize,
        0,
        tileSize,
        tileSize,
        x,
        y,
        tileSize,
        tileSize
      );
  }
}
