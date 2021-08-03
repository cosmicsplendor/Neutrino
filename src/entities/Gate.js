import TexRegion from "@lib/entities/TexRegion"
import { clamp } from "@utils/math"

import imgId from "@assets/images/texatlas.png"
import metaId from "@assets/images/atlasmeta.cson"

class Gate extends TexRegion {
    constructor({ endY, speed=160, pos, ...rest }) {
        super({ imgId, metaId, frame: "gate", pos, ...rest })
        this.endY = endY
        this.startY = pos.y
        this.velY = -speed
    }
    updatePos(dt) { 
        const prevPosY = this.pos.y
        this.pos.y = clamp(this.endY, this.startY, this.pos.y)
        if (prevPosY !== this.pos.y) { // if the gate is at the y-extremes, reverse it's vertical velocity
            this.velY = -this.velY
        }
        this.pos.y += dt * this.velY
    }
    update(dt) {
        this.updatePos(dt)
    }
}

export default Gate