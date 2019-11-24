import { clear, marginTop, marginLeft } from "./canvas.js";
import {
  assetsLoaded,
  assetsTotal,
  assets,
  characterBases,
  characterBase,
  setCharacterBase,
  hairStyle,
  setHairStyle
} from "./assets.js";
import {
  f,
  frame,
  currentScreen,
  rotation,
  c,
  classDesc,
  villageDesc,
  gameCanvas,
  inventoryX,
  inventoryY,
  tabWidth,
  tabHeight
} from "../globals.js";
import {
  W,
  H,
  gameCanvasX,
  gameCanvasY,
  gameCanvasSize,
  inventoryTabs
} from "../constants.js";
import { startGame } from "./game.js";
import { classClicked, villageClicked } from "./input.js";

export let nameInput;
export let chatInput;
export let chatWindow;
export let activeInventoryTab = 0;

export const loadingScreen = () => {
  clear();
  let loadedProcentage = assetsLoaded / assetsTotal;

  f.strokeStyle = "#3f3";
  f.lineWidth = 17;
  f.lineCap = "round";
  f.shadowBlur = 30;
  f.shadowColor = "#3f3";

  f.beginPath();
  f.arc(W / 2, H / 2, 400, 0, Math.PI * 2 * loadedProcentage);
  f.stroke();

  f.fillStyle = "#3f3";
  let text = Math.floor(loadedProcentage * 100) + "%",
    fontSize = 50;
  f.font = fontSize + "px arial";
  f.fillText(text, W / 2 - f.measureText(text).width / 2, H / 2);

  if (assetsLoaded != assetsTotal) setTimeout(loadingScreen, 50);
  else startGame();
};

export const addNameInput = () => {
  nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.style.position = "absolute";
  nameInput.style.top =
    Math.round(marginTop + 930 * (c.height / frame.height)) + "px";
  nameInput.style.left =
    Math.round(marginLeft + 760 * (c.width / frame.width)) + "px";
  nameInput.style.width = Math.round(400 * (c.width / frame.width)) + "px";
  nameInput.style.height = Math.round(60 * (c.height / frame.height)) + "px";

  nameInput.style.borderRadius = "20px";
  nameInput.style.textAlign = "center";
  nameInput.style.fontSize = Math.round(50 * (c.height / frame.height)) + "px";
  nameInput.style.background = "black";
  nameInput.style.color = "white";
  nameInput.style.outline = "none";
  nameInput.placeholder = "Username";

  document.body.appendChild(nameInput);
};

export const addChat = () => {
  chatWindow = document.createElement("div");
  chatWindow.id = "chat-window";
  chatWindow.style.position = "absolute";
  chatWindow.style.top =
    Math.round(marginTop + 620 * (c.height / frame.height)) + "px";
  chatWindow.style.left =
    Math.round(marginLeft + 1 * (c.width / frame.width)) + "px";
  chatWindow.style.width = Math.round(419 * (c.width / frame.width)) + "px";
  chatWindow.style.height = Math.round(430 * (c.height / frame.height)) + "px";
  chatWindow.style.borderRadius = "5px";
  chatWindow.style.border = "2px solid white";
  chatWindow.style.textAlign = "left";
  chatWindow.style.fontSize = Math.round(20 * (c.height / frame.height)) + "px";
  chatWindow.style.background = "black";
  chatWindow.style.color = "white";
  chatWindow.style.outline = "none";
  chatWindow.style.zIndex = "120";
  chatWindow.style.overflow = "auto";

  chatInput = document.createElement("input");
  chatInput.id = "chat-input";
  chatInput.type = "text";
  chatInput.style.position = "absolute";
  chatInput.style.top =
    Math.round(marginTop + 1050 * (c.height / frame.height)) + "px";
  chatInput.style.left =
    Math.round(marginLeft + 1 * (c.width / frame.width)) + "px";
  chatInput.style.width = Math.round(419 * (c.width / frame.width)) + "px";
  chatInput.style.height = Math.round(30 * (c.height / frame.height)) + "px";
  chatInput.style.borderRadius = "5px";
  chatInput.style.textAlign = "left";
  chatInput.style.fontSize = Math.round(20 * (c.height / frame.height)) + "px";
  chatInput.style.background = "black";
  chatInput.style.color = "white";
  chatInput.style.outline = "none";

  document.body.appendChild(chatInput);
  document.body.appendChild(chatWindow);
};

export const drawButtons = () => {
  // classes
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (classClicked == i + j * 3)
        f.drawImage(
          assets["buttonClicked"],
          33 + i * 205,
          178 + j * 205,
          200,
          200
        );
      else f.drawImage(assets["button"], 30 + i * 205, 175 + j * 205, 200, 200);
      f.drawImage(
        assets["classes"],
        i * 200,
        j * 200,
        200,
        200,
        30 + i * 205,
        180 + j * 205,
        200,
        200
      );
    }
  }

  // villages
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (villageClicked == i + j * 3)
        f.drawImage(
          assets["buttonClicked"],
          1273 + i * 205,
          178 + j * 205,
          200,
          200
        );
      else
        f.drawImage(assets["button"], 1270 + i * 205, 175 + j * 205, 200, 200);
      f.drawImage(
        assets["villages"],
        i * 200,
        j * 200,
        200,
        200,
        1270 + i * 205,
        180 + j * 205,
        200,
        200
      );
    }
  }
};

