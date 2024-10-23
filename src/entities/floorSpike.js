import TexRegion from "@lib/entities/TexRegion"
import { clamp, easingFns } from "@utils/math"
import getTestFn from "@lib/components/Collision/helpers/getTestFn"

class FloorSpike extends TexRegion {
    constructor({ uSound, dSound, pos, player, delay=0, period=1.5, ...rest }) {
        super({ frame: "spike", pos, ...rest })
        this.endY = pos.y + 40
        this.startY = pos.y
        this.initDir = -1
        this.dir = this.initDir
        this.dist = 40
        this.period = period
        this.t = -delay
        this.uSound = uSound
        this.dSound = dSound
        this.player = player
        this.testCol = getTestFn(this, player)
    }
    updatePos(dt) {
        this.t += dt
        const dp = this.dist * easingFns.cubicIn(this.t / this.period)
        this.pos.y = (this.dir === this.initDir ? this.startY: this.endY) + dp * this.dir
        const newPosY = this.startToEndDir === 1 ? clamp(this.startY, this.endY, this.pos.y): clamp(this.endY, this.startY, this.pos.y)
        if (newPosY !== this.pos.y) { // if the FloorSpike has gone beyond extremes
            this.t = 0
            this.dir *= -1
            this.pos.y = newPosY
            const dPX = this.pos.x + this.w / 2 - this.player.pos.x
            const dPY = this.pos.y + this.h / 2 - this.player.pos.y
            if (dPX * dPX + dPY * dPY > 160000 || !this.uSound || !this.bSound) return // if the distance from player is greater than 400px return
            if (this.dir === 1) { // just collided with ceiling
                return this.uSound?.play()
            }
            this.dSound.play()
        }
    }
    reset() {
        this.pos.Y = this.startY
        this.velY = this.velY0
    }
    update(dt) {
        this.updatePos(dt)  
        if (this.testCol(this, this.player)) {
            this.player.visible && this.player.explode()
        }
    }
}

export default FloorSpike