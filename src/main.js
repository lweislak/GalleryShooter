//Lo Weislak
//CMPM 120 - 5/6/24

// debug with extreme prejudice
"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    fps: {forceSetTimeOut: true, target:30},
    width: 640,  
    height: 640,
    scene: [StartScene, FirstScene, GameOver]
}

const game = new Phaser.Game(config);