class FirstScene extends Phaser.Scene {
    constructor() {
        super("first");
        this.my = {sprite: {}};  // Create an object to hold sprite bindings

        this.playerX = 320;
        this.playerY = 600;

        this.my.sprite.bullet = [];
        this.maxBullets = 10;
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("player", "crosshair_outline_small.png");
        this.load.image("bullet", "icon_bullet_silver_short.png");
        this.load.image("regularDuck", "duck_brown.png");
        this.load.image("gallery_shooter_tiles", "spritesheet_stall.png");    // tile sheet   
        this.load.tilemapTiledJSON("map", "GalleryShooterMap.json");
        
    } 

    create() {
        let my = this.my; // create an alias to this.my for readability

        this.map = this.add.tilemap("map", 16, 16, 20, 20); //Add tile map
        this.tileset = this.map.addTilesetImage("gallery-shooter-packed", "gallery_shooter_tiles"); //Add tileset
        // Create a tile map layer
        this.woodLayer = this.map.createLayer("Wood", this.tileset, 0, 0);
        this.grassBackgroundLayer = this.map.createLayer("GrassBackground", this.tileset, 0, 0);
        this.grassLayer = this.map.createLayer("Grass", this.tileset, 0, 0);
        this.curtainsLowerLayer = this.map.createLayer("CurtainsLower", this.tileset, 0, 0);
        this.curtainsUpperLayer = this.map.createLayer("CurtainsUpper", this.tileset, 0, 0);
        //Set scale for scene
        this.woodLayer.setScale(2.0);
        this.curtainsUpperLayer.setScale(2.0);
        this.curtainsLowerLayer.setScale(2.0);
        this.grassLayer.setScale(2.0);
        this.grassBackgroundLayer.setScale(2.0);

        //Key objects
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        my.sprite.player = this.add.sprite(this.playerX, this.playerY, "player");

        this.bulletSpeed = 5;

        document.getElementById('description').innerHTML = '<h2>A - Left // D - Right // SPACE - Fire</h2>'
    }

    update() {
        let my = this.my;   // create an alias to this.my for readability

        this.checkKeyPress();

        for(let bullet of my.sprite.bullet) {
            bullet.y -= this.bulletSpeed;
        }
        my.sprite.bullet = my.sprite.bullet.filter((bullet) => bullet.y > -(bullet.displayHeight/2));

    }

    //Helper function to check for player key presses
    checkKeyPress() {
        let my = this.my;   // create an alias to this.my for readability
        if (this.aKey.isDown && this.playerX > 0) {
            my.sprite.player.x -= 10;
        }  else if (this.dKey.isDown && this.playerX < 640) { //640 is the width of the canvas
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
}