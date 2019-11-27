import { Mob } from "./Mob.js";
import { createFeather } from "../Items/feather.js";
import { assets } from "../utils/assets.js";
import { tileSize } from "../constants.js";

export class Chicken extends Mob {
  static ID = 101;

  constructor(x, y) {
    super(x, y, Chicken.ID, assets["chicken"], 1);
    this.name = "Chicken";
  }

  deathCheck() {
    if (!this.dead && this.hp <= 0) {
      this.dead = true;
      let t = this.getTile();
      createFeather(t.x * tileSize, t.y * tileSize);
      setTimeout(this.respawn.bind(this), this.respawnTime);
    }
  }
}
