import { Node, Rect, Canvas2DRenderer, math, utils } from "@lib"

const worldDimensions = Object.freeze({
    width: window.innerWidth,
    height: window.innerHeight
})
const gameWorld = new Node()
const platform = new Rect({ width: 100, height: 20, fill: "lavender" })
platform.vel = { x: 200, y: 0 }
 
platform.pos.y = worldDimensions.height / 2 - 10
gameWorld.add(platform)

platform.update = function(dt) {
    this.pos.x += this.vel.x * dt
}

const renderer = new Canvas2DRenderer({ canvasId: "arena", scene: gameWorld, background: "#333", ...worldDimensions})


const mainUpdateFn = () => {
    if (platform.pos.x < 0 || platform.pos.x + platform.width > worldDimensions.width) {
        platform.pos.x = math.clamp(0, worldDimensions.width - platform.width, platform.pos.x)
        platform.vel.x *= -1
    }
}

utils.startGameLoop({
    mainUpdateFn,
    renderer
})