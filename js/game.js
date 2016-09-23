let initGame = (slot, gameContinued) => {

	class flowingText {
		constructor(text,x,y) {
			g.font = "15px Monospace";

			this.text = text;
			this.width = g.measureText(text).width;
			this.x = x + tileSize/2 - this.width/2;
			this.y = y + 5;
			this.alpha = 1.0;
		}

		draw() {
			g.fillStyle = "rgba(255,255,255," + this.alpha + ")";
			g.font = "15px Monospace";
			g.fillText(this.text,this.x - offsetX,this.y - offsetY);
			if(this.alpha == 0) flowingTexts.split(flowingTexts.indexOf(this),1);
		}

		update() {
			this.y -= .5;
			this.alpha -= 0.04;
		}
	}

	class Mob {
		constructor(x,y,type,sprite,hp,respawnTime) {
			this.x = x*tileSize;
			this.y = y*tileSize;
			this.type = type;
			this.sprite = sprite;
			this.frame = 0;
			this.dir = 0;
			this.hp = hp;
			this.maxHp = hp;
			this.dead = false;
			this.respawnTime = respawnTime || 10000;
		}

		deathCheck() {
			if(this.hp <= 0) {
				this.dead = true;
				setTimeout(this.respawn.bind(this),this.respawnTime);
			}
		}

		respawn() {
			this.dead = false;
			this.hp = this.maxHp;
		}

		draw() {
			if(this.dead) return;
			let x = this.x - offsetX,
				y = this.y - offsetY;
			if(x>-tileSize && y>-tileSize && x<screenSize+tileSize && y<screenSize+tileSize)
				g.drawImage(this.sprite, this.frame*tileSize, this.dir*tileSize,tileSize,tileSize,x,y,tileSize,tileSize);
		}

		update() {
			if(this.dead) return;
		}

		getTile() {
			return {x: Math.round(this.x/32), 
					y: Math.round(this.y/32)};
		}
	}

	class Chicken extends Mob {
		constructor(x,y) {
			super(x,y,chickenID,assets['chicken'],1);
			this.name = "Chicken";
		}

		deathCheck() {
			if(!this.dead && this.hp <= 0) {
				this.dead = true;
				let t = this.getTile();
				items.push(new Item(t.x,t.y,featherID));
				setTimeout(this.respawn.bind(this),this.respawnTime);
			}
		}
		// TODO: add moving in random directions
	}
	class Treestump extends Mob {
		constructor(x,y) {
			super(x,y,treeStumpID,null,1);
			this.name = 'Treestump';
		}
		draw() {
			let x = this.x - offsetX,
				y = this.y - offsetY;
			if(x>-tileSize && y>-tileSize && x<screenSize+tileSize && y<screenSize+tileSize)
				g.drawImage(assets['tiles'], (treeStumpID-1)*tileSize, 0,tileSize,tileSize,x,y,tileSize,tileSize);
		}
	}

	class Item {
		constructor(x,y,id) {
			this.x = x*tileSize;
			this.y = y*tileSize;
			this.id = id;
			if(this.id == featherID) {
				this.name = 'Feather';
				this.type = 'item';
			}
		}

		draw() {
			let x = this.x - offsetX,
				y = this.y - offsetY;
			if(x>-tileSize && y>-tileSize && x<screenSize+tileSize && y<screenSize+tileSize)
				g.drawImage(assets['items'], this.id*tileSize, 0, tileSize,tileSize, x,y, tileSize,tileSize);
		}
	}

	class Act {
		constructor(cd,action) {
			this.cooldown = cd;
			this.cd = 0;
			this.action = action;
		}

		use(target) {
			if(this.cd == 0) {
				this.cd = this.cooldown;
				this.action(target);
			}
		}
	}

	class Spell {
		constructor(x,y,dir,asset,power) {
			this.x = x;
			this.y = y;
			this.originX = x;
			this.originY = y;
			this.dir = dir;
			this.asset = asset;
			this.power = power;
			this.range = 400;
			this.speed = 5;
			this.currentFrame = 0;

			if(this.dir == 1) {
				this.vy=this.speed;
				this.vx=-this.speed;
			}
			else if(this.dir == 3) {
				this.vy=this.speed;
				this.vx=this.speed;
			}
			else if(this.dir == 7) {
				this.vy=-this.speed;
				this.vx=-this.speed;
			}
			else if(this.dir == 9) {
				this.vy=-this.speed;
				this.vx=this.speed;
			}
			else if(this.dir == 2) {
				this.vy=this.speed;
				this.vx = 0;
			}
			else if(this.dir == 8) {
				this.vy=-this.speed;
				this.vx = 0;
			}
			else if(this.dir == 4) {
				this.vx=-this.speed;
				this.vy = 0;
			}
			else if(this.dir == 6) {
				this.vx=this.speed;
				this.vy = 0;
			}
		}

		update() {
			if(timer%5 == 0) {
				this.currentFrame++;
				if(this.currentFrame == 4) this.currentFrame = 0;
			}
			this.x += this.vx;
			this.y += this.vy;

			let toDel = false;
			for(let i=0;i<mobs.length;i++) {
				if(!(mobs[i].dead) && Nasos.intersects({x:this.x,y:this.y,width:tileSize,height:tileSize},{x:mobs[i].x,y:mobs[i].y,width:tileSize,height:tileSize})) {
					if(mobs[i].type != treeStumpID) {
						mobs[i].hp -= this.power;
						mobs[i].deathCheck();
					}
					flowingTexts.push(new flowingText(this.power,mobs[i].x,mobs[i].y));
					toDel = true;
					break;
				}
			}
			if(blockingLayer[(Math.floor(this.y/32) + (this.vy > 0) - (this.vy < 0))*mapWidth+Math.floor(this.x/32) + (this.vx > 0) - (this.vx < 0)])
				toDel = true;

			let deltaX = Math.abs(this.x-this.originX),
				deltaY = Math.abs(this.y-this.originY);
			if(toDel || Math.sqrt(deltaX*deltaX+deltaY*deltaY) > this.range) {
				spells.splice(spells.indexOf(this),1);
			}
		}

		draw() {
			g.save();
			g.translate(this.x-offsetX+tileSize/2,this.y-offsetY+tileSize/2);
			let angle;
			if(this.dir == 1) angle = Math.PI*0.75;
			else if(this.dir == 2) angle = Math.PI/2;
			else if(this.dir == 3) angle = Math.PI/4;
			else if(this.dir == 4) angle = Math.PI;
			else if(this.dir == 6) angle = 0;
			else if(this.dir == 7) angle = -Math.PI*0.75;
			else if(this.dir == 8) angle = -Math.PI/2;
			else if(this.dir == 9) angle = -Math.PI/4;
			g.rotate(angle);
			g.drawImage(assets[this.asset],this.currentFrame*32,0,tileSize,tileSize,-tileSize/2,-tileSize/2,tileSize,tileSize);
			g.restore();
		}
	}

	class Player {
		constructor(x,y) {
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
			this.class = slot == 1 ? classes[localStorage.slot1Class] : classes[localStorage.slot2Class];
			this.village = slot == 1 ? villages[localStorage.slot1Village] : villages[localStorage.slot2Village];

			this.activities = {
				fireball: new Act(10*this.castSpeed, () => {
					spells.push(new Spell(this.x,this.y,this.dir,'fireball',this.mp));
					this.mpXp += 5;
					this.manaXp += 3;
					this.mana -= 10;
					if(this.castSpeed > 1) {
						if(Math.floor(Math.random()*100) == 1)
							this.castSpeed -= 0.1;
					}
					this.setCooldownOnAll();
				}),
				waterBullets: new Act(10*this.castSpeed, () => {
					spells.push(new Spell(this.x,this.y,this.dir,'water',this.mp));
					this.mpXp += 5;
					this.manaXp += 3;
					this.mana -= 10;
					if(this.castSpeed > 1) {
						if(Math.floor(Math.random()*100) == 1)
							this.castSpeed -= 0.1;
					}
					this.setCooldownOnAll();
				}),
				windProjectile: new Act(10*this.castSpeed, () => {
					spells.push(new Spell(this.x,this.y,this.dir,'wind',this.mp));
					this.mpXp += 5;
					this.manaXp += 3;
					this.mana -= 10;
					if(this.castSpeed > 1) {
						if(Math.floor(Math.random()*100) == 1)
							this.castSpeed -= 0.1;
					}
					this.setCooldownOnAll();
				}),
				stoneThrow: new Act(10*this.castSpeed, () => {
					spells.push(new Spell(this.x,this.y,this.dir,'stone',this.mp));
					this.mpXp += 5;
					this.manaXp += 3;
					this.mana -= 10;
					if(this.castSpeed > 1) {
						if(Math.floor(Math.random()*100) == 1)
							this.castSpeed -= 0.1;
					}
					this.setCooldownOnAll();
				}),
				punch: new Act(40, (target) => { 
					this.attacking = true;
					if(target.type == treeStumpID) {
						this.stamina -= Math.floor(this.strength * (0.4 + Math.random() * 0.4));
						this.strXp += 5;
						this.stamXp += 2;
						if(this.stamina < 1) this.stamina = 1;
					}
					else {
						target.hp -= this.strength;
						target.deathCheck();
					}
					flowingTexts.push(new flowingText(this.strength,target.x,target.y));
				}),
				rest: new Act(40, ()=> {
					if(this.resting)
						this.resting = false;
					else {
						this.resting = true;
					}
				}),
				get: new Act(10, ()=> {
					for(let i=0;i<items.length;i++) {
						let distX = Math.abs(items[i].x - localPlayer.x)/32,
							distY = Math.abs(items[i].y - localPlayer.y)/32;
						if(distX <= 1 && distY <= 1) {
							let found = false;
							for(let i=0;i<this.inventory.length;i++) {
								if(this.inventory[i].id == items[i].id) {
									this.inventory[i].amount++;
									found = true;
									break;
								}
							}
							if(!found) {
								this.inventory.push({id:items[i].id,amount:1,type:items[i].type,name:items[i].name});
							}
							items.splice(items.indexOf(items[i]),1);
							break;
						}
					}
				})
			}
		}
		getTile() {
			return {x: Math.round(this.x/32), 
					y: Math.round(this.y/32)};
		}
		draw() {
			let dir;
			if(this.dir == 1 || this.dir == 4 || this.dir == 7) dir = 3;
			else if(this.dir == 3 || this.dir == 6 || this.dir == 9) dir = 2;
			else if(this.dir == 2) dir = 0;
			else if(this.dir == 8) dir = 1;
        	g.drawImage(assets['characterBase' + characterBases[characterBase]], 
        				localPlayer.currentFrame*tileSize, 
        				dir*tileSize, 
        				tileSize, tileSize,
        				halfOfTileCount*tileSize, 
        				halfOfTileCount*tileSize, 
        				tileSize, tileSize);
        	if(hairStyle != -1)
        		g.drawImage(assets['hair'], 
        			localPlayer.currentFrame*tileSize, 
        			hairStyle * 4 * tileSize + dir*tileSize, 
        			tileSize, tileSize, 
        			halfOfTileCount*tileSize, 
        			halfOfTileCount*tileSize, 
        			tileSize, tileSize);
		}
		handleMovement() {
			let playerTile = this.getTile();
			if(this.stamina > 0) {
				if(!(this.x%32) && !(this.y%32)) {
					if(keys.down && keys.left) {
						this.dir = 1;
						this.vx = -this.moveSpeed;
						this.vy = this.moveSpeed;
					}
					else if(keys.down && keys.right) {
						this.dir = 3;
						this.vx = this.moveSpeed;
						this.vy = this.moveSpeed;
					}
					else if(keys.up && keys.left) {
						this.dir = 7;
						this.vx = -this.moveSpeed;
						this.vy = -this.moveSpeed;
					}
					else if(keys.up && keys.right) {
						this.dir = 9;
						this.vx = this.moveSpeed;
						this.vy = -this.moveSpeed;
					}
					else if(keys.down) {
						this.dir = 2;
						this.vy = this.moveSpeed;
					}
					else if(keys.left) {
						this.dir = 4;
						this.vx = -this.moveSpeed;
					}
					else if(keys.right) {
						this.dir = 6;
						this.vx = this.moveSpeed;
					}
					else if(keys.up) {
						this.dir = 8;
						this.vy = -this.moveSpeed;
					}

					let entityBlocking = false;
					for(let i=0;i<mobs.length;i++) {
						let mobTile = mobs[i].getTile();
						if(!mobs[i].dead && playerTile.x + (this.vx > 0) - (this.vx < 0) == mobTile.x && playerTile.y + (this.vy > 0) - (this.vy < 0) == mobTile.y) {
							entityBlocking = true;
							break;
						}
					}
					if(entityBlocking || blockingLayer[(playerTile.y + (this.vy > 0) - (this.vy < 0))*mapWidth+playerTile.x + (this.vx > 0) - (this.vx < 0)]) {	
						this.vx = 0;
						this.vy = 0;
					}
				}
			}

			if(Math.round(this.x) != this.x || Math.round(this.y) != this.y || groundLayer[playerTile.y*mapWidth+playerTile.x] == 34) {
				this.x += this.vx/2;
				this.y += this.vy/2;

				if(this.vy < 0 && timer % 60 == 0) {
					this.healthXp+=3;
					this.stamXp+=5;
					this.stamina -= Math.round(Nasos.rand(10,100));
					if(this.stamina < 0) this.stamina = 0;
				}
			}
			else {
				this.x += this.vx;
				this.y += this.vy;
			}

			if(this.x%32 == 0) this.vx = 0;
			if(this.y%32 == 0) this.vy = 0;

			if(this.vx || this.vy) {
				this.moving = true;
				if(Math.floor(Math.random()*5000) < this.rockChance) {
					let found = false;
					for(let i=0;i<this.inventory.length;i++) {
						if(this.inventory[i].id == rockID) {
							found = true;
							this.inventory[i].amount++;
							break;
						}
					}
					if(!found)
						this.inventory.push({id:rockID,amount:1,type:'item',name:'rock'});
				}
			}
			else this.moving = false;
			offsetX = localPlayer.x - halfOfTileCount*tileSize;
			offsetY = localPlayer.y - halfOfTileCount*tileSize;
		}
		setCooldownOnAll() {
			for(let key in this.activities) {
				if(this.activities[key].cd < 60) {
					this.activities[key].cd = 60;
				}
			}
		}
		handleActivities() {
			if($('#chat-input').is(':focus')) return;
			if(keys.d && (this.stamina < this.maxStamina || this.mana < this.maxMana || this.health < this.maxHealth)) {
				if(this.stamina < 0) this.stamina = 0;
				this.activities.rest.use();
			}
			else if(this.stamina > 1 && !this.resting) {
				let target = null;
				for(let i=0;i<mobs.length;i++) {
					if(!mobs[i].dead && inFront(this.getTile(),this.dir,mobs[i].getTile())) {
						target = mobs[i];
						break;
					}
				}
				if(target && keys.a) {
					this.activities.punch.use(target);
				}
				else if(keys.f && this.mana >= 10) {
					this.activities.fireball.use();
				}
				else if(keys.s && this.mana >= 10) {
					this.activities.stoneThrow.use();
				}
				else if(keys.w && this.mana >= 10) {
					this.activities.waterBullets.use();
				}
				else if(keys.q && this.mana >= 10) {
					this.activities.windProjectile.use();
				}
				else if(keys.g) {
					this.activities.get.use();
				}
			}
		}
		checkStatChanges() {
			if(this.healthXp >= this.healthXpNeeded) {
				this.maxHealth += 5 + Math.floor(Math.random()*20);
				this.healthXp -= this.healthXpNeeded;
			}
			if(this.stamXp >= this.stamXpNeeded) {
				this.maxStamina += 5 + Math.floor(Math.random()*50);
				this.stamXp -= this.stamXpNeeded;
			}
			if(this.manaXp >= this.manaXpNeeded) {
				this.maxMana += 5 + Math.floor(Math.random()*30);
				this.manaXp -= this.manaXpNeeded;
			}
			if(this.reflexXp >= this.reflexXpNeeded) {
				this.reflex++;
				this.reflexXp -= this.reflexXpNeeded;
			}
			if(this.strXp >= this.strXpNeeded) {
				this.strength += 5 + Math.floor(Math.random()*10);
				this.strXp -= this.strXpNeeded;
			}
			if(this.mpXp >= this.mpXpNeeded) {
				this.mp += 5 + Math.floor(Math.random()*10);
				this.mpXp -= this.mpXpNeeded;
			}
			if(this.imXp >= this.imXpNeeded) {
				this.im += 5 + Math.floor(Math.random()*10);
				this.imXp -= this.imXpNeeded;
			}
		}
		handleStatusEffects() {
			if(this.resting && timer % 60 == 0) {
				if(this.health < this.maxHealth)
					this.health += Math.round(this.maxHealth/12) + 10;
				if(this.stamina < this.maxStamina)
					this.stamina += Math.round(this.maxStamina/12) + 10;
				if(this.mana < this.maxMana)
					this.mana += Math.round(this.maxMana/12) + 10;
				if(this.health > this.maxHealth) this.health = this.maxHealth;
				if(this.mana > this.maxMana) this.mana = this.maxMana;
				if(this.stamina > this.maxStamina) this.stamina = this.maxStamina;
				if(this.health == this.maxHealth && this.mana == this.maxMana && this.stamina == this.maxStamina) {
					this.currentFrame = 0;
					this.resting = false;
				}
			}
		}
		updateFrames() {
			if(this.resting) 
				this.currentFrame = 18;
			else if(this.stamina == 0)
				this.currentFrame = 20;
			else if(this.attacking) {
				if(timer % 5 == 0) {
					if(this.currentFrame < 7 || this.currentFrame > 10) {
						this.currentFrame = 7;
					}
					else {
						this.currentFrame++;
					}
					if(this.currentFrame == 10) {
						this.attacking = false;
						this.currentFrame = 7;
					}
				}
			}
			else if(this.moving) {
				if(this.x % 32 == 5 || this.y % 32 == 5) this.anotherLeg = !this.anotherLeg;
				if(this.x % 32 >= 8 && this.x%32 <= 24 || this.y % 32 >= 8 && this.y%32 <= 24) {
					this.currentFrame = 4 + this.anotherLeg*2;
				}
				else this.currentFrame = 3;
			}
			else {
				if(timer == 0) this.currentFrame = 0;
				else if(timer == 60) this.currentFrame = 1;
				else if(timer == 120) this.currentFrame = 2;
			}
		}
		update() {
			if(!localPlayer.resting)
				this.handleMovement();
			this.handleActivities(); // outside of if statement because of rest handling
			this.checkStatChanges();
			this.updateFrames();
			this.handleStatusEffects();

			for(let key in this.activities) {
				if(this.activities[key].cd > 0)
					this.activities[key].cd--;
			}
		}
	}

	let	debugging = false,
		framesThisSecond = 0,
		fps = 0,

		treeStumpID = 6,
		chickenID = 101,
		featherID = 0,
		rockID = 1,
		
		frameRate = 60,
		timer = 0,
		lastUpdate = (new Date()).getTime(),
		canvasTileCount = 19,
		halfOfTileCount = Math.floor(canvasTileCount/2),
		mapWidth = mapInfo.width,
		mapHeight = mapInfo.height,
		tileSize = mapInfo.tileheight,
		screenSize = canvasTileCount * tileSize,
		tilesetColumns = mapInfo.tilesets[0].columns,
		layers = mapInfo.layers,
		blockingLayer = layers[3].data,
		entitiesLayer = layers[2].data,
		groundLayer = layers[0].data,
		localPlayer = new Player(5,5),
		offsetX = localPlayer.x - halfOfTileCount*tileSize,
		offsetY = localPlayer.y - halfOfTileCount*tileSize,
		currentSlot = slot,

		mobs = [],
		items = [],
		spells = [],
		flowingTexts = [],

		debug = () => {
			g.font = "15px Monospace";

			let tileX = localPlayer.getTile().x,
				tileY = localPlayer.getTile().y;
			g.fillStyle = "#fff";
			g.fillText("DEBUGING MODE ON",20,10);
			g.fillText("x: " + localPlayer.x,20,25);
			g.fillText("y: " + localPlayer.y,20,40);
			g.fillText("Tile x: " + tileX,20,55);
			g.fillText("Tile y: " + tileY,20,70);
			g.fillText("Dir: " + localPlayer.dir,20,85);
			g.fillText("Class: " + localPlayer.class,20,100);
			g.fillText("Village: " + localPlayer.village,20,115);
			g.fillText("Tile id: " + groundLayer[tileY*mapWidth+tileX],20,130);

			g.font = "25px Monospace";
			g.fillText(fps, 575, 22);
		},
		fpsCounter = () => {
			fps = framesThisSecond;
			framesThisSecond = 0;
		},
		save = () => {
			if(currentSlot == 1) {
				localStorage.slot1x = localPlayer.x;
				localStorage.slot1y = localPlayer.y;
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
			if(currentSlot == 2) {
				localStorage.slot2x = localPlayer.x;
				localStorage.slot2y = localPlayer.y;
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
			if(currentSlot == 1 && gameContinued) {
				localPlayer.x = Number(localStorage.slot1x);
				localPlayer.y = Number(localStorage.slot1y);
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
				localPlayer.inventory = JSON.parse(localStorage.slot1Inventory || '{}');
				localPlayer.currentFrame = 0;
			}
			else if(currentSlot == 2 && gameContinued) {
				localPlayer.x = Number(localStorage.slot2x);
				localPlayer.y = Number(localStorage.slot2y);
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
				localPlayer.inventory = JSON.parse(localStorage.slot2Inventory || '{}');
				localPlayer.currentFrame = 0;
			}
		}
		clearGameCanvas = () => {
			g.fillStyle = "#000";
			g.fillRect(0,0,screenSize,screenSize);
		},
		setupGameCanvas = () => {
			gameCanvas.width = screenSize;
			gameCanvas.height = screenSize;
		},
	    contextMenuCallback = (e) => {
       		e.preventDefault();
            let ratioW = frame.width/c.width,
                ratioH = frame.height/c.height,
                canvasX = Math.round((e.clientX - marginLeft) * ratioW),
                canvasY = Math.round((e.clientY - marginTop) * ratioH);
            contextMenu.x = (canvasX - gameCanvasX) * (gameCanvas.width/gameCanvasSize);
            contextMenu.y = (canvasY - gameCanvasY) * (gameCanvas.height/gameCanvasSize);
            if(contextMenu.x > 0 && contextMenu.x < gameCanvas.width && contextMenu.y > 0 && contextMenu.y < gameCanvas.height) {
                let options = '',
                	optionCount = 0;

                for(let i=0;i<mobs.length;i++) {
                	if(!mobs[i].dead && Nasos.collidePR(contextMenu,
                			{x:mobs[i].x-offsetX,
                			 y:mobs[i].y-offsetY,
                			 width:tileSize,
                			 height:tileSize}
                	)) {
                		optionCount++;
                		options += `<li class='option'> ${mobs[i].name} </li>`;
                	}
                }
                for(let i=0;i<items.length;i++) {
                	if(Nasos.collidePR(contextMenu,
                			{x:items[i].x-offsetX,
                			 y:items[i].y-offsetY,
                			 width:tileSize,
                			 height:tileSize}
                	)) {
                		optionCount++;
                		options += `<li class='option'> ${items[i].name} </li>`;
                	}
                }

                if(optionCount > 0) {
	                contextMenu.open = true;
	                $('#custom-menu').css('display','block');
	                $('#custom-menu').css('left', e.clientX + 'px');
	                $('#custom-menu').css('top', e.clientY + 'px');
	                $('#custom-menu').html(options);
	            }
            }
	        return false;
	    },
		setupEntities = () => {
			for(let i=0;i<mapHeight;i++) {
				for(let j=0;j<mapWidth;j++) {
					let entity = entitiesLayer[i*mapWidth+j];
					if(entity == treeStumpID)
						mobs.push(new Treestump(j,i));
					else if(entity == chickenID)
						mobs.push(new Chicken(j,i));
				}
			}
		},
		inFront = (pos1,dir,pos2) => {
			if((dir == 1 && pos1.x-1 == pos2.x && pos1.y+1 == pos2.y) ||
			   (dir == 3 && pos1.x+1 == pos2.x && pos1.y+1 == pos2.y) ||
			   (dir == 7 && pos1.x-1 == pos2.x && pos1.y-1 == pos2.y) ||
			   (dir == 9 && pos1.x+1 == pos2.x && pos1.y-1 == pos2.y) ||
			   (dir == 2 && pos1.x == pos2.x && pos1.y+1 == pos2.y) ||
			   (dir == 4 && pos1.x-1 == pos2.x && pos1.y == pos2.y) ||
			   (dir == 6 && pos1.x+1 == pos2.x && pos1.y == pos2.y) ||
			   (dir == 8 && pos1.x == pos2.x && pos1.y-1 == pos2.y))
				return true;
			return false;
		},

		// --------------------------------------------------- DRAWING
	    drawMiniMap = () => {
	    	let ratioW = mapSize/mapWidth,
	    		ratioH = mapSize/mapHeight;
	        f.drawImage(assets['minimapMain'], mapX, mapY, mapSize,mapSize);
	        f.fillStyle = "#f00";
	        f.fillRect(mapX+localPlayer.getTile().x*ratioW,mapY+localPlayer.getTile().y*ratioH,4,4);
	    },
		drawLayer = (data) => {
			let imageSrc = assets['tiles'];
			let startX = Math.floor(localPlayer.x/32) - halfOfTileCount,
				startY = Math.floor(localPlayer.y/32) - halfOfTileCount;

			for(let i=0;i<=canvasTileCount;i++) {
				for(let j=0;j<=canvasTileCount;j++) {
					let y = startY + i,
						x = startX + j,
						index = data[y*mapWidth+x] - 1;
					if(y >= 0 && x >= 0 && y < mapHeight && x < mapWidth) {
						g.drawImage(imageSrc, 
							(index%tilesetColumns)*tileSize, 
							Math.floor(index/tilesetColumns)*tileSize, 
							tileSize, tileSize,
							j*tileSize - Math.floor(localPlayer.x%32), 
							i*tileSize - Math.floor(localPlayer.y%32), 
							tileSize, tileSize);
					}
				}
			}
		},
		drawPlayers = () => {
			localPlayer.draw();
		},
		drawInventory = () => {
	        f.fillStyle = "#fff";
			let itemSize = tileSize*2,
				entryWidth = tileSize*6;

			for(let i=0;i<localPlayer.inventory.length;i++) {
				if(activeInventoryTab == 0 && localPlayer.inventory[i].type == 'item') {
					f.font = "20px Monospace";
					let textPos = {x:inventoryX+(i%2)*entryWidth+itemSize*1.25,
								   y:inventoryY+20+Math.floor(i/2)*itemSize + itemSize - 30,
								   width:f.measureText(localPlayer.inventory[i].name).width,
								   height:20};
					if(Nasos.collidePR(mousePoint,textPos))
						f.fillStyle = "rgba(200,200,255,0.9)";
					else
						f.fillStyle = "rgba(255,255,255,0.9)";
					f.drawImage(assets['items'], localPlayer.inventory[i].id*tileSize, 0, tileSize,tileSize, 
						inventoryX + (i%2) * entryWidth, inventoryY + 20 + Math.floor(i/2) * itemSize, itemSize, itemSize);
					f.fillText(localPlayer.inventory[i].name,textPos.x,textPos.y+20);
					
					f.font = "15px Monospace";
					f.fillStyle = "rgba(255,255,255,0.9)";
					f.fillText(localPlayer.inventory[i].amount,inventoryX+(i%2)*entryWidth+itemSize*0.75,inventoryY+20+Math.floor(i/2)*itemSize + itemSize + 5);
				}
			}
		},
		drawTiles = () => {
			drawLayer(layers[0].data);	// ground
			drawLayer(layers[1].data);	// objects
		},
		displayStats = () => {
			f.font = "20px Monospace";
			f.fillStyle = "#fff";

			let x = 15, y = 30;

			f.fillText('Health:',x,y);
			f.fillText( localPlayer.health + "/" + localPlayer.maxHealth, x+200, y);
			f.fillText('Stamina:',x,y+20);
			f.fillText( localPlayer.stamina + "/" + localPlayer.maxStamina, x+200, y+20);
			f.fillText('Mana:',x,y+40);
			f.fillText( localPlayer.mana + "/" + localPlayer.maxMana, x+200, y+40);

			f.fillText('Move Speed:',x,y+80);
			f.fillText( + localPlayer.moveSpeed, x+200, y+80);
			f.fillText('Cast Speed:',x,y+100);
			f.fillText( + localPlayer.castSpeed, x+200, y+100);
			f.fillText('Reflex:',x,y+120);
			f.fillText( localPlayer.reflex, x+200, y+120);

			// class specific
			f.fillText('Strength:',x,y+160);
			f.fillText( localPlayer.strength, x+200, y+160);
			f.fillText('Magic Power:',x,y+180);
			f.fillText( + localPlayer.mp, x+200, y+180);
			f.fillText('Illusion Power:',x,y+200);
			f.fillText( + localPlayer.im, x+200, y+200);
		},
		drawMobs = () => {
			for(let i=0;i<mobs.length;i++) {
				if(!mobs[i].dead)
					mobs[i].draw();
			}
		},
		drawItems = () => {
			for(let i=0;i<items.length;i++) {
				items[i].draw();
			}
		},
		drawFlowingTexts = () => {
			for(let i=0;i<flowingTexts.length;i++)
				flowingTexts[i].draw();
		},
		drawSpells = () => {
			for(let i=0;i<spells.length;i++) {
				spells[i].draw();
			}
		},
		draw = () => {
			displayStats();
			drawMiniMap();
			drawInventory();
			drawTiles();
			drawItems();
			drawMobs();
			drawSpells();
			drawPlayers();
			drawFlowingTexts();
		},

		// ----------------------------------------------- UPDATING
		updateTexts = () => {
			for(let i=0;i<flowingTexts.length;i++) {
				flowingTexts[i].update();
			}
		},
		updateMobs = () => {
			for(let i=0;i<mobs.length;i++){
				if(!mobs[i].dead)
					mobs[i].update();
			}
		},
		updatePlayers = () => {
			localPlayer.update();
		},
		updateSpells = () => {
			for(let i=0;i<spells.length;i++) {
				spells[i].update();
			}
		},
		update = () => {
			let now = (new Date()).getTime();
			while(now - lastUpdate > frameRate) {
				if(debugging)
					framesThisSecond++;
				timer++;
				if(timer == 180) timer = 0;
				updateMobs();
				updateSpells();
				updatePlayers();
				updateTexts();
				if(timer == 30)
					updateTexts();

				lastUpdate += 1000/frameRate;
			}
		},
		loop = () => {
			clearGameCanvas();

			update();
			draw();
			if(debugging)
				debug();

			requestAnimationFrame(loop);
		};

    c.oncontextmenu = contextMenuCallback;

	setupGameCanvas();
	setupEntities();
	load();
    chatInput.addEventListener('keyup',function(e) {
        if(e.keyCode == 13) {
            if(chatInput.value != "") {
                chatWindow.innerHTML = chatWindow.innerHTML + "<font color='red'>" + localPlayer.name + "</font>" + ": " + chatInput.value + "<br>";
                chatWindow.scrollTop = chatWindow.scrollHeight;
                chatInput.value = "";
            }
        }
    });
	if(localPlayer.x % 32 != 0) localPlayer.x = localPlayer.x - localPlayer.x % 32;
	if(localPlayer.y % 32 != 0) localPlayer.y = localPlayer.y - localPlayer.y % 32;
	loop();
	save();
	setInterval(save, 1000);
	if(debugging)
		setInterval(fpsCounter, 1000);
}