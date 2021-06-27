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
        this.onViewportChange = viewport => {
            this.bounds.width = viewport.width
            this.bounds.height = viewport.height
        }
        this.viewport = viewport
        viewport.on("change", this.onViewportChange)
        this.focus()
    }
    intersects(node) {
        // if the node is either the root or just a container (meaning it doesn't have explicit bounds) return true
        if (node === this || (!node.width && !node.height && !node.hitbox)) {
            return true
        }
        const intersects = aabb(rectBounds(node), this.bounds)
        return intersects
    }
    setSubject(subject) {
        if (!subject) { return }
        this.subject = subject
        this.offset = calcCenter(subject)
        this.focus()
    }
    focus() {
        if (!this.subject) { return }

        this.pos.x = (-clamp(0, this.world.width - this.bounds.width, this.subject.pos.x + this.offset.x - this.bounds.width / 2))
        this.pos.y = (-clamp(0, this.world.height - this.bounds.height, this.subject.pos.y + this.offset.y - this.bounds.height / 2))
    }
    update() {
        this.focus()
    }
    onRemove() {
        this.viewport.off(this.onViewportChange)
    }
}

export default Camera