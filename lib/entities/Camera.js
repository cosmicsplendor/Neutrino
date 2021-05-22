import { Node } from "@lib"
import { clamp } from "@lib/utils/math"
import { calcCenter } from "@lib/utils/entity"

class Camera extends Node {
    constructor({ subject, viewport, world = viewport, ...nodeProps }) {
        super({ ...nodeProps })
        this.setSubject(subject)
        this.width = viewport.width
        this.height = viewport.height
        this.world = world || viewport
        this.focus()
    }
    setSubject(subject) {
        if (!subject) {
            return
        }
        this.subject = subject
        this.offset = calcCenter(subject)
        this.focus()
    }
    focus() {
        if (!this.subject) {
            return
        }
        const { pos, subject, offset, world } = this

        pos.x = -clamp(0, world.width - this.width, subject.pos.x + offset.x - this.width / 2)
        pos.y = -clamp(0, world.height - this.height, subject.pos.y + offset.y - this.height / 2)
    }
    update() {
        this.focus()
    }
}

export default Camera