import ParticleEmitter from "@lib/utils/ParticleEmitter"
import { sqLen } from "@lib/utils/math"
import getTestFn from "@lib/components/Collision/helpers/getTestFn"

class Orb extends ParticleEmitter {
    constructor({ player, ...rest }) {
        super({ ...rest })
        this.player = player
        this.testCol = getTestFn(this, player)
        this.hitbox = { x: 5, y: 5, width: 14, height: 14}
    }
    update(dt) {
        const dPosX = this.player.pos.x + this.player.width / 2 - this.pos.x
        const dPosY = this.player.pos.y + this.player.width / 2 - this.pos.y
        if (sqLen(dPosX, dPosY) > 90000) { // distance > 200
            return
        }
        this.pos.x += dPosX / 40
        this.pos.y += dPosY / 40
        if (this.testCol(this, this.player)) {
        }
    }
}

export default Orb