import { addDamageParticle } from "../effects/damageParticle.js";
import { offsetX, offsetY } from "../camera.js";
import { timer } from "../game.js";
import Nasos from "../Nasos.js";
import { blockingLayer, tileSize, mapWidth } from "../constants.js";
import { g } from "../globals.js";
import { mobs } from "../mobs/mob.js";
import { getVectorFromDirection } from "../utils/getVectorFromDirection.js";
import { getAngleFromDirection } from "../utils/getAngleFromDirection.js";

let projectiles = [];

export const createProjectile = (origin, direction, asset, power) => {
  projectiles.push({
    origin: { ...origin },
    position: { ...origin },
    direction,
    asset,
    power,
    currentFrame: 0,
    range: 400,
    width: tileSize,
    height: tileSize,
    speed: 5,
    animationFrame: 0
  });
};

export const updateProjectiles = () => {
  projectiles = projectiles.filter(projectile => {
    projectile.animationFrame = (projectile.animationFrame + !(timer % 5)) % 4;
    const velocity = getVectorFromDirection(projectile.direction);
    projectile.position.x += velocity.x * projectile.speed;
    projectile.position.y += velocity.y * projectile.speed;

    const hitMob = mobs.find(mob =>
      Nasos.intersects(projectile.position, mob.position)
    );
    if (hitMob) {
      if (hitMob.hp !== undefined) {
        hitMob.hp -= projectile.power;
      }
      addDamageParticle(hitMob.position, projectile.power);
    }

    const hitWall =
      blockingLayer[
        (Math.floor(projectile.position.y / 32) +
          (velocity.y > 0) -
          (velocity.y < 0)) *
          mapWidth +
          Math.floor(projectile.position.x / 32) +
          (velocity.x > 0) -
          (velocity.x < 0)
      ];

    const dx = Math.abs(projectile.position.x - projectile.origin.x);
    const dy = Math.abs(projectile.position.y - projectile.origin.y);
    const rangeExceeded =
      dx * dx + dy * dy > projectile.range * projectile.range;

    return !(hitMob || hitWall || rangeExceeded);
  });
};

export const drawProjectiles = () => {
  projectiles.forEach(projectile => {
    g.save();
    g.translate(
      projectile.position.x - offsetX + tileSize / 2,
      projectile.position.y - offsetY + tileSize / 2
    );
    const angle = getAngleFromDirection(projectile.direction);
    g.rotate(angle);
    g.drawImage(
      projectile.asset,
      projectile.currentFrame * 32,
      0,
      tileSize,
      tileSize,
      -tileSize / 2,
      -tileSize / 2,
      tileSize,
      tileSize
    );
    g.restore();
  });
};
