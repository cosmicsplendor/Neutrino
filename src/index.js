import { Node, Canvas2DRenderer, utils } from "@lib"
import config from "@config"
import Wall from "./entities/Wall"
import Player from "./entities/Player"

const { viewport: canvasDimensions } = config


const gameWorld = new Node()
const wall = new Wall({ gridWidth: 10 })

const player = new Player({ width: 24, blocks: wall.children, height: 24, fill: "cadetblue" })
gameWorld.add(wall)
gameWorld.add(player)

const renderer = new Canvas2DRenderer({ canvasId: "arena", scene: gameWorld, background: "black", ...canvasDimensions })

const mainUpdateFn = (dt) => { 

}

utils.startGameLoop({
    mainUpdateFn,
    renderer
})