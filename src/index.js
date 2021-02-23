import Node from "./entities/Node"
import Texture from "./entities/core/Texture"
import * as texRegionUtils from "./entities/core/TexRegion"
import Canvas2DRenderer from "./renderer/Canvas2D"

import bgAtlasMeta from "./assets/atlasmeta.json"
import bgAtlasImg from "./assets/texatlas.png"

const bgTexAtlas = texRegionUtils.createAtlas({ meta: bgAtlasMeta, texture: new Texture({ imgUrl: bgAtlasImg })})

const wall = bgTexAtlas.spawnRegion({ frame: "wall" })
const spike = bgTexAtlas.spawnRegion({ frame: "spike"})
const aqueduct = bgTexAtlas.spawnRegion({ frame: "aqueduct" })
const tower = bgTexAtlas.spawnRegion({ frame: "tower" })
const gate = bgTexAtlas.spawnRegion({ frame: "gate" })

const gameWorld = new Node()
gameWorld.add(aqueduct)
aqueduct.pos.x = 100
aqueduct.pos.y = 100

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
    aqueduct.rotation += 1
})()