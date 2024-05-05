class FirstScene extends Phaser.Scene {
    constructor() {
        super("first");
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("gallery_shooter_tiles", "spritesheet_stall.png");    // tile sheet   
        this.load.tilemapTiledJSON("map", "GalleryShooterMap.json");
    }

    create() {
        // Add a tile map
        // https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.GameObjectFactory.html#tilemap__anchor
        // "map" refers to the key from load.tilemapTiledJSON
        // The map uses 16x16 pixel tiles, and is 10x10 tiles large
        this.map = this.add.tilemap("map", 16, 16, 20, 20); 

        // Add a tileset to the map
        // First parameter: the name we gave to the tileset when it was added to Tiled
        // Second parameter: the key for the tilesheet (from this.load.image above)
        // https://photonstorm.github.io/phaser3-docs/Phaser.Tilemaps.Tilemap.html#addTilesetImage__anchor
        this.tileset = this.map.addTilesetImage("gallery-shooter-packed", "gallery_shooter_tiles");

        // Create a tile map layer
        // First parameter: name of the layer from Tiled
        // https://newdocs.phaser.io/docs/3.54.0/Phaser.Tilemaps.Tilemap#createLayer
        this.woodLayer = this.map.createLayer("Wood", this.tileset, 0, 0);
        this.grassBackgroundLayer = this.map.createLayer("GrassBackground", this.tileset, 0, 0);
        this.grassLayer = this.map.createLayer("Grass", this.tileset, 0, 0);
        this.curtainsLowerLayer = this.map.createLayer("CurtainsLower", this.tileset, 0, 0);
        this.curtainsUpperLayer = this.map.createLayer("CurtainsUpper", this.tileset, 0, 0);
        this.woodLayer.setScale(2.0);
        this.curtainsUpperLayer.setScale(2.0);
        this.curtainsLowerLayer.setScale(2.0);
        this.grassLayer.setScale(2.0);
        this.grassBackgroundLayer.setScale(2.0);


        document.getElementById('description').innerHTML = '<h2>Gallery Shooter</h2>'
    }

    update() {


    }
}