import { TexRegion } from "@lib"
import { easingFns } from "@utils/math"

class Bus extends TexRegion {
    hitbox = {
        x: 2,
        y: 0,
        width: 86,
        height: 88
    }
    constructor(x, y, toX, toY, period) {
        super({ pos: { x, y }, frame: "crane" })
        this.prevPosY = this.pos.y
        this.prevPosX = this.pos.x
        this.mat = "metal"
        this.movable = true

        this.dispY = toY - y
        this.dispX = toX - x
        this.meanX = x
        this.meanY = y
        this.period = period
        this.t = 0

        this.xMovement = x !== toX
        this.yMovement = y !== toY
    }
    updateX(dt) {
        if (!this.xMovement) return
        this.pos.x = this.meanX + easingFns.smoothStep(this.t / this.period) * this.dispX
        if (this.t > this.period) {
            this.meanX = this.meanX + this.dispX
            this.pos.x = this.meanX
            this.dispX *= -1
        }
        this.prevPosY = this.pos.y
        this.velX = (this.pos.x - this.prevPosX) / dt
    }
    updateY(dt) {
        if (!this.yMovement) return
        this.pos.y = this.meanY + easingFns.smoothStep(this.t / this.period) * this.dispY
        if (this.t > this.period) {
            this.meanY = this.meanY + this.dispY
            this.pos.y = this.meanY
            this.dispY *= -1
            this.t = 0
        }
        this.velY = (this.pos.y - this.prevPosY) / dt
        this.prevPosX = this.pos.x
    }
    update(dt) {
        this.t += dt
        this.updateX(dt)
        this.updateY(dt)
    }
}


export default Bus