// Project started on 07-09-2016
import { flip, clear, resizeCallback } from "./utils/canvas.js";
import { loadAssets } from "./utils/assets.js";
import {
  clickCallback,
  mouseMoveCallback,
  keydownCallback,
  keyupCallback,
  onblurCallback
} from "./utils/input.js";
import { frame, c, f, ctx, g } from "./globals.js";
import { W, H } from "./constants.js";

const setup = () => {
  frame.width = W;
  frame.height = H;
  window.onresize = resizeCallback;
  c.onclick = clickCallback;
  c.onmousemove = mouseMoveCallback;

  document.onkeydown = keydownCallback;
  document.onkeyup = keyupCallback;
  window.onblur = onblurCallback;

  Math.seedrandom(999);

  f.imageSmoothingEnabled = false;
  g.imageSmoothingEnabled = false;
  ctx.imageSmoothingEnabled = false;

  document.body.appendChild(c);
  resizeCallback();
  clear();
  loadAssets();
  flip();
};

setup();
