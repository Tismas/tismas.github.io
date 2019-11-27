import { tileSize } from "../constants.js";
import { g } from "../globals.js";
import { offsetX, offsetY } from "../camera.js";
import { isInViewport } from "../utils/isInViewport.js";
import { addItemToWorld } from "../items/item.js";
import { roundToTile } from "../utils/tile.js";

export let mobs = [];

export const spawnMob = (position, mob) => {
  mobs.push({ position, ...mob });
};

export const updateMobs = () => {
  mobs = mobs.filter(mob => {
    const isDead = mob.hp !== undefined && mob.hp <= 0;
    if (isDead) {
      if (mob.respawnTime && mob.spawn) {
        setTimeout(mob.spawn, mob.respawnTime);
      }
      mob.drops.forEach(({ createDrop, probability }) => {
        if (Math.random() < probability) {
          addItemToWorld(roundToTile(mob.position), createDrop());
        }
      });
    }
    return !isDead;
  });
};

export const drawMobs = () => {
  mobs.forEach(mob => {
    const x = mob.position.x - offsetX;
    const y = mob.position.y - offsetY;
    if (isInViewport(x, y)) {
      g.drawImage(
        mob.sprite,
        (mob.frame || 0) * tileSize,
        (mob.dir || 0) * tileSize,
        tileSize,
        tileSize,
        x,
        y,
        tileSize,
        tileSize
      );
    }
  });
};
