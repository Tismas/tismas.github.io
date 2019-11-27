import { Mob } from "./Mob.js";
import { addItemToWorld } from "../items/item.js";
import { createFeather } from "../items/itemCreators.js";
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
      const position = { x: t.x * tileSize, y: t.y * tileSize };
      addItemToWorld(position, createFeather());
      setTimeout(this.respawn.bind(this), this.respawnTime);
    }
  }
}
