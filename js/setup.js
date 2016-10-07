// Project started on 07-09-2016
'use strict';

let c = document.createElement('canvas'),
    ctx = c.getContext('2d'),
    frame = document.createElement('canvas'),
    f = frame.getContext('2d'),
    gameCanvas = document.createElement('canvas'),
    gameCanvasX = 435,
    gameCanvasY = 13,
    gameCanvasSize = 1054,
    g = gameCanvas.getContext('2d'),
    W = 1920,
    H = 1080,
    marginTop = 0,
    marginLeft = 0,
    aspectRatio = 16/9,
    assets = {},
    mapInfo = {},
    keys = {},
    contextMenu = {open: false, x:0, y:0, mouse:{x:0,y:0}},
    mapLoaded = false,
    assetsLoaded = 0,
    assetsTotal = 0,
    currentScreen = 0,
    classClicked = -1,
    villageClicked = -1,
    classDesc = "Choose a class",
    villageDesc = "Choose a village",
    classes = [],
    villages = [],
    classDescriptions = [],
    villageDescriptions = [],
    nameInput, chatWindow, chatInput,
    hairStyle = -1,
    rotation = 0,
    hairStylesCount,
    characterBases = [''],
    characterBase = 0,
    slotUsed,
    mousePoint,

    mapX = 1500, mapY = 0, mapSize = 420,
    inventoryX = 3, inventoryY = 390,
    tabWidth = 104, tabHeight = 25,
    inventoryTabs = ['Items','Weapons','Clothes','Fish'],
    activeInventoryTab = 0,

    // setup
    setup = () => {
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

        classes.push("Mage");
        classes.push("Engineer");
        classes.push("Hunter");
        classes.push("Medic");
        classes.push("Fighter");
        classes.push("Assassin");
        classes.push("Dark mage");
        classes.push("Marksman");
        classes.push("Psycho");
        // mage
        classDescriptions.push("Mages possess the power of control over the five elements, with that power they can deal high damage based on those. Can go either for high cast speed or quick burst damage. They have difficulties with traning stamina but their mana gains are much better.");
        // engineer
        classDescriptions.push("Engineers are not strong by themselves but they can create companions for themselves. Can go either for bomb specialists or robot overlord, who can call for support of either denfense bots, or offensive robots. They have high stamina but low cast speed.");
        // hunter
        classDescriptions.push("Hunters have lot's of stamina and strength, but low health. Beacuse of that, they have to be constanlty on the move, dodging the enemy attacks and take advantage of they long range weapons with great damage. Can go either for speed or stealth.");
        // medic
        classDescriptions.push("Medics are good in close range battles and have high stamina and health. They possess the ability to heal themselves and allies. When comes to combat, they can go either for fighting style combined with weakening enemies or for devious style of traps and poisoning.");
        // fighter
        classDescriptions.push("Fighters are incredible fast and have lot's of stamina and health. Can go for either high damage focused on one enemy or crowd control effects. Either way when they come close to an enemy they are really deadly.");
        // assassin
        classDescriptions.push("Assassins are masters of shadows and can kill enemy before he even notice where the danger comes from. They are remarkably fast and hard to catch but their weakness is low health and stamina. Can go either for misdirection style or kill-run style.");
        // dark mage
        classDescriptions.push("Dark mages sacrifice their health for other perks which makes them easy to kill when exposed to danger but they can deal damage from really long distance. Can go either for necromancy or curses.");
        // marksman
        classDescriptions.push("Marksmans can constatly deal high damage while moving and dashing. Their health is low but they are hard to catch. Can go eihter for defensive style - higher speed and quicker dashes or for offensive style - higher damage and damaging spells.");
        // psycho
        classDescriptions.push("Psychos have balanced stats and are good all-round. They are masters of illusion and tricks, constantly making their enemies uneasy and making sure that they can't anwser with a proper defense. Can go either for mind control spells or long range card attacks.");

        villages.push("Adraohr");
        villages.push("Jordakas");
        villages.push("Thodis");
        villages.push("Noranthar");
        villages.push("Lirffja");
        villages.push("Brrivami");
        villages.push("Lavelite");
        villages.push("Oghaarir");
        villages.push("Farathega");
        // Adraohr
        villageDescriptions.push("Buffs: The element of earth is very strong here. Due to the sun magic, health is higher here and regenerate faster. All pure magic, focused on helping others by healing and buffing is stronger. \n De-buffs: All technology work backwards here. Also all lose some of their strenght and their attacks seem to couse less harm.");
        // Jordakas
        villageDescriptions.push("Jordakas");
        // Thodis
        villageDescriptions.push("Thodis");
        // Noranthar
        villageDescriptions.push("Noranthar");
        // Lirffja
        villageDescriptions.push("Lirffja");
        // Brrivami
        villageDescriptions.push("Brrivami");
        // Lavelite
        villageDescriptions.push("Lavelite");
        // Oghaarir
        villageDescriptions.push("Oghaarir");
        // Farathega
        villageDescriptions.push("Farathega");

        document.body.appendChild(c);
        resizeCallback();
        clear();
        loadAssets();
        flip();
    },
    assetLoadCallback = () => {
        assetsLoaded++;
    },
    addAsset = (name,src) => {
        assets[name] = new Image();
        assets[name].onload = assetLoadCallback;
        assets[name].src = src;
    },
    loadAssets = () => {
        // tiles etc.
        addAsset('background', 'assets/ui/menuScreen.png');
        addAsset('characterDesign', 'assets/ui/characterScreen.png');
        addAsset('classes', 'assets/ui/Classes.png');
        addAsset('button', 'assets/ui/Button.png');
        addAsset('buttonClicked', 'assets/ui/ButtonClicked.png');
        addAsset('villages', 'assets/ui/Villages.png');
        addAsset('characterBase', 'assets/character/characterBase.png');
        addAsset('hair', 'assets/character/hair.png');
        addAsset('gameScreen', 'assets/ui/gameScreen.png');
        addAsset('tab','assets/ui/tab.png');
        addAsset('tiles', 'assets/tiles/tiles.png');
        addAsset('items', 'assets/items/items.png');
        addAsset('fireball', 'assets/skills/fireball.png');
        addAsset('stone', 'assets/skills/stone.png');
        addAsset('water', 'assets/skills/water.png');
        addAsset('wind', 'assets/skills/windProj.png');

        // entities
        addAsset('chicken', 'assets/mobs/chicken.png');

        // map
        addAsset('minimapMain', 'assets/maps/main.png');
        $.getJSON("assets/maps/main.json", function(json) {
            mapInfo = json;
            mapLoaded = true;
        });

        assetsTotal = Object.keys(assets).length;

        loadingScreen();
    },
    loadingScreen = () => {
        clear();
        let loadedProcentage = assetsLoaded/assetsTotal;

        f.strokeStyle = '#3f3';
        f.lineWidth = 17;
        f.lineCap = 'round';
        f.shadowBlur = 30;
        f.shadowColor = '#3f3';

        f.beginPath();
        f.arc(W/2,H/2,400,0,Math.PI * 2 * loadedProcentage);
        f.stroke();

        f.fillStyle = '#3f3';
        let text = Math.floor(loadedProcentage * 100) + '%',
            fontSize = 50;
        f.font = fontSize + 'px arial';
        f.fillText(text,W/2 - f.measureText(text).width/2,H/2);

        if(assetsLoaded != assetsTotal || !mapLoaded)
            setTimeout(loadingScreen,50);
        else
            startGame();
    },
    clear = () => {
        f.fillStyle = '#000';
        f.fillRect(0,0,W,H);
    },
    flip = () => {
        ctx.drawImage(frame,0,0,c.width,c.height);
        requestAnimationFrame(flip);
    },
    resizeCallback = () => {
        let w = window.innerWidth,
            h = window.innerHeight,
            aspectW = h * aspectRatio,
            aspectH = w / aspectRatio;

        if(aspectW > w) {
            marginTop = (h - aspectH)/2;
            marginLeft = 0;
            c.style.marginLeft = 0;
            c.style.marginTop = marginTop + 'px';
            c.width = w;
            c.height = aspectH;
        }
        else {
            marginLeft = (w - aspectW)/2;
            marginTop = 0;
            c.style.marginLeft = marginLeft + 'px';
            c.style.marginTop = 0;
            c.width = aspectW;
            c.height = h;
        }
        
        if(nameInput) {
            nameInput.style.top = Math.round(marginTop + 930 * (c.height/frame.height)) + 'px';
            nameInput.style.left = Math.round(marginLeft + 760 * (c.width/frame.width)) + 'px';
            nameInput.style.width = Math.round(400 * (c.width/frame.width)) + 'px';
            nameInput.style.height = Math.round(60 * (c.height/frame.height)) + 'px';
            nameInput.style.fontSize = Math.round(50 * (c.height/frame.height)) + 'px';
        }
        if(chatInput) {
            chatInput.style.top = Math.round(marginTop + 1050 * (c.height/frame.height)) + 'px';
            chatInput.style.left = Math.round(marginLeft + 1 * (c.width/frame.width)) + 'px';
            chatInput.style.width = Math.round(419 * (c.width/frame.width)) + 'px';
            chatInput.style.height = Math.round(30 * (c.height/frame.height)) + 'px';
            chatInput.style.fontSize = Math.round(20 * (c.height/frame.height)) + 'px';
        }
        if(chatWindow) {
            chatWindow.style.top = Math.round(marginTop + 620 * (c.height/frame.height)) + 'px';
            chatWindow.style.left = Math.round(marginLeft + 1 * (c.width/frame.width)) + 'px';
            chatWindow.style.width = Math.round(419 * (c.width/frame.width)) + 'px';
            chatWindow.style.height = Math.round(430 * (c.height/frame.height)) + 'px';
            chatWindow.style.fontSize = Math.round(20 * (c.height/frame.height)) + 'px';
        }
    },
    addNameInput = () => {
        nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.style.position = 'absolute';
        nameInput.style.top = Math.round(marginTop + 930 * (c.height/frame.height)) + 'px';
        nameInput.style.left = Math.round(marginLeft + 760 * (c.width/frame.width)) + 'px';
        nameInput.style.width = Math.round(400 * (c.width/frame.width)) + 'px';
        nameInput.style.height = Math.round(60 * (c.height/frame.height)) + 'px';

        nameInput.style.borderRadius = '20px';
        nameInput.style.textAlign = 'center';
        nameInput.style.fontSize = Math.round(50 * (c.height/frame.height)) + 'px';
        nameInput.style.background = 'black';
        nameInput.style.color = 'white';
        nameInput.style.outline = 'none';
        nameInput.placeholder = 'Username';

        document.body.appendChild(nameInput);
    },
    addChat = () => {
        chatWindow = document.createElement('div');
        chatWindow.id = 'chat-window';
        chatWindow.style.position = 'absolute';
        chatWindow.style.top = Math.round(marginTop + 620 * (c.height/frame.height)) + 'px';
        chatWindow.style.left = Math.round(marginLeft + 1 * (c.width/frame.width)) + 'px';
        chatWindow.style.width = Math.round(419 * (c.width/frame.width)) + 'px';
        chatWindow.style.height = Math.round(430 * (c.height/frame.height)) + 'px';
        chatWindow.style.borderRadius = '5px';
        chatWindow.style.border = '2px solid white';
        chatWindow.style.textAlign = 'left';
        chatWindow.style.fontSize = Math.round(20 * (c.height/frame.height)) + 'px';
        chatWindow.style.background = 'black';
        chatWindow.style.color = 'white';
        chatWindow.style.outline = 'none';
        chatWindow.style.zIndex = '120';
        chatWindow.style.overflow = 'auto';

        chatInput = document.createElement('input');
        chatInput.id = 'chat-input';
        chatInput.type = 'text';
        chatInput.style.position = 'absolute';
        chatInput.style.top = Math.round(marginTop + 1050 * (c.height/frame.height)) + 'px';
        chatInput.style.left = Math.round(marginLeft + 1 * (c.width/frame.width)) + 'px';
        chatInput.style.width = Math.round(419 * (c.width/frame.width)) + 'px';
        chatInput.style.height = Math.round(30 * (c.height/frame.height)) + 'px';
        chatInput.style.borderRadius = '5px';
        chatInput.style.textAlign = 'left';
        chatInput.style.fontSize = Math.round(20 * (c.height/frame.height)) + 'px';
        chatInput.style.background = 'black';
        chatInput.style.color = 'white';
        chatInput.style.outline = 'none';

        document.body.appendChild(chatInput);
        document.body.appendChild(chatWindow);
    },

    // input handle
    keydownCallback = (e) => {
        if(e.keyCode == 35 || e.keyCode == 36 || e.keyCode == 37)
            keys.left = true;
        if(e.keyCode == 33 || e.keyCode == 36 || e.keyCode == 38)
            keys.up = true;
        if(e.keyCode == 33 || e.keyCode == 34 || e.keyCode == 39)
            keys.right = true;
        if(e.keyCode == 34 || e.keyCode == 35 || e.keyCode == 40)
            keys.down = true;
        if(e.keyCode == 65)
            keys.a = true;
        if(e.keyCode == 66)
            keys.b = true;
        if(e.keyCode == 67)
            keys.c = true;
        if(e.keyCode == 68)
            keys.d = true;
        if(e.keyCode == 69)
            keys.e = true;
        if(e.keyCode == 70)
            keys.f = true;
        if(e.keyCode == 71)
            keys.g = true;
        if(e.keyCode == 72)
            keys.h = true;
        if(e.keyCode == 73)
            keys.i = true;
        if(e.keyCode == 74)
            keys.j = true;
        if(e.keyCode == 75)
            keys.k = true;
        if(e.keyCode == 76)
            keys.l = true;
        if(e.keyCode == 77)
            keys.m = true;
        if(e.keyCode == 78)
            keys.n = true;
        if(e.keyCode == 79)
            keys.o = true;
        if(e.keyCode == 80)
            keys.p = true;
        if(e.keyCode == 81)
            keys.q = true;
        if(e.keyCode == 82)
            keys.r = true;
        if(e.keyCode == 83)
            keys.s = true;
        if(e.keyCode == 84)
            keys.t = true;
        if(e.keyCode == 85)
            keys.u = true;
        if(e.keyCode == 86)
            keys.v = true;
        if(e.keyCode == 87)
            keys.w = true;
        if(e.keyCode == 88)
            keys.x = true;
        if(e.keyCode == 89)
            keys.y = true;
        if(e.keyCode == 90)
            keys.z = true;
        // else
        //     console.log(e.keyCode);
    },
    keyupCallback = (e) => {
        if(e.keyCode == 35 || e.keyCode == 36 || e.keyCode == 37)
            keys.left = false;
        if(e.keyCode == 33 || e.keyCode == 36 || e.keyCode == 38)
            keys.up = false;
        if(e.keyCode == 33 || e.keyCode == 34 || e.keyCode == 39)
            keys.right = false;
        if(e.keyCode == 34 || e.keyCode == 35 || e.keyCode == 40)
            keys.down = false;
        if(e.keyCode == 65)
            keys.a = false;
        if(e.keyCode == 66)
            keys.b = false;
        if(e.keyCode == 67)
            keys.c = false;
        if(e.keyCode == 68)
            keys.d = false;
        if(e.keyCode == 69)
            keys.e = false;
        if(e.keyCode == 70)
            keys.f = false;
        if(e.keyCode == 71)
            keys.g = false;
        if(e.keyCode == 72)
            keys.h = false;
        if(e.keyCode == 73)
            keys.i = false;
        if(e.keyCode == 74)
            keys.j = false;
        if(e.keyCode == 75)
            keys.k = false;
        if(e.keyCode == 76)
            keys.l = false;
        if(e.keyCode == 77)
            keys.m = false;
        if(e.keyCode == 78)
            keys.n = false;
        if(e.keyCode == 79)
            keys.o = false;
        if(e.keyCode == 80)
            keys.p = false;
        if(e.keyCode == 81)
            keys.q = false;
        if(e.keyCode == 82)
            keys.r = false;
        if(e.keyCode == 83)
            keys.s = false;
        if(e.keyCode == 84)
            keys.t = false;
        if(e.keyCode == 85)
            keys.u = false;
        if(e.keyCode == 86)
            keys.v = false;
        if(e.keyCode == 87)
            keys.w = false;
        if(e.keyCode == 88)
            keys.x = false;
        if(e.keyCode == 89)
            keys.y = false;
        if(e.keyCode == 90)
            keys.z = false;
    },
    onblurCallback = (e) => {
        for(let key in keys) {
            keys[key] = false;
        }
    },
    clickCallback = (e) => {
        let canvasX = Math.round((e.clientX - marginLeft) * (frame.width/c.width)),
            canvasY = Math.round((e.clientY - marginTop) * (frame.height/c.height));
        let clickPoint = {x:canvasX,y:canvasY};
        if(currentScreen == 1) {
            if(Nasos.collidePR(clickPoint, {x:100,y:370,width:130,height:40})) {
                createCharacter(1);
            }
            else if(Nasos.collidePR(clickPoint, {x:100,y:880,width:130,height:40})) {
                createCharacter(2);
            }
            else if(Nasos.collidePR(clickPoint, {x:240,y:370,width:130,height:40})) {
                if(localStorage.slot1Base) {
                    slotUsed = 1;
                    characterBase = localStorage.slot1Base;
                    hairStyle = localStorage.slot1Hair;
                    game(true);
                }
                else {
                    alert("You don't have any character on the first slot.");
                }
            }
            else if(Nasos.collidePR(clickPoint, {x:240,y:880,width:130,height:40})) {
                if(localStorage.slot2Base) {
                    slotUsed = 2;
                    characterBase = localStorage.slot2Base;
                    hairStyle = localStorage.slot2Hair;
                    game(true);
                }
                else {
                    alert("You don't have any character on the second slot.");
                }
            }
        }
        else if(currentScreen == 2) {
            // classes
            for(let i=0;i<3;i++) {
                for(let j=0;j<3;j++) {
                    if(Nasos.collidePR(clickPoint, {x:30 + i*205,y:175 + j*205,width:200,height:200})) {
                        classClicked = i+j*3;
                        classDesc = classDescriptions[i+j*3];
                        redraw();
                    }
                }
            }
            // villages
            for(let i=0;i<3;i++) {
                for(let j=0;j<3;j++) {
                    if(Nasos.collidePR(clickPoint, {x:1270 + i*205,y:175 + j*205,width:200,height:200})) {
                        villageClicked = i+j*3;
                        villageDesc = villageDescriptions[i+j*3];
                        redraw();
                    }
                }
            }
            // arrows
            for(let i=0;i<2;i++) {
                for(let j=0;j<4;j++) {
                    if(Nasos.collidePR(clickPoint, {x:705+i*388,y:355+j*129,width:118,height:67})) {
                        if(i == 0 && j == 0) {
                            hairStyle--;
                            if(hairStyle < -1)
                                hairStyle = hairStylesCount - 1;
                            redraw();
                        }
                        else if(i == 1 && j == 0) {
                            hairStyle++;
                            if(hairStyle == hairStylesCount)
                                hairStyle = -1;
                            redraw();
                        }
                        else if(i == 0 && j == 1) {
                            characterBase--;
                            if(characterBase < 0)
                                characterBase = characterBases.length-1;
                            redraw();
                        }
                        else if(i == 1 && j == 1) {
                            characterBase++;
                            if(characterBase == characterBases.length)
                                characterBase = 0;
                            redraw();
                        }
                        else if(i == 0 && j == 3) {
                            rotation--;
                            if(rotation < 0)
                                rotation = 3;
                            redraw();
                        }
                        else if(i == 1 && j == 3) {
                            rotation++;
                            if(rotation == 4)
                                rotation = 0;
                            redraw();
                        }
                    }
                }
            }
            if(Nasos.collidePR(clickPoint, {x:690,y:0,width:542,height:224})) {
                redraw();
                if(classClicked == -1) {
                    f.fillStyle = "#f33";
                    f.font = "40px bold";
                    f.fillText("You need to choose a class.", 740, 300);
                }
                else if(villageClicked == -1) {
                    f.fillStyle = "#f33";
                    f.font = "40px bold";
                    f.fillText("You need to choose a village.", 740, 300);
                }
                else if(nameInput.value.length == 0) {
                    f.fillStyle = "#f33";
                    f.font = "40px bold";
                    f.fillText("Insert your name below.", 740, 300);
                }
                else if(nameInput.value.length < 3) {
                    f.fillStyle = "#f33";
                    f.font = "35px bold";
                    f.fillText("Your username should contain", 750, 280);
                    f.fillText("at least 3 characters.", 820, 315);
                }
                else {
                    if(slotUsed == 1) {
                        localStorage.slot1Base = characterBase;
                        localStorage.slot1Hair = hairStyle;
                        localStorage.slot1Name = nameInput.value;
                        localStorage.slot1Class = classClicked;
                        localStorage.slot1Village = villageClicked;
                    }

                    if(slotUsed == 2) {
                        localStorage.slot2Base = characterBase;
                        localStorage.slot2Hair = hairStyle;
                        localStorage.slot2Name = nameInput.value;
                        localStorage.slot2Class = classClicked;
                        localStorage.slot2Village = villageClicked;
                    }
                    game(false);
                }
            }
        }
        else if(currentScreen == 3) {
            if(contextMenu.open) {
                contextMenu.open = false;
                $('#custom-menu').css('display','none');
            }
            for(let i=0;i<inventoryTabs.length;i++) {
                if(Nasos.collidePR(clickPoint, {x:inventoryX+tabWidth*i,y:inventoryY,width:tabWidth,height:tabHeight})) {
                    activeInventoryTab = i;
                    break;
                }
            }
        }
    },
    mouseMoveCallback = (e) => {
        let ratioW = frame.width/c.width,
            ratioH = frame.height/c.height,
            canvasX = Math.round((e.clientX - marginLeft) * ratioW),
            canvasY = Math.round((e.clientY - marginTop) * ratioH);
        mousePoint = {x: canvasX, y:canvasY};

        if(currentScreen == 1 && (Nasos.collidePR(mousePoint, {x:100,y:370,width:130,height:40}) || Nasos.collidePR(mousePoint, {x:100,y:880,width:130,height:40}) || Nasos.collidePR(mousePoint, {x:240,y:370,width:130,height:40}) || Nasos.collidePR(mousePoint, {x:240,y:880,width:130,height:40}))) {
            c.style.cursor = 'pointer';
        }
        else if(currentScreen == 2) {
            let pointer = false;
            for(let i=0;i<3;i++) {
                for(let j=0;j<3;j++) {
                    if(Nasos.collidePR(mousePoint, {x:30 + i*205,y:175 + j*205,width:200,height:200})) {
                        pointer = true;
                        break;
                    }
                }
            }
            if(!pointer) {
                for(let i=0;i<3;i++) {
                    for(let j=0;j<3;j++) {
                        if(Nasos.collidePR(mousePoint, {x:1270 + i*205,y:175 + j*205,width:200,height:200})) {
                            pointer = true;
                            break;
                        }
                    }
                }
            }
            if(!pointer) {
                for(let i=0;i<2;i++) {
                    for(let j=0;j<4;j++) {
                        if(Nasos.collidePR(mousePoint, {x:705+i*388,y:355+j*129,width:118,height:67})) {
                            pointer = true;
                            break;
                        }
                    }
                }
            }
            if(!pointer && Nasos.collidePR(mousePoint, {x:690,y:0,width:542,height:224}))
                pointer = true;
            if(pointer)
                c.style.cursor = 'pointer';
            else
                c.style.cursor = 'auto';
        }
        else {
            let pointer = false;
            for(let i=0;i<inventoryTabs.length;i++) {
                if(!pointer && Nasos.collidePR(mousePoint, {x:inventoryX+tabWidth*i,y:inventoryY,width:tabWidth,height:tabHeight})) {
                    pointer = true;
                    break;
                }
            }

            if(pointer)
                c.style.cursor = 'pointer';
            else
                c.style.cursor = 'auto';
        }
    },

    // drawing
    drawButtons = () => {
        // classes
        for(let i=0;i<3;i++) {
            for(let j=0;j<3;j++) {
                if(classClicked == i+j*3)
                    f.drawImage(assets['buttonClicked'], 33 + i*205, 178 + j*205,200,200);
                else
                    f.drawImage(assets['button'], 30 + i*205, 175 + j*205,200,200);
                f.drawImage(assets['classes'], i*200, j*200,200,200, 30 + i*205, 180 + j*205,200,200);
            }
        }

        // villages
        for(let i=0;i<3;i++) {
            for(let j=0;j<3;j++) {
                if(villageClicked == i+j*3)
                    f.drawImage(assets['buttonClicked'], 1273 + i*205, 178 + j*205,200,200);
                else
                    f.drawImage(assets['button'], 1270 + i*205, 175 + j*205,200,200);
                f.drawImage(assets['villages'], i*200, j*200,200,200, 1270 + i*205, 180 + j*205,200,200);
            }
        }
    },
    displayInventoryTabs = () => {
        f.font = "20px Monospace";
        for(let i=0;i<inventoryTabs.length;i++) {
            let len = f.measureText(inventoryTabs[i]).width;
            f.fillStyle = 'rgba(255,255,255,0.9)';
            if(activeInventoryTab == i)
                f.drawImage(assets['tab'],100,0,100,25,inventoryX+i*tabWidth,inventoryY,tabWidth,tabHeight)
            else
                f.drawImage(assets['tab'],0,0,100,25,inventoryX+i*tabWidth,inventoryY,tabWidth,tabHeight);
            f.fillText(inventoryTabs[i],inventoryX+i*tabWidth + tabWidth/2 - len/2,inventoryY+18);
        }
    },
    displaySkillSettings = () => {
        f.font = '20px Monospace white';
        f.drawImage(assets['fireball'], 0,0,32,32,1530,450,50,50);
        f.fillText('Cost: 10    Key: F', 1610, 480);

        f.drawImage(assets['wind'], 0,0,32,32,1530,500,50,50);
        f.fillText('Cost: 10    Key: Q', 1610, 530);

        f.drawImage(assets['stone'], 0,0,32,32,1530,550,50,50);
        f.fillText('Cost: 10    Key: S', 1610, 580);

        f.drawImage(assets['water'], 0,0,32,32,1530,600,50,50);
        f.fillText('Cost: 10    Key: W', 1610, 630);

        f.fillText('Rest        Key: D', 1610, 680);
        f.fillText('Attack      Key: A', 1610, 730);
    },
    drawDesc = () => {
        f.font = "20px Monospace";
        f.fillStyle = "#fff";
        let boxW = 600,
            last = 0,
            counter = 0,
            classDescWords = classDesc.split(' '),
            villageDescWords = villageDesc.split(' ');

        while(last < classDescWords.length) {
            let desc = classDescWords[last];
            for(let i=last+1;i<classDescWords.length;i++) {
                if(classDescWords[i] == '\n') {
                    break;
                }
                let textW = f.measureText(desc + ' ' + classDescWords[i]).width;
                if(textW < boxW) {
                    desc += ' ' + classDescWords[i];
                    last = i;
                }
                else
                    break;
            }
            last++;
            f.fillText(desc,40,850+counter*25);
            counter++;
        }
        last = 0;
        counter = 0;
        while(last < villageDescWords.length) {
            let desc = villageDescWords[last],
                nl = false;
            for(let i=last+1;i<villageDescWords.length;i++) {
                if(villageDescWords[i] == '\n') {
                    last++;
                    nl = true;
                    break;
                }
                let textW = f.measureText(desc + ' ' + villageDescWords[i]).width;
                if(textW < boxW) {
                    desc += ' ' + villageDescWords[i];
                    last = i;
                }
                else
                    break;
            }
            last++;
            f.fillText(desc,1280,850+counter*25);
            counter+=1+nl;
        }
    },
    drawCharacter = (x,y,size) => {
        let characterSize = 32;
        f.drawImage(assets['characterBase' + characterBases[characterBase]], 0, rotation*characterSize, characterSize, characterSize, x, y, size, size);
        if(hairStyle != -1)
            f.drawImage(assets['hair'], 0, hairStyle * 4 * characterSize + rotation*characterSize, characterSize, characterSize, x, y, size, size);
    },
    redraw = () => {
        if(currentScreen == 1) {
            clear();
            f.drawImage(assets['background'],0,0,W,H);
            if(localStorage.slot1Base) {
                characterBase = localStorage.slot1Base;
                hairStyle = localStorage.slot1Hair;
                drawCharacter(130,90,200);
                f.fillStyle = "#fff";
                f.font = "30px Monospace";
                let w = f.measureText(localStorage.slot1Name).width;
                f.fillText(localStorage.slot1Name,230 - w/2, 320);
            }
            if(localStorage.slot2Base) {
                characterBase = localStorage.slot2Base;
                hairStyle = localStorage.slot2Hair;
                drawCharacter(140,580,200);
                f.fillStyle = "#fff";
                f.font = "30px Monospace";
                let w = f.measureText(localStorage.slot1Name).width;
                f.fillText(localStorage.slot2Name,240 - w/2, 810);
            }
        }
        else if(currentScreen == 2) {
            clear();
            f.drawImage(assets['characterDesign'],0,0,W,H);
            drawButtons();
            drawCharacter(770,400,400);
            drawDesc();
        }
        else if(currentScreen == 3) {
            clear();
            f.drawImage(assets['gameScreen'],0,0,W,H);
            f.drawImage(gameCanvas,gameCanvasX,gameCanvasY,gameCanvasSize,gameCanvasSize);
            displayInventoryTabs();
            displaySkillSettings();
            requestAnimationFrame(redraw);
        }
    },

    // game
    startGame = () => {
        hairStylesCount = assets['hair'].height/128;
        f.shadowBlur = 0;
        currentScreen = 1;
        redraw();
    },
    createCharacter = (slot) => {
        hairStyle = -1;
        characterBase = 0;
        currentScreen = 2;
        slotUsed = slot;
        addNameInput();
        redraw();
    },
    game = (loading) => {
        rotation = 0;
        currentScreen = 3;
        if(!loading)
            nameInput.remove();
        addChat();
        redraw();
        initGame(slotUsed, loading);
    };

setup();
