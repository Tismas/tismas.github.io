import {
  tileSize,
  halfOfTileCount,
  blockingLayer,
  mapWidth,
  groundLayer,
  classes,
  villages
} from "../constants.js";
import { g, chatInputEl } from "../globals.js";
import { Act } from "./Act.js";
import { mobs, timer, spells } from "../game.js";
import { Treestump } from "../mobs/Treestump.js";
import { setCameraPosition } from "../camera.js";
import { addDamageParticle } from "../effects/damageParticle.js";
import { Spell } from "./Spell.js";
import {
  assets,
  characterBases,
  characterBase,
  hairStyle
} from "../utils/assets.js";
import { keys } from "../utils/input.js";
import { pickUpItem } from "../items/item.js";
import { createRock } from "../items/itemCreators.js";
import Nasos from "../Nasos.js";

const inFront = (pos1, dir, pos2) => {
  if (
    (dir == 1 && pos1.x - 1 == pos2.x && pos1.y + 1 == pos2.y) ||
    (dir == 3 && pos1.x + 1 == pos2.x && pos1.y + 1 == pos2.y) ||
    (dir == 7 && pos1.x - 1 == pos2.x && pos1.y - 1 == pos2.y) ||
    (dir == 9 && pos1.x + 1 == pos2.x && pos1.y - 1 == pos2.y) ||
    (dir == 2 && pos1.x == pos2.x && pos1.y + 1 == pos2.y) ||
    (dir == 4 && pos1.x - 1 == pos2.x && pos1.y == pos2.y) ||
    (dir == 6 && pos1.x + 1 == pos2.x && pos1.y == pos2.y) ||
    (dir == 8 && pos1.x == pos2.x && pos1.y - 1 == pos2.y)
  ) {
    return true;
  }
  return false;
};

