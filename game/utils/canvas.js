import { f, ctx, c, frame } from "../globals.js";
import { nameInput, chatInput, chatWindow } from "./ui.js";
import { W, H } from "../constants.js";

const aspectRatio = 16 / 9;
export let marginTop = 0;
export let marginLeft = 0;

export const clear = () => {
  f.fillStyle = "#000";
  f.fillRect(0, 0, W, H);
};
export const flip = () => {
  ctx.drawImage(frame, 0, 0, c.width, c.height);
  requestAnimationFrame(flip);
};
export const resizeCallback = () => {
  let w = window.innerWidth,
    h = window.innerHeight,
    aspectW = h * aspectRatio,
    aspectH = w / aspectRatio;

  if (aspectW > w) {
    marginTop = (h - aspectH) / 2;
    marginLeft = 0;
    c.style.marginLeft = 0;
    c.style.marginTop = marginTop + "px";
    c.width = w;
    c.height = aspectH;
  } else {
    marginLeft = (w - aspectW) / 2;
    marginTop = 0;
    c.style.marginLeft = marginLeft + "px";
    c.style.marginTop = 0;
    c.width = aspectW;
    c.height = h;
  }

  if (nameInput) {
    nameInput.style.top =
      Math.round(marginTop + 930 * (c.height / frame.height)) + "px";
    nameInput.style.left =
      Math.round(marginLeft + 760 * (c.width / frame.width)) + "px";
    nameInput.style.width = Math.round(400 * (c.width / frame.width)) + "px";
    nameInput.style.height = Math.round(60 * (c.height / frame.height)) + "px";
    nameInput.style.fontSize =
      Math.round(50 * (c.height / frame.height)) + "px";
  }
  if (chatInput) {
    chatInput.style.top =
      Math.round(marginTop + 1050 * (c.height / frame.height)) + "px";
    chatInput.style.left =
      Math.round(marginLeft + 1 * (c.width / frame.width)) + "px";
    chatInput.style.width = Math.round(419 * (c.width / frame.width)) + "px";
    chatInput.style.height = Math.round(30 * (c.height / frame.height)) + "px";
    chatInput.style.fontSize =
      Math.round(20 * (c.height / frame.height)) + "px";
  }
  if (chatWindow) {
    chatWindow.style.top =
      Math.round(marginTop + 620 * (c.height / frame.height)) + "px";
    chatWindow.style.left =
      Math.round(marginLeft + 1 * (c.width / frame.width)) + "px";
    chatWindow.style.width = Math.round(419 * (c.width / frame.width)) + "px";
    chatWindow.style.height =
      Math.round(430 * (c.height / frame.height)) + "px";
    chatWindow.style.fontSize =
      Math.round(20 * (c.height / frame.height)) + "px";
  }
};
