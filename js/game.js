let initGame = (slot, gameContinued) => {

	class flowingText {
		constructor(text,x,y) {
			this.text = text;
			this.width = g.measureText(text).width;
			this.x = halfOfTileCount*tileSize + (x - localPlayer.x) + (tileSize/2 - this.width/2);
			this.y = halfOfTileCount*tileSize + (y - localPlayer.y) + 5;
			this.alpha = 1.0;
		}

		draw() {
			g.fillStyle = "rgba(255,255,255," + this.alpha + ")";
			g.font = "15px Monospace";
			g.fillText(this.text,this.x,this.y);
			if(this.alpha == 0) flowingTexts.split(flowingTexts.indexOf(this),1);
		}

		update() {
			this.y -= .5;
			this.alpha -= 0.05;
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
			let x = this.x - offsetX,
				y = this.y - offsetY;
			if(x>-tileSize && y>-tileSize && x<screenSize+tileSize && y<screenSize+tileSize)
				g.drawImage(this.sprite, this.frame*tileSize, this.dir*tileSize,tileSize,tileSize,x,y,tileSize,tileSize);
		}

		update() {

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
			if(this.hp <= 0) {
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
			if(this.id == featherID) this.name = 'Feather';
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

	class Player {
		constructor(x,y) {
			this.inventory = [];
			this.x = x * tileSize;
			this.y = y * tileSize;
			this.maxHealth = 100;
			this.health = this.maxHealth;
			this.maxMana = 100;
			this.mana = this.maxMana;
			this.maxStamina = 1000;
			this.stamina = this.maxStamina;
			this.stamXpNeeded = 25;
			this.stamXp = 0;
			this.moveSpeed = 1;
			this.castSpeed = 2.5;
			this.reflex = 1;
			this.strength = 10;
			this.strXpNeeded = 25;
			this.strXp = 0;
			this.mp = 10;
			this.im = 10;
			this.dir = 2;
			this.currentFrame = 0;
			this.vx = 0;
			this.vy = 0;
			this.moving = false;
			this.attacking = false;
			this.resting = false;
			this.name = slot == 1 ? localStorage.slot1Name : localStorage.slot2Name;
			this.class = slot == 1 ? classes[localStorage.slot1Class] : classes[localStorage.slot2Class];
			this.village = slot == 1 ? villages[localStorage.slot1Village] : villages[localStorage.slot2Village];

			this.activities = {
				punch: new Act(40, (target)=>{ 
					this.attacking = true;
					this.currentFrame = 7;
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
						this.currentFrame = 18;
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
			if(!(this.x%32) && !(this.y%32)) {
				if(keys.down && keys.left) {
					this.dir = 1;
					let entityBlocking = false;
					for(let i=0;i<mobs.length;i++) {
						let mobTile = mobs[i].getTile();
						if(!mobs[i].dead && playerTile.x - 1 == mobTile.x && playerTile.y + 1 == mobTile.y) {
							entityBlocking = true;
							break;
						}
					}
					if(!entityBlocking && !blockingLayer[(playerTile.y+1)*mapWidth+playerTile.x-1]) {	
						this.vx = -this.moveSpeed;
						this.vy = this.moveSpeed;
					}
				}
				else if(keys.down && keys.right) {
					this.dir = 3;
					let entityBlocking = false;
					for(let i=0;i<mobs.length;i++) {
						let mobTile = mobs[i].getTile();
						if(!mobs[i].dead && playerTile.x + 1 == mobTile.x && playerTile.y + 1 == mobTile.y) {
							entityBlocking = true;
							break;
						}
					}
					if(!entityBlocking && !blockingLayer[(playerTile.y+1)*mapWidth+playerTile.x+1]) {	
						this.vx = this.moveSpeed;
						this.vy = this.moveSpeed;
					}
				}
				else if(keys.up && keys.left) {
					this.dir = 7;
					let entityBlocking = false;
					for(let i=0;i<mobs.length;i++) {
						let mobTile = mobs[i].getTile();
						if(!mobs[i].dead && playerTile.x - 1 == mobTile.x && playerTile.y - 1 == mobTile.y) {
							entityBlocking = true;
							break;
						}
					}
					if(!entityBlocking && !blockingLayer[(playerTile.y-1)*mapWidth+playerTile.x-1]) {	
						this.vx = -this.moveSpeed;
						this.vy = -this.moveSpeed;
					}
				}
				else if(keys.up && keys.right) {
					this.dir = 9;
					let entityBlocking = false;
					for(let i=0;i<mobs.length;i++) {
						let mobTile = mobs[i].getTile();
						if(!mobs[i].dead && playerTile.x + 1 == mobTile.x && playerTile.y - 1 == mobTile.y) {
							entityBlocking = true;
							break;
						}
					}
					if(!entityBlocking && !blockingLayer[(playerTile.y-1)*mapWidth+playerTile.x+1]) {	
						this.vx = this.moveSpeed;
						this.vy = -this.moveSpeed;
					}
				}
				else if(keys.down) {
					this.dir = 2;
					let entityBlocking = false;
					for(let i=0;i<mobs.length;i++) {
						let mobTile = mobs[i].getTile();
						if(!mobs[i].dead && playerTile.x == mobTile.x && playerTile.y + 1 == mobTile.y) {
							entityBlocking = true;
							break;
						}
					}
					if(!entityBlocking && !blockingLayer[(playerTile.y+1)*mapWidth+playerTile.x]) {
						this.vy = this.moveSpeed;
					}
				}
				else if(keys.left) {
					this.dir = 4;
					let entityBlocking = false;
					for(let i=0;i<mobs.length;i++) {
						let mobTile = mobs[i].getTile();
						if(!mobs[i].dead && playerTile.x - 1 == mobTile.x && playerTile.y == mobTile.y) {
							entityBlocking = true;
							break;
						}
					}
					if(!entityBlocking && !blockingLayer[(playerTile.y)*mapWidth+playerTile.x-1]) {
						this.vx = -this.moveSpeed;
					}
				}
				else if(keys.right) {
					this.dir = 6;
					let entityBlocking = false;
					for(let i=0;i<mobs.length;i++) {
						let mobTile = mobs[i].getTile();
						if(!mobs[i].dead && playerTile.x + 1 == mobTile.x && playerTile.y == mobTile.y) {
							entityBlocking = true;
							break;
						}
					}
					if(!entityBlocking && !blockingLayer[(playerTile.y)*mapWidth+playerTile.x+1]) {
						this.vx = this.moveSpeed;
					}
				}
				else if(keys.up) {
					this.dir = 8;
					let entityBlocking = false;
					for(let i=0;i<mobs.length;i++) {
						let mobTile = mobs[i].getTile();
						if(!mobs[i].dead && playerTile.x == mobTile.x && playerTile.y - 1 == mobTile.y) {
							entityBlocking = true;
							break;
						}
					}
					if(!entityBlocking && !blockingLayer[(playerTile.y-1)*mapWidth+playerTile.x]) {
						this.vy = -this.moveSpeed;
					}
				}
			}

			if(this.stamina <= 0 && !(this.x%32) && !(this.y%32)) {
				;
			}
			else if(groundLayer[playerTile.y*mapWidth+playerTile.x] == 34) {
				this.x += this.vx/2;
				this.y += this.vy/2;

				if(this.vy < 0 && timer == 0) {
					this.stamXp+=2;
					this.stamina -= Math.round(Nasos.rand(10,100));
					if(this.stamina < 0) this.stamina = 0;
				}
			}
			else {
				this.x += this.vx;
				this.y += this.vy;
			}

			if(!(this.x%32)) this.vx = 0;
			if(!(this.y%32)) this.vy = 0;

			if(this.vx || this.vy) this.moving = true;
			else this.moving = false;

			offsetX = localPlayer.x - halfOfTileCount*tileSize;
			offsetY = localPlayer.y - halfOfTileCount*tileSize;
		}
		handleActivities() {
			if(keys.d) {
				if(this.stamina < 0) this.stamina = 0;
				this.activities.rest.use();
			}
			else if(this.stamina > 1 && !this.resting) {
				let target = null;
				for(let i=0;i<mobs.length;i++) {
					if(inFront(this.getTile(),this.dir,mobs[i].getTile())) {
						target = mobs[i];
						break;
					}
				}
				if(target && keys.a) {
					this.activities.punch.use(target);
				}
			}
		}
		checkStatChanges() {
			if(this.strXp >= this.strXpNeeded) {
				this.strength += 1 + Math.floor(Math.random()*10);
				this.strXp -= this.strXpNeeded;
			}
			if(this.stamXp >= this.stamXpNeeded) {
				this.maxStamina += 1 + Math.floor(Math.random()*50);
				this.stamXp -= this.stamXpNeeded;
			}
		}
		update() {
			if(!localPlayer.resting)
				this.handleMovement();
			this.handleActivities(); // outside because of rest handling
			this.checkStatChanges();

			for(let key in this.activities) {
				if(this.activities[key].cd > 0)
					this.activities[key].cd--;
			}
		}
	}

	let	debugging = true,

		treeStumpID = 6,
		chickenID = 101,
		featherID = 0,
		
		frameRate = 60,
		framesThisSecond = 0,
		timer = 0,
		fps = 60,
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
							j*tileSize - localPlayer.x%32, 
							i*tileSize - localPlayer.y%32, 
							tileSize, tileSize);
					}
				}
			}
		},
		drawPlayers = () => {
			localPlayer.draw();
		},
		drawTiles = () => {
			for(let i=0;i<layers.length;i++) {
				if(layers[i].visible)
					if(layers[i].name != "Entities" && layers[i].name != "BlockingLayer")
					drawLayer(layers[i].data);
			}
		},
		displayStats = () => {
			f.font = "20px Monospace";
			f.fillStyle = "#fff";

			f.fillText(localPlayer.health + "/" + localPlayer.maxHealth,320,42);
			f.fillText(localPlayer.stamina + "/" + localPlayer.maxStamina,320,88);
			f.fillText(localPlayer.mana + "/" + localPlayer.maxMana,320,129);

			f.fillText(localPlayer.moveSpeed,915,42);
			f.fillText(localPlayer.castSpeed,915,88);
			f.fillText(localPlayer.reflex,915,129);

			f.fillText(localPlayer.strength,1570,42);
			f.fillText(localPlayer.mp,1570,88);
			f.fillText(localPlayer.im,1570,129);
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
		drawContextMenu = () => {
			g.fillStyle = "#fff";
			g.font = "12px Monospace";
			let options = [],
				widest = 0;
			for(let i=0;i<mobs.length;i++) {
				if(!mobs[i].dead && Nasos.collidePR(
					{x:contextMenu.x, y:contextMenu.y},
					{x:mobs[i].x - offsetX, y:mobs[i].y - offsetY, width:tileSize, height:tileSize})
				) {
					options.push(mobs[i]);
					let w = g.measureText(mobs[i].name).width;
					if(w > widest) widest = w;
				}
			}
			for(let i=0;i<items.length;i++) {
				if(Nasos.collidePR(
					{x:contextMenu.x, y:contextMenu.y},
					{x:items[i].x - offsetX, y:items[i].y - offsetY, width:tileSize, height:tileSize})
				)
					options.push(items[i]);
					let w = g.measureText(items[i].name).width;
					if(w > widest) widest = w;
			}
			for(let i=0;i<options.length;i++) {
				let padding = 1,
					w = widest + 20;
				g.fillStyle = "#fff";
				g.fillRect(contextMenu.x,contextMenu.y+i*20, w,20);
				g.fillStyle = "#ccc";
				g.fillRect(contextMenu.x + padding,contextMenu.y+padding+i*20,w-2*padding,20-2*padding);
				g.fillStyle = "#000";
				g.fillText(options[i].name,contextMenu.x + 10,contextMenu.y+i*20 + 13);
			}
		},
		draw = () => {
			displayStats();
			drawTiles();
			drawItems();
			drawMobs();
			drawPlayers();
			drawFlowingTexts();
			if(contextMenu.open) 
				drawContextMenu();
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
		updateFrames = () => {
			if(timer%5 == 0) {
				if(localPlayer.moving && timer%10 == 0 || !localPlayer.moving)
					localPlayer.currentFrame++;
				if(localPlayer.resting) {
					if(timer == 30) {
						if(localPlayer.health < localPlayer.maxHealth) {
							localPlayer.health += Math.floor(localPlayer.maxHealth * (0.1 + Math.random() * 0.05));
						}
						if(localPlayer.health > localPlayer.maxHealth)
							localPlayer.health = localPlayer.maxHealth;

						if(localPlayer.stamina < localPlayer.maxStamina) {
							localPlayer.stamina += Math.floor(localPlayer.maxStamina * (0.1 + Math.random() * 0.05));
						}
						if(localPlayer.stamina > localPlayer.maxStamina)
							localPlayer.stamina = localPlayer.maxStamina;

						if(localPlayer.mana < localPlayer.maxMana) {
							localPlayer.mana += Math.floor(localPlayer.maxMana * (0.1 + Math.random() * 0.05));
						}
						if(localPlayer.mana > localPlayer.maxMana)
							localPlayer.mana = localPlayer.maxMana;
						
						if(localPlayer.stamina == localPlayer.maxStamina && localPlayer.mana == localPlayer.maxMana && localPlayer.health == localPlayer.maxHealth)
							localPlayer.resting = false;
					}
					localPlayer.currentFrame = 18;
				}
				else if(localPlayer.stamina == 0) {
					localPlayer.currentFrame = 20;
					localPlayer.dir = 2;
				}
				else if(localPlayer.attacking) {
					if(localPlayer.currentFrame >= 11) {
						localPlayer.currentFrame = 0;
						localPlayer.attacking = false;
					}
				}
				else if(localPlayer.moving) {
					if(localPlayer.currentFrame >= 7 || localPlayer.currentFrame < 3) localPlayer.currentFrame = 3;
				}
				else if(localPlayer.swiming) {
					if(localPlayer.currentFrame >= 18 || localPlayer.currentFrame < 13) localPlayer.currentFrame = 13;
				}
				else {
					if(localPlayer.currentFrame >= 3) localPlayer.currentFrame = 0;
				}
			}
		},
		update = () => {
			let now = (new Date()).getTime();
			while(now - lastUpdate > frameRate) {
				if(debugging)
					framesThisSecond++;
				timer++;
				if(timer == 60) timer = 0;
				updateMobs();
				updatePlayers();
				updateTexts();
				updateFrames();
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

	setupGameCanvas();
	setupEntities();
	loop();
	load();
	if(localPlayer.x % 32 != 0) localPlayer.x = localPlayer.x - localPlayer.x % 32;
	if(localPlayer.y % 32 != 0) localPlayer.y = localPlayer.y - localPlayer.y % 32;
	save();
	setInterval(save, 1000);
	if(debugging)
		setInterval(fpsCounter, 1000);
}