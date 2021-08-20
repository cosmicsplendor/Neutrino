import ParticleEmitter from "@lib/utils/ParticleEmitter"
import { sqLen } from "@lib/utils/math"
import getTestFn from "@lib/components/Collision/helpers/getTestFn"

class Orb extends ParticleEmitter {
    constructor({ player, sound, movSound, ...rest }) {
        super({ ...rest })
        this.player = player
        this.sound = sound
        this.movSound = movSound
        this.testCol = getTestFn(this, player)
        this.hitbox = { x: 5, y: 5, width: 14, height: 14}
    }
    update(dt) {
        const dPosX = this.player.pos.x + this.player.width / 2 - this.pos.x
        const dPosY = this.player.pos.y + this.player.width / 2 - this.pos.y
        const sqDist = sqLen(dPosX, dPosY)
        if (sqDist > 90000) { // distance > 200
            this.movSound.pause()
            return 
        }
        this.pos.x += dPosX / 35
        this.pos.y += dPosY / 35
        this.movSound.play()
        if (this.testCol(this, this.player) && this.player.visible) {
            this.sound.play(1 - (sqDist / 9000))
            this.movSound.pause()
            this.remove()
        }
    }
    reset() { }
}

export default Orb