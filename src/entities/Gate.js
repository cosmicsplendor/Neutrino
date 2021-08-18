import TexRegion from "@lib/entities/TexRegion"
import { clamp, len, sign, easingFns } from "@utils/math"

import imgId from "@assets/images/texatlas.png"
import metaId from "@assets/images/atlasmeta.cson"

class Gate extends TexRegion {
    constructor({ endY, soundSprite, movSound, speed=150, pos, player, ...rest }) {
        super({ imgId, metaId, frame: "gate", pos, ...rest })
        this.endY = endY
        this.startY = pos.y
        this.initDir = sign(this.endY - this.startY)
        this.dir = this.initDir
        this.dist = Math.abs(this.endY - this.startY)
        this.period = this.dist / speed
        this.t = 0
        this.movSound = movSound
        this.playerPos = player.pos
        this.diag = len(this.width / 2, this.height / 2)
    }
    updatePos(dt) {
        this.t += dt
        const dp = this.dist * easingFns.cubicOut(this.t / this.period)
        this.pos.y = (this.dir === this.initDir ? this.startY: this.endY) + dp * this.dir
        const newPosY = this.startToEndDir === 1 ? clamp(this.startY, this.endY, this.pos.y): clamp(this.endY, this.startY, this.pos.y)
        if (newPosY !== this.pos.y) { // if the gate has gone beyond extremes
            this.t = 0
            this.dir *= -1
            this.pos.y = newPosY
        }
    }
    updateAudio(mov) { // momvement
        const volume = clamp(0, 1, (mov / 4) * this.diag / len(this.pos.x - this.playerPos.x, this.pos.y - this.playerPos.y) )
        this.movSound.play(volume)
    }
    reset() {
        this.pos.Y = this.startY
        this.velY = this.velY0
    }
    update(dt) {
        const prevPosY = this.pos.y
        this.updatePos(dt)  
        this.updateAudio(Math.abs(this.pos.y - prevPosY))
    }
}

export default Gate