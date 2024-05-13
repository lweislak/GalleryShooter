class FirstScene extends Phaser.Scene {
    constructor() {
        super("first");
        this.my = {sprite: {}, text:{}};  // Create an object to hold sprite bindings

        this.playerX = 320; //Starting position
        this.playerY = 600;

        this.my.sprite.bullet = [];
        this.my.sprite.enemyBullet = [];
        this.maxBullets = 5; //Max amount of bullets that can appear on screen

        this.regularDuckCooldown = 60; //Number of update() calls to wait before making a new duck
        this.regularDuckCooldownCounter = 0;
        this.yellowDuckCooldown = 80;
        this.yellowDuckCooldownCounter = 0;
    }

    preload() {
        this.load.setPath("./assets/");

        this.load.image("player", "crosshair_outline_small.png");
        this.load.image("bullet", "icon_bullet_silver_short.png");
        this.load.image("enemyBullet", "icon_bullet_gold_short.png");
        this.load.image("regularDuck", "duck_outline_brown.png");
        this.load.image("yellowDuck", "duck_outline_yellow.png");

        this.load.image("gallery_shooter_tiles", "spritesheet_stall.png"); //Tile sheet   
        this.load.tilemapTiledJSON("map", "GalleryShooterMap.json");

        //this.load.audio();
    } 

    //TODO: Fix curtains in scene
    create() {
        let my = this.my; //Create an alias to this.my for readability

        this.init_game(); //reset game variables

        this.map = this.add.tilemap("map", 16, 16, 20, 20);
        this.tileset = this.map.addTilesetImage("gallery-shooter-packed", "gallery_shooter_tiles");
        // Create a tile map layer
        this.woodLayer = this.map.createLayer("Wood", this.tileset, 0, 0);
        this.grassBackgroundLayer = this.map.createLayer("GrassBackground", this.tileset, 0, 0);
        this.grassLayer = this.map.createLayer("Grass", this.tileset, 0, 0);
        //Set scale for scene
        this.woodLayer.setScale(2.0);
        this.grassLayer.setScale(2.0);
        this.grassBackgroundLayer.setScale(2.0);

        //Key objects
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        my.sprite.player = this.add.sprite(this.playerX, this.playerY, "player");

        this.bulletSpeed = 5;
        this.regularDuckSpeed = 2; //Note: could these be variables of the group?
        this.yellowDuckSpeed = 3;
        this.regularDuckPoints = 10;
        this.yellowDuckPoints = 25;

        //Group of regular duck enemies
        my.sprite.regularDuckGroup = this.add.group({
            defaultKey: "regularDuck",
            maxSize: 6
        })
        my.sprite.regularDuckGroup.createMultiple({
            active: false,
            key: my.sprite.regularDuckGroup.defaultKey,
            repeat: my.sprite.regularDuckGroup.maxSize-1
        });
        
        //Group of yellow duck enemies
        my.sprite.yellowDuckGroup = this.add.group({
            defaultKey: "yellowDuck",
            maxSize: 6
        })
        my.sprite.yellowDuckGroup.createMultiple({
            active: false,
            key: my.sprite.yellowDuckGroup.defaultKey,
            repeat: my.sprite.yellowDuckGroup.maxSize-1
        });

        //Place curtains above background and ducks, but below score
        this.curtainsLowerLayer = this.map.createLayer("CurtainsLower", this.tileset, 0, 0);
        this.curtainsUpperLayer = this.map.createLayer("CurtainsUpper", this.tileset, 0, 0);
        this.curtainsUpperLayer.setScale(2.0);
        this.curtainsLowerLayer.setScale(2.0);

        //Display Score
        my.text.score = this.add.text(550, 5, "Score: " + this.score, {
            fontFamily: 'Times, serif',
            fontSize: 24,
            wordWrap: {
                width: 60
            }
        });

        //Display Score
        my.text.health = this.add.text(550, 70, "Health: " + this.health + "/3", {
            fontFamily: 'Times, serif',
            fontSize: 24,
            wordWrap: {
                 width: 60
            }
        });

        //document.getElementById('description').innerHTML = '<h2>A - Left // D - Right // SPACE - Fire</h2>'
    }

    //Reset game variables between scenes
    init_game() {
        this.score = 0;
        this.health = 3;
    }

    update() {
        let my = this.my;

        this.updateDucks(my.sprite.regularDuckGroup, this.regularDuckCooldownCounter--);
        this.updateDucks(my.sprite.yellowDuckGroup, this.yellowDuckCooldownCounter--);
        this.checkKeyPress();

        this.fireEnemyBullet(); //TODO: Wait between calls

        my.sprite.bullet = my.sprite.bullet.filter((bullet) => bullet.y > -(bullet.displayHeight/2));
        my.sprite.enemyBullet = my.sprite.enemyBullet.filter((ememyBullet) => ememyBullet.y > (ememyBullet.displayHeight/2));

        this.checkEnemyCollision(my.sprite.regularDuckGroup);
        this.checkEnemyCollision(my.sprite.yellowDuckGroup);
        this.checkPlayerCollision();

        for(let bullet of my.sprite.bullet) {
            bullet.y -= this.bulletSpeed;
        }
        for(let bullet of this.my.sprite.enemyBullet) {
            bullet.y += this.bulletSpeed;
        }
    }

    //Function to check for player key presses
    checkKeyPress() {
        let my = this.my;
        if (this.aKey.isDown && my.sprite.player.x > 0) {
            my.sprite.player.x -= 10;
        }  else if (this.dKey.isDown && my.sprite.player.x < 640) { //640 is the width of the canvas
            my.sprite.player.x += 10;
        }
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            if(my.sprite.bullet.length < this.maxBullets) {
                my.sprite.bullet.push(this.add.sprite(
                    my.sprite.player.x, my.sprite.player.y-(my.sprite.player.displayHeight/2), "bullet")
                );
            }
            this.updateLayers();
        }
    }

    //Function that fires enemies' bullets at random
    //Note: This is a super janky way to do this with random numbers
    fireEnemyBullet() {
        let random = Math.floor(Math.random()*100); //get random number between 0 - 99
        for(let duck of this.my.sprite.yellowDuckGroup.getChildren()) {
            if (duck.active == true && (random == 42 || random == 66)) { //check if duck is on screen and random val is 42 or 66
                this.my.sprite.enemyBullet.push(this.add.sprite(duck.x, duck.y+(duck.displayHeight/2), "enemyBullet"));
            }
            this.updateLayers();
        }
    }

    //Update curtain and text display
    //When bullets are fired, they will be placed below the curtains
    updateLayers() {
        this.curtainsLowerLayer.depth = 10; //Set depth of curtains and text to be higher than background
        this.curtainsUpperLayer.depth = 10;
        this.my.text.score.depth = 11;
        this.my.text.health.depth = 11;
    }

    //Function to control enemy duck placement
    updateDucks(ducks, counter) {
        let my = this.my;

        if(counter < 0) {
            let duck = ducks.getFirstDead();
            if (duck != null) {
                duck.active = true;
                duck.visible = true;
                duck.x = 640;
                duck.y = this.pickRandomLane();
                if(ducks == my.sprite.regularDuckGroup) { //check which cooldown to update (janky and bad)
                    this.regularDuckCooldownCounter = this.regularDuckCooldown;
                } else {
                    this.yellowDuckCooldownCounter = this.yellowDuckCooldown;
                }
            }
        }

        for(let duck of ducks.getChildren()) {
            if (duck.x < 0) { //if duck reaches the end of the screen
                duck.active = false;
                duck.visible = false;
            }
        }

        my.sprite.regularDuckGroup.incX(-this.regularDuckSpeed); //movement
        my.sprite.yellowDuckGroup.incX(-this.yellowDuckSpeed); //movement
    }

    //Helper function that randomly chooses where ducks appear
    pickRandomLane() {
        var lanes = [100, 300, 500];  //Three different lanes: 100px, 300px, 500px
        return lanes[Math.floor(Math.random()*lanes.length)];
    }

    //Checks player collision
    checkPlayerCollision() {
        let my = this.my;
        for (let bullet of my.sprite.enemyBullet) {
            if (this.collides(my.sprite.player, bullet)) {
                // clear out bullet -- put y offscreen, will get reaped next update
                bullet.y = -100;
                // Update health
                this.health--;
                this.updateHealth();
                if(this.health == 0) { //if health reaches 0, game over
                    this.scene.start("gameOver", {score: this.score});
                }
            }
        }
    }

    checkEnemyCollision(ducks) {
        let my = this.my;
        for (let bullet of my.sprite.bullet) {
            for(let duck of ducks.getChildren()) {
            if (this.collides(duck, bullet)) {
                // clear out bullet -- put y offscreen, will get reaped next update
                bullet.y = -100;
                duck.visible = false;
                duck.x = -100;
                // Update score
                if (ducks == my.sprite.regularDuckGroup) {this.score += this.regularDuckPoints;}
                else {this.score += this.yellowDuckPoints;}
                this.updateScore();
            }
        }
        }
    }

    // A center-radius AABB collision check. From ArrayBoom.js
    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }
        
    //Helper function to update score
    updateScore() {
        this.my.text.score.setText("Score: " + this.score);
    }

    updateHealth() {
        this.my.text.health.setText("Health: " + this.health + "/3");
    }
}