export const displayInventoryTabs = () => {
  f.font = "20px Monospace";
  for (let i = 0; i < inventoryTabs.length; i++) {
    let len = f.measureText(inventoryTabs[i]).width;
    f.fillStyle = "rgba(255,255,255,0.9)";
    if (activeInventoryTab == i)
      f.drawImage(
        assets["tab"],
        100,
        0,
        100,
        25,
        inventoryX + i * tabWidth,
        inventoryY,
        tabWidth,
        tabHeight
      );
    else
      f.drawImage(
        assets["tab"],
        0,
        0,
        100,
        25,
        inventoryX + i * tabWidth,
        inventoryY,
        tabWidth,
        tabHeight
      );
    f.fillText(
      inventoryTabs[i],
      inventoryX + i * tabWidth + tabWidth / 2 - len / 2,
      inventoryY + 18
    );
  }
};

export const displaySkillSettings = () => {
  f.font = "20px Monospace white";
  f.drawImage(assets["fireball"], 0, 0, 32, 32, 1530, 450, 50, 50);
  f.fillText("Cost: 10    Key: F", 1610, 480);

  f.drawImage(assets["wind"], 0, 0, 32, 32, 1530, 500, 50, 50);
  f.fillText("Cost: 10    Key: Q", 1610, 530);

  f.drawImage(assets["stone"], 0, 0, 32, 32, 1530, 550, 50, 50);
  f.fillText("Cost: 10    Key: S", 1610, 580);

  f.drawImage(assets["water"], 0, 0, 32, 32, 1530, 600, 50, 50);
  f.fillText("Cost: 10    Key: W", 1610, 630);

  f.fillText("Rest        Key: D", 1610, 700);
  f.fillText("Attack      Key: A", 1610, 750);
  f.fillText("Get         Key: G", 1610, 800);
};

export const drawDesc = () => {
  f.font = "20px Monospace";
  f.fillStyle = "#fff";
  let boxW = 600,
    last = 0,
    counter = 0,
    classDescWords = classDesc.split(" "),
    villageDescWords = villageDesc.split(" ");

  while (last < classDescWords.length) {
    let desc = classDescWords[last];
    for (let i = last + 1; i < classDescWords.length; i++) {
      if (classDescWords[i] == "\n") {
        break;
      }
      let textW = f.measureText(desc + " " + classDescWords[i]).width;
      if (textW < boxW) {
        desc += " " + classDescWords[i];
        last = i;
      } else break;
    }
    last++;
    f.fillText(desc, 40, 850 + counter * 25);
    counter++;
  }
  last = 0;
  counter = 0;
  while (last < villageDescWords.length) {
    let desc = villageDescWords[last],
      nl = false;
    for (let i = last + 1; i < villageDescWords.length; i++) {
      if (villageDescWords[i] == "\n") {
        last++;
        nl = true;
        break;
      }
      let textW = f.measureText(desc + " " + villageDescWords[i]).width;
      if (textW < boxW) {
        desc += " " + villageDescWords[i];
        last = i;
      } else break;
    }
    last++;
    f.fillText(desc, 1280, 850 + counter * 25);
    counter += 1 + nl;
  }
};

export const drawCharacter = (x, y, size) => {
  let characterSize = 32;
  f.drawImage(
    assets["characterBase" + characterBases[characterBase]],
    0,
    rotation * characterSize,
    characterSize,
    characterSize,
    x,
    y,
    size,
    size
  );
  if (hairStyle != -1)
    f.drawImage(
      assets["hair"],
      0,
      hairStyle * 4 * characterSize + rotation * characterSize,
      characterSize,
      characterSize,
      x,
      y,
      size,
      size
    );
};

export const redraw = () => {
  if (currentScreen == 1) {
    clear();
    f.drawImage(assets["background"], 0, 0, W, H);
    if (localStorage.slot1Base) {
      setCharacterBase(localStorage.slot1Base);
      setHairStyle(localStorage.slot1Hair);
      drawCharacter(130, 90, 200);
      f.fillStyle = "#fff";
      f.font = "30px Monospace";
      let w = f.measureText(localStorage.slot1Name).width;
      f.fillText(localStorage.slot1Name, 230 - w / 2, 320);
    }
    if (localStorage.slot2Base) {
      setCharacterBase(localStorage.slot2Base);
      setHairStyle(localStorage.slot2Hair);
      drawCharacter(140, 580, 200);
      f.fillStyle = "#fff";
      f.font = "30px Monospace";
      let w = f.measureText(localStorage.slot1Name).width;
      f.fillText(localStorage.slot2Name, 240 - w / 2, 810);
    }
  } else if (currentScreen == 2) {
    clear();
    f.drawImage(assets["characterDesign"], 0, 0, W, H);
    drawButtons();
    drawCharacter(770, 400, 400);
    drawDesc();
  } else if (currentScreen == 3) {
    clear();
    f.drawImage(assets["gameScreen"], 0, 0, W, H);
    f.drawImage(
      gameCanvas,
      gameCanvasX,
      gameCanvasY,
      gameCanvasSize,
      gameCanvasSize
    );
    displayInventoryTabs();
    displaySkillSettings();
    requestAnimationFrame(redraw);
  }
};
