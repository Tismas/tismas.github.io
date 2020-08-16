import Nasos from "./Nasos.js";
import {
  tileSize,
  mapHeight,
  mapWidth,
  tilesetColumns,
  layers,
  halfOfTileCount,
  screenSize,
  canvasTileCount,
  entitiesLayer,
  groundLayer,
  gameCanvasX,
  gameCanvasSize,
  gameCanvasY,
  mapSize,
  mapX,
  mapY,
  chatWindow,
} from "./constants.js";
import { mobs, drawMobs, updateMobs } from "./mobs/mob.js";
import { spawners } from "./mobs/mobSpawners.js";
import { offsetX, offsetY } from "./camera.js";
import { Player } from "./player/Player.js";
import { assets } from "./utils/assets.js";
import {
  g,
  c,
  frame,
  gameCanvas,
  f,
  inventoryX,
  inventoryY,
  customMenu,
} from "./globals.js";
import { chatInput, activeInventoryTab } from "./utils/ui.js";
import { mousePoint } from "./utils/input.js";
import { marginLeft, marginTop } from "./utils/canvas.js";
import { contextMenu } from "./utils/contextMenu.js";
import {
  drawDamageParticles,
  updateDamageParticles,
} from "./effects/damageParticle.js";
import { drawItems, items } from "./items/item.js";
import { getTile } from "./utils/tile.js";
import { drawProjectiles, updateProjectiles } from "./player/projectile.js";

export let debugging = false,
  framesThisSecond = 0,
  fps = 0,
  frameRate = 60,
  localPlayer,
  timer = 0;

