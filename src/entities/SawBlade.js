import { TexRegion } from "@lib"
import getTestFn from "@lib/components/Collision/helpers/getTestFn"
import { clamp, sign } from "@utils/math"

const ANG_VEL = -1 * Math.PI
class SawBlade extends TexRegion {
    constructor(x, y, frame, toX=x, toY=y, speed=100, player) {
        super({ frame, pos: { x, y } })
        this.speed = speed
        this.player = player
        this.fromX = x
        this.fromY = y
        this.toX = toX
        this.toY = toY
        this.anchor = {
            x: this.width / 2,
            y: this.height / 2
        }
        this.radius = this.width / 2
        this.hitCirc = { x: 0, y: 0, radius: this.radius }
        this.velX = (toX - x) === 0 ? 0: sign(toX - x) * speed
        this.velY = (toY - y) === 0 ? 0: sign(toY - y) * speed
        this.rotation = 0
        this.testCol = getTestFn(this, player)
        this.clampX0 = this.fromX < this.toX ? this.fromX: this.toX
        this.clampX1 = this.toX > this.fromX ? this.toX: this.fromX
        this.clampY0 = this.fromY < this.toY ? this.fromY: this.toY
        this.clampY1 = this.toY > this.fromY ? this.toY: this.fromY
    }
    update(dt) {
        const newPosX = this.pos.x + this.velX * dt
        const newPosY = this.pos.y + this.velY * dt
        const dRot = (this.velX  - this.velY) * dt / (2 * this.radius)

        this.pos.x = clamp(this.clampX0, this.clampX1, newPosX)
        this.pos.y = clamp(this.clampY0, this.clampY1, newPosY)

        ;(this.pos.x !== newPosX) && (this.velX *= -1) // in case the blade moved beyond it's x bounds, reverse it's x-velocity
        ;(this.pos.y !== newPosY) && (this.velY *= -1)

        this.rotation += dRot || ANG_VEL * dt
        if (this.testCol(this, this.player)) {
            this.player.visible && this.player.explode()
        }
    }
}

export default SawBlade