import { TexRegion } from "@lib"
import { easingFns } from "@utils/math"

class Bus extends TexRegion {
    hitbox = {
        x: 2,
        y: 0,
        width: 86,
        height: 88
    }
    constructor(x, y, toX, toY, period) { // spawn points for movable collidable entities have to be on midground layer (on tiled layer should be set to mg)
        super({ pos: { x, y }, frame: "crane" })
        this.prevPosY = this.pos.y
        this.prevPosX = this.pos.x
        this.mat = "metal"
        this.movable = true

        this.dispY = toY - y
        this.distX = toX - x
        this.meanX = x
        this.meanY = y
        this.period = period
        this.t = 0

    }
    update(dt) {
        this.t += dt
        this.pos.y = this.meanY + easingFns.smoothStep(this.t / this.period) * this.dispY
        if (this.t > this.period) {
            this.meanY = this.meanY + this.dispY
            this.pos.y = this.meanY
            this.dispY *= -1
            this.t = 0
        }
        this.velY = (this.pos.y - this.prevPosY) / dt
    }
}

export default Bus