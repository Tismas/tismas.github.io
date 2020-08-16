import { g } from "../globals.js";
import { getTile } from "./tile.js";
import { groundLayer, mapWidth } from "../constants.js";

export const showDebugInfo = (localPlayer, fps) => {
  g.font = "15px Monospace";

  let tileX = getTile(localPlayer.data.position).x,
    tileY = getTile(localPlayer.data.position).y;
  g.fillStyle = "#fff";
  g.fillText("DEBUGING MODE ON", 20, 10);
  g.fillText("x: " + localPlayer.data.position.x, 20, 25);
  g.fillText("y: " + localPlayer.data.position.y, 20, 40);
  g.fillText("Tile x: " + tileX, 20, 55);
  g.fillText("Tile y: " + tileY, 20, 70);
  g.fillText("Dir: " + localPlayer.data.dir, 20, 85);
  g.fillText("Class: " + localPlayer.data.class, 20, 100);
  g.fillText("Village: " + localPlayer.data.village, 20, 115);
  g.fillText("Tile id: " + groundLayer[tileY * mapWidth + tileX], 20, 130);

  g.font = "25px Monospace";
  g.fillText(fps, 575, 22);
};
