import { addDamageParticle } from "../effects/damageParticle.js";
import { offsetX, offsetY } from "../camera.js";
import { timer, spells } from "../game.js";
import Nasos from "../Nasos.js";
import { blockingLayer, tileSize, mapWidth } from "../constants.js";
import { g } from "../globals.js";
import { assets } from "../utils/assets.js";
import { mobs } from "../mobs/mob.js";

export class Spell {
  constructor(x, y, dir, asset, power) {
    this.x = x;
    this.y = y;
    this.originX = x;
    this.originY = y;
    this.dir = dir;
    this.asset = asset;
    this.power = power;
    this.range = 400;
    this.speed = 5;
    this.currentFrame = 0;

    if (this.dir == 1) {
      this.vy = this.speed;
      this.vx = -this.speed;
    } else if (this.dir == 3) {
      this.vy = this.speed;
      this.vx = this.speed;
    } else if (this.dir == 7) {
      this.vy = -this.speed;
      this.vx = -this.speed;
    } else if (this.dir == 9) {
      this.vy = -this.speed;
      this.vx = this.speed;
    } else if (this.dir == 2) {
      this.vy = this.speed;
      this.vx = 0;
    } else if (this.dir == 8) {
      this.vy = -this.speed;
      this.vx = 0;
    } else if (this.dir == 4) {
      this.vx = -this.speed;
      this.vy = 0;
    } else if (this.dir == 6) {
      this.vx = this.speed;
      this.vy = 0;
    }
  }

  update() {
    if (timer % 5 == 0) {
      this.currentFrame++;
      if (this.currentFrame == 4) this.currentFrame = 0;
    }
    this.x += this.vx;
    this.y += this.vy;

    let toDel = false;
    for (let i = 0; i < mobs.length; i++) {
      if (
        Nasos.intersects(
          { x: this.x, y: this.y, width: tileSize, height: tileSize },
          {
            x: mobs[i].position.x,
            y: mobs[i].position.y,
            width: tileSize,
            height: tileSize
          }
        )
      ) {
        if (mobs[i].hp !== undefined) {
          mobs[i].hp -= this.power;
        }
        addDamageParticle(mobs[i].position, this.power);
        toDel = true;
        break;
      }
    }
    if (
      blockingLayer[
        (Math.floor(this.y / 32) + (this.vy > 0) - (this.vy < 0)) * mapWidth +
          Math.floor(this.x / 32) +
          (this.vx > 0) -
          (this.vx < 0)
      ]
    )
      toDel = true;

    let deltaX = Math.abs(this.x - this.originX),
      deltaY = Math.abs(this.y - this.originY);
    if (toDel || Math.sqrt(deltaX * deltaX + deltaY * deltaY) > this.range) {
      spells.splice(spells.indexOf(this), 1);
    }
  }

  draw() {
    g.save();
    g.translate(
      this.x - offsetX + tileSize / 2,
      this.y - offsetY + tileSize / 2
    );
    let angle;
    if (this.dir == 1) angle = Math.PI * 0.75;
    else if (this.dir == 2) angle = Math.PI / 2;
    else if (this.dir == 3) angle = Math.PI / 4;
    else if (this.dir == 4) angle = Math.PI;
    else if (this.dir == 6) angle = 0;
    else if (this.dir == 7) angle = -Math.PI * 0.75;
    else if (this.dir == 8) angle = -Math.PI / 2;
    else if (this.dir == 9) angle = -Math.PI / 4;
    g.rotate(angle);
    g.drawImage(
      assets[this.asset],
      this.currentFrame * 32,
      0,
      tileSize,
      tileSize,
      -tileSize / 2,
      -tileSize / 2,
      tileSize,
      tileSize
    );
    g.restore();
  }
}
