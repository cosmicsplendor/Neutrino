import { Node, math, utils } from "@lib"

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
        this.offset = utils.entity.center(subject)
    }
    focus() {
        if (!this.subject) {
            return
        }
        const { pos, subject, offset, world } = this

        pos.x = -math.clamp(0, world.width - this.width, subject.pos.x + offset.x - this.width / 2)
        pos.y = -math.clamp(0, world.height - this.height, subject.pos.y + offset.y - this.height / 2)
    }
    update() {
        this.focus()
    }
}

export default Camera