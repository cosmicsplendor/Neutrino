import { TexRegion } from "@lib/entities"
import getTestFn from "@lib/components/Collision/helpers/getTestFn"
import MovableEnt from "./MovableEnt"

const offset = 2
const hheight = 24 // laser head height
const bLen = 48 // laser body length
const bWidth = 12 // laser body width
class Laser extends MovableEnt {
    constructor(x, y, toX=x, toY=y, speed=100, num=2, vert, period, player, sound) {
        const frame = vert ? "vlhd": "hlhd"
        const bFrame = vert ? "vlbod": "hlbod" // body frame
        const xOffset = vert ? offset: hheight
        const yOffset = vert ? hheight: hheight - offset - bWidth
        const xStep = vert ? 0: bLen
        const yStep = vert ? bLen: 0
        super(x, y, frame, toX, toY, speed=100, player)
        for (let i = 0; i < num; i++) {
            const body = new TexRegion({ frame: bFrame })
            body.pos.x += xOffset + xStep * i
            body.pos.y += yOffset + yStep * i
            this.add(body)
        }
        this.hitbox = {
            x: vert ? offset: 0,
            y: vert ? 0: offset,
            width: vert ? bWidth: hheight + bLen * num,
            height: vert ? hheight + bLen * num: height 
        }
        this.testCol = getTestFn(this, this.player)
        if (!!period) { 
            this.period = period
            this.t = 0
            this.on = true
            this.sound = sound
        }
    }
    update(dt) {
        super.update(dt)
        this.elapsed += dt
        if (this.testCol(this, this.player) && this.player.visible && this.on) {
            this.player.explode()
        }
        if (!!this.period) {
            this.t += dt
            if (this.t > this.period) {
                this.on = !this.on
                this.t = 0
                for (let child of this.children) {
                    child.alpha = this.on ? 1: 0
                }
                this.on && this.sound.play()
            }
        }
    }
}

export default Laser