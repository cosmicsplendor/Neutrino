import { Node, Rect, IsoCube, Canvas2DRenderer, utils } from "@lib"
import config from "@config"
import Platform from "./entities/Platform"

const { viewport: canvasDimensions } = config


const gameWorld = new Node()
const platform = new Platform()
const player = new Rect({ width: 30, height: 30, fill: "tomato" })

const blocks = new Node()
blocks.pos.x = 100
const b1 = new IsoCube({ pos: { x: 100, y: 100 } })
const b2 = new IsoCube({ pos: { x: 100 - 40, y: 100 } })
const b3 = new IsoCube({ pos: { x: 100 - 40, y: 100 - 40 } })
const b4 = new IsoCube({ pos: { x: 100 - 80, y: 100 } })
const b5 = new IsoCube({ pos: { x: 100 - 120, y: 100 } })
blocks.add(b1).add(b2).add(b3).add(b4).add(b5)
blocks.vel = { x: 0, y: 0 }
 
platform.add(player)
// gameWorld.add(platform)
gameWorld.add(blocks)

const renderer = new Canvas2DRenderer({ canvasId: "arena", scene: gameWorld, background: "#000", ...canvasDimensions})

const mainUpdateFn = (dt) => {
    blocks.vel.y += 1000 * dt
    blocks.pos.y += blocks.vel.y * dt
    if (blocks.pos.y > canvasDimensions.height - 500) {
        blocks.pos.y = canvasDimensions.height - 500
        blocks.vel.y *= -0.5
    }
 }

utils.startGameLoop({
    mainUpdateFn,
    renderer
})