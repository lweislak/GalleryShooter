class StartScene extends Phaser.Scene {
    constructor() {
        super("start");
        this.my = {text:{}};
    }
 
     preload() {
        this.load.setPath("./assets/");
        this.load.image("background", "bg_blue.png");
     }

     create() {
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        let bg  = this.add.sprite(300, 300, "background");
        bg.setScale(3.0);

        this.my.text.title = this.add.text(20, 100, "Carnival Shooting Game", {
            fontFamily: 'Times, serif',
            fontSize: 60,
            color: 'black'
        });

        this.my.text.controls = this.add.text(200, 200, "Controls:\nA - left\nD - right\nSPACE - shoot", {
            fontFamily: 'Times, serif',
            fontSize: 50,
            color: 'black'
        });

        this.my.text.start = this.add.text(100, 500, "Press SPACE to start!", {
            fontFamily: 'Times, serif',
            fontSize: 50,
            color: 'black'
        });
     }
 
     update() {
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.scene.start("first");
        }
     }
 }