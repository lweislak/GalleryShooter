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
    width: 640,  
    height: 640,
    scene: [FirstScene] //TODO: Add 3 scenes, one for each level
}

const game = new Phaser.Game(config);