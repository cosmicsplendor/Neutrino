import ParticleEmitter from "@lib/utils/ParticleEmitter"
import { sqLen } from "@lib/utils/math"
import getTestFn from "@lib/components/Collision/helpers/getTestFn"

class Orb extends ParticleEmitter {
    constructor({ player, sound, movSound, ...rest }) {
        super({ ...rest })
        this.player = player
        this.sound = sound
        this.movSound = movSound
        this.hitbox = { x: 5, y: 5, width: 14, height: 14}
        this.testCol = getTestFn(this, player)
        this.active = true
    }
    update() {
        if (!this.active) { return }
        const dPosX = this.player.pos.x + this.player.width / 2 - this.pos.x
        const dPosY = this.player.pos.y + this.player.width / 2 - this.pos.y
        const sqDist = sqLen(dPosX, dPosY)
        if (sqDist > 14400) { // distance > 120
            this.movSound.pause()
            return 
        }
        this.pos.x += dPosX / 30
        this.pos.y += dPosY / 30
        this.movSound.play()
        if (this.testCol(this, this.player) && this.player.visible) {
            this.sound.play(1 - (sqDist / 14400))
            this.movSound.pause()
            this.remove()
        }
    }
    reset() { }
}

export default Orb