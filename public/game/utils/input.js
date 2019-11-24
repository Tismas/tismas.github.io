import Nasos from "../Nasos.js";
import {
  frame,
  c,
  currentScreen,
  inventoryX,
  inventoryY,
  tabWidth,
  tabHeight,
  slotUsed,
  setSlotUsed,
  setClassDesc,
  setVillageDesc,
  rotation,
  setRotation,
  customMenu
} from "../globals.js";
import { marginLeft, marginTop } from "./canvas.js";
import {
  inventoryTabs,
  classDescriptions,
  villageDescriptions
} from "../constants.js";
import {
  characterBases,
  setCharacterBase,
  hairStyle,
  setHairStyle,
  characterBase
} from "./assets.js";
import { game, createCharacter, hairStylesCount } from "./game.js";
import { redraw, nameInput } from "./ui.js";
import { contextMenu } from "./contextMenu.js";

export const keys = {};
export let mousePoint;
export let classClicked = -1;
export let villageClicked = -1;

export const keydownCallback = e => {
  if (e.keyCode == 35 || e.keyCode == 36 || e.keyCode == 37) keys.left = true;
  if (e.keyCode == 33 || e.keyCode == 36 || e.keyCode == 38) keys.up = true;
  if (e.keyCode == 33 || e.keyCode == 34 || e.keyCode == 39) keys.right = true;
  if (e.keyCode == 34 || e.keyCode == 35 || e.keyCode == 40) keys.down = true;
  if (e.keyCode == 65) keys.a = true;
  if (e.keyCode == 66) keys.b = true;
  if (e.keyCode == 67) keys.c = true;
  if (e.keyCode == 68) keys.d = true;
  if (e.keyCode == 69) keys.e = true;
  if (e.keyCode == 70) keys.f = true;
  if (e.keyCode == 71) keys.g = true;
  if (e.keyCode == 72) keys.h = true;
  if (e.keyCode == 73) keys.i = true;
  if (e.keyCode == 74) keys.j = true;
  if (e.keyCode == 75) keys.k = true;
  if (e.keyCode == 76) keys.l = true;
  if (e.keyCode == 77) keys.m = true;
  if (e.keyCode == 78) keys.n = true;
  if (e.keyCode == 79) keys.o = true;
  if (e.keyCode == 80) keys.p = true;
  if (e.keyCode == 81) keys.q = true;
  if (e.keyCode == 82) keys.r = true;
  if (e.keyCode == 83) keys.s = true;
  if (e.keyCode == 84) keys.t = true;
  if (e.keyCode == 85) keys.u = true;
  if (e.keyCode == 86) keys.v = true;
  if (e.keyCode == 87) keys.w = true;
  if (e.keyCode == 88) keys.x = true;
  if (e.keyCode == 89) keys.y = true;
  if (e.keyCode == 90) keys.z = true;
};

export const keyupCallback = e => {
  if (e.keyCode == 35 || e.keyCode == 36 || e.keyCode == 37) keys.left = false;
  if (e.keyCode == 33 || e.keyCode == 36 || e.keyCode == 38) keys.up = false;
  if (e.keyCode == 33 || e.keyCode == 34 || e.keyCode == 39) keys.right = false;
  if (e.keyCode == 34 || e.keyCode == 35 || e.keyCode == 40) keys.down = false;
  if (e.keyCode == 65) keys.a = false;
  if (e.keyCode == 66) keys.b = false;
  if (e.keyCode == 67) keys.c = false;
  if (e.keyCode == 68) keys.d = false;
  if (e.keyCode == 69) keys.e = false;
  if (e.keyCode == 70) keys.f = false;
  if (e.keyCode == 71) keys.g = false;
  if (e.keyCode == 72) keys.h = false;
  if (e.keyCode == 73) keys.i = false;
  if (e.keyCode == 74) keys.j = false;
  if (e.keyCode == 75) keys.k = false;
  if (e.keyCode == 76) keys.l = false;
  if (e.keyCode == 77) keys.m = false;
  if (e.keyCode == 78) keys.n = false;
  if (e.keyCode == 79) keys.o = false;
  if (e.keyCode == 80) keys.p = false;
  if (e.keyCode == 81) keys.q = false;
  if (e.keyCode == 82) keys.r = false;
  if (e.keyCode == 83) keys.s = false;
  if (e.keyCode == 84) keys.t = false;
  if (e.keyCode == 85) keys.u = false;
  if (e.keyCode == 86) keys.v = false;
  if (e.keyCode == 87) keys.w = false;
  if (e.keyCode == 88) keys.x = false;
  if (e.keyCode == 89) keys.y = false;
  if (e.keyCode == 90) keys.z = false;
};

