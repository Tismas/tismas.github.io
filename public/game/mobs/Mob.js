import { tileSize, screenSize } from "../constants.js";
import { g } from "../globals.js";
import { offsetX, offsetY } from "../camera.js";

export class Mob {
  constructor(x, y, type, sprite, hp, respawnTime) {
    this.x = x * tileSize;
    this.y = y * tileSize;
    this.type = type;
    this.sprite = sprite;
    this.frame = 0;
    this.dir = 0;
    this.hp = hp;
    this.maxHp = hp;
    this.dead = false;
    this.respawnTime = respawnTime || 10000;
  }

  deathCheck() {
    if (this.hp <= 0) {
      this.dead = true;
      setTimeout(this.respawn.bind(this), this.respawnTime);
    }
  }

  respawn() {
    this.dead = false;
    this.hp = this.maxHp;
  }

  draw() {
    if (this.dead) return;
    let x = this.x - offsetX,
      y = this.y - offsetY;
    if (
      x > -tileSize &&
      y > -tileSize &&
      x < screenSize + tileSize &&
      y < screenSize + tileSize
    )
      g.drawImage(
        this.sprite,
        this.frame * tileSize,
        this.dir * tileSize,
        tileSize,
        tileSize,
        x,
        y,
        tileSize,
        tileSize
      );
  }

  update() {
    if (this.dead) return;
  }

  getTile() {
    return { x: Math.round(this.x / 32), y: Math.round(this.y / 32) };
  }
}
