import { g } from "../globals.js";
import { tileSize } from "../constants.js";
import { offsetX, offsetY } from "../camera.js";

let damageParticles = [];

export const addDamageParticle = (tileX, tileY, text) => {
  const width = g.measureText(text).width;
  const x = tileX + tileSize / 2 - width / 2;
  const y = tileY + 5;
  damageParticles.push({ x, y, text, opacity: 1 });
};

export const drawDamageParticles = () => {
  damageParticles.forEach(({ x, y, text, opacity }) => {
    g.fillStyle = "rgba(255,255,255," + opacity + ")";
    g.font = "15px Monospace";
    g.fillText(text, x - offsetX, y - offsetY);
  });
};

export const updateDamageParticles = () => {
  damageParticles = damageParticles
    .map(({ y, opacity, ...rest }) => ({
      y: y - 0.5,
      opacity: opacity - 0.04,
      ...rest
    }))
    .filter(({ opacity }) => opacity > 0);
};
