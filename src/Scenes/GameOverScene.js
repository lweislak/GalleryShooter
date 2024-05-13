class GameOver extends Phaser.Scene {
    constructor() {
        super("gameOver");
    }
 
     preload() {

     }
    
     //Resource: https://dev.to/ceceliacreates/working-with-scenes-and-data-in-phaser-2pn4
     init (data) {
        this.finalScore = data.score;
     }

     create() {
        this.rKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
     }
 
     update() {
        if (Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.start("first");
        }
     }
 }