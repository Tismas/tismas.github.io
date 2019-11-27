import { offsetX, offsetY } from "../camera.js";
import { tileSize, screenSize } from "../constants.js";
import { g } from "../globals.js";
import { Mob } from "./Mob.js";
import { assets } from "../utils/assets.js";

export class Treestump extends Mob {
  static ID = 6;

  constructor(x, y) {
    super(x, y, Treestump.ID, null, 1);
    this.name = "Treestump";
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
        assets["tiles"],
        (Treestump.ID - 1) * tileSize,
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
