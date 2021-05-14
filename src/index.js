import { Camera, Canvas2DRenderer } from "@lib"
import { startGameLoop } from "@utils"
import config from "@config"
import Wall from "@entities/Wall"
import Player from "./entities/Player"
import bgMusic from "./assets/audio/bg.wav"

console.log({ bgMusic })

const { viewport: canvasDimensions } = config

const gameWorld = new Camera({ id: "root", viewport: canvasDimensions, world: { ...canvasDimensions, width: 1000 } })

const wall = new Wall({ id: "wall" })
const player = new Player({ width: 24, height: 24, fill: "goldenrod", id: "player" })

gameWorld.setSubject(player)
gameWorld.add(wall)
gameWorld.add(player)

const renderer = new Canvas2DRenderer({ canvasId: "arena", scene: gameWorld, background: "black", ...canvasDimensions })

const mainUpdateFn = (dt) => { 

}

const loopControls = startGameLoop({
    mainUpdateFn,
    renderer
})

// loopControls.setSpeed(0.5)
// setTimeout(() => loopControls.pause(), 6000)