export const onblurCallback = e => {
  for (let key in keys) {
    keys[key] = false;
  }
};

export const clickCallback = e => {
  let canvasX = Math.round((e.clientX - marginLeft) * (frame.width / c.width)),
    canvasY = Math.round((e.clientY - marginTop) * (frame.height / c.height));
  let clickPoint = { x: canvasX, y: canvasY };
  if (currentScreen == 1) {
    if (
      Nasos.collidePR(clickPoint, { x: 100, y: 370, width: 130, height: 40 })
    ) {
      createCharacter(1);
    } else if (
      Nasos.collidePR(clickPoint, { x: 100, y: 880, width: 130, height: 40 })
    ) {
      createCharacter(2);
    } else if (
      Nasos.collidePR(clickPoint, { x: 240, y: 370, width: 130, height: 40 })
    ) {
      if (localStorage.slot1Base) {
        setSlotUsed(1);
        setCharacterBase(localStorage.slot1Base);
        setHairStyle(localStorage.slot1Hair);
        game(true);
      } else {
        alert("You don't have any character on the first slot.");
      }
    } else if (
      Nasos.collidePR(clickPoint, { x: 240, y: 880, width: 130, height: 40 })
    ) {
      if (localStorage.slot2Base) {
        setSlotUsed(2);
        setCharacterBase(localStorage.slot2Base);
        setHairStyle(localStorage.slot2Hair);
        game(true);
      } else {
        alert("You don't have any character on the second slot.");
      }
    }
  } else if (currentScreen == 2) {
    // classes
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (
          Nasos.collidePR(clickPoint, {
            x: 30 + i * 205,
            y: 175 + j * 205,
            width: 200,
            height: 200
          })
        ) {
          classClicked = i + j * 3;
          setClassDesc(classDescriptions[i + j * 3]);
          redraw();
        }
      }
    }
    // villages
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (
          Nasos.collidePR(clickPoint, {
            x: 1270 + i * 205,
            y: 175 + j * 205,
            width: 200,
            height: 200
          })
        ) {
          villageClicked = i + j * 3;
          setVillageDesc(villageDescriptions[i + j * 3]);
          redraw();
        }
      }
    }
    // arrows
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 4; j++) {
        if (
          Nasos.collidePR(clickPoint, {
            x: 705 + i * 388,
            y: 355 + j * 129,
            width: 118,
            height: 67
          })
        ) {
          if (i == 0 && j == 0) {
            setHairStyle(hairStyle - 1);
            if (hairStyle < -1) setHairStyle(hairStylesCount - 1);
            redraw();
          } else if (i == 1 && j == 0) {
            setHairStyle(hairStyle + 1);
            if (hairStyle == hairStylesCount) setHairStyle(-1);
            redraw();
          } else if (i == 0 && j == 1) {
            setCharacterBase(characterBase - 1);
            if (characterBase < 0) setCharacterBase(characterBases.length - 1);
            redraw();
          } else if (i == 1 && j == 1) {
            setCharacterBase(characterBase + 1);
            if (characterBase == characterBases.length) setCharacterBase(0);
            redraw();
          } else if (i == 0 && j == 3) {
            setRotation(rotation - 1);
            if (rotation < 0) setRotation(3);
            redraw();
          } else if (i == 1 && j == 3) {
            setRotation(rotation + 1);
            if (rotation == 4) setRotation(0);
            redraw();
          }
        }
      }
    }
    if (
      Nasos.collidePR(clickPoint, { x: 690, y: 0, width: 542, height: 224 })
    ) {
      redraw();
      if (classClicked == -1) {
        f.fillStyle = "#f33";
        f.font = "40px bold";
        f.fillText("You need to choose a class.", 740, 300);
      } else if (villageClicked == -1) {
        f.fillStyle = "#f33";
        f.font = "40px bold";
        f.fillText("You need to choose a village.", 740, 300);
      } else if (nameInput.value.length == 0) {
        f.fillStyle = "#f33";
        f.font = "40px bold";
        f.fillText("Insert your name below.", 740, 300);
      } else if (nameInput.value.length < 3) {
        f.fillStyle = "#f33";
        f.font = "35px bold";
        f.fillText("Your username should contain", 750, 280);
        f.fillText("at least 3 characters.", 820, 315);
      } else {
        if (slotUsed == 1) {
          localStorage.slot1Base = characterBase;
          localStorage.slot1Hair = hairStyle;
          localStorage.slot1Name = nameInput.value;
          localStorage.slot1Class = classClicked;
          localStorage.slot1Village = villageClicked;
        }

        if (slotUsed == 2) {
          localStorage.slot2Base = characterBase;
          localStorage.slot2Hair = hairStyle;
          localStorage.slot2Name = nameInput.value;
          localStorage.slot2Class = classClicked;
          localStorage.slot2Village = villageClicked;
        }
        game(false);
      }
    }
  } else if (currentScreen == 3) {
    if (contextMenu.open) {
      contextMenu.open = false;
      customMenu.style.display = "none";
    }
    for (let i = 0; i < inventoryTabs.length; i++) {
      if (
        Nasos.collidePR(clickPoint, {
          x: inventoryX + tabWidth * i,
          y: inventoryY,
          width: tabWidth,
          height: tabHeight
        })
      ) {
        activeInventoryTab = i;
        break;
      }
    }
  }
};

