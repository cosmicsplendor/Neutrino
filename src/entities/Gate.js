import TexRegion from "@lib/entities/TexRegion"
import { clamp, sign } from "@utils/math"

import imgId from "@assets/images/texatlas.png"
import metaId from "@assets/images/atlasmeta.cson"

class Gate extends TexRegion {
    constructor({ endY, speed=150, pos, ...rest }) {
        super({ imgId, metaId, frame: "gate", pos, ...rest })
        this.endY = endY
        this.startY = pos.y
        this.startToEndDir = sign(this.endY - this.startY)
        this.velY0 = this.velY = Math.abs(speed) * this.startToEndDir
    }
    updatePos(dt) {
        this.pos.y += this.velY * dt
        const newPosY = this.startToEndDir === 1 ? clamp(this.startY, this.endY, this.pos.y): clamp(this.endY, this.startY, this.pos.y)
        if (newPosY !== this.pos.y) { // if the gate has gone beyond extremes
            this.pos.y = newPosY
            this.velY = -1 * this.velY
        }
    }
    reset() {
        this.pos.Y = this.startY
        this.velY = this.velY0
    }
    update(dt) {
        this.updatePos(dt)  
    }
}

export default Gate