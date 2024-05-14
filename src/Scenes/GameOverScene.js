class GameOver extends Phaser.Scene {
    constructor() {
        super("gameOver");
        this.my = {text:{}};
    }
 
     preload() {
        this.load.setPath("./assets/");
        this.load.image("background", "bg_blue.png");
     }
    
     //Resource: https://dev.to/ceceliacreates/working-with-scenes-and-data-in-phaser-2pn4
     init (data) {
        this.finalScore = data.score;
     }

     create() {
        this.rKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        let bg  = this.add.sprite(300, 300, "background");
        bg.setScale(3.0);

        //Display final score
        this.my.text.score = this.add.text(160, 200, "Final Score: " + this.finalScore, {
            fontFamily: 'Times, serif',
            fontSize: 50,
            color: 'black'
        });

        //Display restart
        this.my.text.restart = this.add.text(130, 400, "Press 'r' to restart!", {
            fontFamily: 'Times, serif',
            fontSize: 50,
            color: 'black'
        });
     }
 
     update() {
        if (Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.start("first");
        }
     }
 }