export class Player {
  constructor(x, y, slot) {
    this.inventory = []; // {id: ,amount: ,type: ,name: }
    this.x = x * tileSize;
    this.y = y * tileSize;

    this.maxHealth = 100;
    this.health = this.maxHealth;
    this.healthXp = 0;
    this.healthXpNeeded = 25;
    this.maxMana = 100;
    this.mana = this.maxMana;
    this.manaXp = 0;
    this.manaXpNeeded = 25;
    this.maxStamina = 1000;
    this.stamina = this.maxStamina;
    this.stamXpNeeded = 25;
    this.stamXp = 0;

    this.moveSpeed = 1;
    this.castSpeed = 2.5;
    this.spellsCasted = 0;
    this.reflex = 1;
    this.reflexXp = 0;
    this.reflexXpNeeded = 25;
    this.strength = 10;
    this.strXpNeeded = 25;
    this.strXp = 0;
    this.mp = 10;
    this.mpXp = 0;
    this.mpXpNeeded = 25;
    this.im = 10;
    this.imXp = 0;
    this.imXpNeeded = 25;

    this.dir = 2;
    this.currentFrame = 0;
    this.vx = 0;
    this.vy = 0;
    this.moving = false;
    this.anotherLeg = true;
    this.attacking = false;
    this.resting = false;
    this.onWater = false;
    this.rockChance = 1;

    this.name = slot == 1 ? localStorage.slot1Name : localStorage.slot2Name;
    this.class =
      slot == 1
        ? classes[localStorage.slot1Class]
        : classes[localStorage.slot2Class];
    this.village =
      slot == 1
        ? villages[localStorage.slot1Village]
        : villages[localStorage.slot2Village];

    this.activities = {
      fireball: new Act(10 * this.castSpeed, () => {
        spells.push(new Spell(this.x, this.y, this.dir, "fireball", this.mp));
        this.mpXp += 5;
        this.manaXp += 3;
        this.mana -= 10;
        if (this.castSpeed > 1) {
          if (Math.floor(Math.random() * 100) == 1) this.castSpeed -= 0.1;
        }
        this.setCooldownOnAll();
      }),
      waterBullets: new Act(10 * this.castSpeed, () => {
        spells.push(new Spell(this.x, this.y, this.dir, "water", this.mp));
        this.mpXp += 5;
        this.manaXp += 3;
        this.mana -= 10;
        if (this.castSpeed > 1) {
          if (Math.floor(Math.random() * 100) == 1) this.castSpeed -= 0.1;
        }
        this.setCooldownOnAll();
      }),
      windProjectile: new Act(10 * this.castSpeed, () => {
        spells.push(new Spell(this.x, this.y, this.dir, "wind", this.mp));
        this.mpXp += 5;
        this.manaXp += 3;
        this.mana -= 10;
        if (this.castSpeed > 1) {
          if (Math.floor(Math.random() * 100) == 1) this.castSpeed -= 0.1;
        }
        this.setCooldownOnAll();
      }),
      stoneThrow: new Act(10 * this.castSpeed, () => {
        spells.push(new Spell(this.x, this.y, this.dir, "stone", this.mp));
        this.mpXp += 5;
        this.manaXp += 3;
        this.mana -= 10;
        if (this.castSpeed > 1) {
          if (Math.floor(Math.random() * 100) == 1) this.castSpeed -= 0.1;
        }
        this.setCooldownOnAll();
      }),
      punch: new Act(40, target => {
        this.attacking = true;
        if (target.type == Treestump.ID) {
          this.stamina -= Math.floor(
            this.strength * (0.4 + Math.random() * 0.4)
          );
          this.strXp += 5;
          this.stamXp += 2;
          if (this.stamina < 1) this.stamina = 1;
        } else {
          target.hp -= this.strength;
          target.deathCheck();
        }
        addDamageParticle(target.x, target.y, this.strength);
      }),
      rest: new Act(40, () => {
        if (this.resting) this.resting = false;
        else {
          this.resting = true;
        }
      }),
      get: new Act(10, () => {
        const pickedUpItem = pickUpItem(this);
        if (!pickedUpItem) return;

        let inInventory = false;
        for (let j = 0; j < this.inventory.length; j++) {
          if (this.inventory[j].name == pickedUpItem.name) {
            this.inventory[j].amount++;
            inInventory = true;
            break;
          }
        }
        if (!inInventory) {
          this.inventory.push({
            amount: 1,
            ...pickedUpItem
          });
        }
      })
    };
  }
  getTile() {
    return { x: Math.round(this.x / 32), y: Math.round(this.y / 32) };
  }
  draw() {
    let dir;
    if (this.dir == 1 || this.dir == 4 || this.dir == 7) dir = 3;
    else if (this.dir == 3 || this.dir == 6 || this.dir == 9) dir = 2;
    else if (this.dir == 2) dir = 0;
    else if (this.dir == 8) dir = 1;
    g.drawImage(
      assets["characterBase" + characterBases[characterBase]],
      this.currentFrame * tileSize,
      dir * tileSize,
      tileSize,
      tileSize,
      halfOfTileCount * tileSize,
      halfOfTileCount * tileSize,
      tileSize,
      tileSize
    );
    if (hairStyle != -1)
      g.drawImage(
        assets["hair"],
        this.currentFrame * tileSize,
        hairStyle * 4 * tileSize + dir * tileSize,
        tileSize,
        tileSize,
        halfOfTileCount * tileSize,
        halfOfTileCount * tileSize,
        tileSize,
        tileSize
      );
  }
  handleMovement() {
    let playerTile = this.getTile();
    if (this.stamina > 0) {
      if (!(this.x % 32) && !(this.y % 32)) {
        if (keys.down && keys.left) {
          this.dir = 1;
          this.vx = -this.moveSpeed;
          this.vy = this.moveSpeed;
        } else if (keys.down && keys.right) {
          this.dir = 3;
          this.vx = this.moveSpeed;
          this.vy = this.moveSpeed;
        } else if (keys.up && keys.left) {
          this.dir = 7;
          this.vx = -this.moveSpeed;
          this.vy = -this.moveSpeed;
        } else if (keys.up && keys.right) {
          this.dir = 9;
          this.vx = this.moveSpeed;
          this.vy = -this.moveSpeed;
        } else if (keys.down) {
          this.dir = 2;
          this.vy = this.moveSpeed;
        } else if (keys.left) {
          this.dir = 4;
          this.vx = -this.moveSpeed;
        } else if (keys.right) {
          this.dir = 6;
          this.vx = this.moveSpeed;
        } else if (keys.up) {
          this.dir = 8;
          this.vy = -this.moveSpeed;
        }

        let entityBlocking = false;
        for (let i = 0; i < mobs.length; i++) {
          let mobTile = mobs[i].getTile();
          if (
            !mobs[i].dead &&
            playerTile.x + (this.vx > 0) - (this.vx < 0) == mobTile.x &&
            playerTile.y + (this.vy > 0) - (this.vy < 0) == mobTile.y
          ) {
            entityBlocking = true;
            break;
          }
        }
        if (
          entityBlocking ||
          blockingLayer[
            (playerTile.y + (this.vy > 0) - (this.vy < 0)) * mapWidth +
              playerTile.x +
              (this.vx > 0) -
              (this.vx < 0)
          ]
        ) {
          this.vx = 0;
          this.vy = 0;
        }
      }
    }

    if (
      Math.round(this.x) != this.x ||
      Math.round(this.y) != this.y ||
      groundLayer[playerTile.y * mapWidth + playerTile.x] == 34
    ) {
      this.x += this.vx / 2;
      this.y += this.vy / 2;

      if (this.vy < 0 && timer % 60 == 0) {
        this.healthXp += 3;
        this.stamXp += 5;
        this.stamina -= Math.round(Nasos.rand(10, 100));
        if (this.stamina < 0) this.stamina = 0;
      }
    } else {
      this.x += this.vx;
      this.y += this.vy;
    }

    if (this.x % 32 == 0) this.vx = 0;
    if (this.y % 32 == 0) this.vy = 0;

    if (this.vx || this.vy) {
      this.moving = true;
      if (Math.floor(Math.random() * 5000) < this.rockChance) {
        let found = false;
        for (let i = 0; i < this.inventory.length; i++) {
          if (this.inventory[i].name == "Rock") {
            found = true;
            this.inventory[i].amount++;
            break;
          }
        }
        if (!found)
          this.inventory.push({
            ...createRock(),
            amount: 1
          });
      }
    } else this.moving = false;
    const x = this.x - halfOfTileCount * tileSize;
    const y = this.y - halfOfTileCount * tileSize;
    setCameraPosition(x, y);
  }
  setCooldownOnAll() {
    for (let key in this.activities) {
      if (this.activities[key].cd < 60) {
        this.activities[key].cd = 60;
      }
    }
  }
  handleActivities() {
    if (chatInputEl === document.activeElement) return;
    if (
      keys.d &&
      (this.stamina < this.maxStamina ||
        this.mana < this.maxMana ||
        this.health < this.maxHealth)
    ) {
      if (this.stamina < 0) this.stamina = 0;
      this.activities.rest.use();
    } else if (this.stamina > 1 && !this.resting) {
      let target = null;
      for (let i = 0; i < mobs.length; i++) {
        if (
          !mobs[i].dead &&
          inFront(this.getTile(), this.dir, mobs[i].getTile())
        ) {
          target = mobs[i];
          break;
        }
      }
      if (target && keys.a) {
        this.activities.punch.use(target);
      } else if (keys.f && this.mana >= 10) {
        this.activities.fireball.use();
      } else if (keys.s && this.mana >= 10) {
        this.activities.stoneThrow.use();
      } else if (keys.w && this.mana >= 10) {
        this.activities.waterBullets.use();
      } else if (keys.q && this.mana >= 10) {
        this.activities.windProjectile.use();
      } else if (keys.g) {
        this.activities.get.use();
      }
    }
  }
  checkStatChanges() {
    if (this.healthXp >= this.healthXpNeeded) {
      this.maxHealth += 5 + Math.floor(Math.random() * 20);
      this.healthXp -= this.healthXpNeeded;
    }
    if (this.stamXp >= this.stamXpNeeded) {
      this.maxStamina += 5 + Math.floor(Math.random() * 50);
      this.stamXp -= this.stamXpNeeded;
    }
    if (this.manaXp >= this.manaXpNeeded) {
      this.maxMana += 5 + Math.floor(Math.random() * 30);
      this.manaXp -= this.manaXpNeeded;
    }
    if (this.reflexXp >= this.reflexXpNeeded) {
      this.reflex++;
      this.reflexXp -= this.reflexXpNeeded;
    }
    if (this.strXp >= this.strXpNeeded) {
      this.strength += 5 + Math.floor(Math.random() * 10);
      this.strXp -= this.strXpNeeded;
    }
    if (this.mpXp >= this.mpXpNeeded) {
      this.mp += 5 + Math.floor(Math.random() * 10);
      this.mpXp -= this.mpXpNeeded;
    }
    if (this.imXp >= this.imXpNeeded) {
      this.im += 5 + Math.floor(Math.random() * 10);
      this.imXp -= this.imXpNeeded;
    }
  }
  handleStatusEffects() {
    if (this.resting && timer % 60 == 0) {
      if (this.health < this.maxHealth)
        this.health += Math.round(this.maxHealth / 12) + 10;
      if (this.stamina < this.maxStamina)
        this.stamina += Math.round(this.maxStamina / 12) + 10;
      if (this.mana < this.maxMana)
        this.mana += Math.round(this.maxMana / 12) + 10;
      if (this.health > this.maxHealth) this.health = this.maxHealth;
      if (this.mana > this.maxMana) this.mana = this.maxMana;
      if (this.stamina > this.maxStamina) this.stamina = this.maxStamina;
      if (
        this.health == this.maxHealth &&
        this.mana == this.maxMana &&
        this.stamina == this.maxStamina
      ) {
        this.currentFrame = 0;
        this.resting = false;
      }
    }
  }
  updateFrames() {
    if (this.resting) this.currentFrame = 18;
    else if (this.stamina == 0) this.currentFrame = 20;
    else if (this.attacking) {
      if (timer % 5 == 0) {
        if (this.currentFrame < 7 || this.currentFrame > 10) {
          this.currentFrame = 7;
        } else {
          this.currentFrame++;
        }
        if (this.currentFrame == 10) {
          this.attacking = false;
          this.currentFrame = 7;
        }
      }
    } else if (this.moving) {
      if (this.x % 32 == 5 || this.y % 32 == 5)
        this.anotherLeg = !this.anotherLeg;
      if (
        (this.x % 32 >= 8 && this.x % 32 <= 24) ||
        (this.y % 32 >= 8 && this.y % 32 <= 24)
      ) {
        this.currentFrame = 4 + this.anotherLeg * 2;
      } else this.currentFrame = 3;
    } else {
      if (timer == 0) this.currentFrame = 0;
      else if (timer == 60) this.currentFrame = 1;
      else if (timer == 120) this.currentFrame = 2;
    }
  }
  update() {
    if (!this.resting) this.handleMovement();
    this.handleActivities(); // outside of if statement because of rest handling
    this.checkStatChanges();
    this.updateFrames();
    this.handleStatusEffects();

    for (let key in this.activities) {
      if (this.activities[key].cd > 0) this.activities[key].cd--;
    }
  }
}
