import { loadingScreen } from "./ui.js";

export const assets = {};
export let assetsLoaded = 0;
export let assetsTotal = 0;
export const characterBases = [""];
export let characterBase = 0;
export let hairStyle = -1;

export const setCharacterBase = base => {
  characterBase = base;
};
export const setHairStyle = style => {
  hairStyle = style;
};

const assetLoadCallback = () => {
  assetsLoaded++;
};

export const addAsset = (name, src) => {
  assets[name] = new Image();
  assets[name].onload = assetLoadCallback;
  assets[name].src = src;
};

export const loadAssets = () => {
  // tiles etc.
  addAsset("background", "assets/ui/menuScreen.png");
  addAsset("characterDesign", "assets/ui/characterScreen.png");
  addAsset("classes", "assets/ui/Classes.png");
  addAsset("button", "assets/ui/Button.png");
  addAsset("buttonClicked", "assets/ui/ButtonClicked.png");
  addAsset("villages", "assets/ui/Villages.png");
  addAsset("characterBase", "assets/character/characterBase.png");
  addAsset("hair", "assets/character/hair.png");
  addAsset("gameScreen", "assets/ui/gameScreen.png");
  addAsset("tab", "assets/ui/tab.png");
  addAsset("tiles", "assets/tiles/tiles.png");
  addAsset("items", "assets/items/items.png");
  addAsset("fireball", "assets/skills/fireball.png");
  addAsset("stone", "assets/skills/stone.png");
  addAsset("water", "assets/skills/water.png");
  addAsset("wind", "assets/skills/windProj.png");

  // entities
  addAsset("chicken", "assets/mobs/chicken.png");
  addAsset("treestump", "assets/mobs/treestump.png");

  // map
  addAsset("minimapMain", "assets/maps/main.png");

  assetsTotal = Object.keys(assets).length;

  loadingScreen();
};