export const mouseMoveCallback = e => {
  let ratioW = frame.width / c.width,
    ratioH = frame.height / c.height,
    canvasX = Math.round((e.clientX - marginLeft) * ratioW),
    canvasY = Math.round((e.clientY - marginTop) * ratioH);
  mousePoint = { x: canvasX, y: canvasY };

  if (
    currentScreen == 1 &&
    (Nasos.collidePR(mousePoint, {
      x: 100,
      y: 370,
      width: 130,
      height: 40
    }) ||
      Nasos.collidePR(mousePoint, {
        x: 100,
        y: 880,
        width: 130,
        height: 40
      }) ||
      Nasos.collidePR(mousePoint, {
        x: 240,
        y: 370,
        width: 130,
        height: 40
      }) ||
      Nasos.collidePR(mousePoint, { x: 240, y: 880, width: 130, height: 40 }))
  ) {
    c.style.cursor = "pointer";
  } else if (currentScreen == 2) {
    let pointer = false;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (
          Nasos.collidePR(mousePoint, {
            x: 30 + i * 205,
            y: 175 + j * 205,
            width: 200,
            height: 200
          })
        ) {
          pointer = true;
          break;
        }
      }
    }
    if (!pointer) {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (
            Nasos.collidePR(mousePoint, {
              x: 1270 + i * 205,
              y: 175 + j * 205,
              width: 200,
              height: 200
            })
          ) {
            pointer = true;
            break;
          }
        }
      }
    }
    if (!pointer) {
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 4; j++) {
          if (
            Nasos.collidePR(mousePoint, {
              x: 705 + i * 388,
              y: 355 + j * 129,
              width: 118,
              height: 67
            })
          ) {
            pointer = true;
            break;
          }
        }
      }
    }
    if (
      !pointer &&
      Nasos.collidePR(mousePoint, { x: 690, y: 0, width: 542, height: 224 })
    )
      pointer = true;
    if (pointer) c.style.cursor = "pointer";
    else c.style.cursor = "auto";
  } else {
    let pointer = false;
    for (let i = 0; i < inventoryTabs.length; i++) {
      if (
        !pointer &&
        Nasos.collidePR(mousePoint, {
          x: inventoryX + tabWidth * i,
          y: inventoryY,
          width: tabWidth,
          height: tabHeight
        })
      ) {
        pointer = true;
        break;
      }
    }

    if (pointer) c.style.cursor = "pointer";
    else c.style.cursor = "auto";
  }
};
