import { Node } from "@lib"
import { clamp, aabb } from "@utils/math"
import { calcCenter, rectBounds } from "@utils/entity"

class Camera extends Node {
    constructor({ subject, viewport, world, z = 1, lExt = 0, rExt = 0, ...nodeProps }) {
        super({ ...nodeProps })
        this.z = z
        this.pF = 1 / z // parallax factor is the multiplicative inverse of z-index
        this.bounds = {
            x: 0,
            y: 0,
            width: viewport.width,
            height: viewport.height,
        }
        this.lExt = lExt // leftward extension of camera's panning limit (the camera can now pan left upto x-coordinates equal to (0 + xExtL) instead of 0 previously)
        this.rExt = rExt 
        this.world = world || { width: viewport.width, height: viewport.height }
        this.onViewportChange = viewport => {
            this.bounds.width = viewport.width
            this.bounds.height = viewport.height
        }
        this.viewport = viewport
        this.setSubject(subject)
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

        this.pos.x = this.pF * (-clamp(0, this.world.width - this.bounds.width, this.subject.pos.x + this.offset.x - this.bounds.width / 2))
        this.pos.y = this.pF * (-clamp(0, this.world.height - this.bounds.height, this.subject.pos.y + this.offset.y - this.bounds.height / 2))
    }
    update() {
        this.focus()
    }
    onRemove() {
        this.viewport.off(this.onViewportChange)
    }
}

export default Camera