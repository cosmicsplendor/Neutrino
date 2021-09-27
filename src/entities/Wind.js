import ParticleEmitter from "@lib/utils/ParticleEmitter"
import config from "@config"
import { sqLen } from "@lib/utils/math"
import getTestFn from "@lib/components/Collision/helpers/getTestFn"

class Wind extends ParticleEmitter {
    constructor(data, x, y, player) {
        super(data)
        // this.rotation = -Math.PI / 2
        this.pos.x = x
        this.pos.y = y - 9
        this.player = player
        // this.sound = sound
        this.hitbox = { x: -25, y: -200, width: 50, height: 200}
        this.testCol = getTestFn(this, player)
        ParticleEmitter.feed(this, 120, 1 / 60)
    }
    update(dt) {
        if (this.testCol(this, this.player) && this.player.visible) {
            const dPosX = this.player.pos.x + this.player.width / 2 - this.pos.x
            const dPosY = this.player.pos.y + this.player.width / 2 - this.pos.y
            const sqDist = sqLen(dPosX, dPosY)
            if (sqDist < 6400) { return }
            this.player.controls.switchState("jumping", this.player)
            this.player.velY -= config.gravity * (sqDist / 32400) * dt
        }
    }
    reset() { }
    onRemove() {
        this.parent = null
    }
}

export default Wind