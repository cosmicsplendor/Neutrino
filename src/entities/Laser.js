import { TexRegion } from "@lib/entities"
import getTestFn from "@lib/components/Collision/helpers/getTestFn"
import MovableEnt from "./MovableEnt"

const offset = 6
const hheight = 24 // laser head height
const bLen = 48 // laser body length
const bWidth = 12 // laser body width
class Laser extends MovableEnt {
    constructor(x, y, toX=x, toY=y, speed=100, player, num, vert, period) {
        const frame = vert ? "vlhead": "hlhead"
        const bFrame = vert ? "vlbod": "hlbod" // body frame
        const xOffset = vert ? 0: offset
        const yOffset = vert ? offset: 0
        const xStep = vert ? 0: bLen
        const yStep = vert ? bLen: 0
        super(x, y, frame, toX=x, toY=y, speed=100, player)
        for (let i = 0; i < num; i++) {
            const body = new TexRegion({ frame: bFrame })
            body.pos.x += xOffset
            body.pos.y += yOffset
            body.pos.x += xStep * i
            body.pos.y += yStep * i
        }
        this.hitbox = {
            x: vert ? offset: 0,
            y: vert ? 0: offset,
            width: vert ? bWidth: hheight + bLen * num,
            height: vert ? hheight + bLen * num: height 
        }
        this.testCol = getTestFn(this.player)
    }
    update(dt) {
        super.update(dt)
        this.elapsed += dt
        if (this.testCol(this, this.player) && this.player.visible) {
            this.player.explode()
        }
    }
}
export default Laser