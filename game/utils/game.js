import { initGame } from "../game.js";
import { assets, setHairStyle, setCharacterBase } from "./assets.js";
import {
  f,
  setCurrentScreen,
  setRotation,
  setSlotUsed,
  slotUsed,
  setChatInputEl
} from "../globals.js";
import { redraw, addChat, nameInput, addNameInput } from "./ui.js";

export let hairStylesCount = 0;

export const startGame = () => {
  hairStylesCount = assets["hair"].height / 128;
  f.shadowBlur = 0;
  setCurrentScreen(1);
  redraw();
};

export const createCharacter = slot => {
  setHairStyle(-1);
  setCharacterBase(0);
  setCurrentScreen(2);
  setSlotUsed(slot);
  addNameInput();
  redraw();
};

export const game = loading => {
  setRotation(0);
  setCurrentScreen(3);
  if (!loading) nameInput.remove();
  addChat();
  redraw();
  initGame(slotUsed, loading);
  setChatInputEl(document.getElementById("chat-input"));
};
