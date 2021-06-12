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
        this.smooth = false
        this.focus()
    }
    set viewport(viewport) {
        Object.assign(this.bounds, viewport)
    }
    intersects(node) {
        // if the node is either the root or just a container return true
        if (node === this || !node.width || !node.height) {
            return true
        }
        const intersects = aabb(rectBounds(node), this.bounds)
        node.visible = intersects
        return intersects
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

        pos.x = (-clamp(0, world.width - bounds.width, subject.pos.x + offset.x - bounds.width / 2))
        pos.y = (-clamp(0, world.height - bounds.height, subject.pos.y + offset.y - bounds.height / 2))
    }
    update() {
        this.focus()
    }
}

export default Camera