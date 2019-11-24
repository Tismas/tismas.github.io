import { g } from "../globals.js";
import { tileSize } from "../constants.js";
import { offsetX, offsetY } from "../camera.js";

export class FlowingText {
  constructor(text, x, y) {
    g.font = "15px Monospace";

    this.text = text;
    this.width = g.measureText(text).width;
    this.x = x + tileSize / 2 - this.width / 2;
    this.y = y + 5;
    this.alpha = 1.0;
  }

  draw() {
    g.fillStyle = "rgba(255,255,255," + this.alpha + ")";
    g.font = "15px Monospace";
    g.fillText(this.text, this.x - offsetX, this.y - offsetY);
    if (this.alpha == 0) flowingTexts.split(flowingTexts.indexOf(this), 1);
  }

  update() {
    this.y -= 0.5;
    this.alpha -= 0.04;
  }
}
