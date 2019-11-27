import { spawnMob } from "./mob.js";
import { createFeather } from "../items/itemCreators.js";
import { assets } from "../utils/assets.js";

const chickedID = 101;
const treestumpID = 6;

export const spawnChicken = (x, y) => {
  spawnMob(
    { x, y },
    {
      name: "Chicken",
      respawnTime: 10000,
      spawn: () => spawnChicken(x, y),
      hp: 10,
      sprite: assets["chicken"],
      drops: [
        {
          createDrop: createFeather,
          probability: 1
        }
      ]
    }
  );
};

export const spawnTreestump = (x, y) => {
  spawnMob(
    { x, y },
    {
      name: "Treestump",
      sprite: assets["treestump"],
      drops: []
    }
  );
};

export const spawners = {
  [chickedID]: spawnChicken,
  [treestumpID]: spawnTreestump
};