export let initGame = (slot, gameContinued) => {
  localPlayer = new Player(5, 5, slot);
  let lastUpdate = new Date().getTime(),
    currentSlot = slot,
    debug = () => {
      g.font = "15px Monospace";

      let tileX = getTile(localPlayer.position).x,
        tileY = getTile(localPlayer.position).y;
      g.fillStyle = "#fff";
      g.fillText("DEBUGING MODE ON", 20, 10);
      g.fillText("x: " + localPlayer.position.x, 20, 25);
      g.fillText("y: " + localPlayer.position.y, 20, 40);
      g.fillText("Tile x: " + tileX, 20, 55);
      g.fillText("Tile y: " + tileY, 20, 70);
      g.fillText("Dir: " + localPlayer.dir, 20, 85);
      g.fillText("Class: " + localPlayer.class, 20, 100);
      g.fillText("Village: " + localPlayer.village, 20, 115);
      g.fillText("Tile id: " + groundLayer[tileY * mapWidth + tileX], 20, 130);

      g.font = "25px Monospace";
      g.fillText(fps, 575, 22);
    },
    fpsCounter = () => {
      fps = framesThisSecond;
      framesThisSecond = 0;
    },
    save = () => {
      if (currentSlot == 1) {
        localStorage.slot1x = localPlayer.position.x;
        localStorage.slot1y = localPlayer.position.y;
        localStorage.slot1maxHealth = localPlayer.maxHealth;
        localStorage.slot1health = localPlayer.health;
        localStorage.slot1maxMana = localPlayer.maxMana;
        localStorage.slot1mana = localPlayer.mana;
        localStorage.slot1maxStamina = localPlayer.maxStamina;
        localStorage.slot1stamina = localPlayer.stamina;
        localStorage.slot1moveSpeed = localPlayer.moveSpeed;
        localStorage.slot1castSpeed = localPlayer.castSpeed;
        localStorage.slot1reflex = localPlayer.reflex;
        localStorage.slot1strength = localPlayer.strength;
        localStorage.slot1mp = localPlayer.mp;
        localStorage.slot1im = localPlayer.im;
        localStorage.slot1dir = localPlayer.dir;
        localStorage.slot1Inventory = JSON.stringify(localPlayer.inventory);
      }
      if (currentSlot == 2) {
        localStorage.slot2x = localPlayer.position.x;
        localStorage.slot2y = localPlayer.position.y;
        localStorage.slot2maxHealth = localPlayer.maxHealth;
        localStorage.slot2health = localPlayer.health;
        localStorage.slot2maxMana = localPlayer.maxMana;
        localStorage.slot2mana = localPlayer.mana;
        localStorage.slot2maxStamina = localPlayer.maxStamina;
        localStorage.slot2stamina = localPlayer.stamina;
        localStorage.slot2moveSpeed = localPlayer.moveSpeed;
        localStorage.slot2castSpeed = localPlayer.castSpeed;
        localStorage.slot2reflex = localPlayer.reflex;
        localStorage.slot2strength = localPlayer.strength;
        localStorage.slot2mp = localPlayer.mp;
        localStorage.slot2im = localPlayer.im;
        localStorage.slot2dir = localPlayer.dir;
        localStorage.slot2Inventory = JSON.stringify(localPlayer.inventory);
      }
    },
    load = () => {
      if (currentSlot == 1 && gameContinued) {
        localPlayer.position.x = Number(localStorage.slot1x);
        localPlayer.position.y = Number(localStorage.slot1y);
        localPlayer.maxHealth = Number(localStorage.slot1maxHealth);
        localPlayer.health = Number(localStorage.slot1health);
        localPlayer.maxMana = Number(localStorage.slot1maxMana);
        localPlayer.mana = Number(localStorage.slot1mana);
        localPlayer.maxStamina = Number(localStorage.slot1maxStamina);
        localPlayer.stamina = Number(localStorage.slot1stamina);
        localPlayer.moveSpeed = Number(localStorage.slot1moveSpeed);
        localPlayer.castSpeed = Number(localStorage.slot1castSpeed);
        localPlayer.reflex = Number(localStorage.slot1reflex);
        localPlayer.strength = Number(localStorage.slot1strength);
        localPlayer.mp = Number(localStorage.slot1mp);
        localPlayer.im = Number(localStorage.slot1im);
        localPlayer.dir = Number(localStorage.slot1dir);
        localPlayer.inventory = JSON.parse(localStorage.slot1Inventory || "[]");
        localPlayer.currentFrame = 0;
      } else if (currentSlot == 2 && gameContinued) {
        localPlayer.position.x = Number(localStorage.slot2x);
        localPlayer.position.y = Number(localStorage.slot2y);
        localPlayer.maxHealth = Number(localStorage.slot2maxHealth);
        localPlayer.health = Number(localStorage.slot2health);
        localPlayer.maxMana = Number(localStorage.slot2maxMana);
        localPlayer.mana = Number(localStorage.slot2mana);
        localPlayer.maxStamina = Number(localStorage.slot2maxStamina);
        localPlayer.stamina = Number(localStorage.slot2stamina);
        localPlayer.moveSpeed = Number(localStorage.slot2moveSpeed);
        localPlayer.castSpeed = Number(localStorage.slot2castSpeed);
        localPlayer.reflex = Number(localStorage.slot2reflex);
        localPlayer.strength = Number(localStorage.slot2strength);
        localPlayer.mp = Number(localStorage.slot2mp);
        localPlayer.im = Number(localStorage.slot2im);
        localPlayer.dir = Number(localStorage.slot2dir);
        localPlayer.inventory = JSON.parse(localStorage.slot2Inventory || "[]");
        localPlayer.currentFrame = 0;
      }
    },
    clearGameCanvas = () => {
      g.fillStyle = "#000";
      g.fillRect(0, 0, screenSize, screenSize);
    },
    setupGameCanvas = () => {
      gameCanvas.width = screenSize;
      gameCanvas.height = screenSize;
    },
    contextMenuCallback = (e) => {
      e.preventDefault();
      let ratioW = frame.width / c.width,
        ratioH = frame.height / c.height,
        canvasX = Math.round((e.clientX - marginLeft) * ratioW),
        canvasY = Math.round((e.clientY - marginTop) * ratioH);
      contextMenu.x =
        (canvasX - gameCanvasX) * (gameCanvas.width / gameCanvasSize);
      contextMenu.y =
        (canvasY - gameCanvasY) * (gameCanvas.height / gameCanvasSize);
      if (
        contextMenu.x > 0 &&
        contextMenu.x < gameCanvas.width &&
        contextMenu.y > 0 &&
        contextMenu.y < gameCanvas.height
      ) {
        let options = "",
          optionCount = 0;

        for (let i = 0; i < mobs.length; i++) {
          if (
            Nasos.collidePR(contextMenu, {
              x: mobs[i].position.x - offsetX,
              y: mobs[i].position.y - offsetY,
              width: tileSize,
              height: tileSize,
            })
          ) {
            optionCount++;
            options += `<li class='option'> ${mobs[i].name} </li>`;
          }
        }
        for (let i = 0; i < items.length; i++) {
          if (
            Nasos.collidePR(contextMenu, {
              x: items[i].position.x - offsetX,
              y: items[i].position.y - offsetY,
              width: tileSize,
              height: tileSize,
            })
          ) {
            optionCount++;
            options += `<li class='option'> ${items[i].name} </li>`;
          }
        }

        if (optionCount > 0) {
          contextMenu.open = true;
          customMenu.style.display = "block";
          customMenu.style.left = e.clientX + "px";
          customMenu.style.top = e.clientY + "px";
          customMenu.innerHTML = options;
        }
      }
      return false;
    },
    setupEntities = () => {
      for (let i = 0; i < mapHeight; i++) {
        for (let j = 0; j < mapWidth; j++) {
          const entityID = entitiesLayer[i * mapWidth + j];
          const spawnMob = spawners[entityID];
          if (spawnMob) {
            spawnMob(j * tileSize, i * tileSize);
          }
        }
      }
    },
    // --------------------------------------------------- DRAWING
    drawMiniMap = () => {
      let ratioW = mapSize / mapWidth,
        ratioH = mapSize / mapHeight;
      f.drawImage(assets["minimapMain"], mapX, mapY, mapSize, mapSize);
      f.fillStyle = "#f00";
      f.fillRect(
        mapX + getTile(localPlayer.position).x * ratioW,
        mapY + getTile(localPlayer.position).y * ratioH,
        4,
        4
      );
    },
    drawLayer = (data) => {
      let imageSrc = assets["tiles"];
      let startX = Math.floor(localPlayer.position.x / 32) - halfOfTileCount,
        startY = Math.floor(localPlayer.position.y / 32) - halfOfTileCount;

      for (let i = 0; i <= canvasTileCount; i++) {
        for (let j = 0; j <= canvasTileCount; j++) {
          let y = startY + i,
            x = startX + j,
            index = data[y * mapWidth + x] - 1;
          if (y >= 0 && x >= 0 && y < mapHeight && x < mapWidth) {
            g.drawImage(
              imageSrc,
              (index % tilesetColumns) * tileSize,
              Math.floor(index / tilesetColumns) * tileSize,
              tileSize,
              tileSize,
              j * tileSize - Math.floor(localPlayer.position.x % 32),
              i * tileSize - Math.floor(localPlayer.position.y % 32),
              tileSize,
              tileSize
            );
          }
        }
      }
    },
    drawPlayers = () => {
      localPlayer.draw();
    },
    drawInventory = () => {
      f.fillStyle = "#fff";
      let itemSize = tileSize * 2,
        entryWidth = tileSize * 6;

      for (let i = 0; i < localPlayer.inventory.length; i++) {
        if (
          activeInventoryTab == 0 &&
          localPlayer.inventory[i].type == "item"
        ) {
          f.font = "20px Monospace";
          let textPos = {
            x: inventoryX + (i % 2) * entryWidth + itemSize * 1.25,
            y: inventoryY + 20 + Math.floor(i / 2) * itemSize + itemSize - 30,
            width: f.measureText(localPlayer.inventory[i].name).width,
            height: 20,
          };
          if (Nasos.collidePR(mousePoint, textPos))
            f.fillStyle = "rgba(200,200,255,0.9)";
          else f.fillStyle = "rgba(255,255,255,0.9)";
          f.drawImage(
            assets["items"],
            localPlayer.inventory[i].assetPosition.x,
            localPlayer.inventory[i].assetPosition.y,
            tileSize,
            tileSize,
            inventoryX + (i % 2) * entryWidth,
            inventoryY + 20 + Math.floor(i / 2) * itemSize,
            itemSize,
            itemSize
          );
          f.fillText(localPlayer.inventory[i].name, textPos.x, textPos.y + 20);

          f.font = "15px Monospace";
          f.fillStyle = "rgba(255,255,255,0.9)";
          f.fillText(
            localPlayer.inventory[i].amount,
            inventoryX + (i % 2) * entryWidth + itemSize * 0.75,
            inventoryY + 20 + Math.floor(i / 2) * itemSize + itemSize + 5
          );
        }
      }
    },
    drawTiles = () => {
      drawLayer(layers[0].data); // ground
      drawLayer(layers[1].data); // objects
    },
    displayStats = () => {
      f.font = "20px Monospace";
      f.fillStyle = "#fff";

      let x = 15,
        y = 30;

      f.fillText("Name: ", x, y);
      f.fillText(localPlayer.name, x + 200, y);
      f.fillText("Class: ", x, y + 20);
      f.fillText(localPlayer.class, x + 200, y + 20);
      f.fillText("Village: ", x, y + 40);
      f.fillText(localPlayer.village, x + 200, y + 40);

      f.fillText("Health:", x, y + 80);
      f.fillText(
        localPlayer.health + "/" + localPlayer.maxHealth,
        x + 200,
        y + 80
      );
      f.fillText("Stamina:", x, y + 100);
      f.fillText(
        localPlayer.stamina + "/" + localPlayer.maxStamina,
        x + 200,
        y + 100
      );
      f.fillText("Mana:", x, y + 120);
      f.fillText(
        localPlayer.mana + "/" + localPlayer.maxMana,
        x + 200,
        y + 120
      );

      f.fillText("Move Speed:", x, y + 160);
      f.fillText(+localPlayer.moveSpeed, x + 200, y + 160);
      f.fillText("Cast Speed:", x, y + 180);
      f.fillText(+localPlayer.castSpeed, x + 200, y + 180);
      f.fillText("Reflex:", x, y + 200);
      f.fillText(localPlayer.reflex, x + 200, y + 200);

      // class specific
      f.fillText("Strength:", x, y + 240);
      f.fillText(localPlayer.strength, x + 200, y + 240);
      f.fillText("Magic Power:", x, y + 260);
      f.fillText(+localPlayer.mp, x + 200, y + 260);
      f.fillText("Illusion Power:", x, y + 280);
      f.fillText(+localPlayer.im, x + 200, y + 280);
    },
    draw = () => {
      displayStats();
      drawMiniMap();
      drawInventory();
      drawTiles();
      drawItems();
      drawMobs();
      drawProjectiles();
      drawPlayers();
      drawDamageParticles();
    },
    // ----------------------------------------------- UPDATING
    updatePlayers = () => {
      localPlayer.update();
    },
    update = () => {
      let now = new Date().getTime();
      while (now - lastUpdate > frameRate) {
        if (debugging) framesThisSecond++;
        timer++;
        if (timer == 180) timer = 0;
        updateMobs();
        updateProjectiles();
        updatePlayers();
        updateDamageParticles();
        if (timer == 30) updateDamageParticles();

        lastUpdate += 1000 / frameRate;
      }
    },
    loop = () => {
      clearGameCanvas();

      update();
      draw();
      if (debugging) debug();

      requestAnimationFrame(loop);
    };

  c.oncontextmenu = contextMenuCallback;

  setupGameCanvas();
  setupEntities();
  load();
  chatInput.addEventListener("keyup", function (e) {
    if (e.keyCode == 13) {
      if (chatInput.value != "") {
        chatWindow.innerHTML =
          chatWindow.innerHTML +
          "<font color='red'>" +
          localPlayer.name +
          "</font>" +
          ": " +
          chatInput.value +
          "<br>";
        chatWindow.scrollTop = chatWindow.scrollHeight;
        chatInput.value = "";
      }
    }
  });
  if (localPlayer.position.x % 32 != 0)
    localPlayer.position.x =
      localPlayer.position.x - (localPlayer.position.x % 32);
  if (localPlayer.position.y % 32 != 0)
    localPlayer.position.y =
      localPlayer.position.y - (localPlayer.position.y % 32);
  loop();
  save();
  setInterval(save, 1000);
  if (debugging) setInterval(fpsCounter, 1000);
};
