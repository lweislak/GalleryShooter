class FirstScene extends Phaser.Scene {
    constructor() {
        super("first");
        this.my = {sprite: {}, text:{}};  // Create an object to hold sprite bindings

        this.playerX = 320; //Starting position
        this.playerY = 600;

        this.my.sprite.bullet = [];
        this.maxBullets = 10; //Max amount of bullets that can appear on screen
        this.score = 0;

        this.regularDuckCooldown = 60; //Number of update() calls to wait before making a new duck
        this.regularDuckCooldownCounter = 0;
    }

    preload() {
        this.load.setPath("./assets/");

        this.load.image("player", "crosshair_outline_small.png");
        this.load.image("bullet", "icon_bullet_silver_short.png");
        this.load.image("regularDuck", "duck_outline_brown.png");

        this.load.image("gallery_shooter_tiles", "spritesheet_stall.png"); //Tile sheet   
        this.load.tilemapTiledJSON("map", "GalleryShooterMap.json");

        //this.load.audio();
    } 

    //TODO: Fix curtains in scene
    create() {
        let my = this.my; //Create an alias to this.my for readability

        this.map = this.add.tilemap("map", 16, 16, 20, 20);
        this.tileset = this.map.addTilesetImage("gallery-shooter-packed", "gallery_shooter_tiles");
        // Create a tile map layer
        this.woodLayer = this.map.createLayer("Wood", this.tileset, 0, 0);
        this.grassBackgroundLayer = this.map.createLayer("GrassBackground", this.tileset, 0, 0);
        this.grassLayer = this.map.createLayer("Grass", this.tileset, 0, 0);
        //this.curtainsLowerLayer = this.map.createLayer("CurtainsLower", this.tileset, 0, 0);
        //this.curtainsUpperLayer = this.map.createLayer("CurtainsUpper", this.tileset, 0, 0);
        //Set scale for scene
        this.woodLayer.setScale(2.0);
        //this.curtainsUpperLayer.setScale(2.0);
        //this.curtainsLowerLayer.setScale(2.0);
        this.grassLayer.setScale(2.0);
        this.grassBackgroundLayer.setScale(2.0);

        //Key objects
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        my.sprite.player = this.add.sprite(this.playerX, this.playerY, "player");

        this.bulletSpeed = 5;
        this.regularDuckSpeed = 3;

        //Group of regular duck enemies
        my.sprite.regularDuckGroup = this.add.group({
            defaultKey: "regularDuck",
            maxSize: 6 
        })
        my.sprite.regularDuckGroup.createMultiple({
            active: false,
            key: my.sprite.regularDuckGroup.defaultKey,
            repeat: my.sprite.regularDuckGroup.maxSize-1,
            scorePoints: 10
        });

        //Display Score
        my.text.score = this.add.text(550, 5, "Score: " + this.score, {
            fontFamily: 'Times, serif',
            fontSize: 24,
            wordWrap: {
                width: 60
            }
        });

        //document.getElementById('description').innerHTML = '<h2>A - Left // D - Right // SPACE - Fire</h2>'
    }

    update() {
        let my = this.my;

        this.updateDucks();
        this.checkKeyPress();

        my.sprite.bullet = my.sprite.bullet.filter((bullet) => bullet.y > -(bullet.displayHeight/2));

        this.checkCollision(); //TODO: Fix
        
        for(let bullet of my.sprite.bullet) {
            bullet.y -= this.bulletSpeed;
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
        }
    }

    //Function to control enemy duck placement
    updateDucks() {
        let my = this.my;
        this.regularDuckCooldownCounter--;

        if(this.regularDuckCooldownCounter < 0) {
            let duck = my.sprite.regularDuckGroup.getFirstDead();
            if (duck != null) {
                duck.active = true;
                duck.visible = true;
                duck.x = 640;
                duck.y = this.pickRandomLane();
                this.regularDuckCooldownCounter = this.regularDuckCooldown;
            }
        }

        for(let duck of my.sprite.regularDuckGroup.getChildren()) {
            if (duck.x < 0) { //if duck reaches the end of the screen
                duck.active = false;
                duck.visible = false;
            }
        }

        my.sprite.regularDuckGroup.incX(-this.regularDuckSpeed); //movement
    }

    //Helper function that randomly chooses where ducks appear
    pickRandomLane() {
        var lanes = [100, 300, 500];  //Three different lanes: 100px, 300px, 500px
        return lanes[Math.floor(Math.random()*lanes.length)];
    }

    checkCollision() {  //TODO: Fix this!
        let my = this.my;
        for (let bullet of my.sprite.bullet) {
            if (this.collides(my.sprite.regularDuckGroup, bullet)) {
                // clear out bullet -- put y offscreen, will get reaped next update
                bullet.y = -100;
                my.sprite.regularDuckGroup.visible = false;
                my.sprite.regularDuckGroup.x = -100;
                // Update score
                this.myScore += my.sprite.regularDuckGroup.scorePoints;
                this.updateScore();
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
            let my = this.my;
            my.text.score.setText("Score: " + this.score);
        }
}