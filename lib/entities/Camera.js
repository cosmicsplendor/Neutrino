import { Node } from "@lib"
import { clamp, aabb } from "@utils/math"
import { calcCenter, rectBounds } from "@utils/entity"

class Camera extends Node {
    constructor({ subject, viewport, world = viewport, ...nodeProps }) {
        super({ ...nodeProps })
        this.setSubject(subject)
        this.bounds = {
            x: 0,
            y: 0,
            width: viewport.width,
            height: viewport.height,
        }
        this.world = world || viewport
        this.focus()
    }
    intersects(node) {
        if (node === this || !node.width || !node.height) {
            return true
        }
        return aabb(rectBounds(node), this.bounds)
    }
    setSubject(subject) {
        if (!subject) {
            return
        }
        subject.smooth = true
        this.subject = subject
        this.offset = calcCenter(subject)
        this.focus()
    }
    focus() {
        if (!this.subject) {
            return
        }
        const { pos, subject, offset, world, bounds } = this

        pos.x = Math.floor(-clamp(0, world.width - bounds.width, subject.pos.x + offset.x - bounds.width / 2))
        pos.y = Math.floor(-clamp(0, world.height - bounds.height, subject.pos.y + offset.y - bounds.height / 2))
    }
    update() {
        this.focus()
    }
}

export default Camera