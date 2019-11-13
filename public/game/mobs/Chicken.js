import { Mob } from "./Mob.js";
import { assets } from "../setup.js";
import { items } from "../game.js";
import { Item, featherID } from "../Items/Item.js";

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
      items.push(new Item(t.x, t.y, featherID));
      setTimeout(this.respawn.bind(this), this.respawnTime);
    }
  }
}
