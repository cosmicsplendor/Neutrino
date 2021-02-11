import Node from "./entities/Node"
import Texture from "./entities/core/Texture"
import Rect from "./entities/core/Rect"
import Canvas2DRenderer from "./renderer/Canvas2D"

import * as mUtils from "./math/utils"
import packRects from "./tools/texture packer"

import wallImg from "./images/background/wall.png"
import gateImg from "./images/background/gate.png"
import roofImg from "./images/background/spike.png"
import pack from "./tools/texture packer"

const gameWorld = new Node()

const rectsToPack = Array(100).fill(0).map(() => {
    const len = mUtils.skewedRand(50, 25)

    return new Rect({
        width: len,
        height: len,
        fill: `hsl(${mUtils.rand(360)}, 50%, 50%)`,
        stroke: "#000"
    })
})
console.log({ rectsToPack })
const rectsContainer = new Node()
gameWorld.add(new Rect({ width: 500, height: 1000, fill: "black" }))
         .add(rectsContainer)
packRects(rectsToPack).forEach(rect => {
    rectsContainer.add(rect)
})

// const wall = new Texture({ imgUrl: wallImg })
// const gate = new Texture({ imgUrl: gateImg })
// const roof = new Texture({ imgUrl: roofImg })
// const house = new Node()

// house.add(wall)
//      .add(gate)
//      .add(roof)
// wall.pos.y = roof.img.height
// gate.pos.y = wall.img.height


// gameWorld.add(house)
const renderer = new Canvas2DRenderer({ canvasId: "arena", scene: gameWorld})


const startGameLoop = mainUpdateFn => {
    function loop(ts) {
        mainUpdateFn(ts)
        renderer.renderRecursively()
        requestAnimationFrame(loop)
    }
    return () => {
        requestAnimationFrame(loop)
    }
}
startGameLoop(function() {
    // house.pos.x += 128 / 100
})()