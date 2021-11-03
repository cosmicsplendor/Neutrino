import { Node, TexRegion } from "@lib"
import { clamp, easingFns } from "@utils/math"

class SurfaceElement extends TexRegion {
    constructor({ ...rest }) {
        super({ frame: "water", isCustom: true, ...rest })
    }
}

class Surface extends Node {
    constructor({ pos: { x, y }, numEl }) {
        super()
        const elWidth = 48, elHeight = 48
        this.numEl = numEl
        for (let i = 0; i < numEl; i++) {
            this.add(new SurfaceElement({ pos: { y, x: x + i * elWidth } }))
        }
        this.texYMax = this.children[0].frame[1] + elHeight
        this.maxHeight = elHeight
        this.yMax = y + this.maxHeight

        this.meanHeight = 24
        this.overflowHeight = this.meanHeight
        this.t = 0
        this.amp = 8
        this.period = Math.PI
    }
    set overflowHeight(val) {
        const newHeight = clamp(0, this.maxHeight, val)
        const newY = this.yMax - newHeight
        const newTexY = this.texYMax - newHeight
        for (let i = 0; i < this.numEl; i++) {
            const el = this.children[i]
            el.pos.y = newY
            el.frame[1] = newTexY
            el.frame[3] = newHeight
        }
    }
    update(dt) {
        this.t += dt
        if (this.t > this.period) {
            this.t = 0
            this.amp = this.amp * 0.9 // amplitude decays exponentially
        }
        this.overflowHeight = this.meanHeight + this.amp * Math.sin(2 * this.t) * Math.sin(2 * this.t)
    }
}

export default Surface